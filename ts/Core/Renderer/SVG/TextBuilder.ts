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
    DOMElementType
} from '../DOMElementType';
import type SVGAttributes from '../SVG/SVGAttributes';

import H from '../../Globals.js';
import U from '../../Utilities.js';
import AST from '../HTML/AST.js';
const {
    doc,
    SVG_NS
} = H;

const {
    attr,
    erase,
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

    /**
     * Build an SVG representation of the pseudo HTML given in the object's
     * svgElement.
     *
     * @private
     *
     * @return {void}.
     */
    public buildSVG(): void {
        const wrapper = this.svgElement;
        var textNode = wrapper.element,
            renderer = wrapper.renderer,
            textStr = pick(wrapper.textStr, '').toString() as string,
            hasMarkup = textStr.indexOf('<') !== -1,
            childNodes = textNode.childNodes,
            textCache,
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
        delete wrapper.actualWidth;

        // Remove old text
        while (i--) {
            textNode.removeChild(childNodes[i]);
        }

        // Simple strings, add text directly and return
        if (
            !hasMarkup &&
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
        }

        // Apply the text outline
        if (isString(this.textOutline) && wrapper.applyTextOutline) {
            wrapper.applyTextOutline(this.textOutline);
        }
    }

    /**
     * Modify the DOM of the generated SVG structure. This function only does
     * operations that cannot be done until the elements are attached to the
     * DOM, like doing layout based on rendered metrics of the added elements.
     *
     * @private
     *
     * @return {void}
     */
    private modifyDOM(): void {

        const wrapper = this.svgElement;
        const x = attr(wrapper.element, 'x');

        // Modify hard line breaks by applying the rendered line height
        [].forEach.call(
            wrapper.element.querySelectorAll('tspan.highcharts-br'),
            (br: SVGElement): void => {
                if (br.nextSibling && br.previousSibling) { // #5261
                    attr(br, {
                        // Since the break is inserted in front of the next
                        // line, we need to use the next sibling for the line
                        // height
                        dy: this.getLineHeight(br.nextSibling as any) as any,
                        x
                    } as unknown as SVGAttributes);
                }
            }
        );

        // Constrain the line width, either by ellipsis or wrapping
        const width = this.width || 0;
        if (!width) {
            return;
        }

        // Insert soft line breaks into each text node
        const modifyTextNode = (
            textNode: Text,
            parentElement: DOMElementType
        ): void => {
            const text = textNode.textContent || '';
            const words = text
                .replace(/([^\^])-/g, '$1- ') // Split on hyphens
                // .trim()
                .split(' '); // #1273
            const hasWhiteSpace = !this.noWrap && (
                words.length > 1 || wrapper.element.childNodes.length > 1
            );

            const dy = this.getLineHeight(parentElement);

            let lineNo = 0;
            let startAt = wrapper.actualWidth;

            if (this.ellipsis) {
                if (text) {
                    this.truncate(
                        textNode,
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
                const lines: string[] = [];

                // Remove preceding siblings in order to make the text length
                // calculation correct in the truncate function
                const precedingSiblings: ChildNode[] = [];
                while (
                    parentElement.firstChild &&
                    parentElement.firstChild !== textNode
                ) {
                    precedingSiblings.push(parentElement.firstChild);
                    parentElement.removeChild(parentElement.firstChild);
                }

                while (words.length) {

                    // Apply the previous line
                    if (words.length && !this.noWrap && lineNo > 0) {

                        lines.push(textNode.textContent || '');
                        textNode.textContent = words.join(' ')
                            .replace(/- /g, '-');
                    }

                    // For each line, truncate the remaining
                    // words into the line length.
                    this.truncate(
                        textNode,
                        void 0,
                        words,
                        lineNo === 0 ? (startAt || 0) : 0,
                        width,
                        // Build the text to test for
                        (t: string, currentIndex: number): string =>
                            words
                                .slice(0, currentIndex)
                                .join(' ')
                                .replace(/- /g, '-')
                    );

                    startAt = wrapper.actualWidth;
                    lineNo++;
                }

                // Reinsert the preceding child nodes
                precedingSiblings.forEach((childNode): void => {
                    parentElement.insertBefore(childNode, textNode);
                });

                // Insert the previous lines before the original text node
                lines.forEach((line): void => {

                    // Insert the line
                    parentElement.insertBefore(
                        doc.createTextNode(line),
                        textNode
                    );

                    // Insert a break
                    const br = doc.createElementNS(SVG_NS, 'tspan') as SVGElement;
                    br.textContent = '\u200B'; // zero-width space
                    attr(br, { dy, x } as unknown as SVGAttributes);
                    parentElement.insertBefore(br, textNode);
                });

            }
        };

        // Recurse down the DOM tree and handle line breaks for each text node
        const modifyChildren = ((node: DOMElementType): void => {
            const childNodes = [].slice.call(node.childNodes);
            childNodes.forEach((childNode: ChildNode): void => {
                if (childNode.nodeType === Node.TEXT_NODE) {
                    modifyTextNode(childNode as Text, node);
                } else {
                    // Reset word-wrap width readings after hard breaks
                    if (
                        (childNode as DOMElementType).className.baseVal
                            .indexOf('highcharts-br') !== -1
                    ) {
                        wrapper.actualWidth = 0;
                    }
                    // Recurse down to child node
                    modifyChildren(childNode as DOMElementType);
                }
            });
        });
        modifyChildren(wrapper.element);
    }

    /**
     * Get the rendered line height of a <text>, <tspan> or pure text node.
     *
     * @param {DOMElementType|Text} node The node to check for
     *
     * @return {number} The rendered line height
     */
    private getLineHeight(node: DOMElementType|Text): number {
        let fontSizeStyle;

        // If the node is a text node, use its parent
        const element: DOMElementType|null = node.nodeType === Node.TEXT_NODE ?
            node.parentElement :
            node as DOMElementType;

        if (!this.renderer.styledMode) {
            fontSizeStyle =
                element && /(px|em)$/.test(element.style.fontSize) ?
                    element.style.fontSize :
                    (this.fontSize || this.renderer.style.fontSize || 12);
        }

        return this.textLineHeight ?
            parseInt(this.textLineHeight.toString(), 10) :
            this.renderer.fontMetrics(
                fontSizeStyle as any,
                element || this.svgElement.element
            ).h;
    }

    /**
     * Transform a pseudo HTML AST node tree into an SVG structure. We do as
     * much heavy lifting as we can here, before doing the final processing in
     * the modifyDOM function. The original data is mutated.
     *
     * @private
     *
     * @param {ASTNode[]} nodes The AST nodes
     *
     * @return {void}
     */
    private modifyTree(
        nodes: Highcharts.ASTNode[]
    ): void {

        const modifyChild = (node: Highcharts.ASTNode, i: number): void => {
            const tagName = node.tagName;
            const styledMode = this.renderer.styledMode;
            const attributes = node.attributes || {};

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


            if (tagName === 'br') {
                attributes['class'] = 'highcharts-br'; // eslint-disable-line dot-notation
                node.textContent = '\u200B'; // zero-width space

                // Trim whitespace off the beginning of new lines
                const nextNode = nodes[i + 1];
                if (nextNode && nextNode.textContent) {
                    nextNode.textContent =
                        nextNode.textContent.replace(/^ +/gm, '');
                }
            }

            if (tagName !== '#text' && tagName !== 'a') {
                node.tagName = 'tspan';
            }
            node.attributes = attributes;

            // Recurse
            if (node.children) {
                node.children
                    .filter((c): boolean => c.tagName !== '#text')
                    .forEach(modifyChild);
            }
        };

        nodes.forEach(modifyChild);

        // Remove empty spans from the beginning because SVG's getBBox doesn't
        // count empty lines. The use case is tooltip where the header is empty.
        while (nodes[0]) {
            if (nodes[0].tagName === 'tspan' && !nodes[0].children) {
                nodes.splice(0, 1);
            } else {
                break;
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
        textNode: Text,
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

        const getSubStringLength = function (
            charEnd: number,
            concatenatedEnd?: number
        ): number {
            // charEnd is used when finding the character-by-character
            // break for ellipsis, concatenatedEnd is used for word-by-word
            // break for word wrapping.
            var end = concatenatedEnd || charEnd;
            const parentNode = textNode.parentNode;

            if (parentNode && typeof lengths[end] === 'undefined') {
                // Modern browsers
                if ((parentNode as any).getSubStringLength) {
                    // Fails with DOM exception on unit-tests/legend/members
                    // of unknown reason. Desired width is 0, text content
                    // is "5" and end is 1.
                    try {
                        lengths[end] = startAt +
                            (parentNode as any).getSubStringLength(
                                0,
                                words ? end + 1 : end
                            );

                    } catch (e) {
                        '';
                    }

                // Legacy
                } else if (renderer.getSpanWidth) { // #9058 jsdom
                    textNode.textContent = getString(text || words, charEnd);
                    lengths[end] = startAt +
                        renderer.getSpanWidth(svgElement, textNode as any);
                }
            }
            return lengths[end];
        };

        svgElement.rotation = 0; // discard rotation when computing box
        actualWidth = getSubStringLength((textNode.textContent as any).length);

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
                textNode.textContent = '';

            // If the new text length is one less than the original, we don't
            // need the ellipsis
            } else if (!(text && maxIndex === text.length - 1)) {
                textNode.textContent = str || getString(text || words, currentIndex);
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

    /*
     * Un-escape HTML entities based on the public `renderer.escapes` list
     *
     * @private
     *
     * @param {string} inputStr The string to unescape
     * @param {Array<string>} [except] Exceptions
     *
     * @return {string} The processed string
     */
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
