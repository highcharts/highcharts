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
import Point from '../../Core/Series/Point.js';
import { Palette } from '../../Core/Color/Palettes';
const { merge, addEvent, pick } = U;
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
    public collapsed?: boolean;
    public node: TreegraphNode.Node = void 0 as any;
    public level?: number;
    public linkToParent?: TreegraphLink;

    draw(): void {
        super.draw.apply(this, arguments);
        this.renderCollapseButton();
    }

    renderCollapseButton(): void {
        const point = this,
            series = point.series,
            parentGroup = point.graphic && point.graphic.parentGroup,
            levelOptions =
                (series.mapOptionsToLevel as any)[point.node.level || 0] || {},
            btnOptions = merge(
                series.options.collapseButton,
                levelOptions.collapseButton,
                point.series.options.collapseButton
            ) as CollapseButtonOptions,
            { width, height, padding } = btnOptions,
            chart = this.series.chart;
        if (!point.shapeArgs) {
            return;
        }

        this.options.collapseButton = btnOptions;
        if (!point.collapseButton) {
            if (!point.node.children.length || !btnOptions.enabled) {
                return;
            }
            let { x, y } = this.getCollapseBtnPosition(btnOptions);
            point.collapseButton = chart.renderer
                .label(
                    point.collapsed ? '+' : '-',
                    x,
                    y,
                    'circle'
                )
                .attr({
                    height: height - 2 * padding,
                    width: width - 2 * padding,
                    padding: padding,
                    fill: Palette.neutralColor20,
                    stroke: Palette.neutralColor80,
                    'stroke-width': 1,
                    'text-align': 'center',
                    align: 'center',
                    zIndex: 1
                })
                .addClass('highcharts-tracker')
                .removeClass('highcharts-no-tooltip')
                .add(parentGroup);

            (point.collapseButton.element as any).point = point;

            if (btnOptions.onlyOnHover && !point.collapsed) {
                point.collapseButton.hide();
            }
        } else {
            if (!point.node.children.length || !btnOptions.enabled) {
                point.collapseButton.destroy();
                delete point.collapseButton;
            } else {
                const { x, y } = this.getCollapseBtnPosition(btnOptions);
                point.collapseButton
                    .attr({
                        text: point.collapsed ? '+' : '-',
                        rotation: chart.inverted ? 90 : 0,
                        visibility:
                            point.visible &&
                            (!btnOptions.onlyOnHover ||
                                point.state === 'hover' ||
                                point.collapsed) ?
                                'inherit' :
                                'hidden'
                    })
                    .animate({ x, y });
            }
        }
    }

    toggleCollapse(state?: boolean): void {
        this.collapsed = pick(state, !this.collapsed);
        this.series.redraw();
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
            chart = point.series.chart,
            inverted = chart.inverted,
            btnWidth = btnOptions.width,
            btnHeight = btnOptions.height,
            { x, y, width, height } = point.getPointAttribs();
        return {
            x:
                x +
                btnOptions.x +
                (inverted ? btnWidth * -0.7 : width + btnWidth * -0.3),
            y: y + height / 2 - btnHeight / 2 + btnOptions.y
        };
    }
    public setState(): void {
        Point.prototype.setState.apply(this, arguments);
    }
}

addEvent(TreegraphPoint, 'mouseOut', function (): void {
    const btn = this.collapseButton,
        btnOptions = this.options.collapseButton;
    if (btn && btnOptions && btnOptions.onlyOnHover && !this.collapsed) {
        btn.hide();
    }
});

addEvent(TreegraphPoint, 'mouseOver', function (): void {
    if (this.collapseButton) {
        this.collapseButton.show();
    }
});

// Handle showing and hiding of the points
addEvent(TreegraphPoint, 'click', function (): void {
    this.toggleCollapse();
});
/* *
 *
 *  Export Default
 *
 * */

export default TreegraphPoint;
