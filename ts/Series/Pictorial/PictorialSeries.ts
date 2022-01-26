/* *
 *
 *  (c) 2010-2021 Kacper Madej
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
import '../Column/ColumnSeries.js';
import '../../Extensions/PatternFill.js';

import type PictorialSeriesOptions from './PictorialSeriesOptions';

import PictorialPoint from './PictorialPoint.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath.js';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement.js';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';
const {
    seriesTypes: {
        column: ColumnSeries
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
import SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes.js';
const {
    extend,
    merge,
    addEvent
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * The pictorial series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.pictorial
 *
 * @augments Highcharts.Series
 */
class PictorialSeries extends ColumnSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * A pictorial graph is a variation of a column graph. The biggest
     * difference is related to the shape of the data point, taken
     * from the path parameter.
     *
     * @sample {highcharts} highcharts/demo/pictorial-graph/
     *         Pictorial graph
     *
     * @extends      plotOptions.column
     * @since        6.0.0
     * @product      highcharts
     * @excluding    allAreas, boostThreshold, colorAxis, compare, compareBase,
     *               dataSorting, boostBlending
     * @requires     modules/pictorial
     * @optionparent plotOptions.pictorial
     */

    public static defaultOptions: PictorialSeriesOptions = merge(ColumnSeries.defaultOptions, {

        borderWidth: 10,
        tooltip: {
            pointFormat: 'AAA whatever'
        }
    } as PictorialSeriesOptions);

    /* *
     *
     * Properties
     *
     * */

    public paths: string | SVGPath | undefined = void 0 as any;

    public data: Array<PictorialPoint> = void 0 as any;

    public options: PictorialSeriesOptions = void 0 as any;

    public points: Array<PictorialPoint> = void 0 as any;

    /* *
     *
     * Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Draws the targets. For inverted chart, the `series.group` is rotated,
     * so the same coordinates apply. This method is based on column series
     * drawPoints function.
     *
     * @ignore
     * @function Highcharts.Series#drawPoints
     */
    public drawPoints(): void {
        const series = this;

        super.drawPoints.apply(this, arguments);
    }

    public pointAttribs(
        point?: PictorialPoint,
        selected?: StatesOptionsKey
    ): SVGAttributes {
        const pointAttribs = super.pointAttribs.apply(this, arguments);
        const seriesOptions = this.options;

        if (point && point.shapeArgs && seriesOptions.paths) {
            pointAttribs.fill = {
                pattern: {
                    path: {
                        d: seriesOptions.paths[
                            point.index % seriesOptions.paths.length
                        ] as unknown as SVGPath,
                        fill: pointAttribs.fill,
                        strokeWidth: 0,
                        stroke: pointAttribs.stroke
                    },
                    x: point.shapeArgs.x,
                    y: 0,
                    width: point.shapeArgs.width || 0,
                    height: point.series.yAxis.len,
                    patternContentUnits: 'objectBoundingBox',
                    backgroundColor: 'none',
                    color: '#ff0000'
                }
            };
        }

        delete pointAttribs.stroke;
        delete pointAttribs.strokeWidth;
        return pointAttribs;
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Events
 *
 * */

addEvent(PictorialSeries, 'afterRender', function (): void {
    const series = this;
    series.points.forEach(function (point: PictorialPoint): void {
        const fill = point.graphic && point.graphic.attr('fill') as string;
        const match = fill && fill.match(/url\(([^)]+)\)/);
        if (match) {
            const patternPath = document.querySelector(`${match[1]} path`) as unknown as SVGElement;
            if (patternPath) {
                const bBox = patternPath.getBBox();
                const scaleX = 1 / bBox.width;
                const scaleY = series.yAxis.len /
                    (
                        point.shapeArgs &&
                        point.shapeArgs.height ||
                        Infinity
                    ) /
                    bBox.height;

                patternPath.setAttribute(
                    'transform',
                    `scale(${scaleX} ${scaleY}) ` +
                    `translate(${-bBox.x}, ${-bBox.y})`
                );
            }
        }
    });
});

/* *
 *
 *  Class Prototype
 *
 * */

interface PictorialSeries {
    parallelArrays: Array<string>;
    pointArrayMap: Array<string>;
    pointClass: typeof PictorialPoint;
}
extend(PictorialSeries.prototype, {
    parallelArrays: ['x', 'y', 'target'],
    pointArrayMap: ['y', 'target']
});

PictorialSeries.prototype.pointClass = PictorialPoint;

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        pictorial: typeof PictorialSeries;
    }
}
SeriesRegistry.registerSeriesType('pictorial', PictorialSeries);

/* *
 *
 *  Default Export
 *
 * */

export default PictorialSeries;

/* *
 *
 * API Options
 *
 * */

/**
 * A `pictorial` series. If the [type](#series.pictorial.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.pictorial
 * @since     6.0.0
 * @product   highcharts
 * @excluding dataParser, dataURL, marker, dataSorting, boostThreshold,
 *            boostBlending
 * @requires  modules/pictorial
 * @apioption series.pictorial
 */

/**
 * An array of data points for the series. For the `pictorial` series type,
 * points can be given in the following ways:
 *
 * 1. An array of arrays with 3 or 2 values. In this case, the values correspond
 *    to `x,y,target`. If the first value is a string, it is applied as the name
 *    of the point, and the `x` value is inferred. The `x` value can also be
 *    omitted, in which case the inner arrays should be of length 2\. Then the
 *    `x` value is automatically calculated, either starting at 0 and
 *    incremented by 1, or from `pointStart` and `pointInterval` given in the
 *    series options.
 *    ```js
 *    data: [
 *        [0, 40, 75],
 *        [1, 50, 50],
 *        [2, 60, 40]
 *    ]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.bullet.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 0,
 *        y: 40,
 *        target: 75,
 *        name: "Point1",
 *        color: "#00FF00"
 *    }, {
 *         x: 1,
 *        y: 60,
 *        target: 40,
 *        name: "Point2",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * @type      {Array<Array<(number|string),number>|Array<(number|string),number,number>|*>}
 * @extends   series.column.data
 * @since     6.0.0
 * @product   highcharts
 * @apioption series.bullet.data
 */

/**
 * The target value of a point.
 *
 * @type      {number}
 * @since     6.0.0
 * @product   highcharts
 * @apioption series.bullet.data.target
 */

/**
 * Individual target options for each point.
 *
 * @extends   plotOptions.bullet.targetOptions
 * @product   highcharts
 * @apioption series.bullet.data.targetOptions
 */

/**
 * @product   highcharts
 * @excluding halo, lineWidth, lineWidthPlus, marker
 * @apioption series.bullet.states.hover
 */

/**
 * @product   highcharts
 * @excluding halo, lineWidth, lineWidthPlus, marker
 * @apioption series.bullet.states.select
 */

''; // adds doclets above to transpiled file
