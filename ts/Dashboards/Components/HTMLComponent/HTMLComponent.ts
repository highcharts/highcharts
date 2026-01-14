/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

import type Cell from '../../Layout/Cell.js';
import type Options from './HTMLComponentOptions';

import AST from '../../../Core/Renderer/HTML/AST.js';
import Component from '../Component.js';
import HTMLComponentDefaults from './HTMLComponentDefaults.js';
import HTMLSyncs from './HTMLSyncs/HTMLSyncs.js';
import DU from '../../Utilities.js';
import U from '../../../Core/Utilities.js';
const {
    merge,
    diffObjects
} = U;
const { deepClone } = DU;

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
    'for',
    'value',
    'checked',
    'src',
    'name',
    'selected'
];
AST.allowedReferences = [
    ...AST.allowedReferences,
    'data:image/'
];

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
        HTMLComponentDefaults
    );

    /**
     * Predefined sync config for HTML component.
     */
    public static predefinedSyncConfig = HTMLSyncs;

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
     * HTML component's options.
     */
    public options: Options;


    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Creates a HTML component in the cell.
     *
     * @param cell
     * Instance of cell, where component is attached.
     *
     * @param options
     * The options for the component.
     */
    constructor(cell: Cell, options: Partial<Options>) {
        if (options.className) {
            options.className = `${HTMLComponent.defaultOptions.className} ${options.className}`;
        }

        options = merge(
            HTMLComponent.defaultOptions,
            options
        );
        super(cell, options);

        this.options = options as Options;

        this.type = 'HTML';
        this.elements = [];
    }


    /* *
     *
     *  Functions
     *
     * */

    /** @internal */
    public async load(): Promise<this> {
        this.emit({
            type: 'load'
        });
        await super.load();
        const options = this.options;
        let isError = false;

        if (options.elements?.length) {
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
        } else if (options.html) {
            this.elements = this.getElementsFromString(options.html);
            this.options.elements = this.elements;
        }

        this.constructTree();

        this.emit({ type: 'afterLoad' });

        if (isError) {
            throw new Error(
                `Missing tagName param in component: ${options.renderTo}`
            );
        }

        return this;
    }

    public render(): this {
        super.render();
        this.constructTree();
        this.sync.start();

        this.emit({ type: 'afterRender' });
        return this;
    }

    public resize(
        width?: number | string | null,
        height?: number | string | null
    ): this {
        super.resize(width, height);
        return this;
    }

    /**
     * Handles updating via options.
     *
     * @param options
     * The options to apply.
     */
    public async update(options: Partial<Options>, shouldRerender: boolean = true): Promise<void> {
        if (options.html) {
            this.elements = this.getElementsFromString(options.html);
            this.options.elements = this.elements;

            this.constructTree();
        } else if (options.elements) {
            this.elements = options.elements;
        }

        await super.update(options, shouldRerender);

        this.emit({ type: 'afterUpdate' });
    }

    public getOptionsOnDrop(): Partial<Options> {
        return {
            type: 'HTML',
            elements: [{
                tagName: 'span',
                textContent: '[Your custom HTML here- edit the component]'
            }]
        };
    }

    /**
     * Constructs the HTML tree.
     * @internal
     */
    private constructTree(): void {
        // Remove old tree if rerendering.
        while (this.contentElement.firstChild) {
            this.contentElement.firstChild.remove();
        }

        const parser = new AST(this.options.elements || []);
        parser.addToDOM(this.contentElement);
    }

    /**
     * When HTML definition is a string, it needs to be parsed to AST.
     *
     * @internal
     */
    private getElementsFromString(htmlString: string): AST.Node[] {
        return new AST(htmlString).nodes;
    }

    /**
     * Get the HTML component's options.
     * @returns
     * HTML component's options.
     *
     * @internal
     *
     */
    public getOptions(): Partial<Options> {
        return {
            ...diffObjects(this.options, HTMLComponent.defaultOptions),
            type: 'HTML'
        };
    }

    /**
     * Retrieves editable options for the HTML component.
     */
    public getEditableOptions(): Options {
        return deepClone(this.options, ['editableOptions']);
    }

    /**
     * Get the value of the editable option by property path. Parse the elements
     * if the HTML options is not set.
     *
     * @param propertyPath
     * The property path of the option.
     */
    public getEditableOptionValue(
        propertyPath?: string[]
    ): number | boolean | undefined | string {
        if (!propertyPath) {
            return;
        }

        if (propertyPath[0] === 'html') {
            const result = this.getEditableOptions();

            if (!result.html && result.elements) {
                return this.getStringFromElements(result.elements);
            }

            return result[propertyPath[0]];
        }

        return super.getEditableOptionValue(propertyPath);
    }

    /**
     * Returns the HTML string from the given elements.
     *
     * @param elements
     * The array of elements to serialize.
     */
    private getStringFromElements(elements: AST.Node[]): string {
        let html = '';

        for (const element of elements) {
            html += this.serializeNode(element);
        }

        return html;
    }

    /**
     * Serializes the HTML node to string.
     *
     * @param node
     * The HTML node to serialize.
     */
    private serializeNode(node: AST.Node): string {
        if (!node.tagName || node.tagName === '#text') {
            // Text node
            return node.textContent || '';
        }

        const attributes = node.attributes;
        let html = `<${node.tagName}`;

        if (attributes) {
            for (const key in attributes) {
                if (Object.prototype.hasOwnProperty.call(attributes, key)) {
                    const value = attributes[key as keyof typeof attributes];
                    if (value !== void 0) {
                        html += ` ${key}="${value}"`;
                    }
                }
            }
        }

        html += '>';

        html += node.textContent || '';

        (node.children || []).forEach((child): void => {
            html += this.serializeNode(child);
        });

        html += `</${node.tagName}>`;
        return html;
    }

    /**
     * @internal
     */
    public onTableChanged(e: Component.EventTypes): void {
        if (e.detail?.sender !== this.id) {
            this.render();
        }
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

    /** @internal */
    export type HTMLComponentEvents = Component.EventTypes;
}

declare module '../ComponentType' {
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
