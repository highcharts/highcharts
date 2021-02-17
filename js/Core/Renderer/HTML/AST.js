/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
import H from '../../Globals.js';
var SVG_NS = H.SVG_NS;
import U from '../../Utilities.js';
var attr = U.attr, createElement = U.createElement, discardElement = U.discardElement, error = U.error, isString = U.isString, objectEach = U.objectEach, splat = U.splat;
/**
 * Serialized form of an SVG/HTML definition, including children.
 *
 * @interface Highcharts.ASTNode
 */ /**
* @name Highcharts.ASTNode#attributes
* @type {Highcharts.SVGAttributes|undefined}
*/ /**
* @name Highcharts.ASTNode#children
* @type {Array<Highcharts.ASTNode>|undefined}
*/ /**
* @name Highcharts.ASTNode#tagName
* @type {string|undefined}
*/ /**
* @name Highcharts.ASTNode#textContent
* @type {string|undefined}
*/
''; // detach doclets above
// In IE8, DOMParser is undefined. IE9 and PhantomJS are only able to parse XML.
var hasValidDOMParser = false;
try {
    hasValidDOMParser = Boolean(new DOMParser().parseFromString('', 'text/html'));
}
catch (e) { } // eslint-disable-line no-empty
/**
 * The AST class represents an abstract syntax tree of HTML or SVG content. It
 * can take HTML as an argument, parse it, optionally transform it to SVG, then
 * perform sanitation before inserting it into the DOM.
 *
 * @class
 * @name Highcharts.AST
 * @param {string|Highcharts.ASTNode[]} source
 *                                      Either an HTML string or an ASTNode list
 *                                      to populate the tree
 */
var AST = /** @class */ (function () {
    // Construct an AST from HTML markup, or wrap an array of existing AST nodes
    function AST(source) {
        this.nodes = typeof source === 'string' ?
            this.parseMarkup(source) : source;
    }
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
    AST.filterUserAttributes = function (attributes) {
        objectEach(attributes, function (val, key) {
            var valid = true;
            if (AST.allowedAttributes.indexOf(key) === -1) {
                valid = false;
            }
            if (['background', 'dynsrc', 'href', 'lowsrc', 'src']
                .indexOf(key) !== -1) {
                valid = isString(val) && AST.allowedReferences.some(function (ref) { return val.indexOf(ref) === 0; });
            }
            if (!valid) {
                error("Highcharts warning: Invalid attribute '" + key + "' in config");
                delete attributes[key];
            }
        });
        return attributes;
    };
    /**
     * Utility function to set html content for an element by passing in a
     * markup string. The markup is safely parsed by the AST class to avoid
     * XSS vulnerabilities. This function should be used instead of setting
     * `innerHTML` in all cases where the content is not fully trusted.
     *
     * @static
     *
     * @function Highcharts.AST#setElementHTML
     *
     * @param {SVGDOMElement|HTMLDOMElement} el The node to set content of
     * @param {string} html The markup string
     */
    AST.setElementHTML = function (el, html) {
        el.innerHTML = ''; // Clear previous
        if (html) {
            var ast = new AST(html);
            ast.addToDOM(el);
        }
    };
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
    AST.prototype.addToDOM = function (parent) {
        /**
         * @private
         * @param {Highcharts.ASTNode} subtree - HTML/SVG definition
         * @param {Element} [subParent] - parent node
         * @return {Highcharts.SVGDOMElement|Highcharts.HTMLDOMElement} The inserted node.
         */
        function recurse(subtree, subParent) {
            var ret;
            splat(subtree).forEach(function (item) {
                var tagName = item.tagName;
                var textNode = item.textContent ?
                    H.doc.createTextNode(item.textContent) :
                    void 0;
                var node;
                if (tagName) {
                    if (tagName === '#text') {
                        node = textNode;
                    }
                    else if (AST.allowedTags.indexOf(tagName) !== -1) {
                        var NS = tagName === 'svg' ?
                            SVG_NS :
                            (subParent.namespaceURI || SVG_NS);
                        var element = H.doc.createElementNS(NS, tagName);
                        var attributes_1 = item.attributes || {};
                        // Apply attributes from root of AST node, legacy from
                        // from before TextBuilder
                        objectEach(item, function (val, key) {
                            if (key !== 'tagName' &&
                                key !== 'attributes' &&
                                key !== 'children' &&
                                key !== 'textContent') {
                                attributes_1[key] = val;
                            }
                        });
                        attr(element, AST.filterUserAttributes(attributes_1));
                        // Add text content
                        if (textNode) {
                            element.appendChild(textNode);
                        }
                        // Recurse
                        recurse(item.children || [], element);
                        node = element;
                    }
                    else {
                        error("Highcharts warning: Invalid tagName '" + tagName + "' in config");
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
    };
    /**
     * Parse HTML/SVG markup into AST Node objects. Used internally from the
     * constructor.
     *
     * @private
     *
     * @function Highcharts.AST#getNodesFromMarkup
     *
     * @param {string} markup The markup string.
     *
     * @return {Array<Highcharts.ASTNode>} The parsed nodes.
     */
    AST.prototype.parseMarkup = function (markup) {
        var nodes = [];
        var doc;
        var body;
        if (hasValidDOMParser) {
            doc = new DOMParser().parseFromString(markup, 'text/html');
        }
        else {
            body = createElement('div');
            body.innerHTML = markup;
            doc = { body: body };
        }
        var appendChildNodes = function (node, addTo) {
            var tagName = node.nodeName.toLowerCase();
            // Add allowed tags
            var astNode = {
                tagName: tagName
            };
            if (tagName === '#text') {
                var textContent = node.textContent || '';
                // Whitespace text node, don't append it to the AST
                if (/^[\s]*$/.test(textContent)) {
                    return;
                }
                astNode.textContent = textContent;
            }
            var parsedAttributes = node.attributes;
            // Add attributes
            if (parsedAttributes) {
                var attributes_2 = {};
                [].forEach.call(parsedAttributes, function (attrib) {
                    attributes_2[attrib.name] = attrib.value;
                });
                astNode.attributes = attributes_2;
            }
            // Handle children
            if (node.childNodes.length) {
                var children_1 = [];
                [].forEach.call(node.childNodes, function (childNode) {
                    appendChildNodes(childNode, children_1);
                });
                if (children_1.length) {
                    astNode.children = children_1;
                }
            }
            addTo.push(astNode);
        };
        [].forEach.call(doc.body.childNodes, function (childNode) { return appendChildNodes(childNode, nodes); });
        if (body) {
            discardElement(body);
        }
        return nodes;
    };
    /**
     * The list of allowed SVG or HTML tags, used for sanitizing potentially
     * harmful content from the chart configuration before adding to the DOM.
     *
     * @example
     * // Allow a custom, trusted tag
     * Highcharts.AST.allowedTags.push('blink'); // ;)
     *
     * @name Highcharts.AST.allowedTags
     * @static
     */
    AST.allowedTags = [
        'a',
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
        'svg',
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
    /**
     * The list of allowed SVG or HTML attributes, used for sanitizing
     * potentially harmful content from the chart configuration before adding to
     * the DOM.
     *
     * @example
     * // Allow a custom, trusted attribute
     * Highcharts.AST.allowedAttributes.push('data-value');
     *
     * @name Highcharts.AST.allowedTags
     * @static
     */
    AST.allowedAttributes = [
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
        'clip-path',
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
        'target',
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
     * The list of allowed references for referring attributes like `href` and
     * `src`. Attribute values will only be allowed if they start with one of
     * these strings.
     *
     * @example
     * // Allow tel:
     * Highcharts.AST.allowedReferences.push('tel:');
     *
     * @name Highcharts.AST.allowedReferences
     * @static
     */
    AST.allowedReferences = [
        'https://',
        'http://',
        'mailto:',
        '/',
        '../',
        './',
        '#'
    ];
    return AST;
}());
export default AST;
