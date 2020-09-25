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
var attr = U.attr, objectEach = U.objectEach, splat = U.splat;
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
     * Utility function to set html content for an element by passing in a
     * markup string. The markup is safely parsed by the AST class to avoid
     * XSS vulnerabilities.
     *
     * @private
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
                var textNode = item.textContent ?
                    H.doc.createTextNode(item.textContent) :
                    void 0;
                var node;
                if (item.tagName === '#text') {
                    node = textNode;
                }
                else if (item.tagName) {
                    node = H.doc.createElementNS(NS, item.tagName);
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
                    attr(node, attributes_1);
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
            body = H.createElement('div');
            body.innerHTML = markup;
            doc = { body: body };
        }
        else {
            doc = new DOMParser().parseFromString(markup, 'text/html');
        }
        var validateDirective = function (attrib) {
            if (['background', 'dynsrc', 'href', 'lowsrc', 'src']
                .indexOf(attrib.name) !== -1) {
                return /^(http|\/)/.test(attrib.value);
            }
            return true;
        };
        var validateChildNodes = function (node, addTo) {
            var tagName = node.nodeName.toLowerCase();
            // Add allowed tags
            if (AST.allowedTags.indexOf(tagName) !== -1) {
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
                // Add allowed attributes
                if (parsedAttributes) {
                    var attributes_2 = {};
                    [].forEach.call(parsedAttributes, function (attrib) {
                        if (AST.allowedAttributes
                            .indexOf(attrib.name) !== -1 &&
                            validateDirective(attrib)) {
                            attributes_2[attrib.name] = attrib.value;
                        }
                    });
                    astNode.attributes = attributes_2;
                }
                // Handle children
                if (node.childNodes.length) {
                    var children_1 = [];
                    [].forEach.call(node.childNodes, function (childNode) {
                        validateChildNodes(childNode, children_1);
                    });
                    if (children_1.length) {
                        astNode.children = children_1;
                    }
                }
                addTo.push(astNode);
            }
        };
        [].forEach.call(doc.body.childNodes, function (childNode) { return validateChildNodes(childNode, nodes); });
        if (body) {
            H.discardElement(body);
        }
        return nodes;
    };
    AST.allowedTags = [
        'a',
        'b',
        'br',
        'button',
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
        'thead',
        'tbody',
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
        'colspan',
        'disabled',
        'href',
        'id',
        'role',
        'scope',
        'src',
        'style',
        'rowspan',
        'tabindex'
    ];
    return AST;
}());
export default AST;
