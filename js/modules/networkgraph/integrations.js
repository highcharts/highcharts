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
        attractiveForceFunction: function (d, k) {
            // Used in API:
            return (k - d) / d;
        },
        repulsiveForceFunction: function (d, k) {
            // Used in API:
            return (k - d) / d * (k > d ? 1 : 0); // Force only for close nodes
        },
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
                    node.plotX -= xFactor / node.mass / node.degree;
                    node.plotY -= yFactor / node.mass / node.degree;
                }
            });
        },
        repulsive: function (node, force, distanceXY) {
            var factor = force * this.diffTemperature / node.mass / node.degree;

            if (!node.fixedPosition) {
                node.plotX += distanceXY.x * factor;
                node.plotY += distanceXY.y * factor;
            }
        },
        attractive: function (link, force, distanceXY) {
            var massFactor = link.getMass(),
                translatedX = -distanceXY.x * force * this.diffTemperature,
                translatedY = -distanceXY.y * force * this.diffTemperature;

            if (!link.fromNode.fixedPosition) {
                link.fromNode.plotX -= translatedX * massFactor.fromNode /
                    link.fromNode.degree;
                link.fromNode.plotY -= translatedY * massFactor.fromNode /
                    link.fromNode.degree;
            }
            if (!link.toNode.fixedPosition) {
                link.toNode.plotX += translatedX * massFactor.toNode /
                    link.toNode.degree;
                link.toNode.plotY += translatedY * massFactor.toNode /
                    link.toNode.degree;
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
                diffX = (node.plotX + node.dispX - prevX),
                diffY = (node.plotY + node.dispY - prevY);

            // Store for the next iteration:
            node.prevX = node.plotX + node.dispX;
            node.prevY = node.plotY + node.dispY;

            // Update positions, apply friction:
            node.plotX += diffX * -layout.options.friction;
            node.plotY += diffY * -layout.options.friction;

            node.temperature = layout.vectorLength({
                x: diffX * -layout.options.friction,
                y: diffY * -layout.options.friction
            });
        },
        getK: function (layout) {
            return Math.pow(
                layout.box.width * layout.box.height / layout.nodes.length,
                0.5
            );
        }
    },
    euler: {
        attractiveForceFunction: function (d, k) {
            /*
            basic, not recommended:
            return d / k;
            */
            return d * d / k;
        },
        repulsiveForceFunction: function (d, k) {
            /*
            basic, not recommended:
            return k / d;
            */

            /*
            standard:
            return k * k / d;
            */

            /*
            grid-variant:
            return k * k / d * (2 * k - d > 0 ? 1 : 0);
            */
            return k * k / d;
        },
        barycenter: function () {
            var gravitationalConstant = this.options.gravitationalConstant,
                xFactor = this.barycenter.xFactor,
                yFactor = this.barycenter.yFactor;

            this.nodes.forEach(function (node) {
                if (!node.fixedPosition) {
                    var degree = node.getDegree(),
                        phi = degree * (1 + degree / 2);

                    node.dispX += (xFactor - node.plotX) *
                        gravitationalConstant * phi / node.degree;
                    node.dispY += (yFactor - node.plotY) *
                        gravitationalConstant * phi / node.degree;
                }
            });
        },
        repulsive: function (node, force, distanceXY, distanceR) {
            node.dispX += (distanceXY.x / distanceR) * force / node.degree;
            node.dispY += (distanceXY.y / distanceR) * force / node.degree;
        },
        attractive: function (link, force, distanceXY, distanceR) {
            var massFactor = link.getMass(),
                translatedX = (distanceXY.x / distanceR) * force,
                translatedY = (distanceXY.y / distanceR) * force;

            if (!link.fromNode.fixedPosition) {
                link.fromNode.dispX -= translatedX * massFactor.fromNode /
                    link.fromNode.degree;
                link.fromNode.dispY -= translatedY * massFactor.fromNode /
                    link.fromNode.degree;
            }

            if (!link.toNode.fixedPosition) {
                link.toNode.dispX += translatedX * massFactor.toNode /
                    link.toNode.degree;
                link.toNode.dispY += translatedY * massFactor.toNode /
                    link.toNode.degree;
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
        },
        getK: function (layout) {
            return Math.pow(
                layout.box.width * layout.box.height / layout.nodes.length,
                0.3
            );
        }
    }
};
