import H from '../parts/Globals.js';

H.NodesMixin = {
    // Create a single node that holds information on incoming and outgoing
    // links.
    createNode: function (id) {

        function findById(nodes, id) {
            return H.find(nodes, function (node) {
                return node.id === id;
            });
        }

        var node = findById(this.nodes, id),
            PointClass = this.pointClass,
            options;

        if (!node) {
            options = this.options.nodes && findById(this.options.nodes, id);
            node = (new PointClass()).init(
                this,
                H.extend({
                    className: 'highcharts-node',
                    isNode: true,
                    id: id,
                    y: 1 // Pass isNull test
                }, options)
            );
            node.linksTo = [];
            node.linksFrom = [];
            node.formatPrefix = 'node';
            node.name = node.name || node.options.id; // for use in formats

            // Return the largest sum of either the incoming or outgoing links.
            node.getSum = function () {
                var sumTo = 0,
                    sumFrom = 0;

                node.linksTo.forEach(function (link) {
                    sumTo += link.weight;
                });
                node.linksFrom.forEach(function (link) {
                    sumFrom += link.weight;
                });
                return Math.max(sumTo, sumFrom);
            };
            // Get the offset in weight values of a point/link.
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
                return !node.linksTo.length || outgoing !== node.linksTo.length;
            };

            this.nodes.push(node);
        }
        return node;
    }
};
