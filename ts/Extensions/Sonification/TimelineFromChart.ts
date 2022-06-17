/* *
 *
 *  (c) 2009-2022 Øystein Moseng
 *
 *  Build a timeline from a chart.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Chart from '../../Core/Chart/Chart';
import type Series from '../../Core/Series/Series';
import type Point from '../../Core/Series/Point';
import type TimelineChannel from './TimelineChannel';
import SonificationTimeline from './SonificationTimeline.js';
import SonificationInstrument from './SonificationInstrument.js';
import SonificationSpeaker from './SonificationSpeaker.js';
import U from '../../Core/Utilities.js';
const {
    clamp,
    extend,
    getNestedProperty,
    merge,
    pick
} = U;
import FU from '../../Core/FormatUtilities.js';
const {
    format
} = FU;


interface PropExtremes {
    max: number;
    min: number;
}
type PropExtremesCache = Record<string, PropExtremes>;
interface ExtremesCache {
    globalExtremes: PropExtremesCache;
    seriesExtremes: Array<PropExtremesCache>;
}
const isNoteDefinition = (str: string): boolean =>
    (/^([a-g][#b]?)[0-8]$/ui).test(str);


/**
 * Get chart wide min/max for a set of props, as well as per
 * series min/max for time props.
 * @private
 */
function getChartExtremesForProps(
    chart: Chart,
    props: string[],
    timeProps: string[]
): ExtremesCache {
    const series = chart.series,
        numProps = props.length,
        numTimeProps = timeProps.length,
        initCache = (propList: string[]): PropExtremesCache =>
            propList.reduce((cache, prop): PropExtremesCache => {
                ((cache[prop] = { min: Infinity, max: -Infinity }), cache);
                return cache;
            }, {} as PropExtremesCache),
        updateCache = (
            cache: PropExtremesCache, point: Point, prop: string
        ): void => {
            let val: unknown = (point as any)[prop];
            if (val === void 0) {
                val = getNestedProperty(prop, point);
            }
            if (typeof val === 'number') {
                cache[prop].min = Math.min(cache[prop].min, val);
                cache[prop].max = Math.max(cache[prop].max, val);
            }
        },
        globalExtremes = initCache(props);

    let i = series.length;
    const seriesExtremes: PropExtremesCache[] = new Array(i);
    while (i--) {
        const timeExtremes = initCache(timeProps);
        const opts = series[i].options;
        if (
            !series[i].visible ||
            opts && opts.sonification && opts.sonification.enabled === false
        ) {
            continue;
        }
        const points = series[i].points;
        let j = points.length;
        while (j--) {
            let k = numProps;
            while (k--) {
                updateCache(globalExtremes, points[j], props[k]);
            }
            k = numTimeProps;
            while (k--) {
                updateCache(timeExtremes, points[j], props[k]);
            }
        }
        seriesExtremes[i] = timeExtremes;
    }

    return {
        globalExtremes,
        seriesExtremes
    };
}


/**
 * Build a cache of prop extremes for the chart. Goes through
 * options to find out which props are needed.
 * @private
 */
function buildExtremesCache(chart: Chart): ExtremesCache {
    type MappingOpts = Sonification.InstrumentTrackMappingOptions|
    Sonification.SpeechTrackMappingOptions;

    const globalOpts = chart.options.sonification ||
            {} as Sonification.ChartSonificationOptions,
        defaultInstrMapping = (globalOpts.defaultInstrumentOptions || {})
            .mapping || { time: 'x', pitch: 'y' },
        defaultSpeechMapping = globalOpts.defaultSpeechOptions &&
            globalOpts.defaultSpeechOptions.mapping || {},
        props: Record<string, boolean> = {},
        timeprops: Record<string, boolean> = {},
        addPropFromMappingParam = (param: string, val: unknown): void => {
            const propObject = param === 'time' ? timeprops : props;
            if (typeof val === 'string' && param !== 'text') {
                if (param === 'pitch' && isNoteDefinition(val)) {
                    return;
                }
                propObject[val] = true;
                return;
            }
            if (
                (val as Sonification.MappingParameterOptions).mapTo &&
                typeof (val as Sonification.MappingParameterOptions)
                    .mapTo === 'string'
            ) {
                propObject[(
                    val as Sonification.MappingParameterOptions
                ).mapTo] = true;
                return;
            }
            if (
                ['tremolo', 'lowpass', 'highpass'].indexOf(param) > -1 &&
                typeof val === 'object'
            ) {
                Object.keys(val as object).forEach((subParam): void =>
                    addPropFromMappingParam(
                        subParam, (val as AnyRecord)[subParam]
                    ));
            }
        },
        addPropsFromMappingOptions = (mapping: MappingOpts): void => {
            (Object.keys(mapping)).forEach((param): void =>
                addPropFromMappingParam(param, (mapping as AnyRecord)[param]));
        };

    addPropsFromMappingOptions(defaultInstrMapping);
    addPropsFromMappingOptions(defaultSpeechMapping);
    chart.series.forEach((series): void => {
        const sOpts = series.options.sonification;
        if (
            series.visible &&
            sOpts &&
            sOpts.enabled !== false
        ) {
            (sOpts.tracks || []).concat(sOpts.contextTracks || []).forEach(
                (trackOpts): void => {
                    if (trackOpts.mapping) {
                        addPropsFromMappingOptions(trackOpts.mapping);
                    }
                }
            );
        }
    });

    return getChartExtremesForProps(
        chart, Object.keys(props), Object.keys(timeprops)
    );
}


/**
 * Map a relative value onto a virtual axis.
 * @private
 */
function mapToVirtualAxis(
    value: number,
    valueExtremes: PropExtremes,
    virtualAxisExtremes: PropExtremes,
    invert: boolean,
    logarithmic: boolean // Virtual axis is logarithmic
): number {
    const lenValueAxis = valueExtremes.max - valueExtremes.min;
    if (lenValueAxis <= 0) {
        return virtualAxisExtremes.min;
    }
    const lenVirtualAxis = virtualAxisExtremes.max - virtualAxisExtremes.min,
        valueDelta = invert ?
            valueExtremes.max - value :
            value - valueExtremes.min;

    let virtualValueDelta = lenVirtualAxis * valueDelta / lenValueAxis;
    if (logarithmic) {
        const log = (x: number): number => (
            x === 0 ? 0 :
                x < 0 ? -(Math.log(-x) * Math.LOG10E) :
                    Math.log(x) * Math.LOG10E
        );
        virtualValueDelta = lenVirtualAxis *
            log(virtualValueDelta + 1) / log(lenVirtualAxis + 1);
    }

    return clamp(virtualAxisExtremes.min + virtualValueDelta,
        virtualAxisExtremes.min, virtualAxisExtremes.max);
}


/**
 * Get the value of a mapped parameter for a point.
 * @private
 */
function getMappingParameterValue(
    point: Point,
    extremesCache: PropExtremesCache,
    defaultMapping: Required<Sonification.MappingParameterOptions>,
    mappingOptions?: Sonification.MappingParameter,
    time?: number
): number|null {
    if (typeof mappingOptions === 'number') {
        return mappingOptions;
    }
    if (typeof mappingOptions === 'function') {
        return mappingOptions({ point, time: time || 0 });
    }

    let mapTo = mappingOptions as string,
        mapFunc = defaultMapping.mapFunction,
        min = defaultMapping.min,
        max = defaultMapping.max;
    if (typeof mappingOptions === 'object') {
        mapTo = mappingOptions.mapTo;
        mapFunc = mappingOptions.mapFunction || mapFunc;
        min = pick(mappingOptions.min, min);
        max = pick(mappingOptions.max, max);
    }

    if (!mapTo) {
        return null;
    }

    const isInverted = mapTo.charAt(0) === '-';
    if (isInverted) {
        mapTo = mapTo.slice(1);
    }

    let extremes = extremesCache[mapTo];
    if (!extremes) {
        extremes = extremesCache[mapTo] = getChartExtremesForProps(
            point.series.chart, [mapTo], []
        ).globalExtremes[mapTo];
    }

    let pointValue: unknown = (point as any)[mapTo];
    if (pointValue === void 0) {
        pointValue = getNestedProperty(mapTo, point);
    }

    if (typeof pointValue !== 'number') {
        return null;
    }

    return mapToVirtualAxis(
        pointValue, extremes, { min, max },
        isInverted, mapFunc === 'logarithmic'
    );
}


/**
 * Get mapping parameter value with defined fallback and defaults.
 * @private
 */
function getParamValWithDefault(
    point: Point,
    extremesCache: PropExtremesCache,
    mappingParamOptions: Sonification.MappingParameter,
    fallback: number,
    defaults?: Partial<Sonification.MappingParameterOptions>
): number {
    return pick(getMappingParameterValue(
        point,
        extremesCache,
        extend({
            min: 0, max: 1, mapTo: 'y', mapFunction: 'linear'
        }, (defaults || {}) as any),
        mappingParamOptions
    ), fallback);
}


/**
 * Get time value for a point event.
 * @private
 */
function getPointTime(
    point: Point,
    startTime: number,
    duration: number,
    timeMappingOptions: Sonification.MappingParameter,
    extremesCache: PropExtremesCache
): number {
    const time = getParamValWithDefault(
        point, extremesCache, timeMappingOptions, 0,
        { min: 0, max: duration, mapTo: 'x' }
    );
    return time + startTime;
}


/**
 * Get duration for a series
 * @private
 */
function getAvailableDurationForSeries(
    series: Series,
    totalDuration: number,
    extremesCache: ExtremesCache,
    afterSeriesWait: number
): number {
    let timeProp: any,
        totalTimeLen = 0,
        seriesDuration;
    const availableDuration = totalDuration -
            (series.chart.series.length - 1) * afterSeriesWait,
        hasGlobalTimeProp = extremesCache.seriesExtremes.every(
            (extremes): boolean => {
                const props = Object.keys(extremes);
                if (props.length === 1) {
                    if (!timeProp) {
                        timeProp = props[0];
                    }
                    totalTimeLen += extremes[timeProp].max -
                            extremes[timeProp].min;
                    return timeProp === props[0];
                }
                return false;
            });

    if (hasGlobalTimeProp) {
        // Chart-wide single time prop, use time prop extremes
        const seriesExtremes = extremesCache
                .seriesExtremes[series.index][timeProp],
            seriesTimeLen = seriesExtremes.max - seriesExtremes.min;
        seriesDuration = Math.round(
            seriesTimeLen / totalTimeLen * availableDuration
        );
    } else {
        const totalPoints = series.chart.series.reduce(
            (sum, s): number => sum + s.points.length, 0);
        seriesDuration = Math.round(
            series.points.length / totalPoints * availableDuration
        );
    }

    return Math.max(50, seriesDuration);
}


/**
 * Build and add a track to the timeline.
 * @private
 */
function addTimelineChannelFromTrack(
    timeline: SonificationTimeline,
    audioContext: AudioContext,
    destinationNode: AudioDestinationNode,
    options: (
        Sonification.InstrumentTrackOptions|
        Sonification.SpeechTrackOptions
    )
): TimelineChannel {
    const speechOpts = (options as Sonification.SpeechTrackOptions),
        instrMappingOpts = (
            options.mapping || {}
        ) as Sonification.InstrumentTrackMappingOptions,
        engine = options.type === 'speech' ?
            new SonificationSpeaker({
                language: speechOpts.language,
                name: speechOpts.preferredVoice
            }) :
            new SonificationInstrument(
                audioContext, destinationNode, {
                    capabilities: {
                        pan: !!instrMappingOpts.pan,
                        tremolo: !!instrMappingOpts.tremolo,
                        filters: !!(
                            instrMappingOpts.highpass ||
                            instrMappingOpts.lowpass
                        )
                    },
                    synthPatch: options.instrument
                });

    return timeline.addChannel(options.type || 'instrument', engine);
}


/**
 * Add event from a point to a mapped instrument track.
 * @private
 */
function addMappedInstrumentEvent(
    point: Point,
    channel: TimelineChannel,
    mappingOptions: Sonification.InstrumentTrackMappingOptions,
    time: number,
    extremesCache: PropExtremesCache,
    roundToMusicalNotes: boolean
): Sonification.TimelineEvent[] {
    const getParam = (
        param: string,
        fallback: number,
        defaults: Partial<Sonification.MappingParameterOptions>,
        parent?: AnyRecord
    ): number => getParamValWithDefault(
        point, extremesCache, (parent || mappingOptions as AnyRecord)[param],
        fallback, defaults
    );

    const eventsAdded: Sonification.TimelineEvent[] = [],
        eventOpts: SonificationInstrument.ScheduledEventOptions = {
            noteDuration: getParam('noteDuration', 200, { min: 40, max: 1000 }),
            pan: getParam('pan', 0, { min: -1, max: 1 }),
            volume: getParam('volume', 1, { min: 0.1, max: 1 })
        };
    if (mappingOptions.frequency) {
        eventOpts.frequency = getParam('frequency', 440,
            { min: 50, max: 6000 });
    }
    if (mappingOptions.lowpass) {
        eventOpts.lowpassFreq = getParam(
            'frequency', 20000, { min: 0, max: 20000 }, mappingOptions.lowpass);
        eventOpts.lowpassResonance = getParam(
            'resonance', 0, { min: -6, max: 12 }, mappingOptions.lowpass);
    }
    if (mappingOptions.highpass) {
        eventOpts.highpassFreq = getParam('frequency', 20000,
            { min: 0, max: 20000 }, mappingOptions.highpass);
        eventOpts.highpassResonance = getParam('resonance', 0,
            { min: -6, max: 12 }, mappingOptions.highpass);
    }
    if (mappingOptions.tremolo) {
        eventOpts.tremoloDepth = getParam('depth', 0,
            { min: 0, max: 0.8 }, mappingOptions.tremolo);
        eventOpts.tremoloSpeed = getParam('speed', 0,
            { min: 0, max: 0.8 }, mappingOptions.tremolo);
    }

    const gapBetweenNotes = getParam('gapBetweenNotes', 150,
            { min: 50, max: 1000 }),
        playDelay = getParam('playDelay', 0, { max: 200 });

    const addNoteEvent = (
        noteDef: string|number|Sonification.PitchMappingParameterOptions,
        ix = 0
    ): void => {
        let opts = noteDef as Sonification.MappingParameter;
        if ((noteDef as Sonification.PitchMappingParameterOptions).mapTo) {
            // Transform the pitch mapping options to normal mapping options
            if (typeof (noteDef as AnyRecord).min === 'string') {
                (opts as AnyRecord).min = SonificationInstrument
                    .noteStringToC0Distance((noteDef as AnyRecord).min);
            }
            if (typeof (noteDef as AnyRecord).max === 'string') {
                (opts as AnyRecord).max = SonificationInstrument
                    .noteStringToC0Distance((noteDef as AnyRecord).max);
            }
        } else if (typeof noteDef === 'string' && isNoteDefinition(noteDef)) {
            opts = SonificationInstrument.noteStringToC0Distance(noteDef);
        }

        eventOpts.note = getParamValWithDefault(
            point, extremesCache, opts, 0, { min: 0, max: 107 }
        );

        if (roundToMusicalNotes) {
            eventOpts.note = Math.round(eventOpts.note);
        }

        eventsAdded.push(
            channel.addEvent({
                time: time + playDelay + gapBetweenNotes * ix,
                relatedPoint: point,
                instrumentEventOptions: ix !== void 0 ?
                    extend({}, eventOpts) : eventOpts
            })
        );
    };

    if (
        mappingOptions.pitch &&
        (mappingOptions.pitch as number[]).constructor === Array
    ) {
        (mappingOptions.pitch as Array<string|number>).forEach(addNoteEvent);
    } else if (mappingOptions.pitch) {
        addNoteEvent(mappingOptions.pitch as string|number|
        Sonification.PitchMappingParameterOptions);
    }

    return eventsAdded;
}


/**
 * Get the message value to speak for a point.
 * @private
 */
function getSpeechMessageValue(
    context: Sonification.CallbackContext,
    messageParam: string|Sonification.TrackStringCallback
): string {
    return format(
        typeof messageParam === 'function' ?
            messageParam(context) :
            messageParam,
        context,
        context.point && context.point.series.chart
    );
}


/**
 * Add an event from a point to a mapped speech track.
 * @private
 */
function addMappedSpeechEvent(
    point: Point,
    channel: TimelineChannel,
    mappingOptions: Sonification.SpeechTrackMappingOptions,
    time: number,
    extremesCache: PropExtremesCache
): Sonification.TimelineEvent|undefined {
    const getParam = (
        param: string,
        fallback: number,
        defaults: Partial<Sonification.MappingParameterOptions>
    ): number => getParamValWithDefault(
        point, extremesCache, (mappingOptions as AnyRecord)[param],
        fallback, defaults
    );

    const playDelay = getParam('playDelay', 0, { max: 200 }),
        pitch = getParam('pitch', 1, { min: 0.3, max: 2 }),
        rate = getParam('rate', 1, { min: 0.4, max: 4 }),
        volume = getParam('volume', 1, { min: 0.1 }),
        message = getSpeechMessageValue({
            point, time
        }, mappingOptions.text);

    if (message) {
        return channel.addEvent({
            time: time + playDelay,
            relatedPoint: point,
            speechOptions: {
                pitch,
                rate,
                volume
            },
            message
        });
    }
}


/**
 * Build a new timeline object from a chart.
 * @private
 */
function timelineFromChart(
    audioContext: AudioContext,
    destinationNode: AudioDestinationNode,
    chart: Chart
): SonificationTimeline {
    const options = chart.options.sonification ||
            {} as Sonification.ChartSonificationOptions,
        defaultInstrOpts = options.defaultInstrumentOptions,
        defaultSpeechOpts = options.defaultSpeechOptions,
        globalTracks = options.globalTracks || [],
        globalContextTracks = options.globalContextTracks || [],
        isSequential = options.order === 'sequential',
        // Slight margin for note end
        totalDuration = Math.max(50, options.duration - 300),
        afterSeriesWait = options.afterSeriesWait,
        eventOptions = options.events || {},
        extremesCache = buildExtremesCache(chart),
        timeline = new SonificationTimeline({
            onPlay: options.events && options.events.onPlay,
            onEnd: options.events && options.events.onEnd,
            showCrosshairOnly: options.showCrosshairOnly,
            showPlayMarker: options.showPlayMarker
        }, chart);

    let startTime = 0;
    chart.series.forEach((series, seriesIx): void => {
        const sOptions = series.options.sonification ||
            {} as Sonification.SeriesSonificationOptions;
        if (series.visible && sOptions.enabled !== false) {
            const seriesDuration = isSequential ? getAvailableDurationForSeries(
                    series, totalDuration, extremesCache, afterSeriesWait
                ) : totalDuration,
                mainTracks = (sOptions.tracks || [defaultInstrOpts])
                    .concat(globalTracks),
                contextTracks = seriesIx ? sOptions.contextTracks || [] :
                    (sOptions.contextTracks || []).concat(globalContextTracks),
                mainChannels: Record<string, TimelineChannel> = {};

            // First and last events across channels related to this series
            let firstEvent: Sonification.TimelineEvent = { time: Infinity },
                lastEvent: Sonification.TimelineEvent = { time: -Infinity };

            series.points.forEach((point): void => {
                // Add the mapped tracks
                mainTracks.forEach((trackOpts, trackIx): void => {
                    const mergedOpts = trackOpts.type === 'speech' ?
                        merge(defaultSpeechOpts, trackOpts) :
                        merge(defaultInstrOpts, trackOpts);

                    let channel = mainChannels[trackIx];
                    if (!channel) {
                        channel = mainChannels[trackIx] =
                            addTimelineChannelFromTrack(
                                timeline, audioContext,
                                destinationNode, mergedOpts
                            );
                    }

                    const time = getPointTime(
                        point, startTime, seriesDuration,
                        mergedOpts.mapping && mergedOpts.mapping.time || 0,
                        extremesCache.seriesExtremes[seriesIx]
                    );

                    // Is this track active?
                    if (
                        !mergedOpts.mapping ||
                        mergedOpts.activeWhen &&
                        !mergedOpts.activeWhen({ point, time })
                    ) {
                        return;
                    }

                    // Add the event to be sonified
                    let eventsAdded: Sonification.TimelineEvent[] = [];
                    if (mergedOpts.type === 'speech') {
                        const eventAdded = addMappedSpeechEvent(
                            point, channel, mergedOpts.mapping,
                            time, extremesCache.globalExtremes);
                        if (eventAdded) {
                            eventsAdded = [eventAdded];
                        }
                    } else {
                        eventsAdded = addMappedInstrumentEvent(
                            point, channel, mergedOpts.mapping, time,
                            extremesCache.globalExtremes,
                            pick(mergedOpts.roundToMusicalNotes, true));
                    }

                    // Update the first/last event for later event handling
                    firstEvent = eventsAdded.reduce(
                        (first, e): Sonification.TimelineEvent => (
                            e.time < first.time ? e : first
                        ), firstEvent);
                    lastEvent = eventsAdded.reduce(
                        (last, e): Sonification.TimelineEvent => (
                            e.time > last.time ? e : last
                        ), lastEvent);
                });
            });

            // Add callbacks to first/last events
            firstEvent.callback = eventOptions.onSeriesStart ?
                eventOptions.onSeriesStart.bind(null, series, timeline) :
                void 0;
            lastEvent.callback = eventOptions.onSeriesEnd ?
                eventOptions.onSeriesEnd.bind(null, series, timeline) :
                void 0;

            if (isSequential) {
                startTime += seriesDuration + afterSeriesWait;
            }
        }
    });

    return timeline;
}


/* *
 *
 *  Default Export
 *
 * */

export default timelineFromChart;
