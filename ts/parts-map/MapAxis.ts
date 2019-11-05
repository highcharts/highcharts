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

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface MapAxis extends Axis {
            chart: MapChart;
            fixTo: Array<number>;
            pixelPadding: number;
            series: Array<MapSeries>;
            seriesXData?: Array<number>;
        }
        interface MapChart extends Chart {
            xAxis: Array<MapAxis>;
        }
    }
}

import U from '../parts/Utilities.js';
const {
    pick
} = U;

import '../parts/Axis.js';

var addEvent = H.addEvent,
    Axis = H.Axis;

/* eslint-disable no-invalid-this */

// Override to use the extreme coordinates from the SVG shape, not the data
// values
addEvent(Axis as any, 'getSeriesExtremes', function (
    this: Highcharts.MapAxis
): void {
    var xData = [] as Array<number>;

    // Remove the xData array and cache it locally so that the proceed method
    // doesn't use it
    if (this.isXAxis) {
        this.series.forEach(function (
            series: Highcharts.MapSeries,
            i: number
        ): void {
            if (series.useMapGeometry) {
                (xData as any)[i] = series.xData;
                series.xData = [];
            }
        });
        this.seriesXData = xData;
    }

});

addEvent(Axis as any, 'afterGetSeriesExtremes', function (
    this: Highcharts.MapAxis
): void {

    var xData = this.seriesXData,
        dataMin: number,
        dataMax: number,
        useMapGeometry;

    // Run extremes logic for map and mapline
    if (this.isXAxis) {
        dataMin = pick(this.dataMin, Number.MAX_VALUE);
        dataMax = pick(this.dataMax, -Number.MAX_VALUE);
        this.series.forEach(function (
            series: Highcharts.MapSeries,
            i: number
        ): void {
            if (series.useMapGeometry) {
                dataMin = Math.min(dataMin, pick(series.minX, dataMin));
                dataMax = Math.max(dataMax, pick(series.maxX, dataMax));
                series.xData = (xData as any)[i]; // Reset xData array
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
addEvent(Axis as any, 'afterSetAxisTranslation', function (
    this: Highcharts.MapAxis
): void {
    var chart = this.chart,
        mapRatio,
        plotRatio = chart.plotWidth / chart.plotHeight,
        adjustedAxisLength,
        xAxis = chart.xAxis[0],
        padAxis,
        fixTo,
        fixDiff,
        preserveAspectRatio;

    // Check for map-like series
    if (this.coll === 'yAxis' && typeof xAxis.transA !== 'undefined') {
        this.series.forEach(function (series: Highcharts.MapSeries): void {
            if (series.preserveAspectRatio) {
                preserveAspectRatio = true;
            }
        });
    }

    // On Y axis, handle both
    if (preserveAspectRatio) {

        // Use the same translation for both axes
        this.transA = xAxis.transA = Math.min(this.transA, xAxis.transA);

        mapRatio = plotRatio / (
            ((xAxis.max as any) - (xAxis.min as any)) /
            ((this.max as any) - (this.min as any))
        );

        // What axis to pad to put the map in the middle
        padAxis = mapRatio < 1 ? this : xAxis;

        // Pad it
        adjustedAxisLength =
            ((padAxis.max as any) - (padAxis.min as any)) * padAxis.transA;
        padAxis.pixelPadding = padAxis.len - adjustedAxisLength;
        padAxis.minPixelPadding = padAxis.pixelPadding / 2;

        fixTo = padAxis.fixTo;
        if (fixTo) {
            fixDiff = fixTo[1] - padAxis.toValue(fixTo[0], true);
            fixDiff *= padAxis.transA;
            if (
                Math.abs(fixDiff) > padAxis.minPixelPadding ||
                (
                    padAxis.min === padAxis.dataMin &&
                    padAxis.max === padAxis.dataMax
                )
            ) { // zooming out again, keep within restricted area
                fixDiff = 0;
            }
            padAxis.minPixelPadding -= fixDiff;
        }
    }
});

// Override Axis.render in order to delete the fixTo prop
addEvent(Axis as any, 'render', function (this: Highcharts.MapAxis): void {
    this.fixTo = null as any;
});
