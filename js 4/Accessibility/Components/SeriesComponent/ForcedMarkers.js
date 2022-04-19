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
import U from '../../../Core/Utilities.js';
var addEvent = U.addEvent, merge = U.merge;
/* *
 *
 *  Composition
 *
 * */
var ForcedMarkersComposition;
(function (ForcedMarkersComposition) {
    /* *
     *
     *  Declarations
     *
     * */
    /* *
     *
     *  Compositions
     *
     * */
    var composedClasses = [];
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    /**
     * @private
     */
    function compose(SeriesClass) {
        if (composedClasses.indexOf(SeriesClass) === -1) {
            composedClasses.push(SeriesClass);
            addEvent(SeriesClass, 'afterSetOptions', seriesOnAfterSetOptions);
            addEvent(SeriesClass, 'render', seriesOnRender);
            addEvent(SeriesClass, 'afterRender', seriesOnAfterRender);
        }
    }
    ForcedMarkersComposition.compose = compose;
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
            pointOptions.marker.states.normal.opacity;
    }
    /**
     * @private
     */
    function handleForcePointMarkers(series) {
        var i = series.points.length;
        while (i--) {
            var point = series.points[i];
            var pointOptions = point.options;
            var hadForcedMarker = point.hasForcedA11yMarker;
            delete point.hasForcedA11yMarker;
            if (pointOptions.marker) {
                var isStillForcedMarker = hadForcedMarker &&
                    getPointMarkerOpacity(pointOptions) === 0;
                if (pointOptions.marker.enabled && !isStillForcedMarker) {
                    unforcePointMarkerOptions(pointOptions);
                    point.hasForcedA11yMarker = false;
                }
                else if (pointOptions.marker.enabled === false) {
                    forceZeroOpacityMarkerOptions(pointOptions);
                    point.hasForcedA11yMarker = true;
                }
            }
        }
    }
    /**
     * @private
     */
    function hasIndividualPointMarkerOptions(series) {
        return !!(series._hasPointMarkers &&
            series.points &&
            series.points.length);
    }
    /**
     * @private
     */
    function isWithinDescriptionThreshold(series) {
        var a11yOptions = series.chart.options.accessibility;
        return series.points.length <
            a11yOptions.series.pointDescriptionEnabledThreshold ||
            a11yOptions.series
                .pointDescriptionEnabledThreshold === false;
    }
    /**
     * Process marker graphics after render
     * @private
     */
    function seriesOnAfterRender() {
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
                        point.graphic[point.hasForcedA11yMarker ?
                            'addClass' : 'removeClass']('highcharts-a11y-marker-hidden');
                        point.graphic[point.hasForcedA11yMarker === false ?
                            'addClass' :
                            'removeClass']('highcharts-a11y-marker-visible');
                    }
                });
            }
        }
    }
    /**
     * Keep track of options to reset markers to if no longer forced.
     * @private
     */
    function seriesOnAfterSetOptions(e) {
        this.resetA11yMarkerOptions = merge(e.options.marker || {}, this.userOptions.marker || {});
    }
    /**
     * Keep track of forcing markers.
     * @private
     */
    function seriesOnRender() {
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
            delete series.resetA11yMarkerOptions;
        }
    }
    /**
     * @private
     */
    function shouldForceMarkers(series) {
        var chart = series.chart, chartA11yEnabled = chart.options.accessibility.enabled, seriesA11yEnabled = (series.options.accessibility &&
            series.options.accessibility.enabled) !== false;
        return (chartA11yEnabled &&
            seriesA11yEnabled &&
            isWithinDescriptionThreshold(series));
    }
    /**
     * @private
     */
    function unforcePointMarkerOptions(pointOptions) {
        merge(true, pointOptions.marker, {
            states: {
                normal: {
                    opacity: getPointMarkerOpacity(pointOptions) || 1
                }
            }
        });
    }
    /**
     * Reset markers to normal
     * @private
     */
    function unforceSeriesMarkerOptions(series) {
        var resetMarkerOptions = series.resetA11yMarkerOptions;
        if (resetMarkerOptions) {
            var originalOpactiy = resetMarkerOptions.states &&
                resetMarkerOptions.states.normal &&
                resetMarkerOptions.states.normal.opacity;
            series.update({
                marker: {
                    enabled: resetMarkerOptions.enabled,
                    states: {
                        normal: { opacity: originalOpactiy }
                    }
                }
            });
        }
    }
})(ForcedMarkersComposition || (ForcedMarkersComposition = {}));
/* *
 *
 *  Default Export
 *
 * */
export default ForcedMarkersComposition;
