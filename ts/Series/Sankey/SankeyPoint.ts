/* *
 *
 *  Sankey diagram module
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
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

import type SankeyPointOptions from './SankeyPointOptions';
import type SankeySeries from './SankeySeries';

import NodesComposition from '../NodesComposition.js';
import Point from '../../Core/Series/Point.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    column: ColumnSeries
} = SeriesRegistry.seriesTypes;
import U from '../../Core/Utilities.js';
const { defined } = U;

/* *
 *
 *  Class
 *
 * */

class SankeyPoint extends ColumnSeries.prototype.pointClass {

    /* *
     *
     *  Properties
     *
     * */

    public className!: string;

    public column?: number;

    public fromNode!: SankeyPoint;

    public hangsFrom?: SankeyPoint;

    public level!: number;

    public linkBase!: Array<number>;

    public linkColorMode!: ('from'|'gradient'|'to');

    public linksFrom!: Array<SankeyPoint>;

    public linksTo!: Array<SankeyPoint>;

    public mass!: number;

    public nodeX!: number;

    public nodeY!: number;

    public options!: SankeyPointOptions;

    public outgoing?: boolean;

    public series!: SankeySeries;

    public sum?: number;

    public toNode!: SankeyPoint;

    public weight?: number;

    public toggleDisabled(): void {
        if (!this.isNode) {
            return;
        }

        const series = this.series;

        if (series.options.allowNodeToggle === false) {
            return;
        }

        for (const node of series.nodes) {
            if (!defined(node.options.column) && defined(node.column)) {
                node.options.column = node.column;
            }
        }

        const disabled = !this.options.disabled;
        this.options.disabled = disabled;

        if (series.options.nodes) {
            const nodeOptions = series.options.nodes.find(
                (node): boolean => node.id === this.id
            );
            if (nodeOptions) {
                nodeOptions.disabled = disabled;
            }

            for (const nodeOptionsItem of series.options.nodes) {
                const node = series.nodes.find(
                    (point): boolean => point.id === nodeOptionsItem.id
                );
                if (
                    node &&
                    !defined(nodeOptionsItem.column) &&
                    defined(node.column)
                ) {
                    nodeOptionsItem.column = node.column;
                }
            }
        }

        series.redraw();
    }

    /* *
     *
     *  Functions
     *
     * */

    /**
     * @private
     */
    public applyOptions(
        options: SankeyPointOptions,
        x?: number
    ): SankeyPoint {
        Point.prototype.applyOptions.call(this, options, x);

        // Treat point.level as a synonym of point.column
        if (defined(this.options.level)) {
            this.options.column = this.column = this.options.level;
        }
        return this;
    }

    /**
     * @private
     */
    public getClassName(): string {
        return (
            (this.isNode ? 'highcharts-node ' : 'highcharts-link ') +
            (this.isNode && this.options.disabled ?
                'highcharts-node-disabled ' : '') +
            Point.prototype.getClassName.call(this)
        );
    }

    /**
     * If there are incoming links, place it to the right of the
     * highest order column that links to this one.
     *
     * @private
     */
    public getFromNode(): { fromNode?: SankeyPoint, fromColumn: number } {
        const node = this;

        const isLinkDisabled = (link: SankeyPoint): boolean => !!(
            link.fromNode?.options?.disabled ||
            link.toNode?.options?.disabled
        );

        let fromColumn = -1,
            fromNode;

        for (let i = 0; i < node.linksTo.length; i++) {
            const point = node.linksTo[i];
            if (isLinkDisabled(point)) {
                continue;
            }
            if (
                (point.fromNode.column as any) > fromColumn &&
                point.fromNode !== node // #16080
            ) {
                fromNode = point.fromNode;
                fromColumn = (fromNode.column as any);
            }
        }

        return { fromNode, fromColumn };
    }

    /**
     * Calculate node.column if it's not set by user
     * @private
     */
    public setNodeColumn(): void {
        const node = this;

        if (!defined(node.options.column)) {
            const activeLinksTo = node.linksTo.filter(
                (link): boolean => !(
                    link.fromNode?.options?.disabled ||
                    link.toNode?.options?.disabled
                )
            );
            // No links to this node, place it left
            if (activeLinksTo.length === 0) {
                node.column = 0;
            } else {
                node.column = node.getFromNode().fromColumn + 1;
            }
        }
    }


    /**
     * @private
     */
    public isValid(): boolean {
        return this.isNode || typeof this.weight === 'number';
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface SankeyPoint extends NodesComposition.PointComposition {
}

/* *
 *
 *  Default Export
 *
 * */

export default SankeyPoint;
