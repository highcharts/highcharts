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

/* *
 *
 *  Imports
 *
 * */

import type Chart from '../../Core/Chart/Chart';
import type { GraphIntegrationObject } from '../GraphLayoutComposition';
import type NetworkgraphSeries from './Networkgraph';
import type Point from '../../Core/Series/Point';

import H from '../../Core/Globals.js';
const { win } = H;
import Integrations from './Integrations.js';
import GraphLayout from '../GraphLayoutComposition.js';
import U from '../../Core/Utilities.js';
const {
    clamp,
    defined,
    isFunction,
    pick
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Reingold-Fruchterman algorithm from
 * "Graph Drawing by Force-directed Placement" paper.
 * @private
 */
class ReingoldFruchtermanLayout {

    /* *
     *
     *  Static Functions
     *
     * */

    public static compose(
        ChartClass: typeof Chart
    ): void {
        GraphLayout.compose(ChartClass);
        GraphLayout.integrations.euler = Integrations.euler;
        GraphLayout.integrations.verlet = Integrations.verlet;
        GraphLayout.layouts['reingold-fruchterman'] =
            ReingoldFruchtermanLayout;
    }

    /* *
     *
     *  Properties
     *
     * */

    public approximation?: string;
    public attractiveForce: Function = void 0 as any;
    public barycenter?: Record<string, number>;
    public box: Record<string, number> = {};
    public currentStep?: number;
    public diffTemperature?: number;
    public enableSimulation?: boolean;
    public forcedStop?: boolean;
    public forces?: Array<string>;
    public chart?: Chart;
    public initialRendering: boolean = true;
    public integration: GraphIntegrationObject = void 0 as any;
    public k?: number;
    public links: Array<Point> = [];
    public maxIterations?: number;
    public nodes: Array<Point> = [];
    public options: ReingoldFruchtermanLayout.Options = void 0 as any;
    public prevSystemTemperature?: number;
    public quadTree: Highcharts.QuadTree = void 0 as any;
    public repulsiveForce: Function = void 0 as any;
    public series: Array<NetworkgraphSeries> = [];
    public simulation: (false|number) = false;
    public startTemperature?: number;
    public systemTemperature?: number;
    public temperature?: number;

    /* *
     *
     *  Functions
     *
     * */

    public beforeStep?(): void;

    public init(
        options: ReingoldFruchtermanLayout.Options
    ): void {
        this.options = options;
        this.nodes = [];
        this.links = [];
        this.series = [];

        this.box = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };

        this.setInitialRendering(true);

        this.integration =
            GraphLayout.integrations[options.integration as any];

        this.enableSimulation = options.enableSimulation;

        this.attractiveForce = pick(
            options.attractiveForce,
            this.integration.attractiveForceFunction
        );

        this.repulsiveForce = pick(
            options.repulsiveForce,
            this.integration.repulsiveForceFunction
        );

        this.approximation = options.approximation;
    }

    public updateSimulation(
        enable?: boolean
    ): void {
        this.enableSimulation = pick(enable, this.options.enableSimulation);
    }

    public start(): void {
        const layout = this,
            series = this.series,
            options = this.options;


        layout.currentStep = 0;
        layout.forces = series[0] && series[0].forces || [];
        layout.chart = series[0] && series[0].chart;

        if (layout.initialRendering) {
            layout.initPositions();

            // Render elements in initial positions:
            series.forEach(function (s): void {
                s.finishedAnimating = true; // #13169
                s.render();
            });
        }

        layout.setK();
        (layout.resetSimulation as any)(options);

        if (layout.enableSimulation) {
            layout.step();
        }
    }

    public step(): void {
        const layout = this,
            series = this.series,
            options = this.options;

        // Algorithm:
        (layout.currentStep as any)++;

        if (layout.approximation === 'barnes-hut') {
            layout.createQuadTree();
            layout.quadTree.calculateMassAndCenter();
        }

        (layout.forces as any).forEach(function (forceName: string): void {
            (layout as any)[forceName + 'Forces'](layout.temperature);
        });

        // Limit to the plotting area and cool down:
        (layout.applyLimits as any)(layout.temperature);

        // Cool down the system:
        layout.temperature = layout.coolDown(
            layout.startTemperature as any,
            layout.diffTemperature as any,
            layout.currentStep as any
        );

        layout.prevSystemTemperature = layout.systemTemperature;
        layout.systemTemperature = layout.getSystemTemperature();

        if (layout.enableSimulation) {
            series.forEach(function (s): void {
                // Chart could be destroyed during the simulation
                if (s.chart) {
                    s.render();
                }
            });
            if (
                (layout.maxIterations as any)-- &&
                isFinite(layout.temperature) &&
                !layout.isStable()
            ) {
                if (layout.simulation) {
                    win.cancelAnimationFrame(layout.simulation as any);
                }

                layout.simulation = win.requestAnimationFrame(
                    function (): void {
                        layout.step();
                    }
                );
            } else {
                layout.simulation = false;
            }
        }
    }
    public stop(): void {
        if (this.simulation) {
            win.cancelAnimationFrame(this.simulation as any);
        }
    }
    setArea(
        x: number,
        y: number,
        w: number,
        h: number
    ): void {
        this.box = {
            left: x,
            top: y,
            width: w,
            height: h
        };
    }

    public setK(): void {
        // Optimal distance between nodes,
        // available space around the node:
        this.k = this.options.linkLength || this.integration.getK(this);
    }

    public addElementsToCollection<T, C extends T>(
        elements: Array<C>,
        collection: Array<T>
    ): void {
        elements.forEach(function (elem): void {
            if (collection.indexOf(elem) === -1) {
                collection.push(elem);
            }
        });
    }

    public removeElementFromCollection<T>(
        element: T,
        collection: Array<T>
    ): void {
        const index = collection.indexOf(element);

        if (index !== -1) {
            collection.splice(index, 1);
        }
    }

    public clear(): void {
        this.nodes.length = 0;
        this.links.length = 0;
        this.series.length = 0;
        this.resetSimulation();
    }

    public resetSimulation(): void {
        this.forcedStop = false;
        this.systemTemperature = 0;
        this.setMaxIterations();
        this.setTemperature();
        this.setDiffTemperature();
    }

    public restartSimulation(): void {

        if (!this.simulation) {
            // When dragging nodes, we don't need to calculate
            // initial positions and rendering nodes:
            this.setInitialRendering(false);
            // Start new simulation:
            if (!this.enableSimulation) {
                // Run only one iteration to speed things up:
                this.setMaxIterations(1);
            } else {
                this.start();
            }
            if (this.chart) {
                this.chart.redraw();
            }
            // Restore defaults:
            this.setInitialRendering(true);
        } else {
            // Extend current simulation:
            this.resetSimulation();
        }
    }

    public setMaxIterations(
        maxIterations?: number
    ): void {
        this.maxIterations = pick(
            maxIterations,
            this.options.maxIterations
        );
    }

    public setTemperature(): void {
        this.temperature = this.startTemperature =
            Math.sqrt(this.nodes.length);
    }

    public setDiffTemperature(): void {
        this.diffTemperature = (this.startTemperature as any) /
            ((this.options.maxIterations as any) + 1);
    }

    public setInitialRendering(
        enable: boolean
    ): void {
        this.initialRendering = enable;
    }

    public createQuadTree(): void {
        this.quadTree = new H.QuadTree(
            this.box.left,
            this.box.top,
            this.box.width,
            this.box.height
        );

        this.quadTree.insertNodes(this.nodes);
    }

    public initPositions(): void {
        const initialPositions = this.options.initialPositions;

        if (isFunction(initialPositions)) {
            initialPositions.call(this);
            this.nodes.forEach(function (node: Point): void {
                if (!defined(node.prevX)) {
                    node.prevX = node.plotX;
                }
                if (!defined(node.prevY)) {
                    node.prevY = node.plotY;
                }

                node.dispX = 0;
                node.dispY = 0;
            });

        } else if (initialPositions === 'circle') {
            this.setCircularPositions();
        } else {
            this.setRandomPositions();
        }
    }

    public setCircularPositions(): void {
        let box = this.box,
            nodes = this.nodes,
            nodesLength = nodes.length + 1,
            angle = 2 * Math.PI / nodesLength,
            rootNodes = nodes.filter(function (node: Point): boolean {
                return (node.linksTo as any).length === 0;
            }),
            sortedNodes = [] as Array<Point>,
            visitedNodes = {} as Record<string, boolean>,
            radius = this.options.initialPositionRadius;

        /**
         * @private
         */
        function addToNodes(node: Point): void {
            (node.linksFrom as any).forEach(function (link: Point): void {
                if (!visitedNodes[(link.toNode as any).id]) {
                    visitedNodes[(link.toNode as any).id] = true;
                    sortedNodes.push(link.toNode as any);
                    addToNodes(link.toNode as any);
                }
            });
        }

        // Start with identified root nodes an sort the nodes by their
        // hierarchy. In trees, this ensures that branches don't cross
        // eachother.
        rootNodes.forEach(function (rootNode: Point): void {
            sortedNodes.push(rootNode);
            addToNodes(rootNode);
        });

        // Cyclic tree, no root node found
        if (!sortedNodes.length) {
            sortedNodes = nodes;

        // Dangling, cyclic trees
        } else {
            nodes.forEach(function (node: Point): void {
                if (sortedNodes.indexOf(node) === -1) {
                    sortedNodes.push(node);
                }
            });
        }

        // Initial positions are laid out along a small circle, appearing
        // as a cluster in the middle
        sortedNodes.forEach(function (
            node: Point,
            index: number
        ): void {
            node.plotX = node.prevX = pick(
                node.plotX,
                box.width / 2 + (radius as any) * Math.cos(index * angle)
            );
            node.plotY = node.prevY = pick(
                node.plotY,
                box.height / 2 + (radius as any) * Math.sin(index * angle)
            );

            node.dispX = 0;
            node.dispY = 0;
        });
    }

    public setRandomPositions(): void {
        const box = this.box,
            nodes = this.nodes,
            nodesLength = nodes.length + 1;

        /**
         * Return a repeatable, quasi-random number based on an integer
         * input. For the initial positions
         * @private
         */
        function unrandom(n: number): number {
            let rand = n * n / Math.PI;

            rand = rand - Math.floor(rand);
            return rand;
        }

        // Initial positions:
        nodes.forEach(
            function (
                node: Point,
                index: number
            ): void {
                node.plotX = node.prevX = pick(
                    node.plotX,
                    box.width * unrandom(index)
                );
                node.plotY = node.prevY = pick(
                    node.plotY,
                    box.height * unrandom(nodesLength + index)
                );

                node.dispX = 0;
                node.dispY = 0;
            }
        );
    }

    public force(
        name: string,
        ...args: Array<unknown>
    ): void {
        this.integration[name].apply(this, args);
    }

    public barycenterForces(): void {
        this.getBarycenter();
        this.force('barycenter');
    }

    public getBarycenter(): Record<string, number> {
        let systemMass = 0,
            cx = 0,
            cy = 0;

        this.nodes.forEach(function (node: Point): void {
            cx += (node.plotX as any) * (node.mass as any);
            cy += (node.plotY as any) * (node.mass as any);

            systemMass += (node.mass as any);
        });

        this.barycenter = {
            x: cx,
            y: cy,
            xFactor: cx / systemMass,
            yFactor: cy / systemMass
        };

        return this.barycenter;
    }
    barnesHutApproximation(
        node: Point,
        quadNode: Highcharts.QuadTreeNode
    ): (boolean|undefined) {
        let layout = this,
            distanceXY = layout.getDistXY(node, quadNode),
            distanceR = layout.vectorLength(distanceXY),
            goDeeper,
            force;

        if ((node as any) !== quadNode && distanceR !== 0) {
            if (quadNode.isInternal) {
                // Internal node:
                if (
                    quadNode.boxSize / distanceR <
                    (layout.options.theta as any) &&
                    distanceR !== 0
                ) {
                    // Treat as an external node:
                    force = layout.repulsiveForce(distanceR, layout.k);

                    layout.force(
                        'repulsive',
                        node,
                        force * (quadNode.mass as any),
                        distanceXY,
                        distanceR
                    );
                    goDeeper = false;
                } else {
                    // Go deeper:
                    goDeeper = true;
                }
            } else {
                // External node, direct force:
                force = layout.repulsiveForce(distanceR, layout.k);

                layout.force(
                    'repulsive',
                    node,
                    force * (quadNode.mass as any),
                    distanceXY,
                    distanceR
                );
            }
        }

        return goDeeper;
    }
    repulsiveForces(): void {
        const layout = this;

        if (layout.approximation === 'barnes-hut') {
            layout.nodes.forEach(function (node: Point): void {
                layout.quadTree.visitNodeRecursive(
                    null,
                    function (
                        quadNode: Highcharts.QuadTreeNode
                    ): (boolean|undefined) {
                        return layout.barnesHutApproximation(
                            node,
                            quadNode
                        );
                    }
                );
            });
        } else {
            layout.nodes.forEach(function (node: Point): void {
                layout.nodes.forEach(function (repNode: Point): void {
                    let force,
                        distanceR,
                        distanceXY;

                    if (
                        // Node can not repulse itself:
                        node !== repNode &&
                        // Only close nodes affect each other:
                        // layout.getDistR(node, repNode) < 2 * k &&
                        // Not dragged:
                        !(node as any).fixedPosition
                    ) {
                        distanceXY = layout.getDistXY(node, repNode);
                        distanceR = layout.vectorLength(distanceXY);
                        if (distanceR !== 0) {
                            force = layout.repulsiveForce(
                                distanceR,
                                layout.k
                            );

                            layout.force(
                                'repulsive',
                                node,
                                force * (repNode.mass as any),
                                distanceXY,
                                distanceR
                            );
                        }
                    }
                });
            });
        }
    }

    public attractiveForces(): void {
        let layout = this,
            distanceXY,
            distanceR,
            force;

        layout.links.forEach(function (link: Point): void {
            if (link.fromNode && link.toNode) {
                distanceXY = layout.getDistXY(
                    link.fromNode,
                    link.toNode
                );
                distanceR = layout.vectorLength(distanceXY);

                if (distanceR !== 0) {
                    force = layout.attractiveForce(distanceR, layout.k);

                    layout.force(
                        'attractive',
                        link,
                        force,
                        distanceXY,
                        distanceR
                    );
                }
            }
        });
    }

    public applyLimits(): void {
        const layout = this,
            nodes: Array<Highcharts.NetworkgraphPoint> = layout.nodes as any;

        nodes.forEach(function (node): void {
            if ((node as any).fixedPosition) {
                return;
            }

            layout.integration.integrate(layout, node);

            layout.applyLimitBox(node, layout.box);

            // Reset displacement:
            node.dispX = 0;
            node.dispY = 0;
        });
    }

    /**
     * External box that nodes should fall. When hitting an edge, node
     * should stop or bounce.
     * @private
     */
    public applyLimitBox(
        node: Highcharts.NetworkgraphPoint,
        box: Record<string, number>
    ): void {
        const radius = node.radius;
        /*
        TO DO: Consider elastic collision instead of stopping.
        o' means end position when hitting plotting area edge:

        - "inelastic":
        o
            \
        ______
        |  o'
        |   \
        |    \

        - "elastic"/"bounced":
        o
            \
        ______
        |  ^
        | / \
        |o'  \

        Euler sample:
        if (plotX < 0) {
            plotX = 0;
            dispX *= -1;
        }

        if (plotX > box.width) {
            plotX = box.width;
            dispX *= -1;
        }

        */
        // Limit X-coordinates:
        node.plotX = clamp(
            node.plotX as any, box.left + radius, box.width - radius
        );

        // Limit Y-coordinates:
        node.plotY = clamp(
            node.plotY as any, box.top + radius, box.height - radius
        );
    }

    /**
     * From "A comparison of simulated annealing cooling strategies" by
     * Nourani and Andresen work.
     * @private
     */
    public coolDown(
        temperature: number,
        temperatureStep: number,
        currentStep: number
    ): number {
        // Logarithmic:
        /*
        return Math.sqrt(this.nodes.length) -
            Math.log(
                currentStep * layout.diffTemperature
            );
        */

        // Exponential:
        /*
        let alpha = 0.1;
        layout.temperature = Math.sqrt(layout.nodes.length) *
            Math.pow(alpha, layout.diffTemperature);
        */
        // Linear:
        return temperature - temperatureStep * currentStep;
    }

    public isStable(): boolean {
        return Math.abs(
            (this.systemTemperature as any) -
            (this.prevSystemTemperature as any)
        ) < 0.00001 || (this.temperature as any) <= 0;
    }

    public getSystemTemperature(): number {
        return this.nodes.reduce(function (
            value: number,
            node: Point
        ): number {
            return value + (node as any).temperature;
        }, 0);
    }

    public vectorLength(
        vector: Record<string, number>
    ): number {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    }

    public getDistR(
        nodeA: Highcharts.NetworkgraphPoint,
        nodeB: (Highcharts.NetworkgraphPoint|Highcharts.QuadTreeNode)
    ): number {
        const distance = this.getDistXY(nodeA, nodeB);

        return this.vectorLength(distance);
    }

    public getDistXY(
        nodeA: Point,
        nodeB: (Point|Highcharts.QuadTreeNode)
    ): Record<string, number> {
        const xDist = (nodeA.plotX as any) - (nodeB.plotX as any),
            yDist = (nodeA.plotY as any) - (nodeB.plotY as any);

        return {
            x: xDist,
            y: yDist,
            absX: Math.abs(xDist),
            absY: Math.abs(yDist)
        };
    }
}

/* *
 *
 *  Class Namespace
 *
 * */

namespace ReingoldFruchtermanLayout {

    export interface Options {
        approximation?: string;
        attractiveForce?: Function;
        enableSimulation?: boolean;
        friction?: number;
        gravitationalConstant?: number;
        initialPositionRadius?: number;
        initialPositions?: (string|Function);
        integration?: string;
        linkLength?: number;
        maxIterations?: number;
        maxSpeed?: number;
        repulsiveForce?: Function;
        theta?: number;
        type?: string;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default ReingoldFruchtermanLayout;
