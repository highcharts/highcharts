/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Grzegorz Blachlinski, Sebastian Bochan
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

    public collisionNmb?: number;

    public dataLabelOnNull?: boolean;

    public degree!: number;

    public dispX?: number;

    public dispY?: number;

    public fixedPosition: DragNodesPoint['fixedPosition'];

    public isParentNode?: boolean;

    public mass!: number;

    public neighbours?: number;

    public prevX?: number;

    public prevY?: number;

    public radius!: number;

    public removed?: boolean;

    public options!: PackedBubblePointOptions;

    public series!: PackedBubbleSeries;

    public seriesIndex?: number;

    public value?: (number|null);

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

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

    public setState(
        state?: StatesOptionsKey,
        move?: boolean
    ): void {
        if (this?.graphic?.parentGroup?.element) {
            super.setState(state, move);
        }
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Class Prototype
 *
 * */

interface PackedBubblePoint extends NetworkgraphPoint {
    className: BubblePointType['className'];
    fromNode: NetworkgraphPoint;
    linksFrom: Array<NetworkgraphPoint>;
    linksTo: Array<NetworkgraphPoint>;
    toNode: NetworkgraphPoint;
    isValid: NetworkgraphPoint['isValid'];
    remove: BubblePointType['remove'];
}

/* *
 *
 *  Default Export
 *
 * */

export default PackedBubblePoint;
