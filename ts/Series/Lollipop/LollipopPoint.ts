/* *
 *
 *  (c) 2010-2025 Torstein Honsi
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

import type LollipopPointOptions from './LollipopPointOptions';
import type LollipopSeries from './LollipopSeries';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    series: {
        prototype: {
            pointClass: Point
        }
    },
    seriesTypes: {
        scatter: {
            prototype: {
                pointClass: ScatterPoint
            }
        },
        dumbbell: {
            prototype: {
                pointClass: DumbbellPoint
            }
        }
    }
} = SeriesRegistry;

import U from '../../Core/Utilities.js';
const {
    extend
} = U;

/* *
 *
 *  Class
 *
 * */

class LollipopPoint extends Point {

    /* *
     *
     *  Properties
     *
     * */

    public connector?: SVGElement;
    public options!: LollipopPointOptions;
    public series!: LollipopSeries;
    public plotX!: number;
    public pointWidth!: number;
}

/* *
 *
 *  Class Prototype
 *
 * */

interface LollipopPoint {
    destroy: typeof DumbbellPoint.prototype['destroy'],
    pointSetState: typeof ScatterPoint.prototype['setState'],
    setState: typeof DumbbellPoint.prototype['setState']
}

extend(LollipopPoint.prototype, {
    destroy: DumbbellPoint.prototype.destroy,
    pointSetState: ScatterPoint.prototype.setState,
    setState: DumbbellPoint.prototype.setState
});

/* *
 *
 *  Default Export
 *
 * */

export default LollipopPoint;
