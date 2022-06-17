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
import U from '../../Core/Utilities.js';
const {
    merge
} = U;


interface SonificationTimelineOptions {
    onPlay?: Function;
    onEnd?: Function;
    showPlayMarker?: boolean;
    showCrosshairOnly?: boolean;
}

interface FilteredChannel {
    channel: TimelineChannel;
    filteredEvents: Sonification.TimelineEvent[];
}


/**
 * @private
 */
class SonificationTimeline {
    paused = false;
    isPlaying = false;
    channels: TimelineChannel[] = [];
    private scheduledCallbacks: number[] = [];
    private playingTimeline?: SonificationTimeline;
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


    // Get a new timeline where the events are filtered by a condition.
    // Timestamps are compensated, so that the first event starts immediately.
    filter(
        filter: ArrayFilterCallbackFunction<Sonification.TimelineEvent>
    ): SonificationTimeline {
        const filtered = this.channels.map(
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

        const timeline = new SonificationTimeline(this.options);
        filtered.forEach((c): TimelineChannel => timeline.addChannel(
            c.channel.type, c.channel.engine, c.filteredEvents
                .map((e): Sonification.TimelineEvent => merge(e, {
                    time: e.time - minTime
                }))));
        return timeline;
    }


    // Play timeline, optionally filtering out only some of the events to play.
    // Note that if not all instrument parameters are updated on each event,
    // parameters may update differently depending on the events filtered out,
    // since some of the events that update parameters can be filtered out too.
    play(filter?: ArrayFilterCallbackFunction<Sonification.TimelineEvent>): void {
        this.cancel();
        this.playTimestamp = Date.now();
        this.resumeFromTime = 0;
        this.paused = false;
        this.isPlaying = true;

        if (!filter) {
            this.playingTimeline = this;
            let maxTime = 0;

            const onPlay = this.options.onPlay,
                showPlayMarker = this.options.showPlayMarker,
                showCrosshairOnly = this.options.showCrosshairOnly;

            if (onPlay) {
                onPlay(this);
            }

            // Just play everything
            this.channels.forEach((channel): void => {
                if (!channel.muted) {
                    channel.events.forEach((e): void => {
                        maxTime = Math.max(e.time, maxTime);

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
                                (showPlayMarker || showCrosshairOnly);
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
                        }
                    });
                }
            });

            const onEnd = this.options.onEnd;
            this.scheduledCallbacks.push(setTimeout(
                (): void => {
                    const chart = this.chart;
                    this.isPlaying = false;
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
        } else {
            (this.playingTimeline = this.filter(filter)).play();
        }
    }


    // Pause for later resuming. Returns current timestamp to resume from.
    pause(): number {
        const currentTime = (Date.now() - this.playTimestamp);
        this.paused = true;
        this.resumeFromTime = currentTime - 50;
        this.cancel();
        return currentTime;
    }


    // Reset play/pause state so that a later call to resume() will start over
    reset(): void {
        this.cancel();
        delete this.playingTimeline;
        this.playTimestamp = this.resumeFromTime = 0;
        this.paused = false;
    }


    // Resume from paused
    resume(): void {
        this.paused = false;
        if (this.playingTimeline) {
            // Note that we need to update state on this timeline too,
            // not just the filtered one that gets updated in play().
            this.playTimestamp = Date.now();
            (this.playingTimeline = this.playingTimeline
                .filter((e): boolean => e.time > this.resumeFromTime))
                .play();
            this.resumeFromTime = 0;
        } else {
            this.play();
        }
    }


    cancel(): void {
        this.isPlaying = false;
        this.scheduledCallbacks.forEach(clearTimeout);
        this.channels.forEach((c): void => c.cancel());
        if (this.playingTimeline && this.playingTimeline !== this) {
            this.playingTimeline.cancel();
        }
    }


    setMasterVolume(vol: number): void {
        this.channels.forEach((c): void => c.engine.setMasterVolume(vol));
    }


    // Todo
    getAsMIDI(): string {
        let text = '';
        this.channels.filter((c): boolean => c.type === 'instrument')
            .forEach((c): void => {
                text += 'Channel.';
            });
        return text;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default SonificationTimeline;
