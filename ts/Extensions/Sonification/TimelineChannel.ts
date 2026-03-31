/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *  Author: Øystein Moseng
 *
 *  Class representing a TimelineChannel with sonification events to play.
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

import type Point from '../../Core/Series/Point.js';
import type SonificationSpeaker from './SonificationSpeaker';
import SonificationInstrument from './SonificationInstrument.js';


declare global {
    namespace Sonification {
        /**
         * A TimelineEvent object represents a scheduled audio event to play for
         * a SonificationTimeline.
         * @requires modules/sonification
         * @interface Highcharts.SonificationTimelineEvent
         */
        interface TimelineEvent {
            /**
             * Time is given in milliseconds, where 0 is now.
             * @name Highcharts.SonificationTimelineEvent#time
             * @type {number}
             */
            time: number;
            /**
             * A reference to a data point related to the TimelineEvent.
             * Populated when sonifying points.
             * @name Highcharts.SonificationTimelineEvent#relatedPoint
             * @type {Highcharts.Point|undefined}
             */
            relatedPoint?: Point;
            /**
             * Options for an instrument event to be played.
             * @name Highcharts.SonificationTimelineEvent#instrumentEventOptions
             * @type {Highcharts.SonificationInstrumentScheduledEventOptionsObject|undefined}
             */
            instrumentEventOptions?: SonificationInstrument
                .ScheduledEventOptions;
            /**
             * Options for a speech event to be played.
             * @name Highcharts.SonificationTimelineEvent#speechOptions
             * @type {Highcharts.SonificationSpeakerOptionsObject|undefined}
             */
            speechOptions?: SonificationSpeaker.SpeakerOptions;
            /**
             * The message to speak for speech events.
             * @name Highcharts.SonificationTimelineEvent#message
             * @type {string|undefined}
             */
            message?: string;
            /**
             * Callback to call when playing the event.
             * @name Highcharts.SonificationTimelineEvent#callback
             * @type {Function|undefined}
             */
            callback?: Function;
        }
    }
}


/**
 * Represents a channel of TimelineEvents for an engine (either an instrument
 * or a speaker).
 * @internal
 */
class TimelineChannel {
    events: Sonification.TimelineEvent[];
    muted?: boolean;

    constructor(
        public type: 'instrument'|'speech',
        public engine: SonificationInstrument|SonificationSpeaker,
        public showPlayMarker = false,
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
            while (i-- && this.events[i].time > event.time) { /* */ }
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


    destroy(): void {
        this.engine.destroy();
    }
}


/* *
 *
 *  Default Export
 *
 * */

/**
 * @internal
 */
export default TimelineChannel;


/* *
 *
 *  API declarations
 *
 * */

/**
 * A TimelineEvent object represents a scheduled audio event to play for a
 * SonificationTimeline.
 * @requires modules/sonification
 * @interface Highcharts.SonificationTimelineEvent
 *//**
 * Time is given in milliseconds, where 0 is now.
 * @name Highcharts.SonificationTimelineEvent#time
 * @type {number}
 *//**
 * A reference to a data point related to the TimelineEvent. Populated when
 * sonifying points.
 * @name Highcharts.SonificationTimelineEvent#relatedPoint
 * @type {Highcharts.Point|undefined}
 *//**
 * Options for an instrument event to be played.
 * @name Highcharts.SonificationTimelineEvent#instrumentEventOptions
 * @type {Highcharts.SonificationInstrumentScheduledEventOptionsObject|undefined}
 *//**
 * Options for a speech event to be played.
 * @name Highcharts.SonificationTimelineEvent#speechOptions
 * @type {Highcharts.SonificationSpeakerOptionsObject|undefined}
 *//**
 * The message to speak for speech events.
 * @name Highcharts.SonificationTimelineEvent#message
 * @type {string|undefined}
 *//**
 * Callback to call when playing the event.
 * @name Highcharts.SonificationTimelineEvent#callback
 * @type {Function|undefined}
 */

(''); // Keep above doclets in JS file
