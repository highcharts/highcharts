/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import Fx from './Fx.js';
import H from '../Globals.js';
import U from '../Utilities.js';
var defined = U.defined, getStyle = U.getStyle, isArray = U.isArray, isNumber = U.isNumber, isObject = U.isObject, merge = U.merge, objectEach = U.objectEach, pick = U.pick;
/**
 * Set the global animation to either a given value, or fall back to the given
 * chart's animation option.
 *
 * @function Highcharts.setAnimation
 *
 * @param {boolean|Partial<Highcharts.AnimationOptionsObject>|undefined} animation
 *        The animation object.
 *
 * @param {Highcharts.Chart} chart
 *        The chart instance.
 *
 * @todo
 * This function always relates to a chart, and sets a property on the renderer,
 * so it should be moved to the SVGRenderer.
 */
var setAnimation = H.setAnimation = function setAnimation(animation, chart) {
    chart.renderer.globalAnimation = pick(animation, chart.options.chart.animation, true);
};
/**
 * Get the animation in object form, where a disabled animation is always
 * returned as `{ duration: 0 }`.
 *
 * @function Highcharts.animObject
 *
 * @param {boolean|Highcharts.AnimationOptionsObject} [animation=0]
 *        An animation setting. Can be an object with duration, complete and
 *        easing properties, or a boolean to enable or disable.
 *
 * @return {Highcharts.AnimationOptionsObject}
 *         An object with at least a duration property.
 */
var animObject = H.animObject = function animObject(animation) {
    return isObject(animation) ?
        H.merge({ duration: 500, defer: 0 }, animation) :
        { duration: animation ? 500 : 0, defer: 0 };
};
/**
 * Get the defer as a number value from series animation options.
 *
 * @function Highcharts.getDeferredAnimation
 *
 * @param {Highcharts.Chart} chart
 *        The chart instance.
 *
 * @param {boolean|Highcharts.AnimationOptionsObject} animation
 *        An animation setting. Can be an object with duration, complete and
 *        easing properties, or a boolean to enable or disable.
 *
 * @param {Highcharts.Series} [series]
 *        Series to defer animation.
 *
 * @return {number}
 *        The numeric value.
 */
var getDeferredAnimation = H.getDeferredAnimation = function (chart, animation, series) {
    var labelAnimation = animObject(animation);
    var s = series ? [series] : chart.series;
    var defer = 0;
    var duration = 0;
    s.forEach(function (series) {
        var seriesAnim = animObject(series.options.animation);
        defer = animation && defined(animation.defer) ?
            labelAnimation.defer :
            Math.max(defer, seriesAnim.duration + seriesAnim.defer);
        duration = Math.min(labelAnimation.duration, seriesAnim.duration);
    });
    // Disable defer for exporting
    if (chart.renderer.forExport) {
        defer = 0;
    }
    var anim = {
        defer: Math.max(0, defer - duration),
        duration: Math.min(defer, duration)
    };
    return anim;
};
/**
 * The global animate method, which uses Fx to create individual animators.
 *
 * @function Highcharts.animate
 *
 * @param {Highcharts.HTMLDOMElement|Highcharts.SVGElement} el
 *        The element to animate.
 *
 * @param {Highcharts.CSSObject|Highcharts.SVGAttributes} params
 *        An object containing key-value pairs of the properties to animate.
 *        Supports numeric as pixel-based CSS properties for HTML objects and
 *        attributes for SVGElements.
 *
 * @param {Partial<Highcharts.AnimationOptionsObject>} [opt]
 *        Animation options.
 *
 * @return {void}
 */
var animate = H.animate = function (el, params, opt) {
    var start, unit = '', end, fx, args;
    if (!isObject(opt)) { // Number or undefined/null
        args = arguments;
        opt = {
            duration: args[2],
            easing: args[3],
            complete: args[4]
        };
    }
    if (!isNumber(opt.duration)) {
        opt.duration = 400;
    }
    opt.easing = typeof opt.easing === 'function' ?
        opt.easing :
        (Math[opt.easing] || Math.easeInOutSine);
    opt.curAnim = merge(params);
    objectEach(params, function (val, prop) {
        // Stop current running animation of this property
        stop(el, prop);
        fx = new Fx(el, opt, prop);
        end = null;
        if (prop === 'd' && isArray(params.d)) {
            fx.paths = fx.initPath(el, el.pathArray, params.d);
            fx.toD = params.d;
            start = 0;
            end = 1;
        }
        else if (el.attr) {
            start = el.attr(prop);
        }
        else {
            start = parseFloat(getStyle(el, prop)) || 0;
            if (prop !== 'opacity') {
                unit = 'px';
            }
        }
        if (!end) {
            end = val;
        }
        if (end && end.match && end.match('px')) {
            end = end.replace(/px/g, ''); // #4351
        }
        fx.run(start, end, unit);
    });
};
/**
 * Stop running animation.
 *
 * @function Highcharts.stop
 *
 * @param {Highcharts.SVGElement} el
 *        The SVGElement to stop animation on.
 *
 * @param {string} [prop]
 *        The property to stop animating. If given, the stop method will stop a
 *        single property from animating, while others continue.
 *
 * @return {void}
 *
 * @todo
 * A possible extension to this would be to stop a single property, when
 * we want to continue animating others. Then assign the prop to the timer
 * in the Fx.run method, and check for the prop here. This would be an
 * improvement in all cases where we stop the animation from .attr. Instead of
 * stopping everything, we can just stop the actual attributes we're setting.
 */
var stop = H.stop = function (el, prop) {
    var i = H.timers.length;
    // Remove timers related to this element (#4519)
    while (i--) {
        if (H.timers[i].elem === el && (!prop || prop === H.timers[i].prop)) {
            H.timers[i].stopped = true; // #4667
        }
    }
};
var animationExports = {
    animate: animate,
    animObject: animObject,
    getDeferredAnimation: getDeferredAnimation,
    setAnimation: setAnimation,
    stop: stop
};
export default animationExports;
