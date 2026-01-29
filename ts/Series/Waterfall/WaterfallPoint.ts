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

/* *
 *
 *  Imports
 *
 * */

import type BBoxObject from '../../Core/Renderer/BBoxObject';
import type WaterfallPointOptions from './WaterfallPointOptions';
import type WaterfallSeries from './WaterfallSeries';

import ColumnSeries from '../Column/ColumnSeries.js';
import Point from '../../Core/Series/Point.js';
import U from '../../Core/Utilities.js';
const { isNumber } = U;

/* *
 *
 *  Class
 *
 * */

class WaterfallPoint extends ColumnSeries.prototype.pointClass {

    /* *
     *
     *  Properties
     *
     * */

    public below?: boolean;

    public box?: BBoxObject;

    public isIntermediateSum?: boolean;

    public isSum?: boolean;

    public minPointLengthOffset?: number;

    public options!: WaterfallPointOptions;

    public series!: WaterfallSeries;

    /* *
     *
     *  Functions
     *
     * */

    public getClassName(): string {
        let className = Point.prototype.getClassName.call(this);

        if (this.isSum) {
            className += ' highcharts-sum';
        } else if (this.isIntermediateSum) {
            className += ' highcharts-intermediate-sum';
        }

        return className;
    }

    // Pass the null test in ColumnSeries.translate.
    public isValid(): boolean {
        return (
            isNumber(this.y) ||
            this.isSum ||
            Boolean(this.isIntermediateSum)
        );
    }

}

/* *
 *
 *  Export
 *
 * */

export default WaterfallPoint;
