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
import Chart from '../../Core/Chart/Chart.js';
import H from '../../Core/Globals.js';
import '../../Series/Networkgraph/Layouts.js';
const Reingold = H.layouts['reingold-fruchterman'];
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
        getSelectedParentNodes(): Array<PackedBubblePoint>;
    }
}

/* *
 *
 *  Composition
 *
 * */

Chart.prototype.getSelectedParentNodes = function (): Array<PackedBubblePoint> {
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
        var layout = this,
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
        var factor = (
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

H.layouts.packedbubble = extendClass(
    Reingold,
    {
        beforeStep: function (this: PackedBubbleLayout): void {
            if (this.options.marker) {
                this.series.forEach(function (series): void {
                    if (series) {
                        (series as any).calculateParentRadius();
                    }
                });
            }
        },
        isStable: function (this: PackedBubbleLayout): boolean { // #14439, new stable check.
            var tempDiff = Math.abs(
                (this.prevSystemTemperature as any) -
                (this.systemTemperature as any)
            );

            var upScaledTemperature = 10 * (this.systemTemperature as any) /
                Math.sqrt(this.nodes.length);

            return Math.abs(upScaledTemperature) < 1 &&
                tempDiff < 0.00001 ||
                (this.temperature as any) <= 0;
        },
        setCircularPositions: function (this: PackedBubbleLayout): void {
            var layout = this,
                box = layout.box,
                nodes = layout.nodes,
                nodesLength = nodes.length + 1,
                angle = 2 * Math.PI / nodesLength,
                centerX,
                centerY,
                radius = layout.options.initialPositionRadius;
            nodes.forEach(function (node, index): void {
                if (
                    layout.options.splitSeries &&
                    !node.isParentNode
                ) {
                    centerX = (node.series.parentNode as any).plotX;
                    centerY = (node.series.parentNode as any).plotY;
                } else {
                    centerX = box.width / 2;
                    centerY = box.height / 2;
                }

                node.plotX = node.prevX = pick(
                    node.plotX,
                    (centerX as any) +
                    (radius as any) * Math.cos(node.index || index * angle)
                );

                node.plotY = node.prevY = pick(
                    node.plotY,
                    (centerY as any) +
                    (radius as any) * Math.sin(node.index || index * angle)
                );

                node.dispX = 0;
                node.dispY = 0;
            });
        },
        repulsiveForces: function (this: PackedBubbleLayout): void {
            var layout = this,
                force,
                distanceR,
                distanceXY,
                bubblePadding = layout.options.bubblePadding;

            layout.nodes.forEach(function (node): void {
                node.degree = node.mass;
                node.neighbours = 0;
                layout.nodes.forEach(function (repNode): void {
                    force = 0;
                    if (
                        // Node can not repulse itself:
                        node !== repNode &&
                        // Only close nodes affect each other:

                        // Not dragged:
                        !node.fixedPosition &&
                        (
                            layout.options.seriesInteraction ||
                            node.series === repNode.series
                        )
                    ) {
                        distanceXY = layout.getDistXY(node, repNode);
                        distanceR = (
                            layout.vectorLength(distanceXY) -
                            (
                                (node.marker as any).radius +
                                (repNode.marker as any).radius +
                                bubblePadding
                            )
                        );
                        // TODO padding configurable
                        if (distanceR < 0) {
                            (node.degree as any) += 0.01;
                            (node.neighbours as any)++;
                            force = layout.repulsiveForce(
                                -distanceR / Math.sqrt(node.neighbours as any),
                                layout.k,
                                node,
                                repNode
                            );
                        }

                        layout.force(
                            'repulsive',
                            node,
                            force * repNode.mass,
                            distanceXY,
                            repNode,
                            distanceR
                        );
                    }
                });
            });
        },
        applyLimitBox: function (
            this: PackedBubbleLayout,
            node: PackedBubblePoint
        ): void {
            var layout = this,
                distanceXY,
                distanceR,
                factor = 0.01;

            // parentNodeLimit should be used together
            // with seriesInteraction: false
            if (
                layout.options.splitSeries &&
                !node.isParentNode &&
                layout.options.parentNodeLimit
            ) {
                distanceXY = layout.getDistXY(
                    node,
                    node.series.parentNode as any
                );
                distanceR = (
                    (node.series.parentNodeRadius as any) -
                    (node.marker as any).radius -
                    layout.vectorLength(distanceXY)
                );
                if (
                    distanceR < 0 &&
                    distanceR > -2 * (node.marker as any).radius
                ) {
                    (node.plotX as any) -= distanceXY.x * factor;
                    (node.plotY as any) -= distanceXY.y * factor;
                }
            }

            Reingold.prototype.applyLimitBox.apply(this, arguments as any);
        }
    }
);

// Remove accumulated data points to redistribute all of them again
// (i.e after hiding series by legend)

addEvent(Chart as any, 'beforeRedraw', function (
    this: PackedBubbleChart
): void {
    // eslint-disable-next-line no-invalid-this
    if (this.allDataPoints) {
        // eslint-disable-next-line no-invalid-this
        delete this.allDataPoints;
    }
});
