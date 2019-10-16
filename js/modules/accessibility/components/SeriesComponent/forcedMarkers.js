/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Handle forcing series markers.
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../../../../parts/Globals.js';
var merge = H.merge;


function isWithinDescriptionThreshold(series) {
    var a11yOptions = series.chart.options.accessibility;

    return series.points.length <
        a11yOptions.series.pointDescriptionEnabledThreshold ||
        a11yOptions.series.pointDescriptionEnabledThreshold === false;
}


function isWithinNavigationThreshold(series) {
    var navOptions = series.chart.options.accessibility.keyboardNavigation
        .seriesNavigation;

    return series.points.length <
        navOptions.pointNavigationEnabledThreshold ||
        navOptions.pointNavigationEnabledThreshold === false;
}


function shouldForceMarkers(series) {
    var chartA11yEnabled = series.chart.options.accessibility.enabled,
        seriesA11yEnabled = (series.options.accessibility &&
            series.options.accessibility.enabled) !== false,
        withinDescriptionThreshold = isWithinDescriptionThreshold(series),
        withinNavigationThreshold = isWithinNavigationThreshold(series);

    return chartA11yEnabled && seriesA11yEnabled &&
        (withinDescriptionThreshold || withinNavigationThreshold);
}


function unforceMarkerOptions(series) {
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


function forceZeroOpacityMarkerOptions(options) {
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


function getPointMarkerOpacity(pointOptions) {
    return pointOptions.marker.states &&
        pointOptions.marker.states.normal &&
        pointOptions.marker.states.normal.opacity || 1;
}


function forceDisplayPointMarker(pointOptions) {
    merge(true, pointOptions.marker, {
        states: {
            normal: {
                opacity: getPointMarkerOpacity(pointOptions)
            }
        }
    });
}


function handleForcePointMarkers(points) {
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


function addForceMarkersEvents() {

    /**
     * Keep track of forcing markers.
     * @private
     */
    H.addEvent(H.Series, 'render', function () {
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
    H.addEvent(H.Series, 'afterSetOptions', function (e) {
        this.resetA11yMarkerOptions = merge(
            e.options.marker || {}, this.userOptions.marker || {}
        );
    });

}

export default addForceMarkersEvents;
