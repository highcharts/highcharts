import EditGlobals from '../EditGlobals.js';
import MenuItem from './MenuItem.js';

const MenuItemBindings: MenuItemBindings = {
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
            click: function (this: MenuItem, e: any): void {
                // eslint-disable-next-line no-console
                console.log(this);
            }
        }
    }
};

export interface MenuItemBindings {
    horizontalSeparator: MenuItem.Options;
    verticalSeparator: MenuItem.Options;
    viewFullscreen: MenuItem.Options;
}

export default MenuItemBindings;
