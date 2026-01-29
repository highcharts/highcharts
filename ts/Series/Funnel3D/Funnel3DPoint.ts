/* *
 *
 *  Highcharts funnel3d series module
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Kacper Madej
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

import type Funnel3DPointOptions from './Funnel3DPointOptions';
import type Funnel3DSeries from './Funnel3DSeries';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        column: ColumnSeries
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const { extend } = U;

/* *
 *
 *  Class
 *
 * */

class Funnel3DPoint extends ColumnSeries.prototype.pointClass {

    /* *
     *
     *  Properties
     *
     * */

    public dlBoxRaw!: Record<string, number>;

    public options!: Funnel3DPointOptions;

    public series!: Funnel3DSeries;

    public y!: number;

}

/* *
 *
 *  Class Prototype
 *
 * */

interface Funnel3DPoint {
    shapeType: string;
}
extend(Funnel3DPoint.prototype, {
    shapeType: 'funnel3d'
});

/* *
 *
 *  Default Export
 *
 * */

export default Funnel3DPoint;
