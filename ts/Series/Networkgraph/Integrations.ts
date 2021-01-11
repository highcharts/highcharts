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

import type Point from '../../Core/Series/Point';
import type PositionObject from '../../Core/Renderer/PositionObject';
import H from '../../Core/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface NetworkgraphEulerIntegrationObject
            extends NetworkgraphIntegrationObject
        {
            attractive(
                this: NetworkgraphLayout,
                link: NetworkgraphPoint,
                force: number,
                distanceXY: PositionObject,
                distanceR: number
            ): void;
            attractiveForceFunction(d: number, k: number): number;
            barycenter(this: NetworkgraphLayout): void;
            getK(layout: NetworkgraphLayout): number;
            integrate(
                layout: NetworkgraphLayout,
                node: NetworkgraphPoint
            ): void;
            repulsive(
                this: NetworkgraphLayout,
                node: NetworkgraphPoint,
                force: number,
                distanceXY: PositionObject,
                distanceR: number
            ): void;
            repulsiveForceFunction(d: number, k: number): number;
        }
        interface NetworkgraphIntegrationDictionary {
            [name: string]: NetworkgraphIntegrationObject;
            verlet: NetworkgraphVerletIntegrationObject;
            euler: NetworkgraphEulerIntegrationObject;
        }
        interface NetworkgraphIntegrationObject {
            [name: string]: Function;
            attractive: Function;
            attractiveForceFunction: Function;
            barycenter: Function;
            getK: Function;
            integrate: Function;
            repulsive: Function;
            repulsiveForceFunction: Function;
        }
        interface NetworkgraphPoint {
            temperature?: number;
        }
        interface NetworkgraphVerletIntegrationObject
            extends NetworkgraphIntegrationObject
        {
            attractive(
                this: NetworkgraphLayout,
                link: NetworkgraphPoint,
                force: number,
                distanceXY: PositionObject
            ): void;
            attractiveForceFunction(d: number, k: number): number;
            barycenter(this: NetworkgraphLayout): void;
            getK(layout: NetworkgraphLayout): number;
            integrate(
                layout: NetworkgraphLayout,
                node: NetworkgraphPoint
            ): void;
            repulsive(
                this: NetworkgraphLayout,
                node: NetworkgraphPoint,
                force: number,
                distanceXY: PositionObject
            ): void;
            repulsiveForceFunction(d: number, k: number): number;
        }
        let networkgraphIntegrations: NetworkgraphIntegrationDictionary;
    }
}

/* eslint-disable no-invalid-this, valid-jsdoc */

H.networkgraphIntegrations = {
    verlet: {
        /**
         * Attractive force funtion. Can be replaced by API's
         * `layoutAlgorithm.attractiveForce`
         *
         * @private
         * @param {number} d current distance between two nodes
         * @param {number} k expected distance between two nodes
         * @return {number} force
         */
        attractiveForceFunction: function (d: number, k: number): number {
            // Used in API:
            return (k - d) / d;
        },
        /**
         * Repulsive force funtion. Can be replaced by API's
         * `layoutAlgorithm.repulsiveForce`
         *
         * @private
         * @param {number} d current distance between two nodes
         * @param {number} k expected distance between two nodes
         * @return {number} force
         */
        repulsiveForceFunction: function (d: number, k: number): number {
            // Used in API:
            return (k - d) / d * (k > d ? 1 : 0); // Force only for close nodes
        },
        /**
         * Barycenter force. Calculate and applys barycenter forces on the
         * nodes. Making them closer to the center of their barycenter point.
         *
         * In Verlet integration, force is applied on a node immidatelly to it's
         * `plotX` and `plotY` position.
         *
         * @private
         * @return {void}
         */
        barycenter: function (this: Highcharts.NetworkgraphLayout): void {
            var gravitationalConstant = this.options.gravitationalConstant,
                xFactor = (this.barycenter as any).xFactor,
                yFactor = (this.barycenter as any).yFactor;

            // To consider:
            xFactor = (xFactor - (this.box.left + this.box.width) / 2) *
                (gravitationalConstant as any);
            yFactor = (yFactor - (this.box.top + this.box.height) / 2) *
                (gravitationalConstant as any);

            this.nodes.forEach(function (node: Point): void {
                if (!(node as Highcharts.DragNodesPoint).fixedPosition) {
                    (node.plotX as any) -=
                        xFactor / (node.mass as any) / (node.degree as any);
                    (node.plotY as any) -=
                        yFactor / (node.mass as any) / (node.degree as any);
                }
            });
        },
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
         * @return {void}
         */
        repulsive: function (
            this: Highcharts.NetworkgraphLayout,
            node: Highcharts.NetworkgraphPoint,
            force: number,
            distanceXY: PositionObject
        ): void {
            var factor =
                force * (this.diffTemperature as any) / node.mass / node.degree;

            if (!node.fixedPosition) {
                (node.plotX as any) += distanceXY.x * factor;
                (node.plotY as any) += distanceXY.y * factor;
            }
        },
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
         * @return {void}
         */
        attractive: function (
            this: Highcharts.NetworkgraphLayout,
            link: Highcharts.NetworkgraphPoint,
            force: number,
            distanceXY: PositionObject
        ): void {
            var massFactor = link.getMass(),
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
        },
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
         * @return {void}
         */
        integrate: function (
            layout: Highcharts.NetworkgraphLayout,
            node: Highcharts.NetworkgraphPoint
        ): void {
            var friction = -(layout.options.friction as any),
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
        },
        /**
         * Estiamte the best possible distance between two nodes, making graph
         * readable.
         *
         * @private
         * @param {Highcharts.NetworkgraphLayout} layout layout object
         * @return {number}
         */
        getK: function (layout: Highcharts.NetworkgraphLayout): number {
            return Math.pow(
                layout.box.width * layout.box.height / layout.nodes.length,
                0.5
            );
        }
    },
    euler: {
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
        attractiveForceFunction: function (d: number, k: number): number {
            return d * d / k;
        },
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
        repulsiveForceFunction: function (d: number, k: number): number {
            return k * k / d;
        },
        /**
         * Barycenter force. Calculate and applys barycenter forces on the
         * nodes. Making them closer to the center of their barycenter point.
         *
         * In Euler integration, force is stored in a node, not changing it's
         * position. Later, in `integrate()` forces are applied on nodes.
         *
         * @private
         * @return {void}
         */
        barycenter: function (this: Highcharts.NetworkgraphLayout): void {
            var gravitationalConstant = this.options.gravitationalConstant,
                xFactor = (this.barycenter as any).xFactor,
                yFactor = (this.barycenter as any).yFactor;

            this.nodes.forEach(function (node: Point): void {
                if (!(node as Highcharts.DragNodesPoint).fixedPosition) {
                    var degree =
                            (node as Highcharts.NetworkgraphPoint).getDegree(),
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
        },
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
         * @return {void}
         */
        repulsive: function (
            node: Highcharts.NetworkgraphPoint,
            force: number,
            distanceXY: PositionObject,
            distanceR: number
        ): void {
            (node.dispX as any) +=
                (distanceXY.x / distanceR) * force / node.degree;
            (node.dispY as any) +=
                (distanceXY.y / distanceR) * force / node.degree;
        },
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
         * @return {void}
         */
        attractive: function (
            link: Highcharts.NetworkgraphPoint,
            force: number,
            distanceXY: PositionObject,
            distanceR: number
        ): void {
            var massFactor = link.getMass(),
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
        },
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
         * @return {void}
         */
        integrate: function (
            layout: Highcharts.NetworkgraphLayout,
            node: Highcharts.NetworkgraphPoint
        ): void {
            var distanceR: number;

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
        },
        /**
         * Estiamte the best possible distance between two nodes, making graph
         * readable.
         *
         * @private
         * @param {object} layout layout object
         * @return {number}
         */
        getK: function (layout: Highcharts.NetworkgraphLayout): number {
            return Math.pow(
                layout.box.width * layout.box.height / layout.nodes.length,
                0.3
            );
        }
    }
};
