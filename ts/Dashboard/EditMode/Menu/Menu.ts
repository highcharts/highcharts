import { HTMLDOMElement } from '../../../Core/Renderer/DOMElementType.js';
import EditGlobals from '../EditGlobals.js';
import U from '../../../Core/Utilities.js';
import MenuItem from './MenuItem.js';
import type { CSSJSONObject } from './../../../Data/DataCSSObject';

const {
    createElement,
    css,
    merge
} = U;

abstract class Menu {
    /* *
    *
    *  Static Properties
    *
    * */

    public static items: Record<string, MenuItem.Options> = {
        horizontalSeparator: {
            type: 'horizontalSeparator',
            text: '',
            className: EditGlobals.classNames.editToolbarHorizontalSeparator
        },
        verticalSeparator: {
            type: 'verticalSeparator',
            text: '',
            className: EditGlobals.classNames.editToolbarVerticalSeparator
        }
    }

    /* *
    *
    *  Constructor
    *
    * */
    constructor(
        parentElement: HTMLDOMElement,
        options: Menu.Options
    ) {
        this.parentElement = parentElement;
        this.isVisible = false;
        this.activeItems = [];
        this.options = options;
        this.items = {};

        this.setContainer();
    }

    /* *
    *
    *  Properties
    *
    * */
    public parentElement: HTMLDOMElement;
    public options: Menu.Options;
    public container?: HTMLDOMElement;
    public isVisible: boolean;
    public items: Record<string, MenuItem>;
    public activeItems: Array<MenuItem>;

    /* *
    *
    *  Functions
    *
    * */
    private setContainer(): void {
        const menu = this;

        menu.container = createElement(
            'div', {
                className: EditGlobals.classNames.editToolbar +
                  ' ' + menu.options.className
            },
            this.options.style || {},
            menu.parentElement
        );
    }

    protected initItems(
        items: Record<string, MenuItem.Options>
    ): void {
        const menu = this,
            optionsItems = menu.options.items || [];

        let itemSchema,
            itemOptions,
            item;

        for (let i = 0, iEnd = optionsItems.length; i < iEnd; ++i) {
            itemOptions = optionsItems[i];
            itemSchema = typeof itemOptions === 'string' ? items[itemOptions] :
                itemOptions.type ? items[itemOptions.type] : {};

            item = new MenuItem(
                menu,
                typeof itemOptions === 'string' ?
                    merge(itemSchema, { type: itemOptions }) :
                    merge(itemSchema, itemOptions)
            );

            // Save initialized item.
            menu.items[item.options.type] = item;
        }
    }

    public updateActiveItems(
        items: Array<string>
    ): void {
        const menu = this;

        let item;

        // Deactivate items.
        for (let i = 0, iEnd = menu.activeItems.length; i < iEnd; ++i) {
            if (items.indexOf(menu.activeItems[i].options.type) === -1) {
                menu.activeItems[i].deactivate();
            }
        }
        menu.activeItems.length = 0;

        for (let j = 0, jEnd = items.length; j < jEnd; ++j) {
            item = menu.items[items[j]];

            // Activate item.
            if (!item.isActive) {
                item.activate();
            }

            menu.activeItems.push(item);
        }
    }

    public deactivateActiveItems(): void {
        const menu = this;

        for (let i = 0, iEnd = menu.activeItems.length; i < iEnd; ++i) {
            menu.activeItems[i].deactivate();
        }
    }

    public show(
        x: number,
        y: number,
        items?: Array<string>
    ): void {
        const menu = this;

        if (items) {
            menu.updateActiveItems(items);
        }

        if (menu.container) {
            css(menu.container, {
                left: x + 'px',
                top: y + 'px'
            });
        }

        menu.isVisible = true;
    }

    public hide(): void {
        const menu = this;

        if (menu.container) {
            css(menu.container, {
                left: '-9999px',
                top: '-9999px'
            });
        }

        menu.isVisible = false;
    }
}

namespace Menu {
    export interface Options {
        items?: Array<MenuItem.Options|string>;
        enabled?: boolean;
        style?: CSSJSONObject;
        className?: string;
    }
}

export default Menu;
