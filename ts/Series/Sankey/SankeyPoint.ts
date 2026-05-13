/* *
 *
 *  Sankey diagram module
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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
import { defined } from '../../Shared/Utilities.js';
const {
    column: ColumnSeries
} = SeriesRegistry.seriesTypes;

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
        return (this.isNode ? 'highcharts-node ' : 'highcharts-link ') +
        Point.prototype.getClassName.call(this);
    }

    /**
     * If there are incoming links, place it to the right of the
     * highest order column that links to this one.
     *
     * @param {Array<SankeyPoint>} [links] Optional array of links.
     * @internal
     */
    public getFromNode(links?: Array<SankeyPoint>): { fromNode?: SankeyPoint, fromColumn: number } {
        const node = this;
        const linksTo = links || node.linksTo;

        let fromColumn = -1,
            fromNode;

        for (let i = 0; i < linksTo.length; i++) {
            const point = linksTo[i];

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
            let straightLinksTo = node.linksTo;

            // Filter out circular links
            if (node.series.isCircular) {
                straightLinksTo = node.linksTo.filter((link): boolean => (
                    !defined(link.toNode.nodeX) ||
                    !defined(link.fromNode.nodeX) ||
                    link.toNode.nodeX >
                        link.fromNode.nodeX + node.series.nodeWidth
                ));
            }

            // No straight links to this node, place it left
            if (straightLinksTo.length === 0) {
                node.column = 0;
            } else {
                node.column = node.getFromNode(straightLinksTo).fromColumn + 1;
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
