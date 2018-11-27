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
    this.init(options);
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
        playOptions = H.merge(this.options.playOptions, {
            onEnd: this.options.onEnd
        }, options);

    eventObject.sonify(playOptions);
};


/**
 * Cancel the sonification of this event. Does nothing if the event is not
 * currently sonifying.
 */
TimelineEvent.prototype.cancel = function () {
    this.options.eventObject.cancelSonify();
};


var timelineClasses = {
    TimelineEvent: TimelineEvent
};
export default timelineClasses;
