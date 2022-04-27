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
import U from '../../Core/Utilities.js';
import { CollapseButtonOptions } from './TreegraphSeriesOptions';
const { merge } = U;
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

interface ShapeArgs {
    x: number;
    y: number;
    height: number;
    width: number;
}

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
        const point = this,
            series = point.series,
            levelOptions =
                (series.mapOptionsToLevel as any)[point.node.level || 0] || {},
            btnOptions = merge(
                series.options.collapseButton,
                levelOptions.collapseButton,
                point.series.options.collapseButton
            ) as CollapseButtonOptions,
            chart = this.series.chart;
        if (!point.shapeArgs) {
            return;
        }

        if (!point.collapseButton) {
            if (!point.node.children.length || !btnOptions.enabled) {
                return;
            }
            let { x, y } = this.getCollapseBtnPosition(btnOptions);
            point.collapseButton = chart.renderer
                .button(
                    point.collapsed ? '+' : '-',
                    x,
                    y,
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
                .attr({
                    height: btnOptions.height,
                    width: btnOptions.width
                })
                .add()
                .toFront();
        } else {
            if (!point.node.children.length || !btnOptions.enabled) {
                point.collapseButton.destroy();
                delete point.collapseButton;
            } else {
                const { x, y } = this.getCollapseBtnPosition(btnOptions);
                point.collapseButton
                    .attr({
                        text: point.collapsed ? '+' : '-',
                        visibility: point.visible ? 'inherit' : 'hidden'
                    })
                    .animate({ x, y });
            }
        }
    }

    shouldDraw(): boolean {
        return super.shouldDraw() && this.visible;
    }
    getPointAttribs(): ShapeArgs {
        return this.shapeArgs ? {
            x: this.shapeArgs.x || 0,
            y: this.shapeArgs.y || 0,
            height: this.shapeArgs.height || 0,
            width: this.shapeArgs.width || 0
        } : {
            x: 0,
            y: 0,
            height: 0,
            width: 0
        };
    }

    getCollapseBtnPosition(btnOptions: CollapseButtonOptions): {
        x: number;
        y: number;
    } {
        const point = this,
            chart = this.series.chart,
            inverted = chart.inverted,
            plotSizeX = chart.plotSizeX || 0,
            plotSizeY = chart.plotSizeY || 0,
            btnWidth = btnOptions.width,
            btnHeight = btnOptions.height,
            { x, y, width, height } = point.getPointAttribs();
        return inverted ? {
            x:
                plotSizeY -
                y +
                chart.plotLeft -
                height / 2 -
                btnWidth * 2 +
                btnOptions.x,
            y: plotSizeX - x + chart.plotTop + btnOptions.y
        } : {
            x: x + chart.plotLeft + width + btnOptions.x,
            y:
                y +
                chart.plotTop +
                height / 2 -
                btnHeight * 2 +
                btnOptions.y
        };
    }
}
/* *
 *
 *  Export Default
 *
 * */

export default TreegraphPoint;
