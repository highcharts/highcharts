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

import EditGlobals from '../EditGlobals.js';
import MenuItem from './MenuItem.js';

const MenuItemBindings: Record<string, MenuItem.Options> = {
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
        text: EditGlobals.lang.viewFullscreen,
        events: {
            click: function (this: MenuItem, e: PointerEvent): void {
                const fullScreen = this.menu.editMode.board.fullscreen;
                if (fullScreen) {
                    fullScreen.toggle();
                }
            }
        }
    }
};

export default MenuItemBindings;
