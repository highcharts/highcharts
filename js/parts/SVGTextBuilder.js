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
 * - Move the truncate function here
 * - Discuss whether this should be a separate class, or just part of the
 *   SVGElement. Maybe rename to TextBuilder, since HTML also uses it.
 * - Apply filter for HTML, including enableSimpleHTML option (or similar)
 * - Set up XSS tests
 * - Go over the code base and look for assignments of innerHTML, setAttribute
 *   etc to look for unfiltered inputs from config.
 * - Rename the type SVGDefinitionObject to something more general (NodeTree for
 *   ex)
 * - Events to allow implementers to override the filter?
 * */
'use strict';
import H from './Globals.js';
import U from './Utilities.js';
var doc = H.doc, svg = H.svg, SVG_NS = H.SVG_NS;
var attr = U.attr, css = U.css, isString = U.isString, objectEach = U.objectEach, pick = U.pick;
/**
 * Internal types
 * @private
 * /
declare global {
    namespace Highcharts {
        class SVGTextBuilder {
            public svgElement: Highcharts.SVGElement;
        }
    }
}
*/
/**
 * SVG Text Builder
 * @private
 * @class
 * @name Highcharts.SVGTextBuilder
 */
var SVGTextBuilder = /** @class */ (function () {
    function SVGTextBuilder(svgElement) {
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
    // Modify the DOM by adding line breaks as x/dy in SVG
    SVGTextBuilder.prototype.addLineBreaks = function () {
        var _this = this;
        [].forEach.call(this.svgElement.element.querySelectorAll('br'), function (br) {
            if (br.nextSibling && br.previousSibling) { // #5261
                attr(br.nextSibling, {
                    dy: _this.getLineHeight(br.nextSibling),
                    x: attr(_this.svgElement.element, 'x')
                });
            }
            br.remove();
        });
    };
    SVGTextBuilder.prototype.buildText = function () {
        var wrapper = this.svgElement;
        var textNode = wrapper.element, renderer = wrapper.renderer, forExport = renderer.forExport, textStr = pick(wrapper.textStr, '').toString(), hasMarkup = textStr.indexOf('<') !== -1, lines, childNodes = textNode.childNodes, truncated = false, parentX = attr(textNode, 'x'), textCache, isSubsequentLine, i = childNodes.length, tempParent = this.width && !wrapper.added && renderer.box;
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
        else {
            if (tempParent) {
                // attach it to the DOM to read offset width
                tempParent.appendChild(textNode);
            }
            var ast = this.parseMarkup(textStr);
            this.modifyTree(ast);
            renderer.addTree(ast, wrapper);
            this.addLineBreaks();
            truncated = this.constrainLineWidth();
            /*

            if (hasMarkup) {
                lines = renderer.styledMode ? (
                    textStr
                        .replace(
                            /<(b|strong)>/g,
                            '<span class="highcharts-strong">'
                        )
                        .replace(
                            /<(i|em)>/g,
                            '<span class="highcharts-emphasized">'
                        )
                ) : (
                    textStr
                        .replace(
                            /<(b|strong)>/g,
                            '<span style="font-weight:bold">'
                        )
                        .replace(
                            /<(i|em)>/g,
                            '<span style="font-style:italic">'
                        )
                ) as any;

                lines = (lines as any)
                    .replace(/<a/g, '<span')
                    .replace(/<\/(b|strong|i|em|a)>/g, '</span>')
                    .split(regexMatchBreaks);

            } else {
                lines = [textStr];
            }


            // Trim empty lines (#5261)
            lines = lines.filter(function (line: string): boolean {
                return line !== '';
            });


            // build the lines
            lines.forEach((line: string, lineNo: number): void => {
                var spans: string[],
                    spanNo = 0;

                this.lineLength = 0;

                line = line
                    // Trim to prevent useless/costly process on the spaces
                    // (#5258)
                    .replace(/^\s+|\s+$/g, '')
                    .replace(/<span/g, '|||<span')
                    .replace(/<\/span>/g, '</span>|||');
                spans = line.split('|||');

                spans.forEach((span: string): void => {
                    if (span !== '' || spans.length === 1) {
                        var attributes = {} as Highcharts.SVGAttributes,
                            tspan = doc.createElementNS(
                                renderer.SVG_NS,
                                'tspan'
                            ) as any,
                            a,
                            classAttribute,
                            styleAttribute, // #390
                            hrefAttribute;

                        classAttribute = this.parseAttribute(span, 'class');
                        if (classAttribute) {
                            attr(tspan, 'class', classAttribute);
                        }

                        styleAttribute = this.parseAttribute(span, 'style');
                        if (styleAttribute) {
                            styleAttribute = styleAttribute.replace(
                                /(;| |^)color([ :])/,
                                '$1fill$2'
                            );
                            attr(tspan, 'style', styleAttribute);
                        }

                        // For anchors, wrap the tspan in an <a> tag and apply
                        // the href attribute as is (#13559). Not for export
                        // (#1529)
                        hrefAttribute = this.parseAttribute(span, 'href');
                        if (hrefAttribute && !forExport) {
                            if (
                                // Stop JavaScript links, vulnerable to XSS
                                hrefAttribute.split(':')[0].toLowerCase()
                                    .indexOf('javascript') === -1
                            ) {
                                a = doc.createElementNS(
                                    renderer.SVG_NS,
                                    'a'
                                ) as any;
                                attr(a, 'href', hrefAttribute);
                                attr(tspan, 'class', 'highcharts-anchor');
                                a.appendChild(tspan);

                                if (!renderer.styledMode) {
                                    css(tspan, { cursor: 'pointer' });
                                }
                            }
                        }

                        // Strip away unsupported HTML tags (#7126)
                        span = this.unescapeEntities(
                            span.replace(/<[a-zA-Z\/](.|\n)*?>/g, '') || ' '
                        );

                        // Nested tags aren't supported, and cause crash in
                        // Safari (#1596)
                        if (span !== ' ') {

                            // add the text node
                            tspan.appendChild(doc.createTextNode(span));

                            // First span in a line, align it to the left
                            if (!spanNo) {
                                if (lineNo && parentX !== null) {
                                    attributes.x = parentX;
                                }
                            } else {
                                attributes.dx = 0; // #16
                            }

                            // add attributes
                            attr(tspan, attributes);

                            // Append it
                            textNode.appendChild(a || tspan);

                            // first span on subsequent line, add the line
                            // height
                            if (!spanNo && isSubsequentLine) {

                                // allow getting the right offset height in
                                // exporting in IE
                                if (!svg && forExport) {
                                    css(tspan, { display: 'block' });
                                }

                                // Set the line height based on the font size of
                                // either the text element or the tspan element
                                attr(
                                    tspan,
                                    'dy',
                                    this.getLineHeight(tspan)
                                );
                            }

                            // Check width and apply soft breaks or ellipsis
                            truncated = this.constrainLineWidth(
                                span,
                                spans,
                                lineNo,
                                tspan,
                                parentX,
                                styleAttribute
                            );

                            spanNo++;
                        }

                    }

                });

                // To avoid beginning lines that doesn't add to the textNode
                // (#6144)
                isSubsequentLine = (
                    isSubsequentLine ||
                    textNode.childNodes.length
                );
            });
            */
            if (this.ellipsis && truncated) {
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
    // Constrain the line width, either by ellipsis or wrapping
    SVGTextBuilder.prototype.constrainLineWidth = function () {
        var _this = this;
        var truncated = false;
        var lineLength = 0;
        var width = this.width || 0;
        if (!width) {
            return false;
        }
        var tspans = [].slice.call(this.svgElement.element.getElementsByTagName('tspan'));
        tspans.forEach(function (tspan) {
            var text = tspan.textContent || '';
            var words = text
                .replace(/([^\^])-/g, '$1- ') // Split on hyphens
                // .trim()
                .split(' '); // #1273
            var hasWhiteSpace = !_this.noWrap && (words.length > 1 || tspans.length > 1);
            /*
            hasWhiteSpace = !noWrap && (
                // Spans is spans within this line
                spans.length > 1 || lineNo || words.length > 1
            )
            */
            var dy = _this.getLineHeight(tspan);
            var wrapLineNo = 0;
            // First tspan after a <br>
            if (tspan.getAttribute('x') !== null) {
                lineLength = 0;
            }
            if (_this.ellipsis) {
                if (text) {
                    truncated = _this.renderer.truncate(_this.svgElement, tspan, text, void 0, 0, 
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
                    _this.renderer.truncate(_this.svgElement, lastTspan, void 0, words, wrapLineNo === 0 ? (lineLength || 0) : 0, width, 
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
        return truncated;
    };
    SVGTextBuilder.prototype.getLineHeight = function (tspan) {
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
    SVGTextBuilder.prototype.modifyTree = function (elements) {
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
    SVGTextBuilder.prototype.parseAttribute = function (s, attr) {
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
    SVGTextBuilder.prototype.parseMarkup = function (markup) {
        ;
        var tree = [];
        var doc = new DOMParser().parseFromString(markup, 'text/html');
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
            if (SVGTextBuilder.allowedTags.indexOf(tagName) !== -1) {
                var textContent_1 = (_a = node.textContent) === null || _a === void 0 ? void 0 : _a.toString();
                var astNode_1 = {
                    tagName: tagName,
                    textContent: textContent_1
                };
                var attributes = node.attributes;
                // Add allowed attributes
                if (attributes) {
                    [].forEach.call(attributes, function (attrib) {
                        if (SVGTextBuilder.allowedAttributes
                            .indexOf(attrib.name) !== -1 &&
                            validateDirective(attrib)) {
                            astNode_1[attrib.name] = attrib.value;
                        }
                    });
                }
                // Handle children
                if (node.childNodes.length) {
                    var children_1 = [];
                    node.childNodes.forEach(function (childNode) {
                        if (childNode.nodeName !== '#text' ||
                            childNode.textContent !== textContent_1) {
                            validateChildNodes(childNode, children_1);
                        }
                    });
                    if (children_1.length) {
                        astNode_1.children = children_1;
                    }
                }
                addTo.push(astNode_1);
            }
        };
        doc.body.childNodes.forEach(function (childNode) { return validateChildNodes(childNode, tree); });
        return tree;
    };
    SVGTextBuilder.prototype.unescapeEntities = function (inputStr, except) {
        objectEach(this.renderer.escapes, function (value, key) {
            if (!except || except.indexOf(value) === -1) {
                inputStr = inputStr.toString().replace(new RegExp(value, 'g'), key);
            }
        });
        return inputStr;
    };
    SVGTextBuilder.allowedTags = [
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
        'td',
        'tr',
        '#text'
    ];
    SVGTextBuilder.allowedAttributes = ['class', 'href', 'id', 'src', 'style'];
    return SVGTextBuilder;
}());
export default SVGTextBuilder;
