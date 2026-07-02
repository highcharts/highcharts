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

import type BulletPointOptions from './BulletPointOptions';
import type BulletSeries from './BulletSeries';

import ColumnSeries from '../Column/ColumnSeries.js';
import SVGElement from '../../Core/Renderer/SVG/SVGElement.js';

/* *
 *
 *  Class
 *
 * */

/** @internal */
class BulletPoint extends ColumnSeries.prototype.pointClass {

    /* *
     *
     *  Properties
     *
     * */

    public borderColor: BulletPointOptions['borderColor'];
    public options!: BulletPointOptions;
    public series!: BulletSeries;
    public target?: number;
    public targetGraphic?: SVGElement;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Destroys target graphic.
     * @internal
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

/** @internal */
export default BulletPoint;
