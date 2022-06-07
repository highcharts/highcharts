/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  TimelineEvent class definition.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Timeline from './Timeline';
import type SignalHandler from './SignalHandler';

import TimelineEvent from './TimelineEvent.js';
import SU from './SonificationUtilities.js';
import U from '../../Core/Utilities.js';
const {
    merge,
    uniqueKey
} = U;

/* *
 *
 *  Class
 *
 * */

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * The TimelinePath class. Represents a track on a timeline with a list of
 * sound events to play at certain times relative to each other.
 *
 * @requires module:modules/sonification
 *
 * @private
 * @class
 * @name Highcharts.TimelinePath
 *
 * @param {Highcharts.TimelinePathOptionsObject} options
 *        Options for the TimelinePath.
 */
class TimelinePath {

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(
        options: TimelinePath.Options
    ) {
        this.init(options);
    }

    /* *
    *
    *  Properties
    *
    * */

    public cursor: number = void 0 as any;
    public events: Array<TimelineEvent> = void 0 as any;
    public eventIdMap: Record<string, (number|undefined)> = void 0 as any;
    public eventsPlaying: Record<string, TimelineEvent> = void 0 as any;
    public id: string = void 0 as any;
    public nextScheduledPlay?: number;
    public options: TimelinePath.Options = void 0 as any;
    public signalHandler: SignalHandler = void 0 as any;
    public targetDuration?: number;
    public timeline: (Timeline|undefined);

    /* *
     *
     *  Functions
     *
     * */

    public init(
        options: TimelinePath.Options
    ): void {
        this.options = options;
        this.id = this.options.id = options.id || uniqueKey();
        this.cursor = 0;
        this.eventsPlaying = {};

        // Handle silent wait, otherwise use events from options
        this.events = options.silentWait ?
            [
                new (TimelineEvent as any)({ time: 0 }),
                new (TimelineEvent as any)({ time: options.silentWait })
            ] :
            this.options.events;

        // Reference optionally provided by the user that indicates the intended
        // duration of the path. Unused by TimelinePath itself.
        this.targetDuration = options.targetDuration || options.silentWait;

        // We need to sort our events by time
        this.sortEvents();

        // Get map from event ID to index
        this.updateEventIdMap();

        // Signal events to fire
        this.signalHandler = new SU.SignalHandler([
            'playOnEnd', 'masterOnEnd', 'onStart', 'onEventStart', 'onEventEnd'
        ]);
        this.signalHandler.registerSignalCallbacks(
            merge(options as any, { masterOnEnd: options.onEnd })
        );
    }

    /**
     * Sort the internal event list by time.
     * @private
     */
    public sortEvents(
        this: TimelinePath
    ): void {
        this.events = this.events.sort(function (
            a: TimelineEvent,
            b: TimelineEvent
        ): number {
            return a.time - b.time;
        });
    }

    /**
     * Update the internal eventId to index map.
     * @private
     */
    public updateEventIdMap(
        this: TimelinePath
    ): void {
        this.eventIdMap = this.events.reduce(function (
            acc: Record<string, number>,
            cur: TimelineEvent,
            i: number
        ): Record<string, number> {
            acc[cur.id] = i;
            return acc;
        }, {});
    }

    /**
     * Add events to the path. Should not be done while the path is playing.
     * The new events are inserted according to their time property.
     * @private
     * @param {Array<Highcharts.TimelineEvent>} newEvents
     * The new timeline events to add.
     */
    public addTimelineEvents(
        newEvents: Array<TimelineEvent>
    ): void {
        this.events = this.events.concat(newEvents);
        this.sortEvents(); // Sort events by time
        this.updateEventIdMap(); // Update the event ID to index map
    }

    /**
     * Get the current TimelineEvent under the cursor.
     * @private
     * @return {Highcharts.TimelineEvent} The current timeline event.
     */
    public getCursor(
        this: TimelinePath
    ): TimelineEvent {
        return this.events[this.cursor];
    }

    /**
     * Set the current TimelineEvent under the cursor.
     * @private
     * @param {string} eventId
     * The ID of the timeline event to set as current.
     * @return {boolean}
     * True if there is an event with this ID in the path. False otherwise.
     */
    public setCursor(
        eventId: string
    ): boolean {
        const ix = this.eventIdMap[eventId];

        if (typeof ix !== 'undefined') {
            this.cursor = ix;
            return true;
        }
        return false;
    }

    /**
     * Play the timeline from the current cursor.
     * @private
     * @param {Function} onEnd
     * Callback to call when play finished. Does not override other onEnd
     * callbacks.
     */
    public play(onEnd: Function): void {
        this.pause();
        this.signalHandler.emitSignal('onStart');
        this.signalHandler.clearSignalCallbacks(['playOnEnd']);
        this.signalHandler.registerSignalCallbacks({ playOnEnd: onEnd });
        this.playEvents(1);
    }

    /**
     * Play the timeline backwards from the current cursor.
     * @private
     * @param {Function} onEnd
     * Callback to call when play finished. Does not override other onEnd
     * callbacks.
     */
    public rewind(onEnd: Function): void {
        this.pause();
        this.signalHandler.emitSignal('onStart');
        this.signalHandler.clearSignalCallbacks(['playOnEnd']);
        this.signalHandler.registerSignalCallbacks({ playOnEnd: onEnd });
        this.playEvents(-1);
    }

    /**
     * Reset the cursor to the beginning.
     * @private
     */
    public resetCursor(
        this: TimelinePath
    ): void {
        this.cursor = 0;
    }

    /**
     * Reset the cursor to the end.
     * @private
     */
    public resetCursorEnd(
        this: TimelinePath
    ): void {
        this.cursor = this.events.length - 1;
    }

    /**
     * Cancel current playing. Leaves the cursor intact.
     * @private
     * @param {boolean} [fadeOut=false]
     * Whether or not to fade out as we stop. If false, the path is cancelled
     * synchronously.
     */
    public pause(
        fadeOut?: boolean
    ): void {
        const timelinePath = this;

        // Cancel next scheduled play
        clearTimeout(timelinePath.nextScheduledPlay);

        // Cancel currently playing events
        Object.keys(timelinePath.eventsPlaying).forEach(function (
            id: string
        ): void {
            if (timelinePath.eventsPlaying[id]) {
                timelinePath.eventsPlaying[id].cancel(fadeOut);
            }
        });
        timelinePath.eventsPlaying = {};
    }

    /**
     * Play the events, starting from current cursor, and going in specified
     * direction.
     * @private
     * @param {number} direction
     * The direction to play, 1 for forwards and -1 for backwards.
     */
    public playEvents(
        direction: number
    ): void {
        const timelinePath = this,
            curEvent = timelinePath.events[this.cursor],
            nextEvent = timelinePath.events[this.cursor + direction],
            onEnd = function (signalData: Timeline.SignalData): void {
                timelinePath.signalHandler.emitSignal(
                    'masterOnEnd', signalData
                );
                timelinePath.signalHandler.emitSignal(
                    'playOnEnd', signalData
                );
            };
        let timeDiff: (number|undefined);

        // Store reference to path on event
        curEvent.timelinePath = timelinePath;

        // Emit event, cancel if returns false
        if (
            timelinePath.signalHandler.emitSignal(
                'onEventStart', curEvent
            ) === false
        ) {
            onEnd({
                event: curEvent,
                cancelled: true
            });
            return;
        }

        // Play the current event
        timelinePath.eventsPlaying[curEvent.id] = curEvent;
        curEvent.play({
            onEnd: function (cancelled?: boolean): void {
                const signalData: Timeline.SignalData = {
                    event: curEvent,
                    cancelled: !!cancelled
                };

                // Keep track of currently playing events for cancelling
                delete timelinePath.eventsPlaying[curEvent.id];

                // Handle onEventEnd
                timelinePath.signalHandler.emitSignal('onEventEnd', signalData);

                // Reached end of path?
                if (!nextEvent) {
                    onEnd(signalData);
                }
            }
        });

        // Schedule next
        if (nextEvent) {
            timeDiff = Math.abs(nextEvent.time - curEvent.time);
            if (timeDiff < 1) {
                // Play immediately
                timelinePath.cursor += direction;
                timelinePath.playEvents(direction);
            } else {
                // Schedule after the difference in ms
                this.nextScheduledPlay = setTimeout(function (): void {
                    timelinePath.cursor += direction;
                    timelinePath.playEvents(direction);
                }, timeDiff);
            }
        }
    }
}

/* *
 *
 *  Class namespace
 *
 * */

namespace TimelinePath {
    export interface Options {
        events: Array<TimelineEvent>;
        id?: string;
        onEnd?: Function;
        onEventEnd?: Function;
        onEventStart?: Function;
        onStart?: Function;
        silentWait?: number;
        targetDuration?: number;
    }
}

/* *
 *
 *  Default export
 *
 * */

export default TimelinePath;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * A set of options for the TimelinePath class.
 *
 * @requires module:modules/
 *
 * @private
 * @interface Highcharts.TimelinePathOptionsObject
 *//**
 * List of TimelineEvents to play on this track.
 * @name Highcharts.TimelinePathOptionsObject#events
 * @type {Array<Highcharts.TimelineEvent>}
 *//**
 * If this option is supplied, this path ignores all events and just waits for
 * the specified number of milliseconds before calling onEnd.
 * @name Highcharts.TimelinePathOptionsObject#silentWait
 * @type {number|undefined}
 *//**
 * Unique ID for this timeline path. Automatically generated if not supplied.
 * @name Highcharts.TimelinePathOptionsObject#id
 * @type {string|undefined}
 *//**
 * Callback called before the path starts playing.
 * @name Highcharts.TimelinePathOptionsObject#onStart
 * @type {Function|undefined}
 *//**
 * Callback function to call before an event plays.
 * @name Highcharts.TimelinePathOptionsObject#onEventStart
 * @type {Function|undefined}
 *//**
 * Callback function to call after an event has stopped playing.
 * @name Highcharts.TimelinePathOptionsObject#onEventEnd
 * @type {Function|undefined}
 *//**
 * Callback called when the whole path is finished.
 * @name Highcharts.TimelinePathOptionsObject#onEnd
 * @type {Function|undefined}
 */
(''); // detach doclets above
