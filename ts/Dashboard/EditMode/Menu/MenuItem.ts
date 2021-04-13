import { HTMLDOMElement } from '../../../Core/Renderer/DOMElementType.js';
import EditGlobals from '../EditGlobals.js';
import U from '../../../Core/Utilities.js';
import type { CSSJSONObject } from '../../../Data/DataCSSObject';
import Menu from './Menu.js';
import EditRenderer from './../EditRenderer.js';

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
        id: '',
        type: 'text'
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

        this.container = this.setContainer();
        this.setInnerElement();
    }

    /* *
    *
    *  Properties
    *
    * */
    public menu: Menu;
    public options: MenuItem.Options;
    public container: HTMLDOMElement;
    public isActive: boolean;

    /* *
    *
    *  Functions
    *
    * */
    private setContainer(): HTMLDOMElement {
        return createElement(
            'div',
            { className: EditGlobals.classNames.menuItem },
            this.options.style || {},
            this.menu.container
        );
    }

    public setInnerElement(): void {
        const item = this,
            options = item.options,
            callback = function (): void {
                if (options.events && options.events.click) {
                    options.events.click.apply(item, arguments);
                }
            };

        let element;

        if (item.options.type === 'switcher') {
            element = EditRenderer.renderSwitcher(
                item.container,
                callback
            );
        } else if (item.options.type === 'icon' && options.icon) {
            element = EditRenderer.renderIcon(
                item.container,
                options.icon,
                callback
            );
        } else {
            element = EditRenderer.renderText(
                item.container,
                options.text || '',
                callback
            );
        }

        if (element) {
            if (item.menu.options.itemsClassName) {
                element.classList.add(item.menu.options.itemsClassName);
            }

            if (options.className) {
                element.classList.add(options.className);
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
        id: string;
        type?: string;
        text?: string;
        className?: string;
        events?: Record<Event['type'], Function>;
        style?: CSSJSONObject;
        icon?: string;
    }
}

export default MenuItem;
