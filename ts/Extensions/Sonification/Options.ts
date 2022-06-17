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
import type SonificationTimeline from './SonificationTimeline';
import type SynthPatch from './SynthPatch';

declare global {
    namespace Sonification {
        interface CallbackContext {
            time: number;
            point?: Point;
            contextValue?: number;
        }
        type SeriesCallback = (
            series: Series, timeline: SonificationTimeline
        ) => void;
        type TrackValueCallback = (context: CallbackContext) => number;
        type TrackStringCallback = (context: CallbackContext) => string;
        type TrackPredicateCallback = (context: CallbackContext) => boolean;
        type TrackOptions = Array<InstrumentTrackOptions|SpeechTrackOptions>;
        type MapFunctionTypes = 'linear'|'logarithmic';
        type MappingParameter =
        string|number|TrackValueCallback|MappingParameterOptions;

        interface MappingParameterOptions {
            min?: number;
            max?: number;
            mapTo: string;
            mapFunction?: MapFunctionTypes;
        }

        interface PitchMappingParameterOptions {
            min?: number|string;
            max?: number|string;
            mapTo: string;
            mapFunction?: MapFunctionTypes;
        }

        interface FilterMappingOptions {
            frequency?: MappingParameter;
            resonance?: MappingParameter;
        }

        interface TremoloMappingOptions {
            depth?: MappingParameter;
            speed?: MappingParameter;
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

        interface InstrumentTrackOptions {
            type?: 'instrument';
            instrument: string|SynthPatch.SynthPatchOptions;
            mapping?: InstrumentTrackMappingOptions;
            activeWhen?: TrackPredicateCallback;
            roundToMusicalNotes?: boolean;
        }

        interface SpeechTrackMappingOptions {
            time?: MappingParameter;
            text: string|TrackStringCallback;
            playDelay?: MappingParameter;
            rate?: MappingParameter;
            pitch?: MappingParameter;
        }

        interface SpeechTrackOptions {
            type: 'speech';
            mapping?: SpeechTrackMappingOptions;
            activeWhen?: TrackPredicateCallback;
            preferredVoice?: string;
            language: string;
        }

        interface ChartSonificationEventsOptions {
            onPlay?: Function;
            onEnd?: Function;
            onSeriesStart?: SeriesCallback;
            onSeriesEnd?: SeriesCallback;
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
            globalTracks?: TrackOptions;
            globalContextTracks?: TrackOptions;
            /**
             * Used to create a track for series without options
             */
            defaultInstrumentOptions: InstrumentTrackOptions;
            defaultSpeechOptions: SpeechTrackOptions;
        }

        interface SonificationGroupingOptions {
            enabled?: boolean;
            algorithm?: 'minmax'|'average'|'sum';
            maxPointsPerSecond?: number;
        }

        interface SeriesSonificationOptions {
            enabled?: boolean;
            pointGrouping?: SonificationGroupingOptions;
            /**
             * Map data points to sounds
             */
            tracks?: TrackOptions;
            /**
             * Continuously play context sounds
             */
            contextTracks?: TrackOptions;
        }
    }
}

declare module '../../Core/Options'{
    interface Options {
        sonification?: Sonification.ChartSonificationOptions;
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
        masterVolume: 0.6,
        order: 'sequential',
        showPlayMarker: true,
        defaultInstrumentOptions: {
            instrument: 'piano',
            mapping: {
                time: 'x',
                pan: 'x',
                noteDuration: 200,
                pitch: {
                    mapTo: 'y',
                    min: 'c2',
                    max: 'c6'
                }
            }
        },
        defaultSpeechOptions: {
            language: 'en-US',
            mapping: {
                time: 'x',
                rate: 1.3
            }
        }
    }
};

export default Options;
