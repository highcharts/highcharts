/* *
 *
 *  Sankey diagram module
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
import NodesMixin from '../../Mixins/Nodes.js';
import Point from '../../Core/Series/Point.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        column: ColumnSeries
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const {
    defined,
    extend
} = U;

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

    public className: string = void 0 as any;

    public column?: number;

    public fromNode: SankeyPoint = void 0 as any;

    public hangsFrom?: SankeyPoint;

    public level: number = void 0 as any;

    public linkBase: Array<number> = void 0 as any;

    public linksFrom: Array<SankeyPoint> = void 0 as any;

    public linksTo: Array<SankeyPoint> = void 0 as any;

    public mass: number = void 0 as any;

    public nodeX: number = void 0 as any;

    public nodeY: number = void 0 as any;

    public options: SankeyPointOptions = void 0 as any;

    public outgoing?: boolean;

    public series: SankeySeries = void 0 as any;

    public sum?: number;

    public toNode: SankeyPoint = void 0 as any;

    public weight?: number;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

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
     * @private
     */
    public isValid(): boolean {
        return this.isNode || typeof this.weight === 'number';
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Prototype Properties
 *
 * */

interface SankeyPoint extends Highcharts.NodesPoint {
    init(series: SankeySeries, options: SankeyPointOptions): SankeyPoint;
    setState: Highcharts.NodesMixin['setNodeState'];
}
extend(SankeyPoint.prototype, {
    setState: NodesMixin.setNodeState
});

/* *
 *
 *  Default Export
 *
 * */

export default SankeyPoint;
