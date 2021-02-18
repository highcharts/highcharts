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
import Chart from '../../Core/Chart/Chart.js';
import H from '../../Core/Globals.js';
import '../../Series/Networkgraph/Layouts.js';
var Reingold = H.layouts['reingold-fruchterman'];
import U from '../../Core/Utilities.js';
var addEvent = U.addEvent, extendClass = U.extendClass, pick = U.pick;
/* *
 *
 *  Composition
 *
 * */
Chart.prototype.getSelectedParentNodes = function () {
    var chart = this, series = chart.series, selectedParentsNodes = [];
    series.forEach(function (series) {
        if (series.parentNode && series.parentNode.selected) {
            selectedParentsNodes.push(series.parentNode);
        }
    });
    return selectedParentsNodes;
};
H.networkgraphIntegrations.packedbubble = {
    repulsiveForceFunction: function (d, k, node, repNode) {
        return Math.min(d, (node.marker.radius + repNode.marker.radius) / 2);
    },
    barycenter: function () {
        var layout = this, gravitationalConstant = layout.options.gravitationalConstant, box = layout.box, nodes = layout.nodes, centerX, centerY;
        nodes.forEach(function (node) {
            if (layout.options.splitSeries && !node.isParentNode) {
                centerX = node.series.parentNode.plotX;
                centerY = node.series.parentNode.plotY;
            }
            else {
                centerX = box.width / 2;
                centerY = box.height / 2;
            }
            if (!node.fixedPosition) {
                node.plotX -=
                    (node.plotX - centerX) *
                        gravitationalConstant /
                        (node.mass * Math.sqrt(nodes.length));
                node.plotY -=
                    (node.plotY - centerY) *
                        gravitationalConstant /
                        (node.mass * Math.sqrt(nodes.length));
            }
        });
    },
    repulsive: function (node, force, distanceXY, repNode) {
        var factor = (force * this.diffTemperature / node.mass /
            node.degree), x = distanceXY.x * factor, y = distanceXY.y * factor;
        if (!node.fixedPosition) {
            node.plotX += x;
            node.plotY += y;
        }
        if (!repNode.fixedPosition) {
            repNode.plotX -= x;
            repNode.plotY -= y;
        }
    },
    integrate: H.networkgraphIntegrations.verlet.integrate,
    getK: H.noop
};
H.layouts.packedbubble = extendClass(Reingold, {
    beforeStep: function () {
        if (this.options.marker) {
            this.series.forEach(function (series) {
                if (series) {
                    series.calculateParentRadius();
                }
            });
        }
    },
    isStable: function () {
        var tempDiff = Math.abs(this.prevSystemTemperature -
            this.systemTemperature);
        var upScaledTemperature = 10 * this.systemTemperature /
            Math.sqrt(this.nodes.length);
        return Math.abs(upScaledTemperature) < 1 &&
            tempDiff < 0.00001 ||
            this.temperature <= 0;
    },
    setCircularPositions: function () {
        var layout = this, box = layout.box, nodes = layout.nodes, nodesLength = nodes.length + 1, angle = 2 * Math.PI / nodesLength, centerX, centerY, radius = layout.options.initialPositionRadius;
        nodes.forEach(function (node, index) {
            if (layout.options.splitSeries &&
                !node.isParentNode) {
                centerX = node.series.parentNode.plotX;
                centerY = node.series.parentNode.plotY;
            }
            else {
                centerX = box.width / 2;
                centerY = box.height / 2;
            }
            node.plotX = node.prevX = pick(node.plotX, centerX +
                radius * Math.cos(node.index || index * angle));
            node.plotY = node.prevY = pick(node.plotY, centerY +
                radius * Math.sin(node.index || index * angle));
            node.dispX = 0;
            node.dispY = 0;
        });
    },
    repulsiveForces: function () {
        var layout = this, force, distanceR, distanceXY, bubblePadding = layout.options.bubblePadding;
        layout.nodes.forEach(function (node) {
            node.degree = node.mass;
            node.neighbours = 0;
            layout.nodes.forEach(function (repNode) {
                force = 0;
                if (
                // Node can not repulse itself:
                node !== repNode &&
                    // Only close nodes affect each other:
                    // Not dragged:
                    !node.fixedPosition &&
                    (layout.options.seriesInteraction ||
                        node.series === repNode.series)) {
                    distanceXY = layout.getDistXY(node, repNode);
                    distanceR = (layout.vectorLength(distanceXY) -
                        (node.marker.radius +
                            repNode.marker.radius +
                            bubblePadding));
                    // TODO padding configurable
                    if (distanceR < 0) {
                        node.degree += 0.01;
                        node.neighbours++;
                        force = layout.repulsiveForce(-distanceR / Math.sqrt(node.neighbours), layout.k, node, repNode);
                    }
                    layout.force('repulsive', node, force * repNode.mass, distanceXY, repNode, distanceR);
                }
            });
        });
    },
    applyLimitBox: function (node) {
        var layout = this, distanceXY, distanceR, factor = 0.01;
        // parentNodeLimit should be used together
        // with seriesInteraction: false
        if (layout.options.splitSeries &&
            !node.isParentNode &&
            layout.options.parentNodeLimit) {
            distanceXY = layout.getDistXY(node, node.series.parentNode);
            distanceR = (node.series.parentNodeRadius -
                node.marker.radius -
                layout.vectorLength(distanceXY));
            if (distanceR < 0 &&
                distanceR > -2 * node.marker.radius) {
                node.plotX -= distanceXY.x * factor;
                node.plotY -= distanceXY.y * factor;
            }
        }
        Reingold.prototype.applyLimitBox.apply(this, arguments);
    }
});
// Remove accumulated data points to redistribute all of them again
// (i.e after hiding series by legend)
addEvent(Chart, 'beforeRedraw', function () {
    // eslint-disable-next-line no-invalid-this
    if (this.allDataPoints) {
        // eslint-disable-next-line no-invalid-this
        delete this.allDataPoints;
    }
});
