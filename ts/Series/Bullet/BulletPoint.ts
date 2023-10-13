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

import ColumnSeries from '../Column/ColumnSeries.js';
import SVGElement from '../../Core/Renderer/SVG/SVGElement.js';

/* *
 *
 *  Class
 *
 * */

class BulletPoint extends ColumnSeries.prototype.pointClass {

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
        const series = this;

        if (series.targetGraphic) {
            series.targetGraphic = series.targetGraphic.destroy();
        }
        super.destroy.apply(series, arguments);
        return;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default BulletPoint;
