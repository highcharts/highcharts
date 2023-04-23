/* *
 *
 *  (c) 2009-2022 Øystein Moseng
 *
 *  Default options for sonification.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type OptionsType from '../../Core/Options';
import type Point from '../../Core/Series/Point';
import type Series from '../../Core/Series/Series';
import type Chart from '../../Core/Chart/Chart';
import type SonificationTimeline from './SonificationTimeline';
import type SynthPatch from './SynthPatch';

declare global {
    namespace Sonification {
        interface TimelineEventContext {
            time: number;
            point?: Point;
            value?: number;
        }
        interface ChartEventContext {
            chart?: Chart,
            timeline?: SonificationTimeline,
            pointsPlayed?: Point[]
        }
        interface SeriesEventContext {
            series?: Series,
            timeline?: SonificationTimeline
        }
        interface BoundaryHitContext {
            chart?: Chart,
            timeline: SonificationTimeline,
            attemptedNext?: boolean
        }
        type SeriesCallback = (s: SeriesEventContext) => void;
        type ChartCallback = (c: ChartEventContext) => void;
        type BoundaryHitCallback = (e: BoundaryHitContext) => void;
        type TrackValueCallback = (context: TimelineEventContext) => number;
        type TrackStringCallback = (context: TimelineEventContext) => string;
        type TrackPredicateCallback =
            (context: TimelineEventContext) => boolean;
        type TrackOptions = Array<InstrumentTrackOptions|SpeechTrackOptions>;
        type InstrumentContextTrackOptions = InstrumentTrackOptions &
        ContextOptions;
        type SpeechContextTrackOptions = SpeechTrackOptions & ContextOptions;
        type ContextTrackOptions = Array<InstrumentContextTrackOptions|SpeechContextTrackOptions>;
        type MapFunctionTypes = 'linear'|'logarithmic';
        type PointGroupingAlgorithmTypes = 'minmax'|'first'|'last'|
        'middle'|'firstlast';
        type MappingParameter =
        string|number|TrackValueCallback|MappingParameterOptions;

        interface MappingParameterOptions {
            min?: number;
            max?: number;
            mapTo: string;
            mapFunction?: MapFunctionTypes;
            within?: 'chart'|'series'|'xAxis'|'yAxis';
            value?: number;
        }

        interface PitchMappingParameterOptions extends Omit<MappingParameterOptions, 'min'|'max'> {
            min?: number|string;
            max?: number|string;
            scale?: number[];
        }

        interface FilterMappingOptions {
            frequency?: MappingParameter;
            resonance?: MappingParameter;
        }

        interface TremoloMappingOptions {
            depth?: MappingParameter;
            speed?: MappingParameter;
        }

        interface PointGroupingOptions {
            enabled?: boolean;
            groupTimespan?: number;
            algorithm?: PointGroupingAlgorithmTypes;
            prop?: string;
        }

        interface BaseTrackOptions {
            pointGrouping?: PointGroupingOptions;
            activeWhen?: TrackPredicateCallback|ValueConstraints;
            showPlayMarker?: boolean;
            midiName?: string;
        }

        interface InstrumentTrackMappingOptions {
            time?: MappingParameter;
            pan?: MappingParameter;
            volume?: MappingParameter;
            pitch?: (
                string[]|number[]|string|number|PitchMappingParameterOptions
            );
            frequency?: MappingParameter;
            gapBetweenNotes?: MappingParameter;
            playDelay?: MappingParameter;
            noteDuration?: MappingParameter;
            tremolo?: TremoloMappingOptions;
            lowpass?: FilterMappingOptions;
            highpass?: FilterMappingOptions;
        }

        interface InstrumentTrackOptions extends BaseTrackOptions {
            type?: 'instrument';
            instrument: string|SynthPatch.SynthPatchOptions;
            mapping?: InstrumentTrackMappingOptions;
            roundToMusicalNotes?: boolean;
        }

        interface ValueConstraints {
            min?: number;
            max?: number;
            crossingUp?: number;
            crossingDown?: number;
            prop?: string;
        }

        interface ContextOptions {
            timeInterval?: number;
            valueInterval?: number;
            valueProp?: string;
            valueMapFunction?: MapFunctionTypes;
            activeWhen?: TrackPredicateCallback|ValueConstraints;
        }

        interface SpeechTrackMappingOptions {
            time?: MappingParameter;
            text: string|TrackStringCallback;
            playDelay?: MappingParameter;
            rate?: MappingParameter;
            pitch?: MappingParameter;
            volume?: MappingParameter;
        }

        interface SpeechTrackOptions extends BaseTrackOptions {
            type: 'speech';
            mapping?: SpeechTrackMappingOptions;
            preferredVoice?: string;
            language: string;
        }

        interface ChartSonificationEventsOptions {
            onPlay?: ChartCallback;
            onStop?: ChartCallback;
            onEnd?: ChartCallback;
            onSeriesStart?: SeriesCallback;
            onSeriesEnd?: SeriesCallback;
            onBoundaryHit?: BoundaryHitCallback;
            beforePlay?: ChartCallback;
            beforeUpdate?: ChartCallback;
            afterUpdate?: ChartCallback;
        }

        interface ChartSonificationOptions {
            enabled: boolean;
            duration: number;
            afterSeriesWait: number;
            masterVolume: number;
            order: 'sequential'|'simultaneous';
            events?: ChartSonificationEventsOptions;
            showTooltip: boolean;
            showCrosshair: boolean;
            pointGrouping: PointGroupingOptions;
            globalTracks?: TrackOptions;
            globalContextTracks?: ContextTrackOptions;
            defaultInstrumentOptions: InstrumentTrackOptions;
            defaultSpeechOptions: SpeechTrackOptions;
            updateInterval: number;
        }

        interface SeriesSonificationOptions {
            contextTracks?: ContextTrackOptions;
            defaultInstrumentOptions?: InstrumentTrackOptions;
            defaultSpeechOptions?: SpeechTrackOptions;
            enabled?: boolean;
            pointGrouping?: PointGroupingOptions;
            tracks?: TrackOptions;
        }
    }
}

declare module '../../Core/Options'{
    interface Options {
        sonification?: Sonification.ChartSonificationOptions;
    }
    interface LangOptions {
        downloadMIDI?: string;
        playAsSound?: string;
    }
}

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        sonification?: Sonification.SeriesSonificationOptions;
    }
}


const Options: DeepPartial<OptionsType> = {
    /**
     * Options for configuring sonification for the chart. Requires the
     * [sonification module](https://code.highcharts.com/modules/sonification.js)
     * to be loaded.
     *
     * @since        next
     * @requires     modules/sonification
     * @optionparent sonification
     */
    sonification: {

        /**
         * Enable sonification functionality for the chart.
         * @since next
         */
        enabled: true,

        /**
         * The total duration of the sonification, in milliseconds.
         * @since next
         */
        duration: 6000,

        /**
         * The time to wait in milliseconds after each data series when playing
         * the series one after the other.
         * @see [order](#sonification.order)
         * @sample  highcharts/sonification/chart-earcon
         *          Notification after series
         * @since next
         */
        afterSeriesWait: 700,

        /**
         * How long to wait between each recomputation of the sonification, if
         * the chart updates rapidly. This avoids slowing down processes like
         * panning. Given in milliseconds.
         * @since next
         */
        updateInterval: 200,

        /**
         * Overall/master volume for the sonification, from 0 to 1.
         * @since next
         */
        masterVolume: 0.6,

        /**
         * What order to play the data series in, either `sequential` where
         * the series play individually one after the other, or `simultaneous`
         * where the series play all at once.
         * @sample  highcharts/sonification/chart-simultaneous
         *          Simultaneous sonification
         * @type  {"sequential"|"simultaneous"}
         * @since next
         */
        order: 'sequential',

        /**
         * Show tooltip as the chart plays.
         *
         * Note that if multiple tracks that play at different times try to
         * show the tooltip, it can be glitchy, so it is recommended in those
         * cases to turn this on/off for individual tracks.
         *
         * @see [showPlayMarker](#plotOptions.series.sonification.tracks.showPlayMarker)
         * @see [showCrosshair](#sonification.showCrosshair)
         * @since next
         */
        showTooltip: true,

        /**
         * Show X and Y axis crosshairs (if they exist) as the chart plays.
         *
         * Note that if multiple tracks that play at different times try to
         * show the crosshairs, it can be glitchy, so it is recommended in
         * those cases to turn this on/off for individual tracks.
         *
         * @see [showPlayMarker](#plotOptions.series.sonification.tracks.showPlayMarker)
         * @see [showTooltip](#sonification.showTooltip)
         * @see [crosshair](#xAxis.crosshair)
         * @since next
         */
        showCrosshair: true,


        pointGrouping: {
            enabled: true,
            groupTimespan: 15,
            algorithm: 'minmax',
            prop: 'y'
        },


        defaultInstrumentOptions: {
            instrument: 'piano',
            mapping: {
                time: 'x',
                pan: 'x',
                noteDuration: 200,
                pitch: {
                    mapTo: 'y',
                    min: 'c2',
                    max: 'c6',
                    within: 'yAxis'
                }
            }
        },

        defaultSpeechOptions: {
            language: 'en-US',
            mapping: {
                time: 'x',
                rate: 1.3,
                volume: 0.4
            },
            pointGrouping: {
                algorithm: 'last'
            }
        }
    },
    exporting: {
        menuItemDefinitions: {
            downloadMIDI: {
                textKey: 'downloadMIDI',
                onclick: function (): void {
                    if (this.sonification) {
                        this.sonification.downloadMIDI();
                    }
                }
            },
            playAsSound: {
                textKey: 'playAsSound',
                onclick: function (): void {
                    const s = this.sonification;
                    if (s && s.isPlaying()) {
                        s.cancel();
                    } else {
                        this.sonify();
                    }
                }
            }
        }
    },
    lang: {
        downloadMIDI: 'Download MIDI',
        playAsSound: 'Play as sound'
    }
};

export default Options;


/* *
 *
 *  API declarations
 *
 * */

/**
 * Event context object sent to sonification chart events.
 * @requires modules/sonification
 * @interface Highcharts.SonificationChartEventCallbackContext
 *//**
 * The relevant chart
 * @name Highcharts.SonificationChartEventCallbackContext#chart
 * @type {Highcharts.Chart|undefined}
 *//**
 * The points that were played, if any
 * @name Highcharts.SonificationChartEventCallbackContext#pointsPlayed
 * @type {Array<Highcharts.Point>|undefined}
 *//**
 * The playing timeline object with advanced and internal content
 * @name Highcharts.SonificationChartEventCallbackContext#timeline
 * @type {AnyRecord|undefined}
 */

/**
 * Event context object sent to sonification series events.
 * @requires modules/sonification
 * @interface Highcharts.SonificationSeriesEventCallbackContext
 *//**
 * The relevant series
 * @name Highcharts.SonificationSeriesEventCallbackContext#series
 * @type {Highcharts.Series|undefined}
 *//**
 * The playing timeline object with advanced and internal content
 * @name Highcharts.SonificationSeriesEventCallbackContext#timeline
 * @type {AnyRecord|undefined}
 */

/**
 * Callback function for sonification events on chart.
 * @callback Highcharts.SonificationChartEventCallback
 * @param {Highcharts.SonificationChartEventCallbackContext} e Sonification chart event context
 */

/**
 * Callback function for sonification events on series.
 * @callback Highcharts.SonificationSeriesEventCallback
 * @param {Highcharts.SonificationSeriesEventCallbackContext} e Sonification series event context
 */

(''); // Keep above doclets in JS file
