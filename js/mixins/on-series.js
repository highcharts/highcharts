/* *
 *
 *  (c) 2010-2019 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../parts/Globals.js';
import U from '../parts/Utilities.js';
var defined = U.defined;
var seriesTypes = H.seriesTypes, stableSort = H.stableSort;
/**
 * @private
 * @mixin onSeriesMixin
 */
var onSeriesMixin = {
    /* eslint-disable valid-jsdoc */
    /**
     * Override getPlotBox. If the onSeries option is valid, return the plot box
     * of the onSeries, otherwise proceed as usual.
     *
     * @private
     * @function onSeriesMixin.getPlotBox
     * @return {Highcharts.SeriesPlotBoxObject}
     */
    getPlotBox: function () {
        return H.Series.prototype.getPlotBox.call((this.options.onSeries &&
            this.chart.get(this.options.onSeries)) || this);
    },
    /**
     * Extend the translate method by placing the point on the related series
     *
     * @private
     * @function onSeriesMixin.translate
     * @return {void}
     */
    translate: function () {
        seriesTypes.column.prototype.translate.apply(this);
        var series = this, options = series.options, chart = series.chart, points = series.points, cursor = points.length - 1, point, lastPoint, optionsOnSeries = options.onSeries, onSeries = (optionsOnSeries &&
            chart.get(optionsOnSeries)), onKey = options.onKey || 'y', step = onSeries && onSeries.options.step, onData = (onSeries && onSeries.points), i = onData && onData.length, inverted = chart.inverted, xAxis = series.xAxis, yAxis = series.yAxis, xOffset = 0, leftPoint, lastX, rightPoint, currentDataGrouping, distanceRatio;
        // relate to a master series
        if (onSeries && onSeries.visible && i) {
            xOffset = (onSeries.pointXOffset || 0) + (onSeries.barW || 0) / 2;
            currentDataGrouping = onSeries.currentDataGrouping;
            lastX = (onData[i - 1].x +
                (currentDataGrouping ? currentDataGrouping.totalRange : 0)); // #2374
            // sort the data points
            stableSort(points, function (a, b) {
                return (a.x - b.x);
            });
            onKey = 'plot' + onKey[0].toUpperCase() + onKey.substr(1);
            while (i-- && points[cursor]) {
                leftPoint = onData[i];
                point = points[cursor];
                point.y = leftPoint.y;
                if (leftPoint.x <= point.x &&
                    typeof leftPoint[onKey] !== 'undefined') {
                    if (point.x <= lastX) { // #803
                        point.plotY = leftPoint[onKey];
                        // interpolate between points, #666
                        if (leftPoint.x < point.x &&
                            !step) {
                            rightPoint = onData[i + 1];
                            if (rightPoint &&
                                typeof rightPoint[onKey] !== 'undefined') {
                                // the distance ratio, between 0 and 1
                                distanceRatio =
                                    (point.x - leftPoint.x) /
                                        (rightPoint.x - leftPoint.x);
                                point.plotY +=
                                    distanceRatio *
                                        // the plotY distance
                                        (rightPoint[onKey] - leftPoint[onKey]);
                                point.y +=
                                    distanceRatio *
                                        (rightPoint.y - leftPoint.y);
                            }
                        }
                    }
                    cursor--;
                    i++; // check again for points in the same x position
                    if (cursor < 0) {
                        break;
                    }
                }
            }
        }
        // Add plotY position and handle stacking
        points.forEach(function (point, i) {
            var stackIndex;
            point.plotX += xOffset; // #2049
            // Undefined plotY means the point is either on axis, outside series
            // range or hidden series. If the series is outside the range of the
            // x axis it should fall through with an undefined plotY, but then
            // we must remove the shapeArgs (#847). For inverted charts, we need
            // to calculate position anyway, because series.invertGroups is not
            // defined
            if (typeof point.plotY === 'undefined' || inverted) {
                if (point.plotX >= 0 &&
                    point.plotX <= xAxis.len) {
                    // We're inside xAxis range
                    if (inverted) {
                        point.plotY = xAxis.translate(point.x, 0, 1, 0, 1);
                        point.plotX = defined(point.y) ?
                            yAxis.translate(point.y, 0, 0, 0, 1) :
                            0;
                    }
                    else {
                        point.plotY = (xAxis.opposite ? 0 : series.yAxis.len) +
                            xAxis.offset; // For the windbarb demo
                    }
                }
                else {
                    point.shapeArgs = {}; // 847
                }
            }
            // if multiple flags appear at the same x, order them into a stack
            lastPoint = points[i - 1];
            if (lastPoint && lastPoint.plotX === point.plotX) {
                if (typeof lastPoint.stackIndex === 'undefined') {
                    lastPoint.stackIndex = 0;
                }
                stackIndex = lastPoint.stackIndex + 1;
            }
            point.stackIndex = stackIndex; // #3639
        });
        this.onSeries = onSeries;
    }
    /* eslint-enable valid-jsdoc */
};
export default onSeriesMixin;
