/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../parts/Globals.js';
import U from '../parts/Utilities.js';
var defined = U.defined, isArray = U.isArray;
var SMA = H.seriesTypes.sma;
/* eslint-disable valid-jsdoc */
/**
 * @private
 */
function destroyExtraLabels(point, functionName) {
    var props = point.series.pointArrayMap, prop, i = props.length;
    SMA.prototype.pointClass.prototype[functionName].call(point);
    while (i--) {
        prop = 'dataLabel' + props[i];
        // S4 dataLabel could be removed by parent method:
        if (point[prop] && point[prop].element) {
            point[prop].destroy();
        }
        point[prop] = null;
    }
}
/* eslint-enable valid-jsdoc */
/**
 * The Pivot Points series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.pivotpoints
 *
 * @augments Highcharts.Series
 */
H.seriesType('pivotpoints', 'sma', 
/**
 * Pivot points indicator. This series requires the `linkedTo` option to be
 * set and should be loaded after `stock/indicators/indicators.js` file.
 *
 * @sample stock/indicators/pivot-points
 *         Pivot points
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/pivotpoints
 * @optionparent plotOptions.pivotpoints
 */
{
    /**
     * @excluding index
     */
    params: {
        period: 28,
        /**
         * Algorithm used to calculate ressistance and support lines based
         * on pivot points. Implemented algorithms: `'standard'`,
         * `'fibonacci'` and `'camarilla'`
         */
        algorithm: 'standard'
    },
    marker: {
        enabled: false
    },
    enableMouseTracking: false,
    dataLabels: {
        /** @ignore-option */
        enabled: true,
        /** @ignore-option */
        format: '{point.pivotLine}'
    },
    dataGrouping: {
        approximation: 'averages'
    }
}, 
/**
 * @lends Highcharts.Series#
 */
{
    nameBase: 'Pivot Points',
    pointArrayMap: ['R4', 'R3', 'R2', 'R1', 'P', 'S1', 'S2', 'S3', 'S4'],
    pointValKey: 'P',
    toYData: function (point) {
        return [point.P]; // The rest should not affect extremes
    },
    translate: function () {
        var indicator = this;
        SMA.prototype.translate.apply(indicator);
        indicator.points.forEach(function (point) {
            indicator.pointArrayMap.forEach(function (value) {
                if (defined(point[value])) {
                    point['plot' + value] = (indicator.yAxis.toPixels(point[value], true));
                }
            });
        });
        // Pivot points are rendered as horizontal lines
        // And last point start not from the next one (as it's the last one)
        // But from the approximated last position in a given range
        indicator.plotEndPoint = indicator.xAxis.toPixels(indicator.endPoint, true);
    },
    getGraphPath: function (points) {
        var indicator = this, pointsLength = points.length, allPivotPoints = ([[], [], [], [], [], [], [], [], []]), path = [], endPoint = indicator.plotEndPoint, pointArrayMapLength = indicator.pointArrayMap.length, position, point, i;
        while (pointsLength--) {
            point = points[pointsLength];
            for (i = 0; i < pointArrayMapLength; i++) {
                position = indicator.pointArrayMap[i];
                if (defined(point[position])) {
                    allPivotPoints[i].push({
                        // Start left:
                        plotX: point.plotX,
                        plotY: point['plot' + position],
                        isNull: false
                    }, {
                        // Go to right:
                        plotX: endPoint,
                        plotY: point['plot' + position],
                        isNull: false
                    }, {
                        // And add null points in path to generate breaks:
                        plotX: endPoint,
                        plotY: null,
                        isNull: true
                    });
                }
            }
            endPoint = point.plotX;
        }
        allPivotPoints.forEach(function (pivotPoints) {
            path = path.concat(SMA.prototype.getGraphPath.call(indicator, pivotPoints));
        });
        return path;
    },
    // TODO: Rewrite this logic to use multiple datalabels
    drawDataLabels: function () {
        var indicator = this, pointMapping = indicator.pointArrayMap, currentLabel, pointsLength, point, i;
        if (indicator.options.dataLabels.enabled) {
            pointsLength = indicator.points.length;
            // For every Ressitance/Support group we need to render labels.
            // Add one more item, which will just store dataLabels from
            // previous iteration
            pointMapping.concat([false]).forEach(function (position, k) {
                i = pointsLength;
                while (i--) {
                    point = indicator.points[i];
                    if (!position) {
                        // Store S4 dataLabel too:
                        point['dataLabel' + pointMapping[k - 1]] =
                            point.dataLabel;
                    }
                    else {
                        point.y = point[position];
                        point.pivotLine = position;
                        point.plotY = point['plot' + position];
                        currentLabel = point['dataLabel' + position];
                        // Store previous label
                        if (k) {
                            point['dataLabel' + pointMapping[k - 1]] = point.dataLabel;
                        }
                        if (!point.dataLabels) {
                            point.dataLabels = [];
                        }
                        point.dataLabels[0] = point.dataLabel =
                            currentLabel =
                                currentLabel && currentLabel.element ?
                                    currentLabel :
                                    null;
                    }
                }
                SMA.prototype.drawDataLabels.apply(indicator, arguments);
            });
        }
    },
    getValues: function (series, params) {
        var period = params.period, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, placement = this[params.algorithm + 'Placement'], 
        // 0- from, 1- to, 2- R1, 3- R2, 4- pivot, 5- S1 etc.
        PP = [], endTimestamp, xData = [], yData = [], slicedXLen, slicedX, slicedY, lastPP, pivot, avg, i;
        // Pivot Points requires high, low and close values
        if (xVal.length < period ||
            !isArray(yVal[0]) ||
            yVal[0].length !== 4) {
            return false;
        }
        for (i = period + 1; i <= yValLen + period; i += period) {
            slicedX = xVal.slice(i - period - 1, i);
            slicedY = yVal.slice(i - period - 1, i);
            slicedXLen = slicedX.length;
            endTimestamp = slicedX[slicedXLen - 1];
            pivot = this.getPivotAndHLC(slicedY);
            avg = placement(pivot);
            lastPP = PP.push([endTimestamp]
                .concat(avg));
            xData.push(endTimestamp);
            yData.push(PP[lastPP - 1].slice(1));
        }
        // We don't know exact position in ordinal axis
        // So we use simple logic:
        // Get first point in last range, calculate visible average range
        // and multiply by period
        this.endPoint = slicedX[0] + ((endTimestamp - slicedX[0]) /
            slicedXLen) * period;
        return {
            values: PP,
            xData: xData,
            yData: yData
        };
    },
    getPivotAndHLC: function (values) {
        var high = -Infinity, low = Infinity, close = values[values.length - 1][3], pivot;
        values.forEach(function (p) {
            high = Math.max(high, p[1]);
            low = Math.min(low, p[2]);
        });
        pivot = (high + low + close) / 3;
        return [pivot, high, low, close];
    },
    standardPlacement: function (values) {
        var diff = values[1] - values[2], avg = [
            null,
            null,
            values[0] + diff,
            values[0] * 2 - values[2],
            values[0],
            values[0] * 2 - values[1],
            values[0] - diff,
            null,
            null
        ];
        return avg;
    },
    camarillaPlacement: function (values) {
        var diff = values[1] - values[2], avg = [
            values[3] + diff * 1.5,
            values[3] + diff * 1.25,
            values[3] + diff * 1.1666,
            values[3] + diff * 1.0833,
            values[0],
            values[3] - diff * 1.0833,
            values[3] - diff * 1.1666,
            values[3] - diff * 1.25,
            values[3] - diff * 1.5
        ];
        return avg;
    },
    fibonacciPlacement: function (values) {
        var diff = values[1] - values[2], avg = [
            null,
            values[0] + diff,
            values[0] + diff * 0.618,
            values[0] + diff * 0.382,
            values[0],
            values[0] - diff * 0.382,
            values[0] - diff * 0.618,
            values[0] - diff,
            null
        ];
        return avg;
    }
}, 
/**
 * @lends Highcharts.Point#
 */
{
    // Destroy labels:
    // This method is called when cropping data:
    destroyElements: function () {
        destroyExtraLabels(this, 'destroyElements');
    },
    // This method is called when removing points, e.g. series.update()
    destroy: function () {
        destroyExtraLabels(this, 'destroyElements');
    }
});
/**
 * A pivot points indicator. If the [type](#series.pivotpoints.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.pivotpoints
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/pivotpoints
 * @apioption series.pivotpoints
 */
''; // to include the above in the js output'
