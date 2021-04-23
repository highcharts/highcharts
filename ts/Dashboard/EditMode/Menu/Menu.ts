import { HTMLDOMElement } from '../../../Core/Renderer/DOMElementType.js';
import EditGlobals from '../EditGlobals.js';
import U from '../../../Core/Utilities.js';
import MenuItem from './MenuItem.js';
import type { CSSJSONObject } from './../../../Data/DataCSSObject';

const {
    createElement,
    merge
} = U;

class Menu {
    /* *
    *
    *  Static Properties
    *
    * */

    public static items: Record<string, MenuItem.Options> = {
        horizontalSeparator: {
            id: 'horizontalSeparator',
            type: 'horizontalSeparator',
            text: '',
            className: EditGlobals.classNames.menuHorizontalSeparator
        },
        verticalSeparator: {
            id: 'verticalSeparator',
            type: 'verticalSeparator',
            text: '',
            className: EditGlobals.classNames.menuVerticalSeparator
        }
    }

    /* *
    *
    *  Constructor
    *
    * */
    constructor(
        parentElement: HTMLDOMElement,
        options: Menu.Options,
        parent?: any
    ) {
        this.parentElement = parentElement;
        this.isVisible = false;
        this.activeItems = [];
        this.options = options;
        this.items = {};

        if (parent) {
            this.parent = parent;
        }

        this.container = this.setContainer();
    }

    /* *
    *
    *  Properties
    *
    * */
    public parentElement: HTMLDOMElement;
    public options: Menu.Options;
    public container: HTMLDOMElement;
    public isVisible: boolean;
    public items: Record<string, MenuItem>;
    public activeItems: Array<MenuItem>;
    public parent: any;

    /* *
    *
    *  Functions
    *
    * */
    private setContainer(): HTMLDOMElement {
        return createElement(
            'div', {
                className: EditGlobals.classNames.menu +
                    ' ' + (this.options.className || '')
            },
            this.options.style || {},
            this.parentElement
        );
    }

    // itemsSchemas - default items definitions.
    public initItems(
        itemsSchemas: Record<string, MenuItem.Options>,
        activeItems?: boolean
    ): void {
        const menu = this,
            optionsItems = menu.options.items || [];

        let itemSchema,
            itemConfig,
            item,
            options;

        for (let i = 0, iEnd = optionsItems.length; i < iEnd; ++i) {
            itemConfig = optionsItems[i];
            itemSchema = typeof itemConfig === 'string' ? itemsSchemas[itemConfig] :
                itemConfig.id ? itemsSchemas[itemConfig.id] : {};

            options = typeof itemConfig === 'string' ?
                merge(itemSchema, { id: itemConfig }) :
                merge(itemSchema, itemConfig);

            if (options.id) {
                item = new MenuItem(menu, options);

                // Save initialized item.
                menu.items[item.options.id] = item;

                if (activeItems) {
                    item.activate();
                    menu.activeItems.push(item);
                }
            } else {
                // Error - defined item needs an id.
            }
        }
    }

    public setActiveItems(
        items: Array<string>
    ): void {
        const menu = this;

        let item;

        // Deactivate items.
        for (let i = 0, iEnd = menu.activeItems.length; i < iEnd; ++i) {
            if (items.indexOf(menu.activeItems[i].options.id) === -1) {
                menu.activeItems[i].deactivate();
            }
        }
        menu.activeItems.length = 0;

        for (let j = 0, jEnd = items.length; j < jEnd; ++j) {
            item = menu.items[items[j]];

            if (item) {
                // Activate item.
                if (!item.isActive) {
                    item.activate();
                } else {
                    item.update();
                }

                menu.activeItems.push(item);
            }
        }
    }

    public deactivateActiveItems(): void {
        const menu = this;

        for (let i = 0, iEnd = menu.activeItems.length; i < iEnd; ++i) {
            menu.activeItems[i].deactivate();
        }
    }

    public updateActiveItems(): void {
        const activeItems = this.activeItems;

        for (let i = 0, iEnd = activeItems.length; i < iEnd; ++i) {
            activeItems[i].update();
        }
    }

    public destroy(): void {
        this.activeItems.length = 0;
        this.container.remove();
        this.items = {};
        this.options = {};
    }
}

namespace Menu {
    export interface Options {
        items?: Array<MenuItem.Options|string>;
        enabled?: boolean;
        style?: CSSJSONObject;
        className?: string;
        itemsClassName?: string;
    }
}

export default Menu;
