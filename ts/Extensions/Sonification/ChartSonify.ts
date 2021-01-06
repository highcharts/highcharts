/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Sonification functions for chart/series.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Chart from '../../Core/Chart/Chart';
import type SeriesOptions from '../../Core/Series/SeriesOptions';
import H from '../../Core/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface ChartSonificationEventsOptions {
            onEnd?: Function;
            onPointEnd?: Function;
            onPointStart?: Function;
            onSeriesEnd?: Function;
            onSeriesStart?: Function;
        }
        interface DefaultSonificationInstrumentMappingOptions extends SonificationInstrumentMappingOptions {
            pointPlayTime?: (string|Function);
        }
        interface DefaultSonificationInstrumentOptions {
            instrument: (string|Instrument);
            mapping?: DefaultSonificationInstrumentMappingOptions;
        }
        interface EarconConfiguration {
            condition: Function;
            earcon: Earcon;
            onPoint?: string;
        }
        interface SeriesSonificationEventsOptions {
            onPointEnd?: Function;
            onPointStart?: Function;
            onSeriesEnd?: Function;
            onSeriesStart?: Function;
        }
        interface SeriesSonificationOptions {
            earcons?: Array<EarconConfiguration>;
            enabled?: boolean;
            events?: SeriesSonificationEventsOptions;
            duration?: number;
            instruments?: Array<SonificationInstrumentOptions>;
        }
        interface SonificationInstrumentOptions extends PointInstrumentOptionsObject {
            instrument: (string|Instrument);
            mapping?: SonificationInstrumentMappingOptions;
        }
        interface SonificationInstrumentMappingOptions {
            duration?: (number|string|Function);
            frequency?: (number|string|Function);
            pan?: (number|string|Function);
            volume?: (number|string|Function);
        }
        interface ChartSonificationOptions {
            afterSeriesWait?: number;
            dataExtremes?: Record<string, RangeObject>;
            defaultInstrumentOptions?: DefaultSonificationInstrumentOptions;
            duration: number;
            earcons?: Array<EarconConfiguration>;
            enabled?: boolean;
            events?: ChartSonificationEventsOptions;
            masterVolume?: number;
            order: (string|Array<string|Earcon|Array<string|Earcon>>);
        }
        interface SonifyChartFunctionsObject {
            cancel(this: SonifyableChart, fadeOut?: boolean): void;
            chartSonify(
                this: SonifyableChart,
                options?: ChartSonificationOptions
            ): void;
            getCurrentPoints(this: SonifyableChart): Array<Point>;
            pause(this: SonifyableChart, fadeOut?: boolean): void;
            resetCursor(this: SonifyableChart): void;
            resetCursorEnd(this: SonifyableChart): void;
            resume(this: SonifyableChart, onEnd: Function): void;
            rewind(this: SonifyableChart, onEnd: Function): void;
            seriesSonify(
                this: SonifyableSeries,
                options: SonifySeriesOptionsObject
            ): void;
            setCursor(
                this: SonifyableChart,
                points: (Point|Array<Point>)
            ): void;
        }
        interface SonifyChartOptionsObject {
            afterSeriesWait?: number;
            dataExtremes?: Record<string, RangeObject>;
            duration: number;
            earcons?: Array<EarconConfiguration>;
            instruments?: Array<PointInstrumentObject>;
            masterVolume?: number;
            onSeriesEnd?: Function;
            onSeriesStart?: Function;
            onEnd?: Function;
            order: (string|Array<string|Earcon|Array<string|Earcon>>);
            pointPlayTime: (string|Function);
            seriesOptions?: (
                SonifySeriesOptionsObject|Array<SonifySeriesOptionsObject>
            );
        }
        interface SonifySeriesOptionsObject extends SeriesOptions {
            dataExtremes?: Record<string, RangeObject>;
            duration: number;
            earcons?: Array<EarconConfiguration>;
            instruments: Array<PointInstrumentObject>;
            masterVolume?: number;
            onEnd?: Function;
            onPointEnd?: Function;
            onPointStart?: Function;
            onStart?: Function;
            pointPlayTime: (string|Function);
            timeExtremes?: RangeObject;
        }
        interface SonifySeriesOrderObject {
            series: SonifyableSeries;
            seriesOptions: SonifySeriesOptionsObject;
        }
    }
}

/**
 * An Earcon configuration, specifying an Earcon and when to play it.
 *
 * @requires module:modules/sonification
 *
 * @interface Highcharts.EarconConfiguration
 *//**
 * An Earcon instance.
 * @name Highcharts.EarconConfiguration#earcon
 * @type {Highcharts.Earcon}
 *//**
 * The ID of the point to play the Earcon on.
 * @name Highcharts.EarconConfiguration#onPoint
 * @type {string|undefined}
 *//**
 * A function to determine whether or not to play this earcon on a point. The
 * function is called for every point, receiving that point as parameter. It
 * should return either a boolean indicating whether or not to play the earcon,
 * or a new Earcon instance - in which case the new Earcon will be played.
 * @name Highcharts.EarconConfiguration#condition
 * @type {Function|undefined}
 */

/**
 * Options for sonifying a series.
 *
 * @requires module:modules/sonification
 *
 * @interface Highcharts.SonifySeriesOptionsObject
 *//**
 * The duration for playing the points. Note that points might continue to play
 * after the duration has passed, but no new points will start playing.
 * @name Highcharts.SonifySeriesOptionsObject#duration
 * @type {number}
 *//**
 * The axis to use for when to play the points. Can be a string with a data
 * property (e.g. `x`), or a function. If it is a function, this function
 * receives the point as argument, and should return a numeric value. The points
 * with the lowest numeric values are then played first, and the time between
 * points will be proportional to the distance between the numeric values.
 * @name Highcharts.SonifySeriesOptionsObject#pointPlayTime
 * @type {string|Function}
 *//**
 * The instrument definitions for the points in this series.
 * @name Highcharts.SonifySeriesOptionsObject#instruments
 * @type {Array<Highcharts.PointInstrumentObject>}
 *//**
 * Earcons to add to the series.
 * @name Highcharts.SonifySeriesOptionsObject#earcons
 * @type {Array<Highcharts.EarconConfiguration>|undefined}
 *//**
 * Optionally provide the minimum/maximum data values for the points. If this is
 * not supplied, it is calculated from all points in the chart on demand. This
 * option is supplied in the following format, as a map of point data properties
 * to objects with min/max values:
 * ```js
 *     dataExtremes: {
 *         y: {
 *             min: 0,
 *             max: 100
 *         },
 *         z: {
 *             min: -10,
 *             max: 10
 *         }
 *         // Properties used and not provided are calculated on demand
 *     }
 * ```
 * @name Highcharts.SonifySeriesOptionsObject#dataExtremes
 * @type {Highcharts.Dictionary<Highcharts.RangeObject>|undefined}
 *//**
 * Callback before a point is played.
 * @name Highcharts.SonifySeriesOptionsObject#onPointStart
 * @type {Function|undefined}
 *//**
 * Callback after a point has finished playing.
 * @name Highcharts.SonifySeriesOptionsObject#onPointEnd
 * @type {Function|undefined}
 *//**
 * Callback after the series has played.
 * @name Highcharts.SonifySeriesOptionsObject#onEnd
 * @type {Function|undefined}
 */

''; // detach doclets above

import Point from '../../Core/Series/Point.js';
import U from '../../Core/Utilities.js';
const {
    find,
    isArray,
    merge,
    pick,
    splat,
    objectEach
} = U;

import utilities from './Utilities.js';


/**
 * Get the relative time value of a point.
 * @private
 * @param {Highcharts.Point} point
 * The point.
 * @param {Function|string} timeProp
 * The time axis data prop or the time function.
 * @return {number}
 * The time value.
 */
function getPointTimeValue(
    point: Highcharts.SonifyablePoint,
    timeProp: (string|Function)
): number {
    return typeof timeProp === 'function' ?
        timeProp(point) :
        pick((point as any)[timeProp], (point.options as any)[timeProp]);
}


/**
 * Get the time extremes of this series. This is handled outside of the
 * dataExtremes, as we always want to just sonify the visible points, and we
 * always want the extremes to be the extremes of the visible points.
 * @private
 * @param {Highcharts.Series} series
 * The series to compute on.
 * @param {Function|string} timeProp
 * The time axis data prop or the time function.
 * @return {Highcharts.RangeObject}
 * Object with min/max extremes for the time values.
 */
function getTimeExtremes(
    series: Highcharts.SonifyableSeries,
    timeProp: (string|Function)
): Highcharts.RangeObject {
    // Compute the extremes from the visible points.
    return series.points.reduce(function (
        acc: Highcharts.RangeObject,
        point: Highcharts.SonifyablePoint
    ): Highcharts.RangeObject {
        var value = getPointTimeValue(point, timeProp);

        acc.min = Math.min(acc.min, value);
        acc.max = Math.max(acc.max, value);
        return acc;
    }, {
        min: Infinity,
        max: -Infinity
    });
}


/**
 * Calculate value extremes for used instrument data properties on a chart.
 * @private
 * @param {Highcharts.Chart} chart
 * The chart to calculate extremes from.
 * @param {Array<Highcharts.PointInstrumentObject>} [instruments]
 * Additional instrument definitions to inspect for data props used, in
 * addition to the instruments defined in the chart options.
 * @param {Highcharts.Dictionary<Highcharts.RangeObject>} [dataExtremes]
 * Predefined extremes for each data prop.
 * @return {Highcharts.Dictionary<Highcharts.RangeObject>}
 * New extremes with data properties mapped to min/max objects.
 */
function getExtremesForInstrumentProps(
    chart: Chart,
    instruments?: Array<Highcharts.PointInstrumentObject>,
    dataExtremes?: Record<string, Highcharts.RangeObject>
): Record<string, Highcharts.RangeObject> {
    let allInstrumentDefinitions = (instruments || []).slice(0);
    const defaultInstrumentDef = chart.options.sonification?.defaultInstrumentOptions;
    const optionDefToInstrDef = (
        optionDef: Highcharts.SonificationInstrumentOptions|Highcharts.DefaultSonificationInstrumentOptions
    ): Highcharts.PointInstrumentObject => ({
        instrumentMapping: optionDef.mapping
    } as Highcharts.PointInstrumentObject);

    if (defaultInstrumentDef) {
        allInstrumentDefinitions.push(optionDefToInstrDef(defaultInstrumentDef));
    }

    chart.series.forEach((series): void => {
        const instrOptions = series.options.sonification?.instruments;
        if (instrOptions) {
            allInstrumentDefinitions = allInstrumentDefinitions.concat(instrOptions.map(optionDefToInstrDef));
        }
    });

    return (allInstrumentDefinitions).reduce(function (
        newExtremes: Record<string, Highcharts.RangeObject>,
        instrumentDefinition: Highcharts.PointInstrumentObject
    ): Record<string, Highcharts.RangeObject> {
        Object.keys(instrumentDefinition.instrumentMapping || {}).forEach(
            function (instrumentParameter: string): void {
                var value = instrumentDefinition.instrumentMapping[
                    instrumentParameter
                ];

                if (typeof value === 'string' && !newExtremes[value]) {
                    // This instrument parameter is mapped to a data prop.
                    // If we don't have predefined data extremes, find them.
                    newExtremes[value] = utilities.calculateDataExtremes(
                        chart, value
                    );
                }
            }
        );
        return newExtremes;
    }, merge(dataExtremes));
}


/**
 * Get earcons for the point if there are any.
 * @private
 * @param {Highcharts.Point} point
 * The point to find earcons for.
 * @param {Array<Highcharts.EarconConfiguration>} earconDefinitions
 * Earcons to check.
 * @return {Array<Highcharts.Earcon>}
 * Array of earcons to be played with this point.
 */
function getPointEarcons(
    point: Point,
    earconDefinitions: Array<Highcharts.EarconConfiguration>
): Array<Highcharts.Earcon> {
    return earconDefinitions.reduce(
        function (
            earcons: Array<Highcharts.Earcon>,
            earconDefinition: Highcharts.EarconConfiguration
        ): Array<Highcharts.Earcon> {
            var cond,
                earcon = earconDefinition.earcon;

            if (earconDefinition.condition) {
                // We have a condition. This overrides onPoint
                cond = earconDefinition.condition(point);
                if (cond instanceof H.sonification.Earcon) {
                    // Condition returned an earcon
                    earcons.push(cond);
                } else if (cond) {
                    // Condition returned true
                    earcons.push(earcon);
                }
            } else if (
                earconDefinition.onPoint &&
                point.id === earconDefinition.onPoint
            ) {
                // We have earcon onPoint
                earcons.push(earcon);
            }
            return earcons;
        }, []
    );
}


/**
 * Utility function to get a new list of instrument options where all the
 * instrument references are copies.
 * @private
 * @param {Array<Highcharts.PointInstrumentObject>} instruments
 * The instrument options.
 * @return {Array<Highcharts.PointInstrumentObject>}
 * Array of copied instrument options.
 */
function makeInstrumentCopies(
    instruments: Array<Highcharts.PointInstrumentObject>
): Array<Highcharts.PointInstrumentObject> {
    return instruments.map(function (
        instrumentDef: Highcharts.PointInstrumentObject
    ): Highcharts.PointInstrumentObject {
        var instrument = instrumentDef.instrument,
            copy = (typeof instrument === 'string' ?
                H.sonification.instruments[instrument] :
                instrument).copy();

        return merge(instrumentDef, { instrument: copy });
    });
}


/**
 * Utility function to apply a master volume to a list of instrument
 * options.
 * @private
 * @param {Array<Highcharts.PointInstrumentObject>} instruments
 * The instrument options. Only options with Instrument object instances
 * will be affected.
 * @param {number} masterVolume
 * The master volume multiplier to apply to the instruments.
 * @return {Array<Highcharts.PointInstrumentObject>}
 * Array of instrument options.
 */
function applyMasterVolumeToInstruments(
    instruments: Array<Highcharts.PointInstrumentObject>,
    masterVolume: number
): Array<Highcharts.PointInstrumentObject> {
    instruments.forEach((instrOpts): void => {
        const instr = instrOpts.instrument;
        if (typeof instr !== 'string') {
            instr.setMasterVolume(masterVolume);
        }
    });
    return instruments;
}


/**
 * Utility function to find the duration of the final note in a series.
 * @private
 * @param {Highcharts.Series} series The data series to calculate on.
 * @param {Array<Highcharts.PointInstrumentObject>} instruments The instrument options for this series.
 * @param {Highcharts.Dictionary<Highcharts.RangeObject>} dataExtremes Value extremes for the data series props.
 * @return {number} The duration of the final note in milliseconds.
 */
function getFinalNoteDuration(
    series: Highcharts.SonifyableSeries,
    instruments: Array<Highcharts.PointInstrumentObject>,
    dataExtremes: Record<string, Highcharts.RangeObject>
): number {
    const finalPoint = series.points[series.points.length - 1];
    return instruments.reduce((duration, instrument): number => {
        const mapping = instrument.instrumentMapping.duration;
        let instrumentDuration;

        if (typeof mapping === 'string') {
            instrumentDuration = 0; // Ignore, no easy way to map this
        } else if (typeof mapping === 'function') {
            instrumentDuration = mapping(finalPoint, dataExtremes);
        } else {
            instrumentDuration = mapping;
        }

        return Math.max(duration, instrumentDuration);
    }, 0);
}


/**
 * Create a TimelinePath from a series. Takes the same options as seriesSonify.
 * To intuitively allow multiple series to play simultaneously we make copies of
 * the instruments for each series.
 * @private
 * @param {Highcharts.Series} series
 * The series to build from.
 * @param {Highcharts.SonifySeriesOptionsObject} options
 * The options for building the TimelinePath.
 * @return {Highcharts.TimelinePath}
 * A timeline path with events.
 */
function buildTimelinePathFromSeries(
    series: Highcharts.SonifyableSeries,
    options: Highcharts.SonifySeriesOptionsObject
): Highcharts.TimelinePath {
    // options.timeExtremes is internal and used so that the calculations from
    // chart.sonify can be reused.
    var timeExtremes = options.timeExtremes || getTimeExtremes(series, options.pointPlayTime),
        // Compute any data extremes that aren't defined yet
        dataExtremes = getExtremesForInstrumentProps(
            series.chart, options.instruments, options.dataExtremes as any
        ),
        minimumSeriesDurationMs = 10,
        // Get the duration of the final note
        finalNoteDuration = getFinalNoteDuration(series, options.instruments, dataExtremes),
        // Get time offset for a point, relative to duration
        pointToTime = function (point: Highcharts.SonifyablePoint): number {
            return utilities.virtualAxisTranslate(
                getPointTimeValue(point, options.pointPlayTime),
                timeExtremes,
                { min: 0, max: Math.max(options.duration - finalNoteDuration, minimumSeriesDurationMs) }
            );
        },
        masterVolume = pick(options.masterVolume, 1),
        // Make copies of the instruments used for this series, to allow
        // multiple series with the same instrument to play together
        instrumentCopies = makeInstrumentCopies(options.instruments),
        instruments = applyMasterVolumeToInstruments(instrumentCopies, masterVolume),
        // Go through the points, convert to events, optionally add Earcons
        timelineEvents = series.points.reduce(function (
            events: Array<Highcharts.TimelineEvent>,
            point: Highcharts.SonifyablePoint
        ): Array<Highcharts.TimelineEvent> {
            var earcons = getPointEarcons(point, options.earcons || []),
                time = pointToTime(point);

            return events.concat(
                // Event object for point
                new H.sonification.TimelineEvent({
                    eventObject: point,
                    time: time,
                    id: point.id,
                    playOptions: {
                        instruments,
                        dataExtremes,
                        masterVolume
                    }
                }),
                // Earcons
                earcons.map(function (
                    earcon: Highcharts.Earcon
                ): Highcharts.TimelineEvent {
                    return new H.sonification.TimelineEvent({
                        eventObject: earcon,
                        time: time,
                        playOptions: {
                            volume: masterVolume
                        }
                    });
                })
            );
        }, []);

    // Build the timeline path
    return new H.sonification.TimelinePath({
        events: timelineEvents,
        onStart: function (): void {
            if (options.onStart) {
                options.onStart(series);
            }
        },
        onEventStart: function (
            event: Highcharts.TimelineEvent
        ): (boolean|undefined) {
            var eventObject = event.options && event.options.eventObject;

            if (eventObject instanceof Point) {
                // Check for hidden series
                if (
                    !eventObject.series.visible &&
                    !eventObject.series.chart.series.some(function (series): boolean {
                        return series.visible;
                    })
                ) {
                    // We have no visible series, stop the path.
                    (event.timelinePath as any).timeline.pause();
                    (event.timelinePath as any).timeline.resetCursor();
                    return false;
                }
                // Emit onPointStart
                if (options.onPointStart) {
                    options.onPointStart(event, eventObject);
                }
            }
        },
        onEventEnd: function (eventData: Highcharts.SignalDataObject): void {
            var eventObject = eventData.event && eventData.event.options &&
                    eventData.event.options.eventObject;

            if (eventObject instanceof Point && options.onPointEnd) {
                options.onPointEnd(eventData.event, eventObject);
            }
        },
        onEnd: function (): void {
            if (options.onEnd) {
                options.onEnd(series);
            }
        },
        targetDuration: options.duration
    });
}

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * Sonify a series.
 *
 * @sample highcharts/sonification/series-basic/
 *         Click on series to sonify
 * @sample highcharts/sonification/series-earcon/
 *         Series with earcon
 * @sample highcharts/sonification/point-play-time/
 *         Play y-axis by time
 * @sample highcharts/sonification/earcon-on-point/
 *         Earcon set on point
 *
 * @requires module:modules/sonification
 *
 * @function Highcharts.Series#sonify
 *
 * @param {Highcharts.SonifySeriesOptionsObject} [options]
 *        The options for sonifying this series. If not provided,
 *        uses options set on chart and series.
 *
 * @return {void}
 */
function seriesSonify(
    this: Highcharts.SonifyableSeries,
    options?: Highcharts.SonifySeriesOptionsObject
): void {
    const mergedOptions = getSeriesSonifyOptions(this, options);
    const timelinePath = buildTimelinePathFromSeries(this, mergedOptions);
    const chartSonification = this.chart.sonification;

    // Only one timeline can play at a time. If we want multiple series playing
    // at the same time, use chart.sonify.
    if (chartSonification.timeline) {
        chartSonification.timeline.pause();
    }

    // Store reference to duration
    chartSonification.duration = mergedOptions.duration;

    // Create new timeline for this series, and play it.
    chartSonification.timeline = new H.sonification.Timeline({
        paths: [timelinePath]
    });

    chartSonification.timeline.play();
}


/**
 * Utility function to assemble options for creating a TimelinePath from a
 * series when sonifying an entire chart.
 * @private
 * @param {Highcharts.Series} series
 * The series to return options for.
 * @param {Highcharts.RangeObject} dataExtremes
 * Pre-calculated data extremes for the chart.
 * @param {Highcharts.SonificationOptions} chartSonifyOptions
 * Options passed in to chart.sonify.
 * @return {Partial<Highcharts.SonifySeriesOptionsObject>}
 * Options for buildTimelinePathFromSeries.
 */
function buildChartSonifySeriesOptions(
    series: Highcharts.SonifyableSeries,
    dataExtremes: Record<string, Highcharts.RangeObject>,
    chartSonifyOptions: Highcharts.SonifyChartOptionsObject
): Partial<Highcharts.SonifySeriesOptionsObject> {
    const additionalSeriesOptions: (
        Partial<Highcharts.SonifySeriesOptionsObject>|
        Array<Partial<Highcharts.SonifySeriesOptionsObject>>
    ) = chartSonifyOptions.seriesOptions || {};
    const pointPlayTime = series.chart.options.sonification?.
        defaultInstrumentOptions?.mapping?.pointPlayTime || 'x';
    const configOptions = chartOptionsToSonifySeriesOptions(series);

    return merge(
        // Options from chart configuration
        configOptions,
        // Options passed in
        {
            // Calculated dataExtremes for chart
            dataExtremes: dataExtremes,
            // We need to get timeExtremes for each series. We pass this
            // in when building the TimelinePath objects to avoid
            // calculating twice.
            timeExtremes: getTimeExtremes(series, pointPlayTime),
            // Some options we just pass on
            instruments: chartSonifyOptions.instruments || configOptions.instruments,
            onStart: chartSonifyOptions.onSeriesStart || configOptions.onStart,
            onEnd: chartSonifyOptions.onSeriesEnd || configOptions.onEnd,
            earcons: chartSonifyOptions.earcons || configOptions.earcons,
            masterVolume: pick(chartSonifyOptions.masterVolume, configOptions.masterVolume)
        },
        // Merge in the specific series options by ID if any are passed in
        isArray(additionalSeriesOptions) ? (
            find(additionalSeriesOptions, function (optEntry: any): boolean {
                return optEntry.id === pick(series.id, series.options.id);
            }) || {}
        ) : additionalSeriesOptions,
        {
            // Forced options
            pointPlayTime: pointPlayTime
        }
    );
}


/**
 * Utility function to normalize the ordering of timeline paths when sonifying
 * a chart.
 * @private
 * @param {string|Array<string|Highcharts.Earcon|Array<string|Highcharts.Earcon>>} orderOptions -
 * Order options for the sonification.
 * @param {Highcharts.Chart} chart - The chart we are sonifying.
 * @param {Function} seriesOptionsCallback
 * A function that takes a series as argument, and returns the series options
 * for that series to be used with buildTimelinePathFromSeries.
 * @return {Array<object|Array<object|Highcharts.TimelinePath>>} If order is
 * sequential, we return an array of objects to create series paths from. If
 * order is simultaneous we return an array of an array with the same. If there
 * is a custom order, we return an array of arrays of either objects (for
 * series) or TimelinePaths (for earcons and delays).
 */
function buildPathOrder(
    orderOptions: (
        string|Array<(string|Highcharts.Earcon|
        Array<(string|Highcharts.Earcon)>)>
    ),
    chart: Highcharts.SonifyableChart,
    seriesOptionsCallback: Function
): Array<(Highcharts.SonifySeriesOrderObject|Array<(
        Highcharts.SonifySeriesOrderObject|Highcharts.TimelinePath
    )>)> {
    var order: Array<(Highcharts.SonifySeriesOrderObject|Array<(
        Highcharts.SonifySeriesOrderObject|Highcharts.TimelinePath
    )>)>;

    if (orderOptions === 'sequential' || orderOptions === 'simultaneous') {
        // Just add the series from the chart
        order = chart.series.reduce(function (
            seriesList: Array<Highcharts.SonifySeriesOrderObject>,
            series: Highcharts.SonifyableSeries
        ): Array<Highcharts.SonifySeriesOrderObject> {
            if (series.visible && series.options.sonification?.enabled !== false) {
                seriesList.push({
                    series: series,
                    seriesOptions: seriesOptionsCallback(series)
                });
            }
            return seriesList;
        }, []);

        // If order is simultaneous, group all series together
        if (orderOptions === 'simultaneous') {
            order = [order] as any;
        }
    } else {
        // We have a specific order, and potentially custom items - like
        // earcons or silent waits.
        order = (orderOptions as any).reduce(function (
            orderList: Array<Array<(
                Highcharts.SonifySeriesOrderObject|Highcharts.TimelinePath
            )>>,
            orderDef: (
                string|Highcharts.Earcon|Array<string|Highcharts.Earcon>
            )
        ): Array<Array<(
                Highcharts.SonifySeriesOrderObject|Highcharts.TimelinePath
            )>> {
            // Return set of items to play simultaneously. Could be only one.
            var simulItems: Array<(
                Highcharts.SonifySeriesOrderObject|Highcharts.TimelinePath
            )> = splat(orderDef).reduce(function (
                items: Array<(
                    Highcharts.SonifySeriesOrderObject|Highcharts.TimelinePath
                )>,
                item: (string|Highcharts.Earcon)
            ): Array<(
                    Highcharts.SonifySeriesOrderObject|Highcharts.TimelinePath
                )> {
                var itemObject: (
                    Highcharts.SonifySeriesOrderObject|Highcharts.TimelinePath|
                    undefined
                );

                // Is this item a series ID?
                if (typeof item === 'string') {
                    var series: Highcharts.SonifyableSeries = (
                        chart.get(item) as any
                    );

                    if (series.visible) {
                        itemObject = {
                            series: series,
                            seriesOptions: seriesOptionsCallback(series)
                        };
                    }

                // Is it an earcon? If so, just create the path.
                } else if (item instanceof H.sonification.Earcon) {
                    // Path with a single event
                    itemObject = new H.sonification.TimelinePath({
                        events: [new H.sonification.TimelineEvent({
                            eventObject: item
                        })]
                    });

                }

                // Is this item a silent wait? If so, just create the path.
                if ((item as any).silentWait) {
                    itemObject = new H.sonification.TimelinePath({
                        silentWait: (item as any).silentWait
                    } as any);
                }

                // Add to items to play simultaneously
                if (itemObject) {
                    items.push(itemObject);
                }
                return items;
            }, []);

            // Add to order list
            if (simulItems.length) {
                orderList.push(simulItems);
            }
            return orderList;
        }, []);
    }
    return order;
}


/**
 * Utility function to add a silent wait after all series.
 * @private
 * @param {Array<object|Array<object|TimelinePath>>} order
 * The order of items.
 * @param {number} wait
 * The wait in milliseconds to add.
 * @return {Array<object|Array<object|TimelinePath>>}
 * The order with waits inserted.
 */
function addAfterSeriesWaits(
    order: Array<(Highcharts.SonifySeriesOrderObject|Array<(
        Highcharts.SonifySeriesOrderObject|Highcharts.TimelinePath
    )>)>,
    wait: number
): Array<(Highcharts.SonifySeriesOrderObject|Array<(
        Highcharts.SonifySeriesOrderObject|Highcharts.TimelinePath
    )>)> {
    if (!wait) {
        return order;
    }

    return order.reduce(function (
        newOrder: Array<(Highcharts.SonifySeriesOrderObject|Array<(
            Highcharts.SonifySeriesOrderObject|Highcharts.TimelinePath
        )>)>,
        orderDef: (Highcharts.SonifySeriesOrderObject|Array<(
            Highcharts.SonifySeriesOrderObject|Highcharts.TimelinePath
        )>),
        i: number
    ): Array<(Highcharts.SonifySeriesOrderObject|Array<(
            Highcharts.SonifySeriesOrderObject|Highcharts.TimelinePath
        )>)> {
        var simultaneousPaths: Array<(
            Highcharts.SonifySeriesOrderObject|
            Highcharts.TimelinePath
        )> = splat(orderDef);

        newOrder.push(simultaneousPaths);

        // Go through the simultaneous paths and see if there is a series there
        if (
            i < order.length - 1 && // Do not add wait after last series
            simultaneousPaths.some(function (
                item: (
                    Highcharts.SonifySeriesOrderObject|Highcharts.TimelinePath
                )
            ): (Highcharts.SonifyableSeries|undefined) {
                return (item as any).series;
            })
        ) {
            // We have a series, meaning we should add a wait after these
            // paths have finished.
            newOrder.push(new H.sonification.TimelinePath({
                silentWait: wait
            } as any) as any);
        }

        return newOrder;
    }, []);
}


/**
 * Utility function to find the total amout of wait time in the TimelinePaths.
 * @private
 * @param {Array<object|Array<object|TimelinePath>>} order - The order of
 * TimelinePaths/items.
 * @return {number} The total time in ms spent on wait paths between playing.
 */
function getWaitTime(
    order: Array<(Highcharts.SonifySeriesOrderObject|Array<(
        Highcharts.SonifySeriesOrderObject|Highcharts.TimelinePath
    )>)>
): number {
    return order.reduce(function (
        waitTime: number,
        orderDef: (Highcharts.SonifySeriesOrderObject|Array<(
            Highcharts.SonifySeriesOrderObject|Highcharts.TimelinePath
        )>)
    ): number {
        var def: Array<(
            Highcharts.SonifySeriesOrderObject|Highcharts.TimelinePath
        )> = splat(orderDef);

        return waitTime + (
            def.length === 1 &&
            (def[0] as any).options &&
            (def[0] as any).options.silentWait || 0
        );
    }, 0);
}


/**
 * Utility function to ensure simultaneous paths have start/end events at the
 * same time, to sync them.
 * @private
 * @param {Array<Highcharts.TimelinePath>} paths - The paths to sync.
 */
function syncSimultaneousPaths(paths: Array<Highcharts.TimelinePath>): void {
    // Find the extremes for these paths
    var extremes = paths.reduce(function (
        extremes: Highcharts.RangeObject,
        path: Highcharts.TimelinePath
    ): Highcharts.RangeObject {
        var events = path.events;

        if (events && events.length) {
            extremes.min = Math.min(events[0].time, extremes.min);
            extremes.max = Math.max(
                events[events.length - 1].time, extremes.max
            );
        }
        return extremes;
    }, {
        min: Infinity,
        max: -Infinity
    });

    // Go through the paths and add events to make them fit the same timespan
    paths.forEach(function (path: Highcharts.TimelinePath): void {
        var events = path.events,
            hasEvents = events && events.length,
            eventsToAdd = [];

        if (!(hasEvents && events[0].time <= extremes.min)) {
            eventsToAdd.push(new H.sonification.TimelineEvent({
                time: extremes.min
            }));
        }
        if (!(hasEvents && events[events.length - 1].time >= extremes.max)) {
            eventsToAdd.push(new H.sonification.TimelineEvent({
                time: extremes.max
            }));
        }
        if (eventsToAdd.length) {
            path.addTimelineEvents(eventsToAdd);
        }
    });
}


/**
 * Utility function to find the total duration span for all simul path sets
 * that include series.
 * @private
 * @param {Array<object|Array<object|Highcharts.TimelinePath>>} order - The
 * order of TimelinePaths/items.
 * @return {number} The total time value span difference for all series.
 */
function getSimulPathDurationTotal(
    order: Array<(Highcharts.SonifySeriesOrderObject|Array<(
        Highcharts.SonifySeriesOrderObject|Highcharts.TimelinePath
    )>)>
): number {
    return order.reduce(function (
        durationTotal: number,
        orderDef: (Highcharts.SonifySeriesOrderObject|Array<(
            Highcharts.SonifySeriesOrderObject|Highcharts.TimelinePath
        )>)
    ): number {
        return durationTotal + splat(orderDef).reduce(
            function (
                maxPathDuration: number,
                item: (
                    Highcharts.SonifySeriesOrderObject|Highcharts.TimelinePath
                )
            ): number {
                var timeExtremes: Highcharts.RangeObject = (
                    (item as any).series &&
                    (item as any).seriesOptions &&
                    (item as any).seriesOptions.timeExtremes
                );

                return timeExtremes ?
                    Math.max(
                        maxPathDuration, timeExtremes.max - timeExtremes.min
                    ) : maxPathDuration;
            },
            0
        );
    }, 0);
}


/**
 * Function to calculate the duration in ms for a series.
 * @private
 * @param {number} seriesValueDuration - The duration of the series in value
 * difference.
 * @param {number} totalValueDuration - The total duration of all (non
 * simultaneous) series in value difference.
 * @param {number} totalDurationMs - The desired total duration for all series
 * in milliseconds.
 * @return {number} The duration for the series in milliseconds.
 */
function getSeriesDurationMs(
    seriesValueDuration: number,
    totalValueDuration: number,
    totalDurationMs: number
): number {
    // A series spanning the whole chart would get the full duration.
    return utilities.virtualAxisTranslate(
        seriesValueDuration,
        { min: 0, max: totalValueDuration },
        { min: 0, max: totalDurationMs }
    );
}


/**
 * Convert series building objects into paths and return a new list of
 * TimelinePaths.
 * @private
 * @param {Array<object|Array<object|Highcharts.TimelinePath>>} order - The
 * order list.
 * @param {number} duration - Total duration to aim for in milliseconds.
 * @return {Array<Array<Highcharts.TimelinePath>>} Array of TimelinePath objects
 * to play.
 */
function buildPathsFromOrder(
    order: Array<(Highcharts.SonifySeriesOrderObject|Array<(
        Highcharts.SonifySeriesOrderObject|Highcharts.TimelinePath
    )>)>,
    duration: number
): Array<Array<Highcharts.TimelinePath>> {
    // Find time used for waits (custom or after series), and subtract it from
    // available duration.
    var totalAvailableDurationMs = Math.max(
            duration - getWaitTime(order), 0
        ),
        // Add up simultaneous path durations to find total value span duration
        // of everything
        totalUsedDuration = getSimulPathDurationTotal(order);

    // Go through the order list and convert the items
    return order.reduce(function (
        allPaths: Array<Array<Highcharts.TimelinePath>>,
        orderDef: (Highcharts.SonifySeriesOrderObject|Array<(
            Highcharts.SonifySeriesOrderObject|Highcharts.TimelinePath
        )>)
    ): Array<Array<Highcharts.TimelinePath>> {
        var simultaneousPaths: Array<Highcharts.TimelinePath> =
            splat(orderDef).reduce(function (
                simulPaths: Array<Highcharts.TimelinePath>,
                item: (
                    Highcharts.SonifySeriesOrderObject|Highcharts.TimelinePath
                )
            ): Array<Highcharts.TimelinePath> {
                if (item instanceof H.sonification.TimelinePath) {
                    // This item is already a path object
                    simulPaths.push(item);
                } else if (item.series) {
                    // We have a series.
                    // We need to set the duration of the series
                    item.seriesOptions.duration =
                        item.seriesOptions.duration || getSeriesDurationMs(
                            (item.seriesOptions.timeExtremes as any).max -
                            (item.seriesOptions.timeExtremes as any).min,
                            totalUsedDuration,
                            totalAvailableDurationMs
                        );

                    // Add the path
                    simulPaths.push(buildTimelinePathFromSeries(
                        item.series,
                        item.seriesOptions
                    ));
                }
                return simulPaths;
            }, []);

        // Add in the simultaneous paths
        allPaths.push(simultaneousPaths);
        return allPaths;
    }, []);
}


/**
 * @private
 * @param {Highcharts.Series} series The series to get options for.
 * @param {Highcharts.SonifySeriesOptionsObject} options
 *  Options to merge with user options on series/chart and default options.
 * @returns {Array<Highcharts.PointInstrumentObject>} The merged options.
 */
function getSeriesInstrumentOptions(
    series: Highcharts.SonifyableSeries,
    options?: Highcharts.SonifySeriesOptionsObject
): (Array<Highcharts.PointInstrumentObject>|undefined) {
    if (options?.instruments) {
        return options.instruments;
    }

    const defaultInstrOpts: Record<string, any> =
        series.chart.options.sonification?.defaultInstrumentOptions || {};
    const seriesInstrOpts: Array<Record<string, any>> =
        series.options.sonification?.instruments || [{}];
    const removeNullsFromObject = (obj: Record<string, any>): void => {
        objectEach(obj, (val: any, key: string): void => {
            if (val === null) {
                delete obj[key];
            }
        });
    };

    // Convert series options to PointInstrumentObjects and merge with
    // default options
    return (seriesInstrOpts).map((optionSet): Highcharts.PointInstrumentObject => {
        // Allow setting option to null to use default
        removeNullsFromObject(optionSet.mapping || {});
        removeNullsFromObject(optionSet);

        return {
            instrument: optionSet.instrument || defaultInstrOpts.instrument,
            instrumentOptions: merge(defaultInstrOpts, optionSet, {
                // Instrument options are lifted to root in the API options
                // object, so merge all in order to avoid missing any. But
                // remove the following which are not instrumentOptions:
                mapping: void 0,
                instrument: void 0
            }) as Partial<Highcharts.PointInstrumentOptionsObject>,
            instrumentMapping: merge(defaultInstrOpts.mapping, optionSet.mapping)
        };
    });
}


/**
 * Utility function to translate between options set in chart configuration and
 * a SonifySeriesOptionsObject.
 * @private
 * @param {Highcharts.Series} series The series to get options for.
 * @returns {Highcharts.SonifySeriesOptionsObject} Options for chart/series.sonify()
 */
function chartOptionsToSonifySeriesOptions(
    series: Highcharts.SonifyableSeries
): Partial<Highcharts.SonifySeriesOptionsObject> {
    const seriesOpts = series.options.sonification || {} as Highcharts.SeriesSonificationOptions;
    const chartOpts = series.chart.options.sonification || {} as Highcharts.ChartSonificationOptions;
    const chartEvents = chartOpts.events || {} as Highcharts.ChartSonificationEventsOptions;
    const seriesEvents = seriesOpts.events || {} as Highcharts.SeriesSonificationEventsOptions;

    return { // Chart options
        onEnd: seriesEvents.onSeriesEnd || chartEvents.onSeriesEnd,
        onStart: seriesEvents.onSeriesStart || chartEvents.onSeriesStart,
        onPointEnd: seriesEvents.onPointEnd || chartEvents.onPointEnd,
        onPointStart: seriesEvents.onPointStart || chartEvents.onPointStart,
        pointPlayTime: chartOpts.defaultInstrumentOptions?.mapping?.pointPlayTime,
        masterVolume: chartOpts.masterVolume,
        instruments: getSeriesInstrumentOptions(series), // Deals with chart-level defaults
        earcons: seriesOpts.earcons || chartOpts.earcons
    };
}


/**
 * @private
 * @param {Highcharts.Series} series The series to get options for.
 * @param {Highcharts.SonifySeriesOptionsObject} options
 *  Options to merge with user options on series/chart and default options.
 * @returns {Highcharts.SonifySeriesOptionsObject} The merged options.
 */
function getSeriesSonifyOptions(
    series: Highcharts.SonifyableSeries,
    options?: Highcharts.SonifySeriesOptionsObject
): Highcharts.SonifySeriesOptionsObject {
    const chartOpts = series.chart.options.sonification;
    const seriesOpts = series.options.sonification;
    return merge(
        {
            duration: seriesOpts?.duration || chartOpts?.duration
        },
        chartOptionsToSonifySeriesOptions(series),
        options
    );
}


/**
 * @private
 * @param {Highcharts.Chart} chart The chart to get options for.
 * @param {Highcharts.SonificationOptions} options
 *  Options to merge with user options on chart and default options.
 * @returns {Highcharts.SonificationOptions} The merged options.
 */
function getChartSonifyOptions(
    chart: Highcharts.SonifyableChart,
    options?: Highcharts.SonifyChartOptionsObject
): Highcharts.SonifyChartOptionsObject {
    const chartOpts: Record<string, any> = chart.options.sonification || {};

    return merge(
        {
            duration: chartOpts.duration,
            afterSeriesWait: chartOpts.afterSeriesWait,
            pointPlayTime: chartOpts.defaultInstrumentOptions?.mapping?.pointPlayTime,
            order: chartOpts.order,
            onSeriesStart: chartOpts.events?.onSeriesStart,
            onSeriesEnd: chartOpts.events?.onSeriesEnd,
            onEnd: chartOpts.events?.onEnd
        },
        options
    );
}


/**
 * Options for sonifying a chart.
 *
 * @requires module:modules/sonification
 *
 * @interface Highcharts.SonificationOptions
 *//**
 * Duration for sonifying the entire chart. The duration is distributed across
 * the different series intelligently, but does not take earcons into account.
 * It is also possible to set the duration explicitly per series, using
 * `seriesOptions`. Note that points may continue to play after the duration has
 * passed, but no new points will start playing.
 * @name Highcharts.SonificationOptions#duration
 * @type {number}
 *//**
 * Define the order to play the series in. This can be given as a string, or an
 * array specifying a custom ordering. If given as a string, valid values are
 * `sequential` - where each series is played in order - or `simultaneous`,
 * where all series are played at once. For custom ordering, supply an array as
 * the order. Each element in the array can be either a string with a series ID,
 * an Earcon object, or an object with a numeric `silentWait` property
 * designating a number of milliseconds to wait before continuing. Each element
 * of the array will be played in order. To play elements simultaneously, group
 * the elements in an array.
 * @name Highcharts.SonificationOptions#order
 * @type {string|Array<string|Highcharts.Earcon|Array<string|Highcharts.Earcon>>}
 *//**
 * The axis to use for when to play the points. Can be a string with a data
 * property (e.g. `x`), or a function. If it is a function, this function
 * receives the point as argument, and should return a numeric value. The points
 * with the lowest numeric values are then played first, and the time between
 * points will be proportional to the distance between the numeric values. This
 * option can not be overridden per series.
 * @name Highcharts.SonificationOptions#pointPlayTime
 * @type {string|Function}
 *//**
 * Milliseconds of silent waiting to add between series. Note that waiting time
 * is considered part of the sonify duration.
 * @name Highcharts.SonificationOptions#afterSeriesWait
 * @type {number|undefined}
 *//**
 * Options as given to `series.sonify` to override options per series. If the
 * option is supplied as an array of options objects, the `id` property of the
 * object should correspond to the series' id. If the option is supplied as a
 * single object, the options apply to all series.
 * @name Highcharts.SonificationOptions#seriesOptions
 * @type {Object|Array<object>|undefined}
 *//**
 * The instrument definitions for the points in this chart.
 * @name Highcharts.SonificationOptions#instruments
 * @type {Array<Highcharts.PointInstrumentObject>|undefined}
 *//**
 * Earcons to add to the chart. Note that earcons can also be added per series
 * using `seriesOptions`.
 * @name Highcharts.SonificationOptions#earcons
 * @type {Array<Highcharts.EarconConfiguration>|undefined}
 *//**
 * Optionally provide the minimum/maximum data values for the points. If this is
 * not supplied, it is calculated from all points in the chart on demand. This
 * option is supplied in the following format, as a map of point data properties
 * to objects with min/max values:
 *  ```js
 *      dataExtremes: {
 *          y: {
 *              min: 0,
 *              max: 100
 *          },
 *          z: {
 *              min: -10,
 *              max: 10
 *          }
 *          // Properties used and not provided are calculated on demand
 *      }
 *  ```
 * @name Highcharts.SonificationOptions#dataExtremes
 * @type {Highcharts.Dictionary<Highcharts.RangeObject>|undefined}
 *//**
 * Callback before a series is played.
 * @name Highcharts.SonificationOptions#onSeriesStart
 * @type {Function|undefined}
 *//**
 * Callback after a series has finished playing.
 * @name Highcharts.SonificationOptions#onSeriesEnd
 * @type {Function|undefined}
 *//**
 * Callback after the chart has played.
 * @name Highcharts.SonificationOptions#onEnd
 * @type {Function|undefined}
 */


/**
 * Sonify a chart.
 *
 * @sample highcharts/sonification/chart-sequential/
 *         Sonify a basic chart
 * @sample highcharts/sonification/chart-simultaneous/
 *         Sonify series simultaneously
 * @sample highcharts/sonification/chart-custom-order/
 *         Custom defined order of series
 * @sample highcharts/sonification/chart-earcon/
 *         Earcons on chart
 * @sample highcharts/sonification/chart-events/
 *         Sonification events on chart
 *
 * @requires module:modules/sonification
 *
 * @function Highcharts.Chart#sonify
 *
 * @param {Highcharts.SonificationOptions} [options]
 *        The options for sonifying this chart. If not provided,
 *        uses options set on chart and series.
 *
 * @return {void}
 */
function chartSonify(
    this: Highcharts.SonifyableChart,
    options?: Highcharts.SonifyChartOptionsObject
): void {
    const opts = getChartSonifyOptions(this, options);

    // Only one timeline can play at a time.
    if (this.sonification.timeline) {
        this.sonification.timeline.pause();
    }

    // Store reference to duration
    this.sonification.duration = opts.duration;

    // Calculate data extremes for the props used
    const dataExtremes = getExtremesForInstrumentProps(
        this, opts.instruments, opts.dataExtremes
    );

    // Figure out ordering of series and custom paths
    let order = buildPathOrder(opts.order, this, function (
        series: Highcharts.SonifyableSeries
    ): Partial<Highcharts.SonifySeriesOptionsObject> {
        return buildChartSonifySeriesOptions(series, dataExtremes, opts);
    });

    // Add waits after simultaneous paths with series in them.
    order = addAfterSeriesWaits(order, opts.afterSeriesWait || 0);

    // We now have a list of either TimelinePath objects or series that need to
    // be converted to TimelinePath objects. Convert everything to paths.
    const paths = buildPathsFromOrder(order, opts.duration);

    // Sync simultaneous paths
    paths.forEach(function (
        simultaneousPaths: Array<Highcharts.TimelinePath>
    ): void {
        syncSimultaneousPaths(simultaneousPaths);
    });

    // We have a set of paths. Create the timeline, and play it.
    this.sonification.timeline = new H.sonification.Timeline({
        paths: paths,
        onEnd: opts.onEnd
    });
    this.sonification.timeline.play();
}


/**
 * Get a list of the points currently under cursor.
 *
 * @requires module:modules/sonification
 *
 * @function Highcharts.Chart#getCurrentSonifyPoints
 *
 * @return {Array<Highcharts.Point>}
 *         The points currently under the cursor.
 */
function getCurrentPoints(
    this: Highcharts.SonifyableChart
): Array<Point> {
    var cursorObj: Record<string, Highcharts.TimelineEvent>;

    if (this.sonification.timeline) {
        cursorObj = this.sonification.timeline.getCursor(); // Cursor per pathID
        return Object.keys(cursorObj).map(function (
            path: string
        ): any {
            // Get the event objects under cursor for each path
            return cursorObj[path].eventObject;
        }).filter(function (eventObj: any): boolean {
            // Return the events that are points
            return eventObj instanceof Point;
        });
    }
    return [];
}


/**
 * Set the cursor to a point or set of points in different series.
 *
 * @requires module:modules/sonification
 *
 * @function Highcharts.Chart#setSonifyCursor
 *
 * @param {Highcharts.Point|Array<Highcharts.Point>} points
 *        The point or points to set the cursor to. If setting multiple points
 *        under the cursor, the points have to be in different series that are
 *        being played simultaneously.
 */
function setCursor(
    this: Highcharts.SonifyableChart,
    points: (Point|Array<Point>)
): void {
    var timeline: Highcharts.Timeline = this.sonification.timeline as any;

    if (timeline) {
        splat(points).forEach(function (point: Point): void {
            // We created the events with the ID of the points, which makes
            // this easy. Just call setCursor for each ID.
            timeline.setCursor(point.id);
        });
    }
}


/**
 * Pause the running sonification.
 *
 * @requires module:modules/sonification
 *
 * @function Highcharts.Chart#pauseSonify
 *
 * @param {boolean} [fadeOut=true]
 *        Fade out as we pause to avoid clicks.
 *
 * @return {void}
 */
function pause(this: Highcharts.SonifyableChart, fadeOut?: boolean): void {
    if (this.sonification.timeline) {
        this.sonification.timeline.pause(pick(fadeOut, true));
    } else if (this.sonification.currentlyPlayingPoint) {
        this.sonification.currentlyPlayingPoint.cancelSonify(fadeOut);
    }
}


/**
 * Resume the currently running sonification. Requires series.sonify or
 * chart.sonify to have been played at some point earlier.
 *
 * @requires module:modules/sonification
 *
 * @function Highcharts.Chart#resumeSonify
 *
 * @param {Function} onEnd
 *        Callback to call when play finished.
 *
 * @return {void}
 */
function resume(this: Highcharts.SonifyableChart, onEnd: Function): void {
    if (this.sonification.timeline) {
        this.sonification.timeline.play(onEnd);
    }
}


/**
 * Play backwards from cursor. Requires series.sonify or chart.sonify to have
 * been played at some point earlier.
 *
 * @requires module:modules/sonification
 *
 * @function Highcharts.Chart#rewindSonify
 *
 * @param {Function} onEnd
 *        Callback to call when play finished.
 *
 * @return {void}
 */
function rewind(this: Highcharts.SonifyableChart, onEnd: Function): void {
    if (this.sonification.timeline) {
        this.sonification.timeline.rewind(onEnd);
    }
}


/**
 * Cancel current sonification and reset cursor.
 *
 * @requires module:modules/sonification
 *
 * @function Highcharts.Chart#cancelSonify
 *
 * @param {boolean} [fadeOut=true]
 *        Fade out as we pause to avoid clicks.
 *
 * @return {void}
 */
function cancel(this: Highcharts.SonifyableChart, fadeOut?: boolean): void {
    this.pauseSonify(fadeOut);
    this.resetSonifyCursor();
}


/**
 * Reset cursor to start. Requires series.sonify or chart.sonify to have been
 * played at some point earlier.
 *
 * @requires module:modules/sonification
 *
 * @function Highcharts.Chart#resetSonifyCursor
 *
 * @return {void}
 */
function resetCursor(this: Highcharts.SonifyableChart): void {
    if (this.sonification.timeline) {
        this.sonification.timeline.resetCursor();
    }
}


/**
 * Reset cursor to end. Requires series.sonify or chart.sonify to have been
 * played at some point earlier.
 *
 * @requires module:modules/sonification
 *
 * @function Highcharts.Chart#resetSonifyCursorEnd
 *
 * @return {void}
 */
function resetCursorEnd(this: Highcharts.SonifyableChart): void {
    if (this.sonification.timeline) {
        this.sonification.timeline.resetCursorEnd();
    }
}


// Export functions
var chartSonifyFunctions: Highcharts.SonifyChartFunctionsObject = {
    chartSonify,
    seriesSonify,
    pause,
    resume,
    rewind,
    cancel,
    getCurrentPoints,
    setCursor,
    resetCursor,
    resetCursorEnd
};

export default chartSonifyFunctions;
