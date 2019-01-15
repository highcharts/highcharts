/**
 * Networkgraph series
 *
 * (c) 2010-2019 Paweł Fus
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../../parts/Globals.js';

H.networkgraphIntegrations = {
    verlet: {
        barycenter: function () {
            var gravitationalConstant = this.options.gravitationalConstant,
                xFactor = this.barycenter.xFactor,
                yFactor = this.barycenter.yFactor;

            // To consider:
            xFactor = (xFactor - (this.box.left + this.box.width) / 2) *
                gravitationalConstant;
            yFactor = (yFactor - (this.box.top + this.box.height) / 2) *
                gravitationalConstant;

            this.nodes.forEach(function (node) {
                if (!node.fixedPosition) {
                    node.plotX -= xFactor;
                    node.plotY -= yFactor;
                }
            });
        },
        repulsive: function (node, force, distanceXY, distanceR) {
            node.plotX += distanceR >= this.k ? 0 :
                distanceXY.x * (this.k - distanceR) /
                    distanceR * this.diffTemperature / 2;
            node.plotY += distanceR >= this.k ? 0 :
                distanceXY.y * (this.k - distanceR) /
                    distanceR * this.diffTemperature / 2;
        },
        attractive: function (link, force, distanceXY, distanceR) {
            var factor = (this.k - distanceR) / distanceR * 0.5 *
                    this.diffTemperature,
                translatedX = -distanceXY.x * factor,
                translatedY = -distanceXY.y * factor;

            if (!link.fromNode.fixedPosition) {
                link.fromNode.plotX -= translatedX;
                link.fromNode.plotY -= translatedY;
            }
            if (!link.toNode.fixedPosition) {
                link.toNode.plotX += translatedX;
                link.toNode.plotY += translatedY;
            }
        },
        integrate: function (layout, node) {
            /*
            Verlet without velocity:

                x(n+1) = 2 * x(n) - x(n-1) + A(T) * deltaT ^ 2

            where:
                - x(n+1) - new position
                - x(n) - current position
                - x(n-1) - previous position

            Assuming A(t) = 0 (no acceleration) and (deltaT = 1) we
            get:

                x(n+1) = x(n) + (x(n) - x(n-1))

            where:
                - (x(n) - x(n-1)) - position change

            TO DO:
            Consider Verlet with velocity to support additional
            forces. Or even Time-Corrected Verlet by Jonathan
            "lonesock" Dummer
            */
            var prevX = node.prevX,
                prevY = node.prevY,
                diffX = (node.plotX - prevX),
                diffY = (node.plotY - prevY);

            // Store for the next iteration:
            node.prevX = node.plotX;
            node.prevY = node.plotY;

            // Update positions, apply friction:
            node.plotX += diffX * -layout.options.friction;
            node.plotY += diffY * -layout.options.friction;

            node.temperature = layout.vectorLength({
                x: diffX,
                y: diffY
            });
        }
    },
    euler: {
        barycenter: function () {
            var gravitationalConstant = this.options.gravitationalConstant,
                xFactor = this.barycenter.xFactor,
                yFactor = this.barycenter.yFactor;

            this.nodes.forEach(function (node) {
                if (!node.fixedPosition) {
                    var degree = node.getDegree(),
                        phi = degree * (1 + degree / 2);

                    node.dispX += (xFactor - node.plotX) *
                        gravitationalConstant * phi;
                    node.dispY += (yFactor - node.plotY) *
                        gravitationalConstant * phi;
                }
            });
        },
        repulsive: function (node, force, distanceXY, distanceR) {
            node.dispX += (distanceXY.x / distanceR) * force;
            node.dispY += (distanceXY.y / distanceR) * force;
        },
        attractive: function (link, force, distanceXY, distanceR) {
            var translatedX = (distanceXY.x / distanceR) * force,
                translatedY = (distanceXY.y / distanceR) * force;

            if (!link.fromNode.fixedPosition) {
                link.fromNode.dispX -= translatedX;
                link.fromNode.dispY -= translatedY;
            }

            if (!link.toNode.fixedPosition) {
                link.toNode.dispX += translatedX;
                link.toNode.dispY += translatedY;
            }
        },
        integrate: function (layout, node) {
            var distanceR;
            /*
            Euler:
            Basic form: x(n+1) = x(n) + v(n)

            With Rengoild-Fruchterman we get:

                x(n+1) = x(n) +
                    v(n) / length(v(n)) *
                    min(v(n), temperature(n))

            where:
                x(n+1) - next position
                x(n) - current position
                v(n) - velocity (comes from net force)
                temperature(n) - current temperature

            Issues:
                Oscillations when force vector has the same
                magnitude but opposite direction in the next step.

            Actually "min(v(n), temperature(n))" replaces
            simulated annealing.
            */

            node.dispX += node.dispX * layout.options.friction;
            node.dispY += node.dispY * layout.options.friction;

            distanceR = node.temperature = layout.vectorLength({
                x: node.dispX,
                y: node.dispY
            });

            if (distanceR !== 0) {
                node.plotX += node.dispX / distanceR *
                    Math.min(Math.abs(node.dispX), layout.temperature);
                node.plotY += node.dispY / distanceR *
                    Math.min(Math.abs(node.dispY), layout.temperature);
            }
        }
    }
};
