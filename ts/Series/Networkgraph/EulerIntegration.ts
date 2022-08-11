/* *
 *
 *  Networkgraph series
 *
 *  (c) 2010-2021 Paweł Fus
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

import type { DragNodesPoint } from '../DragNodesComposition';
import type { GraphIntegrationObject } from '../GraphLayoutComposition';
import type NetworkgraphPoint from './NetworkgraphPoint';
import type Point from '../../Core/Series/Point';
import type PositionObject from '../../Core/Renderer/PositionObject';
import type ReingoldFruchtermanLayout from './ReingoldFruchtermanLayout';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/PointLike' {
    interface PointLike {
        temperature?: number;
    }
}

/* *
 *
 *  Functions
 *
 * */

/**
 * Attractive force.
 *
 * In Euler integration, force is stored in a node, not changing it's
 * position. Later, in `integrate()` forces are applied on nodes.
 *
 * @private
 * @param {Highcharts.Point} link
 *        Link that connects two nodes
 * @param {number} force
 *        Force calcualated in `repulsiveForceFunction`
 * @param {Highcharts.PositionObject} distanceXY
 *        Distance between two nodes e.g. `{x, y}`
 * @param {number} distanceR
     */
function attractive(
    link: NetworkgraphPoint,
    force: number,
    distanceXY: PositionObject,
    distanceR: number
): void {
    const massFactor = link.getMass(),
        translatedX = (distanceXY.x / distanceR) * force,
        translatedY = (distanceXY.y / distanceR) * force;

    if (!link.fromNode.fixedPosition) {
        (link.fromNode.dispX as any) -=
            translatedX * massFactor.fromNode / link.fromNode.degree;
        (link.fromNode.dispY as any) -=
            translatedY * massFactor.fromNode / link.fromNode.degree;
    }

    if (!link.toNode.fixedPosition) {
        (link.toNode.dispX as any) +=
            translatedX * massFactor.toNode / link.toNode.degree;
        (link.toNode.dispY as any) +=
            translatedY * massFactor.toNode / link.toNode.degree;
    }
}

/**
 * Attractive force funtion. Can be replaced by API's
 * `layoutAlgorithm.attractiveForce`
 *
 * Other forces that can be used:
 *
 * basic, not recommended:
 *    `function (d, k) { return d / k }`
 *
 * @private
 * @param {number} d current distance between two nodes
 * @param {number} k expected distance between two nodes
 * @return {number} force
 */
function attractiveForceFunction(
    d: number,
    k: number
): number {
    return d * d / k;
}

/**
 * Barycenter force. Calculate and applys barycenter forces on the
 * nodes. Making them closer to the center of their barycenter point.
 *
 * In Euler integration, force is stored in a node, not changing it's
 * position. Later, in `integrate()` forces are applied on nodes.
 *
 * @private
 */
function barycenter(
    this: ReingoldFruchtermanLayout
): void {
    const gravitationalConstant = this.options.gravitationalConstant,
        xFactor = (this.barycenter as any).xFactor,
        yFactor = (this.barycenter as any).yFactor;

    this.nodes.forEach(function (node: Point): void {
        if (!(node as DragNodesPoint).fixedPosition) {
            const degree =
                    (node as NetworkgraphPoint).getDegree(),
                phi = degree * (1 + degree / 2);

            (node.dispX as any) += (
                (xFactor - (node.plotX as any)) *
                (gravitationalConstant as any) *
                phi / (node.degree as any)
            );
            (node.dispY as any) += (
                (yFactor - (node.plotY as any)) *
                (gravitationalConstant as any) *
                phi / (node.degree as any)
            );
        }
    });
}

/**
 * Estiamte the best possible distance between two nodes, making graph
 * readable.
 * @private
 */
function getK(
    layout: ReingoldFruchtermanLayout
): number {
    return Math.pow(
        layout.box.width * layout.box.height / layout.nodes.length,
        0.3
    );
}

/**
 * Integration method.
 *
 * In Euler integration, force were stored in a node, not changing it's
 * position. Now, in the integrator method, we apply changes.
 *
 * Euler:
 *
 * Basic form: `x(n+1) = x(n) + v(n)`
 *
 * With Rengoild-Fruchterman we get:
 * `x(n+1) = x(n) + v(n) / length(v(n)) * min(v(n), temperature(n))`
 * where:
 * - `x(n+1)`: next position
 * - `x(n)`: current position
 * - `v(n)`: velocity (comes from net force)
 * - `temperature(n)`: current temperature
 *
 * Known issues:
 * Oscillations when force vector has the same magnitude but opposite
 * direction in the next step. Potentially solved by decreasing force by
 * `v * (1 / node.degree)`
 *
 * Note:
 * Actually `min(v(n), temperature(n))` replaces simulated annealing.
 *
 * @private
 * @param {Highcharts.NetworkgraphLayout} layout
 *        Layout object
 * @param {Highcharts.Point} node
 *        Node that should be translated
 */
function integrate(
    layout: ReingoldFruchtermanLayout,
    node: NetworkgraphPoint
): void {
    let distanceR: number;

    (node.dispX as any) +=
        (node.dispX as any) * (layout.options.friction as any);
    (node.dispY as any) +=
        (node.dispY as any) * (layout.options.friction as any);

    distanceR = node.temperature = layout.vectorLength({
        x: node.dispX as any,
        y: node.dispY as any
    });

    if (distanceR !== 0) {
        (node.plotX as any) += (
            (node.dispX as any) / distanceR *
            Math.min(
                Math.abs(node.dispX as any),
                layout.temperature as any
            )
        );
        (node.plotY as any) += (
            (node.dispY as any) / distanceR *
            Math.min(
                Math.abs(node.dispY as any),
                layout.temperature as any
            )
        );
    }
}

/**
 * Repulsive force.
 *
 * @private
 * @param {Highcharts.Point} node
 *        Node that should be translated by force.
 * @param {number} force
 *        Force calcualated in `repulsiveForceFunction`
 * @param {Highcharts.PositionObject} distanceXY
 *        Distance between two nodes e.g. `{x, y}`
 */
function repulsive(
    node: NetworkgraphPoint,
    force: number,
    distanceXY: PositionObject,
    distanceR: number
): void {
    (node.dispX as any) +=
        (distanceXY.x / distanceR) * force / node.degree;
    (node.dispY as any) +=
        (distanceXY.y / distanceR) * force / node.degree;
}

/**
 * Repulsive force funtion. Can be replaced by API's
 * `layoutAlgorithm.repulsiveForce`.
 *
 * Other forces that can be used:
 *
 * basic, not recommended:
 *    `function (d, k) { return k / d }`
 *
 * standard:
 *    `function (d, k) { return k * k / d }`
 *
 * grid-variant:
 *    `function (d, k) { return k * k / d * (2 * k - d > 0 ? 1 : 0) }`
 *
 * @private
 * @param {number} d current distance between two nodes
 * @param {number} k expected distance between two nodes
 * @return {number} force
 */
function repulsiveForceFunction(
    d: number,
    k: number
): number {
    return k * k / d;
}

/* *
 *
 *  Default Export
 *
 * */

const EulerIntegration: GraphIntegrationObject = {
    attractive,
    attractiveForceFunction,
    barycenter,
    getK,
    integrate,
    repulsive,
    repulsiveForceFunction
};

export default EulerIntegration;
