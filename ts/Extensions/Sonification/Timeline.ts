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

import type SignalHandler from './SignalHandler';
import type TimelineEvent from './TimelineEvent';
import type TimelinePath from './TimelinePath';

import Sonification from './Sonification.js';
import U from '../../Core/Utilities.js';
const {
    merge,
    splat
} = U;

/**
 * Internal types.
 * @private
 */

import SU from './SonificationUtilities.js';

/* eslint-disable no-invalid-this, valid-jsdoc */

/* *
 *
 *  Class
 *
 * */

/**
 * The Timeline class. Represents a sonification timeline with a list of
 * timeline paths with events to play at certain times relative to each other.
 *
 * @requires module:modules/sonification
 *
 * @private
 * @class
 * @name Highcharts.Timeline
 *
 * @param {Highcharts.TimelineOptionsObject} options
 *        Options for the Timeline.
 */
class Timeline {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        options: Timeline.Options
    ) {
        this.init(options || {});
    }

    /* *
     *
     *  Properties
     *
     * */

    public cursor: number = void 0 as any;
    public options: Timeline.Options = void 0 as any;
    public paths: Array<(TimelinePath|Array<TimelinePath>)> = void 0 as any;
    public pathsPlaying: Record<string, TimelinePath> = void 0 as any;
    public signalHandler: SignalHandler = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    public init(
        this: Timeline,
        options: Timeline.Options
    ): void {
        this.options = options;
        this.cursor = 0;
        this.paths = options.paths || [];
        this.pathsPlaying = {};
        this.signalHandler = new SU.SignalHandler(
            ['playOnEnd', 'masterOnEnd', 'onPathStart', 'onPathEnd']
        );
        this.signalHandler.registerSignalCallbacks(
            merge(options as any, { masterOnEnd: options.onEnd })
        );
    }

    /**
     * Play the timeline forwards from cursor.
     * @private
     * @param {Function} [onEnd]
     * Callback to call when play finished. Does not override other onEnd
     * callbacks.
     */
    public play(
        this: Timeline,
        onEnd?: Function
    ): void {
        this.pause();
        this.signalHandler.clearSignalCallbacks(['playOnEnd']);
        this.signalHandler.registerSignalCallbacks({ playOnEnd: onEnd });
        this.playPaths(1);
    }

    /**
     * Play the timeline backwards from cursor.
     * @private
     * @param {Function} onEnd
     * Callback to call when play finished. Does not override other onEnd
     * callbacks.
     */
    public rewind(onEnd: Function): void {
        this.pause();
        this.signalHandler.clearSignalCallbacks(['playOnEnd']);
        this.signalHandler.registerSignalCallbacks({ playOnEnd: onEnd });
        this.playPaths(-1);
    }

    /**
     * Play the timeline in the specified direction.
     * @private
     * @param {number} direction
     * Direction to play in. 1 for forwards, -1 for backwards.
     */
    public playPaths(
        this: Timeline,
        direction: number
    ): void {
        const timeline = this,
            signalHandler = timeline.signalHandler;

        if (!timeline.paths.length) {
            const emptySignal: Timeline.SignalData = {
                cancelled: false
            };
            signalHandler.emitSignal('playOnEnd', emptySignal);
            signalHandler.emitSignal('masterOnEnd', emptySignal);
            return;
        }

        const curPaths: Array<TimelinePath> =
                splat(this.paths[this.cursor]),
            nextPaths = this.paths[this.cursor + direction],
            // Play a path
            playPath = function (path: TimelinePath): void {
                // Emit signal and set playing state
                signalHandler.emitSignal('onPathStart', path);
                timeline.pathsPlaying[path.id] = path;
                // Do the play
                path[direction > 0 ? 'play' : 'rewind'](function (
                    callbackData?: Timeline.SignalData
                ): void {
                    // Play ended callback
                    // Data to pass to signal callbacks
                    const cancelled = callbackData && callbackData.cancelled,
                        signalData: Timeline.SignalData = {
                            path: path,
                            cancelled: cancelled
                        };

                    // Clear state and send signal
                    delete timeline.pathsPlaying[path.id];
                    signalHandler.emitSignal('onPathEnd', signalData);

                    // Handle next paths
                    let pathsEnded = 0;
                    pathsEnded++;
                    if (pathsEnded >= curPaths.length) {
                        // We finished all of the current paths for cursor.
                        if (nextPaths && !cancelled) {
                            // We have more paths, move cursor along
                            timeline.cursor += direction;
                            // Reset upcoming path cursors before playing
                            splat(nextPaths).forEach(function (
                                nextPath: TimelinePath
                            ): void {
                                nextPath[
                                    direction > 0 ?
                                        'resetCursor' : 'resetCursorEnd'
                                ]();
                            });
                            // Play next
                            timeline.playPaths(direction);
                        } else {
                            // If it is the last path in this direction,
                            // call onEnd
                            signalHandler.emitSignal('playOnEnd', signalData);
                            signalHandler.emitSignal('masterOnEnd', signalData);
                        }
                    }
                });
            };

        // Go through the paths under cursor and play them
        curPaths.forEach(function (path: TimelinePath): void {
            if (path) {
                // Store reference to timeline
                path.timeline = timeline;

                // Leave a timeout to let notes fade out before next play
                setTimeout(function (): void {
                    playPath(path);
                }, Sonification.fadeOutDuration);
            }
        });
    }

    /**
     * Stop the playing of the timeline. Cancels all current sounds, but does
     * not affect the cursor.
     * @private
     * @param {boolean} [fadeOut=false]
     * Whether or not to fade out as we stop. If false, the timeline is
     * cancelled synchronously.
     */
    public pause(
        this: Timeline,
        fadeOut?: boolean
    ): void {
        const timeline = this;

        // Cancel currently playing events
        Object.keys(timeline.pathsPlaying).forEach(function (id: string): void {
            if (timeline.pathsPlaying[id]) {
                timeline.pathsPlaying[id].pause(fadeOut);
            }
        });
        timeline.pathsPlaying = {};
    }

    /**
     * Reset the cursor to the beginning of the timeline.
     * @private
     */
    public resetCursor(this: Timeline): void {
        this.paths.forEach(function (
            paths: (TimelinePath|Array<TimelinePath>)
        ): void {
            splat(paths).forEach(function (path: TimelinePath): void {
                path.resetCursor();
            });
        });
        this.cursor = 0;
    }

    /**
     * Reset the cursor to the end of the timeline.
     * @private
     */
    public resetCursorEnd(this: Timeline): void {
        this.paths.forEach(function (
            paths: (TimelinePath|Array<TimelinePath>)
        ): void {
            splat(paths).forEach(function (path: TimelinePath): void {
                path.resetCursorEnd();
            });
        });
        this.cursor = this.paths.length - 1;
    }

    /**
     * Set the current TimelineEvent under the cursor. If multiple paths are
     * being played at the same time, this function only affects a single path
     * (the one that contains the eventId that is passed in).
     * @private
     * @param {string} eventId
     * The ID of the timeline event to set as current.
     * @return {boolean}
     * True if the cursor was set, false if no TimelineEvent was found for
     * this ID.
     */
    public setCursor(
        this: Timeline,
        eventId: string
    ): boolean {
        return this.paths.some(function (
            paths: (TimelinePath|Array<TimelinePath>)
        ): boolean {
            return splat(paths).some(function (
                path: TimelinePath
            ): boolean {
                return path.setCursor(eventId);
            });
        });
    }

    /**
     * Get the current TimelineEvents under the cursors. This function will
     * return the event under the cursor for each currently playing path, as an
     * object where the path ID is mapped to the TimelineEvent under that
     * path's cursor.
     * @private
     * @return {Highcharts.Dictionary<Highcharts.TimelineEvent>}
     * The TimelineEvents under each path's cursors.
     */
    public getCursor(
        this: Timeline
    ): Record<string, TimelineEvent> {
        return this.getCurrentPlayingPaths().reduce(function (
            acc: Record<string, TimelineEvent>,
            cur: TimelinePath
        ): Record<string, TimelineEvent> {
            acc[cur.id] = cur.getCursor();
            return acc;
        }, {});
    }

    /**
     * Check if timeline is reset or at start.
     * @private
     * @return {boolean}
     * True if timeline is at the beginning.
     */
    public atStart(this: Timeline): boolean {
        if (this.cursor) {
            return false;
        }
        return !splat(this.paths[0]).some(function (
            path: TimelinePath
        ): number {
            return path.cursor;
        });
    }

    /**
     * Get the current TimelinePaths being played.
     * @private
     * @return {Array<Highcharts.TimelinePath>}
     * The TimelinePaths currently being played.
     */
    public getCurrentPlayingPaths(
        this: Timeline
    ): Array<TimelinePath> {
        if (!this.paths.length) {
            return [];
        }
        return splat(this.paths[this.cursor]);
    }
}

/* *
 *
 *  Class namespace
 *
 * */

namespace Timeline {
    export interface SignalData {
        event?: TimelineEvent;
        cancelled?: boolean;
        path?: TimelinePath;
    }
    export interface Classes{
        Timeline: typeof Timeline;
        TimelineEvent: typeof TimelineEvent;
        TimelinePath: typeof TimelinePath;
    }
    export interface Options {
        onEnd?: Function;
        onPathEnd?: Function;
        onPathStart?: Function;
        paths: Array<(TimelinePath|Array<TimelinePath>)>;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default Timeline;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * A set of options for the Timeline class.
 *
 * @requires module:modules/sonification
 *
 * @private
 * @interface Highcharts.TimelineOptionsObject
 *//**
 * List of TimelinePaths to play. Multiple paths can be grouped together and
 * played simultaneously by supplying an array of paths in place of a single
 * path.
 * @name Highcharts.TimelineOptionsObject#paths
 * @type {Array<(Highcharts.TimelinePath|Array<Highcharts.TimelinePath>)>}
 *//**
 * Callback function to call before a path plays.
 * @name Highcharts.TimelineOptionsObject#onPathStart
 * @type {Function|undefined}
 *//**
 * Callback function to call after a path has stopped playing.
 * @name Highcharts.TimelineOptionsObject#onPathEnd
 * @type {Function|undefined}
 *//**
 * Callback called when the whole path is finished.
 * @name Highcharts.TimelineOptionsObject#onEnd
 * @type {Function|undefined}
 */
(''); // detach doclets above
