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
        interface Point {
            hasForcedA11yMarker?: boolean;
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
    const a11yOptions = series.chart.options.accessibility;

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
    const navOptions = series.chart.options.accessibility
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
        withinNavigationThreshold = isWithinNavigationThreshold(series);

    return chartA11yEnabled && seriesA11yEnabled &&
        (withinDescriptionThreshold || withinNavigationThreshold);
}


/**
 * @private
 */
function hasIndividualPointMarkerOptions(series: Highcharts.Series): boolean {
    return !!(series._hasPointMarkers && series.points && series.points.length);
}


/**
 * @private
 */
function unforceSeriesMarkerOptions(series: Highcharts.AccessibilitySeries): void {
    const resetMarkerOptions = series.resetA11yMarkerOptions;

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
function unforcePointMarkerOptions(
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
function handleForcePointMarkers(series: Highcharts.Series): void {
    let i = series.points.length;

    while (i--) {
        const point = series.points[i];
        const pointOptions = point.options;
        delete point.hasForcedA11yMarker;

        if (pointOptions.marker) {
            if (pointOptions.marker.enabled) {
                unforcePointMarkerOptions(pointOptions);
                point.hasForcedA11yMarker = false;
            } else {
                forceZeroOpacityMarkerOptions(pointOptions);
                point.hasForcedA11yMarker = true;
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
        const series = this,
            options = series.options;

        if (shouldForceMarkers(series)) {
            if (options.marker && options.marker.enabled === false) {
                series.a11yMarkersForced = true;
                forceZeroOpacityMarkerOptions(series.options);
            }

            if (hasIndividualPointMarkerOptions(series)) {
                handleForcePointMarkers(series);
            }

        } else if (series.a11yMarkersForced && series.resetMarkerOptions) {
            delete series.a11yMarkersForced;
            unforceSeriesMarkerOptions(series);
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


    /**
     * Process marker graphics after render
     * @private
     */
    addEvent(H.Series as any, 'afterRender', function (
        this: Highcharts.AccessibilitySeries
    ): void {
        const series = this;

        // For styled mode the rendered graphic does not reflect the style
        // options, and we need to add/remove classes to achieve the same.
        if (series.chart.styledMode) {
            if (series.markerGroup) {
                series.markerGroup[
                    series.a11yMarkersForced ? 'addClass' : 'removeClass'
                ]('highcharts-a11y-markers-hidden');
            }

            // Do we need to handle individual points?
            if (hasIndividualPointMarkerOptions(series)) {
                series.points.forEach((point): void => {
                    if (point.graphic) {
                        point.graphic[
                            point.hasForcedA11yMarker ? 'addClass' : 'removeClass'
                        ]('highcharts-a11y-marker-hidden');
                        point.graphic[
                            point.hasForcedA11yMarker === false ? 'addClass' : 'removeClass'
                        ]('highcharts-a11y-marker-visible');
                    }
                });
            }
        }
    });

}

export default addForceMarkersEvents;
