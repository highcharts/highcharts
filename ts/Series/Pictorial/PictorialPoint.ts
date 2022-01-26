/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type PictorialPointOptions from './PictorialPointOptions';
import type PictorialSeries from './PictorialSeries';
import ColumnSeries from '../Column/ColumnSeries.js';
import SVGElement from '../../Core/Renderer/SVG/SVGElement.js';

/* *
 *
 *  Class
 *
 * */

class PictorialPoint extends ColumnSeries.prototype.pointClass {

    /* *
     *
     * Properties
     *
     * */
    public options: PictorialPointOptions = void 0 as any;
    public series: PictorialSeries = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Destroys target graphic.
     * @private
     */
    public destroy(): void {
        super.destroy.apply(this, arguments);
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Export Default
 *
 * */
export default PictorialPoint;
