/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
import H from '../parts/Globals.js';
import U from '../parts/Utilities.js';
var defined = U.defined;
var pick = H.pick, Point = H.Point;
H.NodesMixin = {
    /* eslint-disable valid-jsdoc */
    /**
     * Create a single node that holds information on incoming and outgoing
     * links.
     * @private
     */
    createNode: function (id) {
        /**
         * @private
         */
        function findById(nodes, id) {
            return H.find(nodes, function (node) {
                return node.id === id;
            });
        }
        var node = findById(this.nodes, id), PointClass = this.pointClass, options;
        if (!node) {
            options = this.options.nodes && findById(this.options.nodes, id);
            node = (new PointClass()).init(this, H.extend({
                className: 'highcharts-node',
                isNode: true,
                id: id,
                y: 1 // Pass isNull test
            }, options));
            node.linksTo = [];
            node.linksFrom = [];
            node.formatPrefix = 'node';
            node.name = node.name || node.options.id; // for use in formats
            // Mass is used in networkgraph:
            node.mass = pick(
            // Node:
            node.options.mass, node.options.marker && node.options.marker.radius, 
            // Series:
            this.options.marker && this.options.marker.radius, 
            // Default:
            4);
            /**
             * Return the largest sum of either the incoming or outgoing links.
             * @private
             */
            node.getSum = function () {
                var sumTo = 0, sumFrom = 0;
                node.linksTo.forEach(function (link) {
                    sumTo += link.weight;
                });
                node.linksFrom.forEach(function (link) {
                    sumFrom += link.weight;
                });
                return Math.max(sumTo, sumFrom);
            };
            /**
             * Get the offset in weight values of a point/link.
             * @private
             */
            node.offset = function (point, coll) {
                var offset = 0;
                for (var i = 0; i < node[coll].length; i++) {
                    if (node[coll][i] === point) {
                        return offset;
                    }
                    offset += node[coll][i].weight;
                }
            };
            // Return true if the node has a shape, otherwise all links are
            // outgoing.
            node.hasShape = function () {
                var outgoing = 0;
                node.linksTo.forEach(function (link) {
                    if (link.outgoing) {
                        outgoing++;
                    }
                });
                return (!node.linksTo.length ||
                    outgoing !== node.linksTo.length);
            };
            this.nodes.push(node);
        }
        return node;
    },
    /**
     * Extend generatePoints by adding the nodes, which are Point objects
     * but pushed to the this.nodes array.
     */
    generatePoints: function () {
        var chart = this.chart, nodeLookup = {};
        H.Series.prototype.generatePoints.call(this);
        if (!this.nodes) {
            this.nodes = []; // List of Point-like node items
        }
        this.colorCounter = 0;
        // Reset links from previous run
        this.nodes.forEach(function (node) {
            node.linksFrom.length = 0;
            node.linksTo.length = 0;
            node.level = undefined;
        });
        // Create the node list and set up links
        this.points.forEach(function (point) {
            if (defined(point.from)) {
                if (!nodeLookup[point.from]) {
                    nodeLookup[point.from] = this.createNode(point.from);
                }
                nodeLookup[point.from].linksFrom.push(point);
                point.fromNode = nodeLookup[point.from];
                // Point color defaults to the fromNode's color
                if (chart.styledMode) {
                    point.colorIndex = pick(point.options.colorIndex, nodeLookup[point.from].colorIndex);
                }
                else {
                    point.color =
                        point.options.color || nodeLookup[point.from].color;
                }
            }
            if (defined(point.to)) {
                if (!nodeLookup[point.to]) {
                    nodeLookup[point.to] = this.createNode(point.to);
                }
                nodeLookup[point.to].linksTo.push(point);
                point.toNode = nodeLookup[point.to];
            }
            point.name = point.name || point.id; // for use in formats
        }, this);
        // Store lookup table for later use
        this.nodeLookup = nodeLookup;
    },
    // Destroy all nodes on setting new data
    setData: function () {
        if (this.nodes) {
            this.nodes.forEach(function (node) {
                node.destroy();
            });
            this.nodes.length = 0;
        }
        H.Series.prototype.setData.apply(this, arguments);
    },
    // Destroy alll nodes and links
    destroy: function () {
        // Nodes must also be destroyed (#8682, #9300)
        this.data = []
            .concat(this.points || [], this.nodes);
        return H.Series.prototype.destroy.apply(this, arguments);
    },
    /**
     * When hovering node, highlight all connected links. When hovering a link,
     * highlight all connected nodes.
     */
    setNodeState: function (state) {
        var args = arguments, others = this.isNode ? this.linksTo.concat(this.linksFrom) :
            [this.fromNode, this.toNode];
        if (state !== 'select') {
            others.forEach(function (linkOrNode) {
                if (linkOrNode.series) {
                    Point.prototype.setState.apply(linkOrNode, args);
                    if (!linkOrNode.isNode) {
                        if (linkOrNode.fromNode.graphic) {
                            Point.prototype.setState.apply(linkOrNode.fromNode, args);
                        }
                        if (linkOrNode.toNode.graphic) {
                            Point.prototype.setState.apply(linkOrNode.toNode, args);
                        }
                    }
                }
            });
        }
        Point.prototype.setState.apply(this, args);
    }
    /* eslint-enable valid-jsdoc */
};
