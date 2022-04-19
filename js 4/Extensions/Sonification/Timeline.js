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
import Sonification from './Sonification.js';
import U from '../../Core/Utilities.js';
var merge = U.merge, splat = U.splat;
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
var Timeline = /** @class */ (function () {
    /* *
     *
     *  Constructor
     *
     * */
    function Timeline(options) {
        /* *
         *
         *  Properties
         *
         * */
        this.cursor = void 0;
        this.options = void 0;
        this.paths = void 0;
        this.pathsPlaying = void 0;
        this.signalHandler = void 0;
        this.init(options || {});
    }
    /* *
     *
     *  Functions
     *
     * */
    Timeline.prototype.init = function (options) {
        this.options = options;
        this.cursor = 0;
        this.paths = options.paths || [];
        this.pathsPlaying = {};
        this.signalHandler = new SU.SignalHandler(['playOnEnd', 'masterOnEnd', 'onPathStart', 'onPathEnd']);
        this.signalHandler.registerSignalCallbacks(merge(options, { masterOnEnd: options.onEnd }));
    };
    /**
     * Play the timeline forwards from cursor.
     * @private
     * @param {Function} [onEnd]
     * Callback to call when play finished. Does not override other onEnd
     * callbacks.
     */
    Timeline.prototype.play = function (onEnd) {
        this.pause();
        this.signalHandler.clearSignalCallbacks(['playOnEnd']);
        this.signalHandler.registerSignalCallbacks({ playOnEnd: onEnd });
        this.playPaths(1);
    };
    /**
     * Play the timeline backwards from cursor.
     * @private
     * @param {Function} onEnd
     * Callback to call when play finished. Does not override other onEnd
     * callbacks.
     */
    Timeline.prototype.rewind = function (onEnd) {
        this.pause();
        this.signalHandler.clearSignalCallbacks(['playOnEnd']);
        this.signalHandler.registerSignalCallbacks({ playOnEnd: onEnd });
        this.playPaths(-1);
    };
    /**
     * Play the timeline in the specified direction.
     * @private
     * @param {number} direction
     * Direction to play in. 1 for forwards, -1 for backwards.
     */
    Timeline.prototype.playPaths = function (direction) {
        var timeline = this, signalHandler = timeline.signalHandler;
        if (!timeline.paths.length) {
            var emptySignal = {
                cancelled: false
            };
            signalHandler.emitSignal('playOnEnd', emptySignal);
            signalHandler.emitSignal('masterOnEnd', emptySignal);
            return;
        }
        var curPaths = splat(this.paths[this.cursor]), nextPaths = this.paths[this.cursor + direction], 
        // Play a path
        playPath = function (path) {
            // Emit signal and set playing state
            signalHandler.emitSignal('onPathStart', path);
            timeline.pathsPlaying[path.id] = path;
            // Do the play
            path[direction > 0 ? 'play' : 'rewind'](function (callbackData) {
                // Play ended callback
                // Data to pass to signal callbacks
                var cancelled = callbackData && callbackData.cancelled, signalData = {
                    path: path,
                    cancelled: cancelled
                };
                // Clear state and send signal
                delete timeline.pathsPlaying[path.id];
                signalHandler.emitSignal('onPathEnd', signalData);
                // Handle next paths
                var pathsEnded = 0;
                pathsEnded++;
                if (pathsEnded >= curPaths.length) {
                    // We finished all of the current paths for cursor.
                    if (nextPaths && !cancelled) {
                        // We have more paths, move cursor along
                        timeline.cursor += direction;
                        // Reset upcoming path cursors before playing
                        splat(nextPaths).forEach(function (nextPath) {
                            nextPath[direction > 0 ?
                                'resetCursor' : 'resetCursorEnd']();
                        });
                        // Play next
                        timeline.playPaths(direction);
                    }
                    else {
                        // If it is the last path in this direction,
                        // call onEnd
                        signalHandler.emitSignal('playOnEnd', signalData);
                        signalHandler.emitSignal('masterOnEnd', signalData);
                    }
                }
            });
        };
        // Go through the paths under cursor and play them
        curPaths.forEach(function (path) {
            if (path) {
                // Store reference to timeline
                path.timeline = timeline;
                // Leave a timeout to let notes fade out before next play
                setTimeout(function () {
                    playPath(path);
                }, Sonification.fadeOutDuration);
            }
        });
    };
    /**
     * Stop the playing of the timeline. Cancels all current sounds, but does
     * not affect the cursor.
     * @private
     * @param {boolean} [fadeOut=false]
     * Whether or not to fade out as we stop. If false, the timeline is
     * cancelled synchronously.
     */
    Timeline.prototype.pause = function (fadeOut) {
        var timeline = this;
        // Cancel currently playing events
        Object.keys(timeline.pathsPlaying).forEach(function (id) {
            if (timeline.pathsPlaying[id]) {
                timeline.pathsPlaying[id].pause(fadeOut);
            }
        });
        timeline.pathsPlaying = {};
    };
    /**
     * Reset the cursor to the beginning of the timeline.
     * @private
     */
    Timeline.prototype.resetCursor = function () {
        this.paths.forEach(function (paths) {
            splat(paths).forEach(function (path) {
                path.resetCursor();
            });
        });
        this.cursor = 0;
    };
    /**
     * Reset the cursor to the end of the timeline.
     * @private
     */
    Timeline.prototype.resetCursorEnd = function () {
        this.paths.forEach(function (paths) {
            splat(paths).forEach(function (path) {
                path.resetCursorEnd();
            });
        });
        this.cursor = this.paths.length - 1;
    };
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
    Timeline.prototype.setCursor = function (eventId) {
        return this.paths.some(function (paths) {
            return splat(paths).some(function (path) {
                return path.setCursor(eventId);
            });
        });
    };
    /**
     * Get the current TimelineEvents under the cursors. This function will
     * return the event under the cursor for each currently playing path, as an
     * object where the path ID is mapped to the TimelineEvent under that
     * path's cursor.
     * @private
     * @return {Highcharts.Dictionary<Highcharts.TimelineEvent>}
     * The TimelineEvents under each path's cursors.
     */
    Timeline.prototype.getCursor = function () {
        return this.getCurrentPlayingPaths().reduce(function (acc, cur) {
            acc[cur.id] = cur.getCursor();
            return acc;
        }, {});
    };
    /**
     * Check if timeline is reset or at start.
     * @private
     * @return {boolean}
     * True if timeline is at the beginning.
     */
    Timeline.prototype.atStart = function () {
        if (this.cursor) {
            return false;
        }
        return !splat(this.paths[0]).some(function (path) {
            return path.cursor;
        });
    };
    /**
     * Get the current TimelinePaths being played.
     * @private
     * @return {Array<Highcharts.TimelinePath>}
     * The TimelinePaths currently being played.
     */
    Timeline.prototype.getCurrentPlayingPaths = function () {
        if (!this.paths.length) {
            return [];
        }
        return splat(this.paths[this.cursor]);
    };
    return Timeline;
}());
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
 */ /**
* List of TimelinePaths to play. Multiple paths can be grouped together and
* played simultaneously by supplying an array of paths in place of a single
* path.
* @name Highcharts.TimelineOptionsObject#paths
* @type {Array<(Highcharts.TimelinePath|Array<Highcharts.TimelinePath>)>}
*/ /**
* Callback function to call before a path plays.
* @name Highcharts.TimelineOptionsObject#onPathStart
* @type {Function|undefined}
*/ /**
* Callback function to call after a path has stopped playing.
* @name Highcharts.TimelineOptionsObject#onPathEnd
* @type {Function|undefined}
*/ /**
* Callback called when the whole path is finished.
* @name Highcharts.TimelineOptionsObject#onEnd
* @type {Function|undefined}
*/
(''); // detach doclets above
