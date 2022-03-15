import type PointOptions from '../../Core/Series/PointOptions.js';
import type TreegraphSeries from './TreegraphSeries';
import type { LinkOptions } from '../Organization/OrganizationSeriesOptions.js';
import Point from '../../Core/Series/Point.js';
import TreegraphPoint from './TreegraphPoint.js';
import TreegraphPointOptions from './TreegraphPointOptions.js';
import U from '../../Core/Utilities.js';
const { pick, extend } = U;

export interface LinkPointOptions extends TreegraphPointOptions {
    link?: LinkOptions
}
class LinkPoint extends Point {
    options: LinkPointOptions = void 0 as any;
    fromNode: Point = void 0 as any;
    toNode: Point = void 0 as any;
    isLink = true;
    node = {};
    formatPrefix = 'link';
    dataLabelOnNull = true;

    public init(
        series: TreegraphSeries,
        options: string | number | PointOptions | (string | number | null)[],
        x?: number,
        point?: TreegraphPoint
    ): LinkPoint {
        const link = super.init.apply(this, arguments) as LinkPoint;
        this.formatPrefix = 'link';
        this.dataLabelOnNull = true;

        if (point) {
            link.fromNode = point.node.parentNode.point;
            link.toNode = point;
            this.id = link.toNode.id + '-' + link.fromNode.id;
        }
        return link;
    }

    public update(
        options: TreegraphPointOptions | LinkPointOptions,
        redraw?: boolean,
        animation?: boolean,
        runEvent?: boolean
    ): void {
        const oldOptions: Partial<this> = {
            id: this.id,
            formatPrefix: this.formatPrefix
        } as Partial<this>;

        Point.prototype.update.call(
            this,
            options,
            this.isLink ? false : redraw, // Hold the redraw for nodes
            animation,
            runEvent
        );

        extend(this, oldOptions);
        if (pick(redraw, true)) {
            this.series.chart.redraw(animation);
        }
    }
}

export default LinkPoint;
