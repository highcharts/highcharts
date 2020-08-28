/* *
 *
 *  (c) 2009-2020 Øystein Moseng
 *
 *  Handle announcing new data for a chart.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../../../Core/Globals.js';
import CartesianSeries from '../../../Core/Series/CartesianSeries.js';
import U from '../../../Core/Utilities.js';
var extend = U.extend, defined = U.defined;
import ChartUtilities from '../../Utils/ChartUtilities.js';
var getChartTitle = ChartUtilities.getChartTitle;
import SeriesDescriber from './SeriesDescriber.js';
var defaultPointDescriptionFormatter = SeriesDescriber
    .defaultPointDescriptionFormatter, defaultSeriesDescriptionFormatter = SeriesDescriber
    .defaultSeriesDescriptionFormatter;
import Announcer from '../../Utils/Announcer.js';
import EventProvider from '../../Utils/EventProvider.js';
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * @private
 */
function chartHasAnnounceEnabled(chart) {
    return !!chart.options.accessibility.announceNewData.enabled;
}
/**
 * @private
 */
function findPointInDataArray(point) {
    var candidates = point.series.data.filter(function (candidate) {
        return point.x === candidate.x && point.y === candidate.y;
    });
    return candidates.length === 1 ? candidates[0] : point;
}
/**
 * Get array of unique series from two arrays
 * @private
 */
function getUniqueSeries(arrayA, arrayB) {
    var uniqueSeries = (arrayA || []).concat(arrayB || [])
        .reduce(function (acc, cur) {
        acc[cur.name + cur.index] = cur;
        return acc;
    }, {});
    return Object.keys(uniqueSeries).map(function (ix) {
        return uniqueSeries[ix];
    });
}
/**
 * @private
 * @class
 */
var NewDataAnnouncer = function (chart) {
    this.chart = chart;
};
extend(NewDataAnnouncer.prototype, {
    /**
     * Initialize the new data announcer.
     * @private
     */
    init: function () {
        var chart = this.chart;
        var announceOptions = chart.options.accessibility.announceNewData;
        var announceType = announceOptions.interruptUser ? 'assertive' : 'polite';
        this.lastAnnouncementTime = 0;
        this.dirty = {
            allSeries: {}
        };
        this.eventProvider = new EventProvider();
        this.announcer = new Announcer(chart, announceType);
        this.addEventListeners();
    },
    /**
     * Remove traces of announcer.
     * @private
     */
    destroy: function () {
        this.eventProvider.removeAddedEvents();
        this.announcer.destroy();
    },
    /**
     * Add event listeners for the announcer
     * @private
     */
    addEventListeners: function () {
        var announcer = this, chart = this.chart, e = this.eventProvider;
        e.addEvent(chart, 'afterDrilldown', function () {
            announcer.lastAnnouncementTime = 0;
        });
        e.addEvent(CartesianSeries, 'updatedData', function () {
            announcer.onSeriesUpdatedData(this);
        });
        e.addEvent(chart, 'afterAddSeries', function (e) {
            announcer.onSeriesAdded(e.series);
        });
        e.addEvent(CartesianSeries, 'addPoint', function (e) {
            announcer.onPointAdded(e.point);
        });
        e.addEvent(chart, 'redraw', function () {
            announcer.announceDirtyData();
        });
    },
    /**
     * On new data in the series, make sure we add it to the dirty list.
     * @private
     * @param {Highcharts.Series} series
     */
    onSeriesUpdatedData: function (series) {
        var chart = this.chart;
        if (series.chart === chart && chartHasAnnounceEnabled(chart)) {
            this.dirty.hasDirty = true;
            this.dirty.allSeries[series.name + series.index] = series;
        }
    },
    /**
     * On new data series added, update dirty list.
     * @private
     * @param {Highcharts.Series} series
     */
    onSeriesAdded: function (series) {
        if (chartHasAnnounceEnabled(this.chart)) {
            this.dirty.hasDirty = true;
            this.dirty.allSeries[series.name + series.index] = series;
            // Add it to newSeries storage unless we already have one
            this.dirty.newSeries = defined(this.dirty.newSeries) ?
                void 0 : series;
        }
    },
    /**
     * On new point added, update dirty list.
     * @private
     * @param {Highcharts.Point} point
     */
    onPointAdded: function (point) {
        var chart = point.series.chart;
        if (this.chart === chart && chartHasAnnounceEnabled(chart)) {
            // Add it to newPoint storage unless we already have one
            this.dirty.newPoint = defined(this.dirty.newPoint) ?
                void 0 : point;
        }
    },
    /**
     * Gather what we know and announce the data to user.
     * @private
     */
    announceDirtyData: function () {
        var chart = this.chart, announcer = this;
        if (chart.options.accessibility.announceNewData &&
            this.dirty.hasDirty) {
            var newPoint = this.dirty.newPoint;
            // If we have a single new point, see if we can find it in the
            // data array. Otherwise we can only pass through options to
            // the description builder, and it is a bit sparse in info.
            if (newPoint) {
                newPoint = findPointInDataArray(newPoint);
            }
            this.queueAnnouncement(Object.keys(this.dirty.allSeries).map(function (ix) {
                return announcer.dirty.allSeries[ix];
            }), this.dirty.newSeries, newPoint);
            // Reset
            this.dirty = {
                allSeries: {}
            };
        }
    },
    /**
     * Announce to user that there is new data.
     * @private
     * @param {Array<Highcharts.Series>} dirtySeries
     *          Array of series with new data.
     * @param {Highcharts.Series} [newSeries]
     *          If a single new series was added, a reference to this series.
     * @param {Highcharts.Point} [newPoint]
     *          If a single point was added, a reference to this point.
     */
    queueAnnouncement: function (dirtySeries, newSeries, newPoint) {
        var _this = this;
        var chart = this.chart;
        var annOptions = chart.options.accessibility.announceNewData;
        if (annOptions.enabled) {
            var now = +new Date();
            var dTime = now - this.lastAnnouncementTime;
            var time = Math.max(0, annOptions.minAnnounceInterval - dTime);
            // Add series from previously queued announcement.
            var allSeries = getUniqueSeries(this.queuedAnnouncement && this.queuedAnnouncement.series, dirtySeries);
            // Build message and announce
            var message = this.buildAnnouncementMessage(allSeries, newSeries, newPoint);
            if (message) {
                // Is there already one queued?
                if (this.queuedAnnouncement) {
                    clearTimeout(this.queuedAnnouncementTimer);
                }
                // Build the announcement
                this.queuedAnnouncement = {
                    time: now,
                    message: message,
                    series: allSeries
                };
                // Queue the announcement
                this.queuedAnnouncementTimer = setTimeout(function () {
                    if (_this && _this.announcer) {
                        _this.lastAnnouncementTime = +new Date();
                        _this.announcer.announce(_this.queuedAnnouncement.message);
                        delete _this.queuedAnnouncement;
                        delete _this.queuedAnnouncementTimer;
                    }
                }, time);
            }
        }
    },
    /**
     * Get announcement message for new data.
     * @private
     * @param {Array<Highcharts.Series>} dirtySeries
     *          Array of series with new data.
     * @param {Highcharts.Series} [newSeries]
     *          If a single new series was added, a reference to this series.
     * @param {Highcharts.Point} [newPoint]
     *          If a single point was added, a reference to this point.
     *
     * @return {string|null}
     * The announcement message to give to user.
     */
    buildAnnouncementMessage: function (dirtySeries, newSeries, newPoint) {
        var chart = this.chart, annOptions = chart.options.accessibility.announceNewData;
        // User supplied formatter?
        if (annOptions.announcementFormatter) {
            var formatterRes = annOptions.announcementFormatter(dirtySeries, newSeries, newPoint);
            if (formatterRes !== false) {
                return formatterRes.length ? formatterRes : null;
            }
        }
        // Default formatter - use lang options
        var multiple = H.charts && H.charts.length > 1 ? 'Multiple' : 'Single', langKey = newSeries ? 'newSeriesAnnounce' + multiple :
            newPoint ? 'newPointAnnounce' + multiple : 'newDataAnnounce', chartTitle = getChartTitle(chart);
        return chart.langFormat('accessibility.announceNewData.' + langKey, {
            chartTitle: chartTitle,
            seriesDesc: newSeries ?
                defaultSeriesDescriptionFormatter(newSeries) :
                null,
            pointDesc: newPoint ?
                defaultPointDescriptionFormatter(newPoint) :
                null,
            point: newPoint,
            series: newSeries
        });
    }
});
export default NewDataAnnouncer;
