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

import type Point from '../../Core/Series/Point.js';
import SonificationInstrument from './SonificationInstrument.js';
import type SonificationSpeaker from './SonificationSpeaker';


interface SonificationTimelineEvent {
    time: number; // Time is given in seconds, where 0 is now.
    relatedPoints?: Point[];
    instrumentEventOptions?: SonificationInstrument.ScheduledEventOptions;
    message?: string;
    callback?: Function;
}


/**
 * @private
 */
class TimelineChannel {
    events: SonificationTimelineEvent[];
    muted?: boolean;

    constructor(
        public type: 'instrument'|'speech',
        public engine: SonificationInstrument|SonificationSpeaker
    ) {
        this.events = [];
    }


    addEvent(event: SonificationTimelineEvent): void {
        const lastEvent = this.events[this.events.length - 1];
        if (lastEvent && event.time < lastEvent.time) {
            throw new Error(
                // eslint-disable-next-line max-len
                'Highcharts Sonification: Timeline event order must be in ascending time.'
            );
        }
        this.events.push(event);
    }


    mute(): void {
        this.muted = true;
    }


    unmute(): void {
        this.muted = false;
    }


    cancelScheduled(): void {
        this.engine.cancelScheduled();
    }
}


/**
 * @private
 */
class SonificationTimeline {
    private channels: TimelineChannel[];
    private scheduledCallbacks: number[];


    constructor() {
        this.channels = [];
        this.scheduledCallbacks = [];
    }


    // Note: Only one speech channel is supported at a time.
    addChannel(
        type: 'instrument'|'speech',
        engine: SonificationInstrument|SonificationSpeaker
    ): TimelineChannel {
        if (
            type === 'instrument' &&
            !(engine as SonificationInstrument).scheduleEventAtTime ||
            type === 'speech' &&
            !(engine as SonificationSpeaker).sayAtTime
        ) {
            throw new Error('Highcharts Sonification: Invalid channel engine.');
        }
        const channel = new TimelineChannel(type, engine);
        this.channels.push(channel);
        return channel;
    }


    // Play events, optionally filtering out only some of the events to play.
    // Note that if not all instrument parameters are updated on each event,
    // parameters may update differently depending on the events filtered out,
    // since some of the events that update parameters can be filtered out too.
    play(filter?: ArrayFilterCallbackFunction<SonificationTimelineEvent>): void {
        this.scheduledCallbacks.forEach(clearTimeout);

        const playEvent = (
            e: SonificationTimelineEvent,
            channel: TimelineChannel,
            timeOffset: number
        ): void => {
            if (channel.type === 'instrument') {
                (channel.engine as SonificationInstrument).scheduleEventAtTime(
                    e.time - timeOffset, e.instrumentEventOptions || {}
                );
            } else {
                (channel.engine as SonificationSpeaker).sayAtTime(
                    e.time - timeOffset, e.message || ''
                );
            }
            if (e.callback) {
                this.scheduledCallbacks.push(setTimeout(
                    e.callback, (e.time - timeOffset) * 1000
                ));
            }
        };

        if (!filter) {
            this.channels.forEach((channel): void => {
                channel.cancelScheduled();
                if (!channel.muted) {
                    channel.events.forEach(
                        (e): void => playEvent(e, channel, 0));
                }
            });
        } else {
            // If filtered we need to compensate for time
            const filteredChannels = this.channels.map(
                    (channel): Record<string, any>|null => {
                        channel.cancelScheduled();
                        return channel.muted ? null : {
                            channel,
                            filteredEvents: channel.events.filter(filter)
                        };
                    }),
                minTime = filteredChannels.reduce((acc, cur): number =>
                    Math.min(
                        acc, cur ? cur.filteredEvents[0].time : Infinity
                    ), Infinity);

            filteredChannels.forEach((c): void => {
                if (c) {
                    c.filteredEvents.forEach(
                        (e: SonificationTimelineEvent): void =>
                            playEvent(e, c.channel, minTime));
                }
            });
        }
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
