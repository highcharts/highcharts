/* *
 *
 *  (c) 2009 - 2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sebastian Bochan
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *
 * */

import type EditContextMenu from '../EditContextMenu';

import EditGlobals from '../EditGlobals.js';
import MenuItem from './MenuItem.js';

const MenuItemBindings: Record<string, Partial<MenuItem.Options>> = {
    /* *
    *
    *  Context menu
    *
    * */
    horizontalSeparator: {
        id: 'horizontalSeparator',
        type: 'horizontalSeparator',
        className: EditGlobals.classNames.menuHorizontalSeparator
    },
    verticalSeparator: {
        id: 'verticalSeparator',
        type: 'verticalSeparator',
        className: EditGlobals.classNames.menuVerticalSeparator
    },
    viewFullscreen: {
        id: 'viewFullscreen',
        type: 'text',
        langKey: 'viewFullscreen',
        events: {
            click: function (this: MenuItem.Options, e: PointerEvent): void {
                const fullScreen = this.item?.menu.editMode.board.fullscreen;
                if (fullScreen) {
                    fullScreen.toggle();
                }
            }
        }
    },
    editMode: {
        id: 'editMode',
        type: 'toggle',
        getValue: function (item: MenuItem): boolean {
            return item.menu.editMode.isActive();
        },
        langKey: 'editMode',
        events: {
            click: function (this: MenuItem): void {
                (this.menu as EditContextMenu).editMode.onEditModeToggle();
            }
        }
    }
};

export default MenuItemBindings;
