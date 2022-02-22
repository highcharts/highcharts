import Point from '../../Core/Series/Point.js';
import TreegraphSeries from './TreegraphSeries.js';
import PointOptions from '../../Core/Series/PointOptions.js';


class LinkPoint extends Point {
    fromNode: Point = void 0 as any;
    toNode: Point = void 0 as any;
    node = {};
    isLink = true;
}


export default LinkPoint;
