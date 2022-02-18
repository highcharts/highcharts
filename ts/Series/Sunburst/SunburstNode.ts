import TreemapNode from '../Treemap/TreemapNode.js';
import SunburstSeriesOptions from './SunburstSeriesOptions.js';
import ColorType from '../../Core/Color/ColorType.js';
import SunburstSeries from './SunburstSeries.js';
import CU from '../CenteredUtilities.js';
import TU from '../TreeUtilities.js';
namespace SunburstNode {
    export interface NodeValuesObject
        extends CU.RadianAngles,
        TreemapNode.NodeValuesObject,
        TU.SetTreeValuesOptions<SunburstSeries> {
        color: ColorType;
        mapOptionsToLevel: SunburstSeriesOptions['levels'];
        index: number;
        innerR: number;
        r: number;
        radius: number;
        siblings: number;
    }
    export class Node extends TreemapNode.Node {
        children: Array<Node> = void 0 as any;
        color?: ColorType;
        colorIndex?: number;
        shapeArgs?: NodeValuesObject;
        series: SunburstSeries = void 0 as any;
        sliced?: boolean;
        values?: NodeValuesObject;
    }
}
export default SunburstNode;
