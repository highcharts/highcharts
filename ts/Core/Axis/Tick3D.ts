/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  Extenstion for 3d axes
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Position3DObject from '../Renderer/Position3DObject';
import type SVGPath from '../Renderer/SVG/SVGPath';
import type Tick from './Tick.js';
import U from '../Utilities.js';
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
            pos: Position3DObject;
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
    ): SVGPath {
        const chart = this.axis.chart;
        const axis3D = this.axis.axis3D;
        const path: SVGPath = proceed.apply(
            this,
            [].slice.call(arguments, 1)
        );

        if (axis3D) {
            const start = path[0];
            const end = path[1];
            if (start[0] === 'M' && end[0] === 'L') {
                const pArr: Array<Position3DObject> = [
                    axis3D.fix3dPosition({ x: start[1], y: start[2], z: 0 }),
                    axis3D.fix3dPosition({ x: end[1], y: end[2], z: 0 })
                ];

                return this.axis.chart.renderer.toLineSegments(pArr);
            }
        }
        return path;
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
