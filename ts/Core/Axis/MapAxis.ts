/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Chart from '../Chart/Chart';
import type MapSeries from '../../Series/Map/MapSeries';
import Axis from './Axis.js';
import U from '../Utilities.js';
const {
    addEvent,
    pick
} = U;

/**
 * @private
 */
declare module './Types' {
    interface AxisComposition {
        mapAxis?: MapAxis['mapAxis'];
    }
    interface AxisTypeRegistry {
        MapAxis: MapAxis;
    }
}
declare global {
    namespace Highcharts {
        interface MapChart extends Chart {
            xAxis: Array<MapAxis>;
        }
    }
}

/**
 * Map support for axes.
 * @private
 * @class
 */
class MapAxisAdditions {

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(axis: MapAxis) {
        this.axis = axis;
    }

    /* *
     *
     *  Properties
     *
     * */

    axis: MapAxis;
    fixTo?: Array<number>;
    pixelPadding?: number;
    seriesXData?: Array<(Array<number>|undefined)>;
}

/**
 * Axis with map support.
 * @private
 * @class
 */
class MapAxis {

    /**
     * Extends axes with map support.
     * @private
     *
     * @param {Highcharts.Axis} AxisClass
     * Axis class to extend.
     */
    public static compose(AxisClass: typeof Axis): void {

        AxisClass.keepProps.push('mapAxis');

        /* eslint-disable no-invalid-this */

        addEvent(AxisClass, 'init', function (): void {
            const axis = this;

            if (!axis.mapAxis) {
                axis.mapAxis = new MapAxisAdditions(axis as MapAxis);
            }
        });

        // Override to use the extreme coordinates from the SVG shape, not the
        // data values
        addEvent(AxisClass, 'getSeriesExtremes', function (): void {

            if (!this.mapAxis) {
                return;
            }

            const axis = this as MapAxis;
            const xData: Array<(Array<number>|undefined)> = [];

            // Remove the xData array and cache it locally so that the proceed
            // method doesn't use it
            if (axis.isXAxis) {
                axis.series.forEach(function (series, i): void {
                    if (series.useMapGeometry) {
                        xData[i] = series.xData;
                        series.xData = [];
                    }
                });
                axis.mapAxis.seriesXData = xData;
            }

        });

        addEvent(AxisClass, 'afterGetSeriesExtremes', function (): void {

            if (!this.mapAxis) {
                return;
            }

            const axis = this as MapAxis;
            const xData = axis.mapAxis.seriesXData || [];

            let dataMin: number,
                dataMax: number,
                useMapGeometry;

            // Run extremes logic for map and mapline
            if (axis.isXAxis) {
                dataMin = pick(axis.dataMin, Number.MAX_VALUE);
                dataMax = pick(axis.dataMax, -Number.MAX_VALUE);
                axis.series.forEach(function (series, i): void {
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
        addEvent(AxisClass, 'afterSetAxisTranslation', function (): void {

            if (!this.mapAxis) {
                return;
            }

            const axis = this as MapAxis;
            const chart = axis.chart;
            const plotRatio = chart.plotWidth / chart.plotHeight;
            const xAxis = chart.xAxis[0];

            let mapRatio,
                adjustedAxisLength,
                padAxis,
                fixTo,
                fixDiff,
                preserveAspectRatio;

            // Check for map-like series
            if (axis.coll === 'yAxis' && typeof xAxis.transA !== 'undefined') {
                axis.series.forEach(function (series): void {
                    if (series.preserveAspectRatio) {
                        preserveAspectRatio = true;
                    }
                });
            }

            // On Y axis, handle both
            if (preserveAspectRatio) {

                // Use the same translation for both axes
                axis.transA = xAxis.transA = Math.min(axis.transA, xAxis.transA);

                mapRatio = plotRatio / (
                    ((xAxis.max as any) - (xAxis.min as any)) /
                    ((axis.max as any) - (axis.min as any))
                );

                // What axis to pad to put the map in the middle
                padAxis = mapRatio < 1 ? axis : xAxis;

                // Pad it
                adjustedAxisLength =
                    ((padAxis.max as any) - (padAxis.min as any)) * padAxis.transA;
                padAxis.mapAxis.pixelPadding = padAxis.len - adjustedAxisLength;
                padAxis.minPixelPadding = padAxis.mapAxis.pixelPadding / 2;

                fixTo = padAxis.mapAxis.fixTo;
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
        addEvent(AxisClass, 'render', function (): void {
            const axis = this;

            if (axis.mapAxis) {
                axis.mapAxis.fixTo = void 0;
            }
        });

        /* eslint-enable no-invalid-this */

    }

}

interface MapAxis extends Axis {
    chart: Highcharts.MapChart;
    mapAxis: MapAxisAdditions;
    series: Array<MapSeries>;
}

MapAxis.compose(Axis); // @todo move to factory functions

export default MapAxis;
