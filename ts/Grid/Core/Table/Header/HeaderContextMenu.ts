/* *
 *
 *  Grid Header Context Menu
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Column from '../Column';
import type Grid from '../../Grid';
import type HeaderCell from './HeaderCell';
import type { GridIconName } from '../../UI/SvgIcons';

import ContextMenu from '../../UI/ContextMenu.js';
import ContextMenuButton from '../../UI/ContextMenuButton.js';
import Globals from '../../Globals.js';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Runtime context handed to header context menu actions. It is kept separate
 * from the cell context menu one, so that neither menu constrains the other's
 * public types.
 */
export interface HeaderContextMenuContext {

    /**
     * The header cell the menu was opened on.
     */
    cell: HeaderCell;

    /**
     * The column the header cell represents.
     */
    column: Column;

    /**
     * Grid column id.
     */
    columnId: string;

    /**
     * The Grid instance.
     */
    grid: Grid;

    /**
     * Source column id the Grid column reads its data from.
     */
    sourceColumnId?: string;
}

/**
 * Behavior of one header context menu action.
 */
export interface HeaderContextMenuActionDefinition {

    /**
     * Returns the label of the action.
     */
    getLabel: (context: HeaderContextMenuContext) => string;

    /**
     * Icon shown next to the label.
     */
    icon: GridIconName;

    /**
     * Returns whether the action applies to the context at all. A hidden
     * action is left out of the menu.
     */
    isVisible?: (context: HeaderContextMenuContext) => boolean;

    /**
     * Returns whether the action is shown but cannot be used.
     */
    isDisabled?: (context: HeaderContextMenuContext) => boolean;

    /**
     * Runs the action.
     */
    onClick: (context: HeaderContextMenuContext) => void;
}

/**
 * Options for the header context menu.
 */
export interface HeaderContextMenuOptions {

    /**
     * Whether the header context menu may open on this column. When disabled,
     * the native browser menu is left alone.
     *
     * @default true
     */
    enabled?: boolean;
}

interface ResolvedHeaderContextMenuItem {
    disabled: boolean;
    icon: GridIconName;
    label: string;
    onClick: () => void;
}

/* *
 *
 *  Constants
 *
 * */

// A plain list, since the menu has no item ordering option to resolve
// against. Give it ids when one is added.
const actionDefinitions: HeaderContextMenuActionDefinition[] = [];

/* *
 *
 *  Functions
 *
 * */

/**
 * Registers one header context menu action.
 *
 * @param definition
 * Action behavior definition.
 */
export function registerHeaderContextMenuAction(
    definition: HeaderContextMenuActionDefinition
): void {
    actionDefinitions.push(definition);
}

/**
 * Resolves the actions that apply to a header cell.
 *
 * @param cell
 * Header cell the menu would open on.
 *
 * @return
 * Menu items, empty when nothing applies.
 */
export function resolveHeaderContextMenuItems(
    cell: HeaderCell
): ResolvedHeaderContextMenuItem[] {
    const column = cell.column;

    if (
        !column ||
        column.options.header?.contextMenu?.enabled === false
    ) {
        return [];
    }

    const grid = cell.row.viewport.grid;
    const context: HeaderContextMenuContext = {
        cell,
        column,
        columnId: column.id,
        grid,
        sourceColumnId: grid.columnPolicy.getColumnSourceId(column.id)
    };
    const items: ResolvedHeaderContextMenuItem[] = [];

    for (const definition of actionDefinitions) {
        if (definition.isVisible && !definition.isVisible(context)) {
            continue;
        }

        items.push({
            disabled: !!definition.isDisabled?.(context),
            icon: definition.icon,
            label: definition.getLabel(context),
            onClick: (): void => definition.onClick(context)
        });
    }

    return items;
}

/* *
 *
 *  Class
 *
 * */

/**
 * Context menu of a column header cell.
 */
class HeaderContextMenu extends ContextMenu {

    /* *
     *
     *  Properties
     *
     * */

    /**
     * The header cell the menu is open on.
     */
    public cell?: HeaderCell;

    /**
     * Zero sized element the menu is anchored to, placed at the cursor.
     */
    private cursorAnchorElement?: HTMLElement;

    /**
     * Items rendered on the next `renderContent` call.
     */
    private items: ResolvedHeaderContextMenuItem[] = [];

    /* *
     *
     *  Methods
     *
     * */

    /**
     * Opens the menu at the cursor.
     *
     * @param cell
     * Header cell the menu belongs to.
     *
     * @param items
     * Items to render.
     *
     * @param clientX
     * Viewport X coordinate to anchor at.
     *
     * @param clientY
     * Viewport Y coordinate to anchor at.
     */
    public showAt(
        cell: HeaderCell,
        items: ResolvedHeaderContextMenuItem[],
        clientX: number,
        clientY: number
    ): void {
        const wrapper = this.grid.contentWrapper;

        if (!wrapper) {
            return;
        }

        this.cell = cell;
        this.items = items;

        // The menu takes the focus, so the cell needs its own marker to keep
        // showing which one the actions apply to.
        cell.htmlElement.classList.add(
            Globals.getClassName('contextMenuCell')
        );

        const rect = wrapper.getBoundingClientRect();
        const anchor = this.cursorAnchorElement = document.createElement('div');

        anchor.style.position = 'absolute';
        anchor.style.left = (clientX - rect.left) + 'px';
        anchor.style.top = (clientY - rect.top) + 'px';
        anchor.style.width = '0px';
        anchor.style.height = '0px';
        anchor.style.pointerEvents = 'none';
        wrapper.appendChild(anchor);

        super.show(anchor);
    }

    public override hide(): void {
        super.hide();
        this.cell?.htmlElement.classList.remove(
            Globals.getClassName('contextMenuCell')
        );
        this.cursorAnchorElement?.remove();
        delete this.cursorAnchorElement;
    }

    protected override renderContent(): void {
        for (const item of this.items) {
            const button = new ContextMenuButton({
                label: item.label,
                icon: item.icon,
                onClick: (): void => {
                    if (item.disabled) {
                        return;
                    }

                    this.hide();
                    item.onClick();
                }
            }).add(this);

            if (button && item.disabled) {
                button.wrapper?.querySelector('button')?.setAttribute(
                    'disabled',
                    ''
                );
            }
        }
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default HeaderContextMenu;
