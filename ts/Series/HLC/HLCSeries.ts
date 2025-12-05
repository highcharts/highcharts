/* *
 *
 *  (c) 2010-2025 Pawel Lysy
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

import type HLCSeriesOptions from './HLCSeriesOptions';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';

import HLCPoint from './HLCPoint.js';
import HLCSeriesDefaults from './HLCSeriesDefaults.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    column: ColumnSeries
} = SeriesRegistry.seriesTypes;
import U from '../../Core/Utilities.js';
const {
    crisp,
    extend,
    merge
} = U;

import D from '../../Core/Defaults.js';
const { defaultOptions } = D;

/* *
 *
 *  Class
 *
 * */

/**
 * The hlc series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.hlc
 *
 * @augments Highcharts.Series
 */
class HLCSeries extends ColumnSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions: HLCSeriesOptions = merge(
        ColumnSeries.defaultOptions,
        HLCSeriesDefaults
    );

    /* *
     *
     *  Properties
     *
     * */

    public data!: Array<HLCPoint>;

    public options!: HLCSeriesOptions;

    public points!: Array<HLCPoint>;

    public yData!: Array<Array<number>>;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Extend the path if close is not between high and low.
     *
     * @param {SVGPath} path the path array of the point
     * @param {number} halfStrokeWidth
     * @param {number} value value of the point to which the stem should be extended
     */
    protected extendStem(
        path: SVGPath,
        halfStrokeWidth: number,
        value: number
    ): void {
        const start = path[0];
        const end = path[1];

        // We don't need to worry about crisp - close value
        // is already crisped and halfStrokeWidth should remove it.
        if (typeof start[2] === 'number') {
            start[2] = Math.max(
                value + halfStrokeWidth,
                start[2]
            );
        }
        if (typeof end[2] === 'number') {
            end[2] = Math.min(
                value - halfStrokeWidth,
                end[2]
            );
        }

    }

    /**
     * Function to create SVGPath of the point based on the plot positions of
     * this point.
     * @private
     */
    protected getPointPath(point: HLCPoint): SVGPath {
        // Crisp vector coordinates
        const series = point.series,
            strokeWidth = series.borderWidth,
            // #2596:
            crispX = crisp(point.plotX || 0, strokeWidth),
            halfWidth = Math.round((point.shapeArgs as any).width / 2);

        // The vertical stem
        const path: SVGPath = [
            ['M', crispX, Math.round(point.yBottom as any)],
            ['L', crispX, Math.round(point.plotHigh as any)]
        ];

        // Close
        if (point.close !== null) {
            const plotClose = crisp(point.plotClose, strokeWidth);
            path.push(
                ['M', crispX, plotClose],
                ['L', crispX + halfWidth, plotClose]
            );

            series.extendStem(path, strokeWidth / 2, plotClose);
        }
        return path;
    }

    /**
     * @private
     * @function Highcharts.seriesTypes.hlc#init
     */
    public init(): void {
        super.init.apply(this, arguments as any);

        this.options.stacking = void 0; // #8817
    }

    /**
     * Postprocess mapping between options and SVG attributes
     * @private
     */
    public pointAttribs(
        point: HLCPoint,
        state: StatesOptionsKey
    ): SVGAttributes {
        const attribs = super.pointAttribs.call(
            this,
            point,
            state
        );

        delete attribs.fill;

        return attribs;
    }

    public toYData(point: HLCPoint): Array<number> {
        // Return a plain array for speedy calculation
        return [point.high, point.low, point.close];
    }

    /**
     * Translate data points from raw values x and y to plotX and plotY
     *
     * @private
     * @function Highcharts.seriesTypes.hlc#translate
     */
    public translate(): void {
        const series = this,
            yAxis = series.yAxis,
            names = (this.pointArrayMap && this.pointArrayMap.slice()) || [],
            translated = names.map(
                (name: string): string =>
                    `plot${name.charAt(0).toUpperCase() + name.slice(1)}`
            ),
            lineWidth = series.options.lineWidth ?? 1;
        translated.push('yBottom');
        names.push('low');
        super.translate.apply(series);

        series.borderWidth = lineWidth;

        // Do the translation
        series.points.concat(
            series.condemnedPoints as Array<HLCPoint>
        ).forEach((point): void => {
            names.forEach(
                function (name: string, i: number): void {
                    let value = (point as any)[name];
                    if (value !== null) {
                        if (series.dataModify) {
                            value = series.dataModify.modifyValue(value);
                        }
                        (point as any)[translated[i]] =
                            yAxis.toPixels(value, true);
                    }
                });

            // The data label box
            const {
                x = 0,
                y = 0,
                width = 0,
                height = 0
            } = point.shapeArgs || {};
            point.dlBox = { x, y, width, height };

            // The new shape args overwrite those of ColumnSeries
            point.shapeType = 'path';
            point.shapeArgs = { d: series.getPointPath(point) };

            // Align the tooltip to the high value to avoid covering the point
            (point.tooltipPos as any)[1] =
                (point.plotHigh as any) + yAxis.pos - series.chart.plotTop;
        });
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface HLCSeries {
    pointClass: typeof HLCPoint;
    pointAttrToOptions: Record<string, string>;
}
extend(HLCSeries.prototype, {
    pointClass: HLCPoint,
    animate: null as any, // Disable animation
    directTouch: false,
    keysAffectYAxis: ['low', 'high'],
    pointArrayMap: ['high', 'low', 'close'],
    pointAttrToOptions: {
        stroke: 'color',
        'stroke-width': 'lineWidth'
    },
    pointValKey: 'close'
});


// Extend default lang options with OHLC terms
const HLCDefaultLangOptions = {
    stockOpen: 'Open',
    stockHigh: 'High',
    stockLow: 'Low',
    stockClose: 'Close'
};

extend(
    defaultOptions.lang,
    HLCDefaultLangOptions
);

/* *
 *
 *  Registry
 *
 * */


declare module '../../Core/Options'{
    interface LangOptions {
        stockOpen?: string;
        stockHigh?: string;
        stockLow?: string;
        stockClose?: string;
    }
}

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        hlc: typeof HLCSeries;
    }
}
SeriesRegistry.registerSeriesType('hlc', HLCSeries);

/* *
 *
 *  Default Export
 *
 * */

export default HLCSeries;
