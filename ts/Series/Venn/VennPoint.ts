/* *
 *
 *  Imports
 *
 * */

import type VennPointOptions from './VennPointOptions';
import type VennSeries from './VennSeries';
import DrawPointMixin from '../../Mixins/DrawPoint.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        scatter: ScatterSeries
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const {
    extend,
    isNumber
} = U;

/* *
 *
 *  Class
 *
 * */

class VennPoint extends ScatterSeries.prototype.pointClass implements DrawPointMixin.DrawPoint {

    /* *
     *
     *  Properties
     *
     * */

    public options: VennPointOptions = void 0 as any;

    public series: VennSeries = void 0 as any;

    public sets?: Array<string>;

    public value?: number;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    public isValid(): boolean {
        return isNumber(this.value);
    }

    public shouldDraw(): boolean {
        var point = this;

        // Only draw points with single sets.
        return !!point.shapeArgs;
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Prototype Properties
 *
 * */

interface VennPoint {
    draw: typeof DrawPointMixin.drawPoint;
}
extend(VennPoint.prototype, {
    draw: DrawPointMixin.drawPoint
});

/* *
 *
 *  Default Export
 *
 * */

export default VennPoint;
