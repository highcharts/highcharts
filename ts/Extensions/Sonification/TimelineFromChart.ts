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
import type TimelineChannel from './TimelineChannel';
import SonificationTimeline from './SonificationTimeline.js';
import SonificationInstrument from './SonificationInstrument.js';
import SonificationSpeaker from './SonificationSpeaker.js';
import U from '../../Core/Utilities.js';
const {
    merge
} = U;


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
        engine = options.type === 'instrument' ?
            new SonificationInstrument(
                audioContext, destinationNode, {
                    capabilities: {
                        pan: !!instrMappingOpts.pan,
                        tremolo: !!instrMappingOpts.tremolo,
                        filters: !!(instrMappingOpts.highpass ||
                            instrMappingOpts.lowpass)
                    },
                    synthPatch: options.instrument
                }) :
            new SonificationSpeaker({
                language: speechOpts.language,
                name: speechOpts.preferredVoice
            });

    return timeline.addChannel(options.type || 'instrument', engine);
}


/**
 * Add events from series to a mapped instrument track.
 * @private
 */
function addMappedInstrumentEvents(
    series: Series,
    channel: TimelineChannel,
    options: Sonification.InstrumentTrackOptions
): void {

}


/**
 * Add events from series to a mapped speech track.
 * @private
 */
function addMappedSpeechEvents(
    series: Series,
    channel: TimelineChannel,
    options: Sonification.SpeechTrackOptions
): void {

}


/**
 * Get a new timeline object from a chart.
 * @private
 */
function TimelineFromChart(
    audioContext: AudioContext,
    destinationNode: AudioDestinationNode,
    chart: Chart
): SonificationTimeline {
    const options = chart.options.sonification ||
            {} as Sonification.ChartSonificationOptions,
        defaultOpts = options.defaultInstrumentOptions,
        timeline = new SonificationTimeline({
            onEnd: options.events && options.events.onEnd
        });

    chart.series.forEach((series): void => {
        const sOptions = series.options.sonification ||
            {} as Sonification.SeriesSonificationOptions;
        if (series.visible && sOptions.enabled !== false) {

            // Go through mapped tracks
            (sOptions.tracks || [defaultOpts])
                .forEach((trackOpts): void => {
                    const mergedOpts = merge(defaultOpts, trackOpts);
                    const channel = addTimelineChannelFromTrack(
                        timeline, audioContext, destinationNode, mergedOpts
                    );
                    if (mergedOpts.type === 'speech') {
                        addMappedSpeechEvents(series, channel, mergedOpts);
                    } else {
                        addMappedInstrumentEvents(series, channel, mergedOpts);
                    }
                });
        }
    });

    return timeline;
}


/* *
 *
 *  Default Export
 *
 * */

export default TimelineFromChart;
