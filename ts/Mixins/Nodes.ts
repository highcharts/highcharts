/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type AnimationOptions from '../Core/Animation/AnimationOptions';
import type PointOptions from '../Core/Series/PointOptions';
import type SeriesOptions from '../Core/Series/SeriesOptions';
import type { StatesOptionsKey } from '../Core/Series/StatesOptions';
import H from '../Core/Globals.js';
import Point from '../Core/Series/Point.js';
import Series from '../Core/Series/Series.js';
import U from '../Core/Utilities.js';
const {
    defined,
    extend,
    find,
    pick
} = U;

declare module '../Core/Series/PointLike' {
    interface PointLike {
        name?: string;
    }
}

declare module '../Core/Series/SeriesLike' {
    interface SeriesLike {
        nodes?: Array<Highcharts.NodesPoint>;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface NodesMixin {
            createNode(this: NodesSeries, id: string): NodesPoint;
            destroy(this: NodesSeries): void;
            generatePoints(this: NodesSeries): void;
            setData(
                this: NodesSeries,
                data: Array<NodesPointOptions>,
                redraw?: boolean,
                animation?: (boolean|Partial<AnimationOptions>),
                updatePoints?: boolean
            ): void;
            setNodeState(this: NodesPoint, state: StatesOptionsKey): void;
        }
        interface NodesPointOptions extends PointOptions {
            id?: string;
            level?: number;
            mass?: number;
            outgoing?: boolean;
            weight?: (number|null);
        }
        interface NodesSeriesOptions extends SeriesOptions {
            mass?: number;
            nodes?: Array<NodesPointOptions>;
        }
        class NodesPoint extends Point {
            public className: string;
            public formatPrefix: string;
            public from: string;
            public fromNode: NodesPoint;
            public id: string;
            public isNode: true;
            public level?: unknown;
            public linksFrom: Array<NodesPoint>;
            public linksTo: Array<NodesPoint>;
            public mass: number;
            public options: NodesPointOptions;
            public series: NodesSeries;
            public setNodeState: NodesMixin['setNodeState'];
            public to: string;
            public toNode: NodesPoint;
            public weight?: number;
            public y?: (number|null);
            public getSum(): number;
            public hasShape(): boolean;
            public init(series: Series, options: NodesPointOptions): NodesPoint;
            public offset(point: NodesPoint, coll: string): (number|undefined);
        }
        class NodesSeries extends Series {
            public createNode: NodesMixin['createNode'];
            public data: Array<NodesPoint>;
            public generatePoints: NodesMixin['generatePoints'];
            public nodeLookup: Record<string, NodesPoint>;
            public nodes: Array<NodesPoint>;
            public options: NodesSeriesOptions;
            public pointClass: typeof NodesPoint;
            public points: Array<NodesPoint>;
            public setData: NodesMixin['setData'];
        }
        let NodesMixin: NodesMixin;
    }
}

const NodesMixin = H.NodesMixin = {

    /* eslint-disable valid-jsdoc */

    /**
     * Create a single node that holds information on incoming and outgoing
     * links.
     * @private
     */
    createNode: function (
        this: Highcharts.NodesSeries,
        id: string
    ): Highcharts.NodesPoint {

        /**
         * @private
         */
        function findById<T>(nodes: Array<T>, id: string): (T|undefined) {
            return find(nodes, function (node: T): boolean {
                return (node as any).id === id;
            });
        }

        var node = findById(this.nodes, id),
            PointClass = this.pointClass,
            options: (Highcharts.NodesPointOptions|undefined);

        if (!node) {
            options = this.options.nodes && findById(this.options.nodes, id);
            node = (new PointClass()).init(
                this,
                extend({
                    className: 'highcharts-node',
                    isNode: true,
                    id: id,
                    y: 1 // Pass isNull test
                } as Highcharts.NodesPointOptions, options as any)
            );
            node.linksTo = [];
            node.linksFrom = [];
            node.formatPrefix = 'node';
            node.name = node.name || node.options.id || ''; // for use in formats
            // Mass is used in networkgraph:
            node.mass = pick(
                // Node:
                node.options.mass,
                node.options.marker && node.options.marker.radius,
                // Series:
                this.options.marker && this.options.marker.radius,
                // Default:
                4
            );

            /**
             * Return the largest sum of either the incoming or outgoing links.
             * @private
             */
            node.getSum = function (): number {
                var sumTo = 0,
                    sumFrom = 0;

                (node as any).linksTo.forEach(function (
                    link: Highcharts.NodesPointOptions
                ): void {
                    sumTo += link.weight as any;
                });
                (node as any).linksFrom.forEach(function (
                    link: Highcharts.NodesPointOptions
                ): void {
                    sumFrom += link.weight as any;
                });
                return Math.max(sumTo, sumFrom);
            };
            /**
             * Get the offset in weight values of a point/link.
             * @private
             */
            node.offset = function (
                point: Highcharts.NodesPoint,
                coll: string
            ): (number|undefined) {
                var offset = 0;

                for (var i = 0; i < (node as any)[coll].length; i++) {
                    if ((node as any)[coll][i] === point) {
                        return offset;
                    }
                    offset += (node as any)[coll][i].weight;
                }
            };

            // Return true if the node has a shape, otherwise all links are
            // outgoing.
            node.hasShape = function (): boolean {
                var outgoing = 0;

                (node as any).linksTo.forEach(function (
                    link: Highcharts.NodesPointOptions
                ): void {
                    if (link.outgoing) {
                        outgoing++;
                    }
                });
                return (
                    !(node as any).linksTo.length ||
                    outgoing !== (node as any).linksTo.length
                );
            };

            this.nodes.push(node);
        }
        return node;
    },

    /**
     * Extend generatePoints by adding the nodes, which are Point objects
     * but pushed to the this.nodes array.
     */
    generatePoints: function (this: Highcharts.NodesSeries): void {
        var chart = this.chart,
            nodeLookup = {} as Record<string, Highcharts.NodesPoint>;

        Series.prototype.generatePoints.call(this);

        if (!this.nodes) {
            this.nodes = []; // List of Point-like node items
        }
        this.colorCounter = 0;

        // Reset links from previous run
        this.nodes.forEach(function (node: Highcharts.NodesPoint): void {
            node.linksFrom.length = 0;
            node.linksTo.length = 0;
            node.level = node.options.level;
        });

        // Create the node list and set up links
        this.points.forEach(function (point: Highcharts.NodesPoint): void {
            if (defined(point.from)) {
                if (!nodeLookup[point.from]) {
                    nodeLookup[point.from] = this.createNode(point.from);
                }
                nodeLookup[point.from].linksFrom.push(point);
                point.fromNode = nodeLookup[point.from];

                // Point color defaults to the fromNode's color
                if (chart.styledMode) {
                    point.colorIndex = pick(
                        point.options.colorIndex,
                        nodeLookup[point.from].colorIndex
                    );
                } else {
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
    setData: function (this: Highcharts.NodesSeries): void {
        if (this.nodes) {
            this.nodes.forEach(function (node: Highcharts.NodesPoint): void {
                node.destroy();
            });
            this.nodes.length = 0;
        }
        Series.prototype.setData.apply(this, arguments as any);
    },

    // Destroy alll nodes and links
    destroy: function (this: Highcharts.NodesSeries): void {
        // Nodes must also be destroyed (#8682, #9300)
        this.data = ([] as Array<Highcharts.NodesPoint>)
            .concat(this.points || [], this.nodes);

        return Series.prototype.destroy.apply(this, arguments as any);
    },

    /**
     * When hovering node, highlight all connected links. When hovering a link,
     * highlight all connected nodes.
     */
    setNodeState: function (this: Highcharts.NodesPoint, state?: StatesOptionsKey): void {
        var args = arguments,
            others = this.isNode ? this.linksTo.concat(this.linksFrom) :
                [this.fromNode, this.toNode];
        if (state !== 'select') {
            others.forEach(function (linkOrNode: Highcharts.NodesPoint): void {
                if (linkOrNode && linkOrNode.series) {
                    Point.prototype.setState.apply(linkOrNode, args as any);

                    if (!linkOrNode.isNode) {
                        if (linkOrNode.fromNode.graphic) {
                            Point.prototype.setState.apply(
                                linkOrNode.fromNode,
                                args as any
                            );
                        }
                        if (linkOrNode.toNode && linkOrNode.toNode.graphic) {
                            Point.prototype.setState.apply(
                                linkOrNode.toNode,
                                args as any
                            );
                        }
                    }
                }
            });
        }

        Point.prototype.setState.apply(this, args as any);
    }

    /* eslint-enable valid-jsdoc */

};

export default NodesMixin;
