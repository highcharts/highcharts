/* *
 *
 *  Plugin for resizing axes / panes in a chart.
 *
 *  (c) 2010-2021 Highsoft AS
 *
 *  Author: Kacper Madej
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

import type Axis from '../../Core/Axis/Axis';
import type AxisResizerOptions from './AxisResizerOptions';
import type Pointer from '../../Core/Pointer';

import AxisResizer from './AxisResizer.js';
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

declare module '../../Core/Axis/AxisLike' {
    interface AxisLike {
        resizer?: AxisResizer;
    }
}

declare module '../../Core/Axis/AxisOptions' {
    interface AxisOptions extends AxisResizerOptions {
        // nothing more to add
    }
}

declare module '../../Core/Chart/ChartLike' {
    interface ChartLike {
        activeResizer?: boolean;
    }
}

/* *
 *
 *  Constants
 *
 * */

const composedMembers: Array<unknown> = [];

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

    if (U.pushUnique(composedMembers, AxisClass)) {
        merge(true, AxisClass.defaultOptions, AxisResizer.resizerOptions);

        // Keep resizer reference on axis update
        AxisClass.keepProps.push('resizer');

        addEvent(AxisClass, 'afterRender', onAxisAfterRender);
        addEvent(AxisClass, 'destroy', onAxisDestroy);
    }

    if (U.pushUnique(composedMembers, PointerClass)) {
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
