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

import type CSSJSONObject from '../../CSSJSONObject';
import type { RendererElement, SelectFormFieldItem } from '../EditRenderer.js';

import { HTMLDOMElement } from '../../../Core/Renderer/DOMElementType.js';
import EditGlobals from '../EditGlobals.js';
import U from '../../../Core/Utilities.js';
import Menu from './Menu.js';
import EditRenderer from '../EditRenderer.js';

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
    };

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
        this.innerElement = this.setInnerElement();
    }

    /* *
    *
    *  Properties
    *
    * */
    public menu: Menu;
    public options: MenuItem.Options;
    public container: HTMLDOMElement;
    public innerElement?: HTMLDOMElement;
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

        return createElement(
            'div',
            { className: className },
            merge(
                this.options.style || {},
                // to remove
                this.isActive ? { display: 'block' } : {}
            ),
            this.menu.container
        );
    }

    public setInnerElement(): HTMLDOMElement|undefined {
        const item = this,
            options = item.options,
            callback = function (): void {
                if (options.events && options.events.click) {
                    options.events.click.apply(item, arguments);
                }
            };

        const collapsable = options.collapsable,
            parent = collapsable ?
                (EditRenderer.renderCollapse(
                    item.container,
                    options.text || ''
                ) as any).content :
                item.container,
            renderItem = EditRenderer.getRendererFunction(
                options.type as RendererElement
            );

        if (!renderItem) {
            return;
        }

        return renderItem(parent, this.getElementOptions(options, callback));
    }

    private getElementOptions(
        options: MenuItem.Options,
        callback?: () => void
    ): any {

        return {
            id: options.id,
            name: options.id,
            title: options.collapsable ? '' : options.text || '',
            callback,
            item: this,
            nestedOptions: options.nestedOptions,
            icon: options.icon,
            mousedown: options.events && options.events.onmousedown,
            value: options.value || '',
            onchange: options.events && options.events.change,
            items: options.items
        };
    }

    public update(): void {
        const item = this,
            options = item.options;

        if (options.events && options.events.update) {
            options.events.update.apply(item, arguments);
        }
    }

    public activate(): void {
        const item = this;

        item.update();

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
        nestedOptions?: Record<string, Options>;
        collapsable?: boolean;
        id: string;
        type?: 'addComponent'|'addLayout'|'horizontalSeparator'|'icon'|'input'|
        'toggle'|'text'|'textarea'|'verticalSeparator'|'select';
        text?: string;
        className?: string;
        events?: Record<Event['type'], Function>;
        style?: CSSJSONObject;
        icon?: string;
        isActive?: boolean;
        value?: string;
        items?: Array<string> | Array<SelectFormFieldItem>;
    }
}

export default MenuItem;
