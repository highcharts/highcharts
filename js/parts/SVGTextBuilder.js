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
    SVGTextBuilder.prototype.buildText = function () {
        var _this = this;
        var wrapper = this.svgElement;
        var textNode = wrapper.element, renderer = wrapper.renderer, forExport = renderer.forExport, textStr = pick(wrapper.textStr, '').toString(), hasMarkup = textStr.indexOf('<') !== -1, lines, childNodes = textNode.childNodes, truncated = false, parentX = attr(textNode, 'x'), textCache, isSubsequentLine, i = childNodes.length, tempParent = this.width && !wrapper.added && renderer.box, unescapeEntities = function (inputStr, except) {
            objectEach(renderer.escapes, function (value, key) {
                if (!except || except.indexOf(value) === -1) {
                    inputStr = inputStr.toString().replace(new RegExp(value, 'g'), key);
                }
            });
            return inputStr;
        }, parseAttribute = function (s, attr) {
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
            textNode.appendChild(doc.createTextNode(unescapeEntities(textStr)));
            // Complex strings, add more logic
        }
        else {
            if (tempParent) {
                // attach it to the DOM to read offset width
                tempParent.appendChild(textNode);
            }
            if (hasMarkup) {
                lines = renderer.styledMode ? (textStr
                    .replace(/<(b|strong)>/g, '<span class="highcharts-strong">')
                    .replace(/<(i|em)>/g, '<span class="highcharts-emphasized">')) : (textStr
                    .replace(/<(b|strong)>/g, '<span style="font-weight:bold">')
                    .replace(/<(i|em)>/g, '<span style="font-style:italic">'));
                lines = lines
                    .replace(/<a/g, '<span')
                    .replace(/<\/(b|strong|i|em|a)>/g, '</span>')
                    .split(regexMatchBreaks);
            }
            else {
                lines = [textStr];
            }
            // Trim empty lines (#5261)
            lines = lines.filter(function (line) {
                return line !== '';
            });
            // build the lines
            lines.forEach(function (line, lineNo) {
                var spans, spanNo = 0;
                _this.lineLength = 0;
                line = line
                    // Trim to prevent useless/costly process on the spaces
                    // (#5258)
                    .replace(/^\s+|\s+$/g, '')
                    .replace(/<span/g, '|||<span')
                    .replace(/<\/span>/g, '</span>|||');
                spans = line.split('|||');
                spans.forEach(function (span) {
                    if (span !== '' || spans.length === 1) {
                        var attributes = {}, tspan = doc.createElementNS(renderer.SVG_NS, 'tspan'), a, classAttribute, styleAttribute, // #390
                        hrefAttribute;
                        classAttribute = parseAttribute(span, 'class');
                        if (classAttribute) {
                            attr(tspan, 'class', classAttribute);
                        }
                        styleAttribute = parseAttribute(span, 'style');
                        if (styleAttribute) {
                            styleAttribute = styleAttribute.replace(/(;| |^)color([ :])/, '$1fill$2');
                            attr(tspan, 'style', styleAttribute);
                        }
                        // For anchors, wrap the tspan in an <a> tag and apply
                        // the href attribute as is (#13559). Not for export
                        // (#1529)
                        hrefAttribute = parseAttribute(span, 'href');
                        if (hrefAttribute && !forExport) {
                            if (
                            // Stop JavaScript links, vulnerable to XSS
                            hrefAttribute.split(':')[0].toLowerCase()
                                .indexOf('javascript') === -1) {
                                a = doc.createElementNS(renderer.SVG_NS, 'a');
                                attr(a, 'href', hrefAttribute);
                                attr(tspan, 'class', 'highcharts-anchor');
                                a.appendChild(tspan);
                                if (!renderer.styledMode) {
                                    css(tspan, { cursor: 'pointer' });
                                }
                            }
                        }
                        // Strip away unsupported HTML tags (#7126)
                        span = unescapeEntities(span.replace(/<[a-zA-Z\/](.|\n)*?>/g, '') || ' ');
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
                            }
                            else {
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
                                attr(tspan, 'dy', _this.getLineHeight(tspan));
                            }
                            // Check width and apply soft breaks or ellipsis
                            truncated = _this.constrainLineWidth(span, spans, lineNo, tspan, parentX, styleAttribute);
                            spanNo++;
                        }
                    }
                });
                // To avoid beginning lines that doesn't add to the textNode
                // (#6144)
                isSubsequentLine = (isSubsequentLine ||
                    textNode.childNodes.length);
            });
            if (this.ellipsis && truncated) {
                wrapper.attr('title', unescapeEntities(wrapper.textStr || '', ['&lt;', '&gt;']) // #7179
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
    SVGTextBuilder.prototype.constrainLineWidth = function (span, spans, lineNo, tspan, parentX, styleAttribute) {
        var truncated = false;
        if (this.width) {
            var words = span.replace(/([^\^])-/g, '$1- ').split(' '), // #1273
            hasWhiteSpace = !this.noWrap && (spans.length > 1 ||
                lineNo ||
                words.length > 1), wrapLineNo = 0, dy = this.getLineHeight(tspan);
            if (this.ellipsis) {
                truncated = this.renderer.truncate(this.svgElement, tspan, span, void 0, 0, 
                // Target width
                Math.max(0, 
                // Substract the font face to make room for the ellipsis
                // itself
                this.width - parseInt(this.fontSize || 12, 10)), 
                // Build the text to test for
                function (text, currentIndex) {
                    return text.substring(0, currentIndex) + '\u2026';
                });
            }
            else if (hasWhiteSpace) {
                while (words.length) {
                    // For subsequent lines, create tspans with the same style
                    // attributes as the first tspan.
                    if (words.length && !this.noWrap && wrapLineNo > 0) {
                        tspan = doc.createElementNS(SVG_NS, 'tspan');
                        attr(tspan, { dy: dy, x: parentX });
                        if (styleAttribute) { // #390
                            attr(tspan, 'style', styleAttribute);
                        }
                        // Start by appending the full remaining text
                        tspan.appendChild(doc.createTextNode(words.join(' ').replace(/- /g, '-')));
                        this.svgElement.element.appendChild(tspan);
                    }
                    // For each line, truncate the remaining
                    // words into the line length.
                    this.renderer.truncate(this.svgElement, tspan, void 0, words, wrapLineNo === 0 ? (this.lineLength || 0) : 0, this.width, 
                    // Build the text to test for
                    function (text, currentIndex) {
                        return words
                            .slice(0, currentIndex)
                            .join(' ')
                            .replace(/- /g, '-');
                    });
                    this.lineLength = this.svgElement.actualWidth;
                    wrapLineNo++;
                }
            }
        }
        return truncated;
    };
    return SVGTextBuilder;
}());
export default SVGTextBuilder;
