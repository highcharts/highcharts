/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
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

import type AxisComposition from '../AxisComposition';
import type AxisOptions from '../AxisOptions';
import type Chart from '../../Chart/Chart';
import type { ColorAxisDataClassOptions } from './ColorAxisOptions';
import type ColorType from '../../Color/ColorType';
import type { GradientColorStop } from '../../Color/GradientColor';
import type Point from '../../Series/Point';

import Color from '../../Color/Color.js';
const { parse: color } = Color;
import U from '../../Utilities.js';
const { merge } = U;

/* *
 *
 *  Declarations
 *
 * */

interface ColorAxisBase extends AxisComposition {

    /** @internal */
    chart: Chart;

    /** @internal */
    dataClasses: Array<ColorAxisDataClassOptions>;

    /** @internal */
    index: number;

    /** @internal */
    options: ColorAxisBase.Options;

    /** @internal */
    stops: Array<GradientColorStop>;

    /** @internal */
    initDataClasses(userOptions: Partial<ColorAxisBase.Options>): void;

    /** @internal */
    initStops(): void;

    /** @internal */
    normalizedValue(value: number): number;

    /** @internal */
    toColor(value: number, point: Point): (ColorType|undefined);

}

/* *
 *
 *  Namespace
 *
 * */

/** @internal */
namespace ColorAxisBase {

    /* *
     *
     *  Declarations
     *
     * */

    export interface Options extends AxisOptions {
        dataClassColor?: string;
        dataClasses?: Array<ColorAxisDataClassOptions>;
        maxColor?: ColorType;
        minColor?: ColorType;
        stops?: Array<GradientColorStop>;
    }

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Initialize defined data classes.
     * @internal
     */
    export function initDataClasses(
        this: ColorAxisBase,
        userOptions: Partial<Options>
    ): void {
        const axis = this,
            chart = axis.chart,
            legendItem = axis.legendItem = axis.legendItem || {},
            options = axis.options,
            userDataClasses = userOptions.dataClasses || [];

        let dataClass: ColorAxisDataClassOptions,
            dataClasses: Array<ColorAxisDataClassOptions>,
            colorCount = chart.options.chart.colorCount,
            colorCounter = 0,
            colors: (Array<string>|undefined);

        axis.dataClasses = dataClasses = [];
        legendItem.labels = [];

        for (let i = 0, iEnd = userDataClasses.length; i < iEnd; ++i) {
            dataClass = userDataClasses[i];

            dataClass = merge(dataClass);
            dataClasses.push(dataClass);

            if (!chart.styledMode && dataClass.color) {
                continue;
            }

            if (options.dataClassColor === 'category') {
                if (!chart.styledMode) {
                    colors = chart.options.colors || [];
                    colorCount = colors.length;
                    dataClass.color = colors[colorCounter];
                }

                dataClass.colorIndex = colorCounter;

                // Loop back to zero
                colorCounter++;
                if (colorCounter === colorCount) {
                    colorCounter = 0;
                }
            } else {
                dataClass.color = color(options.minColor).tweenTo(
                    color(options.maxColor),
                    iEnd < 2 ? 0.5 : i / (iEnd - 1) // #3219
                );
            }
        }
    }

    /**
     * Create initial color stops.
     * @internal
     */
    export function initStops(
        this: ColorAxisBase
    ): void {
        const axis = this,
            options = axis.options,
            stops = axis.stops = options.stops || [
                [0, options.minColor || ''],
                [1, options.maxColor || '']
            ];

        for (let i = 0, iEnd = stops.length; i < iEnd; ++i) {
            stops[i].color = color(stops[i][1]);
        }
    }

    /**
     * Normalize logarithmic values.
     * @internal
     */
    export function normalizedValue(
        this: ColorAxisBase,
        value: number
    ): number {
        const axis = this,
            max = axis.max || 0,
            min = axis.min || 0;

        if (axis.logarithmic) {
            value = axis.logarithmic.log2lin(value);
        }

        return 1 - (
            (max - value) /
            ((max - min) || 1)
        );
    }

    /**
     * Translate from a value to a color.
     * @internal
     */
    export function toColor(
        this: ColorAxisBase,
        value: number,
        point: Point
    ): (ColorType|undefined) {
        const axis = this;
        const dataClasses = axis.dataClasses;
        const stops = axis.stops;

        let pos,
            from,
            to,
            color: (ColorType|undefined),
            dataClass,
            i;

        if (dataClasses) {
            i = dataClasses.length;
            while (i--) {
                dataClass = dataClasses[i];
                from = dataClass.from;
                to = dataClass.to;
                if (
                    (typeof from === 'undefined' || value >= from) &&
                    (typeof to === 'undefined' || value <= to)
                ) {

                    color = dataClass.color;

                    if (point) {
                        point.dataClass = i;
                        point.colorIndex = dataClass.colorIndex;
                    }
                    break;
                }
            }

        } else {
            pos = axis.normalizedValue(value);
            i = stops.length;
            while (i--) {
                if (pos > stops[i][0]) {
                    break;
                }
            }
            from = stops[i] || stops[i + 1];
            to = stops[i + 1] || from;

            // The position within the gradient
            pos = 1 - (to[0] - pos) / ((to[0] - from[0]) || 1);

            color = (from.color as any).tweenTo(
                to.color,
                pos
            );
        }

        return color;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default ColorAxisBase;
