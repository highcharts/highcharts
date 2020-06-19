/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * @todo
 * - Move the trucate function here
 * - Discuss whether this should be a separate class, or just part of the
 *   SVGElement
 * - Apply filter for HTML, including enableSimpleHTML option (or similar)
 * - Set up XSS tests
 * - Make allowedTags and allowedAttributes configurable
 * - Rename SVGDefinitionObject to something more general
 * */

'use strict';

import H from './Globals.js';
import U from './Utilities.js';
const {
    doc,
    svg,
    SVG_NS
} = H;

const {
    attr,
    css,
    isString,
    objectEach,
    pick
} = U;

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
class SVGTextBuilder {

    public constructor(svgElement: Highcharts.SVGElement) {
        const textStyles = svgElement.styles;

        this.renderer = svgElement.renderer;
        this.svgElement = svgElement;
        this.width = svgElement.textWidth;

        this.textLineHeight = textStyles && textStyles.lineHeight;
        this.textOutline = textStyles && textStyles.textOutline;
        this.ellipsis = Boolean(textStyles && textStyles.textOverflow === 'ellipsis');
        this.noWrap = Boolean(textStyles && textStyles.whiteSpace === 'nowrap');
        this.fontSize = textStyles && textStyles.fontSize;
    }

    public ellipsis: boolean;
    public fontSize: any;
    public lineLength?: number;
    public noWrap: boolean;
    public renderer: Highcharts.Renderer;
    public svgElement: Highcharts.SVGElement;
    public textLineHeight: any;
    public textOutline: any;
    public width?: number;

    // Modify the DOM by adding line breaks as x/dy in SVG
    public addLineBreaks(): void {
        [].forEach.call(
            this.svgElement.element.querySelectorAll('br'),
            (br: SVGElement|HTMLElement): void => {
                if (br.nextSibling) {
                    attr(br.nextSibling as SVGElement, {
                        dy: this.getLineHeight(br.nextSibling as SVGElement),
                        x: attr(this.svgElement.element, 'x')
                    });
                }
                br.remove();
            }
        );
    }

    public buildText(): void {
        const wrapper = this.svgElement;
        var textNode = wrapper.element,
            renderer = wrapper.renderer,
            forExport = renderer.forExport,
            textStr = pick(wrapper.textStr, '').toString() as string,
            hasMarkup = textStr.indexOf('<') !== -1,
            lines: Array<string>,
            childNodes = textNode.childNodes,
            truncated = false,
            parentX = attr(textNode, 'x'),
            textCache,
            isSubsequentLine: number,
            i = childNodes.length,
            tempParent = this.width && !wrapper.added && renderer.box;
        const regexMatchBreaks = /<br.*?>/g;

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
        if (
            !hasMarkup &&
            !this.textOutline &&
            !this.ellipsis &&
            !this.width &&
            (
                textStr.indexOf(' ') === -1 ||
                (this.noWrap && !regexMatchBreaks.test(textStr))
            )
        ) {
            textNode.appendChild(
                doc.createTextNode(this.unescapeEntities(textStr))
            );

        // Complex strings, add more logic
        } else {

            if (tempParent) {
                // attach it to the DOM to read offset width
                tempParent.appendChild(textNode);
            }

            const ast = this.parseMarkup(textStr);
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
                wrapper.attr(
                    'title',
                    this.unescapeEntities(wrapper.textStr || '', ['&lt;', '&gt;']) // #7179
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
    }

    // Constrain the line width, either by ellipsis or wrapping
    private constrainLineWidth(): boolean {

        let truncated = false;
        const width = this.width || 0;
        if (!width) {
            return false;
        }
        const tspans = [].slice.call(
            this.svgElement.element.getElementsByTagName('tspan')
        );

        tspans.forEach((tspan: Highcharts.SVGDOMElement): void => {
            const text = tspan.textContent || '';
            const words = text
                .replace(/([^\^])-/g, '$1- ') // Split on hyphens
                // .trim()
                .split(' '); // #1273
            const hasWhiteSpace = !this.noWrap && (
                words.length > 1 || tspans.length > 1
            );

            /*
            hasWhiteSpace = !noWrap && (
                // Spans is spans within this line
                spans.length > 1 || lineNo || words.length > 1
            )
            */
            const dy = this.getLineHeight(tspan);

            let wrapLineNo = 0;
            if (this.ellipsis) {
                if (text) {
                    truncated = this.renderer.truncate(
                        this.svgElement,
                        tspan,
                        text,
                        void 0,
                        0,
                        // Target width
                        Math.max(
                            0,
                            // Substract the font face to make room for the
                            // ellipsis itself
                            width - parseInt(this.fontSize || 12, 10)
                        ),
                        // Build the text to test for
                        (text: string, currentIndex: number): string =>
                            text.substring(0, currentIndex) + '\u2026'
                    );
                }
            } else if (hasWhiteSpace) {
                let lastTspan = tspan;
                while (words.length) {

                    let insertedTspan: SVGElement;

                    // For subsequent lines, create tspans with the same style
                    // attributes as the first tspan.
                    if (words.length && !this.noWrap && wrapLineNo > 0) {
                        const styleAttribute = attr(tspan, 'style');
                        const parentX = attr(this.svgElement.element, 'x');

                        insertedTspan = doc.createElementNS(SVG_NS, 'tspan') as SVGElement;
                        attr(insertedTspan, { dy: dy, x: parentX });
                        if (styleAttribute) { // #390
                            attr(insertedTspan, 'style', styleAttribute);
                        }
                        // Start by appending the full remaining text
                        insertedTspan.appendChild(
                            doc.createTextNode(
                                words.join(' ').replace(/- /g, '-')
                            )
                        );
                        this.svgElement.element.insertBefore(
                            insertedTspan,
                            lastTspan.nextSibling
                        );
                        lastTspan = insertedTspan;
                    }

                    // For each line, truncate the remaining
                    // words into the line length.
                    this.renderer.truncate(
                        this.svgElement,
                        lastTspan,
                        void 0,
                        words,
                        wrapLineNo === 0 ? (this.lineLength || 0) : 0,
                        width,
                        // Build the text to test for
                        function (t: string, currentIndex: number): string {
                            return words
                                .slice(0, currentIndex)
                                .join(' ')
                                .replace(/- /g, '-');
                        }
                    );

                    this.lineLength = this.svgElement.actualWidth;
                    wrapLineNo++;
                }
            }
        });
        return truncated;
    }

    private getLineHeight(tspan: Highcharts.SVGDOMElement): number {
        var fontSizeStyle;

        if (!this.renderer.styledMode) {
            fontSizeStyle =
                /(px|em)$/.test(tspan && tspan.style.fontSize as any) ?
                    tspan.style.fontSize :
                    (this.fontSize || this.renderer.style.fontSize || 12);
        }

        return this.textLineHeight ?
            parseInt(this.textLineHeight.toString(), 10) :
            this.renderer.fontMetrics(
                fontSizeStyle as any,
                // Get the computed size from parent if not explicit
                (tspan.getAttribute('style') ? tspan : this.svgElement.element) as any
            ).h;
    }

    // Transform HTML to SVG, validate
    private modifyTree(
        elements: Highcharts.SVGDefinitionObject[]
    ): void {
        elements.forEach((elem, i): void => {
            const tagName = elem.tagName;
            const styledMode = this.renderer.styledMode;

            // Apply styling to text tags
            if (tagName === 'b' || tagName === 'strong') {
                if (styledMode) {
                    elem.class = 'highcharts-strong';
                } else {
                    elem.style = 'font-weight:bold;' + (elem.style || '');
                }
            } else if (tagName === 'i' || tagName === 'em') {
                if (styledMode) {
                    elem.class = 'highcharts-emphasized';
                } else {
                    elem.style = 'font-style:italic;' + (elem.style || '');
                }
            }

            // Modify attributes
            if (isString(elem.style)) {
                elem.style = elem.style.replace(
                    /(;| |^)color([ :])/,
                    '$1fill$2'
                );
            }

            if (
                isString(elem.href) &&
                elem.href.split(':')[0].toLowerCase()
                    .indexOf('javascript') !== -1
            ) {
                delete elem.href;
            }

            if (tagName !== 'a' && tagName !== 'br') {
                elem.tagName = 'tspan';
            }
        });
    }

    private parseAttribute(
        s: string,
        attr: string
    ): (string|undefined) {
        var start,
            delimiter;

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
    }

    /*
     * @param markup
     */
    private parseMarkup(markup: string): Highcharts.SVGDefinitionObject[] {
        const allowedTags = ['a', 'b', 'br', 'em', 'i', 'span', 'strong', '#text'];
        const allowedAttributes = ['class', 'href', 'style'];

        const tree: Highcharts.SVGDefinitionObject[] = [];
        const doc = new DOMParser().parseFromString(markup, 'text/html');

        const validateChildNodes = (
            node: ChildNode,
            addTo: Highcharts.SVGDefinitionObject[]
        ): void => {
            const tagName = node.nodeName.toLowerCase();

            // Add allowed tags
            if (allowedTags.indexOf(tagName) !== -1) {
                const textContent = node.textContent?.toString();
                const astNode: Highcharts.SVGDefinitionObject = {
                    tagName,
                    textContent
                };

                // Add allowed attributes
                allowedAttributes.forEach((name): void => {
                    if ((node as any).getAttribute) {
                        const value = (node as any).getAttribute(name);
                        if (value !== null) {
                            astNode[name] = value;
                        }
                    }
                });

                // Handle children
                if (node.childNodes.length) {
                    const children: Highcharts.SVGDefinitionObject[] = [];
                    node.childNodes.forEach(
                        (childNode): void => {
                            if (
                                childNode.nodeName !== '#text' ||
                                childNode.textContent !== textContent
                            ) {
                                validateChildNodes(
                                    childNode,
                                    children
                                );
                            }
                        }
                    );
                    astNode.children = children;
                }

                addTo.push(astNode);
            }
        };

        doc.body.childNodes.forEach(
            (childNode): void => validateChildNodes(childNode, tree)
        );

        return tree;

        /*
        const allowedTagsJoined = allowedTags.join('|');
        const elements = markup
            // Trim to prevent useless/costly process on the spaces
            // (#5258)
            .replace(/^\s+|\s+$/g, '')
            .replace(/<br.*?>/g, '<br></br>')
            .replace(new RegExp(`<(${allowedTagsJoined})( |>)`, 'gi'), '|||<$1$2')
            .replace(new RegExp(`<\/(${allowedTagsJoined})>`, 'gi'), '</$1>|||')
            .split('|||')
            .filter((line): boolean => line !== '')
            .map((s): Highcharts.SVGDefinitionObject => {
                const obj: Highcharts.SVGDefinitionObject = {
                    tagName: 'span'
                };
                const m = s.match(new RegExp(`^<(${allowedTags})( |>)`, 'i'));
                if (m) {
                    obj.tagName = m[1];
                }

                // When the allowed tags are handled, strip away all other tags
                const textContent = this.unescapeEntities(
                    s.replace(/<[a-zA-Z\/](.|\n)*?>/g, '') || ' '
                );
                if (textContent) {
                    obj.textContent = textContent;
                }

                // Allowed attributes
                allowedAttributes.forEach((attributeName): void => {
                    const value = this.parseAttribute(s, attributeName);
                    if (value) {
                        obj[attributeName] = value;
                    }
                });

                return obj;
            });


        return elements;
        */
    }

    private unescapeEntities(
        inputStr: string,
        except?: Array<string>
    ): string {
        objectEach(this.renderer.escapes, function (
            value: string,
            key: string
        ): void {
            if (!except || except.indexOf(value) === -1) {
                inputStr = inputStr.toString().replace(
                    new RegExp(value, 'g'),
                    key
                );
            }
        });
        return inputStr;
    }
}

export default SVGTextBuilder;
