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
        }
    }
};
