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
import U from '../../Utilities.js';
var attr = U.attr, createElement = U.createElement, discardElement = U.discardElement, error = U.error, objectEach = U.objectEach, splat = U.splat;
/**
 * Serialized form of an SVG/HTML definition, including children. Some key
 * property names are reserved: tagName, textContent, and children.
 *
 * @interface Highcharts.ASTNode
 */ /**
* @name Highcharts.ASTNode#[key:string]
* @type {boolean|number|string|Array<Highcharts.ASTNode>|undefined}
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
/**
 * Represents an AST
 * @private
 * @class
 * @name Highcharts.AST
 */
var AST = /** @class */ (function () {
    // Construct an AST from HTML markup, or wrap an array of existing AST nodes
    function AST(source) {
        this.nodes = typeof source === 'string' ?
            this.parseMarkup(source) : source;
    }
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
    AST.filterUserAttributes = function (attributes) {
        objectEach(attributes, function (val, key) {
            var valid = true;
            if (AST.allowedAttributes.indexOf(key) === -1) {
                valid = false;
            }
            if (['background', 'dynsrc', 'href', 'lowsrc', 'src']
                .indexOf(key) !== -1) {
                valid = /^(http|\/)/.test(val);
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
     * XSS vulnerabilities.
     *
     * @static
     *
     * @function Highcharts.AST#setElementHTML
     *
     * @param {SVGElement} el The node to set content of
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
    AST.prototype.addToDOM = function (parent) {
        var NS = parent.namespaceURI || H.SVG_NS;
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
    AST.prototype.parseMarkup = function (markup) {
        var nodes = [];
        var doc;
        var body;
        if (
        // IE9 is only able to parse XML
        /MSIE 9.0/.test(navigator.userAgent) ||
            // IE8-
            typeof DOMParser === 'undefined') {
            body = createElement('div');
            body.innerHTML = markup;
            doc = { body: body };
        }
        else {
            doc = new DOMParser().parseFromString(markup, 'text/html');
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
    AST.allowedTags = [
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
    return AST;
}());
export default AST;
