/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  Extenstion for 3d axes
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Tick from '../parts/Tick.js';
import U from '../parts/Utilities.js';
const {
    addEvent,
    extend,
    wrap
} = U;

/* eslint-disable valid-jsdoc */

/**
 * Tick with 3D support
 * @private
 * @class
 */
class Tick3D {

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * @private
     */
    public static compose(TickClass: typeof Tick): void {

        addEvent(TickClass, 'afterGetLabelPosition', Tick3D.onAfterGetLabelPosition);

        const tickProto = TickClass.prototype as Tick3D;

        wrap(tickProto, 'getMarkPath', Tick3D.wrapGetMarkPath);
    }

    /**
     * @private
     */
    public static onAfterGetLabelPosition(
        this: Tick,
        e: {
            pos: Highcharts.Position3dObject;
            tickmarkOffset: number;
            index: number;
        }
    ): void {
        const axis3D = this.axis.axis3D;

        if (axis3D) {
            extend(e.pos, axis3D.fix3dPosition(e.pos));
        }
    }

    /**
     * @private
     */
    public static wrapGetMarkPath(
        this: Tick,
        proceed: Function
    ): Highcharts.SVGPathArray {
        const tick = this;
        const axis = tick.axis;
        const axis3D = axis.axis3D;
        var path = proceed.apply(tick, [].slice.call(arguments, 1));

        var pArr: Array<Highcharts.Position3dObject> = [
            { x: path[1], y: path[2], z: 0 },
            { x: path[4], y: path[5], z: 0 }
        ];

        if (axis3D) {
            axis3D.fix3dPosition(pArr[0]);
            axis3D.fix3dPosition(pArr[1]);
        }

        return axis.chart.renderer.toLineSegments(pArr);
    }

}

/**
 * Tick instance with 3D support.
 * @private
 */
interface Tick3D extends Tick {
    // nothing to add to instance
}

export default Tick3D;
