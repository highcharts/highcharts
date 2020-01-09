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
        class BoxPlotPoint extends ColumnPoint {
            public box: SVGElement;
            public fillColor: (ColorString|GradientColorObject|PatternObject);
            public high: number;
            public highPlot: number;
            public low: number;
            public lowPlot: number;
            public median: number;
            public medianColor: (ColorString|GradientColorObject);
            public medianPlot: number;
            public medianShape: SVGElement;
            public medianWidth: number;
            public options: BoxPlotPointOptions;
            public q1: number;
            public q1Plot: number;
            public q3: number;
            public q3Plot: number;
            public series: BoxPlotSeries;
            public shapeArgs: SVGAttributes;
            public stem: SVGElement;
            public stemColor: (ColorString|GradientColorObject|PatternObject);
            public stemDashStyle: DashStyleValue;
            public stemWidth: number;
            public whiskerColor: (
                ColorString|GradientColorObject|PatternObject
            );
            public whiskers: SVGElement;
            public whiskerLength: (number|string);
            public whiskerWidth: number;
        }
        class BoxPlotSeries extends ColumnSeries {
            public data: Array<BoxPlotPoint>;
            public doQuartiles?: boolean;
            public options: BoxPlotSeriesOptions;
            public pointArrayMap: Array<string>;
            public pointClass: typeof BoxPlotPoint;
            public points: Array<BoxPlotPoint>;
            public pointValKey: string;
            public drawPoints(): void;
            public toYData(point: BoxPlotPoint): Array<number>;
            public translate(): void;
        }
        interface BoxPlotPointOptions extends ColumnPointOptions {
            high?: BoxPlotPoint['high'];
            low?: BoxPlotPoint['low'];
            median?: BoxPlotPoint['median'];
            q1?: BoxPlotPoint['q1'];
            q3?: BoxPlotPoint['q3'];
        }
        interface BoxPlotSeriesOptions extends ColumnSeriesOptions {
            fillColor?: BoxPlotPoint['fillColor'];
            medianColor?: BoxPlotPoint['medianColor'];
            medianWidth?: BoxPlotPoint['medianWidth'];
            states?: SeriesStatesOptionsObject<BoxPlotSeries>;
            stemColor?: BoxPlotPoint['stemColor'];
            stemDashStyle?: BoxPlotPoint['stemDashStyle'];
            stemWidth?: BoxPlotPoint['stemWidth'];
            whiskerColor?: BoxPlotPoint['whiskerColor'];
            whiskerLength?: BoxPlotPoint['whiskerLength'];
            whiskerWidth?: BoxPlotPoint['whiskerWidth'];
        }
        interface SeriesTypesDictionary {
            boxplot: typeof BoxPlotSeries;
        }
    }
}

import U from '../parts/Utilities.js';
const {
    pick
} = U;

import '../parts/Options.js';

var noop = H.noop,
    seriesType = H.seriesType,
    seriesTypes = H.seriesTypes;

/**
 * The boxplot series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes#boxplot
 *
 * @augments Highcharts.Series
 */

/**
 * A box plot is a convenient way of depicting groups of data through their
 * five-number summaries: the smallest observation (sample minimum), lower
 * quartile (Q1), median (Q2), upper quartile (Q3), and largest observation
 * (sample maximum).
 *
 * @sample highcharts/demo/box-plot/
 *         Box plot
 *
 * @extends      plotOptions.column
 * @excluding    borderColor, borderRadius, borderWidth, groupZPadding, states
 * @product      highcharts
 * @requires     highcharts-more
 * @optionparent plotOptions.boxplot
 */
seriesType<Highcharts.BoxPlotSeries>('boxplot', 'column', {

    threshold: null as any,

    tooltip: {
        pointFormat:
            '<span style="color:{point.color}">\u25CF</span> <b> ' +
            '{series.name}</b><br/>' +
            'Maximum: {point.high}<br/>' +
            'Upper quartile: {point.q3}<br/>' +
            'Median: {point.median}<br/>' +
            'Lower quartile: {point.q1}<br/>' +
            'Minimum: {point.low}<br/>'
    },

    /**
     * The length of the whiskers, the horizontal lines marking low and
     * high values. It can be a numerical pixel value, or a percentage
     * value of the box width. Set `0` to disable whiskers.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         True by default
     *
     * @type    {number|string}
     * @since   3.0
     * @product highcharts
     */
    whiskerLength: '50%',

    /**
     * The fill color of the box.
     *
     * In styled mode, the fill color can be set with the
     * `.highcharts-boxplot-box` class.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     *
     * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @default #ffffff
     * @since   3.0
     * @product highcharts
     */
    fillColor: '${palette.backgroundColor}',

    /**
     * The width of the line surrounding the box. If any of
     * [stemWidth](#plotOptions.boxplot.stemWidth),
     * [medianWidth](#plotOptions.boxplot.medianWidth)
     * or [whiskerWidth](#plotOptions.boxplot.whiskerWidth) are `null`,
     * the lineWidth also applies to these lines.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     * @sample {highcharts} highcharts/plotoptions/error-bar-styling/
     *         Error bar styling
     *
     * @since   3.0
     * @product highcharts
     */
    lineWidth: 1,

    /**
     * The color of the median line. If `undefined`, the general series color
     * applies.
     *
     * In styled mode, the median stroke width can be set with the
     * `.highcharts-boxplot-median` class.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     * @sample {highcharts} highcharts/css/boxplot/
     *         Box plot in styled mode
     * @sample {highcharts} highcharts/plotoptions/error-bar-styling/
     *         Error bar styling
     *
     * @type      {Highcharts.ColorString|Highcharts.GradientColorObject}
     * @since     3.0
     * @product   highcharts
     * @apioption plotOptions.boxplot.medianColor
     */

    /**
     * The pixel width of the median line. If `null`, the
     * [lineWidth](#plotOptions.boxplot.lineWidth) is used.
     *
     * In styled mode, the median stroke width can be set with the
     * `.highcharts-boxplot-median` class.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     * @sample {highcharts} highcharts/css/boxplot/
     *         Box plot in styled mode
     *
     * @since   3.0
     * @product highcharts
     */
    medianWidth: 2,

    /*
    // States are not working and are removed from docs.
    // Refer to: #2340
    states: {
        hover: {
            brightness: -0.3
        }
    },

    /**
     * The color of the stem, the vertical line extending from the box to
     * the whiskers. If `undefined`, the series color is used.
     *
     * In styled mode, the stem stroke can be set with the
     * `.highcharts-boxplot-stem` class.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     * @sample {highcharts} highcharts/css/boxplot/
     *         Box plot in styled mode
     * @sample {highcharts} highcharts/plotoptions/error-bar-styling/
     *         Error bar styling
     *
     * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @since     3.0
     * @product   highcharts
     * @apioption plotOptions.boxplot.stemColor
     */

    /**
     * The dash style of the stem, the vertical line extending from the
     * box to the whiskers.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     * @sample {highcharts} highcharts/css/boxplot/
     *         Box plot in styled mode
     * @sample {highcharts} highcharts/plotoptions/error-bar-styling/
     *         Error bar styling
     *
     * @type      {Highcharts.DashStyleValue}
     * @default   Solid
     * @since     3.0
     * @product   highcharts
     * @apioption plotOptions.boxplot.stemDashStyle
     */

    /**
     * The width of the stem, the vertical line extending from the box to
     * the whiskers. If `undefined`, the width is inherited from the
     * [lineWidth](#plotOptions.boxplot.lineWidth) option.
     *
     * In styled mode, the stem stroke width can be set with the
     * `.highcharts-boxplot-stem` class.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     * @sample {highcharts} highcharts/css/boxplot/
     *         Box plot in styled mode
     * @sample {highcharts} highcharts/plotoptions/error-bar-styling/
     *         Error bar styling
     *
     * @type      {number}
     * @since     3.0
     * @product   highcharts
     * @apioption plotOptions.boxplot.stemWidth
     */

    /**
     * @default   high
     * @apioption plotOptions.boxplot.colorKey
     */

    /**
     * The color of the whiskers, the horizontal lines marking low and high
     * values. When `undefined`, the general series color is used.
     *
     * In styled mode, the whisker stroke can be set with the
     * `.highcharts-boxplot-whisker` class .
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     * @sample {highcharts} highcharts/css/boxplot/
     *         Box plot in styled mode
     *
     * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @since     3.0
     * @product   highcharts
     * @apioption plotOptions.boxplot.whiskerColor
     */

    /**
     * The line width of the whiskers, the horizontal lines marking low and
     * high values. When `undefined`, the general
     * [lineWidth](#plotOptions.boxplot.lineWidth) applies.
     *
     * In styled mode, the whisker stroke width can be set with the
     * `.highcharts-boxplot-whisker` class.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     * @sample {highcharts} highcharts/css/boxplot/
     *         Box plot in styled mode
     *
     * @since   3.0
     * @product highcharts
     */
    whiskerWidth: 2

}, /** @lends Highcharts.seriesTypes.boxplot */ {

    // array point configs are mapped to this
    pointArrayMap: ['low', 'q1', 'median', 'q3', 'high'],
    // return a plain array for speedy calculation
    toYData: function (point: Highcharts.BoxPlotPoint): Array<number> {
        return [point.low, point.q1, point.median, point.q3, point.high];
    },

    // defines the top of the tracker
    pointValKey: 'high',

    // Get presentational attributes
    pointAttribs: function (
        this: Highcharts.BoxPlotSeries
    ): Highcharts.SVGAttributes {
        // No attributes should be set on point.graphic which is the group
        return {};
    },

    // Disable data labels for box plot
    drawDataLabels: noop as any,

    // Translate data points from raw values x and y to plotX and plotY
    translate: function (this: Highcharts.BoxPlotSeries): void {
        var series = this,
            yAxis = series.yAxis,
            pointArrayMap = series.pointArrayMap;

        seriesTypes.column.prototype.translate.apply(series);

        // do the translation on each point dimension
        series.points.forEach(function (point: Highcharts.BoxPlotPoint): void {
            pointArrayMap.forEach(function (key: string): void {
                if ((point as any)[key] !== null) {
                    (point as any)[key + 'Plot'] = yAxis.translate(
                        (point as any)[key],
                        0 as any,
                        1 as any,
                        0 as any,
                        1 as any
                    );
                }
            });
        });
    },

    // eslint-disable-next-line valid-jsdoc
    /**
     * Draw the data points
     * @private
     */
    drawPoints: function (this: Highcharts.BoxPlotSeries): void {
        var series = this,
            points = series.points,
            options = series.options,
            chart = series.chart,
            renderer = chart.renderer,
            q1Plot,
            q3Plot,
            highPlot,
            lowPlot,
            medianPlot,
            medianPath: Highcharts.SVGPathArray,
            crispCorr,
            crispX = 0,
            boxPath: Highcharts.SVGPathArray,
            width,
            left,
            right,
            halfWidth,
            // error bar inherits this series type but doesn't do quartiles
            doQuartiles = series.doQuartiles !== false,
            pointWiskerLength,
            whiskerLength = series.options.whiskerLength;


        points.forEach(function (point: Highcharts.BoxPlotPoint): void {

            var graphic = point.graphic,
                verb = graphic ? 'animate' : 'attr',
                shapeArgs = point.shapeArgs,
                boxAttr = {} as Highcharts.SVGAttributes,
                stemAttr = {} as Highcharts.SVGAttributes,
                whiskersAttr = {} as Highcharts.SVGAttributes,
                medianAttr = {} as Highcharts.SVGAttributes,
                color = point.color || series.color;

            if (typeof point.plotY !== 'undefined') {

                // crisp vector coordinates
                width = shapeArgs.width;
                left = Math.floor(shapeArgs.x);
                right = left + width;
                halfWidth = Math.round(width / 2);
                q1Plot = Math.floor(doQuartiles ? point.q1Plot : point.lowPlot);
                q3Plot = Math.floor(doQuartiles ? point.q3Plot : point.lowPlot);
                highPlot = Math.floor(point.highPlot);
                lowPlot = Math.floor(point.lowPlot);

                if (!graphic) {
                    point.graphic = graphic = renderer.g('point')
                        .add(series.group);

                    point.stem = renderer.path()
                        .addClass('highcharts-boxplot-stem')
                        .add(graphic);

                    if (whiskerLength) {
                        point.whiskers = renderer.path()
                            .addClass('highcharts-boxplot-whisker')
                            .add(graphic);
                    }
                    if (doQuartiles) {
                        point.box = renderer.path(boxPath)
                            .addClass('highcharts-boxplot-box')
                            .add(graphic);
                    }
                    point.medianShape = renderer.path(medianPath)
                        .addClass('highcharts-boxplot-median')
                        .add(graphic);
                }

                if (!chart.styledMode) {

                    // Stem attributes
                    stemAttr.stroke =
                        point.stemColor || options.stemColor || color;
                    stemAttr['stroke-width'] = pick(
                        point.stemWidth,
                        options.stemWidth,
                        options.lineWidth
                    );
                    stemAttr.dashstyle =
                        point.stemDashStyle || options.stemDashStyle;
                    point.stem.attr(stemAttr);

                    // Whiskers attributes
                    if (whiskerLength) {
                        whiskersAttr.stroke = (
                            point.whiskerColor ||
                            options.whiskerColor ||
                            color
                        );
                        whiskersAttr['stroke-width'] = pick(
                            point.whiskerWidth,
                            options.whiskerWidth,
                            options.lineWidth
                        );
                        point.whiskers.attr(whiskersAttr);
                    }

                    if (doQuartiles) {
                        boxAttr.fill = (
                            point.fillColor ||
                            options.fillColor ||
                            color
                        );
                        boxAttr.stroke = options.lineColor || color;
                        boxAttr['stroke-width'] = options.lineWidth || 0;
                        point.box.attr(boxAttr);
                    }


                    // Median attributes
                    medianAttr.stroke = (
                        point.medianColor ||
                        options.medianColor ||
                        color
                    );
                    medianAttr['stroke-width'] = pick(
                        point.medianWidth,
                        options.medianWidth,
                        options.lineWidth
                    );
                    point.medianShape.attr(medianAttr);

                }


                // The stem
                crispCorr = (point.stem.strokeWidth() % 2) / 2;
                crispX = left + halfWidth + crispCorr;
                point.stem[verb]({
                    d: [
                    // stem up
                        'M',
                        crispX, q3Plot,
                        'L',
                        crispX, highPlot,

                        // stem down
                        'M',
                        crispX, q1Plot,
                        'L',
                        crispX, lowPlot
                    ]
                });

                // The box
                if (doQuartiles) {
                    crispCorr = (point.box.strokeWidth() % 2) / 2;
                    q1Plot = Math.floor(q1Plot) + crispCorr;
                    q3Plot = Math.floor(q3Plot) + crispCorr;
                    left += crispCorr;
                    right += crispCorr;
                    point.box[verb]({
                        d: [
                            'M',
                            left, q3Plot,
                            'L',
                            left, q1Plot,
                            'L',
                            right, q1Plot,
                            'L',
                            right, q3Plot,
                            'L',
                            left, q3Plot,
                            'z'
                        ]
                    });
                }

                // The whiskers
                if (whiskerLength) {
                    crispCorr = (point.whiskers.strokeWidth() % 2) / 2;
                    highPlot = highPlot + crispCorr;
                    lowPlot = lowPlot + crispCorr;
                    pointWiskerLength = (/%$/).test(whiskerLength as any) ?
                        halfWidth * parseFloat(whiskerLength as any) / 100 :
                        (whiskerLength as any) / 2;
                    point.whiskers[verb]({
                        d: [
                        // High whisker
                            'M',
                            crispX - pointWiskerLength,
                            highPlot,
                            'L',
                            crispX + pointWiskerLength,
                            highPlot,

                            // Low whisker
                            'M',
                            crispX - pointWiskerLength,
                            lowPlot,
                            'L',
                            crispX + pointWiskerLength,
                            lowPlot
                        ]
                    });
                }

                // The median
                medianPlot = Math.round(point.medianPlot);
                crispCorr = (point.medianShape.strokeWidth() % 2) / 2;
                medianPlot = medianPlot + crispCorr;

                point.medianShape[verb]({
                    d: [
                        'M',
                        left,
                        medianPlot,
                        'L',
                        right,
                        medianPlot
                    ]
                });
            }
        });

    },
    setStackedPoints: noop as any // #3890

});

/**
 * A `boxplot` series. If the [type](#series.boxplot.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.boxplot
 * @excluding dataParser, dataURL, marker, stack, stacking, states
 * @product   highcharts
 * @requires  highcharts-more
 * @apioption series.boxplot
 */

/**
 * An array of data points for the series. For the `boxplot` series
 * type, points can be given in the following ways:
 *
 * 1. An array of arrays with 6 or 5 values. In this case, the values correspond
 *    to `x,low,q1,median,q3,high`. If the first value is a string, it is
 *    applied as the name of the point, and the `x` value is inferred. The `x`
 *    value can also be omitted, in which case the inner arrays should be of
 *    length 5. Then the `x` value is automatically calculated, either starting
 *    at 0 and incremented by 1, or from `pointStart` and `pointInterval` given
 *    in the series options.
 *    ```js
 *    data: [
 *        [0, 3, 0, 10, 3, 5],
 *        [1, 7, 8, 7, 2, 9],
 *        [2, 6, 9, 5, 1, 3]
 *    ]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.boxplot.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        low: 4,
 *        q1: 9,
 *        median: 9,
 *        q3: 1,
 *        high: 10,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        low: 5,
 *        q1: 7,
 *        median: 3,
 *        q3: 6,
 *        high: 2,
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
 * @type      {Array<Array<(number|string),number,number,number,number>|Array<(number|string),number,number,number,number,number>|*>}
 * @extends   series.line.data
 * @excluding marker
 * @product   highcharts
 * @apioption series.boxplot.data
 */

/**
 * The `high` value for each data point, signifying the highest value
 * in the sample set. The top whisker is drawn here.
 *
 * @type      {number}
 * @product   highcharts
 * @apioption series.boxplot.data.high
 */

/**
 * The `low` value for each data point, signifying the lowest value
 * in the sample set. The bottom whisker is drawn here.
 *
 * @type      {number}
 * @product   highcharts
 * @apioption series.boxplot.data.low
 */

/**
 * The median for each data point. This is drawn as a line through the
 * middle area of the box.
 *
 * @type      {number}
 * @product   highcharts
 * @apioption series.boxplot.data.median
 */

/**
 * The lower quartile for each data point. This is the bottom of the
 * box.
 *
 * @type      {number}
 * @product   highcharts
 * @apioption series.boxplot.data.q1
 */

/**
 * The higher quartile for each data point. This is the top of the box.
 *
 * @type      {number}
 * @product   highcharts
 * @apioption series.boxplot.data.q3
 */

''; // adds doclets above to transpiled file
