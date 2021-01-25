/* *
 *
 *  Highcharts variwide module
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type DataLabelOptions from '../../Core/Series/DataLabelOptions';
import type PositionObject from '../../Core/Renderer/PositionObject';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import Tick from '../../Core/Axis/Tick.js';
import Axis from '../../Core/Axis/Axis.js';
import H from '../../Core/Globals.js';
import VariwidePoint from './VariwidePoint.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    wrap
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Axis/Types' {
    interface AxisLike {
        variwide?: boolean;
        zData?: Array<number>;
    }
    interface TickLike {
        postTranslate(
            xy: PositionObject,
            xOrY: keyof PositionObject,
            index: number
        ): void;
    }
}

/* *
 *
 * Composition
 *
 * */

Tick.prototype.postTranslate = function (
    xy: PositionObject,
    xOrY: keyof PositionObject,
    index: number
): void {
    var axis = this.axis,
        pos = xy[xOrY] - axis.pos;

    if (!axis.horiz) {
        pos = axis.len - pos;
    }
    pos = (axis.series[0] as any).postTranslate(index, pos);

    if (!axis.horiz) {
        pos = axis.len - pos;
    }
    xy[xOrY] = axis.pos + pos;
};

/* eslint-disable no-invalid-this */

// Same width as the category (#8083)
addEvent(Axis, 'afterDrawCrosshair', function (
    e: {
        point: VariwidePoint;
    }
): void {
    if (this.variwide && this.cross) {
        this.cross.attr(
            'stroke-width',
            (e.point && e.point.crosshairWidth) as any
        );
    }
});

// On a vertical axis, apply anti-collision logic to the labels.
addEvent(Axis, 'afterRender', function (): void {
    var axis = this;

    if (!this.horiz && this.variwide) {
        this.chart.labelCollectors.push(
            function (): Array<SVGElement> {
                return axis.tickPositions
                    .filter(function (pos: number): boolean {
                        return axis.ticks[pos].label as any;
                    })
                    .map(function (
                        pos: number,
                        i: number
                    ): SVGElement {
                        var label: SVGElement =
                            axis.ticks[pos].label as any;

                        label.labelrank = (axis.zData as any)[i];
                        return label;
                    });
            }
        );
    }
});

addEvent(Tick, 'afterGetPosition', function (
    e: {
        pos: PositionObject;
        xOrY: keyof PositionObject;
    }
): void {
    var axis = this.axis,
        xOrY: keyof PositionObject = axis.horiz ? 'x' : 'y';

    if (axis.variwide) {
        (this as any)[xOrY + 'Orig'] = e.pos[xOrY];
        this.postTranslate(e.pos, xOrY, this.pos);
    }
});

wrap(Tick.prototype, 'getLabelPosition', function (
    this: Highcharts.Tick,
    proceed: Function,
    x: number,
    y: number,
    label: SVGElement,
    horiz: boolean,
    labelOptions: DataLabelOptions,
    tickmarkOffset: number,
    index: number
): PositionObject {
    var args = Array.prototype.slice.call(arguments, 1),
        xy: PositionObject,
        xOrY: keyof PositionObject = horiz ? 'x' : 'y';

    // Replace the x with the original x
    if (
        this.axis.variwide &&
        typeof (this as any)[xOrY + 'Orig'] === 'number'
    ) {
        args[horiz ? 0 : 1] = (this as any)[xOrY + 'Orig'];
    }

    xy = proceed.apply(this, args);

    // Post-translate
    if (this.axis.variwide && this.axis.categories) {
        this.postTranslate(xy, xOrY, this.pos);
    }
    return xy;
});
