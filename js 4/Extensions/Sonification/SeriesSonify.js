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
import Earcon from './Earcon.js';
import Instrument from './Instrument.js';
import Point from '../../Core/Series/Point.js';
import SU from './SonificationUtilities.js';
var getExtremesForInstrumentProps = SU.getExtremesForInstrumentProps, virtualAxisTranslate = SU.virtualAxisTranslate;
import Timeline from './Timeline.js';
import TimelineEvent from './TimelineEvent.js';
import TimelinePath from './TimelinePath.js';
import U from '../../Core/Utilities.js';
var extend = U.extend, find = U.find, isArray = U.isArray, merge = U.merge, objectEach = U.objectEach, pick = U.pick;
/* *
 *
 *  Compositions
 *
 * */
var SeriesSonify;
(function (SeriesSonify) {
    /* *
     *
     *  Declarations
     *
     * */
    /* *
     *
     *  Constants
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
            var seriesProto = SeriesClass.prototype;
            extend(seriesProto, {
                sonify: sonify
            });
        }
        return SeriesClass;
    }
    SeriesSonify.compose = compose;
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
    function applyMasterVolumeToInstruments(instruments, masterVolume) {
        instruments.forEach(function (instrOpts) {
            var instr = instrOpts.instrument;
            if (typeof instr !== 'string') {
                instr.setMasterVolume(masterVolume);
            }
        });
        return instruments;
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
    function buildChartSonifySeriesOptions(series, dataExtremes, chartSonifyOptions) {
        var additionalSeriesOptions = chartSonifyOptions.seriesOptions || {}, sonification = series.chart.options.sonification, pointPlayTime = (sonification &&
            sonification.defaultInstrumentOptions &&
            sonification.defaultInstrumentOptions.mapping &&
            sonification.defaultInstrumentOptions.mapping.pointPlayTime ||
            'x'), configOptions = chartOptionsToSonifySeriesOptions(series);
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
            instruments: (chartSonifyOptions.instruments || configOptions.instruments),
            onStart: (chartSonifyOptions.onSeriesStart || configOptions.onStart),
            onEnd: chartSonifyOptions.onSeriesEnd || configOptions.onEnd,
            earcons: chartSonifyOptions.earcons || configOptions.earcons,
            masterVolume: pick(chartSonifyOptions.masterVolume, configOptions.masterVolume)
        }, 
        // Merge in the specific series options by ID if any are passed in
        isArray(additionalSeriesOptions) ? (find(additionalSeriesOptions, function (optEntry) {
            return optEntry.id === pick(series.id, series.options.id);
        }) || {}) : additionalSeriesOptions, {
            // Forced options
            pointPlayTime: pointPlayTime
        });
    }
    SeriesSonify.buildChartSonifySeriesOptions = buildChartSonifySeriesOptions;
    /**
     * Create a TimelinePath from a series. Takes the same options as
     * seriesSonify. To intuitively allow multiple series to play simultaneously
     * we make copies of the instruments for each series.
     * @private
     * @param {Highcharts.Series} series
     * The series to build from.
     * @param {Highcharts.SonifySeriesOptionsObject} options
     * The options for building the TimelinePath.
     * @return {Highcharts.TimelinePath}
     * A timeline path with events.
     */
    function buildTimelinePathFromSeries(series, options) {
        // options.timeExtremes is internal and used so that the calculations
        // from chart.sonify can be reused.
        var timeExtremes = options.timeExtremes || getTimeExtremes(series, options.pointPlayTime), 
        // Compute any data extremes that aren't defined yet
        dataExtremes = getExtremesForInstrumentProps(series.chart, options.instruments, options.dataExtremes), minimumSeriesDurationMs = 10, 
        // Get the duration of the final note
        finalNoteDuration = getFinalNoteDuration(series, options.instruments, dataExtremes), 
        // Get time offset for a point, relative to duration
        pointToTime = function (point) {
            return virtualAxisTranslate(getPointTimeValue(point, options.pointPlayTime), timeExtremes, {
                min: 0,
                max: Math.max(options.duration - finalNoteDuration, minimumSeriesDurationMs)
            });
        }, masterVolume = pick(options.masterVolume, 1), 
        // Make copies of the instruments used for this series, to allow
        // multiple series with the same instrument to play together
        instrumentCopies = makeInstrumentCopies(options.instruments), instruments = applyMasterVolumeToInstruments(instrumentCopies, masterVolume), 
        // Go through the points, convert to events, optionally add Earcons
        timelineEvents = series.points.reduce(function (events, point) {
            var earcons = getPointEarcons(point, options.earcons || []), time = pointToTime(point);
            return events.concat(
            // Event object for point
            new TimelineEvent({
                eventObject: point,
                time: time,
                id: point.id,
                playOptions: {
                    instruments: instruments,
                    dataExtremes: dataExtremes,
                    masterVolume: masterVolume
                }
            }), 
            // Earcons
            earcons.map(function (earcon) {
                return new TimelineEvent({
                    eventObject: earcon,
                    time: time,
                    playOptions: {
                        volume: masterVolume
                    }
                });
            }));
        }, []);
        // Build the timeline path
        return new TimelinePath({
            events: timelineEvents,
            onStart: function () {
                if (options.onStart) {
                    options.onStart(series);
                }
            },
            onEventStart: function (event) {
                var eventObject = event.options && event.options.eventObject;
                if (eventObject instanceof Point) {
                    // Check for hidden series
                    if (!eventObject.series.visible &&
                        !eventObject.series.chart.series.some(function (series) {
                            return series.visible;
                        })) {
                        // We have no visible series, stop the path.
                        event.timelinePath.timeline.pause();
                        event.timelinePath.timeline.resetCursor();
                        return false;
                    }
                    // Emit onPointStart
                    if (options.onPointStart) {
                        options.onPointStart(event, eventObject);
                    }
                }
            },
            onEventEnd: function (eventData) {
                var eventObject = (eventData.event &&
                    eventData.event.options &&
                    eventData.event.options.eventObject);
                if (eventObject instanceof Point && options.onPointEnd) {
                    options.onPointEnd(eventData.event, eventObject);
                }
            },
            onEnd: function () {
                if (options.onEnd) {
                    options.onEnd(series);
                }
            },
            targetDuration: options.duration
        });
    }
    SeriesSonify.buildTimelinePathFromSeries = buildTimelinePathFromSeries;
    /**
     * Utility function to translate between options set in chart configuration
     * and a SonifySeriesOptionsObject.
     * @private
     * @param {Highcharts.Series} series
     * The series to get options for.
     * @return {Highcharts.SonifySeriesOptionsObject}
     * Options for chart/series.sonify()
     */
    function chartOptionsToSonifySeriesOptions(series) {
        var seriesOpts = series.options.sonification ||
            {}, chartOpts = series.chart.options.sonification ||
            {}, chartEvents = chartOpts.events ||
            {}, seriesEvents = seriesOpts.events ||
            {};
        return {
            onEnd: seriesEvents.onSeriesEnd || chartEvents.onSeriesEnd,
            onStart: seriesEvents.onSeriesStart || chartEvents.onSeriesStart,
            onPointEnd: seriesEvents.onPointEnd || chartEvents.onPointEnd,
            onPointStart: seriesEvents.onPointStart || chartEvents.onPointStart,
            pointPlayTime: (chartOpts.defaultInstrumentOptions &&
                chartOpts.defaultInstrumentOptions.mapping &&
                chartOpts.defaultInstrumentOptions.mapping.pointPlayTime),
            masterVolume: chartOpts.masterVolume,
            // Deals with chart-level defaults
            instruments: getSeriesInstrumentOptions(series),
            earcons: seriesOpts.earcons || chartOpts.earcons
        };
    }
    /**
     * Utility function to find the duration of the final note in a series.
     * @private
     * @param {Highcharts.Series} series The data series to calculate on.
     * @param {Array<Highcharts.PointInstrumentObject>} instruments The instrument options for this series.
     * @param {Highcharts.Dictionary<Highcharts.RangeObject>} dataExtremes Value extremes for the data series props.
     * @return {number} The duration of the final note in milliseconds.
     */
    function getFinalNoteDuration(series, instruments, dataExtremes) {
        var finalPoint = series.points[series.points.length - 1];
        return instruments.reduce(function (duration, instrument) {
            var mapping = instrument.instrumentMapping.duration;
            var instrumentDuration;
            if (typeof mapping === 'string') {
                instrumentDuration = 0; // Ignore, no easy way to map this
            }
            else if (typeof mapping === 'function') {
                instrumentDuration = mapping(finalPoint, dataExtremes);
            }
            else {
                instrumentDuration = mapping;
            }
            return Math.max(duration, instrumentDuration);
        }, 0);
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
    function getPointEarcons(point, earconDefinitions) {
        return earconDefinitions.reduce(function (earcons, earconDefinition) {
            var earcon = earconDefinition.earcon;
            var cond;
            if (earconDefinition.condition) {
                // We have a condition. This overrides onPoint
                cond = earconDefinition.condition(point);
                if (cond instanceof Earcon) {
                    // Condition returned an earcon
                    earcons.push(cond);
                }
                else if (cond) {
                    // Condition returned true
                    earcons.push(earcon);
                }
            }
            else if (earconDefinition.onPoint &&
                point.id === earconDefinition.onPoint) {
                // We have earcon onPoint
                earcons.push(earcon);
            }
            return earcons;
        }, []);
    }
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
    function getPointTimeValue(point, timeProp) {
        return typeof timeProp === 'function' ?
            timeProp(point) :
            pick(point[timeProp], point.options[timeProp]);
    }
    /**
     * @private
     * @param {Highcharts.Series} series
     * The series to get options for.
     * @param {Highcharts.SonifySeriesOptionsObject} options
     * Options to merge with user options on series/chart and default options.
     * @return {Array<Highcharts.PointInstrumentObject>}
     * The merged options.
     */
    function getSeriesInstrumentOptions(series, options) {
        if (options && options.instruments) {
            return options.instruments;
        }
        var defaultInstrOpts = (series.chart.options.sonification &&
            series.chart.options.sonification.defaultInstrumentOptions ||
            {}), seriesInstrOpts = (series.options.sonification &&
            series.options.sonification.instruments ||
            [{}]), removeNullsFromObject = function (obj) {
            objectEach(obj, function (val, key) {
                if (val === null) {
                    delete obj[key];
                }
            });
        };
        // Convert series options to PointInstrumentObjects and merge with
        // default options
        return (seriesInstrOpts).map(function (optionSet) {
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
                }),
                instrumentMapping: merge(defaultInstrOpts.mapping, optionSet.mapping)
            };
        });
    }
    /**
     * @private
     * @param {Highcharts.Series} series
     * The series to get options for.
     * @param {Highcharts.SonifySeriesOptionsObject} options
     * Options to merge with user options on series/chart and default options.
     * @return {Highcharts.SonifySeriesOptionsObject}
     * The merged options.
     */
    function getSeriesSonifyOptions(series, options) {
        var chartOpts = series.chart.options.sonification, seriesOpts = series.options.sonification;
        return merge({
            duration: ((seriesOpts && seriesOpts.duration) ||
                (chartOpts && chartOpts.duration))
        }, chartOptionsToSonifySeriesOptions(series), options);
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
    function getTimeExtremes(series, timeProp) {
        // Compute the extremes from the visible points.
        return series.points.reduce(function (acc, point) {
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
     * Utility function to get a new list of instrument options where all the
     * instrument references are copies.
     * @private
     * @param {Array<Highcharts.PointInstrumentObject>} instruments
     * The instrument options.
     * @return {Array<Highcharts.PointInstrumentObject>}
     * Array of copied instrument options.
     */
    function makeInstrumentCopies(instruments) {
        return instruments.map(function (instrumentDef) {
            var instrument = instrumentDef.instrument, copy = (typeof instrument === 'string' ?
                Instrument.definitions[instrument] :
                instrument).copy();
            return merge(instrumentDef, { instrument: copy });
        });
    }
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
     * The options for sonifying this series. If not provided, uses options set
     * on chart and series.
     */
    function sonify(options) {
        var mergedOptions = getSeriesSonifyOptions(this, options), timelinePath = buildTimelinePathFromSeries(this, mergedOptions), chartSonification = this.chart.sonification;
        if (chartSonification) {
            // Only one timeline can play at a time. If we want multiple series
            // playing at the same time, use chart.sonify.
            if (chartSonification.timeline) {
                chartSonification.timeline.pause();
            }
            // Store reference to duration
            chartSonification.duration = mergedOptions.duration;
            // Create new timeline for this series, and play it.
            chartSonification.timeline = new Timeline({
                paths: [timelinePath]
            });
            chartSonification.timeline.play();
        }
    }
})(SeriesSonify || (SeriesSonify = {}));
/* *
 *
 *  Default Export
 *
 * */
export default SeriesSonify;
