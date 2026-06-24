/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type AnimationOptions from './AnimationOptions';
import type Chart from '../Chart/Chart';
import type CSSObject from '../Renderer/CSSObject';
import type { DeepPartial } from '../../Shared/Types';
import type { HTMLDOMElement } from '../Renderer/DOMElementType';
import type Series from '../Series/Series';
import type SVGAttributes from '../Renderer/SVG/SVGAttributes';
import type SVGElement from '../Renderer/SVG/SVGElement';

import Fx from './Fx.js';
import {
    defined,
    getStyle,
    isArray,
    isNumber,
    isObject,
    merge,
    objectEach,
    pick
} from '../../Shared/Utilities.js';

/* *
 *
 *  Functions
 *
 * */

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
export function setAnimation(
    animation: (boolean|Partial<AnimationOptions>|undefined),
    chart: Chart
): void {
    chart.renderer.globalAnimation = pick(
        animation,
        chart.options.chart.animation,
        true
    );
}

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
export function animObject(
    animation?: (boolean|DeepPartial<AnimationOptions>)
): AnimationOptions {
    return isObject(animation) ?
        merge(
            { duration: 500, defer: 0 },
            animation as AnimationOptions
        ) as any :
        { duration: animation as boolean ? 500 : 0, defer: 0 };
}

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
export function getDeferredAnimation(
    chart: Chart,
    animation: (boolean|Partial<AnimationOptions>|undefined),
    series?: Series
): Partial<AnimationOptions> {
    const labelAnimation = animObject(animation),
        s = series ? [series] : chart.series;
    let defer = 0,
        duration = 0;

    s.forEach((series): void => {
        const seriesAnim = animObject(series.options.animation);

        defer = isObject(animation) && defined(animation.defer) ?
            labelAnimation.defer :
            Math.max(
                defer,
                seriesAnim.duration + seriesAnim.defer
            );
        duration = Math.min(labelAnimation.duration, seriesAnim.duration);
    });
    // Disable defer for exporting
    if (chart.renderer.forExport) {
        defer = 0;
    }

    const anim = {
        defer: Math.max(0, defer - duration),
        duration: Math.min(defer, duration)
    };

    return anim;
}

/**
 * The global animate method, which uses Fx to create individual animators.
 *
 * @sample highcharts/members/renderer-basic
 *         SVG elements with animation
 * @sample highcharts/members/animate
 *         Animation without an owner element
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
export function animate(
    el?: (HTMLDOMElement|SVGElement),
    params: (CSSObject|SVGAttributes|{ pos: number }) = { pos: 1 },
    opt?: boolean|Partial<AnimationOptions>
): void {
    if (!isObject(opt)) { // Number or undefined/null
        opt = {
            duration: arguments[2],
            easing: arguments[3],
            complete: arguments[4]
        };
    }
    if (!isNumber(opt.duration)) {
        opt.duration = 400;
    }
    opt.easing = typeof opt.easing === 'function' ?
        opt.easing :
        (Math[opt.easing as keyof Math] || Math.easeInOutSine) as any;
    opt.curAnim = merge(params) as any;

    objectEach(params, (val: string|number, prop: string): void => {
        // Stop current running animation of this property
        if (el) {
            stop(el, prop);
        }

        const fx = new Fx(el, opt, prop),
            d = (params as SVGAttributes).d;

        let start: number|string = 0,
            end: number|string|undefined = void 0,
            unit = '';

        if (prop === 'd' && isArray(d)) {
            fx.paths = fx.initPath(
                el as SVGElement,
                (el as SVGElement).pathArray,
                d
            );
            fx.toD = d;
            end = 1;
        } else if ((el as SVGElement)?.attr) {
            start = (el as SVGElement).attr(prop);
        } else if (el) {
            start = +(getStyle(el as HTMLElement, prop) || 0);
            if (prop !== 'opacity') {
                unit = 'px';
            }
        }

        if (!end) {
            end = val;
        }
        if (typeof end === 'string' && end.match('px')) {
            end = end.replace(/px/g, ''); // #4351
        }
        fx.run(start as any, end as any, unit);
    });
}

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
export const stop = (el: SVGElement|HTMLElement, prop?: string): void =>
    Fx.timers.forEach((timer): void => {
        if (timer.elem === el && (!prop || prop === timer.prop)) {
            timer.stopped = true; // #4667
        }
    });

/* *
 *
 *  API Options
 *
 * */


/**
 * An animation configuration. Animation configurations can also be defined as
 * booleans, where `false` turns off animation and `true` defaults to a duration
 * of 500ms and defer of 0ms.
 *
 * @interface Highcharts.AnimationOptionsObject
 *//**
 * A callback function to execute when the animation finishes.
 * @name Highcharts.AnimationOptionsObject#complete
 * @type {Function|undefined}
 *//**
 * The animation defer in milliseconds.
 * @name Highcharts.AnimationOptionsObject#defer
 * @type {number|undefined}
 *//**
 * The animation duration in milliseconds.
 * @name Highcharts.AnimationOptionsObject#duration
 * @type {number|undefined}
 *//**
 * The name of an easing function as defined on the `Math` object.
 * @name Highcharts.AnimationOptionsObject#easing
 * @type {string|Function|undefined}
 *//**
 * A callback function to execute on each step of each attribute or CSS property
 * that's being animated. The first argument contains information about the
 * animation and progress.
 * @name Highcharts.AnimationOptionsObject#step
 * @type {Function|undefined}
 */

''; // Keeps doclets in JS file
