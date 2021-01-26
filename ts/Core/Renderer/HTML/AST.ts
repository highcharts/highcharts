/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type SVGAttributes from '../SVG/SVGAttributes';

import H from '../../Globals.js';
import U from '../../Utilities.js';
const {
    attr,
    createElement,
    discardElement,
    error,
    objectEach,
    splat
} = U;

/**
 * Serialized form of an SVG/HTML definition, including children. Some key
 * property names are reserved: tagName, textContent, and children.
 *
 * @interface Highcharts.ASTNode
 *//**
 * @name Highcharts.ASTNode#[key:string]
 * @type {boolean|number|string|Array<Highcharts.ASTNode>|undefined}
 *//**
 * @name Highcharts.ASTNode#children
 * @type {Array<Highcharts.ASTNode>|undefined}
 *//**
 * @name Highcharts.ASTNode#tagName
 * @type {string|undefined}
 *//**
 * @name Highcharts.ASTNode#textContent
 * @type {string|undefined}
 */

''; // detach doclets above

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface ASTNode {
            attributes?: SVGAttributes;
            children?: Array<ASTNode>;
            tagName?: string;
            textContent?: string;
        }
    }
}

/**
 * Represents an AST
 * @private
 * @class
 * @name Highcharts.AST
 */
class AST {
    public static allowedTags = [
        'a',
        'b',
        'br',
        'button',
        'caption',
        'circle',
        'code',
        'div',
        'em',
        'feComponentTransfer',
        'feFuncA',
        'feFuncB',
        'feFuncG',
        'feFuncR',
        'feGaussianBlur',
        'feOffset',
        'feMerge',
        'feMergeNode',
        'filter',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'hr',
        'i',
        'img',
        'li',
        'linearGradient',
        'marker',
        'ol',
        'p',
        'path',
        'pattern',
        'pre',
        'rect',
        'small',
        'span',
        'stop',
        'strong',
        'style',
        'sub',
        'sup',
        'table',
        'text',
        'thead',
        'tbody',
        'tspan',
        'td',
        'th',
        'tr',
        'ul',
        '#text'
    ];

    public static allowedAttributes = [
        'aria-controls',
        'aria-describedby',
        'aria-expanded',
        'aria-haspopup',
        'aria-hidden',
        'aria-label',
        'aria-labelledby',
        'aria-live',
        'aria-pressed',
        'aria-readonly',
        'aria-roledescription',
        'aria-selected',
        'class',
        'color',
        'colspan',
        'cx',
        'cy',
        'd',
        'dx',
        'dy',
        'disabled',
        'fill',
        'height',
        'href',
        'id',
        'in',
        'markerHeight',
        'markerWidth',
        'offset',
        'opacity',
        'orient',
        'padding',
        'paddingLeft',
        'patternUnits',
        'r',
        'refX',
        'refY',
        'role',
        'scope',
        'slope',
        'src',
        'startOffset',
        'stdDeviation',
        'stroke',
        'stroke-linecap',
        'stroke-width',
        'style',
        'result',
        'rowspan',
        'summary',
        'tabindex',
        'text-align',
        'textAnchor',
        'textLength',
        'type',
        'valign',
        'width',
        'x',
        'x1',
        'xy',
        'y',
        'y1',
        'y2',
        'zIndex'
    ];

    /**
     * Filter attributes against the allow list.
     *
     * @private
     * @static
     *
     * @function Highcharts.AST#filterUserAttributes
     *
     * @param {SVGAttributes} attributes The attributes to filter
     *
     * @return {SVGAttributes}
     * The filtered attributes
     */
    public static filterUserAttributes(
        attributes: SVGAttributes
    ): SVGAttributes {
        objectEach(attributes, (val, key): void => {
            let valid = true;
            if (AST.allowedAttributes.indexOf(key) === -1) {
                valid = false;
            }
            if (
                ['background', 'dynsrc', 'href', 'lowsrc', 'src']
                    .indexOf(key) !== -1
            ) {
                valid = /^(http|\/)/.test(val);
            }
            if (!valid) {
                error(`Highcharts warning: Invalid attribute '${key}' in config`);
                delete attributes[key];
            }
        });
        return attributes;
    }

    /**
     * Utility function to set html content for an element by passing in a
     * markup string. The markup is safely parsed by the AST class to avoid
     * XSS vulnerabilities.
     *
     * @static
     *
     * @function Highcharts.AST#setElementHTML
     *
     * @param {SVGElement} el The node to set content of
     * @param {string} html The markup string
     */
    public static setElementHTML(el: Element, html: string): void {
        el.innerHTML = ''; // Clear previous
        if (html) {
            const ast = new AST(html);
            ast.addToDOM(el);
        }
    }

    // Public list of the nodes of this tree, can be modified before adding the
    // tree to the DOM.
    public nodes: Highcharts.ASTNode[];

    // Construct an AST from HTML markup, or wrap an array of existing AST nodes
    constructor(source: string|Highcharts.ASTNode[]) {
        this.nodes = typeof source === 'string' ?
            this.parseMarkup(source) : source;
    }

    /**
     * Add the tree defined as a hierarchical JS structure to the DOM
     *
     * @private
     *
     * @function Highcharts.AST#add
     *
     * @param {SVGElement} parent
     * The node where it should be added
     *
     * @return {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement}
     * The inserted node.
     */
    public addToDOM(parent: Element): HTMLElement|SVGElement {
        const NS = parent.namespaceURI || H.SVG_NS;

        /**
         * @private
         * @param {Highcharts.ASTNode} subtree - HTML/SVG definition
         * @param {Element} [subParent] - parent node
         * @return {Highcharts.SVGDOMElement|Highcharts.HTMLDOMElement} The inserted node.
         */
        function recurse(
            subtree: (
                Highcharts.ASTNode|
                Array<Highcharts.ASTNode>
            ),
            subParent: Element
        ): SVGElement|HTMLElement {
            let ret: any;

            splat(subtree).forEach(function (
                item: Highcharts.ASTNode
            ): void {
                const tagName = item.tagName;
                const textNode = item.textContent ?
                    H.doc.createTextNode(item.textContent) :
                    void 0;
                let node: Text|Element|undefined;

                if (tagName) {
                    if (tagName === '#text') {
                        node = textNode;

                    } else if (AST.allowedTags.indexOf(tagName) !== -1) {
                        const element = H.doc.createElementNS(NS, tagName);
                        const attributes = item.attributes || {};

                        // Apply attributes from root of AST node, legacy from
                        // from before TextBuilder
                        objectEach(item, function (val, key): void {
                            if (
                                key !== 'tagName' &&
                                key !== 'attributes' &&
                                key !== 'children' &&
                                key !== 'textContent'
                            ) {
                                attributes[key] = val;
                            }
                        });
                        attr(
                            element as any,
                            AST.filterUserAttributes(attributes)
                        );

                        // Add text content
                        if (textNode) {
                            element.appendChild(textNode);
                        }

                        // Recurse
                        recurse(item.children || [], element);
                        node = element;

                    } else {
                        error(`Highcharts warning: Invalid tagName '${tagName}' in config`);
                    }
                }

                // Add to the tree
                if (node) {
                    subParent.appendChild(node);
                }

                ret = node;
            });

            // Return last node added (on top level it's the only one)
            return ret;
        }

        return recurse(this.nodes, parent);
    }

    /**
     * Parse HTML/SVG markup into AST Node objects.
     *
     * @private
     *
     * @function Highcharts.AST#getNodesFromMarkup
     *
     * @param {string} markup The markup string.
     *
     * @return {Array<Highcharts.ASTNode>} The parsed nodes.
     */
    private parseMarkup(markup: string): Highcharts.ASTNode[] {
        interface Attribute {
            name: string;
            value: string;
        }

        const nodes: Highcharts.ASTNode[] = [];
        let doc;
        let body;
        if (
            // IE9 is only able to parse XML
            /MSIE 9.0/.test(navigator.userAgent) ||
            // IE8-
            typeof DOMParser === 'undefined'
        ) {
            body = createElement('div');
            body.innerHTML = markup;
            doc = { body };
        } else {
            doc = new DOMParser().parseFromString(markup, 'text/html');
        }

        const appendChildNodes = (
            node: ChildNode,
            addTo: Highcharts.ASTNode[]
        ): void => {
            const tagName = node.nodeName.toLowerCase();

            // Add allowed tags
            const astNode: Highcharts.ASTNode = {
                tagName
            };
            if (tagName === '#text') {
                const textContent = node.textContent || '';

                // Whitespace text node, don't append it to the AST
                if (/^[\s]*$/.test(textContent)) {
                    return;
                }

                astNode.textContent = textContent;
            }
            const parsedAttributes = (node as any).attributes;

            // Add attributes
            if (parsedAttributes) {
                const attributes: SVGAttributes = {};
                [].forEach.call(parsedAttributes, (attrib: Attribute): void => {
                    attributes[attrib.name] = attrib.value;
                });
                astNode.attributes = attributes;
            }

            // Handle children
            if (node.childNodes.length) {
                const children: Highcharts.ASTNode[] = [];
                [].forEach.call(
                    node.childNodes,
                    (childNode: ChildNode): void => {
                        appendChildNodes(childNode, children);
                    }
                );
                if (children.length) {
                    astNode.children = children;
                }
            }

            addTo.push(astNode);
        };

        [].forEach.call(
            doc.body.childNodes,
            (childNode): void => appendChildNodes(childNode, nodes)
        );

        if (body) {
            discardElement(body);
        }

        return nodes;
    }
}

export default AST;
