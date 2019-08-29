/* *
 *
 *  Networkgraph series
 *
 *  (c) 2010-2019 Paweł Fus
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../../parts/Globals.js';
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
        attractiveForceFunction: function (d, k) {
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
        repulsiveForceFunction: function (d, k) {
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
        barycenter: function () {
            var gravitationalConstant = this.options.gravitationalConstant, xFactor = this.barycenter.xFactor, yFactor = this.barycenter.yFactor;
            // To consider:
            xFactor = (xFactor - (this.box.left + this.box.width) / 2) *
                gravitationalConstant;
            yFactor = (yFactor - (this.box.top + this.box.height) / 2) *
                gravitationalConstant;
            this.nodes.forEach(function (node) {
                if (!node.fixedPosition) {
                    node.plotX -=
                        xFactor / node.mass / node.degree;
                    node.plotY -=
                        yFactor / node.mass / node.degree;
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
        repulsive: function (node, force, distanceXY) {
            var factor = force * this.diffTemperature / node.mass / node.degree;
            if (!node.fixedPosition) {
                node.plotX += distanceXY.x * factor;
                node.plotY += distanceXY.y * factor;
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
        attractive: function (link, force, distanceXY) {
            var massFactor = link.getMass(), translatedX = -distanceXY.x * force * this.diffTemperature, translatedY = -distanceXY.y * force * this.diffTemperature;
            if (!link.fromNode.fixedPosition) {
                link.fromNode.plotX -=
                    translatedX * massFactor.fromNode / link.fromNode.degree;
                link.fromNode.plotY -=
                    translatedY * massFactor.fromNode / link.fromNode.degree;
            }
            if (!link.toNode.fixedPosition) {
                link.toNode.plotX +=
                    translatedX * massFactor.toNode / link.toNode.degree;
                link.toNode.plotY +=
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
        integrate: function (layout, node) {
            var friction = -layout.options.friction, maxSpeed = layout.options.maxSpeed, prevX = node.prevX, prevY = node.prevY, 
            // Apply friciton:
            diffX = ((node.plotX + node.dispX -
                prevX) * friction), diffY = ((node.plotY + node.dispY -
                prevY) * friction), abs = Math.abs, signX = abs(diffX) / (diffX || 1), // need to deal with 0
            signY = abs(diffY) / (diffY || 1);
            // Apply max speed:
            diffX = signX * Math.min(maxSpeed, Math.abs(diffX));
            diffY = signY * Math.min(maxSpeed, Math.abs(diffY));
            // Store for the next iteration:
            node.prevX = node.plotX + node.dispX;
            node.prevY = node.plotY + node.dispY;
            // Update positions:
            node.plotX += diffX;
            node.plotY += diffY;
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
        getK: function (layout) {
            return Math.pow(layout.box.width * layout.box.height / layout.nodes.length, 0.5);
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
        attractiveForceFunction: function (d, k) {
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
        repulsiveForceFunction: function (d, k) {
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
        barycenter: function () {
            var gravitationalConstant = this.options.gravitationalConstant, xFactor = this.barycenter.xFactor, yFactor = this.barycenter.yFactor;
            this.nodes.forEach(function (node) {
                if (!node.fixedPosition) {
                    var degree = node.getDegree(), phi = degree * (1 + degree / 2);
                    node.dispX += ((xFactor - node.plotX) *
                        gravitationalConstant *
                        phi / node.degree);
                    node.dispY += ((yFactor - node.plotY) *
                        gravitationalConstant *
                        phi / node.degree);
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
        repulsive: function (node, force, distanceXY, distanceR) {
            node.dispX +=
                (distanceXY.x / distanceR) * force / node.degree;
            node.dispY +=
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
        attractive: function (link, force, distanceXY, distanceR) {
            var massFactor = link.getMass(), translatedX = (distanceXY.x / distanceR) * force, translatedY = (distanceXY.y / distanceR) * force;
            if (!link.fromNode.fixedPosition) {
                link.fromNode.dispX -=
                    translatedX * massFactor.fromNode / link.fromNode.degree;
                link.fromNode.dispY -=
                    translatedY * massFactor.fromNode / link.fromNode.degree;
            }
            if (!link.toNode.fixedPosition) {
                link.toNode.dispX +=
                    translatedX * massFactor.toNode / link.toNode.degree;
                link.toNode.dispY +=
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
         * Basic form:
         * `x(n+1) = x(n) + v(n)`
         *
         * With Rengoild-Fruchterman we get:
         * <pre>
         *       x(n+1) = x(n) +
         *           v(n) / length(v(n)) *
         *           min(v(n), temperature(n))
         * </pre>
         * where:
         * <pre>
         *       x(n+1) - next position
         *       x(n) - current position
         *       v(n) - velocity (comes from net force)
         *       temperature(n) - current temperature
         * </pre>
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
        integrate: function (layout, node) {
            var distanceR;
            node.dispX +=
                node.dispX * layout.options.friction;
            node.dispY +=
                node.dispY * layout.options.friction;
            distanceR = node.temperature = layout.vectorLength({
                x: node.dispX,
                y: node.dispY
            });
            if (distanceR !== 0) {
                node.plotX += (node.dispX / distanceR *
                    Math.min(Math.abs(node.dispX), layout.temperature));
                node.plotY += (node.dispY / distanceR *
                    Math.min(Math.abs(node.dispY), layout.temperature));
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
        getK: function (layout) {
            return Math.pow(layout.box.width * layout.box.height / layout.nodes.length, 0.3);
        }
    }
};
