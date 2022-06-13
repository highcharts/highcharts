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
import type SynthPatch from './SynthPatch';

declare global {
    namespace Sonification {
        type TrackValueCallback = (playingPoints: Array<Point>, time: number) => number;
        type TrackStringCallback = (playingPoints: Array<Point>, time: number) => string;
        type TrackPredicateCallback = (playingPoints: Array<Point>, time: number) => boolean;
        type TrackOptions = Array<InstrumentTrackOptions|SpeechTrackOptions>;
        type MappingParameter =
        string|number|TrackValueCallback|MappingParameterOptions;

        interface MappingParameterOptions{
            min?: number|string;
            max?: number|string;
            mapTo: string;
            mapFunction?: string;
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
            pitch?: string[]|number[]|MappingParameter;
            gapBetweenNotes?: MappingParameter;
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
        }

        interface SpeechTrackMappingOptions {
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
            onEnd?: Function;
        }

        interface ChartSonificationOptions {
            enabled: boolean;
            duration: number;
            afterSeriesWait: number;
            masterVolume: number;
            order: 'sequential'|'simultaneous';
            events?: ChartSonificationEventsOptions;
            showTooltipOnPlay: boolean;
            showCrosshairOnPlay: boolean;
            /**
             * Used to create instrument tracks for series without options
             */
            defaultInstrumentOptions: InstrumentTrackOptions|SpeechTrackOptions;
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
            /**
             * Play for each point where activeWhen returns true.
             */
            notifications?: TrackOptions;
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
        showCrosshairOnPlay: true,
        showTooltipOnPlay: true,
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
        }
    }
};

export default Options;
