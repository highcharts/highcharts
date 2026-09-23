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

/** @internal */
class SankeyPoint extends ColumnSeries.prototype.pointClass {

    /* *
     *
     *  Properties
     *
     * */

    /** @internal */
    public className!: string;

    /** @internal */
    public column?: number;

    /** @internal */
    public fromNode!: SankeyPoint;

    /** @internal */
    public hangsFrom?: SankeyPoint;

    /** @internal */
    public isCircular?: boolean;

    public level!: number;

    /** @internal */
    public linkBase!: Array<number>;

    /** @internal */
    public linkColorMode!: ('from'|'gradient'|'to');

    /** @internal */
    public linksFrom!: Array<SankeyPoint>;

    /** @internal */
    public linksTo!: Array<SankeyPoint>;

    /** @internal */
    public mass!: number;

    /** @internal */
    public nodeX!: number;

    /** @internal */
    public nodeY!: number;

    public options!: SankeyPointOptions;

    /** @internal */
    public outgoing?: boolean;

    /** @internal */
    public series!: SankeySeries;

    /** @internal */
    public sum?: number;

    /** @internal */
    public toNode!: SankeyPoint;

    /** @internal */
    public weight?: number;

    /**
     * Depth of a backward link's lane from the plot edge it runs along.
     * @internal
     */
    public wrapLane?: number;

    /**
     * Flow-axis room a node reserves in its column for its self-link laps.
     * @internal
     */
    public wrapLap?: number;

    /** @internal */
    public wrapUp?: boolean;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * @internal
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
     * @internal
     */
    public getClassName(): string {
        return (this.isNode ? 'highcharts-node ' : 'highcharts-link ') +
        Point.prototype.getClassName.call(this);
    }

    /**
     * If there are incoming links, place it to the right of the
     * highest order column that links to this one. Circular links are
     * ignored, so a node reached only through a cycle still anchors to its
     * non-circular predecessors (or column 0 when it has none).
     *
     * @internal
     */
    public getFromNode(): { fromNode?: SankeyPoint, fromColumn: number } {
        const node = this;

        let fromColumn = -1,
            fromNode;

        for (let i = 0; i < node.linksTo.length; i++) {
            const point = node.linksTo[i],
                // A link may be missing its `from` end
                column = point.fromNode?.column;

            if (
                defined(column) &&
                column > fromColumn &&
                point.fromNode !== node && // #16080
                !point.isCircular
            ) {
                fromNode = point.fromNode;
                fromColumn = column;
            }
        }

        return { fromNode, fromColumn };
    }

    /**
     * Calculate node.column if it's not set by user
     * @internal
     */
    public setNodeColumn(): void {
        const node = this;

        if (!defined(node.options.column)) {
            // No links to this node, place it left
            if (node.linksTo.length === 0) {
                node.column = 0;
            } else {
                node.column = node.getFromNode().fromColumn + 1;
            }
        }
    }


    /**
     * @internal
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

/** @internal */
interface SankeyPoint extends NodesComposition.PointComposition {
}

/* *
 *
 *  Default Export
 *
 * */

export default SankeyPoint;
