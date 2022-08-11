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
 *  Functions
 *
 * */

/**
 * Attractive force.
 *
 * In Verlet integration, force is applied on a node immidatelly to it's
 * `plotX` and `plotY` position.
 *
 * @private
 * @param {Highcharts.Point} link
 *        Link that connects two nodes
 * @param {number} force
 *        Force calcualated in `repulsiveForceFunction`
 * @param {Highcharts.PositionObject} distance
 *        Distance between two nodes e.g. `{x, y}`
 */
function attractive(
    this: ReingoldFruchtermanLayout,
    link: NetworkgraphPoint,
    force: number,
    distanceXY: PositionObject
): void {
    const massFactor = link.getMass(),
        translatedX =
            -distanceXY.x * force * (this.diffTemperature as any),
        translatedY =
            -distanceXY.y * force * (this.diffTemperature as any);

    if (!link.fromNode.fixedPosition) {
        (link.fromNode.plotX as any) -=
            translatedX * massFactor.fromNode / link.fromNode.degree;
        (link.fromNode.plotY as any) -=
            translatedY * massFactor.fromNode / link.fromNode.degree;
    }
    if (!link.toNode.fixedPosition) {
        (link.toNode.plotX as any) +=
            translatedX * massFactor.toNode / link.toNode.degree;
        (link.toNode.plotY as any) +=
            translatedY * massFactor.toNode / link.toNode.degree;
    }
}

/**
 * Attractive force funtion. Can be replaced by API's
 * `layoutAlgorithm.attractiveForce`
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
    // Used in API:
    return (k - d) / d;
}

/**
 * Barycenter force. Calculate and applys barycenter forces on the
 * nodes. Making them closer to the center of their barycenter point.
 *
 * In Verlet integration, force is applied on a node immidatelly to it's
 * `plotX` and `plotY` position.
 *
 * @private
 */
function barycenter(
    this: ReingoldFruchtermanLayout
): void {
    let gravitationalConstant = this.options.gravitationalConstant,
        xFactor = (this.barycenter as any).xFactor,
        yFactor = (this.barycenter as any).yFactor;

    // To consider:
    xFactor = (xFactor - (this.box.left + this.box.width) / 2) *
        (gravitationalConstant as any);
    yFactor = (yFactor - (this.box.top + this.box.height) / 2) *
        (gravitationalConstant as any);

    this.nodes.forEach(function (node: Point): void {
        if (!(node as DragNodesPoint).fixedPosition) {
            (node.plotX as any) -=
                xFactor / (node.mass as any) / (node.degree as any);
            (node.plotY as any) -=
                yFactor / (node.mass as any) / (node.degree as any);
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
        0.5
    );
}

/**
 * Integration method.
 *
 * In Verlet integration, forces are applied on node immidatelly to it's
 * `plotX` and `plotY` position.
 *
 * Verlet without velocity:
 *
 *    x(n+1) = 2 * x(n) - x(n-1) + A(T) * deltaT ^ 2
 *
 * where:
 *     - x(n+1) - new position
 *     - x(n) - current position
 *     - x(n-1) - previous position
 *
 * Assuming A(t) = 0 (no acceleration) and (deltaT = 1) we get:
 *
 *     x(n+1) = x(n) + (x(n) - x(n-1))
 *
 * where:
 *     - (x(n) - x(n-1)) - position change
 *
 * TO DO:
 * Consider Verlet with velocity to support additional
 * forces. Or even Time-Corrected Verlet by Jonathan
 * "lonesock" Dummer
 *
 * @private
 * @param {Highcharts.NetworkgraphLayout} layout layout object
 * @param {Highcharts.Point} node node that should be translated
 */
function integrate(
    layout: ReingoldFruchtermanLayout,
    node: NetworkgraphPoint
): void {
    let friction = -(layout.options.friction as any),
        maxSpeed = layout.options.maxSpeed,
        prevX = node.prevX,
        prevY = node.prevY,
        // Apply friciton:
        diffX = (
            ((node.plotX as any) + (node.dispX as any) -
            (prevX as any)) * friction
        ),
        diffY = (
            ((node.plotY as any) + (node.dispY as any) -
            (prevY as any)) * friction
        ),
        abs = Math.abs,
        signX = abs(diffX) / (diffX || 1), // need to deal with 0
        signY = abs(diffY) / (diffY || 1);

    // Apply max speed:
    diffX = signX * Math.min(maxSpeed as any, Math.abs(diffX));
    diffY = signY * Math.min(maxSpeed as any, Math.abs(diffY));

    // Store for the next iteration:
    node.prevX = (node.plotX as any) + (node.dispX as any);
    node.prevY = (node.plotY as any) + (node.dispY as any);

    // Update positions:
    (node.plotX as any) += diffX;
    (node.plotY as any) += diffY;

    node.temperature = layout.vectorLength({
        x: diffX,
        y: diffY
    });
}

/**
 * Repulsive force.
 *
 * In Verlet integration, force is applied on a node immidatelly to it's
 * `plotX` and `plotY` position.
 *
 * @private
 * @param {Highcharts.Point} node
 *        Node that should be translated by force.
 * @param {number} force
 *        Force calcualated in `repulsiveForceFunction`
 * @param {Highcharts.PositionObject} distance
 *        Distance between two nodes e.g. `{x, y}`
 */
function repulsive(
    this: ReingoldFruchtermanLayout,
    node: NetworkgraphPoint,
    force: number,
    distanceXY: PositionObject
): void {
    const factor =
        force * (this.diffTemperature as any) / node.mass / node.degree;

    if (!node.fixedPosition) {
        (node.plotX as any) += distanceXY.x * factor;
        (node.plotY as any) += distanceXY.y * factor;
    }
}

/**
 * Repulsive force funtion. Can be replaced by API's
 * `layoutAlgorithm.repulsiveForce`
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
    // Used in API:
    return (k - d) / d * (k > d ? 1 : 0); // Force only for close nodes
}

/* *
 *
 *  Default Export
 *
 * */

const VerletIntegration: GraphIntegrationObject = {
    attractive,
    attractiveForceFunction,
    barycenter,
    getK,
    integrate,
    repulsive,
    repulsiveForceFunction
};

export default VerletIntegration;
