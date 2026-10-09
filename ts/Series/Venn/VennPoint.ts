/* *
 *
 *  Experimental Highcharts module which enables visualization of a Venn
 *  diagram.
 *
 *  (c) 2016-2026 Highsoft AS
 *  Authors: Jon Arild Nygård
 *
 *  Layout algorithm by Ben Frederickson:
 *  https://www.benfrederickson.com/better-venn-diagrams/
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type VennPointOptions from './VennPointOptions';
import type VennSeries from './VennSeries';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import { isNumber } from '../../Shared/Utilities.js';
const {
    scatter: { prototype: { pointClass: ScatterPoint } }
} = SeriesRegistry.seriesTypes;

/* *
 *
 *  Class
 *
 * */

class VennPoint extends ScatterPoint {

    /* *
     *
     *  Properties
     *
     * */

    public options!: VennPointOptions;

    /** @internal */
    public series!: VennSeries;

    /** @internal */
    public sets?: Array<string>;

    /** @internal */
    public value?: number;

    /* *
     *
     *  Functions
     *
     * */

    /** @internal */
    public isValid(): boolean {
        return isNumber(this.value);
    }

    /** @internal */
    public shouldDraw(): boolean {
        // Only draw points with single sets.
        return !!this.shapeArgs;
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface VennPoint {
    // Nothing to add
}

/* *
 *
 *  Default Export
 *
 * */

export default VennPoint;
