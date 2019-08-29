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
import '../parts/Utilities.js';
import '../parts/Axis.js';
var addEvent = H.addEvent, Axis = H.Axis, pick = H.pick;
/* eslint-disable no-invalid-this */
// Override to use the extreme coordinates from the SVG shape, not the data
// values
addEvent(Axis, 'getSeriesExtremes', function () {
    var xData = [];
    // Remove the xData array and cache it locally so that the proceed method
    // doesn't use it
    if (this.isXAxis) {
        this.series.forEach(function (series, i) {
            if (series.useMapGeometry) {
                xData[i] = series.xData;
                series.xData = [];
            }
        });
        this.seriesXData = xData;
    }
});
addEvent(Axis, 'afterGetSeriesExtremes', function () {
    var xData = this.seriesXData, dataMin, dataMax, useMapGeometry;
    // Run extremes logic for map and mapline
    if (this.isXAxis) {
        dataMin = pick(this.dataMin, Number.MAX_VALUE);
        dataMax = pick(this.dataMax, -Number.MAX_VALUE);
        this.series.forEach(function (series, i) {
            if (series.useMapGeometry) {
                dataMin = Math.min(dataMin, pick(series.minX, dataMin));
                dataMax = Math.max(dataMax, pick(series.maxX, dataMax));
                series.xData = xData[i]; // Reset xData array
                useMapGeometry = true;
            }
        });
        if (useMapGeometry) {
            this.dataMin = dataMin;
            this.dataMax = dataMax;
        }
        delete this.seriesXData;
    }
});
// Override axis translation to make sure the aspect ratio is always kept
addEvent(Axis, 'afterSetAxisTranslation', function () {
    var chart = this.chart, mapRatio, plotRatio = chart.plotWidth / chart.plotHeight, adjustedAxisLength, xAxis = chart.xAxis[0], padAxis, fixTo, fixDiff, preserveAspectRatio;
    // Check for map-like series
    if (this.coll === 'yAxis' && xAxis.transA !== undefined) {
        this.series.forEach(function (series) {
            if (series.preserveAspectRatio) {
                preserveAspectRatio = true;
            }
        });
    }
    // On Y axis, handle both
    if (preserveAspectRatio) {
        // Use the same translation for both axes
        this.transA = xAxis.transA = Math.min(this.transA, xAxis.transA);
        mapRatio = plotRatio / ((xAxis.max - xAxis.min) /
            (this.max - this.min));
        // What axis to pad to put the map in the middle
        padAxis = mapRatio < 1 ? this : xAxis;
        // Pad it
        adjustedAxisLength =
            (padAxis.max - padAxis.min) * padAxis.transA;
        padAxis.pixelPadding = padAxis.len - adjustedAxisLength;
        padAxis.minPixelPadding = padAxis.pixelPadding / 2;
        fixTo = padAxis.fixTo;
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
addEvent(Axis, 'render', function () {
    this.fixTo = null;
});
