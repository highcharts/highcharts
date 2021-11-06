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

import type Earcon from './Earcon';
import type PointSonify from './PointSonify';
import type TimelinePath from './TimelinePath';

import U from '../../Core/Utilities.js';
const {
    merge,
    uniqueKey
} = U;

/* eslint-disable no-invalid-this, valid-jsdoc */

/* *
 *
 *  Class
 *
 * */

/**
 * The TimelineEvent class. Represents a sound event on a timeline.
 *
 * @requires module:modules/sonification
 *
 * @private
 * @class
 * @name Highcharts.TimelineEvent
 *
 * @param {Highcharts.TimelineEventOptionsObject} options
 * Options for the TimelineEvent.
 */
class TimelineEvent {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        options: TimelineEvent.Options
    ) {
        this.init(options);
    }

    /* *
     *
     *  Properties
     *
     * */

    public id: string = void 0 as any;
    public options: TimelineEvent.Options = void 0 as any;
    public time: number = void 0 as any;
    public timelinePath: (TimelinePath|undefined);

    /* *
     *
     *  Functions
     *
     * */

    public init(
        this: TimelineEvent,
        options: TimelineEvent.Options
    ): void {
        this.options = options;
        this.time = options.time || 0;
        this.id = this.options.id = options.id || uniqueKey();
    }

    /**
     * Play the event. Does not take the TimelineEvent.time option into account,
     * and plays the event immediately.
     *
     * @function Highcharts.TimelineEvent#play
     *
     * @param {Highcharts.TimelineEventOptionsObject} [options]
     *        Options to pass in to the eventObject when playing it.
     *
     */
    public play(
        this: TimelineEvent,
        options?: TimelineEvent.Options
    ): void {
        const eventObject = this.options.eventObject,
            masterOnEnd = this.options.onEnd,
            playOnEnd = options && options.onEnd,
            playOptionsOnEnd = this.options.playOptions &&
                this.options.playOptions.onEnd,
            playOptions = merge(this.options.playOptions, options);

        if (eventObject && eventObject.sonify) {
            // If we have multiple onEnds defined, use all
            playOptions.onEnd = masterOnEnd || playOnEnd || playOptionsOnEnd ?
                function (): void {
                    const args = arguments;

                    [masterOnEnd, playOnEnd, playOptionsOnEnd].forEach(
                        function (onEnd: (Function|undefined)): void {
                            if (onEnd) {
                                onEnd.apply(this, args);
                            }
                        }
                    );
                } : void 0;

            eventObject.sonify(playOptions);
        } else {
            if (playOnEnd) {
                playOnEnd();
            }
            if (masterOnEnd) {
                masterOnEnd();
            }
        }
    }

    /**
     * Cancel the sonification of this event. Does nothing if the event is not
     * currently sonifying.
     *
     * @function Highcharts.TimelineEvent#cancel
     *
     * @param {boolean} [fadeOut=false]
     *        Whether or not to fade out as we stop. If false, the event is
     *        cancelled synchronously.
     */
    public cancel(fadeOut?: boolean): void {
        const eventObject = this.options.eventObject;

        if (eventObject) {
            eventObject.cancelSonify(fadeOut);
        }
    }

}

/* *
 *
 *  Class namespace
 *
 * */

namespace TimelineEvent {
    export interface EventObject {
        cancelSonify: Function;
        sonify: Function;
    }
    export interface Options {
        eventObject?: EventObject;
        id?: string;
        onEnd?: Function;
        playOptions?: PointSonify.Options|Partial<Earcon.Options>;
        time?: number;
    }
}

/* *
 *
 *  Default export
 *
 * */

export default TimelineEvent;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * A set of options for the TimelineEvent class.
 *
 * @requires module:modules/sonification
 *
 * @private
 * @interface Highcharts.TimelineEventOptionsObject
 *//**
 * The object we want to sonify when playing the TimelineEvent. Can be any
 * object that implements the `sonify` and `cancelSonify` functions. If this is
 * not supplied, the TimelineEvent is considered a silent event, and the onEnd
 * event is immediately called.
 * @name Highcharts.TimelineEventOptionsObject#eventObject
 * @type {*}
 *//**
 * Options to pass on to the eventObject when playing it.
 * @name Highcharts.TimelineEventOptionsObject#playOptions
 * @type {object|undefined}
 *//**
 * The time at which we want this event to play (in milliseconds offset). This
 * is not used for the TimelineEvent.play function, but rather intended as a
 * property to decide when to call TimelineEvent.play. Defaults to 0.
 * @name Highcharts.TimelineEventOptionsObject#time
 * @type {number|undefined}
 *//**
 * Unique ID for the event. Generated automatically if not supplied.
 * @name Highcharts.TimelineEventOptionsObject#id
 * @type {string|undefined}
 *//**
 * Callback called when the play has finished.
 * @name Highcharts.TimelineEventOptionsObject#onEnd
 * @type {Function|undefined}
 */
(''); // detach doclets above
