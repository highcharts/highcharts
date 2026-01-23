/* *
 *
 *  Plugin for resizing axes / panes in a chart.
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Kacper Madej
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Axis from '../../Core/Axis/Axis';
import type AxisResizeOptions from './AxisResizeOptions';
import type Pointer from '../../Core/Pointer';

import AxisResizer from './AxisResizer.js';
import AxisResizerDefaults from './AxisResizerDefaults.js';
import D from '../../Core/Defaults.js';
const { defaultOptions } = D;
import U from '../../Core/Utilities.js';
import { merge, wrap } from '../../Shared/Utilities.js';
const {
    addEvent
} = U;

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
declare module '../../Core/Axis/AxisBase' {
    interface AxisBase {
        resizer?: AxisResizer;
    }
}

declare module '../../Core/Axis/AxisOptions' {
    interface AxisOptions {
        /**
         * Maximal size of a resizable axis. Could be set as a percent
         * of plot area or pixel size.
         *
         * @sample {highstock} stock/yaxis/resize-min-max-length
         *         minLength and maxLength
         *
         * @type      {number|string}
         * @product   highstock
         * @requires  modules/drag-panes
         * @apioption yAxis.maxLength
         */
        maxLength?: (number|string);

        /**
         * Minimal size of a resizable axis. Could be set as a percent
         * of plot area or pixel size.
         *
         * @sample {highstock} stock/yaxis/resize-min-max-length
         *         minLength and maxLength
         *
         * @type      {number|string}
         * @product   highstock
         * @requires  modules/drag-panes
         * @apioption yAxis.minLength
         */
        minLength?: (number|string);

        /**
         * Options for axis resizing. It adds a thick line between panes which
         * the user can drag in order to resize the panes.
         *
         * @sample {highstock} stock/demo/candlestick-and-volume
         *         Axis resizing enabled
         *
         * @product      highstock
         * @requires     modules/drag-panes
         */
        resize?: AxisResizeOptions;
    }
}

/** @internal */
declare module '../../Core/Chart/ChartBase' {
    interface ChartBase {
        activeResizer?: boolean;
    }
}

/* *
 *
 *  Functions
 *
 * */

/** @internal */
function compose(
    AxisClass: typeof Axis,
    PointerClass: typeof Pointer
): void {

    if (!AxisClass.keepProps.includes('resizer')) {
        merge(true, defaultOptions.yAxis, AxisResizerDefaults);

        // Keep resizer reference on axis update
        AxisClass.keepProps.push('resizer');

        addEvent(AxisClass, 'afterRender', onAxisAfterRender);
        addEvent(AxisClass, 'destroy', onAxisDestroy);

        wrap(
            PointerClass.prototype,
            'runPointActions',
            wrapPointerRunPointActions
        );
        wrap(
            PointerClass.prototype,
            'drag',
            wrapPointerDrag
        );
    }

}

/**
 * Add new AxisResizer, update or remove it
 * @internal
 */
function onAxisAfterRender(
    this: Axis
): void {
    const axis = this,
        resizer = axis.resizer,
        resizerOptions = axis.options.resize;

    if (resizerOptions) {
        const enabled = resizerOptions.enabled !== false;

        if (resizer) {
            // Resizer present and enabled
            if (enabled) {
                // Update options
                resizer.init(axis, true);

            // Resizer present, but disabled
            } else {
                // Destroy the resizer
                resizer.destroy();
            }
        } else {
            // Resizer not present and enabled
            if (enabled) {
                // Add new resizer
                axis.resizer = new AxisResizer(axis);
            }
            // Resizer not present and disabled, so do nothing
        }
    }
}

/**
 * Clear resizer on axis remove.
 * @internal
 */
function onAxisDestroy(
    this: Axis,
    e: { keepEvents: boolean }
): void {
    const axis = this;

    if (!e.keepEvents && axis.resizer) {
        axis.resizer.destroy();
    }
}

/**
 * Prevent default drag action detection while dragging a control line of
 * AxisResizer. (#7563)
 * @internal
 */
function wrapPointerDrag(
    this: Pointer,
    proceed: Function
): void {
    const pointer = this;

    if (!pointer.chart.activeResizer) {
        proceed.apply(pointer, [].slice.call(arguments, 1));
    }
}

/**
 * Prevent any hover effects while dragging a control line of AxisResizer.
 * @internal
 */
function wrapPointerRunPointActions(
    this: Pointer,
    proceed: Function
): void {
    const pointer = this;

    if (!pointer.chart.activeResizer) {
        proceed.apply(pointer, [].slice.call(arguments, 1));
    }
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
const DragPanes = {
    compose
};

/** @internal */
export default DragPanes;
