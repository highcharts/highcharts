/* *
 *
 *  (c) 2009-2022 Øystein Moseng
 *
 *  Class representing a Timeline with sonification events to play.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type SonificationSpeaker from './SonificationSpeaker';
import type Chart from '../../Core/Chart/Chart';
import TimelineChannel from './TimelineChannel.js';
import SonificationInstrument from './SonificationInstrument.js';
import toMIDI from './MIDI.js';
import DU from '../DownloadURL.js';
const { downloadURL } = DU;
import U from '../../Core/Utilities.js';
const {
    merge
} = U;


interface SonificationTimelineOptions {
    onPlay?: Function;
    onEnd?: Function;
    onBoundaryHit?: Function;
    showPlayMarker?: boolean;
    showCrosshairOnly?: boolean;
    skipThreshold?: number;
}


/**
 * Get filtered channels. Timestamps are compensated, so that the first
 * event starts immediately.
 * @private
 */
function filterChannels(
    filter: ArrayFilterCallbackFunction<Sonification.TimelineEvent>,
    channels: TimelineChannel[]
): TimelineChannel[] {
    interface FilteredChannel {
        channel: TimelineChannel;
        filteredEvents: Sonification.TimelineEvent[];
    }
    const filtered = channels.map(
            (channel): FilteredChannel => {
                channel.cancel();
                return {
                    channel,
                    filteredEvents: channel.muted ?
                        [] : channel.events.filter(filter)
                };
            }),
        minTime = filtered.reduce((acc, cur): number =>
            Math.min(
                acc, cur.filteredEvents.length ?
                    cur.filteredEvents[0].time : Infinity
            ), Infinity);

    return filtered.map((c): TimelineChannel => (
        new TimelineChannel(
            c.channel.type, c.channel.engine,
            c.filteredEvents.map((e): Sonification.TimelineEvent =>
                merge(e, { time: e.time - minTime })
            ),
            c.channel.muted
        )));
}


/**
 * @private
 */
class SonificationTimeline {
    isPaused = false;
    isPlaying = false;
    channels: TimelineChannel[] = [];
    private scheduledCallbacks: number[] = [];
    private playingChannels?: TimelineChannel[];
    private options: SonificationTimelineOptions;
    private playTimestamp = 0;
    private resumeFromTime = 0;


    constructor(options?: SonificationTimelineOptions, private chart?: Chart) {
        this.options = options || {};
    }


    // Add a channel, optionally with events, to be played.
    // Note: Only one speech channel is supported at a time.
    addChannel(
        type: 'instrument'|'speech',
        engine: SonificationInstrument|SonificationSpeaker,
        events?: Sonification.TimelineEvent[]
    ): TimelineChannel {
        if (
            type === 'instrument' &&
            !(engine as SonificationInstrument).scheduleEventAtTime ||
            type === 'speech' &&
            !(engine as SonificationSpeaker).sayAtTime
        ) {
            throw new Error('Highcharts Sonification: Invalid channel engine.');
        }
        const channel = new TimelineChannel(type, engine, events);
        this.channels.push(channel);
        return channel;
    }


    // Play timeline, optionally filtering out only some of the events to play.
    // Note that if not all instrument parameters are updated on each event,
    // parameters may update differently depending on the events filtered out,
    // since some of the events that update parameters can be filtered out too.
    // The filterPersists argument determines whether or not the filter persists
    // after e.g. pausing and resuming. Usually this should be true.
    play(
        filter?: ArrayFilterCallbackFunction<Sonification.TimelineEvent>,
        filterPersists = true,
        resetAfter = true
    ): void {
        this.cancel();
        this.playTimestamp = Date.now();
        this.resumeFromTime = 0;
        this.isPaused = false;
        this.isPlaying = true;

        const skipThreshold = this.options.skipThreshold || 2,
            onPlay = this.options.onPlay,
            showPlayMarker = this.options.showPlayMarker,
            showCrosshairOnly = this.options.showCrosshairOnly,
            channels = filter ?
                filterChannels(filter, this.playingChannels || this.channels) :
                this.channels,
            getEventKeysSignature = (e: Sonification.TimelineEvent): string =>
                Object.keys(e.speechOptions || {})
                    .concat(Object.keys(e.instrumentEventOptions || {}))
                    .join();

        if (filterPersists) {
            this.playingChannels = channels;
        }

        if (onPlay) {
            onPlay(this);
        }

        let maxTime = 0;
        channels.forEach((channel): void => {
            if (channel.muted) {
                return;
            }

            const numEvents = channel.events.length;
            let lastCallbackTime = -Infinity,
                lastEventTime = -Infinity,
                lastEventKeys = '';
            maxTime = Math.max(
                channel.events[numEvents - 1] &&
                channel.events[numEvents - 1].time || 0,
                maxTime
            );

            for (let i = 0; i < numEvents; ++i) {
                const e = channel.events[i],
                    keysSig = getEventKeysSignature(e);

                // Optimize by skipping extremely close events
                // (<2ms apart by default)
                if (
                    keysSig === lastEventKeys &&
                    e.time - lastEventTime < skipThreshold
                ) {
                    continue;
                }

                lastEventKeys = keysSig;
                lastEventTime = e.time;

                if (channel.type === 'instrument') {
                    (channel.engine as SonificationInstrument)
                        .scheduleEventAtTime(
                            e.time / 1000,
                            e.instrumentEventOptions || {}
                        );
                } else {
                    (channel.engine as SonificationSpeaker).sayAtTime(
                        e.time, e.message || '', e.speechOptions || {}
                    );
                }

                const point = e.relatedPoint,
                    needsCallback = e.callback || point &&
                        (showPlayMarker || showCrosshairOnly) &&
                        e.time - lastCallbackTime > 25;
                if (needsCallback) {
                    this.scheduledCallbacks.push(
                        setTimeout((): void => {
                            if (e.callback) {
                                e.callback();
                            }
                            if (point) {
                                if (
                                    showPlayMarker &&
                                    showCrosshairOnly
                                ) {
                                    const s = point.series;
                                    if (s.xAxis && s.xAxis.crosshair) {
                                        s.xAxis.drawCrosshair(
                                            void 0, point);
                                    }
                                    if (s.yAxis && s.yAxis.crosshair) {
                                        s.yAxis.drawCrosshair(
                                            void 0, point);
                                    }
                                } else if (showPlayMarker) {
                                    point.onMouseOver();
                                }
                            }
                        }, e.time));
                    lastCallbackTime = e.time;
                }
            }
        });

        const onEnd = this.options.onEnd;
        this.scheduledCallbacks.push(setTimeout(
            (): void => {
                const chart = this.chart;
                if (resetAfter) {
                    this.reset();
                }
                if (onEnd) {
                    onEnd(this);
                }
                if (chart) {
                    if (chart.tooltip) {
                        chart.tooltip.hide(0);
                    }
                    if (chart.hoverSeries) {
                        chart.hoverSeries.onMouseOut();
                    }
                    chart.axes.forEach((a): void => a.hideCrosshair());
                }
            },
            maxTime + 250
        ));
    }


    // Pause for later resuming. Returns current timestamp to resume from.
    pause(): number {
        this.isPaused = true;
        this.cancel();
        this.resumeFromTime = Date.now() - this.playTimestamp;
        return this.resumeFromTime;
    }


    // Get current time
    getCurrentTime(): number {
        return this.isPlaying ?
            Date.now() - this.playTimestamp :
            this.resumeFromTime;
    }


    // Resume from paused
    resume(): void {
        if (this.playingChannels) {
            const resumeFrom = this.resumeFromTime - 50;
            this.play((e): boolean => e.time > resumeFrom, false);
            this.playTimestamp -= resumeFrom;
        } else {
            this.play();
        }
    }


    // Play event(s) occurring next/prev from paused state.
    playAdjacent(next: boolean): void {
        const fromTime = this.isPaused ? this.resumeFromTime : -1,
            closestTime = this.channels.reduce(
                (time, channel): number => {
                    // Adapted binary search since events are sorted by time
                    const events = channel.events;
                    let s = 0,
                        e = events.length,
                        lastValidTime = time;
                    while (s < e) {
                        const mid = (s + e) >> 1,
                            t = events[mid].time,
                            cmp = t - fromTime;
                        if (cmp > 0) { // ahead
                            if (next && t < lastValidTime) {
                                lastValidTime = t;
                            }
                            e = mid;
                        } else if (cmp < 0) { // behind
                            if (!next && t > lastValidTime) {
                                lastValidTime = t;
                            }
                            s = mid + 1;
                        } else { // same as from time
                            if (next) {
                                s = mid + 1;
                            } else {
                                e = mid;
                            }
                        }
                    }
                    return lastValidTime;
                }, next ? Infinity : -Infinity),
            margin = 0.02;

        if (closestTime === Infinity || closestTime === -Infinity) {
            if (this.options.onBoundaryHit) {
                this.options.onBoundaryHit({ timeline: this, next });
            }
            return;
        }
        this.play((e): boolean => (next ?
            e.time > fromTime && e.time <= closestTime + margin :
            e.time < fromTime && e.time >= closestTime - margin
        ), false, false);
        this.playingChannels = this.playingChannels || this.channels;
        this.isPaused = true;
        this.isPlaying = false;
        this.resumeFromTime = closestTime;
    }


    // Reset play/pause state so that a later call to resume() will start over
    reset(): void {
        this.cancel();
        delete this.playingChannels;
        this.playTimestamp = this.resumeFromTime = 0;
        this.isPaused = false;
    }


    cancel(): void {
        this.isPlaying = false;
        this.scheduledCallbacks.forEach(clearTimeout);
        this.channels.forEach((c): void => c.cancel());
        if (this.playingChannels && this.playingChannels !== this.channels) {
            this.playingChannels.forEach((c): void => c.cancel());
        }
    }


    setMasterVolume(vol: number): void {
        this.channels.forEach((c): void => c.engine.setMasterVolume(vol));
    }


    getMIDIData(): Uint8Array {
        return toMIDI(this.channels.filter(
            (c): boolean => c.type === 'instrument'));
    }


    downloadMIDI(filename?: string): void {
        const data = this.getMIDIData(),
            name = (
                filename ||
                this.chart &&
                this.chart.options.title &&
                this.chart.options.title.text ||
                'chart'
            ) + '.mid',
            blob = new Blob(
                [data],
                { type: 'application/octet-stream' }
            ),
            url = window.URL.createObjectURL(blob);
        downloadURL(url, name);
        window.URL.revokeObjectURL(url);
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default SonificationTimeline;
