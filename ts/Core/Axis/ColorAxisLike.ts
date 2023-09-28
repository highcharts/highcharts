/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type AxisComposition from './AxisComposition';
import type AxisOptions from './AxisOptions';
import type Chart from '../Chart/Chart';
import type ColorType from '../Color/ColorType';
import type { GradientColorStop } from '../Color/GradientColor';
import type Point from '../Series/Point';

import Color from '../Color/Color.js';
const { parse: color } = Color;
import U from '../Utilities.js';
const { merge } = U;

/* *
 *
 *  Declarations
 *
 * */

interface ColorAxisLike extends AxisComposition {
    chart: Chart;
    dataClasses: Array<ColorAxisLike.DataClassOptions>;
    index: number;
    options: ColorAxisLike.Options;
    stops: Array<GradientColorStop>;
    initDataClasses(userOptions: ColorAxisLike.Options): void;
    initStops(): void;
    normalizedValue(value: number): number;
    toColor(value: number, point: Point): (ColorType|undefined);
}

/* *
 *
 *  Namespace
 *
 * */

namespace ColorAxisLike {

    /* *
     *
     *  Declarations
     *
     * */

    export interface Options extends AxisOptions {
        dataClassColor?: string;
        dataClasses?: Array<DataClassOptions>;
        maxColor?: ColorType;
        minColor?: ColorType;
        stops?: Array<GradientColorStop>;
    }

    export interface DataClassOptions {
        color?: ColorType;
        colorIndex?: number;
        from?: number;
        name?: string;
        to?: number;
    }

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Initialize defined data classes.
     * @private
     */
    export function initDataClasses(
        this: ColorAxisLike,
        userOptions: Options
    ): void {
        const chart = this.chart,
            options = this.options,
            userDataClasses = userOptions.dataClasses || [];

        let dataClass: DataClassOptions,
            dataClasses: Array<DataClassOptions>,
            colorCounter = 0;

        this.dataClasses = dataClasses = [];

        for (let i = 0, iEnd = userDataClasses.length; i < iEnd; ++i) {
            dataClass = userDataClasses[i];

            let colors: (Array<string>|undefined);

            dataClass = merge(dataClass);
            dataClasses.push(dataClass);

            if (!dataClass.color) {
                if (options.dataClassColor === 'category') {
                    colors = chart.options.colors;
                    dataClass.color = (colors as any)[colorCounter++];
                    // Loop back to zero
                    if (colorCounter === (colors as any).length) {
                        colorCounter = 0;
                    }
                } else {
                    dataClass.color = color(options.minColor).tweenTo(
                        color(options.maxColor),
                        i / ((userOptions.dataClasses as any).length - 1)
                    );
                }
            }
        }
    }

    /**
     * Create initial color stops.
     * @private
     */
    export function initStops(
        this: ColorAxisLike
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
     * @private
     */
    export function normalizedValue(
        this: ColorAxisLike,
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
     * @private
     */
    export function toColor(
        this: ColorAxisLike,
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
                if ((typeof from === 'undefined' || value >= from) &&
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

export default ColorAxisLike;
