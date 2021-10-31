/* *
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

import type PointOptions from '../Core/Series/PointOptions';
import type SeriesOptions from '../Core/Series/SeriesOptions';
import type { StatesOptionsKey } from '../Core/Series/StatesOptions';

import Point from '../Core/Series/Point.js';
import Series from '../Core/Series/Series.js';
import U from '../Core/Utilities.js';
const { defined, extend, find, pick } = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Series/PointLike' {
    interface PointLike {
        name?: string;
    }
}

declare module '../Core/Series/SeriesLike' {
    interface SeriesLike {
        nodes?: Array<NodesComposition.PointComposition>;
    }
}

/* *
 *
 *  Composition
 *
 * */

namespace NodesComposition {
    /* *
     *
     *  Declarations
     *
     * */

    export declare class PointComposition extends Point {
        public className: string;
        public formatPrefix: string;
        public from: string;
        public fromNode: PointComposition;
        public id: string;
        public isNode: true;
        public level?: unknown;
        public linksFrom: Array<PointComposition>;
        public linksTo: Array<PointComposition>;
        public mass: number;
        public options: PointCompositionOptions;
        public series: SeriesComposition;
        public to: string;
        public toNode: PointComposition;
        public weight?: number;
        public y?: number | null;
        public getSum(): number;
        public hasShape(): boolean;
        public init(
            series: SeriesComposition,
            options: PointCompositionOptions
        ): PointComposition;
        public offset(
            point: PointComposition,
            coll: string
        ): number | undefined;
        public setNodeState(state?: StatesOptionsKey): void;
    }

    export interface PointCompositionOptions extends PointOptions {
        id?: string;
        level?: number;
        mass?: number;
        outgoing?: boolean;
        weight?: number | null;
    }

    export declare class SeriesComposition extends Series {
        public data: Array<PointComposition>;
        public nodeLookup: Record<string, PointComposition>;
        public nodes: Array<PointComposition>;
        public options: SeriesCompositionOptions;
        public pointClass: typeof PointComposition;
        public points: Array<PointComposition>;
        public createNode(id: string): PointComposition;
        public generatePoints(): void;
    }

    export interface SeriesCompositionOptions extends SeriesOptions {
        mass?: number;
        nodes?: Array<PointCompositionOptions>;
    }

    /* *
     *
     *  Constants
     *
     * */

    const composedClasses: Array<Function> = [];

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * @private
     */
    export function compose<T extends typeof Series>(
        PointClass: typeof Point,
        SeriesClass: T
    ): T & SeriesComposition {
        if (composedClasses.indexOf(PointClass) === -1) {
            composedClasses.push(PointClass);

            const pointProto = PointClass.prototype as PointComposition;

            pointProto.setNodeState = setNodeState;
            pointProto.setState = setNodeState;
        }

        if (composedClasses.indexOf(SeriesClass) === -1) {
            composedClasses.push(SeriesClass);

            const seriesProto = SeriesClass.prototype as SeriesComposition;

            seriesProto.destroy = destroy;
            seriesProto.setData = setData;
        }

        return SeriesClass as T & SeriesComposition;
    }

    /**
     * Create a single node that holds information on incoming and outgoing
     * links.
     * @private
     */
    export function createNode(
        this: SeriesComposition,
        id: string
    ): PointComposition {
        const PointClass = this.pointClass,
            findById = <T>(nodes: Array<T>, id: string): T | undefined =>
                find(nodes, (node: T): boolean => (node as any).id === id);

        let node = findById(this.nodes, id),
            options: PointCompositionOptions | undefined;

        if (!node) {
            options = this.options.nodes && findById(this.options.nodes, id);
            node = new PointClass().init(
                this,
                extend(
                    {
                        className: 'highcharts-node',
                        isNode: true,
                        id: id,
                        y: 1 // Pass isNull test
                    } as PointCompositionOptions,
                    options as any
                )
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
                let sumTo = 0,
                    sumFrom = 0;

                (node as any).linksTo.forEach(function (
                    link: PointCompositionOptions
                ): void {
                    sumTo += link.weight as any;
                });
                (node as any).linksFrom.forEach(function (
                    link: PointCompositionOptions
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
                point: PointComposition,
                coll: string
            ): number | undefined {
                let offset = 0;

                for (let i = 0; i < (node as any)[coll].length; i++) {
                    if ((node as any)[coll][i] === point) {
                        return offset;
                    }
                    offset += (node as any)[coll][i].weight;
                }
            };

            // Return true if the node has a shape, otherwise all links are
            // outgoing.
            node.hasShape = function (): boolean {
                let outgoing = 0;

                (node as any).linksTo.forEach(function (
                    link: PointCompositionOptions
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
    }

    /**
     * Destroy alll nodes and links.
     * @private
     */
    export function destroy(this: SeriesComposition): void {
        // Nodes must also be destroyed (#8682, #9300)
        this.data = ([] as Array<PointComposition>).concat(
            this.points || [],
            this.nodes
        );

        return Series.prototype.destroy.apply(this, arguments as any);
    }

    /**
     * Extend generatePoints by adding the nodes, which are Point objects
     * but pushed to the this.nodes array.
     */
    export function generatePoints(this: SeriesComposition): void {
        const chart = this.chart,
            nodeLookup = {} as Record<string, PointComposition>;

        Series.prototype.generatePoints.call(this);

        if (!this.nodes) {
            this.nodes = []; // List of Point-like node items
        }
        this.colorCounter = 0;

        // Reset links from previous run
        this.nodes.forEach(function (node: PointComposition): void {
            node.linksFrom.length = 0;
            node.linksTo.length = 0;
            node.level = node.options.level;
        });

        // Create the node list and set up links
        this.points.forEach(function (point: PointComposition): void {
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
    }

    /**
     * Destroy all nodes on setting new data
     * @private
     */
    function setData(this: SeriesComposition): void {
        if (this.nodes) {
            this.nodes.forEach(function (node: PointComposition): void {
                node.destroy();
            });
            this.nodes.length = 0;
        }
        Series.prototype.setData.apply(this, arguments as any);
    }

    /**
     * When hovering node, highlight all connected links. When hovering a link,
     * highlight all connected nodes.
     */
    export function setNodeState(
        this: PointComposition,
        state?: StatesOptionsKey
    ): void {
        const args = arguments,
            others = this.isNode
                ? this.linksTo.concat(this.linksFrom)
                : [this.fromNode, this.toNode];
        if (state !== 'select') {
            others.forEach(function (linkOrNode: PointComposition): void {
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
}

/* *
 *
 *  Default Export
 *
 * */

export default NodesComposition;
