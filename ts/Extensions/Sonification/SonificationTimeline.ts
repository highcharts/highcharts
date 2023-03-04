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
import type Point from '../../Core/Series/Point';
import TimelineChannel from './TimelineChannel.js';
import SonificationInstrument from './SonificationInstrument.js';
import toMIDI from './MIDI.js';
import DU from '../DownloadURL.js';
const { downloadURL } = DU;
import U from '../../Core/Utilities.js';
const {
    find,
    merge
} = U;


interface SonificationTimelineOptions {
    onPlay?: Function;
    onEnd?: Function;
    onStop?: Function;
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
            c.channel.type, c.channel.engine, c.channel.showPlayMarker,
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
        showPlayMarker = false,
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
        const channel = new TimelineChannel(
            type, engine, showPlayMarker, events
        );
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
        resetAfter = true,
        onEnd?: Function
    ): void {
        if (this.isPlaying) {
            this.cancel();
        } else {
            this.clearScheduledCallbacks();
        }
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
                    .join(),
            pointsPlayed: Point[] = [];

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

                // Optimize by skipping extremely close events (<2ms apart by
                // default), as long as they don't introduce new event options
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
                    chart = point && point.series && point.series.chart,
                    needsCallback = e.callback ||
                        point && (showPlayMarker || showCrosshairOnly) &&
                        channel.showPlayMarker !== false &&
                        (e.time - lastCallbackTime > 50 || i === numEvents - 1);

                if (point) {
                    pointsPlayed.push(point);
                }
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
                                    if (s && s.xAxis && s.xAxis.crosshair) {
                                        s.xAxis.drawCrosshair(void 0, point);
                                    }
                                    if (s && s.yAxis && s.yAxis.crosshair) {
                                        s.yAxis.drawCrosshair(void 0, point);
                                    }
                                } else if (
                                    showPlayMarker && !(
                                        // Don't re-hover if shared tooltip
                                        chart && chart.hoverPoints &&
                                        chart.hoverPoints.length > 1 &&
                                        find(
                                            chart.hoverPoints,
                                            (p): boolean => p === point
                                        ) &&
                                        // Stock issue w/Navigator
                                        point.onMouseOver
                                    )
                                ) {
                                    point.onMouseOver();
                                }
                            }
                        }, e.time));
                    lastCallbackTime = e.time;
                }
            }
        });

        const onEndOpt = this.options.onEnd,
            onStop = this.options.onStop;
        this.scheduledCallbacks.push(setTimeout(
            (): void => {
                const chart = this.chart;
                this.isPlaying = false;
                if (resetAfter) {
                    this.resetPlayState();
                }
                if (onStop) {
                    onStop({ timeline: this, pointsPlayed });
                }
                if (onEndOpt) {
                    onEndOpt(this, pointsPlayed);
                }
                if (onEnd) {
                    onEnd(this, pointsPlayed);
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
        this.resumeFromTime = filterPersists ? maxTime : this.getLength();
    }


    // Pause for later resuming. Returns current timestamp to resume from.
    pause(): number {
        this.isPaused = true;
        this.cancel();
        this.resumeFromTime = Date.now() - this.playTimestamp - 10;
        return this.resumeFromTime;
    }


    // Get current time
    getCurrentTime(): number {
        return this.isPlaying ?
            Date.now() - this.playTimestamp :
            this.resumeFromTime;
    }


    // Get length of timeline in milliseconds
    getLength(): number {
        return this.channels.reduce((maxTime, channel): number => {
            const lastEvent = channel.events[channel.events.length - 1];
            return lastEvent ? Math.max(lastEvent.time, maxTime) : maxTime;
        }, 0);
    }


    // Resume from paused
    resume(): void {
        if (this.playingChannels) {
            const resumeFrom = this.resumeFromTime - 50;
            this.play((e): boolean => e.time > resumeFrom, false, false);
            this.playTimestamp -= resumeFrom;
        } else {
            this.play(void 0, false, false);
        }
    }


    // Play event(s) occurring next/prev from paused state.
    playAdjacent(
        next: boolean,
        onEnd?: Function,
        onBoundaryHit?: Function,
        eventFilter?: ArrayFilterCallbackFunction<Sonification.TimelineEvent>
    ): void {
        if (this.isPlaying) {
            this.pause();
        }

        const fromTime = this.resumeFromTime,
            closestTime = this.channels.reduce(
                (time, channel): number => {
                    // Adapted binary search since events are sorted by time
                    const events = eventFilter ?
                        channel.events.filter(eventFilter) : channel.events;
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
            if (onBoundaryHit) {
                onBoundaryHit({ timeline: this, next });
            }
            return;
        }
        this.play((e, ix, arr): boolean => {
            const withinTime = next ?
                e.time > fromTime && e.time <= closestTime + margin :
                e.time < fromTime && e.time >= closestTime - margin;
            return eventFilter ? withinTime && eventFilter(e, ix, arr) :
                withinTime;
        }, false, false, onEnd);
        this.playingChannels = this.playingChannels || this.channels;
        this.isPaused = true;
        this.isPlaying = false;
        this.resumeFromTime = closestTime;
    }


    // Get timeline events that are related to a certain point.
    // Note: Point grouping may cause some points not to have a
    //  related point in the timeline.
    getEventsForPoint(point: Point): Sonification.TimelineEvent[] {
        return this.channels.reduce(
            (events, channel): Sonification.TimelineEvent[] => {
                const pointEvents = channel.events
                    .filter((e): boolean => e.relatedPoint === point);
                return events.concat(pointEvents);
            }, [] as Sonification.TimelineEvent[]
        );
    }


    // Divide timeline into 100 parts of equal time, and play one of them.
    // Used for scrubbing.
    playSegment(segment: number, onEnd?: Function): void {
        const numSegments = 100;
        const eventTimes = {
            first: Infinity,
            last: -Infinity
        };
        this.channels.forEach((c): void => {
            if (c.events.length) {
                eventTimes.first = Math.min(c.events[0].time, eventTimes.first);
                eventTimes.last = Math.max(
                    c.events[c.events.length - 1].time, eventTimes.last
                );
            }
        });
        if (eventTimes.first < Infinity) {
            const segmentSize =
                    (eventTimes.last - eventTimes.first) / numSegments,
                fromTime = eventTimes.first + segment * segmentSize,
                toTime = fromTime + segmentSize;

            // Binary search, do we have any events within time range?
            if (!this.channels.some((c): boolean => {
                const events = c.events;
                let s = 0,
                    e = events.length;
                while (s < e) {
                    const mid = (s + e) >> 1,
                        t = events[mid].time;
                    if (t < fromTime) { // behind
                        s = mid + 1;
                    } else if (t > toTime) { // ahead
                        e = mid;
                    } else {
                        return true;
                    }
                }
                return false;
            })) {
                return; // If not, don't play - avoid cancelling current play
            }

            this.play((e): boolean => e.time >= fromTime && e.time <= toTime,
                false, false, onEnd);
            this.playingChannels = this.playingChannels || this.channels;
            this.isPaused = true;
            this.isPlaying = false;
            this.resumeFromTime = toTime;
        }
    }


    // Reset play/pause state so that a later call to resume() will start over
    reset(): void {
        if (this.isPlaying) {
            this.cancel();
        }
        this.resetPlayState();
    }


    cancel(): void {
        this.fireStopEvent();
        this.isPlaying = false;
        this.channels.forEach((c): void => c.cancel());
        if (this.playingChannels && this.playingChannels !== this.channels) {
            this.playingChannels.forEach((c): void => c.cancel());
        }
        this.clearScheduledCallbacks();
        this.resumeFromTime = 0;
    }


    destroy(): void {
        this.cancel();
        if (this.playingChannels && this.playingChannels !== this.channels) {
            this.playingChannels.forEach((c): void => c.destroy());
        }
        this.channels.forEach((c): void => c.destroy());
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


    private resetPlayState(): void {
        delete this.playingChannels;
        this.playTimestamp = this.resumeFromTime = 0;
        this.isPaused = false;
    }


    private fireStopEvent(): void {
        const onStop = this.options.onStop;
        if (onStop) {
            onStop({ timeline: this });
        }
    }


    private clearScheduledCallbacks(): void {
        this.scheduledCallbacks.forEach(clearTimeout);
        this.scheduledCallbacks = [];
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default SonificationTimeline;
