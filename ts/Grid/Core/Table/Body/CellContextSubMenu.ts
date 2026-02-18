/* *
 *
 *  Grid Cell Context Submenu
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *  Authors:
 *  - Mikkel Espolin Birkeland
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type TableCell from './TableCell';
import type { ContextMenu as ContextMenuType } from '../../UI/ContextMenu';
import type { CellContextMenuDividerItemOptions } from '../../Options';
import type {
    ResolvedCellContextMenuItemOptions
} from './CellContextMenuBuiltInActions';

import ContextMenu from '../../UI/ContextMenu.js';
import ContextMenuButton from '../../UI/ContextMenuButton.js';
import Globals from '../../Globals.js';
import Grid from '../../Grid.js';

/* *
 *
 *  Functions
 *
 * */

/**
 * Closes all sibling submenus for a menu level.
 *
 * @param menu
 * Parent menu level.
 *
 * @param activeButton
 * Button that should keep its submenu open.
 */
function closeSiblingSubMenus(
    menu: ContextMenuType,
    activeButton: ContextMenuButton
): void {
    for (const button of menu.buttons) {
        if (button === activeButton || !button.popup?.isVisible) {
            continue;
        }
        button.popup.hide();
    }
}

/**
 * Checks whether item is a divider.
 *
 * @param item
 * Resolved context menu item.
 *
 * @return
 * True when the item is a divider.
 */
function isDividerItem(
    item: ResolvedCellContextMenuItemOptions
): item is CellContextMenuDividerItemOptions {
    return 'separator' in item && item.separator === true;
}

/**
 * Closes the full chain of menus from current submenu to root.
 *
 * @param menu
 * Current menu in the chain.
 */
export function closeCellContextMenuTree(menu: ContextMenuType): void {
    let currentMenu: ContextMenuType | undefined = menu;

    while (currentMenu) {
        const parentMenu: ContextMenuType | undefined =
            currentMenu instanceof CellContextSubMenu ?
                currentMenu.openerButton?.contextMenu :
                void 0;

        currentMenu.hide();
        currentMenu = parentMenu;
    }
}

/**
 * Opens focused branch submenu if available.
 *
 * @param menu
 * Menu instance.
 */
export function openFocusedSubMenu(menu: ContextMenuType): void {
    const focusedButton = menu.buttons[menu.focusCursor];

    if (
        !focusedButton ||
        focusedButton.wrapper?.querySelector('button[disabled]')
    ) {
        return;
    }

    focusedButton.click();
}

/**
 * Renders resolved menu items into a context menu.
 *
 * @param menu
 * Menu to render items into.
 *
 * @param cell
 * Target table cell.
 *
 * @param items
 * Resolved menu items.
 */
export function renderResolvedCellContextMenuItems(
    menu: ContextMenuType,
    cell: TableCell,
    items: ResolvedCellContextMenuItemOptions[]
): void {
    for (const item of items) {
        if (isDividerItem(item)) {
            const container = menu.ensureItemsContainer();
            if (container) {
                const divider = document.createElement('li');
                divider.className = Globals.getClassName('menuDivider');
                container.appendChild(divider);
            }
            continue;
        }

        const isBranch = !!item.items?.length;

        const button = new ContextMenuButton({
            label: item.label,
            icon: item.icon,
            chevron: isBranch,
            onClick: (): void => {
                if (!button) {
                    return;
                }

                if (item.disabled) {
                    return;
                }

                if (isBranch) {
                    closeSiblingSubMenus(menu, button);

                    if (!button.popup) {
                        button.popup = new CellContextSubMenu(
                            menu.grid,
                            button,
                            cell,
                            item.items as ResolvedCellContextMenuItemOptions[]
                        );
                    }

                    if (!button.popup.isVisible) {
                        button.popup.show(button.wrapper);
                    }
                    return;
                }

                item.onClick?.call(cell, cell);
                closeCellContextMenuTree(menu);
            }
        }).add(menu);

        if (button && item.disabled) {
            button.wrapper?.querySelector('button')?.setAttribute(
                'disabled',
                ''
            );
        }
    }
}

/* *
 *
 *  Class
 *
 * */

class CellContextSubMenu extends ContextMenu {

    /**
     * Cell bound to this submenu chain.
     */
    public readonly cell: TableCell;

    /**
     * Resolved submenu items.
     */
    public readonly items: ResolvedCellContextMenuItemOptions[];

    /**
     * Branch button that opened this submenu.
     */
    public readonly openerButton: ContextMenuButton;

    /**
     * Builds a submenu anchored next to its parent button.
     *
     * @param grid
     * Grid instance.
     *
     * @param button
     * Parent branch button.
     *
     * @param cell
     * Target table cell.
     *
     * @param items
     * Submenu items.
     */
    constructor(
        grid: Grid,
        button: ContextMenuButton,
        cell: TableCell,
        items: ResolvedCellContextMenuItemOptions[]
    ) {
        super(grid, button, { nextToAnchor: true });
        this.cell = cell;
        this.items = items;
        this.openerButton = button;
    }

    protected override renderContent(): void {
        renderResolvedCellContextMenuItems(this, this.cell, this.items);
    }

    protected override onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            openFocusedSubMenu(this);
            return;
        }

        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            this.hide();
            this.openerButton.focus();
            return;
        }

        super.onKeyDown(event);
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default CellContextSubMenu;
