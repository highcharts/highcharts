import { HTMLDOMElement } from '../../../Core/Renderer/DOMElementType.js';
import EditGlobals from '../EditGlobals.js';
import U from '../../../Core/Utilities.js';
import type { CSSJSONObject } from '../../../Data/DataCSSObject';
import Menu from './Menu.js';

const {
    createElement,
    merge
} = U;

class MenuItem {
    /* *
    *
    *  Static Properties
    *
    * */

    public static defaultOptions: MenuItem.Options = {
        type: ''
    }

    /* *
    *
    *  Constructor
    *
    * */
    constructor(
        menu: Menu,
        options: MenuItem.Options
    ) {
        this.menu = menu;
        this.isActive = false;
        this.options = merge(MenuItem.defaultOptions, options || {});

        this.setContainer();
    }

    /* *
    *
    *  Properties
    *
    * */
    public menu: Menu;
    public options: MenuItem.Options;
    public container?: HTMLDOMElement;
    public isActive: boolean;

    /* *
    *
    *  Functions
    *
    * */
    private setContainer(): void {
        const item = this,
            options = item.options;

        let className = EditGlobals.classNames.menuItem;

        if (item.menu.options.itemsClassName) {
            className += ' ' + item.menu.options.itemsClassName;
        }

        if (options.className) {
            className += ' ' + options.className;
        }

        item.container = createElement(
            'div', {
                textContent: options.icon ? '' : options.text,
                onclick: function (): void {
                    if (options.events && options.events.click) {
                        options.events.click.apply(item, arguments);
                    }
                },
                className: className
            },
            options.style || {},
            item.menu.container
        );

        if (options.icon) {
            (item.container.style as any)['background-image'] = 'url(' +
                options.icon + ')';

            if (options.type === 'destroy') {
                item.container.classList.add(EditGlobals.classNames.menuDestroy);
            }
        }
    }

    public activate(): void {
        const item = this;

        // Temp.
        if (item.container) {
            item.isActive = true;
            item.container.style.display = 'block';
        }
    }

    public deactivate(): void {
        const item = this;

        // Temp.
        if (item.container) {
            item.isActive = false;
            item.container.style.display = 'none';
        }
    }
}

namespace MenuItem {
    export interface Options {
        type: string;
        text?: string;
        className?: string;
        events?: Record<Event['type'], Function>;
        style?: CSSJSONObject;
        icon?: string;
    }
}

export default MenuItem;
