/* *
 *
 *  (c) 2009-2020 Øystein Moseng
 *
 *  Handle forcing series markers.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Point from '../../../../parts/Point';
import H from '../../../../parts/Globals.js';
import U from '../../../../parts/Utilities.js';
const {
    addEvent,
    merge
} = U;

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        interface PointStatesNormalOptionsObject {
            opacity?: number;
        }
        interface Series {
            a11yMarkersForced?: boolean;
            resetA11yMarkerOptions: PointMarkerOptionsObject;
            resetMarkerOptions?: unknown;
        }
    }
}


/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * @private
 */
function isWithinDescriptionThreshold(
    series: Highcharts.AccessibilitySeries
): boolean {
    var a11yOptions = series.chart.options.accessibility;

    return series.points.length <
        (a11yOptions.series as any).pointDescriptionEnabledThreshold ||
        (a11yOptions.series as any).pointDescriptionEnabledThreshold === false;
}


/**
 * @private
 */
function isWithinNavigationThreshold(
    series: Highcharts.AccessibilitySeries
): boolean {
    var navOptions = series.chart.options.accessibility
        .keyboardNavigation.seriesNavigation;

    return series.points.length <
        navOptions.pointNavigationEnabledThreshold ||
        navOptions.pointNavigationEnabledThreshold === false;
}


/**
 * @private
 */
function shouldForceMarkers(
    series: Highcharts.AccessibilitySeries
): boolean {
    const chart = series.chart,
        chartA11yEnabled = chart.options.accessibility.enabled,
        seriesA11yEnabled = (series.options.accessibility &&
            series.options.accessibility.enabled) !== false,
        withinDescriptionThreshold = isWithinDescriptionThreshold(series),
        withinNavigationThreshold = isWithinNavigationThreshold(series),
        isStyledMode = chart.styledMode; // #13482

    return chartA11yEnabled && seriesA11yEnabled && !isStyledMode &&
        (withinDescriptionThreshold || withinNavigationThreshold);
}


/**
 * @private
 */
function unforceMarkerOptions(series: Highcharts.AccessibilitySeries): void {
    var resetMarkerOptions = series.resetA11yMarkerOptions;

    merge(true, series.options, {
        marker: {
            enabled: resetMarkerOptions.enabled,
            states: {
                normal: {
                    opacity: resetMarkerOptions.states &&
                        resetMarkerOptions.states.normal &&
                        resetMarkerOptions.states.normal.opacity
                }
            }
        }
    });
}


/**
 * @private
 */
function forceZeroOpacityMarkerOptions(
    options: (Highcharts.PointOptionsObject|Highcharts.SeriesOptions)
): void {
    merge(true, options, {
        marker: {
            enabled: true,
            states: {
                normal: {
                    opacity: 0
                }
            }
        }
    });
}


/**
 * @private
 */
function getPointMarkerOpacity(
    pointOptions: Highcharts.PointOptionsObject
): number {
    return (pointOptions.marker as any).states &&
        (pointOptions.marker as any).states.normal &&
        (pointOptions.marker as any).states.normal.opacity || 1;
}


/**
 * @private
 */
function forceDisplayPointMarker(
    pointOptions: Highcharts.PointOptionsObject
): void {
    merge(true, pointOptions.marker, {
        states: {
            normal: {
                opacity: getPointMarkerOpacity(pointOptions)
            }
        }
    });
}


/**
 * @private
 */
function handleForcePointMarkers(points: Array<Point>): void {
    var i = points.length;

    while (i--) {
        var pointOptions = points[i].options;

        if (pointOptions.marker) {
            if (pointOptions.marker.enabled) {
                forceDisplayPointMarker(pointOptions);
            } else {
                forceZeroOpacityMarkerOptions(pointOptions);
            }
        }
    }
}


/**
 * @private
 */
function addForceMarkersEvents(): void {

    /**
     * Keep track of forcing markers.
     * @private
     */
    addEvent(H.Series as any, 'render', function (
        this: Highcharts.AccessibilitySeries
    ): void {
        var series = this,
            options = series.options;

        if (shouldForceMarkers(series)) {
            if (options.marker && options.marker.enabled === false) {
                series.a11yMarkersForced = true;
                forceZeroOpacityMarkerOptions(series.options);
            }

            if (
                series._hasPointMarkers && series.points && series.points.length
            ) {
                handleForcePointMarkers(series.points);
            }

        } else if (series.a11yMarkersForced && series.resetMarkerOptions) {
            delete series.a11yMarkersForced;
            unforceMarkerOptions(series);
        }
    });

    /**
     * Keep track of options to reset markers to if no longer forced.
     * @private
     */
    addEvent(H.Series, 'afterSetOptions', function (
        e: { options: Highcharts.SeriesOptions }
    ): void {
        this.resetA11yMarkerOptions = merge(
            e.options.marker || {}, this.userOptions.marker || {}
        );
    });

}

export default addForceMarkersEvents;
