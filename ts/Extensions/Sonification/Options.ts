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
            showPlayMarker: boolean;
            showCrosshairOnly?: boolean;
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
    sonification: {
        enabled: true,
        duration: 6000,
        afterSeriesWait: 700,
        updateInterval: 300,
        masterVolume: 0.6,
        order: 'sequential',
        showPlayMarker: true,
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
