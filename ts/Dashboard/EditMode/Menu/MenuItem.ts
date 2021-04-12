import { HTMLDOMElement } from '../../../Core/Renderer/DOMElementType.js';
import EditGlobals from '../EditGlobals.js';
import U from '../../../Core/Utilities.js';
import type { CSSJSONObject } from '../../../Data/DataCSSObject';
import Menu from './Menu.js';
import EditRenderer from './../EditRenderer.js';
import type EditContextMenu from '../EditContextMenu.js';

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
        this.setChildComponent();
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
        const item = this,
            options = item.options;

        let className = EditGlobals.classNames.menuItem;

        if (item.menu.options.itemsClassName) {
            className += ' ' + item.menu.options.itemsClassName;
        }

        if (options.className) {
            className += ' ' + options.className;
        }

        const container = createElement(
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
            (container.style as any)['background-image'] = 'url(' +
                options.icon + ')';

            if (options.type === 'destroy') {
                container.classList.add(EditGlobals.classNames.menuDestroy);
            }
        }

        return container;
    }

    public setChildComponent(): void {
        const item = this;

        if (item.options.type === 'switcher') {
            EditRenderer.renderSwitcher(
                item.container,
                function (e: any): void {
                    (item.menu as EditContextMenu).editMode.onEditModeToggle(e.target);
                }
            );
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
