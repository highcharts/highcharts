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
import Axis from './Axis.js';
import U from '../Utilities.js';
var addEvent = U.addEvent, pick = U.pick;
/**
 * Map support for axes.
 * @private
 * @class
 */
var MapAxisAdditions = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    function MapAxisAdditions(axis) {
        this.axis = axis;
    }
    return MapAxisAdditions;
}());
/**
 * Axis with map support.
 * @private
 * @class
 */
var MapAxis = /** @class */ (function () {
    function MapAxis() {
    }
    /**
     * Extends axes with map support.
     * @private
     *
     * @param {Highcharts.Axis} AxisClass
     * Axis class to extend.
     */
    MapAxis.compose = function (AxisClass) {
        AxisClass.keepProps.push('mapAxis');
        /* eslint-disable no-invalid-this */
        addEvent(AxisClass, 'init', function () {
            var axis = this;
            if (!axis.mapAxis) {
                axis.mapAxis = new MapAxisAdditions(axis);
            }
        });
        // Override to use the extreme coordinates from the SVG shape, not the
        // data values
        addEvent(AxisClass, 'getSeriesExtremes', function () {
            if (!this.mapAxis) {
                return;
            }
            var axis = this;
            var xData = [];
            // Remove the xData array and cache it locally so that the proceed
            // method doesn't use it
            if (axis.isXAxis) {
                axis.series.forEach(function (series, i) {
                    if (series.useMapGeometry) {
                        xData[i] = series.xData;
                        series.xData = [];
                    }
                });
                axis.mapAxis.seriesXData = xData;
            }
        });
        addEvent(AxisClass, 'afterGetSeriesExtremes', function () {
            if (!this.mapAxis) {
                return;
            }
            var axis = this;
            var xData = axis.mapAxis.seriesXData || [];
            var dataMin, dataMax, useMapGeometry;
            // Run extremes logic for map and mapline
            if (axis.isXAxis) {
                dataMin = pick(axis.dataMin, Number.MAX_VALUE);
                dataMax = pick(axis.dataMax, -Number.MAX_VALUE);
                axis.series.forEach(function (series, i) {
                    if (series.useMapGeometry) {
                        dataMin = Math.min(dataMin, pick(series.minX, dataMin));
                        dataMax = Math.max(dataMax, pick(series.maxX, dataMax));
                        series.xData = xData[i]; // Reset xData array
                        useMapGeometry = true;
                    }
                });
                if (useMapGeometry) {
                    axis.dataMin = dataMin;
                    axis.dataMax = dataMax;
                }
                axis.mapAxis.seriesXData = void 0;
            }
        });
        // Override axis translation to make sure the aspect ratio is always
        // kept
        addEvent(AxisClass, 'afterSetAxisTranslation', function () {
            if (!this.mapAxis) {
                return;
            }
            var axis = this;
            var chart = axis.chart;
            var plotRatio = chart.plotWidth / chart.plotHeight;
            var xAxis = chart.xAxis[0];
            var mapRatio, adjustedAxisLength, padAxis, fixTo, fixDiff, preserveAspectRatio;
            // Check for map-like series
            if (axis.coll === 'yAxis' && typeof xAxis.transA !== 'undefined') {
                axis.series.forEach(function (series) {
                    if (series.preserveAspectRatio) {
                        preserveAspectRatio = true;
                    }
                });
            }
            // On Y axis, handle both
            if (preserveAspectRatio) {
                // Use the same translation for both axes
                axis.transA = xAxis.transA = Math.min(axis.transA, xAxis.transA);
                mapRatio = plotRatio / ((xAxis.max - xAxis.min) /
                    (axis.max - axis.min));
                // What axis to pad to put the map in the middle
                padAxis = mapRatio < 1 ? axis : xAxis;
                // Pad it
                adjustedAxisLength =
                    (padAxis.max - padAxis.min) * padAxis.transA;
                padAxis.mapAxis.pixelPadding = padAxis.len - adjustedAxisLength;
                padAxis.minPixelPadding = padAxis.mapAxis.pixelPadding / 2;
                fixTo = padAxis.mapAxis.fixTo;
                if (fixTo) {
                    fixDiff = fixTo[1] - padAxis.toValue(fixTo[0], true);
                    fixDiff *= padAxis.transA;
                    if (Math.abs(fixDiff) > padAxis.minPixelPadding ||
                        (padAxis.min === padAxis.dataMin &&
                            padAxis.max === padAxis.dataMax)) { // zooming out again, keep within restricted area
                        fixDiff = 0;
                    }
                    padAxis.minPixelPadding -= fixDiff;
                }
            }
        });
        // Override Axis.render in order to delete the fixTo prop
        addEvent(AxisClass, 'render', function () {
            var axis = this;
            if (axis.mapAxis) {
                axis.mapAxis.fixTo = void 0;
            }
        });
        /* eslint-enable no-invalid-this */
    };
    return MapAxis;
}());
MapAxis.compose(Axis); // @todo move to factory functions
export default MapAxis;
