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
import type { RendererElement, SelectFormFieldItemOptions } from '../EditRenderer.js';

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

    public static defaultOptions: Partial<MenuItem.Options> = {
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
            { className: className || '' },
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
            container = item.container;

        const renderItem = EditRenderer.getRendererFunction(
            options.type as RendererElement
        );

        if (!renderItem) {
            return;
        }

        const value = this.options.getValue && this.options.getValue(item);
        const callback = function (): void {
            if (options.events && options.events.click) {
                options.events.click.apply(item, arguments);
            }
        };
        const element = renderItem(
            container,
            this.getElementOptions(merge(options, { value }), callback)
        );

    }

    private getElementOptions(
        options: MenuItem.Options,
        callback?: Function
    ): MenuItem.Options {

        return {
            id: options.id,
            name: options.id,
            title: options.collapsable ? '' : options.text || '',
            item: this,
            icon: options.icon,
            mousedown: options.events && options.events.onmousedown,
            click: options.events && options.events.click,
            value: options.value || '',
            onchange: callback,
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
        callback?: () => void;
        click?: Function;
        collapsable?: boolean;
        id: string;
        name?: string;
        type?: 'addComponent'|'addLayout'|'horizontalSeparator'|'icon'|'input'|
        'toggle'|'text'|'textarea'|'verticalSeparator'|'select';
        text?: string;
        getValue?: (item: MenuItem) => string | number | boolean;
        className?: string;
        events?: Record<Event['type'], Function>;
        mousedown?: Function;
        onchange?: Function;
        item?: MenuItem;
        style?: CSSJSONObject;
        icon?: string;
        isActive?: boolean;
        title?: string;
        value?: string;
        items?: Array<string> | Array<SelectFormFieldItemOptions>;
    }
}

export default MenuItem;
