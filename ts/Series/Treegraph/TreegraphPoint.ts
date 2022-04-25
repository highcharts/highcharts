/* *
 *
 *  (c) 2010-2022 Pawel Lysy Grzegorz Blachlinski
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type TreegraphPointOptions from './TreegraphPointOptions';
import type TreegraphSeries from './TreegraphSeries';
import type TreegraphNode from './TreegraphNode';
import type TreegraphLink from './TreegraphLink';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';

const {
    seriesTypes: {
        treemap: {
            prototype: {
                pointClass: TreemapPoint
            }
        }
    }
} = SeriesRegistry;


/* *
 *
 *  Class
 *
 * */

class TreegraphPoint extends TreemapPoint {
    public options: TreegraphPointOptions = void 0 as any;
    public isLink = false;
    public collapseButton?: SVGElement;
    public series: TreegraphSeries = void 0 as any;
    public collapsed: boolean = false;
    public node: TreegraphNode.Node = void 0 as any;
    public level?: number;
    public linkToParent?: TreegraphLink;

    draw(): void {
        super.draw.apply(this, arguments);
        const point = this;
        if (!point.shapeArgs) {
            return;
        }

        if (!point.collapseButton) {
            if (!point.node.children.length) {
                return;
            }
            const { x, y, width, height } = point.shapeArgs;
            point.collapseButton = this.series.chart.renderer
                .button(
                    point.collapsed ? '+' : '-',
                    (x || 0) + (width || 0) * 1.5,
                    (y || 0) + (height || 0),
                    function (): void {
                        point.collapsed = !point.collapsed;
                        point.series.redraw();
                    },
                    {},
                    void 0,
                    void 0,
                    void 0,
                    'circle'
                )
                .add()
                .toFront();
        } else {
            if (!point.node.children.length) {
                point.collapseButton.destroy();
                delete point.collapseButton;
            } else {
                const { x, y, width, height } = point.shapeArgs;
                point.collapseButton
                    .attr({
                        text: point.collapsed ? '+' : '-',
                        visibility: point.visible ? 'inherit' : 'hidden'
                    })
                    .animate({
                        x: (x || 0) + (width || 0) * 1.5,
                        y: (y || 0) + (height || 0)
                    });
            }
        }
    }

    shouldDraw(): boolean {
        return super.shouldDraw() && this.visible;
    }
}
/* *
 *
 *  Export Default
 *
 * */

export default TreegraphPoint;
