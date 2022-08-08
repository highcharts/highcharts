/* *
 *
 *  (c) 2010-2021 Grzegorz Blachlinski, Sebastian Bochan
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

import type PackedBubbleChart from './PackedBubbleChart';
import type PackedBubbleLayout from './PackedBubbleLayout';
import type PackedBubblePoint from './PackedBubblePoint';
import type PackedBubbleSeries from './PackedBubbleSeries';
import type Point from '../../Core/Series/Point';

import Chart from '../../Core/Chart/Chart.js';
import H from '../../Core/Globals.js';
import '../Networkgraph/Layouts.js';
import PBLayout from './PackedBubbleLay.js';
import RFLayout from '../Networkgraph/ReingoldFruchtermanLayout.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    extendClass,
    pick
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Chart/ChartLike' {
    interface ChartLike {
        getSelectedParentNodes(): Array<Point>;
    }
}

/* *
 *
 *  Composition
 *
 * */

Chart.prototype.getSelectedParentNodes = function (): Array<Point> {
    const chart = this,
        series = chart.series as Array<PackedBubbleSeries>,
        selectedParentsNodes: Array<PackedBubblePoint> = [];

    series.forEach((series): void => {
        if (series.parentNode && series.parentNode.selected) {
            selectedParentsNodes.push(series.parentNode);
        }
    });
    return selectedParentsNodes;
};


(H.networkgraphIntegrations as any).packedbubble = {
    repulsiveForceFunction: function (
        d: number,
        k: number,
        node: PackedBubblePoint,
        repNode: PackedBubblePoint
    ): number {
        return Math.min(
            d,
            ((node.marker as any).radius + (repNode.marker as any).radius) / 2
        );
    },
    barycenter: function (this: PackedBubbleLayout): void {
        let layout = this,
            gravitationalConstant = layout.options.gravitationalConstant,
            box = layout.box,
            nodes = layout.nodes,
            centerX,
            centerY;

        nodes.forEach(function (node): void {
            if (layout.options.splitSeries && !node.isParentNode) {
                centerX = (node.series.parentNode as any).plotX;
                centerY = (node.series.parentNode as any).plotY;
            } else {
                centerX = box.width / 2;
                centerY = box.height / 2;
            }
            if (!node.fixedPosition) {
                (node.plotX as any) -=
                    ((node.plotX as any) - (centerX as any)) *
                    (gravitationalConstant as any) /
                    (node.mass * Math.sqrt(nodes.length));

                (node.plotY as any) -=
                    ((node.plotY as any) - (centerY as any)) *
                    (gravitationalConstant as any) /
                    (node.mass * Math.sqrt(nodes.length));
            }
        });
    },

    repulsive: function (
        this: PackedBubbleLayout,
        node: PackedBubblePoint,
        force: number,
        distanceXY: Record<string, number>,
        repNode: PackedBubblePoint
    ): void {
        const factor = (
                force * (this.diffTemperature as any) / (node.mass as any) /
                (node.degree as any)
            ),
            x = distanceXY.x * factor,
            y = distanceXY.y * factor;

        if (!node.fixedPosition) {
            (node.plotX as any) += x;
            (node.plotY as any) += y;
        }
        if (!repNode.fixedPosition) {
            (repNode.plotX as any) -= x;
            (repNode.plotY as any) -= y;
        }
    },
    integrate: H.networkgraphIntegrations.verlet.integrate,
    getK: H.noop
};

H.layouts.packedbubble = PBLayout;

// Remove accumulated data points to redistribute all of them again
// (i.e after hiding series by legend)

addEvent(Chart as any, 'beforeRedraw', function (
    this: PackedBubbleChart
): void {
    if (this.allDataPoints) {
        delete (this as Partial<typeof this>).allDataPoints;
    }
});
