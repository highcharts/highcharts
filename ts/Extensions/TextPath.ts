/* *
 *
 *  Highcharts module with textPath functionality.
 *
 *  (c) 2009-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type PositionObject from '../Core/Renderer/PositionObject';
import type DataLabelOptions from '../Core/Series/DataLabelOptions';
import SVGElement from '../Core/Renderer/SVG/SVGElement';
import SVGAttributes from '../Core/Renderer/SVG/SVGAttributes';
import H from '../Core/Globals.js';
import Point from '../Core/Series/Point';
import BBoxObject from '../Core/Renderer/BBoxObject';
import {
    addEvent,
    defined,
    extend,
    merge,
    pushUnique
} from '../Shared/Utilities.js';
import { uniqueKey } from '../Core/Utilities.js';
import { DeepPartial } from '../Shared/Types';
const { composed, deg2rad } = H;

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Series/DataLabelOptions' {
    interface DataLabelOptions {
        /**
         * Options for a label text which should follow marker's shape.
         * Border and background are disabled for a label that follows a
         * path.
         *
         * **Note:** Only SVG-based renderer supports this option. Setting
         * `useHTML` to true will disable this option.
         *
         * Text path support is not bundled into `highcharts.js`, and requires
         * the `modules/textpath.js` file. However, it is included in the script
         * files of those series types that use it by default.
         *
         * @since 7.1.0
         */
        textPath?: DeepPartial<DataLabelTextPathOptions>;
    }
}

export interface DataLabelTextPathOptions {
    /**
     * Presentation attributes for the text path.
     *
     * @default { dy:-5, startOffset:'50%', textAnchor:'middle' }
     * @since 7.1.0
     */
    attributes: TextPathAttributes;

    /**
     * Enable or disable `textPath` option for link's or marker's data
     * labels.
     *
     * @default true
     * @since 7.1.0
     */
    enabled: boolean;
}

export interface TextPathAttributes extends SVGAttributes {
    startOffset: string;
    textAnchor: 'start'|'middle'|'end';
    dy?: number;
}

/** @internal */
interface TextPathObject {

    /**
     * The path that the text should follow.
     * @internal
     */
    path: SVGElement;

    /**
     * Function to undo the text path.
     * @internal
     */
    undo: Function;

}

/** @internal */
declare module '../Core/Renderer/SVG/SVGElementBase' {
    interface SVGElementBase {

        /**
         * Set a text path for a `text` or `label` element, allowing the text to
         * flow along a path.
         *
         * In order to unset the path for an existing element, call
         * `setTextPath` with `{ enabled: false }` as the second argument.
         *
         * Text path support is not bundled into `highcharts.js`, and requires
         * the `modules/textpath.js` file. However, it is included in the script
         * files of those series types that use it by default.
         *
         * @sample highcharts/members/renderer-textpath/ Text path demonstrated
         *
         * @internal
         * @function Highcharts.SVGElement#setTextPath
         *
         * @param {Highcharts.SVGElement|undefined} path
         * Path to follow. If undefined, it allows changing options for the
         * existing path.
         *
         * @param {Highcharts.DataLabelsTextPathOptionsObject} textPathOptions
         * Options.
         *
         * @return {Highcharts.SVGElement}
         * Returns the SVGElement for chaining.
         */
        setTextPath(
            path: SVGElement|undefined,
            textPathOptions: DataLabelTextPathOptions
        ): SVGElement;

        /**
         * Text path applied to the element.
         * @internal
         */
        textPath?: TextPathObject;
    }
}

/* *
 *
 *  Functions
 *
 * */

/**
 * Set a text path for a `text` or `label` element, allowing the text to
 * flow along a path.
 *
 * In order to unset the path for an existing element, call `setTextPath`
 * with `{ enabled: false }` as the second argument.
 *
 * Text path support is not bundled into `highcharts.js`, and requires the
 * `modules/textpath.js` file. However, it is included in the script files of
 * those series types that use it by default.
 *
 * @sample highcharts/members/renderer-textpath/ Text path demonstrated
 *
 * @internal
 * @function Highcharts.SVGElement#setTextPath
 *
 * @param {Highcharts.SVGElement|undefined} path
 *        Path to follow. If undefined, it allows changing options for the
 *        existing path.
 *
 * @param {Highcharts.DataLabelsTextPathOptionsObject} textPathOptions
 *        Options.
 *
 * @return {Highcharts.SVGElement} Returns the SVGElement for chaining.
 */
function setTextPath(
    this: SVGElement,
    path: SVGElement|undefined,
    textPathOptions: Partial<DataLabelTextPathOptions>
): SVGElement {
    const url = this.renderer.url,
        textWrapper = this.text || this,
        textPath = textWrapper.textPath,
        { attributes, enabled }: DataLabelTextPathOptions = merge(
            // Defaults
            {
                enabled: true,
                attributes: {
                    dy: -5,
                    startOffset: '50%',
                    textAnchor: 'middle'
                }
            },
            textPathOptions
        );

    path = path || (textPath && textPath.path);

    // Remove previously added event
    textPath?.undo();

    if (path && enabled) {
        const undo = addEvent(textWrapper, 'afterModifyTree', (
            e: AnyRecord
        ): void => {

            if (path && enabled) {

                // Set ID for the path
                let textPathId = path.attr('id');
                if (!textPathId) {
                    path.attr('id', textPathId = uniqueKey());
                }

                // Set attributes for the <text>
                const textAttribs: SVGAttributes = {
                    // `dx`/`dy` options must by set on <text> (parent), the
                    // rest should be set on <textPath>
                    x: 0,
                    y: 0
                };

                if (defined(attributes.dx)) {
                    textAttribs.dx = attributes.dx;
                    delete attributes.dx;
                }
                if (defined(attributes.dy)) {
                    textAttribs.dy = attributes.dy;
                    delete attributes.dy;
                }
                textWrapper.attr(textAttribs);


                // Handle label properties
                this.attr({ transform: '' });
                if (this.box) {
                    this.box = this.box.destroy();
                }

                // Wrap the nodes in a textPath
                const children = e.nodes.slice(0);
                e.nodes.length = 0;
                e.nodes[0] = {
                    tagName: 'textPath',
                    attributes: extend(attributes, {
                        'text-anchor': attributes.textAnchor,
                        href: `${url}#${textPathId}`
                    }),
                    children
                };
            }
        });

        // Set the reference
        textWrapper.textPath = { path, undo };

    } else {
        textWrapper.attr({ dx: 0, dy: 0 });
        delete textWrapper.textPath;
    }

    if (this.added) {
        // Rebuild text after added
        textWrapper.textCache = '';
        this.renderer.buildText(textWrapper);
    }

    return this;
}

/**
 * Attach a polygon to a bounding box if the element contains a textPath.
 *
 * @internal
 * @function Highcharts.SVGElement#setPolygon
 *
 * @param {any} event
 *        An event containing a bounding box object
 *
 * @return {Highcharts.BBoxObject} Returns the bounding box object.
 */
function setPolygon(this: SVGElement, event: any): BBoxObject {
    const bBox = event.bBox,
        tp = this.element?.querySelector('textPath');

    if (tp) {
        const polygon: [number, number][] = [],
            { b, h } = this.renderer.fontMetrics(this.element),
            descender = h - b,
            lineCleanerRegex = new RegExp(
                '(<tspan>|' +
                '<tspan(?!\\sclass="highcharts-br")[^>]*>|' +
                '<\\/tspan>)',
                'g'
            ),
            lines = tp
                .innerHTML
                .replace(lineCleanerRegex, '')
                .split(
                    /<tspan class="highcharts-br"[^>]*>/
                ),
            numOfLines = lines.length;

        // Calculate top and bottom coordinates for
        // either the start or the end of a single
        // character, and append it to the polygon.
        const appendTopAndBottom = (
            charIndex: number,
            positionOfChar: PositionObject
        ): [[number, number], [number, number]] => {
            const { x, y } = positionOfChar,
                rotation = (
                    tp.getRotationOfChar(charIndex) - 90
                ) * deg2rad,
                cosRot = Math.cos(rotation),
                sinRot = Math.sin(rotation);
            return [
                [
                    x - descender * cosRot,
                    y - descender * sinRot
                ],
                [
                    x + b * cosRot,
                    y + b * sinRot
                ]
            ];
        };

        for (
            let i = 0, lineIndex = 0;
            lineIndex < numOfLines;
            lineIndex++
        ) {
            const line = lines[lineIndex],
                lineLen = line.length;

            for (
                let lineCharIndex = 0;
                lineCharIndex < lineLen;
                lineCharIndex += 5
            ) {
                try {
                    const srcCharIndex = (
                            i +
                            lineCharIndex +
                            lineIndex
                        ),
                        [lower, upper] = appendTopAndBottom(
                            srcCharIndex,
                            tp.getStartPositionOfChar(srcCharIndex)
                        );

                    if (lineCharIndex === 0) {
                        polygon.push(upper);
                        polygon.push(lower);
                    } else {
                        if (lineIndex === 0) {
                            polygon.unshift(upper);
                        }
                        if (lineIndex === numOfLines - 1) {
                            polygon.push(lower);
                        }
                    }
                } catch {
                    // Safari fails on getStartPositionOfChar even if the
                    // character is within the `textContent.length`
                    break;
                }
            }

            i += lineLen - 1;

            try {
                const srcCharIndex = i + lineIndex,
                    charPos = tp.getEndPositionOfChar(srcCharIndex),
                    [lower, upper] = appendTopAndBottom(
                        srcCharIndex,
                        charPos
                    );
                polygon.unshift(upper);
                polygon.unshift(lower);
            } catch {
                // Safari fails on getStartPositionOfChar even if the character
                // is within the `textContent.length`
                break;
            }
        }

        // Close it
        if (polygon.length) {
            polygon.push(polygon[0].slice() as [number, number]);
        }

        bBox.polygon = polygon;
    }
    return bBox;
}

/**
 * Draw text along a textPath for a dataLabel.
 *
 * @internal
 * @function Highcharts.SVGElement#drawTextPath
 *
 * @param {any} event
 *        An event containing label options
 *
 * @return {void}
 */
function drawTextPath(
    this: SVGElement,
    event: any
): void {
    const labelOptions: DataLabelOptions = event.labelOptions,
        point: Point = event.point,
        textPathOptions = (
            (labelOptions as any)[point.formatPrefix + 'TextPath'] ||
            labelOptions.textPath
        );

    if (textPathOptions && !labelOptions.useHTML) {
        this.setTextPath(
            point.getDataLabelPath?.(this) || point.graphic,
            textPathOptions
        );

        if (
            point.dataLabelPath &&
            !textPathOptions.enabled
        ) {
            // Clean the DOM
            point.dataLabelPath = point.dataLabelPath.destroy();
        }
    }
}

/** @internal */
export function composeTextPath(SVGElementClass: typeof SVGElement): void {
    if (pushUnique(composed, 'TextPath')) {
        addEvent(SVGElementClass, 'afterGetBBox', setPolygon);
        addEvent(SVGElementClass, 'beforeAddingDataLabel', drawTextPath);

        SVGElementClass.prototype.setTextPath =
            SVGElementClass.prototype.setTextPath ?? setTextPath;
    }
}

/* *
 *
 *  API Declarations
 *
 * */

/**
 * Options for a label text which should follow marker's shape.
 * Border and background are disabled for a label that follows a
 * path.
 *
 * **Note:** Only SVG-based renderer supports this option. Setting
 * `useHTML` to true will disable this option.
 *
 * Text path support is not bundled into `highcharts.js`, and requires the
 * `modules/textpath.js` file. However, it is included in the script files of
 * those series types that use it by default.
 *
 * @declare   Highcharts.DataLabelsTextPathOptionsObject
 * @since     7.1.0
 * @apioption plotOptions.series.dataLabels.textPath
 */

/**
 * Presentation attributes for the text path.
 *
 * @type      {Highcharts.SVGAttributes}
 * @since     7.1.0
 * @default   { dy:-5, startOffset:'50%', textAnchor:'middle' }
 * @apioption plotOptions.series.dataLabels.textPath.attributes
 */

/**
 * Enable or disable `textPath` option for link's or marker's data
 * labels.
 *
 * @type      {boolean}
 * @since     7.1.0
 * @default   true
 * @apioption plotOptions.series.dataLabels.textPath.enabled
 */

(''); // Keep doclets above in transpiled file
