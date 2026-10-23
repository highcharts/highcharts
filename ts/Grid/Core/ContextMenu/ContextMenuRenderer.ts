/* *
 *
 *  Grid Context Menu renderer
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *  Authors:
 *  - Mikkel Espolin Birkeland
 *  - Dawid Dragula
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Grid from '../Grid';
import type { MenuContext } from './ContextMenuTarget';
import type { ResolvedMenuItem } from './ContextMenuResolver';

import Globals from '../Globals.js';
import GridUtils from '../GridUtils.js';
import Menu from '../UI/Menu.js';
import MenuButton from '../UI/MenuButton.js';

const { makeHTMLElement } = GridUtils;

/* *
 *
 *  Functions
 *
 * */

/**
 * Closes all sibling submenus of a menu level.
 *
 * @param menu
 * Parent menu level.
 *
 * @param activeButton
 * Button that should keep its submenu open.
 */
function closeSiblingSubMenus(menu: Menu, activeButton: MenuButton): void {
    for (const button of menu.buttons) {
        if (button === activeButton || !button.popup?.isVisible) {
            continue;
        }

        button.popup.hide();
    }
}

/**
 * Closes the full chain of menus from the current submenu up to the root.
 *
 * @param menu
 * Current menu in the chain.
 */
function closeMenuTree(menu: Menu): void {
    let currentMenu: Menu | undefined = menu;

    while (currentMenu) {
        const parentMenu: Menu | undefined =
            currentMenu instanceof ContextSubMenu ?
                currentMenu.openerButton?.menu :
                void 0;

        currentMenu.hide();
        currentMenu = parentMenu;
    }
}

/**
 * Opens the submenu of the focused branch, when there is one.
 *
 * @param menu
 * Menu instance.
 */
export function openFocusedSubMenu(menu: Menu): void {
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
 * Renders resolved entries into a menu.
 *
 * @param menu
 * Menu to render the entries into.
 *
 * @param context
 * Context the menu was opened in.
 *
 * @param items
 * Resolved entries.
 */
export function renderMenuItems(
    menu: Menu,
    context: MenuContext,
    items: ResolvedMenuItem[]
): void {
    for (const item of items) {
        if (item.separator) {
            const container = menu.ensureItemsContainer();

            if (container) {
                makeHTMLElement('li', {
                    className: Globals.getClassName('menuDivider')
                }, container);
            }
            continue;
        }

        const isBranch = !!item.items?.length;

        let subMenu: ContextSubMenu | undefined;

        const openSubMenu = (button: MenuButton): ContextSubMenu => {
            closeSiblingSubMenus(menu, button);

            if (!subMenu) {
                subMenu = button.popup = new ContextSubMenu(
                    menu.grid,
                    button,
                    context,
                    item.items || []
                );
            }

            if (!subMenu.isVisible) {
                subMenu.show(button.wrapper);
            }

            return subMenu;
        };

        const button: MenuButton | undefined = new MenuButton({
            label: item.label,
            icon: item.icon,
            chevron: isBranch,
            onClick: (): void => {
                if (!button || item.disabled) {
                    return;
                }

                if (isBranch) {
                    // Clicking the button focuses it, which takes the focus
                    // back out of a submenu a hover had already opened.
                    openSubMenu(button).buttons[0]?.focus();
                    return;
                }

                item.onClick?.();
                closeMenuTree(menu);
            },
            onHover: (): void => {
                // The branch already showing is the one the pointer is on.
                if (!button || item.disabled || button.popup?.isVisible) {
                    return;
                }

                const focused = document.activeElement as HTMLElement | null;

                closeSiblingSubMenus(menu, button);

                if (isBranch) {
                    openSubMenu(button);
                }

                // A hover is none of the keyboard's business: opening a menu
                // focuses its first item and closing one leaves the focus
                // nowhere, so it goes back where it was.
                if (focused?.isConnected) {
                    focused.focus();
                } else {
                    button.focus();
                }
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

/**
 * One nested level of a context menu.
 */
class ContextSubMenu extends Menu {

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Context the menu chain was opened in.
     */
    public readonly context: MenuContext;

    /**
     * Resolved entries of this level.
     */
    public readonly items: ResolvedMenuItem[];

    /**
     * Branch button that opened this submenu.
     */
    public readonly openerButton: MenuButton;

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Builds a submenu anchored next to its parent button.
     *
     * @param grid
     * Grid instance.
     *
     * @param button
     * Parent branch button.
     *
     * @param context
     * Context the menu chain was opened in.
     *
     * @param items
     * Resolved entries of this level.
     */
    constructor(
        grid: Grid,
        button: MenuButton,
        context: MenuContext,
        items: ResolvedMenuItem[]
    ) {
        super(grid, button, { nextToAnchor: true });
        this.context = context;
        this.items = items;
        this.openerButton = button;
    }

    /* *
     *
     *  Methods
     *
     * */

    protected override renderContent(): void {
        renderMenuItems(this, this.context, this.items);
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
