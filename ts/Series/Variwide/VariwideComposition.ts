/* *
 *
 *  Highcharts variwide module
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
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
import type DataLabelOptions from '../../Core/Series/DataLabelOptions';
import type PositionObject from '../../Core/Renderer/PositionObject';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type Tick from '../../Core/Axis/Tick';

import H from '../../Core/Globals.js';
const { composed } = H;
import VariwidePoint from './VariwidePoint.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    pushUnique,
    wrap
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Axis/AxisBase' {
    interface AxisBase {
        variwide?: boolean;
        zData?: Array<number>;
    }
}

declare module '../../Core/Axis/TickBase' {
    interface TickBase {
        postTranslate(
            xy: PositionObject,
            xOrY: keyof PositionObject,
            index: number
        ): void;
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
    TickClass: typeof Tick
): void {

    if (pushUnique(composed, 'Variwide')) {
        const tickProto = TickClass.prototype;

        addEvent(AxisClass, 'afterDrawCrosshair', onAxisAfterDrawCrosshair);
        addEvent(AxisClass, 'afterRender', onAxisAfterRender);

        addEvent(TickClass, 'afterGetPosition', onTickAfterGetPosition);

        tickProto.postTranslate = tickPostTranslate;

        wrap(tickProto, 'getLabelPosition', wrapTickGetLabelPosition);
    }

}

/**
 * Same width as the category (#8083)
 * @private
 */
function onAxisAfterDrawCrosshair(
    this: Axis,
    e: {
        point: VariwidePoint;
    }
): void {
    if (this.variwide && this.cross) {
        this.cross.attr(
            'stroke-width',
            e.point?.crosshairWidth
        );
    }
}

/**
 * On a vertical axis, apply anti-collision logic to the labels.
 * @private
 */
function onAxisAfterRender(
    this: Axis
): void {
    const axis = this;

    this.chart.labelCollectors.push(
        function (): Array<SVGElement> {
            return axis.variwide ? axis.tickPositions
                .filter((pos: number): boolean => !!axis.ticks[pos].label)
                .map((pos, i): SVGElement => {
                    const label: SVGElement = axis.ticks[pos].label as any;

                    label.labelrank = axis.zData?.[i];

                    return label;
                }) : [];
        }
    );
}

/**
 * @private
 */
function onTickAfterGetPosition(
    this: Tick,
    e: {
        pos: PositionObject;
        xOrY: keyof PositionObject;
    }
): void {
    const axis = this.axis,
        xOrY: keyof PositionObject = axis.horiz ? 'x' : 'y';

    if (axis.variwide) {
        (this as any)[xOrY + 'Orig'] = e.pos[xOrY];
        this.postTranslate(e.pos, xOrY, this.pos);
    }
}

/**
 * @private
 */
function tickPostTranslate(
    this: Tick,
    xy: PositionObject,
    xOrY: keyof PositionObject,
    index: number
): void {
    const axis = this.axis;

    let pos = xy[xOrY] - axis.pos;

    if (!axis.horiz) {
        pos = axis.len - pos;
    }
    pos = (axis.series[0] as any).postTranslate(index, pos);

    if (!axis.horiz) {
        pos = axis.len - pos;
    }
    xy[xOrY] = axis.pos + pos;
}

/**
 * @private
 */
function wrapTickGetLabelPosition(
    this: Tick,
    proceed: Function,
    _x: number,
    _y: number,
    _label: SVGElement,
    horiz: boolean,
    /* eslint-disable @typescript-eslint/no-unused-vars */
    _labelOptions: DataLabelOptions,
    _tickmarkOffset: number,
    _index: number
    /* eslint-enable @typescript-eslint/no-unused-vars */
): PositionObject {
    const args = Array.prototype.slice.call(arguments, 1),
        xOrY: keyof PositionObject = horiz ? 'x' : 'y';

    // Replace the x with the original x
    if (
        this.axis.variwide &&
        typeof (this as any)[xOrY + 'Orig'] === 'number'
    ) {
        args[horiz ? 0 : 1] = (this as any)[xOrY + 'Orig'];
    }

    const xy = proceed.apply(this, args);

    // Post-translate
    if (this.axis.variwide && this.axis.categories) {
        this.postTranslate(xy, xOrY, this.pos);
    }
    return xy;
}

/* *
 *
 *  Default Export
 *
 * */

const VariwideComposition = {
    compose
};

export default VariwideComposition;
