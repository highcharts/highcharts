/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Pawel Lysy
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

import type HLCPointOptions from './HLCPointOptions';
import type HLCSeries from './HLCSeries';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    column: {
        prototype: {
            pointClass: ColumnPoint
        }
    }
} = SeriesRegistry.seriesTypes;

/* *
 *
 *  Class
 *
 * */

class HLCPoint extends ColumnPoint {

    /* *
     *
     *  Properties
     *
     * */

    public close!: number;

    public high!: number;

    public low!: number;

    public options!: HLCPointOptions;

    public plotClose!: number;

    public plotHigh?: number;

    public plotLow?: number;

    public series!: HLCSeries;

    public yBottom?: number;

    /**
     * Get the origin position for entrance animation of new points
     */
    public getOrigin(
        { x = 0 }: SVGAttributes,
        shape: SVGAttributes = {}
    ): SVGAttributes {
        const d = shape.d as SVGPath|undefined,
            shiftX = x - (this.plotX || 0);

        if (d) {
            return {
                d: d.map((segment): SVGPath.Segment => {
                    const slice = segment.slice() as SVGPath.Segment;
                    if (typeof slice[1] === 'number') {
                        slice[1] += shiftX;
                    }
                    return slice;
                })
            };
        }
        return shape;
    }
}

/* *
 *
 *  Class Namespace
 *
 * */

namespace HLCPoint {
    export type PointShortOptions = Array<number>;
}
/* *
 *
 *  Default Export
 *
 * */

export default HLCPoint;
