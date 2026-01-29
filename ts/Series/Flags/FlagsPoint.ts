/* *
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

import type ColorType from '../../Core/Color/ColorType';
import type CSSObject from '../../Core/Renderer/CSSObject';
import type FlagsPointOptions from './FlagsPointOptions';
import type FlagsSeries from './FlagsSeries';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    column: {
        prototype: {
            pointClass: ColumnPoint
        }
    }
} = SeriesRegistry.seriesTypes;
import U from '../../Core/Utilities.js';
const { isNumber } = U;

/* *
 *
 *  Class
 *
 * */

class FlagsPoint extends ColumnPoint {

    /* *
     *
     *  Properties
     *
     * */

    public _y?: number;

    public anchorX?: number;

    public options!: FlagsPointOptions;

    public series!: FlagsSeries;

    public fillColor?: ColorType;

    public lineWidth?: number;

    public raised?: boolean;

    public stackIndex?: number;

    public style?: CSSObject;

    public ttBelow?: boolean = false;

    public unbindMouseOver?: Function;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * @private
     */
    public isValid(): boolean {
        // #9233 - Prevent from treating flags as null points (even if
        // they have no y values defined).
        return isNumber(this.y) || typeof this.y === 'undefined';
    }

    /**
     * @private
     */
    public hasNewShapeType(): (boolean|undefined) {
        const shape = this.options.shape || this.series.options.shape;

        return this.graphic && shape && shape !== this.graphic.symbolKey;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default FlagsPoint;
