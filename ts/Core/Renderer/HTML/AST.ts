/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type CSSObject from '../CSSObject';
import type HTMLAttributes from '../HTML/HTMLAttributes';
import type SVGAttributes from '../SVG/SVGAttributes';

import H from '../../Globals.js';
const {
    SVG_NS,
    win
} = H;
import {
    attr,
    createElement,
    css,
    isFunction,
    isString,
    objectEach,
    splat
} from '../../../Shared/Utilities.js';
import { error } from '../../Utilities.js';
const {
    trustedTypes
} = win;

/* *
 *
 *  Constants
 *
 * */

// Create the trusted type policy. This should not be exposed.
const trustedTypesPolicy = (
    trustedTypes &&
    isFunction(trustedTypes.createPolicy) &&
    trustedTypes.createPolicy(
        'highcharts', {
            createHTML: (s: string): string => s
        }
    )
);

const emptyHTML = trustedTypesPolicy ?
    trustedTypesPolicy.createHTML('') as unknown as string :
    '';

/* *
 *
 *  Functions
 *
 * */

/**
 * Decode the CSS escape sequences of a value, as `u\72 l(` and `url(` are
 * equivalent to the browser.
 *
 * @internal
 * @param {string} cssText
 * The CSS value or CSS text to decode.
 * @return {string}
 * The decoded CSS.
 */
function decodeCSS(cssText: string): string {
    return cssText.replace(
        /\\([\da-f]{1,6})[\t\n\f\r ]?|\\(.)/gi,
        (match, hex: string, char: string): string => {
            if (hex) {
                return String.fromCharCode(parseInt(hex, 16));
            }
            return char;
        }
    );
}

/**
 * Check the references of a CSS value or CSS text against
 * [allowedCSSReferences](Highcharts.AST#.allowedCSSReferences). Only `url()`,
 * `image-set()` and `@import` can make the browser load an external resource,
 * of which `@import` requires an opt-in.
 *
 * @internal
 * @param {string} cssText
 * The CSS value or CSS text to check.
 * @return {boolean}
 * Whether all references in the CSS are allowed.
 */
function isAllowedCSS(cssText: string): boolean {
    // Decoding is only needed when the CSS holds an escape sequence
    const css = cssText.indexOf('\\') === -1 ?
        cssText :
        decodeCSS(cssText);

    // The common case, a style with no references at all
    if (!/url\(|image-set\(|@import/i.test(css)) {
        return true;
    }

    // An `@import` loads a full style sheet, whose content is out of reach of
    // this filtering, so it is filtered out unless explicitly allowed
    if (
        /@import/i.test(css) &&
        AST.allowedCSSReferences.indexOf('@import') === -1
    ) {
        return false;
    }

    // Flagged from the replace callbacks below, as they cannot break early
    let allowed = true;

    const check = (reference: string): string => {
        const ref = reference
            .trim()
            .replace(/^["']|["']$/g, '')
            .trim()
            .toLowerCase();

        if (!AST.allowedCSSReferences.some((allowedRef): boolean =>
            ref.indexOf(allowedRef.toLowerCase()) === 0
        )) {
            allowed = false;
        }
        return '';
    };

    // The `url()` function, with or without quotes. Applied to the full text,
    // so that nested references like `image-set(url(...) 1x)` are included.
    css.replace(/url\(([^)]*)/gi, (match, ref: string): string => check(ref));

    // The string form of an allowed `@import`. The `url()` form is covered
    // above.
    css.replace(
        /@import\s*(["'][^"']*["'])/gi,
        (match, ref: string): string => check(ref)
    );

    // Inside `image-set()`, bare strings are references too
    css.replace(
        /image-set\(([^)]*)/gi,
        (match, content: string): string =>
            content.replace(/["'][^"']*["']/g, check)
    );

    return allowed;
}

/* *
 *
 *  Class
 *
 * */

/**
 * The AST class represents an abstract syntax tree of HTML or SVG content. It
 * can take HTML as an argument, parse it, optionally transform it to SVG, then
 * perform sanitation before inserting it into the DOM.
 *
 * @class
 * @name Highcharts.AST
 *
 * @param {string|Array<Highcharts.ASTNode>} source
 * Either an HTML string or an ASTNode list to populate the tree.
 */
class AST {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * The list of allowed SVG or HTML attributes, used for sanitizing
     * potentially harmful content from the chart configuration before adding to
     * the DOM.
     *
     * @see [Source code with default values](
     * https://github.com/highcharts/highcharts/blob/master/ts/Core/Renderer/HTML/AST.ts#:~:text=public%20static%20allowedAttributes)
     *
     * @example
     * // Allow a custom, trusted attribute
     * Highcharts.AST.allowedAttributes.push('data-value');
     *
     * @name Highcharts.AST.allowedAttributes
     * @type {Array<string>}
     */
    public static allowedAttributes = [
        'alt',
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
        'aria-sort',
        'class',
        'clip-path',
        'color',
        'colspan',
        'cx',
        'cy',
        'd',
        'disabled',
        'dx',
        'dy',
        'fill',
        'filterUnits',
        'flood-color',
        'flood-opacity',
        'height',
        'href',
        'id',
        'in',
        'in2',
        'markerHeight',
        'markerWidth',
        'offset',
        'opacity',
        'operator',
        'orient',
        'padding',
        'paddingLeft',
        'paddingRight',
        'patternUnits',
        'r',
        'radius',
        'refX',
        'refY',
        'result',
        'role',
        'rowspan',
        'scope',
        'slope',
        'src',
        'startOffset',
        'stdDeviation',
        'stop-color',
        'stop-opacity',
        'stroke-linecap',
        'stroke-width',
        'stroke',
        'style',
        'summary',
        'tabindex',
        'tableValues',
        'target',
        'text-align',
        'text-anchor',
        'textAnchor',
        'textLength',
        'title',
        'type',
        'valign',
        'width',
        'x',
        'x1',
        'x2',
        'xlink:href',
        'y',
        'y1',
        'y2',
        'zIndex'
    ];

    /**
     * The list of allowed references for CSS values that load external
     * resources, like `url()` and `image-set()`. Style declarations will only
     * be applied if their references start with one of these strings, which
     * by default are the ones that load nothing over the network.
     *
     * An `@import` is removed regardless of its reference, as the content of
     * the imported style sheet cannot be checked. Adding `'@import'` to the
     * list allows it.
     *
     * @see [Source code with default values](
     * https://github.com/highcharts/highcharts/blob/master/ts/Core/Renderer/HTML/AST.ts#:~:text=public%20static%20allowedCSSReferences)
     *
     * @see [Security](https://www.highcharts.com/docs/chart-concepts/security)
     *
     * @example
     * // Allow background images from a trusted host
     * Highcharts.AST.allowedCSSReferences.push('https://cdn.example.com/');
     *
     * @name    Highcharts.AST.allowedCSSReferences
     * @type    {Array<string>}
     * @since   next
     */
    public static allowedCSSReferences = [
        '#',
        'data:'
    ];

    /**
     * The list of allowed references for referring attributes like `href` and
     * `src`. Attribute values will only be allowed if they start with one of
     * these strings.
     *
     * @see [Source code with default values](
     * https://github.com/highcharts/highcharts/blob/master/ts/Core/Renderer/HTML/AST.ts#:~:text=public%20static%20allowedReferences)
     *
     * @example
     * // Allow tel:
     * Highcharts.AST.allowedReferences.push('tel:');
     *
     * @name    Highcharts.AST.allowedReferences
     * @type    {Array<string>}
     */
    public static allowedReferences = [
        'https://',
        'http://',
        'mailto:',
        '/',
        '../',
        './',
        '#'
    ];

    /**
     * The list of allowed SVG or HTML tags, used for sanitizing potentially
     * harmful content from the chart configuration before adding to the DOM.
     *
     * @see [Source code with default values](
     * https://github.com/highcharts/highcharts/blob/master/ts/Core/Renderer/HTML/AST.ts#:~:text=public%20static%20allowedTags)
     *
     * @example
     * // Allow a custom, trusted tag
     * Highcharts.AST.allowedTags.push('blink'); // ;)
     *
     * @name    Highcharts.AST.allowedTags
     * @type    {Array<string>}
     */
    public static allowedTags = [
        '#text',
        'a',
        'abbr',
        'b',
        'br',
        'button',
        'caption',
        'circle',
        'clipPath',
        'code',
        'dd',
        'defs',
        'div',
        'dl',
        'dt',
        'em',
        'feComponentTransfer',
        'feComposite',
        'feDropShadow',
        'feFlood',
        'feFuncA',
        'feFuncB',
        'feFuncG',
        'feFuncR',
        'feGaussianBlur',
        'feMerge',
        'feMergeNode',
        'feMorphology',
        'feOffset',
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
        'svg',
        'table',
        'tbody',
        'td',
        'text',
        'textPath',
        'th',
        'thead',
        'title',
        'tr',
        'tspan',
        'u',
        'ul'
    ];

    /** @internal */
    public static emptyHTML = emptyHTML;

    /**
     * Allow all custom SVG and HTML attributes, references and tags (together
     * with potentially harmful ones) to be added to the DOM from the chart
     * configuration. In other words, disable the allow-listing which is the
     * primary functionality of the AST.
     *
     * WARNING: Setting this property to `true` while allowing untrusted user
     * data in the chart configuration will expose your application to XSS
     * security risks!
     *
     * Note that in case you want to allow a known set of tags or attributes,
     * you should allow-list them instead of disabling the filtering totally.
     * See [allowedAttributes](Highcharts.AST#.allowedAttributes),
     * [allowedReferences](Highcharts.AST#.allowedReferences) and
     * [allowedTags](Highcharts.AST#.allowedTags). The `bypassHTMLFiltering`
     * setting is intended only for those cases where allow-listing is not
     * practical, and the chart configuration already comes from a secure
     * source.
     *
     * @example
     * // Allow all custom attributes, references and tags (disable DOM XSS
     * // filtering)
     * Highcharts.AST.bypassHTMLFiltering = true;
     *
     * @name Highcharts.AST.bypassHTMLFiltering
     * @static
     */
    public static bypassHTMLFiltering = false;

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Filter an object of SVG or HTML attributes against the allow list.
     *
     * @static
     *
     * @function Highcharts.AST#filterUserAttributes
     *
     * @param {Highcharts.SVGAttributes} attributes The attributes to filter
     *
     * @return {Highcharts.SVGAttributes}
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
                valid = isString(val) && AST.allowedReferences.some(
                    (ref): boolean => val.indexOf(ref) === 0
                );
            }
            if (!valid) {
                error(33, false, void 0, {
                    'Invalid attribute in config': `${key}`
                });
                delete attributes[key];
            }

            // #17753, < is not allowed in SVG attributes
            if (isString(val) && attributes[key]) {
                attributes[key] = val.replace(/</g, '&lt;') as any;
            }
        });
        return attributes;
    }

    /**
     * Filter an object of CSS declarations against the allow list, so that
     * styles from the chart configuration load no external resources.
     *
     * @internal
     * @param {Highcharts.CSSObject} styles
     * The styles to filter.
     * @return {Highcharts.CSSObject}
     * The filtered styles.
     */
    public static filterUserStyles(styles: CSSObject): CSSObject {
        objectEach(styles, (val, key): void => {
            if (isString(val) && !isAllowedCSS(val)) {
                error(33, false, void 0, {
                    'Invalid style in config': `${key}`
                });
                delete (styles as any)[key];
            }
        });
        return styles;
    }

    /**
     * Utility function to parse a style string to a CSSObject.
     *
     * @internal
     * @param {string} style
     * The style string to parse.
     * @return {Highcharts.CSSObject}
     * The parsed CSSObject.
     */
    public static parseStyle(style: string): CSSObject {
        return style
            .split(';')
            .reduce((styles, line): CSSObject => {
                const pair = line.split(':').map((s): string => s.trim()),
                    key = pair.shift();

                if (key && pair.length) {
                    (styles as any)[key.replace(
                        /-([a-z])/g,
                        (g): string => g[1].toUpperCase()
                    )] = pair.join(':'); // #17146
                }
                return styles;
            }, {} as CSSObject);
    }

    /**
     * Utility function to set html content for an element by passing in a
     * markup string. The markup is safely parsed by the AST class to avoid
     * XSS vulnerabilities. This function should be used instead of setting
     * `innerHTML` in all cases where the content is not fully trusted.
     *
     * @static
     * @function Highcharts.AST#setElementHTML
     *
     * @param {SVGDOMElement|HTMLDOMElement} el
     * Node to set content of.
     *
     * @param {string} html
     * Markup string
     */
    public static setElementHTML(el: Element, html: string): void {
        el.innerHTML = AST.emptyHTML; // Clear previous
        if (html) {
            const ast = new AST(html);
            ast.addToDOM(el);
        }
    }

    /* *
     *
     *  Constructor
     *
     * */

    // Construct an AST from HTML markup, or wrap an array of existing AST nodes
    constructor(source: (string|Array<AST.Node>)) {
        this.nodes = typeof source === 'string' ?
            this.parseMarkup(source) : source;
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * List of the nodes of this tree, can be modified before adding the tree to
     * the DOM.
     */
    public nodes: Array<AST.Node>;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Add the tree defined as a hierarchical JS structure to the DOM
     *
     * @function Highcharts.AST#addToDOM
     *
     * @param {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement} parent
     * The node where it should be added
     *
     * @return {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement}
     * The inserted node.
     */
    public addToDOM(
        parent: Element
    ): HTMLElement|SVGElement {

        /**
         * @internal
         * @param {Highcharts.ASTNode} subtree
         * HTML/SVG definition.
         * @param {Element} [subParent]
         * Parent node.
         * @return {Highcharts.SVGDOMElement|Highcharts.HTMLDOMElement}
         * The inserted node.
         */
        function recurse(
            subtree: (AST.Node|Array<AST.Node>),
            subParent: Element
        ): SVGElement|HTMLElement {
            let ret: any;

            splat(subtree).forEach(function (
                item: AST.Node
            ): void {
                const tagName = item.tagName;
                const textNode = item.textContent ?
                    H.doc.createTextNode(item.textContent) :
                    void 0;
                // Whether to ignore the AST filtering totally, #15345
                const bypassHTMLFiltering = AST.bypassHTMLFiltering;
                let node: Text|Element|undefined;

                if (tagName) {
                    if (tagName === '#text') {
                        node = textNode;

                    } else if (
                        AST.allowedTags.indexOf(tagName) !== -1 ||
                        bypassHTMLFiltering
                    ) {
                        const NS = tagName === 'svg' ?
                            SVG_NS :
                            (subParent.namespaceURI || SVG_NS);

                        const element = H.doc.createElementNS(NS, tagName);
                        const attributes = item.attributes || {};

                        // Apply attributes from root of AST node, legacy from
                        // from before TextBuilder
                        objectEach(item, function (val, key): void {
                            if (
                                key !== 'tagName' &&
                                key !== 'attributes' &&
                                key !== 'children' &&
                                key !== 'style' &&
                                key !== 'textContent'
                            ) {
                                (attributes as any)[key] = val;
                            }
                        });
                        attr(
                            element as any,
                            bypassHTMLFiltering ?
                                attributes :
                                AST.filterUserAttributes(attributes)
                        );

                        if (item.style) {
                            css(
                                element as any,
                                bypassHTMLFiltering ?
                                    item.style :
                                    AST.filterUserStyles(item.style)
                            );
                        }

                        // A style element may load external resources
                        // through its CSS text, so it is filtered like style
                        // declarations. The text is its own when the node
                        // comes from the options, and that of child text
                        // nodes when it comes from markup.
                        const cssText = tagName === 'style' ?
                            (item.textContent || '') +
                                (item.children || []).map(
                                    (child): string => child.textContent || ''
                                ).join('') :
                            '';

                        if (
                            cssText &&
                            !bypassHTMLFiltering &&
                            !isAllowedCSS(cssText)
                        ) {
                            error(33, false, void 0, {
                                'Invalid CSS in config': `${tagName}`
                            });

                        } else {
                            // Add text content
                            if (textNode) {
                                element.appendChild(textNode);
                            }

                            // Recurse
                            recurse(item.children || [], element);
                        }

                        node = element;

                    } else {
                        error(33, false, void 0, {
                            'Invalid tagName in config': tagName
                        });
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
     * Parse HTML/SVG markup into AST Node objects. Used internally from the
     * constructor.
     *
     * @internal
     * @param {string} markup
     * The markup string.
     * @return {Array<Highcharts.ASTNode>}
     * The parsed nodes.
     */
    private parseMarkup(markup: string): Array<AST.Node> {
        interface Attribute {
            name: (keyof SVGAttributes|keyof HTMLAttributes);
            value: string;
        }

        const nodes: Array<AST.Node> = [];

        markup = markup
            .trim()
            // The style attribute throws a warning when parsing when CSP is
            // enabled (#6884), so use an alias and pick it up below
            // Make all quotation marks parse correctly to DOM (#17627)
            .replace(/ style=(["'])/g, ' data-style=$1');

        let doc;
        try {
            doc = new DOMParser().parseFromString(
                trustedTypesPolicy ?
                    trustedTypesPolicy.createHTML(markup) as unknown as string :
                    markup,
                'text/html'
            );
        } catch {
            // There are two cases where this fails:
            // 1. IE9 and PhantomJS, where the DOMParser only supports parsing
            //    XML
            // 2. Due to a Chromium issue where chart redraws are triggered by
            //    a `beforeprint` event (#16931),
            //    https://issues.chromium.org/issues/40222135
        }

        if (!doc) {
            const body = createElement('div');
            body.innerHTML = markup;
            doc = { body };
        }

        const appendChildNodes = (
            node: ChildNode,
            addTo: Array<AST.Node>
        ): void => {
            // Preserve the camelCase of SVG tags via localName (#24702).
            const tagName = (node as Element).localName ||
                node.nodeName.toLowerCase();

            // Add allowed tags
            const astNode: AST.Node = {
                tagName
            };
            if (tagName === '#text') {
                astNode.textContent = node.textContent || '';
            }
            const parsedAttributes = (node as any).attributes;

            // Add attributes
            if (parsedAttributes) {
                const attributes: HTMLAttributes&SVGAttributes = {};
                [].forEach.call(parsedAttributes, (attrib: Attribute): void => {
                    if (attrib.name as string === 'data-style') {
                        astNode.style = AST.parseStyle(attrib.value);
                    } else {
                        attributes[attrib.name] = attrib.value;
                    }
                });
                astNode.attributes = attributes;
            }

            // Handle children
            if (node.childNodes.length) {
                const children: Array<AST.Node> = [];
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

        return nodes;
    }
}

/* *
 *
 *  Class Namespace
 *
 * */

namespace AST {

    /* *
     *
     *  Declarations
     *
     * */

    /**
     * Serialized form of an SVG/HTML definition, including children.
     */
    export interface Node {
        attributes?: (HTMLAttributes&SVGAttributes);
        children?: Array<Node>;
        style?: CSSObject;
        tagName?: string;
        textContent?: string;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default AST;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * Serialized form of an SVG/HTML definition, including children.
 *
 * @interface Highcharts.ASTNode
 *//**
 * @name Highcharts.ASTNode#attributes
 * @type {Highcharts.SVGAttributes|undefined}
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

(''); // Keeps doclets above in file
