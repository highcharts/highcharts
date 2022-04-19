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
import TimelineEvent from './TimelineEvent.js';
import SU from './SonificationUtilities.js';
import U from '../../Core/Utilities.js';
var merge = U.merge, uniqueKey = U.uniqueKey;
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
var TimelinePath = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    function TimelinePath(options) {
        /* *
        *
        *  Properties
        *
        * */
        this.cursor = void 0;
        this.events = void 0;
        this.eventIdMap = void 0;
        this.eventsPlaying = void 0;
        this.id = void 0;
        this.options = void 0;
        this.signalHandler = void 0;
        this.init(options);
    }
    /* *
     *
     *  Functions
     *
     * */
    TimelinePath.prototype.init = function (options) {
        this.options = options;
        this.id = this.options.id = options.id || uniqueKey();
        this.cursor = 0;
        this.eventsPlaying = {};
        // Handle silent wait, otherwise use events from options
        this.events = options.silentWait ?
            [
                new TimelineEvent({ time: 0 }),
                new TimelineEvent({ time: options.silentWait })
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
        this.signalHandler.registerSignalCallbacks(merge(options, { masterOnEnd: options.onEnd }));
    };
    /**
     * Sort the internal event list by time.
     * @private
     */
    TimelinePath.prototype.sortEvents = function () {
        this.events = this.events.sort(function (a, b) {
            return a.time - b.time;
        });
    };
    /**
     * Update the internal eventId to index map.
     * @private
     */
    TimelinePath.prototype.updateEventIdMap = function () {
        this.eventIdMap = this.events.reduce(function (acc, cur, i) {
            acc[cur.id] = i;
            return acc;
        }, {});
    };
    /**
     * Add events to the path. Should not be done while the path is playing.
     * The new events are inserted according to their time property.
     * @private
     * @param {Array<Highcharts.TimelineEvent>} newEvents
     * The new timeline events to add.
     */
    TimelinePath.prototype.addTimelineEvents = function (newEvents) {
        this.events = this.events.concat(newEvents);
        this.sortEvents(); // Sort events by time
        this.updateEventIdMap(); // Update the event ID to index map
    };
    /**
     * Get the current TimelineEvent under the cursor.
     * @private
     * @return {Highcharts.TimelineEvent} The current timeline event.
     */
    TimelinePath.prototype.getCursor = function () {
        return this.events[this.cursor];
    };
    /**
     * Set the current TimelineEvent under the cursor.
     * @private
     * @param {string} eventId
     * The ID of the timeline event to set as current.
     * @return {boolean}
     * True if there is an event with this ID in the path. False otherwise.
     */
    TimelinePath.prototype.setCursor = function (eventId) {
        var ix = this.eventIdMap[eventId];
        if (typeof ix !== 'undefined') {
            this.cursor = ix;
            return true;
        }
        return false;
    };
    /**
     * Play the timeline from the current cursor.
     * @private
     * @param {Function} onEnd
     * Callback to call when play finished. Does not override other onEnd
     * callbacks.
     */
    TimelinePath.prototype.play = function (onEnd) {
        this.pause();
        this.signalHandler.emitSignal('onStart');
        this.signalHandler.clearSignalCallbacks(['playOnEnd']);
        this.signalHandler.registerSignalCallbacks({ playOnEnd: onEnd });
        this.playEvents(1);
    };
    /**
     * Play the timeline backwards from the current cursor.
     * @private
     * @param {Function} onEnd
     * Callback to call when play finished. Does not override other onEnd
     * callbacks.
     */
    TimelinePath.prototype.rewind = function (onEnd) {
        this.pause();
        this.signalHandler.emitSignal('onStart');
        this.signalHandler.clearSignalCallbacks(['playOnEnd']);
        this.signalHandler.registerSignalCallbacks({ playOnEnd: onEnd });
        this.playEvents(-1);
    };
    /**
     * Reset the cursor to the beginning.
     * @private
     */
    TimelinePath.prototype.resetCursor = function () {
        this.cursor = 0;
    };
    /**
     * Reset the cursor to the end.
     * @private
     */
    TimelinePath.prototype.resetCursorEnd = function () {
        this.cursor = this.events.length - 1;
    };
    /**
     * Cancel current playing. Leaves the cursor intact.
     * @private
     * @param {boolean} [fadeOut=false]
     * Whether or not to fade out as we stop. If false, the path is cancelled
     * synchronously.
     */
    TimelinePath.prototype.pause = function (fadeOut) {
        var timelinePath = this;
        // Cancel next scheduled play
        clearTimeout(timelinePath.nextScheduledPlay);
        // Cancel currently playing events
        Object.keys(timelinePath.eventsPlaying).forEach(function (id) {
            if (timelinePath.eventsPlaying[id]) {
                timelinePath.eventsPlaying[id].cancel(fadeOut);
            }
        });
        timelinePath.eventsPlaying = {};
    };
    /**
     * Play the events, starting from current cursor, and going in specified
     * direction.
     * @private
     * @param {number} direction
     * The direction to play, 1 for forwards and -1 for backwards.
     */
    TimelinePath.prototype.playEvents = function (direction) {
        var timelinePath = this, curEvent = timelinePath.events[this.cursor], nextEvent = timelinePath.events[this.cursor + direction], onEnd = function (signalData) {
            timelinePath.signalHandler.emitSignal('masterOnEnd', signalData);
            timelinePath.signalHandler.emitSignal('playOnEnd', signalData);
        };
        var timeDiff;
        // Store reference to path on event
        curEvent.timelinePath = timelinePath;
        // Emit event, cancel if returns false
        if (timelinePath.signalHandler.emitSignal('onEventStart', curEvent) === false) {
            onEnd({
                event: curEvent,
                cancelled: true
            });
            return;
        }
        // Play the current event
        timelinePath.eventsPlaying[curEvent.id] = curEvent;
        curEvent.play({
            onEnd: function (cancelled) {
                var signalData = {
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
            }
            else {
                // Schedule after the difference in ms
                this.nextScheduledPlay = setTimeout(function () {
                    timelinePath.cursor += direction;
                    timelinePath.playEvents(direction);
                }, timeDiff);
            }
        }
    };
    return TimelinePath;
}());
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
 */ /**
* List of TimelineEvents to play on this track.
* @name Highcharts.TimelinePathOptionsObject#events
* @type {Array<Highcharts.TimelineEvent>}
*/ /**
* If this option is supplied, this path ignores all events and just waits for
* the specified number of milliseconds before calling onEnd.
* @name Highcharts.TimelinePathOptionsObject#silentWait
* @type {number|undefined}
*/ /**
* Unique ID for this timeline path. Automatically generated if not supplied.
* @name Highcharts.TimelinePathOptionsObject#id
* @type {string|undefined}
*/ /**
* Callback called before the path starts playing.
* @name Highcharts.TimelinePathOptionsObject#onStart
* @type {Function|undefined}
*/ /**
* Callback function to call before an event plays.
* @name Highcharts.TimelinePathOptionsObject#onEventStart
* @type {Function|undefined}
*/ /**
* Callback function to call after an event has stopped playing.
* @name Highcharts.TimelinePathOptionsObject#onEventEnd
* @type {Function|undefined}
*/ /**
* Callback called when the whole path is finished.
* @name Highcharts.TimelinePathOptionsObject#onEnd
* @type {Function|undefined}
*/
(''); // detach doclets above
