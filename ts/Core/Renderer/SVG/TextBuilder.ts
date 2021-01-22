/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type {
    HTMLDOMElement,
    SVGDOMElement
} from '../DOMElementType';

import H from '../../Globals.js';
import U from '../../Utilities.js';
import AST from '../HTML/AST.js';
const {
    doc,
    SVG_NS
} = H;

const {
    attr,
    isString,
    objectEach,
    pick
} = U;

/**
 * SVG Text Builder
 * @private
 * @class
 * @name Highcharts.TextBuilder
 */
class TextBuilder {

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
    public noWrap: boolean;
    public renderer: Highcharts.Renderer;
    public svgElement: Highcharts.SVGElement;
    public textLineHeight: any;
    public textOutline: any;
    public width?: number;

    public buildSVG(): void {
        const wrapper = this.svgElement;
        var textNode = wrapper.element,
            renderer = wrapper.renderer,
            forExport = renderer.forExport,
            textStr = pick(wrapper.textStr, '').toString() as string,
            hasMarkup = textStr.indexOf('<') !== -1,
            lines: Array<string>,
            childNodes = textNode.childNodes,
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
        } else if (textStr !== '') {

            if (tempParent) {
                // attach it to the DOM to read offset width
                tempParent.appendChild(textNode);
            }

            // Step 1. Parse the markup safely and directly into a tree
            // structure.
            const ast = new AST(textStr);

            // Step 2. Do as many as we can of the modifications to the tree
            // structure before it is added to the DOM
            this.modifyTree(ast.nodes);

            ast.addToDOM(wrapper.element);

            // Step 3. Some modifications can't be done until the structure is
            // in the DOM, because we need to read computed metrics.
            this.modifyDOM();

            // Add title if an ellipsis was added
            if (
                this.ellipsis &&
                (textNode.textContent || '').indexOf('\u2026') !== -1
            ) {
                wrapper.attr(
                    'title',
                    this.unescapeEntities(
                        wrapper.textStr || '',
                        ['&lt;', '&gt;']
                    ) // #7179
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


    private modifyDOM(): void {

        // Add line breaks by replacing the br tags with x and dy attributes on
        // the next tspan
        [].forEach.call(
            this.svgElement.element.querySelectorAll('br'),
            (br: SVGElement|HTMLElement): void => {
                let nextSibling = br.nextSibling;

                if (
                    nextSibling &&
                    br.previousSibling // #5261
                ) {
                    // If the new line starts with a text node, we can't apply
                    // dy directly to it, so we create a tspan and move the text
                    // node inside it
                    if (!(nextSibling instanceof SVGElement)) {
                        const tspan = doc.createElementNS(SVG_NS, 'tspan') as SVGElement;
                        br.parentElement?.insertBefore(tspan, nextSibling);
                        tspan.appendChild(nextSibling);
                        nextSibling = tspan;
                    }

                    attr(nextSibling as SVGElement, {
                        dy: this.getLineHeight(nextSibling as SVGElement),
                        x: attr(this.svgElement.element, 'x')
                    });
                }
                br.remove();
            }
        );

        // Constrain the line width, either by ellipsis or wrapping
        const tspans = [].slice.call(
            this.svgElement.element.getElementsByTagName('tspan')
        );
        let lineLength = 0;
        const width = this.width || 0;
        if (!width) {
            return;
        }

        tspans.forEach((tspan: SVGDOMElement): void => {
            const text = tspan.textContent || '';
            const words = text
                .replace(/([^\^])-/g, '$1- ') // Split on hyphens
                // .trim()
                .split(' '); // #1273
            const hasWhiteSpace = !this.noWrap && (
                words.length > 1 || tspans.length > 1
            );

            const dy = this.getLineHeight(tspan);

            let wrapLineNo = 0;

            // First tspan after a <br>
            if (tspan.getAttribute('x') !== null) {
                lineLength = 0;
            }

            if (this.ellipsis) {
                if (text) {
                    this.truncate(
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
                        lastTspan.parentNode.insertBefore(
                            insertedTspan,
                            lastTspan.nextSibling
                        );
                        lastTspan = insertedTspan;
                    }

                    // For each line, truncate the remaining
                    // words into the line length.
                    this.truncate(
                        lastTspan,
                        void 0,
                        words,
                        wrapLineNo === 0 ? (lineLength || 0) : 0,
                        width,
                        // Build the text to test for
                        function (t: string, currentIndex: number): string {
                            return words
                                .slice(0, currentIndex)
                                .join(' ')
                                .replace(/- /g, '-');
                        }
                    );

                    lineLength = this.svgElement.actualWidth;
                    wrapLineNo++;
                }
            }
        });
    }

    private getLineHeight(tspan: SVGDOMElement): number {
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
        elements: Highcharts.ASTNode[]
    ): void {

        const modifyChild = (elem: Highcharts.ASTNode, i: number): void => {
            const tagName = elem.tagName;
            const styledMode = this.renderer.styledMode;
            const attributes = elem.attributes || {};

            // Apply styling to text tags
            if (tagName === 'b' || tagName === 'strong') {
                if (styledMode) {
                    attributes['class'] = 'highcharts-strong'; // eslint-disable-line dot-notation
                } else {
                    attributes.style = 'font-weight:bold;' + (attributes.style || '');
                }
            } else if (tagName === 'i' || tagName === 'em') {
                if (styledMode) {
                    attributes['class'] = 'highcharts-emphasized'; // eslint-disable-line dot-notation
                } else {
                    attributes.style = 'font-style:italic;' + (attributes.style || '');
                }
            }

            // Modify attributes
            if (isString(attributes.style)) {
                attributes.style = attributes.style.replace(
                    /(;| |^)color([ :])/,
                    '$1fill$2'
                );
            }

            // Trim whitespace off the beginning of new lines
            if (tagName === 'br') {
                const nextElem = elements[i + 1];
                if (nextElem && nextElem.textContent) {
                    nextElem.textContent =
                        nextElem.textContent.replace(/^ +/gm, '');
                }
            }

            if (tagName !== 'a' && tagName !== 'br') {
                elem.tagName = 'tspan';
            }
            elem.attributes = attributes;

            // Recurse
            if (elem.children) {
                elem.children
                    .filter((c): boolean => c.tagName !== '#text')
                    .forEach(modifyChild);
            }
        };

        elements.forEach(modifyChild);
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
     * Truncate the text node contents to a given length. Used when the css
     * width is set. If the `textOverflow` is `ellipsis`, the text is truncated
     * character by character to the given length. If not, the text is
     * word-wrapped line by line.
     */
    private truncate(
        tspan: HTMLDOMElement|SVGDOMElement,
        text: (string|undefined),
        words: (Array<string>|undefined),
        startAt: number,
        width: number,
        getString: Function
    ): void {
        const svgElement = this.svgElement;
        const { renderer, rotation } = svgElement;
        // Cache the lengths to avoid checking the same twice
        const lengths = [] as Array<number>;

        // Word wrap can not be truncated to shorter than one word, ellipsis
        // text can be completely blank.
        let minIndex = words ? 1 : 0;
        let maxIndex = (text || words || '').length;
        let currentIndex = maxIndex;
        let str;
        let actualWidth: number;

        const updateTSpan = function (s: string): void {
            if (tspan.firstChild) {
                tspan.removeChild(tspan.firstChild);
            }
            if (s) {
                tspan.appendChild(doc.createTextNode(s));
            }
        };
        const getSubStringLength = function (
            charEnd: number,
            concatenatedEnd?: number
        ): number {
            // charEnd is used when finding the character-by-character
            // break for ellipsis, concatenatedEnd is used for word-by-word
            // break for word wrapping.
            var end = concatenatedEnd || charEnd;

            if (typeof lengths[end] === 'undefined') {
                // Modern browsers
                if ((tspan as any).getSubStringLength) {
                    // Fails with DOM exception on unit-tests/legend/members
                    // of unknown reason. Desired width is 0, text content
                    // is "5" and end is 1.
                    try {
                        lengths[end] = startAt +
                            (tspan as any).getSubStringLength(
                                0,
                                words ? end + 1 : end
                            );

                    } catch (e) {
                        '';
                    }

                // Legacy
                } else if (renderer.getSpanWidth) { // #9058 jsdom
                    updateTSpan(getString(text || words, charEnd));
                    lengths[end] = startAt +
                        renderer.getSpanWidth(svgElement, tspan as any);
                }
            }
            return lengths[end];
        };

        svgElement.rotation = 0; // discard rotation when computing box
        actualWidth = getSubStringLength((tspan.textContent as any).length);

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
                actualWidth = getSubStringLength(
                    currentIndex,
                    str && str.length - 1
                );

                if (minIndex === maxIndex) {
                    // Complete
                    minIndex = maxIndex + 1;
                } else if (actualWidth > width) {
                    // Too large. Set max index to current.
                    maxIndex = currentIndex - 1;
                } else {
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
            } else if (!(text && maxIndex === text.length - 1)) {
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

export default TextBuilder;
