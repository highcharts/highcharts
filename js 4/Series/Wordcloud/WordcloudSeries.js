/* *
 *
 *  Experimental Highcharts module which enables visualization of a word cloud.
 *
 *  (c) 2016-2021 Highsoft AS
 *  Authors: Jon Arild Nygard
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 * */
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import H from '../../Core/Globals.js';
var noop = H.noop;
import Series from '../../Core/Series/Series.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var ColumnSeries = SeriesRegistry.seriesTypes.column;
import U from '../../Core/Utilities.js';
var extend = U.extend, isArray = U.isArray, isNumber = U.isNumber, isObject = U.isObject, merge = U.merge;
import WordcloudPoint from './WordcloudPoint.js';
import WordcloudUtils from './WordcloudUtils.js';
var archimedeanSpiral = WordcloudUtils.archimedeanSpiral, extendPlayingField = WordcloudUtils.extendPlayingField, getBoundingBoxFromPolygon = WordcloudUtils.getBoundingBoxFromPolygon, getPlayingField = WordcloudUtils.getPlayingField, getPolygon = WordcloudUtils.getPolygon, getRandomPosition = WordcloudUtils.getRandomPosition, getRotation = WordcloudUtils.getRotation, getScale = WordcloudUtils.getScale, getSpiral = WordcloudUtils.getSpiral, intersectionTesting = WordcloudUtils.intersectionTesting, isPolygonsColliding = WordcloudUtils.isPolygonsColliding, rectangularSpiral = WordcloudUtils.rectangularSpiral, rotate2DToOrigin = WordcloudUtils.rotate2DToOrigin, rotate2DToPoint = WordcloudUtils.rotate2DToPoint, squareSpiral = WordcloudUtils.squareSpiral, updateFieldBoundaries = WordcloudUtils.updateFieldBoundaries;
/* *
 *
 *  Class
 *
 * */
/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.wordcloud
 *
 * @augments Highcharts.Series
 */
var WordcloudSeries = /** @class */ (function (_super) {
    __extends(WordcloudSeries, _super);
    function WordcloudSeries() {
        /* *
         *
         * Static properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /* *
         *
         * Properties
         *
         * */
        _this.data = void 0;
        _this.options = void 0;
        _this.points = void 0;
        return _this;
    }
    /**
     *
     * Functions
     *
     */
    WordcloudSeries.prototype.bindAxes = function () {
        var wordcloudAxis = {
            endOnTick: false,
            gridLineWidth: 0,
            lineWidth: 0,
            maxPadding: 0,
            startOnTick: false,
            title: void 0,
            tickPositions: []
        };
        Series.prototype.bindAxes.call(this);
        extend(this.yAxis.options, wordcloudAxis);
        extend(this.xAxis.options, wordcloudAxis);
    };
    WordcloudSeries.prototype.pointAttribs = function (point, state) {
        var attribs = H.seriesTypes.column.prototype
            .pointAttribs.call(this, point, state);
        delete attribs.stroke;
        delete attribs['stroke-width'];
        return attribs;
    };
    /**
     * Calculates the fontSize of a word based on its weight.
     *
     * @private
     * @function Highcharts.Series#deriveFontSize
     *
     * @param {number} [relativeWeight=0]
     * The weight of the word, on a scale 0-1.
     *
     * @param {number} [maxFontSize=1]
     * The maximum font size of a word.
     *
     * @param {number} [minFontSize=1]
     * The minimum font size of a word.
     *
     * @return {number}
     * Returns the resulting fontSize of a word. If minFontSize is larger then
     * maxFontSize the result will equal minFontSize.
     */
    WordcloudSeries.prototype.deriveFontSize = function (relativeWeight, maxFontSize, minFontSize) {
        var weight = isNumber(relativeWeight) ? relativeWeight : 0, max = isNumber(maxFontSize) ? maxFontSize : 1, min = isNumber(minFontSize) ? minFontSize : 1;
        return Math.floor(Math.max(min, weight * max));
    };
    WordcloudSeries.prototype.drawPoints = function () {
        var series = this, hasRendered = series.hasRendered, xAxis = series.xAxis, yAxis = series.yAxis, chart = series.chart, group = series.group, options = series.options, animation = options.animation, allowExtendPlayingField = options.allowExtendPlayingField, renderer = chart.renderer, testElement = renderer.text().add(group), placed = [], placementStrategy = series.placementStrategy[options.placementStrategy], spiral, rotation = options.rotation, scale, weights = series.points.map(function (p) {
            return p.weight;
        }), maxWeight = Math.max.apply(null, weights), 
        // concat() prevents from sorting the original array.
        data = series.points.concat().sort(function (a, b) {
            return b.weight - a.weight; // Sort descending
        }), field;
        // Reset the scale before finding the dimensions (#11993).
        // SVGGRaphicsElement.getBBox() (used in SVGElement.getBBox(boolean))
        // returns slightly different values for the same element depending on
        // whether it is rendered in a group which has already defined scale
        // (e.g. 6) or in the group without a scale (scale = 1).
        series.group.attr({
            scaleX: 1,
            scaleY: 1
        });
        // Get the dimensions for each word.
        // Used in calculating the playing field.
        data.forEach(function (point) {
            var relativeWeight = 1 / maxWeight * point.weight, fontSize = series.deriveFontSize(relativeWeight, options.maxFontSize, options.minFontSize), css = extend({
                fontSize: fontSize + 'px'
            }, options.style), bBox;
            testElement.css(css).attr({
                x: 0,
                y: 0,
                text: point.name
            });
            bBox = testElement.getBBox(true);
            point.dimensions = {
                height: bBox.height,
                width: bBox.width
            };
        });
        // Calculate the playing field.
        field = getPlayingField(xAxis.len, yAxis.len, data);
        spiral = getSpiral(series.spirals[options.spiral], {
            field: field
        });
        // Draw all the points.
        data.forEach(function (point) {
            var relativeWeight = 1 / maxWeight * point.weight, fontSize = series.deriveFontSize(relativeWeight, options.maxFontSize, options.minFontSize), css = extend({
                fontSize: fontSize + 'px'
            }, options.style), placement = placementStrategy(point, {
                data: data,
                field: field,
                placed: placed,
                rotation: rotation
            }), attr = extend(series.pointAttribs(point, (point.selected && 'select')), {
                align: 'center',
                'alignment-baseline': 'middle',
                'dominant-baseline': 'middle',
                x: placement.x,
                y: placement.y,
                text: point.name,
                rotation: isNumber(placement.rotation) ?
                    placement.rotation :
                    void 0
            }), polygon = getPolygon(placement.x, placement.y, point.dimensions.width, point.dimensions.height, placement.rotation), rectangle = getBoundingBoxFromPolygon(polygon), delta = intersectionTesting(point, {
                rectangle: rectangle,
                polygon: polygon,
                field: field,
                placed: placed,
                spiral: spiral,
                rotation: placement.rotation
            }), animate;
            // If there is no space for the word, extend the playing field.
            if (!delta && allowExtendPlayingField) {
                // Extend the playing field to fit the word.
                field = extendPlayingField(field, rectangle);
                // Run intersection testing one more time to place the word.
                delta = intersectionTesting(point, {
                    rectangle: rectangle,
                    polygon: polygon,
                    field: field,
                    placed: placed,
                    spiral: spiral,
                    rotation: placement.rotation
                });
            }
            // Check if point was placed, if so delete it, otherwise place it
            // on the correct positions.
            if (isObject(delta)) {
                attr.x = (attr.x || 0) + delta.x;
                attr.y = (attr.y || 0) + delta.y;
                rectangle.left += delta.x;
                rectangle.right += delta.x;
                rectangle.top += delta.y;
                rectangle.bottom += delta.y;
                field = updateFieldBoundaries(field, rectangle);
                placed.push(point);
                point.isNull = false;
                point.isInside = true; // #15447
            }
            else {
                point.isNull = true;
            }
            if (animation) {
                // Animate to new positions
                animate = {
                    x: attr.x,
                    y: attr.y
                };
                // Animate from center of chart
                if (!hasRendered) {
                    attr.x = 0;
                    attr.y = 0;
                    // or animate from previous position
                }
                else {
                    delete attr.x;
                    delete attr.y;
                }
            }
            point.draw({
                animatableAttribs: animate,
                attribs: attr,
                css: css,
                group: group,
                renderer: renderer,
                shapeArgs: void 0,
                shapeType: 'text'
            });
        });
        // Destroy the element after use.
        testElement = testElement.destroy();
        // Scale the series group to fit within the plotArea.
        scale = getScale(xAxis.len, yAxis.len, field);
        series.group.attr({
            scaleX: scale,
            scaleY: scale
        });
    };
    WordcloudSeries.prototype.hasData = function () {
        var series = this;
        return (isObject(series) &&
            series.visible === true &&
            isArray(series.points) &&
            series.points.length > 0);
    };
    WordcloudSeries.prototype.getPlotBox = function () {
        var series = this, chart = series.chart, inverted = chart.inverted, 
        // Swap axes for inverted (#2339)
        xAxis = series[(inverted ? 'yAxis' : 'xAxis')], yAxis = series[(inverted ? 'xAxis' : 'yAxis')], width = xAxis ? xAxis.len : chart.plotWidth, height = yAxis ? yAxis.len : chart.plotHeight, x = xAxis ? xAxis.left : chart.plotLeft, y = yAxis ? yAxis.top : chart.plotTop;
        return {
            translateX: x + (width / 2),
            translateY: y + (height / 2),
            scaleX: 1,
            scaleY: 1
        };
    };
    /**
     * A word cloud is a visualization of a set of words, where the size and
     * placement of a word is determined by how it is weighted.
     *
     * @sample highcharts/demo/wordcloud
     *         Word Cloud chart
     *
     * @extends      plotOptions.column
     * @excluding    allAreas, boostThreshold, clip, colorAxis, compare,
     *               compareBase, crisp, cropTreshold, dataGrouping, dataLabels,
     *               depth, dragDrop, edgeColor, findNearestPointBy,
     *               getExtremesFromAll, grouping, groupPadding, groupZPadding,
     *               joinBy, maxPointWidth, minPointLength, navigatorOptions,
     *               negativeColor, pointInterval, pointIntervalUnit,
     *               pointPadding, pointPlacement, pointRange, pointStart,
     *               pointWidth, pointStart, pointWidth, shadow, showCheckbox,
     *               showInNavigator, softThreshold, stacking, threshold,
     *               zoneAxis, zones, dataSorting, boostBlending
     * @product      highcharts
     * @since        6.0.0
     * @requires     modules/wordcloud
     * @optionparent plotOptions.wordcloud
     */
    WordcloudSeries.defaultOptions = merge(ColumnSeries.defaultOptions, {
        /**
         * If there is no space for a word on the playing field, then this
         * option will allow the playing field to be extended to fit the word.
         * If false then the word will be dropped from the visualization.
         *
         * NB! This option is currently not decided to be published in the API,
         * and is therefore marked as private.
         *
         * @private
         */
        allowExtendPlayingField: true,
        animation: {
            /** @internal */
            duration: 500
        },
        borderWidth: 0,
        clip: false,
        colorByPoint: true,
        /**
         * A threshold determining the minimum font size that can be applied to
         * a word.
         */
        minFontSize: 1,
        /**
         * The word with the largest weight will have a font size equal to this
         * value. The font size of a word is the ratio between its weight and
         * the largest occuring weight, multiplied with the value of
         * maxFontSize.
         */
        maxFontSize: 25,
        /**
         * This option decides which algorithm is used for placement, and
         * rotation of a word. The choice of algorith is therefore a crucial
         * part of the resulting layout of the wordcloud. It is possible for
         * users to add their own custom placement strategies for use in word
         * cloud. Read more about it in our
         * [documentation](https://www.highcharts.com/docs/chart-and-series-types/word-cloud-series#custom-placement-strategies)
         *
         * @validvalue ["center", "random"]
         */
        placementStrategy: 'center',
        /**
         * Rotation options for the words in the wordcloud.
         *
         * @sample highcharts/plotoptions/wordcloud-rotation
         *         Word cloud with rotation
         */
        rotation: {
            /**
             * The smallest degree of rotation for a word.
             */
            from: 0,
            /**
             * The number of possible orientations for a word, within the range
             * of `rotation.from` and `rotation.to`. Must be a number larger
             * than 0.
             */
            orientations: 2,
            /**
             * The largest degree of rotation for a word.
             */
            to: 90
        },
        showInLegend: false,
        /**
         * Spiral used for placing a word after the initial position
         * experienced a collision with either another word or the borders.
         * It is possible for users to add their own custom spiralling
         * algorithms for use in word cloud. Read more about it in our
         * [documentation](https://www.highcharts.com/docs/chart-and-series-types/word-cloud-series#custom-spiralling-algorithm)
         *
         * @validvalue ["archimedean", "rectangular", "square"]
         */
        spiral: 'rectangular',
        /**
         * CSS styles for the words.
         *
         * @type    {Highcharts.CSSObject}
         * @default {"fontFamily":"sans-serif", "fontWeight": "900"}
         */
        style: {
            /** @ignore-option */
            fontFamily: 'sans-serif',
            /** @ignore-option */
            fontWeight: '900',
            /** @ignore-option */
            whiteSpace: 'nowrap'
        },
        tooltip: {
            followPointer: true,
            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.weight}</b><br/>'
        }
    });
    return WordcloudSeries;
}(ColumnSeries));
extend(WordcloudSeries.prototype, {
    animate: noop,
    animateDrilldown: noop,
    animateDrillupFrom: noop,
    pointClass: WordcloudPoint,
    setClip: noop,
    // Strategies used for deciding rotation and initial position of a word. To
    // implement a custom strategy, have a look at the function random for
    // example.
    placementStrategy: {
        random: function (point, options) {
            var field = options.field, r = options.rotation;
            return {
                x: getRandomPosition(field.width) - (field.width / 2),
                y: getRandomPosition(field.height) - (field.height / 2),
                rotation: getRotation(r.orientations, point.index, r.from, r.to)
            };
        },
        center: function (point, options) {
            var r = options.rotation;
            return {
                x: 0,
                y: 0,
                rotation: getRotation(r.orientations, point.index, r.from, r.to)
            };
        }
    },
    pointArrayMap: ['weight'],
    // Spirals used for placing a word after the initial position experienced a
    // collision with either another word or the borders. To implement a custom
    // spiral, look at the function archimedeanSpiral for example.
    spirals: {
        'archimedean': archimedeanSpiral,
        'rectangular': rectangularSpiral,
        'square': squareSpiral
    },
    utils: {
        extendPlayingField: extendPlayingField,
        getRotation: getRotation,
        isPolygonsColliding: isPolygonsColliding,
        rotate2DToOrigin: rotate2DToOrigin,
        rotate2DToPoint: rotate2DToPoint
    }
});
SeriesRegistry.registerSeriesType('wordcloud', WordcloudSeries);
/* *
 *
 * Export Default
 *
 * */
export default WordcloudSeries;
/* *
 *
 * API Options
 *
 * */
/**
 * A `wordcloud` series. If the [type](#series.wordcloud.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.wordcloud
 * @exclude   dataSorting, boostThreshold, boostBlending
 * @product   highcharts
 * @requires  modules/wordcloud
 * @apioption series.wordcloud
 */
/**
 * An array of data points for the series. For the `wordcloud` series type,
 * points can be given in the following ways:
 *
 * 1. An array of arrays with 2 values. In this case, the values correspond to
 *    `name,weight`.
 *    ```js
 *    data: [
 *        ['Lorem', 4],
 *        ['Ipsum', 1]
 *    ]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.arearange.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        name: "Lorem",
 *        weight: 4
 *    }, {
 *        name: "Ipsum",
 *        weight: 1
 *    }]
 *    ```
 *
 * @type      {Array<Array<string,number>|*>}
 * @extends   series.line.data
 * @excluding drilldown, marker, x, y
 * @product   highcharts
 * @apioption series.wordcloud.data
 */
/**
 * The name decides the text for a word.
 *
 * @type      {string}
 * @since     6.0.0
 * @product   highcharts
 * @apioption series.sunburst.data.name
 */
/**
 * The weighting of a word. The weight decides the relative size of a word
 * compared to the rest of the collection.
 *
 * @type      {number}
 * @since     6.0.0
 * @product   highcharts
 * @apioption series.sunburst.data.weight
 */
''; // detach doclets above
