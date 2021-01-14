/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../Globals.js';
var win = H.win;
import U from '../Utilities.js';
var isNumber = U.isNumber, objectEach = U.objectEach;
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * An animator object used internally. One instance applies to one property
 * (attribute or style prop) on one element. Animation is always initiated
 * through {@link SVGElement#animate}.
 *
 * @example
 * var rect = renderer.rect(0, 0, 10, 10).add();
 * rect.animate({ width: 100 });
 *
 * @private
 * @class
 * @name Highcharts.Fx
 */
var Fx = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    /**
     *
     * @param {Highcharts.HTMLDOMElement|Highcharts.SVGElement} elem
     *        The element to animate.
     *
     * @param {Partial<Highcharts.AnimationOptionsObject>} options
     *        Animation options.
     *
     * @param {string} prop
     *        The single attribute or CSS property to animate.
     */
    function Fx(elem, options, prop) {
        this.pos = NaN;
        this.options = options;
        this.elem = elem;
        this.prop = prop;
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Set the current step of a path definition on SVGElement.
     *
     * @function Highcharts.Fx#dSetter
     *
     * @return {void}
     */
    Fx.prototype.dSetter = function () {
        var paths = this.paths, start = paths && paths[0], end = paths && paths[1], path = [], now = this.now || 0;
        // Land on the final path without adjustment points appended in the ends
        if (now === 1 || !start || !end) {
            path = this.toD || [];
        }
        else if (start.length === end.length && now < 1) {
            for (var i = 0; i < end.length; i++) {
                // Tween between the start segment and the end segment. Start
                // with a copy of the end segment and tween the appropriate
                // numerics
                var startSeg = start[i];
                var endSeg = end[i];
                var tweenSeg = [];
                for (var j = 0; j < endSeg.length; j++) {
                    var startItem = startSeg[j];
                    var endItem = endSeg[j];
                    // Tween numbers
                    if (isNumber(startItem) &&
                        isNumber(endItem) &&
                        // Arc boolean flags
                        !(endSeg[0] === 'A' && (j === 4 || j === 5))) {
                        tweenSeg[j] = startItem + now * (endItem - startItem);
                        // Strings, take directly from the end segment
                    }
                    else {
                        tweenSeg[j] = endItem;
                    }
                }
                path.push(tweenSeg);
            }
            // If animation is finished or length not matching, land on right value
        }
        else {
            path = end;
        }
        this.elem.attr('d', path, void 0, true);
    };
    /**
     * Update the element with the current animation step.
     *
     * @function Highcharts.Fx#update
     *
     * @return {void}
     */
    Fx.prototype.update = function () {
        var elem = this.elem, prop = this.prop, // if destroyed, it is null
        now = this.now, step = this.options.step;
        // Animation setter defined from outside
        if (this[prop + 'Setter']) {
            this[prop + 'Setter']();
            // Other animations on SVGElement
        }
        else if (elem.attr) {
            if (elem.element) {
                elem.attr(prop, now, null, true);
            }
            // HTML styles, raw HTML content like container size
        }
        else {
            elem.style[prop] = now + this.unit;
        }
        if (step) {
            step.call(elem, now, this);
        }
    };
    /**
     * Run an animation.
     *
     * @function Highcharts.Fx#run
     *
     * @param {number} from
     *        The current value, value to start from.
     *
     * @param {number} to
     *        The end value, value to land on.
     *
     * @param {string} unit
     *        The property unit, for example `px`.
     *
     * @return {void}
     */
    Fx.prototype.run = function (from, to, unit) {
        var self = this, options = self.options, timer = function (gotoEnd) {
            return timer.stopped ? false : self.step(gotoEnd);
        }, requestAnimationFrame = win.requestAnimationFrame ||
            function (step) {
                setTimeout(step, 13);
            }, step = function () {
            for (var i = 0; i < Fx.timers.length; i++) {
                if (!Fx.timers[i]()) {
                    Fx.timers.splice(i--, 1);
                }
            }
            if (Fx.timers.length) {
                requestAnimationFrame(step);
            }
        };
        if (from === to && !this.elem['forceAnimate:' + this.prop]) {
            delete options.curAnim[this.prop];
            if (options.complete && Object.keys(options.curAnim).length === 0) {
                options.complete.call(this.elem);
            }
        }
        else { // #7166
            this.startTime = +new Date();
            this.start = from;
            this.end = to;
            this.unit = unit;
            this.now = this.start;
            this.pos = 0;
            timer.elem = this.elem;
            timer.prop = this.prop;
            if (timer() && Fx.timers.push(timer) === 1) {
                requestAnimationFrame(step);
            }
        }
    };
    /**
     * Run a single step in the animation.
     *
     * @function Highcharts.Fx#step
     *
     * @param {boolean} [gotoEnd]
     *        Whether to go to the endpoint of the animation after abort.
     *
     * @return {boolean}
     *         Returns `true` if animation continues.
     */
    Fx.prototype.step = function (gotoEnd) {
        var t = +new Date(), ret, done, options = this.options, elem = this.elem, complete = options.complete, duration = options.duration, curAnim = options.curAnim;
        if (elem.attr && !elem.element) { // #2616, element is destroyed
            ret = false;
        }
        else if (gotoEnd || t >= duration + this.startTime) {
            this.now = this.end;
            this.pos = 1;
            this.update();
            curAnim[this.prop] = true;
            done = true;
            objectEach(curAnim, function (val) {
                if (val !== true) {
                    done = false;
                }
            });
            if (done && complete) {
                complete.call(elem);
            }
            ret = false;
        }
        else {
            this.pos = options.easing((t - this.startTime) / duration);
            this.now = this.start + ((this.end - this.start) * this.pos);
            this.update();
            ret = true;
        }
        return ret;
    };
    /**
     * Prepare start and end values so that the path can be animated one to one.
     *
     * @function Highcharts.Fx#initPath
     *
     * @param {Highcharts.SVGElement} elem
     *        The SVGElement item.
     *
     * @param {Highcharts.SVGPathArray|undefined} fromD
     *        Starting path definition.
     *
     * @param {Highcharts.SVGPathArray} toD
     *        Ending path definition.
     *
     * @return {Array<Highcharts.SVGPathArray,Highcharts.SVGPathArray>}
     *         An array containing start and end paths in array form so that
     *         they can be animated in parallel.
     */
    Fx.prototype.initPath = function (elem, fromD, toD) {
        var shift, startX = elem.startX, endX = elem.endX, fullLength, i, start = fromD && fromD.slice(), // copy
        end = toD.slice(), // copy
        isArea = elem.isArea, positionFactor = isArea ? 2 : 1, reverse;
        if (!start) {
            return [end, end];
        }
        /**
         * If shifting points, prepend a dummy point to the end path.
         * @private
         * @param {Highcharts.SVGPathArray} arr - array
         * @param {Highcharts.SVGPathArray} other - array
         * @return {void}
         */
        function prepend(arr, other) {
            while (arr.length < fullLength) {
                // Move to, line to or curve to?
                var moveSegment = arr[0], otherSegment = other[fullLength - arr.length];
                if (otherSegment && moveSegment[0] === 'M') {
                    if (otherSegment[0] === 'C') {
                        arr[0] = [
                            'C',
                            moveSegment[1],
                            moveSegment[2],
                            moveSegment[1],
                            moveSegment[2],
                            moveSegment[1],
                            moveSegment[2]
                        ];
                    }
                    else {
                        arr[0] = ['L', moveSegment[1], moveSegment[2]];
                    }
                }
                // Prepend a copy of the first point
                arr.unshift(moveSegment);
                // For areas, the bottom path goes back again to the left, so we
                // need to append a copy of the last point.
                if (isArea) {
                    arr.push(arr[arr.length - 1]);
                }
            }
        }
        /**
         * Copy and append last point until the length matches the end length.
         * @private
         * @param {Highcharts.SVGPathArray} arr - array
         * @param {Highcharts.SVGPathArray} other - array
         * @return {void}
         */
        function append(arr, other) {
            while (arr.length < fullLength) {
                // Pull out the slice that is going to be appended or inserted.
                // In a line graph, the positionFactor is 1, and the last point
                // is sliced out. In an area graph, the positionFactor is 2,
                // causing the middle two points to be sliced out, since an area
                // path starts at left, follows the upper path then turns and
                // follows the bottom back.
                var segmentToAdd = arr[arr.length / positionFactor - 1].slice();
                // Disable the first control point of curve segments
                if (segmentToAdd[0] === 'C') {
                    segmentToAdd[1] = segmentToAdd[5];
                    segmentToAdd[2] = segmentToAdd[6];
                }
                if (!isArea) {
                    arr.push(segmentToAdd);
                }
                else {
                    var lowerSegmentToAdd = arr[arr.length / positionFactor].slice();
                    arr.splice(arr.length / 2, 0, segmentToAdd, lowerSegmentToAdd);
                }
            }
        }
        // For sideways animation, find out how much we need to shift to get the
        // start path Xs to match the end path Xs.
        if (startX && endX) {
            for (i = 0; i < startX.length; i++) {
                // Moving left, new points coming in on right
                if (startX[i] === endX[0]) {
                    shift = i;
                    break;
                    // Moving right
                }
                else if (startX[0] ===
                    endX[endX.length - startX.length + i]) {
                    shift = i;
                    reverse = true;
                    break;
                    // Fixed from the right side, "scaling" left
                }
                else if (startX[startX.length - 1] ===
                    endX[endX.length - startX.length + i]) {
                    shift = startX.length - i;
                    break;
                }
            }
            if (typeof shift === 'undefined') {
                start = [];
            }
        }
        if (start.length && isNumber(shift)) {
            // The common target length for the start and end array, where both
            // arrays are padded in opposite ends
            fullLength = end.length + shift * positionFactor;
            if (!reverse) {
                prepend(end, start);
                append(start, end);
            }
            else {
                prepend(start, end);
                append(end, start);
            }
        }
        return [start, end];
    };
    /**
     * Handle animation of the color attributes directly.
     *
     * @function Highcharts.Fx#fillSetter
     *
     * @return {void}
     */
    Fx.prototype.fillSetter = function () {
        Fx.prototype.strokeSetter.apply(this, arguments);
    };
    /**
     * Handle animation of the color attributes directly.
     *
     * @function Highcharts.Fx#strokeSetter
     *
     * @return {void}
     */
    Fx.prototype.strokeSetter = function () {
        this.elem.attr(this.prop, H.color(this.start).tweenTo(H.color(this.end), this.pos), null, true);
    };
    /* *
     *
     * Static properties
     *
     * */
    Fx.timers = [];
    return Fx;
}());
/* *
 *
 *  Compatibility
 *
 * */
H.Fx = Fx;
H.timers = Fx.timers;
/* *
 *
 *  Default Export
 *
 * */
export default Fx;
