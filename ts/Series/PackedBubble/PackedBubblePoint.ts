/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Grzegorz Blachliński, Sebastian Bochan
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

import type BubblePointType from '../Bubble/BubblePoint';
import type { DragNodesPoint } from '../DragNodesComposition';
import type NetworkgraphPoint from '../Networkgraph/NetworkgraphPoint';
import type PackedBubblePointOptions from './PackedBubblePointOptions';
import type PackedBubbleSeries from './PackedBubbleSeries';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';

import Chart from '../../Core/Chart/Chart.js';
import Point from '../../Core/Series/Point.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        bubble: {
            prototype: {
                pointClass: BubblePoint
            }
        }
    }
} = SeriesRegistry;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/PointBase' {
    interface PointBase {
        degree?: number;
    }
}

/* *
 *
 *  Class
 *
 * */

class PackedBubblePoint extends BubblePoint implements DragNodesPoint {

    /* *
     *
     *  Properties
     *
     * */

    /** @internal */
    public collisionNmb?: number;

    /** @internal */
    public dataLabelOnNull?: boolean;

    /** @internal */
    public degree!: number;

    /** @internal */
    public dispX?: number;

    /** @internal */
    public dispY?: number;

    /** @internal */
    public fixedPosition: DragNodesPoint['fixedPosition'];

    /** @internal */
    public isParentNode?: boolean;

    /** @internal */
    public mass!: number;

    /** @internal */
    public neighbors?: number;

    /** @internal */
    public prevX?: number;

    /** @internal */
    public prevY?: number;

    /** @internal */
    public radius!: number;

    /** @internal */
    public removed?: boolean;

    public options!: PackedBubblePointOptions;

    /** @internal */
    public series!: PackedBubbleSeries;

    /** @internal */
    public seriesIndex?: number;

    /** @internal */
    public value?: (number|null);

    /* *
     *
     *  Functions
     *
     * */


    /**
     * Destroy point.
     * Then remove point from the layout.
     * @private
     */
    public destroy(): void {
        if (this.series?.layout) {
            this.series.layout.removeElementFromCollection(
                this,
                this.series.layout.nodes as Array<PackedBubblePoint>
            );
        }
        return Point.prototype.destroy.apply(this, arguments as any);
    }

    /** @internal */
    public firePointEvent(): void {
        const series = this.series,
            seriesOptions = series.options;

        if (this.isParentNode && seriesOptions.parentNode) {
            const temp = seriesOptions.allowPointSelect;
            seriesOptions.allowPointSelect = (
                seriesOptions.parentNode.allowPointSelect
            );
            Point.prototype.firePointEvent.apply(this, arguments);
            seriesOptions.allowPointSelect = temp;
        } else {
            Point.prototype.firePointEvent.apply(this, arguments);
        }
    }

    /** @internal */
    public select(): void {
        const point = this,
            series = this.series,
            chart = series.chart;
        if (point.isParentNode) {
            chart.getSelectedPoints = chart.getSelectedParentNodes;
            Point.prototype.select.apply(this, arguments);
            chart.getSelectedPoints = Chart.prototype.getSelectedPoints;
        } else {
            Point.prototype.select.apply(this, arguments);
        }
    }

    /** @internal */
    public setState(
        state?: StatesOptionsKey,
        move?: boolean
    ): void {
        if (this?.graphic?.parentGroup?.element) {
            super.setState(state, move);
        }
    }


}

/* *
 *
 *  Class Prototype
 *
 * */

interface PackedBubblePoint extends NetworkgraphPoint {
    /** @internal */
    className: BubblePointType['className'];
    fromNode: NetworkgraphPoint;
    linksFrom: Array<NetworkgraphPoint>;
    linksTo: Array<NetworkgraphPoint>;
    toNode: NetworkgraphPoint;
    isValid: NetworkgraphPoint['isValid'];
    /** @internal */
    remove: BubblePointType['remove'];
}

/* *
 *
 *  Default Export
 *
 * */

export default PackedBubblePoint;
