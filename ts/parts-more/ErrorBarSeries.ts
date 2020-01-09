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

import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class ErrorBarPoint extends BoxPlotPoint {
            public options: ErrorBarPointOptions;
            public series: ErrorBarSeries;
        }
        class ErrorBarSeries extends BoxPlotSeries {
            public data: Array<ErrorBarPoint>;
            public doQuartiles: boolean;
            public linkedParent: ErrorBarSeries;
            public options: ErrorBarSeriesOptions;
            public pointArrayMap: Array<string>;
            public pointClass: typeof ErrorBarPoint;
            public points: Array<ErrorBarPoint>;
            public pointValKey: string;
            public type: string;
            public getColumnMetrics(): ColumnMetricsObject;
            public drawDataLabels(): void;
            public toYData(point: ErrorBarPoint): Array<number>;
        }
        interface ErrorBarPointOptions extends BoxPlotPointOptions {
        }
        interface ErrorBarSeriesOptions extends BoxPlotSeriesOptions {
            states?: SeriesStatesOptionsObject<ErrorBarSeries>;
            whiskerWidth?: number;
        }
        interface SeriesTypesDictionary {
            errorbar: typeof ErrorBarSeries;
        }
    }
}

import '../parts/Utilities.js';
import '../parts/Options.js';
import './BoxPlotSeries.js';

var noop = H.noop,
    seriesType = H.seriesType,
    seriesTypes = H.seriesTypes;

/**
 * Error bars are a graphical representation of the variability of data and are
 * used on graphs to indicate the error, or uncertainty in a reported
 * measurement.
 *
 * @sample highcharts/demo/error-bar/
 *         Error bars on a column series
 * @sample highcharts/series-errorbar/on-scatter/
 *         Error bars on a scatter series
 *
 * @extends      plotOptions.boxplot
 * @product      highcharts highstock
 * @requires     highcharts-more
 * @optionparent plotOptions.errorbar
 */
seriesType<Highcharts.ErrorBarSeries>('errorbar', 'boxplot', {

    /**
     * The main color of the bars. This can be overridden by
     * [stemColor](#plotOptions.errorbar.stemColor) and
     * [whiskerColor](#plotOptions.errorbar.whiskerColor) individually.
     *
     * @sample {highcharts} highcharts/plotoptions/error-bar-styling/
     *         Error bar styling
     *
     * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @default #000000
     * @since   3.0
     * @product highcharts
     */
    color: '${palette.neutralColor100}',

    grouping: false,

    /**
     * The parent series of the error bar. The default value links it to
     * the previous series. Otherwise, use the id of the parent series.
     *
     * @since   3.0
     * @product highcharts
     */
    linkedTo: ':previous',

    tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>'
    },

    /**
     * The line width of the whiskers, the horizontal lines marking low
     * and high values. When `null`, the general
     * [lineWidth](#plotOptions.errorbar.lineWidth) applies.
     *
     * @sample {highcharts} highcharts/plotoptions/error-bar-styling/
     *         Error bar styling
     *
     * @type    {number}
     * @since   3.0
     * @product highcharts
     */
    whiskerWidth: null as any

// Prototype members
}, {
    type: 'errorbar',
    // array point configs are mapped to this
    pointArrayMap: ['low', 'high'],
    // return a plain array for speedy calculation
    toYData: function (point: Highcharts.ErrorBarPoint): Array<number> {
        return [point.low, point.high];
    },
    pointValKey: 'high', // defines the top of the tracker
    doQuartiles: false,
    drawDataLabels: seriesTypes.arearange ?
        function (this: Highcharts.ErrorBarSeries): void {
            var valKey = this.pointValKey;

            seriesTypes.arearange.prototype.drawDataLabels.call(this);
            // Arearange drawDataLabels does not reset point.y to high,
            // but to low after drawing (#4133)
            this.data.forEach(function (point: Highcharts.ErrorBarPoint): void {
                point.y = (point as any)[valKey];
            });
        } :
        noop as any,

    // Get the width and X offset, either on top of the linked series column or
    // standalone
    getColumnMetrics: function (
        this: Highcharts.ErrorBarSeries
    ): Highcharts.ColumnMetricsObject {
        return (
            (this.linkedParent && this.linkedParent.columnMetrics) ||
            (
                seriesTypes.column.prototype as Highcharts.ColumnSeries
            ).getColumnMetrics.call(this)
        );
    }
});

/**
 * A `errorbar` series. If the [type](#series.errorbar.type) option
 * is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.errorbar
 * @excluding dataParser, dataURL, stack, stacking
 * @product   highcharts
 * @requires  highcharts-more
 * @apioption series.errorbar
 */

/**
 * An array of data points for the series. For the `errorbar` series
 * type, points can be given in the following ways:
 *
 * 1. An array of arrays with 3 or 2 values. In this case, the values correspond
 *    to `x,low,high`. If the first value is a string, it is applied as the name
 *    of the point, and the `x` value is inferred. The `x` value can also be
 *    omitted, in which case the inner arrays should be of length 2\. Then the
 *    `x` value is automatically calculated, either starting at 0 and
 *    incremented by 1, or from `pointStart` and `pointInterval` given in the
 *    series options.
 *    ```js
 *    data: [
 *        [0, 10, 2],
 *        [1, 1, 8],
 *        [2, 4, 5]
 *    ]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.errorbar.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        low: 0,
 *        high: 0,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        low: 5,
 *        high: 5,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * @sample {highcharts} highcharts/series/data-array-of-arrays/
 *         Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *         Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/
 *         Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type      {Array<Array<(number|string),number>|Array<(number|string),number,number>|*>}
 * @extends   series.arearange.data
 * @excluding dataLabels, drilldown, marker, states
 * @product   highcharts
 * @apioption series.errorbar.data
 */

''; // adds doclets above to transpiled file
