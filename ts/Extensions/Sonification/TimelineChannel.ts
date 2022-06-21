/* *
 *
 *  (c) 2009-2022 Øystein Moseng
 *
 *  Class representing a TimelineChannel with sonification events to play.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Point from '../../Core/Series/Point.js';
import type SonificationSpeaker from './SonificationSpeaker';
import SonificationInstrument from './SonificationInstrument.js';


declare global {
    namespace Sonification {
        interface TimelineEvent {
            time: number; // Time is given in seconds, where 0 is now.
            relatedPoint?: Point;
            instrumentEventOptions?: SonificationInstrument
                .ScheduledEventOptions;
            speechOptions?: Partial<Sonification.SpeakerOptions>;
            message?: string;
            callback?: Function;
        }
    }
}


/**
 * @private
 */
class TimelineChannel {
    events: Sonification.TimelineEvent[];
    muted?: boolean;

    constructor(
        public type: 'instrument'|'speech',
        public engine: SonificationInstrument|SonificationSpeaker,
        events?: Sonification.TimelineEvent[],
        muted?: boolean
    ) {
        this.muted = muted;
        this.events = events || [];
    }


    addEvent(event: Sonification.TimelineEvent): Sonification.TimelineEvent {
        const lastEvent = this.events[this.events.length - 1];
        if (lastEvent && event.time < lastEvent.time) {
            // Ensure we are sorted by time, so insert at the right place
            let i = this.events.length;
            while (--i && this.events[i].time > event.time) { /* */ }
            this.events.splice(i + 1, 0, event);
        } else {
            this.events.push(event);
        }
        return event;
    }


    mute(): void {
        this.muted = true;
    }


    unmute(): void {
        this.muted = false;
    }


    cancel(): void {
        this.engine.cancel();
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default TimelineChannel;
