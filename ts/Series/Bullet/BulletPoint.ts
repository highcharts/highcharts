/* *
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

import type BulletPointOptions from './BulletPointOptions';
import type BulletSeries from './BulletSeries';
import type ColumnPointType from '../Column/ColumnPoint';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const ColumnPoint: typeof ColumnPointType =
    SeriesRegistry.seriesTypes.column.prototype.pointClass;
import SVGElement from '../../Core/Renderer/SVG/SVGElement.js';

/* *
 *
 *  Class
 *
 * */

class BulletPoint extends ColumnPoint {

    /* *
     *
     *  Properties
     *
     * */

    public borderColor: BulletPointOptions['borderColor'];
    public options: BulletPointOptions = void 0 as any;
    public series: BulletSeries = void 0 as any;
    public target?: number;
    public targetGraphic?: SVGElement;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Destroys target graphic.
     * @private
     */
    public destroy(): undefined {
        if (this.targetGraphic) {
            this.targetGraphic = this.targetGraphic.destroy() as any;
        }
        super.destroy.apply(this, arguments);
        return;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default BulletPoint;
