/**
 *
 *  (c) 2010-2021 Wojciech Chmiel
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../Core/Globals.js';
import U from '../Core/Utilities.js';
var defined = U.defined, error = U.error, merge = U.merge;
var SMA = H.seriesTypes.sma;
/**
 * Mixin useful for all indicators that have more than one line.
 * Merge it with your implementation where you will provide
 * getValues method appropriate to your indicator and pointArrayMap,
 * pointValKey, linesApiNames properites. Notice that pointArrayMap
 * should be consistent with amount of lines calculated in getValues method.
 *
 * @private
 * @mixin multipleLinesMixin
 */
var multipleLinesMixin = {
    /* eslint-disable valid-jsdoc */
    /**
     * Lines ids. Required to plot appropriate amount of lines.
     * Notice that pointArrayMap should have more elements than
     * linesApiNames, because it contains main line and additional lines ids.
     * Also it should be consistent with amount of lines calculated in
     * getValues method from your implementation.
     *
     * @private
     * @name multipleLinesMixin.pointArrayMap
     * @type {Array<string>}
     */
    pointArrayMap: ['top', 'bottom'],
    /**
     * Main line id.
     *
     * @private
     * @name multipleLinesMixin.pointValKey
     * @type {string}
     */
    pointValKey: 'top',
    /**
     * Additional lines DOCS names. Elements of linesApiNames array should
     * be consistent with DOCS line names defined in your implementation.
     * Notice that linesApiNames should have decreased amount of elements
     * relative to pointArrayMap (without pointValKey).
     *
     * @private
     * @name multipleLinesMixin.linesApiNames
     * @type {Array<string>}
     */
    linesApiNames: ['bottomLine'],
    /**
     * Create translatedLines Collection based on pointArrayMap.
     *
     * @private
     * @function multipleLinesMixin.getTranslatedLinesNames
     * @param {string} [excludedValue]
     *        Main line id
     * @return {Array<string>}
     *         Returns translated lines names without excluded value.
     */
    getTranslatedLinesNames: function (excludedValue) {
        var translatedLines = [];
        (this.pointArrayMap || []).forEach(function (propertyName) {
            if (propertyName !== excludedValue) {
                translatedLines.push('plot' +
                    propertyName.charAt(0).toUpperCase() +
                    propertyName.slice(1));
            }
        });
        return translatedLines;
    },
    /**
     * @private
     * @function multipleLinesMixin.toYData
     * @param {Highcharts.Point} point
     *        Indicator point
     * @return {Array<number>}
     *         Returns point Y value for all lines
     */
    toYData: function (point) {
        var pointColl = [];
        (this.pointArrayMap || []).forEach(function (propertyName) {
            pointColl.push(point[propertyName]);
        });
        return pointColl;
    },
    /**
     * Add lines plot pixel values.
     *
     * @private
     * @function multipleLinesMixin.translate
     * @return {void}
     */
    translate: function () {
        var indicator = this, pointArrayMap = indicator.pointArrayMap, LinesNames = [], value;
        LinesNames = indicator.getTranslatedLinesNames();
        SMA.prototype.translate.apply(indicator, arguments);
        indicator.points.forEach(function (point) {
            pointArrayMap.forEach(function (propertyName, i) {
                value = point[propertyName];
                if (value !== null) {
                    point[LinesNames[i]] = indicator.yAxis.toPixels(value, true);
                }
            });
        });
    },
    /**
     * Draw main and additional lines.
     *
     * @private
     * @function multipleLinesMixin.drawGraph
     * @return {void}
     */
    drawGraph: function () {
        var indicator = this, pointValKey = indicator.pointValKey, linesApiNames = indicator.linesApiNames, mainLinePoints = indicator.points, pointsLength = mainLinePoints.length, mainLineOptions = indicator.options, mainLinePath = indicator.graph, gappedExtend = {
            options: {
                gapSize: mainLineOptions.gapSize
            }
        }, 
        // additional lines point place holders:
        secondaryLines = [], secondaryLinesNames = indicator.getTranslatedLinesNames(pointValKey), point;
        // Generate points for additional lines:
        secondaryLinesNames.forEach(function (plotLine, index) {
            // create additional lines point place holders
            secondaryLines[index] = [];
            while (pointsLength--) {
                point = mainLinePoints[pointsLength];
                secondaryLines[index].push({
                    x: point.x,
                    plotX: point.plotX,
                    plotY: point[plotLine],
                    isNull: !defined(point[plotLine])
                });
            }
            pointsLength = mainLinePoints.length;
        });
        // Modify options and generate additional lines:
        linesApiNames.forEach(function (lineName, i) {
            if (secondaryLines[i]) {
                indicator.points = secondaryLines[i];
                if (mainLineOptions[lineName]) {
                    indicator.options = merge(mainLineOptions[lineName].styles, gappedExtend);
                }
                else {
                    error('Error: "There is no ' + lineName +
                        ' in DOCS options declared. Check if linesApiNames' +
                        ' are consistent with your DOCS line names."' +
                        ' at mixin/multiple-line.js:34');
                }
                indicator.graph = indicator['graph' + lineName];
                SMA.prototype.drawGraph.call(indicator);
                // Now save lines:
                indicator['graph' + lineName] = indicator.graph;
            }
            else {
                error('Error: "' + lineName + ' doesn\'t have equivalent ' +
                    'in pointArrayMap. To many elements in linesApiNames ' +
                    'relative to pointArrayMap."');
            }
        });
        // Restore options and draw a main line:
        indicator.points = mainLinePoints;
        indicator.options = mainLineOptions;
        indicator.graph = mainLinePath;
        SMA.prototype.drawGraph.call(indicator);
    }
};
export default multipleLinesMixin;
