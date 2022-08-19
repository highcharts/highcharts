/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type ColumnPointType from '../Column/ColumnPoint';
import type PointType from '../../Core/Series/Point';
import type WaterfallPointOptions from './WaterfallPointOptions';
import type WaterfallSeries from './WaterfallSeries';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const ColumnPoint: typeof ColumnPointType =
    SeriesRegistry.seriesTypes.column.prototype.pointClass;
import U from '../../Core/Utilities.js';
const { isNumber } = U;


/* *
 *
 * Class
 *
 * */
class WaterfallPoint extends ColumnPoint {

    /* *
     *
     * Properties
     *
     * */
    public below?: boolean;

    public isIntermediateSum?: boolean;

    public isSum?: boolean;

    public minPointLengthOffset?: number;

    public options: WaterfallPointOptions = void 0 as any;

    public series: WaterfallSeries = void 0 as any;

    public y: any;

    /* *
     *
     * Functions
     *
     * */
    public getClassName(): string {
        let className = super.getClassName.call(this);

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
 * Export
 *
 * */
export default WaterfallPoint;
