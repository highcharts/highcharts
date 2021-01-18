/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Handle forcing series markers.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import Series from '../../../Core/Series/Series.js';
import U from '../../../Core/Utilities.js';
var addEvent = U.addEvent, merge = U.merge;
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * @private
 */
function isWithinDescriptionThreshold(series) {
    var a11yOptions = series.chart.options.accessibility;
    return series.points.length <
        a11yOptions.series.pointDescriptionEnabledThreshold ||
        a11yOptions.series.pointDescriptionEnabledThreshold === false;
}
/**
 * @private
 */
function shouldForceMarkers(series) {
    var chart = series.chart, chartA11yEnabled = chart.options.accessibility.enabled, seriesA11yEnabled = (series.options.accessibility &&
        series.options.accessibility.enabled) !== false;
    return chartA11yEnabled && seriesA11yEnabled && isWithinDescriptionThreshold(series);
}
/**
 * @private
 */
function hasIndividualPointMarkerOptions(series) {
    return !!(series._hasPointMarkers && series.points && series.points.length);
}
/**
 * @private
 */
function unforceSeriesMarkerOptions(series) {
    var resetMarkerOptions = series.resetA11yMarkerOptions;
    if (resetMarkerOptions) {
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
}
/**
 * @private
 */
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
/**
 * @private
 */
function getPointMarkerOpacity(pointOptions) {
    return pointOptions.marker.states &&
        pointOptions.marker.states.normal &&
        pointOptions.marker.states.normal.opacity || 1;
}
/**
 * @private
 */
function unforcePointMarkerOptions(pointOptions) {
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
function handleForcePointMarkers(series) {
    var i = series.points.length;
    while (i--) {
        var point = series.points[i];
        var pointOptions = point.options;
        delete point.hasForcedA11yMarker;
        if (pointOptions.marker) {
            if (pointOptions.marker.enabled) {
                unforcePointMarkerOptions(pointOptions);
                point.hasForcedA11yMarker = false;
            }
            else {
                forceZeroOpacityMarkerOptions(pointOptions);
                point.hasForcedA11yMarker = true;
            }
        }
    }
}
/**
 * @private
 */
function addForceMarkersEvents() {
    /**
     * Keep track of forcing markers.
     * @private
     */
    addEvent(Series, 'render', function () {
        var series = this, options = series.options;
        if (shouldForceMarkers(series)) {
            if (options.marker && options.marker.enabled === false) {
                series.a11yMarkersForced = true;
                forceZeroOpacityMarkerOptions(series.options);
            }
            if (hasIndividualPointMarkerOptions(series)) {
                handleForcePointMarkers(series);
            }
        }
        else if (series.a11yMarkersForced) {
            delete series.a11yMarkersForced;
            unforceSeriesMarkerOptions(series);
        }
    });
    /**
     * Keep track of options to reset markers to if no longer forced.
     * @private
     */
    addEvent(Series, 'afterSetOptions', function (e) {
        this.resetA11yMarkerOptions = merge(e.options.marker || {}, this.userOptions.marker || {});
    });
    /**
     * Process marker graphics after render
     * @private
     */
    addEvent(Series, 'afterRender', function () {
        var series = this;
        // For styled mode the rendered graphic does not reflect the style
        // options, and we need to add/remove classes to achieve the same.
        if (series.chart.styledMode) {
            if (series.markerGroup) {
                series.markerGroup[series.a11yMarkersForced ? 'addClass' : 'removeClass']('highcharts-a11y-markers-hidden');
            }
            // Do we need to handle individual points?
            if (hasIndividualPointMarkerOptions(series)) {
                series.points.forEach(function (point) {
                    if (point.graphic) {
                        point.graphic[point.hasForcedA11yMarker ? 'addClass' : 'removeClass']('highcharts-a11y-marker-hidden');
                        point.graphic[point.hasForcedA11yMarker === false ? 'addClass' : 'removeClass']('highcharts-a11y-marker-visible');
                    }
                });
            }
        }
    });
}
export default addForceMarkersEvents;
