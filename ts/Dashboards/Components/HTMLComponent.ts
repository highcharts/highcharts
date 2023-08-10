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

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Cell from '../Layout/Cell.js';

import AST from '../../Core/Renderer/HTML/AST.js';
import Component from './Component.js';
import U from '../../Core/Utilities.js';

const {
    merge,
    diffObjects
} = U;

// TODO: This may affect the AST parsing in Highcharts
// should look into adding these as options if possible
// Needs to go in a composition in the Highcharts plugin
AST.allowedTags = [
    ...AST.allowedTags,
    'option',
    'select',
    'label',
    'input',
    'textarea'
];
AST.allowedAttributes = [
    ...AST.allowedAttributes,
    'for', 'value', 'checked', 'src', 'name', 'selected'];
AST.allowedReferences = [...AST.allowedReferences, 'data:image/'];

/* *
 *
 *  Class
 *
 * */

/**
 *
 * Class that represents a HTML component.
 *
 */

class HTMLComponent extends Component {

    /* *
     *
     *  Static properties
     *
     * */

    /**
     * Default options of the HTML component.
     */
    public static defaultOptions = merge(
        Component.defaultOptions,
        {
            type: 'HTML',
            scaleElements: false,
            elements: []
        }
    );

    /* *
     *
     *  Static functions
     *
     * */

    /**
     * Creates component from JSON.
     *
     * @param json
     * Set of component options, used for creating the HTML component.
     *
     * @param cell
     * Instance of cell, where component is attached.
     *
     * @returns
     * HTML component based on config from JSON.
     *
     * @internal
     */
    public static fromJSON(
        json: HTMLComponent.ClassJSON,
        cell: Cell
    ): HTMLComponent {
        const options = json.options;
        const elements = (
            json.elements ?
                json.elements.map((el): AST.Node => JSON.parse(el)) :
                []
        );
        // const connector = (
        //     json.connector ? DataJSON.fromJSON(json.connector) : void 0
        // );

        const component = new HTMLComponent(
            cell,
            merge(
                options as any,
                {
                    elements
                    // connector: (
                    //   connector instanceof DataConnector ? connector : void 0
                    // )
                }
            )
        );

        component.emit({
            type: 'fromJSON',
            json
        });

        return component;
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Array of HTML elements, declared as string or node.
     */
    private elements: AST.Node[];
    /**
     * Enables auto-scaling of the elements inside the component.
     *
     * @internal
     */
    private scaleElements: boolean;
    /**
     * HTML component's options.
     */
    public options: HTMLComponent.HTMLComponentOptions;
    /**
     * Reference to sync component that allows to sync.
     *
     * @internal
     */
    public sync: Component['sync'];

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Creates a HTML component in the cell.
     *
     * @param options
     * The options for the component.
     */
    constructor(cell: Cell, options: Partial<HTMLComponent.HTMLComponentOptions>) {
        options = merge(
            HTMLComponent.defaultOptions,
            options
        );
        super(cell, options);

        this.options = options as HTMLComponent.HTMLComponentOptions;

        this.type = 'HTML';
        this.elements = [];
        this.scaleElements = !!this.options.scaleElements;
        this.sync = new Component.Sync(
            this,
            this.syncHandlers
        );

        this.on('tableChanged', (e: Component.EventTypes): void => {
            if ('detail' in e && e.detail && e.detail.sender !== this.id) {
                this.redraw();
            }
        });

        Component.addInstance(this);
    }


    /* *
     *
     *  Functions
     *
     * */

    /** @internal */
    public load(): this {
        this.emit({
            type: 'load'
        });
        super.load();
        const options = this.options;
        let isError = false;

        if (options.elements) {
            this.elements = options.elements.map(
                function (element): AST.Node {
                    if (typeof element === 'string') {
                        return new AST(element).nodes[0];
                    }

                    if (
                        !element.textContent &&
                        !element.tagName &&
                        element.attributes
                    ) {
                        isError = true;
                    }

                    return element;
                });
        }

        this.constructTree();

        this.parentElement.appendChild(this.element);

        if (this.scaleElements) {
            this.autoScale();
        }

        this.emit({ type: 'afterLoad' });

        if (isError) {
            throw new Error(
                'Missing tagName param in component: ' +
                options.cell
            );
        }

        return this;
    }

    /**
     * Handle scaling inner elements.
     *
     * @internal
     */
    public autoScale(): void {
        this.element.style.display = 'flex';
        this.element.style.flexDirection = 'column';

        this.contentElement.childNodes.forEach((element): void => {
            if (element && element instanceof HTMLElement) {
                element.style.width = 'auto';
                element.style.maxWidth = '100%';
                element.style.maxHeight = '100%';
                element.style.flexBasis = 'auto';
                element.style.overflow = 'auto';
            }
        });

        if (this.options.scaleElements) {
            this.scaleText();
        }
    }

    /**
     * Basic font size scaling
     *
     * @internal
     */
    public scaleText(): void {
        this.contentElement.childNodes.forEach((element): void => {
            if (element instanceof HTMLElement) {
                element.style.fontSize = Math.max(
                    Math.min(element.clientWidth / (1 * 10), 200), 20
                ) + 'px';
            }
        });
    }

    public render(): this {
        this.emit({ type: 'beforeRender' });
        super.render(); // Fires the render event and calls load
        this.emit({ type: 'afterRender' });
        return this;
    }

    public redraw(): this {
        super.redraw();
        this.constructTree();

        this.emit({ type: 'afterRedraw' });
        return this;
    }

    public resize(
        width?: number | string | null,
        height?: number | string | null
    ): this {
        if (this.scaleElements) {
            this.scaleText();
        }
        super.resize(width, height);
        return this;
    }

    /**
     * Handles updating via options.
     * @param options
     * The options to apply.
     *
     * @returns
     * The component for chaining.
     */
    public async update(options: Partial<HTMLComponent.HTMLComponentOptions>): Promise<void> {
        await super.update(options);
        this.emit({ type: 'afterUpdate' });
    }

    /**
     * Could probably use the serialize function moved on
     * the exportdata branch
     *
     * @internal
     */
    private constructTree(): void {
        // Remove old tree if redrawing
        while (this.contentElement.firstChild) {
            this.contentElement.firstChild.remove();
        }

        const parser = new AST(this.elements);
        parser.addToDOM(this.contentElement);
    }

    /**
     * Converts the class instance to a class JSON.
     *
     * @returns
     * Class JSON of this Component instance.
     *
     * @internal
     */
    public toJSON(): HTMLComponent.ClassJSON {
        const elements = (this.options.elements || [])
            .map((el): string => JSON.stringify(el));

        const json = merge(
            super.toJSON() as HTMLComponent.ClassJSON,
            {
                elements,
                options: this.options
            }
        );

        this.emit({
            type: 'toJSON',
            json
        });

        return json;
    }

    /**
     * Get the HTML component's options.
     * @returns
     * The JSON of HTML component's options.
     *
     * @internal
     *
     */
    public getOptions(): Partial<HTMLComponent.HTMLComponentOptions> {
        return {
            ...diffObjects(this.options, HTMLComponent.defaultOptions),
            type: 'HTML'
        };
    }
}


/* *
 *
 *  Class Namespace
 *
 * */

namespace HTMLComponent {

    /* *
    *
    *  Declarations
    *
    * */

    /** @internal */
    export type ComponentType = HTMLComponent;

    export interface HTMLComponentOptions extends Component.ComponentOptions {
        /**
         * Array of HTML elements, declared as string or node.
         * ```
         * Example:
         *
         * elements: [{
         *   tagName: 'img',
         *   attributes: {
         *       src: 'http://path.to.image'
         *   }
         * }]
         * ```
         *
         * Try it:
         *
         * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/html-component/single-element/ | HTML component with one image.}
         *
         * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/html-component/nested-elements/ | HTML component with nested images.}
         *
         */
        elements?: (AST.Node | string)[];
        type: 'HTML';
        /**
         * Enables auto-scaling of the elements inside the component.
         *
         * @internal
         */
        scaleElements?: boolean;
    }
    /** @internal */
    export interface HTMLComponentOptionsJSON extends Component.ComponentOptionsJSON {
        scaleElements?: boolean;
        type: 'HTML'
    }

    /** @internal */
    export type HTMLComponentEvents =
        Component.EventTypes | JSONEvent;

    /** @internal */
    export type JSONEvent = Component.Event<'toJSON' | 'fromJSON', {
        json: HTMLComponent.ClassJSON;
    }>;
    /** @internal */
    export interface ClassJSON extends Component.JSON {
        elements?: string[];
        events?: string[];
        options: HTMLComponentOptionsJSON;
    }
}

declare module './ComponentType' {
    interface ComponentTypeRegistry {
        HTML: typeof HTMLComponent;
    }
}

/* *
 *
 *  Default export
 *
 * */
export default HTMLComponent;
