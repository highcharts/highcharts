/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
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

import type ColorType from '../../Core/Color/ColorType';
import type CSSObject from '../../Core/Renderer/CSSObject';
import type FlagsPointOptions from './FlagsPointOptions';
import type FlagsSeries from './FlagsSeries';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import { isNumber } from '../../Shared/Utilities.js';
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

class FlagsPoint extends ColumnPoint {

    /* *
     *
     *  Properties
     *
     * */

    /** @internal */
    public _y?: number;

    /** @internal */
    public anchorX?: number;

    public options!: FlagsPointOptions;

    /** @internal */
    public series!: FlagsSeries;

    /** @internal */
    public fillColor?: ColorType;

    /** @internal */
    public lineWidth?: number;

    /** @internal */
    public raised?: boolean;

    /** @internal */
    public stackIndex?: number;

    /** @internal */
    public style?: CSSObject;

    /** @internal */
    public ttBelow?: boolean = false;

    /** @internal */
    public unbindMouseOver?: Function;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * @internal
     */
    public isValid(): boolean {
        // #9233 - Prevent from treating flags as null points (even if
        // they have no y values defined).
        return isNumber(this.y) || typeof this.y === 'undefined';
    }

    /**
     * @internal
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
