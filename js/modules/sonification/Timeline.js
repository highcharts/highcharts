/**
 * (c) 2009-2018 Øystein Moseng
 *
 * TimelineEvent class definition.
 *
 * License: www.highcharts.com/license
 */

'use strict';

import H from '../../parts/Globals.js';

/**
 * The TimelineEvent class. Represents a sound event on a timeline.
 *
 * @private
 * @class TimelineEvent
 *
 * @param   {Object} options
 *          Options for the TimelineEvent.
 *
 * @param   {*} options.eventObject
 *          The object we want to sonify when playing the TimelineEvent. Can be
 *          any object that implements the `sonify` and `cancelSonify`
 *          functions.
 *
 * @param   {number} options.time
 *          The time at which we want this event to play (in milliseconds offset
 *          from current time). This is not used for the TimelineEvent.play
 *          function, but rather intended as a property to decide when to call
 *          TimelineEvent.play.
 *
 * @param   {String} [options.id]
 *          Unique ID for the event. Generated automatically if not supplied.
 *
 * @param   {Function} [options.onEnd]
 *          Callback called when the play has finished.
 *
 * @param   {Object} [options.playOptions]
 *          Options to pass on to the eventObject when playing it.
 */
function TimelineEvent(options) {
    this.init(options || {});
}
TimelineEvent.prototype.init = function (options) {
    this.options = options;
    this.time = options.time;
    this.id = this.options.id = options.id || H.uniqueKey();
};


/**
 * Play the event. Does not take the TimelineEvent.time option into account,
 * and plays the event immediately.
 *
 * @param   {Object} [options]
 *          Options to pass in to the eventObject when playing it.
 */
TimelineEvent.prototype.play = function (options) {
    var eventObject = this.options.eventObject,
        oldOnEnd = this.options.onEnd || this.options.playOptions &&
            this.options.playOptions.onEnd,
        playOptions = H.merge(this.options.playOptions, options);

    // If we have an onEnd defined both for the TimelineEvent and for the play,
    // use both.
    playOptions.onEnd = options && options.onEnd ? function () {
        options.onEnd.apply(this, arguments);
        if (oldOnEnd) {
            oldOnEnd.apply(this, arguments);
        }
    } : oldOnEnd;

    eventObject.sonify(playOptions);
};


/**
 * Cancel the sonification of this event. Does nothing if the event is not
 * currently sonifying.
 */
TimelineEvent.prototype.cancel = function () {
    this.options.eventObject.cancelSonify();
};


/**
 * The TimelinePath class. Represents a track on a timeline with a list of
 * sound events to play at certain times.
 *
 * @private
 * @class TimelinePath
 *
 * @param   {Object} options
 *          Options for the TimelinePath.
 *
 * @param   {Array<TimelineEvent>} options.events
 *          List of TimelineEvents to play on this track.
 *
 * @param   {String} [id]
 *          Unique ID for this timeline path. Automatically generated if not
 *          supplied.
 *
 * @param   {Function} [options.onEventStart]
 *          Callback function to call before an event plays.
 *
 * @param   {Function} [options.onEventEnd]
 *          Callback function to call after an event has stopped playing.
 *
 * @param   {Function} [options.onEnd]
 *          Callback called when the whole path is finished.
 */
function TimelinePath(options) {
    this.init(options);
}
TimelinePath.prototype.init = function (options) {
    this.options = options;
    this.id = this.options.id = options.id || H.uniqueKey();
    this.cursor = 0;
    this.eventsPlaying = {};

    // We need to sort our events by time
    this.events = this.options.events.sort(function (a, b) {
        return a.time - b.time;
    });

    // Get map from event ID to index
    this.eventIdMap = this.events.reduce(function (acc, cur, i) {
        acc[cur.id] = i;
        return acc;
    }, {});
};


/**
 * Get the current TimelineEvent under the cursor.
 * @return {TimelineEvent} The current timeline event.
 */
TimelinePath.prototype.getCursor = function () {
    return this.events[this.cursor];
};


/**
 * Set the current TimelineEvent under the cursor.
 *
 * @param   {String} eventId
 *          The ID of the timeline event to set as current.
 */
TimelinePath.prototype.setCursor = function (eventId) {
    this.cursor = this.eventIdMap[eventId];
};


/**
 * Play the timeline from the current cursor.
 */
TimelinePath.prototype.play = function () {
    this.playEvents(1);
};


/**
 * Play the timeline backwards from the current cursor.
 */
TimelinePath.prototype.rewind = function () {
    this.playEvents(-1);
};


/**
 * Reset the cursor to the beginning.
 */
TimelinePath.prototype.resetCursor = function () {
    this.cursor = 0;
};


/**
 * Reset the cursor to the end.
 */
TimelinePath.prototype.resetCursorEnd = function () {
    this.cursor = this.events.length - 1;
};


/**
 * Cancel current playing. Leaves the cursor intact.
 */
TimelinePath.prototype.pause = function () {
    var timelinePath = this;

    // Cancel next scheduled play
    clearTimeout(timelinePath.nextScheduledPlay);

    // Cancel currently playing events
    Object.keys(timelinePath.eventsPlaying).forEach(function (id) {
        timelinePath.eventsPlaying[id].cancel();
    });
    timelinePath.eventsPlaying = {};
};


/**
 * Play the events, starting from current cursor, and going in specified
 * direction.
 *
 * @private
 * @param   {number} direction The direction to play, 1 for forwards and -1 for
 *          backwards.
 */
TimelinePath.prototype.playEvents = function (direction) {
    var timelinePath = this,
        curEvent = timelinePath.events[this.cursor],
        nextEvent = timelinePath.events[this.cursor + direction],
        timeDiff;

    // Play the current event
    if (timelinePath.options.onEventStart) {
        timelinePath.options.onEventStart(curEvent);
    }
    timelinePath.eventsPlaying[curEvent.id] = curEvent;
    curEvent.play({
        onEnd: function () {
            // Keep track of currently playing events for cancelling
            delete timelinePath.eventsPlaying[curEvent.id];

            // Handle onEventEnd
            if (timelinePath.options.onEventEnd) {
                timelinePath.options.onEventEnd(curEvent);
            }

            // Reached end of path?
            var ix = timelinePath.eventIdMap[curEvent.id];
            if (
                (
                    ix >= timelinePath.events.length - 1 && direction > 0 ||
                    ix <= 0 && direction < 0
                ) &&
                timelinePath.options.onEnd
            ) {
                timelinePath.options.onEnd(curEvent);
            }
        }
    });

    // Schedule next
    if (nextEvent) {
        timelinePath.cursor += direction;
        timeDiff = Math.abs(nextEvent.time - curEvent.time);
        if (timeDiff < 1) {
            // Play immediately
            timelinePath.playEvents(direction);
        } else {
            // Schedule after the difference in ms
            this.nextScheduledPlay = setTimeout(function () {
                timelinePath.playEvents(direction);
            }, timeDiff);
        }
    }
};


var timelineClasses = {
    TimelineEvent: TimelineEvent,
    TimelinePath: TimelinePath
};
export default timelineClasses;
