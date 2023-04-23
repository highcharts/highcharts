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
     * Options for configuring sonification and audio charts. Requires the
     * [sonification module](https://code.highcharts.com/modules/sonification.js)
     * to be loaded.
     *
     * @sample  highcharts/demo/all-instruments
     *          All predefined instruments
     * @sample  highcharts/demo/audio-boxplot
     *          Audio boxplots
     * @sample  highcharts/demo/plotline-context
     *          Context tracks
     * @sample  highcharts/demo/sonification-music
     *          Musical chart
     *
     * @since        next
     * @requires     modules/sonification
     * @optionparent sonification
     */
    sonification: {

        /**
         * Enable sonification functionality for the chart.
         */
        enabled: true,

        /**
         * The total duration of the sonification, in milliseconds.
         */
        duration: 6000,

        /**
         * The time to wait in milliseconds after each data series when playing
         * the series one after the other.
         * @see [order](#sonification.order)
         * @sample  highcharts/sonification/chart-earcon
         *          Notification after series
         */
        afterSeriesWait: 700,

        /**
         * How long to wait between each recomputation of the sonification, if
         * the chart updates rapidly. This avoids slowing down processes like
         * panning. Given in milliseconds.
         */
        updateInterval: 200,

        /**
         * Overall/master volume for the sonification, from 0 to 1.
         */
        masterVolume: 0.6,

        /**
         * What order to play the data series in, either `sequential` where
         * the series play individually one after the other, or `simultaneous`
         * where the series play all at once.
         * @sample  highcharts/sonification/chart-simultaneous
         *          Simultaneous sonification
         * @type  {"sequential"|"simultaneous"}
         */
        order: 'sequential',

        /**
         * Show tooltip as the chart plays.
         *
         * Note that if multiple tracks that play at different times try to
         * show the tooltip, it can be glitchy, so it is recommended in
         * those cases to turn this on/off for individual tracks using the
         * [showPlayMarker](#plotOptions.series.sonification.tracks.showPlayMarker)
         * option.
         *
         * @see [showCrosshair](#sonification.showCrosshair)
         */
        showTooltip: true,

        /**
         * Show X and Y axis crosshairs (if they exist) as the chart plays.
         *
         * Note that if multiple tracks that play at different times try to
         * show the crosshairs, it can be glitchy, so it is recommended in
         * those cases to turn this on/off for individual tracks using the
         * [showPlayMarker](#plotOptions.series.sonification.tracks.showPlayMarker)
         * option.
         *
         * @see [showTooltip](#sonification.showTooltip)
         * @see [crosshair](#xAxis.crosshair)
         */
        showCrosshair: true,

        /**
         * Options for grouping data points together when sonifying. This
         * allows for the visual presentation to contain more points than what
         * is being played. If not enabled, all visible / uncropped points are
         * played.
         *
         * @see [series.cropThreshold](#plotOptions.series.cropThreshold)
         */
        pointGrouping: {
            /**
             * Whether or not to group points
             */
            enabled: true,

            /**
             * The size of each group in milliseconds. Audio events closer than
             * this are grouped together.
             */
            groupTimespan: 15,

            /**
             * The grouping algorithm, deciding which points to keep when
             * grouping a set of points together. By default `"minmax"` is
             * used, which keeps both the minimum and maximum points.
             *
             * The other algorithms will either keep the first point in the
             * group (time wise), last point, middle point, or both the first
             * and the last point.
             *
             * The timing of the resulting point(s) is then adjusted to play
             * evenly, regardless of its original position within the group.
             *
             * @type {"minmax"|"first"|"last"|"middle"|"firstlast"}
             */
            algorithm: 'minmax',

            /**
             * The data property for each point to compare when deciding which
             * points to keep in the group.
             *
             * By default it is "y", which means that if the `"minmax"`
             * algorithm is used, the two points the group with the lowest and
             * highest `y` value will be kept, and the others not played.
             */
            prop: 'y'
        },

        /**
         * Default sonification options for all instrument tracks.
         *
         * If specific options are also set on individual tracks or per
         * series, those will override these options.
         *
         * @sample  highcharts/sonification/point-sonify
         *          Sonify points on click
         */
        defaultInstrumentOptions: {

            /**
             * Instrument to use for playing.
             *
             * Can either be a string referencing a synth preset, or it can be
             * a synth configuration object.
             *
             * @sample  highcharts/demo/all-instruments
             *          Overview of available presets
             * @sample  highcharts/sonification/custom-instrument
             *          Custom instrument
             *
             * @type {string|Highcharts.SynthPatchOptionsObject}
             */
            instrument: 'piano',

            /**
             * Mapping options for the audio parameters.
             *
             * All parameters can be either:
             *  - A string, referencing a point property to map to.
             *  - A number, setting the value of the audio parameter directly.
             *  - A callback function, returning the value programmatically.
             *  - An object defining detailed configuration of the mapping.
             *
             * @sample  highcharts/sonification/mapping-overview
             *          Overview of common mapping parameters
             * @sample  highcharts/sonification/pitch-mapping
             *          Various types of mapping used
             * @sample  highcharts/sonification/polarity-invert
             *          Inverted mapping to property
             * @sample  highcharts/sonification/log-mapping
             *          Logarithmic mapping to property
             */
            mapping: {
                /**
                 * The volume of notes, from 0 to 1.
                 * @default 1
                 * @extends sonification.defaultInstrumentOptions.mapping.time
                 * @apioption sonification.defaultInstrumentOptions.mapping.volume
                 */

                /**
                 * Frequency in Hertz of notes. Overrides pitch mapping if set.
                 * @extends sonification.defaultInstrumentOptions.mapping.time
                 * @apioption sonification.defaultInstrumentOptions.mapping.frequency
                 */

                /**
                 * Milliseconds to wait before playing, comes in addition to
                 * the time determined by the `time` mapping.
                 *
                 * Can also be negative to play before the mapped time.
                 *
                 * @extends sonification.defaultInstrumentOptions.mapping.time
                 * @apioption sonification.defaultInstrumentOptions.mapping.playDelay
                 */

                /**
                 * Mapping options for tremolo effects.
                 *
                 * Tremolo is repeated changes of volume over time.
                 *
                 * @apioption sonification.defaultInstrumentOptions.mapping.tremolo
                 */

                /**
                 * Map to tremolo depth, from 0 to 1.
                 *
                 * This determines the intensity of the tremolo effect, how
                 * much the volume changes.
                 *
                 * @extends sonification.defaultInstrumentOptions.mapping.time
                 * @apioption sonification.defaultInstrumentOptions.mapping.tremolo.depth
                 */

                /**
                 * Map to tremolo speed, from 0 to 1.
                 *
                 * This determines the speed of the tremolo effect, how fast
                 * the volume changes.
                 *
                 * @extends sonification.defaultInstrumentOptions.mapping.time
                 * @apioption sonification.defaultInstrumentOptions.mapping.tremolo.speed
                 */

                /**
                 * Mapping options for the lowpass filter.
                 *
                 * A lowpass filter lets low frequencies through, but stops high
                 * frequencies, making the sound more dull.
                 *
                 * @apioption sonification.defaultInstrumentOptions.mapping.lowpass
                 */

                /**
                 * Map to filter frequency in Hertz from 1 to 20,000Hz.
                 *
                 * @extends sonification.defaultInstrumentOptions.mapping.time
                 * @apioption sonification.defaultInstrumentOptions.mapping.lowpass.frequency
                 */

                /**
                 * Map to filter resonance in dB. Can be negative to cause a
                 * dip, or positive to cause a bump.
                 *
                 * @extends sonification.defaultInstrumentOptions.mapping.time
                 * @apioption sonification.defaultInstrumentOptions.mapping.lowpass.resonance
                 */

                /**
                 * Mapping options for the highpass filter.
                 *
                 * A highpass filter lets high frequencies through, but stops
                 * low frequencies, making the sound thinner.
                 *
                 * @extends sonification.defaultInstrumentOptions.mapping.lowpass
                 * @apioption sonification.defaultInstrumentOptions.mapping.highpass
                 */

                /**
                 * Time mapping determines what time each point plays. It is
                 * defined as an offset in milliseconds, where 0 means it
                 * plays immediately when the chart is sonified.
                 *
                 * By default time is mapped to `x`, meaning points with the
                 * lowest `x` value plays first, and points with the highest
                 * `x` value plays last.
                 *
                 * @sample  highcharts/sonification/point-play-time
                 *          Play points in order of Y value
                 * @default "x"
                 * @type {string|number|Function|object}
                 */
                time: 'x',

                /**
                 * A point property to map the mapping parameter to.
                 *
                 * A negative sign `-` can be placed before the property name
                 * to make mapping inverted.
                 *
                 * @sample  highcharts/sonification/polarity-invert
                 *          Inverted mapping to property
                 * @type {string}
                 * @apioption sonification.defaultInstrumentOptions.mapping.time.mapTo
                 */

                /**
                 * The minimum value for the audio parameter. This is the
                 * lowest value the audio parameter will be mapped to.
                 * @type {number}
                 * @apioption sonification.defaultInstrumentOptions.mapping.time.min
                 */

                /**
                 * The maximum value for the audio parameter. This is the
                 * highest value the audio parameter will be mapped to.
                 * @type {number}
                 * @apioption sonification.defaultInstrumentOptions.mapping.time.max
                 */

                /**
                 * What data values to map the parameter within.
                 *
                 * Mapping within `"series"` will make the lowest value point
                 * in the series map to the min audio parameter value, and the
                 * highest value will map to the max audio parameter.
                 *
                 * Mapping within `"chart"` will make the lowest value point in
                 * the whole chart map to the min audio parameter value, and
                 * the highest value in the whole chart will map to the max
                 * audio parameter.
                 *
                 * You can also map within the X or Y axis of each series.
                 *
                 * @sample  highcharts/sonification/mapping-within
                 *          Mapping within demonstrated
                 * @type {"chart"|"series"|"xAxis"|"yAxis"}
                 * @apioption sonification.defaultInstrumentOptions.mapping.time.within
                 */

                /**
                 * How to perform the mapping.
                 * @sample  highcharts/sonification/log-mapping
                 *          Logarithmic mapping to property
                 * @type {"linear"|"logarithmic"}
                 * @apioption sonification.defaultInstrumentOptions.mapping.time.mapFunction
                 */

                /**
                 * A fixed value to use for the prop when mapping.
                 *
                 * For example, if mapping to `y`, setting value to `4` will
                 * map as if all points had a y value of 4.
                 *
                 * @sample  highcharts/demo/plotline-context
                 *          Map to fixed y value
                 * @type {number}
                 * @apioption sonification.defaultInstrumentOptions.mapping.time.value
                 */

                /**
                 * Pan refers to the stereo panning position of the sound.
                 * It is defined from -1 (left) to 1 (right).
                 *
                 * By default it is mapped to `x`, making the sound move from
                 * left to right as the chart plays.
                 *
                 * @extends sonification.defaultInstrumentOptions.mapping.time
                 * @default "x"
                 */
                pan: 'x',

                /**
                 * Note duration determines for how long a note plays, in
                 * milliseconds.
                 *
                 * It only affects instruments that are able to play
                 * continuous sustained notes. Examples of these instruments
                 * from the presets include `flute`, `saxophone`, `trumpet`,
                 * `sawsynth`, `wobble`, `basic1`, `basic2`, `sine`,
                 * `sineGlide`, `triangle`, `square`, `sawtooth`, `noise`,
                 * `filteredNoise`, and `wind`.
                 *
                 * @extends sonification.defaultInstrumentOptions.mapping.time
                 * @default 200
                 */
                noteDuration: 200,

                /**
                 * Musical pitch refers to how high or low notes are played.
                 *
                 * By default it is mapped to `y` so low `y` values are played
                 * with a lower pitch, and high values are played with a higher
                 * pitch.
                 *
                 * Pitch mapping has a few extra features compared to other
                 * audio parameters.
                 *
                 * Firstly, it accepts not only number values, but also string
                 * values denoting note names. These are given in the form
                 * `<note><octave>`, for example `"c6"` or `"F#2"`.
                 *
                 * Secondly, it is possible to map pitch to an array of notes.
                 * In this case, the `[gapBetweenNotes](#sonification.defaultInstrumentOptions.mapping.gapBetweenNotes)`
                 * mapping determines the delay between these notes.
                 *
                 * Thirdly, it is possible to define a musical scale to follow
                 * when mapping.
                 *
                 * @sample  highcharts/sonification/pitch-mapping
                 *          Various types of mapping used
                 * @sample  highcharts/sonification/polarity-invert
                 *          Inverted mapping to property
                 * @sample  highcharts/sonification/log-mapping
                 *          Logarithmic mapping to property
                 * @extends sonification.defaultInstrumentOptions.mapping.time
                 * @type {string|number|Function|object|Array<string|number>}
                 */
                pitch: {
                    mapTo: 'y',
                    min: 'c2',
                    max: 'c6',
                    within: 'yAxis'
                },

                /**
                 * Map pitches to a musical scale. The scale is defined as an
                 * array of semitone offsets from the root note.
                 *
                 * @sample  highcharts/sonification/all-scales
                 *          Predefined scale presets
                 * @type {Array<number>}
                 * @apioption sonification.defaultInstrumentOptions.mapping.pitch.scale
                 */

                /**
                 * Gap in milliseconds between notes if pitch is mapped to an
                 * array of notes.
                 *
                 * @sample  maps/demo/audio-map
                 *          Mapping to gap between notes
                 * @extends sonification.defaultInstrumentOptions.mapping.time
                 * @default 100
                 */
                gapBetweenNotes: 100
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

    /**
     * @optionparent lang
     * @private
     */
    lang: {
        /**
         * The text for the MIDI download menu item in the export menu.
         * @requires modules/sonification
         * @since next
         */
        downloadMIDI: 'Download MIDI',
        /**
         * The text for the Play as sound menu item in the export menu.
         * @requires modules/sonification
         * @since next
         */
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
 * @type {object|undefined}
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
 * @type {object|undefined}
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
