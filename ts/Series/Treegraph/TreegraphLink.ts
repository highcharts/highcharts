import type PointOptions from '../../Core/Series/PointOptions.js';
import type TreegraphSeries from './TreegraphSeries';
import Point from '../../Core/Series/Point.js';
import TreegraphPoint from './TreegraphPoint.js';

class LinkPoint extends Point {
    fromNode: Point = void 0 as any;
    toNode: Point = void 0 as any;
    node = {};
    isLink = true;
    formatPrefix = 'link';

    public init(
        series: TreegraphSeries,
        options: string | number | PointOptions | (string | number | null)[],
        x?: number,
        point?: TreegraphPoint
    ): LinkPoint {
        const link = super.init.apply(this, arguments) as LinkPoint;
        link.formatPrefix = 'link';
        link.dataLabelOnNull = true;
        if (point) {
            link.fromNode = point.node.parentNode.point;
            link.toNode = point;
        }
        return link;
    }
}


export default LinkPoint;
