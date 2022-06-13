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
            relatedPoints?: Point[];
            instrumentEventOptions?: SonificationInstrument
                .ScheduledEventOptions;
            speechOptions?: Sonification.SpeakerOptions;
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
        events?: Sonification.TimelineEvent[]
    ) {
        this.events = events || [];
    }


    addEvent(event: Sonification.TimelineEvent): void {
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
