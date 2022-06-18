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
 * Get the value of a point property from string.
 * @private
 */
function getPointPropValue(point: Point, prop?: string): number|undefined {
    let ret;
    if (prop) {
        ret = (point as AnyRecord)[prop];
        if (typeof ret === 'number') {
            return ret;
        }
        ret = getNestedProperty(prop, point);
    }
    return typeof ret === 'number' ? ret : void 0;
}


/**
 * Get chart wide min/max for a set of props, as well as per
 * series min/max for selected props.
 * @private
 */
function getChartExtremesForProps(
    chart: Chart,
    props: string[],
    perSeriesProps: string[]
): ExtremesCache {
    const series = chart.series,
        numProps = props.length,
        numSeriesProps = perSeriesProps.length,
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
    const allSeriesExtremes: PropExtremesCache[] = new Array(i);
    while (i--) {
        const seriesExtremes = initCache(perSeriesProps);
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
            k = numSeriesProps;
            while (k--) {
                updateCache(seriesExtremes, points[j], props[k]);
            }
        }
        allSeriesExtremes[i] = seriesExtremes;
    }

    return {
        globalExtremes,
        seriesExtremes: allSeriesExtremes
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
        perSeriesProps: Record<string, boolean> = {},
        addPropFromMappingParam = (param: string, val: unknown): void => {
            const propObject = param === 'time' ? perSeriesProps : props;
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
        },
        addPropsFromContextTracks = (
            tracks: Sonification.ContextTrackOptions
        ): void => tracks.forEach((track): void => {
            props[track.valueProp || 'x'] =
                perSeriesProps[track.valueProp || 'x'] = true;
        });

    addPropsFromMappingOptions(defaultInstrMapping);
    addPropsFromMappingOptions(defaultSpeechMapping);
    addPropsFromContextTracks(globalOpts.globalContextTracks || []);
    chart.series.forEach((series): void => {
        const sOpts = series.options.sonification;
        if (
            series.visible &&
            sOpts &&
            sOpts.enabled !== false
        ) {
            addPropsFromContextTracks(sOpts.contextTracks || []);
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
        chart, Object.keys(props), Object.keys(perSeriesProps)
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
    invert?: boolean,
    logarithmic?: boolean // Virtual axis is logarithmic
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
    context: Sonification.EventContext,
    extremesCache: PropExtremesCache,
    defaultMapping: Required<Sonification.MappingParameterOptions>,
    mappingOptions?: Sonification.MappingParameter,
    contextValueProp?: string
): number|null {
    if (typeof mappingOptions === 'number') {
        return mappingOptions;
    }
    if (typeof mappingOptions === 'function') {
        return mappingOptions(extend({ time: 0 }, context));
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

    let value: unknown = context.value;
    const useContextValue = mapTo === 'value' && value !== void 0 &&
        contextValueProp;
    if (!useContextValue) {
        const fixedValue = (
            mappingOptions as Sonification.MappingParameterOptions
        ).value;
        if (fixedValue !== void 0) {
            value = fixedValue;
        } else {
            if (!context.point) {
                return null;
            }
            value = (context.point as any)[mapTo];
        }
        if (value === void 0) {
            value = getNestedProperty(mapTo, context.point);
        }
    }

    if (typeof value !== 'number' || value === null) {
        return null;
    }

    const extremes = extremesCache[
        useContextValue ? contextValueProp : mapTo
    ];
    return mapToVirtualAxis(
        value as number, extremes, { min, max },
        isInverted, mapFunc === 'logarithmic'
    );
}


/**
 * Get mapping parameter value with defined fallback and defaults.
 * @private
 */
function getParamValWithDefault(
    context: Sonification.EventContext,
    extremesCache: PropExtremesCache,
    mappingParamOptions: Sonification.MappingParameter,
    fallback: number,
    defaults?: Partial<Sonification.MappingParameterOptions>,
    contextValueProp?: string
): number {
    return pick(getMappingParameterValue(
        context,
        extremesCache,
        extend({
            min: 0, max: 1, mapTo: 'y', mapFunction: 'linear'
        } as Required<Sonification.MappingParameterOptions>,
        (defaults || {}) as Required<Sonification.MappingParameterOptions>),
        mappingParamOptions,
        contextValueProp
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
        { point, time: 0 }, extremesCache, timeMappingOptions, 0,
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
    context: Sonification.EventContext,
    channel: TimelineChannel,
    mappingOptions: Sonification.InstrumentTrackMappingOptions,
    extremesCache: PropExtremesCache,
    roundToMusicalNotes: boolean,
    contextValueProp?: string
): Sonification.TimelineEvent[] {
    const getParam = (
        param: string,
        fallback: number,
        defaults: Partial<Sonification.MappingParameterOptions>,
        parent?: AnyRecord
    ): number => getParamValWithDefault(
        context, extremesCache, (parent || mappingOptions as AnyRecord)[param],
        fallback, defaults, contextValueProp
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
            context, extremesCache, opts, 0, { min: 0, max: 107 },
            contextValueProp
        );

        if (roundToMusicalNotes) {
            eventOpts.note = Math.round(eventOpts.note);
        }

        eventsAdded.push(
            channel.addEvent({
                time: context.time + playDelay + gapBetweenNotes * ix,
                relatedPoint: context.point,
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
    context: Sonification.EventContext,
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
    context: Sonification.EventContext,
    channel: TimelineChannel,
    mappingOptions: Sonification.SpeechTrackMappingOptions,
    extremesCache: PropExtremesCache,
    contextValueProp?: string
): Sonification.TimelineEvent|undefined {
    const getParam = (
        param: string,
        fallback: number,
        defaults: Partial<Sonification.MappingParameterOptions>
    ): number => getParamValWithDefault(
        context, extremesCache, (mappingOptions as AnyRecord)[param],
        fallback, defaults, contextValueProp
    );

    const playDelay = getParam('playDelay', 0, { max: 200 }),
        pitch = getParam('pitch', 1, { min: 0.3, max: 2 }),
        rate = getParam('rate', 1, { min: 0.4, max: 4 }),
        volume = getParam('volume', 1, { min: 0.1 }),
        message = getSpeechMessageValue(context, mappingOptions.text);

    if (message) {
        return channel.addEvent({
            time: context.time + playDelay,
            relatedPoint: context.point,
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
 * Should a track be active for this event?
 * @private
 */
function isActive(
    context: Sonification.EventContext,
    activeWhen?: Sonification.TrackPredicateCallback|
    Sonification.ValueConstraints,
    lastPropValue?: number
): boolean {
    if (typeof activeWhen === 'function') {
        return activeWhen(context);
    }
    if (typeof activeWhen === 'object') {
        const prop = activeWhen.prop,
            val = pick(
                context.value,
                context.point && getPointPropValue(context.point, prop)
            );
        if (typeof val !== 'number') {
            return false;
        }

        let crossingOk = true;
        const crossingUp = activeWhen.crossingUp,
            crossingDown = activeWhen.crossingDown,
            hasLastValue = typeof lastPropValue === 'number';
        if (crossingUp && crossingDown) {
            crossingOk = hasLastValue && (
                lastPropValue < crossingUp && val >= crossingUp ||
                lastPropValue > crossingDown && val <= crossingDown
            );
        } else {
            crossingOk = (
                crossingUp === void 0 ||
                hasLastValue && lastPropValue < crossingUp &&
                    val >= crossingUp
            ) && (
                crossingDown === void 0 ||
                hasLastValue && lastPropValue > crossingDown &&
                    val <= crossingDown
            );
        }

        const max = pick(activeWhen.max, Infinity),
            min = pick(activeWhen.min, -Infinity);

        return val <= max && val >= min && crossingOk;
    }
    return true;
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
                lastEvent: Sonification.TimelineEvent = { time: -Infinity },
                // For crossing threshold notifications
                lastPropValue: number|undefined;

            series.points.forEach((point): void => {
                // Add the mapped tracks
                mainTracks.forEach((trackOpts, trackIx): void => {
                    const mergedOpts = trackOpts.type === 'speech' ?
                            merge(defaultSpeechOpts, trackOpts) :
                            merge(defaultInstrOpts, trackOpts),
                        activeWhen = mergedOpts.activeWhen,
                        updateLastPropValue = (): void => {
                            if (
                                typeof activeWhen === 'object' &&
                                activeWhen.prop
                            ) {
                                lastPropValue = getPointPropValue(
                                    point, activeWhen.prop);
                            }
                        };

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
                        !isActive({ point, time }, activeWhen, lastPropValue)
                    ) {
                        updateLastPropValue();
                        return;
                    }

                    // Add the event to be sonified
                    let eventsAdded: Sonification.TimelineEvent[] = [];
                    if (mergedOpts.type === 'speech') {
                        const eventAdded = addMappedSpeechEvent(
                            { point, time }, channel, mergedOpts.mapping,
                            extremesCache.globalExtremes);
                        if (eventAdded) {
                            eventsAdded = [eventAdded];
                        }
                    } else {
                        eventsAdded = addMappedInstrumentEvent(
                            { point, time }, channel, mergedOpts.mapping,
                            extremesCache.globalExtremes,
                            pick(mergedOpts.roundToMusicalNotes, true));
                    }

                    updateLastPropValue();

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

            // Add the context tracks that are not related to points
            contextTracks.forEach((trackOpts): void => {
                const mergedOpts = trackOpts.type === 'speech' ?
                    merge(defaultSpeechOpts, trackOpts) :
                    merge(defaultInstrOpts, trackOpts);

                const contextChannel = addTimelineChannelFromTrack(
                    timeline, audioContext,
                    destinationNode, mergedOpts
                );

                lastPropValue = void 0;
                const {
                        timeInterval,
                        valueInterval
                    } = mergedOpts,
                    valueProp = mergedOpts.valueProp || 'x',
                    activeWhen = mergedOpts.activeWhen,
                    contextExtremes = extremesCache
                        .seriesExtremes[seriesIx][valueProp],
                    addContextEvent = (time: number, value: number): void => {
                        if (
                            !mergedOpts.mapping ||
                            !isActive(
                                { time, value },
                                typeof activeWhen === 'object' ?
                                    extend({ prop: valueProp }, activeWhen) :
                                    activeWhen,
                                lastPropValue
                            )
                        ) {
                            lastPropValue = value;
                            return;
                        }
                        lastPropValue = value;

                        if (mergedOpts.type === 'speech') {
                            addMappedSpeechEvent({ time, value },
                                contextChannel, mergedOpts.mapping,
                                extremesCache.globalExtremes,
                                valueProp);
                        } else {
                            addMappedInstrumentEvent({ time, value },
                                contextChannel, mergedOpts.mapping,
                                extremesCache.globalExtremes,
                                pick(mergedOpts.roundToMusicalNotes, true),
                                valueProp);
                        }
                    };

                if (timeInterval) {
                    let time = 0;
                    while (time <= seriesDuration) {
                        const val = mapToVirtualAxis(
                            time, { min: 0, max: seriesDuration },
                            contextExtremes
                        );
                        addContextEvent(time + startTime, val);
                        time += timeInterval;
                    }
                }
                if (valueInterval) {
                    let val = contextExtremes.min;
                    while (val <= contextExtremes.max) {
                        const time = mapToVirtualAxis(
                            val, contextExtremes,
                            { min: 0, max: seriesDuration },
                            false, mergedOpts.valueMapFunction === 'logarithmic'
                        );
                        addContextEvent(time + startTime, val);
                        val += valueInterval;
                    }
                }
            });

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
