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

import type AxisResizerOptions from './DragPanes/AxisResizerOptions';

import Axis from '../Core/Axis/Axis.js';
import AxisDefaults from '../Core/Axis/AxisDefaults.js';
import AxisResizer from './DragPanes/AxisResizer.js';
import H from '../Core/Globals.js';
import Pointer from '../Core/Pointer.js';
import U from '../Core/Utilities.js';
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

declare module '../Core/Axis/AxisLike' {
    interface AxisLike {
        resizer?: AxisResizer;
    }
}

declare module '../Core/Axis/AxisOptions' {
    interface AxisOptions extends AxisResizerOptions {
        // nothing more to add
    }
}

declare module '../Core/Chart/ChartLike' {
    interface ChartLike {
        activeResizer?: boolean;
    }
}

// Keep resizer reference on axis update
Axis.keepProps.push('resizer');

/* eslint-disable no-invalid-this */
// Add new AxisResizer, update or remove it
addEvent(Axis, 'afterRender', function (): void {
    let axis = this,
        resizer = axis.resizer,
        resizerOptions = axis.options.resize,
        enabled;

    if (resizerOptions) {
        enabled = resizerOptions.enabled !== false;

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
});

// Clear resizer on axis remove.
addEvent(Axis, 'destroy', function (e: Event): void {
    if (!(e as any).keepEvents && this.resizer) {
        this.resizer.destroy();
    }
});

// Prevent any hover effects while dragging a control line of AxisResizer.
wrap(Pointer.prototype, 'runPointActions', function (
    this: Pointer,
    proceed: Function
): void {
    if (!this.chart.activeResizer) {
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    }
});

// Prevent default drag action detection while dragging a control line of
// AxisResizer. (#7563)
wrap(Pointer.prototype, 'drag', function (
    this: Pointer,
    proceed: Function
): void {
    if (!this.chart.activeResizer) {
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    }
});

merge(true, AxisDefaults.defaultYAxisOptions, AxisResizer.resizerOptions);

(H as any).AxisResizer = AxisResizer as any;
export default AxisResizer;
