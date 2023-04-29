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


import Component from './Component.js';
import U from '../../Core/Utilities.js';
const {
    merge
} = U;
import AST from '../../Core/Renderer/HTML/AST.js';

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
            elements: [],
            editableOptions:
                (Component.defaultOptions.editableOptions || []).concat(
                    [{
                        name: 'scaleElements',
                        type: 'toggle'
                    }]
                )
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
     * @returns
     * HTML component based on config from JSON.
     *
     * @internal
     */
    public static fromJSON(json: HTMLComponent.ClassJSON): HTMLComponent {
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
    constructor(options: Partial<HTMLComponent.HTMLComponentOptions>) {
        options = merge(
            HTMLComponent.defaultOptions,
            options
        );
        super(options);

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
        this.elements = this.options.elements ?
            this.options.elements.map(
                (element): AST.Node => (
                    typeof element === 'string' ?
                        new AST(element).nodes[0] :
                        element
                )) : [];

        this.constructTree();


        this.parentElement.appendChild(this.element);
        if (this.scaleElements) {
            this.autoScale();
        }
        this.emit({ type: 'afterLoad' });
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
    public update(options: Partial<HTMLComponent.HTMLComponentOptions>): this {
        super.update(options);
        this.emit({ type: 'afterUpdate' });
        return this;
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

    export interface HTMLComponentOptions extends Component.ComponentOptions, EditableOptions {
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
         */
        elements?: (AST.Node | string)[];
        type: 'HTML';
    }
    /** @internal */
    export interface EditableOptions extends Component.EditableOptions {
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
