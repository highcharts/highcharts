import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    scatter: { prototype: { pointClass: ScatterPoint } }
} = SeriesRegistry.seriesTypes;
import U from '../../Core/Utilities.js';
const {
    extend
} = U;
class ContourPoint extends ScatterPoint {

    public value!: (number|null);

    public x!: number;

    public y!: number;


}

extend(ContourPoint.prototype, {
    dataLabelOnNull: true,
    ttBelow: false
});

export default ContourPoint;
