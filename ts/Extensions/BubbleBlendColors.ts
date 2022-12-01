/* *
 *
 *  (c) 2010-2022
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */
import ColorType from '../Core/Color/ColorType';
import Color from '../Core/Color/Color.js';
const { parse: color } = Color;
import { SymbolKey } from '../Core/Renderer/SVG/SymbolType';
import SeriesRegistry from '../Core/Series/SeriesRegistry.js';

const {
    seriesTypes: {
        bubble: BubbleSeries,
        scatter: ScatterSeries
    }
} = SeriesRegistry;

import U from '../Core/Utilities.js';
import Chart from '../Core/Chart/Chart';

import type BubbleSeriesType from '../Series/Bubble/BubbleSeries';
import Series from '../Core/Series/Series';

const {
    correctFloat,
    defined,
    addEvent,
    pick,
    isNumber,
    isArray,
    merge
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Series/SeriesLike' {
    interface SeriesLike {
        bubbleBlendColors?: BubbleBlendColorsComposition.Additions;
    }
}

declare module '../Series/Bubble/BubbleSeriesOptions' {
    interface BubbleSeriesOptions {
        bubbleBlendColors?: any;
    }
}

interface BubbleBlendColorsOptions {
    bubbleBlendColors: any;
}

/* *
 *
 *  Composition
 *
 * */

namespace BubbleBlendColorsComposition {

    /* *
    *
    *  Declarations
    *
    * */

    export declare class BubbleBlendColorsComposition extends BubbleSeries {
        bubbleBlendColors: Additions;
    }

    /* *
     *
     *  Constants
     *
     * */

    const composedClasses: Array<Function> = [];

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Extends the series with a small addition.
     *
     * @private
     *
     * @param BubbleSeriesClass
     * Series class to use.
     *
     */
    export function compose(
        BubbleSeriesClass: typeof BubbleSeries
    ): void {

        if (composedClasses.indexOf(BubbleSeriesClass) === -1) {
            composedClasses.push(BubbleSeriesClass);

            addEvent(BubbleSeries, 'afterInit', seriesAfterInit);

            BubbleSeriesClass.prototype.getRadius = getRadious;
            BubbleSeriesClass.prototype.drawPoints = seriesDrawPoints;
            BubbleSeriesClass.prototype.getPxExtremes = getPxExtremes;
        }

    }

    /**
     * Draw points
     * @private
     */
    function seriesDrawPoints(this: BubbleSeriesType): void {

        const series = this;

        if (!series.options.bubbleBlendColors) {
            // Run the parent method
            ScatterSeries.prototype.drawPoints.call(series);
        } else {
            const options = series.options,
                blendColors = series.options.bubbleBlendColors
                    .slice() // remove reference (for safe reverse)
                    .reverse(); // loop form backward (easier calculations)

            blendColors.forEach((
                color: ColorType | [number, ColorType],
                colorIndex: number
            ): void => {

                if (series.bubbleBlendColors) {
                    // Save size factor for further calculations
                    if (isArray(color)) { // if stops defined
                        series.bubbleBlendColors.bubbleSizeFactor = color[0];

                        color = color[1];
                    } else { // If size decreases evenly
                        series.bubbleBlendColors.bubbleBlendColorIndex =
                            colorIndex;
                    }

                    const fillColor = {
                        radialGradient: {
                            cx: 0.5,
                            cy: 0.5,
                            r: 0.5
                        },
                        stops: [
                            [0.5, color],
                            [1, (new Color(color)).setOpacity(0).get('rgba')]
                        ]
                    };

                    options.marker = merge(options.marker, { fillColor });

                    series.getRadii(); // recalculate radii

                    series.translateBubble(); // use radii

                    if (
                        options.marker.enabled !== false ||
                        series._hasPointMarkers
                    ) {
                        const points = series.points,
                            chart = series.chart,
                            markerGroup = (
                                (series as any)[series.specialGroup as any] ||
                                series.markerGroup
                            );

                        points.forEach((point): void => {
                            point.graphics = point.graphics || [];

                            let graphic = point.graphics[colorIndex];

                            const pointMarkerOptions = point.marker || {},
                                hasPointMarker = !!point.marker,
                                verb = graphic ? 'animate' : 'attr',
                                zMin = series.options.zMin,
                                shouldDrawMarker = (
                                    (
                                        (options.marker || {}).enabled &&
                                        typeof pointMarkerOptions.enabled ===
                                        'undefined'
                                    ) || pointMarkerOptions.enabled
                                ) &&
                                    !point.isNull &&
                                    point.visible !== false &&
                                    // Above zThreshold
                                    (
                                        !defined(zMin) ||
                                        (point.z && point.z >= zMin)
                                    );

                            if (shouldDrawMarker) {
                                const symbol = pick(
                                        pointMarkerOptions.symbol,
                                        series.symbol,
                                        'rect' as SymbolKey
                                    ),
                                    markerAttribs = series.markerAttribs(
                                        point,
                                        point.selected ? 'select' : void 0
                                    );

                                if (graphic) { // if exists
                                    // Update
                                    graphic.animate(markerAttribs);
                                } else if ( // if doesn't exist yet
                                    (markerAttribs.width || 0) > 0 ||
                                    point.hasImage
                                ) {
                                    // Create
                                    graphic = chart.renderer
                                        .symbol(
                                            symbol,
                                            markerAttribs.x,
                                            markerAttribs.y,
                                            markerAttribs.width,
                                            markerAttribs.height,
                                            hasPointMarker ?
                                                pointMarkerOptions :
                                                options.marker
                                        )
                                        .add(markerGroup);

                                    (graphic.element as any).point = point;

                                    point.graphics.push(graphic);
                                }

                                if (graphic) {
                                    // Styled Mode not supported at this moment
                                    if (!chart.styledMode) {
                                        const pointAttribs =
                                            series.pointAttribs(
                                                point,
                                                point.selected ?
                                                    'select' :
                                                    void 0
                                            ),
                                            attribs = merge(
                                                pointAttribs,
                                                verb === 'animate' ?
                                                    markerAttribs :
                                                    {},
                                                { zIndex: colorIndex }
                                            );

                                        graphic[verb](attribs);
                                    }

                                    graphic.addClass(
                                        point.getClassName(),
                                        true
                                    );
                                }
                            }
                        });
                    }
                }
            });

            // Set color for legend item marker
            if (options.marker) {
                options.marker.fillColor = series.color;
            }
        }
    }

    /**
     * Get the individual radius for one point.
     * @private
     */
    function getRadious(
        this: BubbleSeriesType,
        zMin: number,
        zMax: number,
        minSize: number,
        maxSize: number,
        value: (number | null | undefined),
        yValue?: (number | null | undefined)
    ): any {
        const options = this.options,
            sizeByArea = options.sizeBy !== 'width',
            zThreshold = options.zThreshold;

        let zRange = zMax - zMin,
            pos = 0.5;

        // #8608 - bubble should be visible when z is undefined
        if (yValue === null || value === null) {
            return null;
        }

        if (isNumber(value)) {
            // When sizing by threshold, the absolute value of z determines
            // the size of the bubble.
            if (options.sizeByAbsoluteValue) {
                value = Math.abs(value - (zThreshold as any));
                zMax = zRange = Math.max(
                    zMax - (zThreshold as any),
                    Math.abs(zMin - (zThreshold as any))
                );
                zMin = 0;
            }
            // Issue #4419 - if value is less than zMin, push a radius that's
            // always smaller than the minimum size
            if (value < zMin) {
                return minSize / 2 - 1;
            }

            // Relative size, a number between 0 and 1
            if (zRange > 0) {
                pos = (value - zMin) / zRange;
            }
        }

        if (sizeByArea && pos >= 0) {
            pos = Math.sqrt(pos);
        }

        let radius = Math.ceil(minSize + pos * (maxSize - minSize)) / 2;

        // Calculate radius of bubbles based on index of the color in the
        // series.blendColors array.
        if (this.options.bubbleBlendColors && this.bubbleBlendColors) {
            const colorIndex = this.bubbleBlendColors.bubbleBlendColorIndex ||
                0,
                sizeFactor = this.bubbleBlendColors.bubbleSizeFactor ?
                    // If stops defined
                    this.bubbleBlendColors.bubbleSizeFactor :
                    // If stops not defined, then bubbles sizes decrease evenly
                    // e.g. radii of 4 bubbles: 100%, 75%, 50%, 25%
                    1 - colorIndex / this.options.bubbleBlendColors.length;

            // Ceiling solves decimal issues and rounds to 1px
            radius = Math.ceil(correctFloat(radius * sizeFactor) * 2) / 2;
        }

        return radius;
    }

    /**
     * getExtremes
     * @private
     */
    function getPxExtremes(this: BubbleSeriesType, allowSmaller?: any): any {
        const smallestSize = Math.min(
            this.chart.plotWidth,
            this.chart.plotHeight
        );

        const getPxSize = (length: number | string = 1): number => {
            let isPercent;

            if (typeof length === 'string') {
                isPercent = /%$/.test(length);
                length = parseInt(length, 10);
            }
            return isPercent ? smallestSize * length / 100 : length;
        };

        let minPxSize = getPxSize(
            pick(this.options.minSize, BubbleSeries.defaultOptions.minSize)
        );
        // Prioritize min size if conflict to make sure bubbles are
        // always visible. #5873
        const maxPxSize = Math.max(
            getPxSize(
                pick(this.options.maxSize, BubbleSeries.defaultOptions.maxSize)
            ),
            minPxSize
        );

        if (
            allowSmaller &&
            this.options.bubbleBlendColors &&
            this.bubbleBlendColors
        ) {
            const sizeFactor = this.bubbleBlendColors.bubbleSizeFactor ||
                (1 / this.options.bubbleBlendColors.length);

            // Recalculate minPxSize to draw smaller bubbles for blendColors
            minPxSize = minPxSize * sizeFactor;
        }

        return { minPxSize, maxPxSize };
    }

    /**
     * Initialize bubbleBlendColors on series init.
     * @ignore
     */
    function seriesAfterInit(this: BubbleSeriesType): void {
        if (this.options.bubbleBlendColors) {
            this.bubbleBlendColors =
                new Additions(this as BubbleBlendColorsComposition);
        }
    }

    /* *
     *
     *  Classes
     *
     * */

    /**
     * @private
     */
    export class Additions {

        /* *
         *
         *  Constructors
         *
         * */

        /**
         * @private
         */
        public constructor(series: BubbleBlendColorsComposition) {
            this.series = series;
            this.options = series.options.bubbleBlendColors;
        }

        /* *
         *
         *  Properties
         *
         * */

        public options: BubbleBlendColorsOptions;

        public series: BubbleBlendColorsComposition;

        public bubbleSizeFactor?: any;

        public bubbleBlendColorIndex?: number;

    }
}

/* *
 *
 *  Default Export
 *
 * */

export default BubbleBlendColorsComposition;

/* *
 *
 *  API Options
 *
 * */

''; // keeps doclets above in transpiled file
