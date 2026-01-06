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
import type AxisResizerOptions from './AxisResizerOptions';
import type Pointer from '../../Core/Pointer';

import AxisResizer from './AxisResizer.js';
import D from '../../Core/Defaults.js';
const { defaultOptions } = D;
import U from '../../Core/Utilities.js';
const {
    addEvent,
    merge,
    wrap
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Axis/AxisBase' {
    interface AxisBase {
        resizer?: AxisResizer;
    }
}

declare module '../../Core/Axis/AxisOptions' {
    interface AxisOptions extends AxisResizerOptions {
        // Nothing more to add
    }
}

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

/**
 * @private
 */
function compose(
    AxisClass: typeof Axis,
    PointerClass: typeof Pointer
): void {

    if (!AxisClass.keepProps.includes('resizer')) {
        merge(true, defaultOptions.yAxis, AxisResizer.resizerOptions);

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
 * @private
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
 * @private
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
 * @private
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
 * @private
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

const DragPanes = {
    compose
};

export default DragPanes;
