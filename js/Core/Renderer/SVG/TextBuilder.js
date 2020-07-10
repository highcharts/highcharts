/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * Renderer: http://jsfiddle.net/highcharts/p9Lkm5j1/
 * Pen test: https://jsfiddle.net/highcharts/abr5czg7/
 *
 * @todo
 * - Go over the code base and look for assignments of innerHTML, setAttribute
 *   etc to look for unfiltered inputs from config. Attributes set directly from
 *   API may be vulnerable to javascript: directive and on* attributes.
 *   - https://jsfiddle.net/highcharts/Lukjm510/
 *   - Test/validate all options in highcharts.d.ts that have SVGAttributes as
 *     input type (roughly 10 cases). Most can be whitelisted to fill, stroke,
 *     stroke-width, maybe style and class and a few more.
 * - More tags in whitelist?
 * - Avoid setting innerHTML wherever possible. In the A11y module, use
 *   SVGRenderer.addTree like demonstrated in export-data.
 * - Consider standardized AST format, like https://github.com/syntax-tree/hast,
 *   or simpler, just create a subnode for attributes (attrs, properties?)
 *   instead of registering them on the main object.
 *   - Then the legacy .definition function must translate to this format.
 *   - Rename functions to addAST, getTableAST etc
 * */
'use strict';
import H from '../../Globals.js';
import U from '../../Utilities.js';
var doc = H.doc, SVG_NS = H.SVG_NS;
var attr = U.attr, isString = U.isString, objectEach = U.objectEach, pick = U.pick;
/**
 * SVG Text Builder
 * @private
 * @class
 * @name Highcharts.TextBuilder
 */
var TextBuilder = /** @class */ (function () {
    function TextBuilder(svgElement) {
        var textStyles = svgElement.styles;
        this.renderer = svgElement.renderer;
        this.svgElement = svgElement;
        this.width = svgElement.textWidth;
        this.textLineHeight = textStyles && textStyles.lineHeight;
        this.textOutline = textStyles && textStyles.textOutline;
        this.ellipsis = Boolean(textStyles && textStyles.textOverflow === 'ellipsis');
        this.noWrap = Boolean(textStyles && textStyles.whiteSpace === 'nowrap');
        this.fontSize = textStyles && textStyles.fontSize;
    }
    TextBuilder.prototype.buildSVG = function () {
        var wrapper = this.svgElement;
        var textNode = wrapper.element, renderer = wrapper.renderer, forExport = renderer.forExport, textStr = pick(wrapper.textStr, '').toString(), hasMarkup = textStr.indexOf('<') !== -1, lines, childNodes = textNode.childNodes, parentX = attr(textNode, 'x'), textCache, isSubsequentLine, i = childNodes.length, tempParent = this.width && !wrapper.added && renderer.box;
        var regexMatchBreaks = /<br.*?>/g;
        // The buildText code is quite heavy, so if we're not changing something
        // that affects the text, skip it (#6113).
        textCache = [
            textStr,
            this.ellipsis,
            this.noWrap,
            this.textLineHeight,
            this.textOutline,
            this.fontSize,
            this.width
        ].join(',');
        if (textCache === wrapper.textCache) {
            return;
        }
        wrapper.textCache = textCache;
        // Remove old text
        while (i--) {
            textNode.removeChild(childNodes[i]);
        }
        // Skip tspans, add text directly to text node. The forceTSpan is a hook
        // used in text outline hack.
        if (!hasMarkup &&
            !this.textOutline &&
            !this.ellipsis &&
            !this.width &&
            (textStr.indexOf(' ') === -1 ||
                (this.noWrap && !regexMatchBreaks.test(textStr)))) {
            textNode.appendChild(doc.createTextNode(this.unescapeEntities(textStr)));
            // Complex strings, add more logic
        }
        else if (textStr !== '') {
            if (tempParent) {
                // attach it to the DOM to read offset width
                tempParent.appendChild(textNode);
            }
            // Step 1. Parse the markup safely and directly into a tree
            // structure.
            var tree = this.parseMarkup(textStr);
            // Step 2. Do as many as we can of the modifications to the tree
            // structure before it is added to the DOM
            this.modifyTree(tree);
            renderer.addTree(tree, wrapper.element);
            // Step 3. Some modifications can't be done until the structure is
            // in the DOM, because we need to read computed metrics.
            this.modifyDOM();
            // Add title if an ellipsis was added
            if (this.ellipsis &&
                (textNode.textContent || '').indexOf('\u2026') !== -1) {
                wrapper.attr('title', this.unescapeEntities(wrapper.textStr || '', ['&lt;', '&gt;']) // #7179
                );
            }
            if (tempParent) {
                tempParent.removeChild(textNode);
            }
            // Apply the text outline
            if (isString(this.textOutline) && wrapper.applyTextOutline) {
                wrapper.applyTextOutline(this.textOutline);
            }
        }
    };
    TextBuilder.prototype.modifyDOM = function () {
        var _this = this;
        // Add line breaks by replacing the br tags with x and dy attributes on
        // the next tspan
        [].forEach.call(this.svgElement.element.querySelectorAll('br'), function (br) {
            if (br.nextSibling && br.previousSibling) { // #5261
                attr(br.nextSibling, {
                    dy: _this.getLineHeight(br.nextSibling),
                    x: attr(_this.svgElement.element, 'x')
                });
            }
            br.remove();
        });
        // Constrain the line width, either by ellipsis or wrapping
        var tspans = [].slice.call(this.svgElement.element.getElementsByTagName('tspan'));
        var lineLength = 0;
        var width = this.width || 0;
        if (!width) {
            return;
        }
        tspans.forEach(function (tspan) {
            var text = tspan.textContent || '';
            var words = text
                .replace(/([^\^])-/g, '$1- ') // Split on hyphens
                // .trim()
                .split(' '); // #1273
            var hasWhiteSpace = !_this.noWrap && (words.length > 1 || tspans.length > 1);
            var dy = _this.getLineHeight(tspan);
            var wrapLineNo = 0;
            // First tspan after a <br>
            if (tspan.getAttribute('x') !== null) {
                lineLength = 0;
            }
            if (_this.ellipsis) {
                if (text) {
                    _this.truncate(tspan, text, void 0, 0, 
                    // Target width
                    Math.max(0, 
                    // Substract the font face to make room for the
                    // ellipsis itself
                    width - parseInt(_this.fontSize || 12, 10)), 
                    // Build the text to test for
                    function (text, currentIndex) {
                        return text.substring(0, currentIndex) + '\u2026';
                    });
                }
            }
            else if (hasWhiteSpace) {
                var lastTspan = tspan;
                while (words.length) {
                    var insertedTspan = void 0;
                    // For subsequent lines, create tspans with the same style
                    // attributes as the first tspan.
                    if (words.length && !_this.noWrap && wrapLineNo > 0) {
                        var styleAttribute = attr(tspan, 'style');
                        var parentX = attr(_this.svgElement.element, 'x');
                        insertedTspan = doc.createElementNS(SVG_NS, 'tspan');
                        attr(insertedTspan, { dy: dy, x: parentX });
                        if (styleAttribute) { // #390
                            attr(insertedTspan, 'style', styleAttribute);
                        }
                        // Start by appending the full remaining text
                        insertedTspan.appendChild(doc.createTextNode(words.join(' ').replace(/- /g, '-')));
                        _this.svgElement.element.insertBefore(insertedTspan, lastTspan.nextSibling);
                        lastTspan = insertedTspan;
                    }
                    // For each line, truncate the remaining
                    // words into the line length.
                    _this.truncate(lastTspan, void 0, words, wrapLineNo === 0 ? (lineLength || 0) : 0, width, 
                    // Build the text to test for
                    function (t, currentIndex) {
                        return words
                            .slice(0, currentIndex)
                            .join(' ')
                            .replace(/- /g, '-');
                    });
                    lineLength = _this.svgElement.actualWidth;
                    wrapLineNo++;
                }
            }
        });
    };
    TextBuilder.prototype.getLineHeight = function (tspan) {
        var fontSizeStyle;
        if (!this.renderer.styledMode) {
            fontSizeStyle =
                /(px|em)$/.test(tspan && tspan.style.fontSize) ?
                    tspan.style.fontSize :
                    (this.fontSize || this.renderer.style.fontSize || 12);
        }
        return this.textLineHeight ?
            parseInt(this.textLineHeight.toString(), 10) :
            this.renderer.fontMetrics(fontSizeStyle, 
            // Get the computed size from parent if not explicit
            (tspan.getAttribute('style') ? tspan : this.svgElement.element)).h;
    };
    // Transform HTML to SVG, validate
    TextBuilder.prototype.modifyTree = function (elements) {
        var _this = this;
        elements.forEach(function (elem, i) {
            var tagName = elem.tagName;
            var styledMode = _this.renderer.styledMode;
            // Apply styling to text tags
            if (tagName === 'b' || tagName === 'strong') {
                if (styledMode) {
                    elem.class = 'highcharts-strong';
                }
                else {
                    elem.style = 'font-weight:bold;' + (elem.style || '');
                }
            }
            else if (tagName === 'i' || tagName === 'em') {
                if (styledMode) {
                    elem.class = 'highcharts-emphasized';
                }
                else {
                    elem.style = 'font-style:italic;' + (elem.style || '');
                }
            }
            // Modify attributes
            if (isString(elem.style)) {
                elem.style = elem.style.replace(/(;| |^)color([ :])/, '$1fill$2');
            }
            if (tagName !== 'a' && tagName !== 'br') {
                elem.tagName = 'tspan';
            }
        });
    };
    TextBuilder.prototype.parseAttribute = function (s, attr) {
        var start, delimiter;
        start = s.indexOf('<');
        s = s.substring(start, s.indexOf('>') - start);
        start = s.indexOf(attr + '=');
        if (start !== -1) {
            start = start + attr.length + 1;
            delimiter = s.charAt(start);
            if (delimiter === '"' || delimiter === "'") { // eslint-disable-line quotes
                s = s.substring(start + 1);
                return s.substring(0, s.indexOf(delimiter));
            }
        }
    };
    /*
     * @param markup
     */
    TextBuilder.prototype.parseMarkup = function (markup) {
        var tree = [];
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
            var _a;
            var tagName = node.nodeName.toLowerCase();
            // Add allowed tags
            if (TextBuilder.allowedTags.indexOf(tagName) !== -1) {
                var astNode_1 = {
                    tagName: tagName
                };
                if (tagName === '#text') {
                    astNode_1.textContent = (_a = node.textContent) === null || _a === void 0 ? void 0 : _a.toString();
                }
                var attributes = node.attributes;
                // Add allowed attributes
                if (attributes) {
                    [].forEach.call(attributes, function (attrib) {
                        if (TextBuilder.allowedAttributes
                            .indexOf(attrib.name) !== -1 &&
                            validateDirective(attrib)) {
                            astNode_1[attrib.name] = attrib.value;
                        }
                    });
                }
                // Handle children
                if (node.childNodes.length) {
                    var children_1 = [];
                    [].forEach.call(node.childNodes, function (childNode) {
                        validateChildNodes(childNode, children_1);
                    });
                    if (children_1.length) {
                        astNode_1.children = children_1;
                    }
                }
                addTo.push(astNode_1);
            }
        };
        [].forEach.call(doc.body.childNodes, function (childNode) { return validateChildNodes(childNode, tree); });
        if (body) {
            H.discardElement(body);
        }
        return tree;
    };
    /*
     * Truncate the text node contents to a given length. Used when the css
     * width is set. If the `textOverflow` is `ellipsis`, the text is truncated
     * character by character to the given length. If not, the text is
     * word-wrapped line by line.
     */
    TextBuilder.prototype.truncate = function (tspan, text, words, startAt, width, getString) {
        var svgElement = this.svgElement;
        var renderer = svgElement.renderer, rotation = svgElement.rotation;
        // Cache the lengths to avoid checking the same twice
        var lengths = [];
        // Word wrap can not be truncated to shorter than one word, ellipsis
        // text can be completely blank.
        var minIndex = words ? 1 : 0;
        var maxIndex = (text || words || '').length;
        var currentIndex = maxIndex;
        var str;
        var actualWidth;
        var updateTSpan = function (s) {
            if (tspan.firstChild) {
                tspan.removeChild(tspan.firstChild);
            }
            if (s) {
                tspan.appendChild(doc.createTextNode(s));
            }
        };
        var getSubStringLength = function (charEnd, concatenatedEnd) {
            // charEnd is used when finding the character-by-character
            // break for ellipsis, concatenatedEnd is used for word-by-word
            // break for word wrapping.
            var end = concatenatedEnd || charEnd;
            if (typeof lengths[end] === 'undefined') {
                // Modern browsers
                if (tspan.getSubStringLength) {
                    // Fails with DOM exception on unit-tests/legend/members
                    // of unknown reason. Desired width is 0, text content
                    // is "5" and end is 1.
                    try {
                        lengths[end] = startAt +
                            tspan.getSubStringLength(0, words ? end + 1 : end);
                    }
                    catch (e) {
                        '';
                    }
                    // Legacy
                }
                else if (renderer.getSpanWidth) { // #9058 jsdom
                    updateTSpan(getString(text || words, charEnd));
                    lengths[end] = startAt +
                        renderer.getSpanWidth(svgElement, tspan);
                }
            }
            return lengths[end];
        };
        svgElement.rotation = 0; // discard rotation when computing box
        actualWidth = getSubStringLength(tspan.textContent.length);
        if (startAt + actualWidth > width) {
            // Do a binary search for the index where to truncate the text
            while (minIndex <= maxIndex) {
                currentIndex = Math.ceil((minIndex + maxIndex) / 2);
                // When checking words for word-wrap, we need to build the
                // string and measure the subStringLength at the concatenated
                // word length.
                if (words) {
                    str = getString(words, currentIndex);
                }
                actualWidth = getSubStringLength(currentIndex, str && str.length - 1);
                if (minIndex === maxIndex) {
                    // Complete
                    minIndex = maxIndex + 1;
                }
                else if (actualWidth > width) {
                    // Too large. Set max index to current.
                    maxIndex = currentIndex - 1;
                }
                else {
                    // Within width. Set min index to current.
                    minIndex = currentIndex;
                }
            }
            // If max index was 0 it means the shortest possible text was also
            // too large. For ellipsis that means only the ellipsis, while for
            // word wrap it means the whole first word.
            if (maxIndex === 0) {
                // Remove ellipsis
                updateTSpan('');
                // If the new text length is one less than the original, we don't
                // need the ellipsis
            }
            else if (!(text && maxIndex === text.length - 1)) {
                updateTSpan(str || getString(text || words, currentIndex));
            }
        }
        // When doing line wrapping, prepare for the next line by removing the
        // items from this line.
        if (words) {
            words.splice(0, currentIndex);
        }
        svgElement.actualWidth = actualWidth;
        svgElement.rotation = rotation; // Apply rotation again.
    };
    TextBuilder.prototype.unescapeEntities = function (inputStr, except) {
        objectEach(this.renderer.escapes, function (value, key) {
            if (!except || except.indexOf(value) === -1) {
                inputStr = inputStr.toString().replace(new RegExp(value, 'g'), key);
            }
        });
        return inputStr;
    };
    TextBuilder.allowedTags = [
        'a',
        'b',
        'br',
        'div',
        'em',
        'i',
        'img',
        'p',
        'span',
        'strong',
        'table',
        'tbody',
        'td',
        'tr',
        '#text'
    ];
    TextBuilder.allowedAttributes = ['class', 'href', 'id', 'src', 'style'];
    return TextBuilder;
}());
export default TextBuilder;
