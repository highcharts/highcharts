/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Handle announcing new data for a chart.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../../../../parts/Globals.js';
import U from '../../../../parts/Utilities.js';
var extend = U.extend,
    defined = U.defined;

import HTMLUtilities from '../../utils/htmlUtilities.js';
var visuallyHideElement = HTMLUtilities.visuallyHideElement;

import ChartUtilities from '../../utils/chartUtilities.js';
var getChartTitle = ChartUtilities.getChartTitle;

import SeriesDescriber from './SeriesDescriber.js';
var defaultPointDescriptionFormatter = SeriesDescriber
        .defaultPointDescriptionFormatter,
    defaultSeriesDescriptionFormatter = SeriesDescriber
        .defaultSeriesDescriptionFormatter;

import EventProvider from '../../utils/EventProvider.js';
import DOMElementProvider from '../../utils/DOMElementProvider.js';


/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        class NewDataAnnouncer {
            public constructor(chart: AccessibilityChart);
            public announceRegion: HTMLDOMElement;
            public chart: AccessibilityChart;
            public clearAnnouncementContainerTimer?: number;
            public dirty: NewDataAnnouncerDirtyObject;
            public domElementProvider: DOMElementProvider;
            public eventProvider: EventProvider;
            public lastAnnouncementTime: number;
            public queuedAnnouncement?: (
                NewDataAnnouncerQueuedAnnouncementObject
            );
            public queuedAnnouncementTimer?: number;
            public addAnnounceRegion(): HTMLDOMElement;
            public addEventListeners(): void;
            public announceDirtyData(): void;
            public buildAnnouncementMessage(
                dirtySeries: Array<Series>,
                newSeries?: Series,
                newPoint?: Point
            ): string;
            public destroy(): void;
            public init(): void;
            public liveRegionSpeak(message: string): void;
            public onPointAdded(point: Point): void;
            public onSeriesAdded(series: Series): void;
            public onSeriesUpdatedData(series: Series): void;
            public queueAnnouncement(
                dirtySeries: Array<Series>,
                newSeries?: Series,
                newPoint?: Point
            ): void;
        }
        interface NewDataAnnouncerDirtyObject {
            allSeries: Dictionary<Series>;
            hasDirty?: boolean;
            newPoint?: Point;
            newSeries?: Series;
        }
        interface NewDataAnnouncerQueuedAnnouncementObject {
            message: string;
            series: Array<Series>;
            time: number;
        }
    }
}


/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * @private
 */
function chartHasAnnounceEnabled(chart: Highcharts.Chart): boolean {
    return !!(chart.options.accessibility as any).announceNewData.enabled;
}


/**
 * @private
 */
function findPointInDataArray(
    point: Highcharts.Point
): Highcharts.Point {
    var candidates = point.series.data.filter(function (
        candidate: Highcharts.Point
    ): boolean {
        return point.x === candidate.x && point.y === candidate.y;
    });

    return candidates.length === 1 ? candidates[0] : point;
}


/**
 * Get array of unique series from two arrays
 * @private
 */
function getUniqueSeries(
    arrayA?: Array<Highcharts.Series>,
    arrayB?: Array<Highcharts.Series>
): Array<Highcharts.Series> {
    var uniqueSeries = (arrayA || []).concat(arrayB || [])
        .reduce(function (
            acc: Highcharts.Dictionary<Highcharts.Series>,
            cur: Highcharts.Series
        ): Highcharts.Dictionary<Highcharts.Series> {
            acc[cur.name + cur.index] = cur;
            return acc;
        }, {});

    return Object.keys(uniqueSeries).map(function (
        ix: string
    ): Highcharts.Series {
        return uniqueSeries[ix];
    });
}


/**
 * @private
 * @class
 */
var NewDataAnnouncer: typeof Highcharts.NewDataAnnouncer = function (
    this: Highcharts.NewDataAnnouncer,
    chart: Highcharts.AccessibilityChart
): void {
    this.chart = chart;
} as any;
extend(NewDataAnnouncer.prototype, {

    /**
     * Initialize the new data announcer.
     */
    init: function (this: Highcharts.NewDataAnnouncer): void {
        this.lastAnnouncementTime = 0;
        this.dirty = {
            allSeries: {}
        };

        this.eventProvider = new EventProvider();
        this.domElementProvider = new DOMElementProvider();

        this.announceRegion = this.addAnnounceRegion();
        this.addEventListeners();
    },


    /**
     * Remove traces of announcer.
     */
    destroy: function (this: Highcharts.NewDataAnnouncer): void {
        this.eventProvider.removeAddedEvents();
        this.domElementProvider.destroyCreatedElements();
    },


    /**
     * Add the announcement live region to the DOM.
     * @private
     */
    addAnnounceRegion: function (
        this: Highcharts.NewDataAnnouncer
    ): Highcharts.HTMLDOMElement {
        var chart = this.chart,
            div = this.domElementProvider.createElement('div'),
            announceOptions = (
                (chart.options.accessibility as any).announceNewData
            );

        div.setAttribute('aria-hidden', false);
        div.setAttribute(
            'aria-live', announceOptions.interruptUser ? 'assertive' : 'polite'
        );

        visuallyHideElement(div);
        chart.renderTo.insertBefore(div, chart.renderTo.firstChild);

        return div;
    },


    /**
     * Add event listeners for the announcer
     * @private
     */
    addEventListeners: function (this: Highcharts.NewDataAnnouncer): void {
        var announcer = this,
            chart = this.chart,
            e = this.eventProvider;

        e.addEvent(chart, 'afterDrilldown', function (): void {
            announcer.lastAnnouncementTime = 0;
        });

        e.addEvent(H.Series, 'updatedData', function (): void {
            announcer.onSeriesUpdatedData(this);
        });

        e.addEvent(chart, 'afterAddSeries', function (
            e: { series: Highcharts.Series }
        ): void {
            announcer.onSeriesAdded(e.series);
        });

        e.addEvent(H.Series, 'addPoint', function (
            e: { point: Highcharts.Point }
        ): void {
            announcer.onPointAdded(e.point);
        });

        e.addEvent(chart, 'redraw', function (): void {
            announcer.announceDirtyData();
        });
    },


    /**
     * On new data in the series, make sure we add it to the dirty list.
     * @private
     * @param {Highcharts.Series} series
     */
    onSeriesUpdatedData: function (
        this: Highcharts.NewDataAnnouncer,
        series: Highcharts.Series
    ): void {
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
    onSeriesAdded: function (
        this: Highcharts.NewDataAnnouncer,
        series: Highcharts.Series
    ): void {
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
    onPointAdded: function (
        this: Highcharts.NewDataAnnouncer,
        point: Highcharts.Point
    ): void {
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
    announceDirtyData: function (this: Highcharts.NewDataAnnouncer): void {
        var chart = this.chart,
            announcer = this;

        if (
            (chart.options.accessibility as any).announceNewData &&
            this.dirty.hasDirty
        ) {
            var newPoint = this.dirty.newPoint;

            // If we have a single new point, see if we can find it in the
            // data array. Otherwise we can only pass through options to
            // the description builder, and it is a bit sparse in info.
            if (newPoint) {
                newPoint = findPointInDataArray(newPoint);
            }

            this.queueAnnouncement(
                Object.keys(this.dirty.allSeries).map(function (
                    ix: string
                ): Highcharts.Series {
                    return announcer.dirty.allSeries[ix];
                }),
                this.dirty.newSeries,
                newPoint
            );

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
    queueAnnouncement: function (
        this: Highcharts.NewDataAnnouncer,
        dirtySeries: Array<Highcharts.Series>,
        newSeries?: Highcharts.Series,
        newPoint?: Highcharts.Point
    ): void {
        var chart = this.chart,
            annOptions: Highcharts.AccessibilityAnnounceNewDataOptions = (
                (chart.options.accessibility as any).announceNewData
            );

        if (annOptions.enabled) {
            var announcer = this,
                now = +new Date(),
                dTime = now - this.lastAnnouncementTime,
                time = Math.max(
                    0,
                    (annOptions.minAnnounceInterval as any) - dTime
                ),
                // Add series from previously queued announcement.
                allSeries = getUniqueSeries(
                    this.queuedAnnouncement && this.queuedAnnouncement.series,
                    dirtySeries
                );

            // Build message and announce
            var message = this.buildAnnouncementMessage(
                allSeries, newSeries, newPoint
            );
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
                announcer.queuedAnnouncementTimer = setTimeout(
                    function (): void {
                        if (announcer && announcer.announceRegion) {
                            announcer.lastAnnouncementTime = +new Date();
                            announcer.liveRegionSpeak(
                                (announcer.queuedAnnouncement as any).message
                            );
                            delete announcer.queuedAnnouncement;
                            delete announcer.queuedAnnouncementTimer;
                        }
                    },
                    time
                );
            }
        }
    },


    /**
     * Speak a message using the announcer live region.
     * @private
     * @param {string} message
     */
    liveRegionSpeak: function (
        this: Highcharts.NewDataAnnouncer,
        message: string
    ): void {
        var announcer = this;

        this.announceRegion.innerHTML = message;

        // Delete contents after a little while to avoid user finding the live
        // region in the DOM.
        if (this.clearAnnouncementContainerTimer) {
            clearTimeout(
                this.clearAnnouncementContainerTimer
            );
        }
        this.clearAnnouncementContainerTimer = setTimeout(
            function (): void {
                announcer.announceRegion.innerHTML = '';
                delete announcer.clearAnnouncementContainerTimer;
            },
            1000
        );
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
    buildAnnouncementMessage: function (
        this: Highcharts.NewDataAnnouncer,
        dirtySeries: Array<Highcharts.Series>,
        newSeries?: Highcharts.AccessibilitySeries,
        newPoint?: Highcharts.AccessibilityPoint
    ): (string|null) {
        var chart = this.chart,
            annOptions = chart.options.accessibility.announceNewData;

        // User supplied formatter?
        if (annOptions.announcementFormatter) {
            var formatterRes = annOptions.announcementFormatter(
                dirtySeries, newSeries, newPoint
            );
            if (formatterRes !== false) {
                return formatterRes.length ? formatterRes : null;
            }
        }

        // Default formatter - use lang options
        var multiple = H.charts && H.charts.length > 1 ? 'Multiple' : 'Single',
            langKey = newSeries ? 'newSeriesAnnounce' + multiple :
                newPoint ? 'newPointAnnounce' + multiple : 'newDataAnnounce',
            chartTitle = getChartTitle(chart);

        return chart.langFormat(
            'accessibility.announceNewData.' + langKey, {
                chartTitle: chartTitle,
                seriesDesc: newSeries ?
                    defaultSeriesDescriptionFormatter(newSeries) :
                    null,
                pointDesc: newPoint ?
                    defaultPointDescriptionFormatter(newPoint) :
                    null,
                point: newPoint,
                series: newSeries
            }
        );
    }
});

export default NewDataAnnouncer;
