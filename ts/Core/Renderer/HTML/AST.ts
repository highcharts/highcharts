/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../../Globals.js';
import U from '../../Utilities.js';
const {
    attr,
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
        'caption',
        'code',
        'div',
        'em',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'i',
        'img',
        'li',
        'ol',
        'p',
        'pre',
        'small',
        'span',
        'strong',
        'sub',
        'sup',
        'table',
        'tbody',
        'td',
        'th',
        'tr',
        'ul',
        '#text'
    ];

    public static allowedAttributes = [
        'class',
        'colspan',
        'href',
        'id',
        'src',
        'rowspan',
        'style'
    ];

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
                const textNode = item.textContent ?
                    H.doc.createTextNode(item.textContent) :
                    void 0;
                let node;

                if (item.tagName === '#text') {
                    node = textNode;

                } else if (item.tagName) {
                    node = H.doc.createElementNS(NS, item.tagName);
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
                    attr(node as any, attributes);

                    // Add text content
                    if (textNode) {
                        node.appendChild(textNode);
                    }

                    // Recurse
                    recurse(item.children || [], node);
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
            body = H.createElement('div');
            body.innerHTML = markup;
            doc = { body };
        } else {
            doc = new DOMParser().parseFromString(markup, 'text/html');
        }

        const validateDirective = (attrib: Attribute): boolean => {
            if (
                ['background', 'dynsrc', 'href', 'lowsrc', 'src']
                    .indexOf(attrib.name) !== -1
            ) {
                return /^(http|\/)/.test(attrib.value);
            }
            return true;
        };

        const validateChildNodes = (
            node: ChildNode,
            addTo: Highcharts.ASTNode[]
        ): void => {
            const tagName = node.nodeName.toLowerCase();

            // Add allowed tags
            if (AST.allowedTags.indexOf(tagName) !== -1) {
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

                // Add allowed attributes
                if (parsedAttributes) {
                    const attributes: Highcharts.SVGAttributes = {};
                    [].forEach.call(parsedAttributes, (attrib: Attribute): void => {
                        if (
                            AST.allowedAttributes
                                .indexOf(attrib.name) !== -1 &&
                            validateDirective(attrib)
                        ) {
                            attributes[attrib.name] = attrib.value;
                        }
                    });
                    astNode.attributes = attributes;
                }

                // Handle children
                if (node.childNodes.length) {
                    const children: Highcharts.ASTNode[] = [];
                    [].forEach.call(
                        node.childNodes,
                        (childNode: ChildNode): void => {
                            validateChildNodes(
                                childNode,
                                children
                            );
                        }
                    );
                    if (children.length) {
                        astNode.children = children;
                    }
                }

                addTo.push(astNode);
            }
        };

        [].forEach.call(
            doc.body.childNodes,
            (childNode): void => validateChildNodes(childNode, nodes)
        );

        if (body) {
            H.discardElement(body);
        }

        return nodes;
    }
}

export default AST;
