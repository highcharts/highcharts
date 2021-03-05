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

/* *
 *
 *  Imports
 *
 * */

import type { BubblePointMarkerOptions } from '../Bubble/BubblePointOptions';
import type PackedBubbleChart from './PackedBubbleChart';
import type { PackedBubbleDataLabelFormatterObject } from './PackedBubbleDataLabelOptions';
import type PackedBubbleLayout from './PackedBubbleLayout';
import type PackedBubblePointOptions from './PackedBubblePointOptions';
import type PackedBubbleSeriesOptions from './PackedBubbleSeriesOptions';
import type Point from '../../Core/Series/Point.js';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import Color from '../../Core/Color/Color.js';
const { parse: color } = Color;
import H from '../../Core/Globals.js';
import PackedBubblePoint from './PackedBubblePoint.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    series: Series,
    seriesTypes: {
        bubble: BubbleSeries
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const {
    addEvent,
    clamp,
    defined,
    extend,
    fireEvent,
    isArray,
    isNumber,
    merge,
    pick
} = U;
import '../../Series/Networkgraph/DraggableNodes.js';
const dragNodesMixin = H.dragNodesMixin;
import './PackedBubbleComposition.js';

/* *
 *
 *  Class
 *
 * */

/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.packedbubble
 *
 * @extends Highcharts.Series
 */
class PackedBubbleSeries extends BubbleSeries implements Highcharts.DragNodesSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * A packed bubble series is a two dimensional series type, where each point
     * renders a value in X, Y position. Each point is drawn as a bubble
     * where the bubbles don't overlap with each other and the radius
     * of the bubble relates to the value.
     *
     * @sample highcharts/demo/packed-bubble/
     *         Packed bubble chart
     * @sample highcharts/demo/packed-bubble-split/
     *         Split packed bubble chart

     * @extends      plotOptions.bubble
     * @excluding    connectEnds, connectNulls, cropThreshold, dragDrop, jitter,
     *               keys, pointPlacement, sizeByAbsoluteValue, step, xAxis,
     *               yAxis, zMax, zMin, dataSorting, boostThreshold,
     *               boostBlending
     * @product      highcharts
     * @since        7.0.0
     * @requires     highcharts-more
     * @optionparent plotOptions.packedbubble
     */
    public static defaultOptions: PackedBubbleSeriesOptions = merge(BubbleSeries.defaultOptions, {
        /**
         * Minimum bubble size. Bubbles will automatically size between the
         * `minSize` and `maxSize` to reflect the value of each bubble.
         * Can be either pixels (when no unit is given), or a percentage of
         * the smallest one of the plot width and height, divided by the square
         * root of total number of points.
         *
         * @sample highcharts/plotoptions/bubble-size/
         *         Bubble size
         *
         * @type {number|string}
         *
         * @private
         */
        minSize: '10%',
        /**
         * Maximum bubble size. Bubbles will automatically size between the
         * `minSize` and `maxSize` to reflect the value of each bubble.
         * Can be either pixels (when no unit is given), or a percentage of
         * the smallest one of the plot width and height, divided by the square
         * root of total number of points.
         *
         * @sample highcharts/plotoptions/bubble-size/
         *         Bubble size
         *
         * @type {number|string}
         *
         * @private
         */
        maxSize: '50%',
        sizeBy: 'area',
        zoneAxis: 'y',
        crisp: false,
        tooltip: {
            pointFormat: 'Value: {point.value}'
        },
        /**
         * Flag to determine if nodes are draggable or not. Available for
         * graph with useSimulation set to true only.
         *
         * @since 7.1.0
         *
         * @private
         */
        draggable: true,
        /**
         * An option is giving a possibility to choose between using simulation
         * for calculating bubble positions. These reflects in both animation
         * and final position of bubbles. Simulation is also adding options to
         * the series graph based on used layout. In case of big data sets, with
         * any performance issues, it is possible to disable animation and pack
         * bubble in a simple circular way.
         *
         * @sample highcharts/series-packedbubble/spiral/
         *         useSimulation set to false
         *
         * @since 7.1.0
         *
         * @private
         */
        useSimulation: true,
        /**
         * Series options for parent nodes.
         *
         * @since 8.1.1
         *
         * @private
         */
        parentNode: {
            /**
             * Allow this series' parent nodes to be selected
             * by clicking on the graph.
             *
             * @since 8.1.1
             */
            allowPointSelect: false
        },
        /**
        /**
         *
         * @declare Highcharts.SeriesPackedBubbleDataLabelsOptionsObject
         *
         * @private
         */
        dataLabels: {

            /**
             * The
             * [format string](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting)
             * specifying what to show for _node_ in the networkgraph. In v7.0
             * defaults to `{key}`, since v7.1 defaults to `undefined` and
             * `formatter` is used instead.
             *
             * @type      {string}
             * @since     7.0.0
             * @apioption plotOptions.packedbubble.dataLabels.format
             */

            // eslint-disable-next-line valid-jsdoc
            /**
             * Callback JavaScript function to format the data label for a node.
             * Note that if a `format` is defined, the format takes precedence
             * and the formatter is ignored.
             *
             * @type  {Highcharts.SeriesPackedBubbleDataLabelsFormatterCallbackFunction}
             * @since 7.0.0
             */
            formatter: function (
                this: (
                    Point.PointLabelObject|
                    PackedBubbleDataLabelFormatterObject
                )
            ): (number|null) {
                return (this.point as any).value;
            },

            /**
             * @type      {string}
             * @since     7.1.0
             * @apioption plotOptions.packedbubble.dataLabels.parentNodeFormat
             */

            // eslint-disable-next-line valid-jsdoc
            /**
             * @type  {Highcharts.SeriesPackedBubbleDataLabelsFormatterCallbackFunction}
             * @since 7.1.0
             */
            parentNodeFormatter: function (
                this: (
                    Point.PointLabelObject|
                    PackedBubbleDataLabelFormatterObject
                )
            ): string {
                return (this as any).name;
            },

            /**
             * @sample {highcharts} highcharts/series-packedbubble/packed-dashboard
             *         Dashboard with dataLabels on parentNodes
             *
             * @declare Highcharts.SeriesPackedBubbleDataLabelsTextPathOptionsObject
             * @since   7.1.0
             */
            parentNodeTextPath: {

                /**
                 * Presentation attributes for the text path.
                 *
                 * @type      {Highcharts.SVGAttributes}
                 * @since     7.1.0
                 * @apioption plotOptions.packedbubble.dataLabels.attributes
                 */

                /**
                 * Enable or disable `textPath` option for link's or marker's
                 * data labels.
                 *
                 * @since 7.1.0
                 */
                enabled: true

            },

            /**
             * Options for a _node_ label text which should follow marker's
             * shape.
             *
             * **Note:** Only SVG-based renderer supports this option.
             *
             * @extends   plotOptions.series.dataLabels.textPath
             * @apioption plotOptions.packedbubble.dataLabels.textPath
             */

            padding: 0,
            style: {
                transition: 'opacity 2000ms'
            }

        },
        /**
         * Options for layout algorithm when simulation is enabled. Inside there
         * are options to change the speed, padding, initial bubbles positions
         * and more.
         *
         * @extends   plotOptions.networkgraph.layoutAlgorithm
         * @excluding approximation, attractiveForce, repulsiveForce, theta
         * @since     7.1.0
         *
         * @private
         */
        layoutAlgorithm: {
            /**
             * Initial layout algorithm for positioning nodes. Can be one of
             * the built-in options ("circle", "random") or a function where
             * positions should be set on each node (`this.nodes`) as
             * `node.plotX` and `node.plotY`.
             *
             * @sample highcharts/series-networkgraph/initial-positions/
             *         Initial positions with callback
             *
             * @type {"circle"|"random"|Function}
             */
            initialPositions: 'circle',
            /**
             * @sample highcharts/series-packedbubble/initial-radius/
             *         Initial radius set to 200
             *
             * @extends   plotOptions.networkgraph.layoutAlgorithm.initialPositionRadius
             * @excluding states
             */
            initialPositionRadius: 20,
            /**
             * The distance between two bubbles, when the algorithm starts to
             * treat two bubbles as overlapping. The `bubblePadding` is also the
             * expected distance between all the bubbles on simulation end.
             */
            bubblePadding: 5,
            /**
             * Whether bubbles should interact with their parentNode to keep
             * them inside.
             */
            parentNodeLimit: false,
            /**
             * Whether series should interact with each other or not. When
             * `parentNodeLimit` is set to true, thi option should be set to
             * false to avoid sticking points in wrong series parentNode.
             */
            seriesInteraction: true,
            /**
             * In case of split series, this option allows user to drag and
             * drop points between series, for changing point related series.
             *
             * @sample highcharts/series-packedbubble/packed-dashboard/
             *         Example of drag'n drop bubbles for bubble kanban
             */
            dragBetweenSeries: false,
            /**
             * Layout algorithm options for parent nodes.
             *
             * @extends   plotOptions.networkgraph.layoutAlgorithm
             * @excluding approximation, attractiveForce, enableSimulation,
             *            repulsiveForce, theta
             */
            parentNodeOptions: {
                maxIterations: 400,
                gravitationalConstant: 0.03,
                maxSpeed: 50,
                initialPositionRadius: 100,
                seriesInteraction: true,
                /**
                 * Styling options for parentNodes markers. Similar to
                 * line.marker options.
                 *
                 * @sample highcharts/series-packedbubble/parentnode-style/
                 *         Bubble size
                 *
                 * @extends   plotOptions.series.marker
                 * @excluding states
                 */
                marker: {
                    fillColor: null as any,
                    fillOpacity: 1,
                    lineWidth: 1,
                    lineColor: null as any,
                    symbol: 'circle'
                }
            },
            enableSimulation: true,
            /**
             * Type of the algorithm used when positioning bubbles.
             * @ignore-option
             */
            type: 'packedbubble',
            /**
             * Integration type. Integration determines how forces are applied
             * on particles. The `packedbubble` integration is based on
             * the networkgraph `verlet` integration, where the new position
             * is based on a previous position without velocity:
             * `newPosition += previousPosition - newPosition`.
             *
             * @sample highcharts/series-networkgraph/forces/
             *
             * @ignore-option
             */
            integration: 'packedbubble',
            maxIterations: 1000,
            /**
             * Whether to split series into individual groups or to mix all
             * series together.
             *
             * @since   7.1.0
             * @default false
             */
            splitSeries: false,
            /**
             * Max speed that node can get in one iteration. In terms of
             * simulation, it's a maximum translation (in pixels) that a node
             * can move (in both, x and y, dimensions). While `friction` is
             * applied on all nodes, max speed is applied only for nodes that
             * move very fast, for example small or disconnected ones.
             *
             * @see [layoutAlgorithm.integration](#series.networkgraph.layoutAlgorithm.integration)
             *
             * @see [layoutAlgorithm.friction](#series.networkgraph.layoutAlgorithm.friction)
             */
            maxSpeed: 5,
            gravitationalConstant: 0.01,
            friction: -0.981
        }
    } as PackedBubbleSeriesOptions);

    /* *
     *
     *  Properties
     *
     * */

    public chart: PackedBubbleChart = void 0 as any;

    public data: Array<PackedBubblePoint> = void 0 as any;

    public hoverPoint?: PackedBubblePoint;

    public layout: PackedBubbleLayout = void 0 as any;

    public options: PackedBubbleSeriesOptions = void 0 as any;

    public parentNode?: PackedBubblePoint;

    public parentNodeLayout?: PackedBubbleLayout;

    public parentNodesGroup?: SVGElement;

    public parentNodeMass?: number;

    public parentNodeRadius?: number;

    public points: Array<PackedBubblePoint> = void 0 as any;

    public xData: Array<number> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Create a single array of all points from all series
     * @private
     */
    public accumulateAllPoints(series: PackedBubbleSeries): Array<PackedBubbleSeries.Data> {

        var chart = series.chart,
            allDataPoints = [] as Array<PackedBubbleSeries.Data>,
            i: number, j: number;

        for (i = 0; i < chart.series.length; i++) {

            series = chart.series[i] as any;

            if (
                series.is('packedbubble') && // #13574
                series.visible ||
                !(chart.options.chart as any).ignoreHiddenSeries
            ) {

                // add data to array only if series is visible
                for (j = 0; j < (series.yData as any).length; j++) {
                    allDataPoints.push([
                        null, null,
                        (series.yData as any)[j],
                        series.index,
                        j,
                        {
                            id: j as any,
                            marker: {
                                radius: 0
                            }
                        }
                    ]);
                }
            }
        }

        return allDataPoints;
    }

    /**
     * Adding the basic layout to series points.
     * @private
     */
    public addLayout(): void {
        var series = this,
            layoutOptions = series.options.layoutAlgorithm,
            graphLayoutsStorage = series.chart.graphLayoutsStorage,
            graphLayoutsLookup = series.chart.graphLayoutsLookup,
            chartOptions = series.chart.options.chart,
            layout;

        if (!graphLayoutsStorage) {
            series.chart.graphLayoutsStorage = graphLayoutsStorage = {};
            series.chart.graphLayoutsLookup = graphLayoutsLookup = [];
        }

        layout = graphLayoutsStorage[(layoutOptions as any).type];

        if (!layout) {
            (layoutOptions as any).enableSimulation =
                !defined((chartOptions as any).forExport) ?
                    (layoutOptions as any).enableSimulation :
                    !(chartOptions as any).forExport;

            graphLayoutsStorage[(layoutOptions as any).type] = layout =
                new (H.layouts[(layoutOptions as any).type] as any)();

            layout.init(layoutOptions);
            graphLayoutsLookup.splice(layout.index, 0, layout);

        }

        series.layout = layout;

        series.points.forEach(function (node): void {
            node.mass = 2;
            node.degree = 1;
            node.collisionNmb = 1;
        });

        layout.setArea(
            0, 0, series.chart.plotWidth, series.chart.plotHeight
        );
        layout.addElementsToCollection([series], layout.series);
        layout.addElementsToCollection(series.points, layout.nodes);
    }

    /**
     * Function responsible for adding series layout, used for parent nodes.
     * @private
     */
    public addSeriesLayout(): void {
        var series = this,
            layoutOptions = series.options.layoutAlgorithm,
            graphLayoutsStorage = series.chart.graphLayoutsStorage,
            graphLayoutsLookup = series.chart.graphLayoutsLookup,
            parentNodeOptions = merge(
                layoutOptions,
                (layoutOptions as any).parentNodeOptions,
                {
                    enableSimulation: series.layout.options.enableSimulation
                }
            ),
            parentNodeLayout;

        parentNodeLayout = graphLayoutsStorage[
            (layoutOptions as any).type + '-series'
        ];

        if (!parentNodeLayout) {

            graphLayoutsStorage[(layoutOptions as any).type + '-series'] =
            parentNodeLayout =
                new (H.layouts[(layoutOptions as any).type] as any)();

            parentNodeLayout.init(parentNodeOptions);

            graphLayoutsLookup.splice(
                parentNodeLayout.index, 0, parentNodeLayout
            );
        }
        series.parentNodeLayout = parentNodeLayout;
        this.createParentNodes();
    }

    /**
     * The function responsible for calculating the parent node radius
     * based on the total surface of iniside-bubbles and the group BBox
     * @private
     */
    public calculateParentRadius(): void {
        var series = this,
            bBox: (Array<number>|null),
            parentPadding = 20,
            minParentRadius = 20;

        bBox = series.seriesBox();
        series.parentNodeRadius = clamp(
            Math.sqrt(
                2 * (series.parentNodeMass as any) / Math.PI
            ) + parentPadding,
            minParentRadius,
            bBox ?
                Math.max(
                    Math.sqrt(
                        Math.pow((bBox as any).width, 2) +
                        Math.pow((bBox as any).height, 2)
                    ) / 2 + parentPadding,
                    minParentRadius
                ) :
                Math.sqrt(
                    2 * (series.parentNodeMass as any) / Math.PI
                ) + parentPadding
        );

        if (series.parentNode) {
            (series.parentNode as any).marker.radius =
                series.parentNode.radius = series.parentNodeRadius;
        }
    }

    /**
     * Calculate min and max bubble value for radius calculation.
     * @private
     */
    public calculateZExtremes(): Array<number> {
        var chart = this.chart,
            zMin = this.options.zMin,
            zMax = this.options.zMax,
            valMin = Infinity,
            valMax = -Infinity;

        if (zMin && zMax) {
            return [zMin, zMax];
        }
        // it is needed to deal with null
        // and undefined values
        chart.series.forEach(function (s): void {
            ((s as PackedBubbleSeries).yData as any).forEach(
                function (p: number): void {
                    if (defined(p)) {
                        if (p > valMax) {
                            valMax = p;
                        }
                        if (p < valMin) {
                            valMin = p;
                        }
                    }
                }
            );
        });

        zMin = pick(zMin, valMin);
        zMax = pick(zMax, valMax);

        return [zMin, zMax];
    }

    /**
     * Check if two bubbles overlaps.
     * @private
     * @param {Array} first bubble
     * @param {Array} second bubble
     * @return {Boolean} overlap or not
     */
    public checkOverlap(
        bubble1: Array<number>,
        bubble2: Array<number>
    ): boolean {
        var diffX = bubble1[0] - bubble2[0], // diff of X center values
            diffY = bubble1[1] - bubble2[1], // diff of Y center values
            sumRad = bubble1[2] + bubble2[2]; // sum of bubble radius

        return (
            Math.sqrt(diffX * diffX + diffY * diffY) -
            Math.abs(sumRad)
        ) < -0.001;
    }

    /**
     * Creating parent nodes for split series, in which all the bubbles
     * are rendered.
     * @private
     */
    public createParentNodes(): void {
        var series = this,
            chart = series.chart,
            parentNodeLayout: PackedBubbleLayout = series.parentNodeLayout as any,
            nodeAdded,
            parentNode = series.parentNode,
            PackedBubblePoint = series.pointClass;

        series.parentNodeMass = 0;

        series.points.forEach(function (p): void {
            (series.parentNodeMass as any) +=
                Math.PI * Math.pow((p.marker as any).radius, 2);
        });

        series.calculateParentRadius();
        parentNodeLayout.nodes.forEach(function (node): void {
            if (node.seriesIndex === series.index) {
                nodeAdded = true;
            }
        });
        parentNodeLayout.setArea(0, 0, chart.plotWidth, chart.plotHeight);
        if (!nodeAdded) {
            if (!parentNode) {
                parentNode = (
                    new PackedBubblePoint()
                ).init(
                    this,
                    {
                        mass: (series.parentNodeRadius as any) / 2,
                        marker: {
                            radius: series.parentNodeRadius
                        },
                        dataLabels: {
                            inside: false
                        },
                        dataLabelOnNull: true,
                        degree: series.parentNodeRadius,
                        isParentNode: true,
                        seriesIndex: series.index
                    } as any
                ) as any;
            }
            if (series.parentNode) {
                (parentNode as any).plotX = series.parentNode.plotX;
                (parentNode as any).plotY = series.parentNode.plotY;
            }
            series.parentNode = parentNode;
            parentNodeLayout.addElementsToCollection(
                [series as any], parentNodeLayout.series
            );
            parentNodeLayout.addElementsToCollection(
                [parentNode as any], parentNodeLayout.nodes
            );
        }
    }

    /**
     * Function responsible for adding all the layouts to the chart.
     * @private
     */
    public deferLayout(): void {
        // TODO split layouts to independent methods
        var series = this,
            layoutOptions = series.options.layoutAlgorithm;
        if (!series.visible) {
            return;
        }
        // layout is using nodes for position calculation
        series.addLayout();

        if ((layoutOptions as any).splitSeries) {
            series.addSeriesLayout();
        }
    }

    public destroy(): void {
        // Remove the series from all layouts series collections #11469
        if (this.chart.graphLayoutsLookup) {
            this.chart.graphLayoutsLookup.forEach(function (layout): void {
                layout.removeElementFromCollection(this, layout.series as any);
            }, this);
        }

        if (
            this.parentNode &&
            this.parentNodeLayout
        ) {
            this.parentNodeLayout.removeElementFromCollection(
                this.parentNode, this.parentNodeLayout.nodes
            );
            if (this.parentNode.dataLabel) {
                this.parentNode.dataLabel =
                    this.parentNode.dataLabel.destroy();
            }
        }
        Series.prototype.destroy.apply(this, arguments as any);
    }

    /**
     * Packedbubble has two separate collecions of nodes if split, render
     * dataLabels for both sets:
     * @private
     */
    public drawDataLabels(): void {
        var textPath = (this.options.dataLabels as any).textPath,
            points = this.points;

        // Render node labels:
        Series.prototype.drawDataLabels.apply(this, arguments as any);

        // Render parentNode labels:
        if (this.parentNode) {
            this.parentNode.formatPrefix = 'parentNode';
            this.points = [this.parentNode];
            (this.options.dataLabels as any).textPath =
                (this.options.dataLabels as any).parentNodeTextPath;
            Series.prototype.drawDataLabels.apply(this, arguments as any);

            // Restore nodes
            this.points = points;
            (this.options.dataLabels as any).textPath = textPath;
        }
    }

    /**
     * Create Background/Parent Nodes for split series.
     * @private
     */
    public drawGraph(): void {

        // if the series is not using layout, don't add parent nodes
        if (!this.layout || !this.layout.options.splitSeries) {
            return;
        }

        var series = this,
            chart = series.chart,
            parentAttribs: SVGAttributes = {},
            nodeMarker: BubblePointMarkerOptions =
                (this.layout.options.parentNodeOptions as any).marker,
            parentOptions: SVGAttributes = {
                fill: nodeMarker.fillColor || color(series.color).brighten(0.4).get(),
                opacity: nodeMarker.fillOpacity,
                stroke: nodeMarker.lineColor || series.color,
                'stroke-width': nodeMarker.lineWidth
            };

        // create the group for parent Nodes if doesn't exist
        if (!this.parentNodesGroup) {
            series.parentNodesGroup = series.plotGroup(
                'parentNodesGroup',
                'parentNode',
                series.visible ? 'inherit' : 'hidden',
                0.1, chart.seriesGroup
            );
            (series.group as any).attr({
                zIndex: 2
            });
        }

        this.calculateParentRadius();
        parentAttribs = merge({
            x: (series.parentNode as any).plotX -
                (series.parentNodeRadius as any),
            y: (series.parentNode as any).plotY -
                (series.parentNodeRadius as any),
            width: (series.parentNodeRadius as any) * 2,
            height: (series.parentNodeRadius as any) * 2
        }, parentOptions);
        if (!(series.parentNode as any).graphic) {
            series.graph = (series.parentNode as any).graphic =
                chart.renderer.symbol((parentOptions as any).symbol)
                    .add(series.parentNodesGroup);
        }
        (series.parentNode as any).graphic.attr(parentAttribs);

    }

    public drawTracker(): void {
        const series = this,
            /* chart = series.chart,
            pointer = chart.pointer,
            onMouseOver = function (e: PointerEvent): void {
                const point = pointer.getPointFromEvent(e);
                // undefined on graph in scatterchart
                if (typeof point !== 'undefined') {
                    pointer.isDirectTouch = true;
                    point.onMouseOver(e);
                }
            }, */
            parentNode = series.parentNode;
        let dataLabels;

        super.drawTracker();
        // Add reference to the point
        if (parentNode) {
            dataLabels = (
                isArray(parentNode.dataLabels) ?
                    parentNode.dataLabels :
                    (parentNode.dataLabel ? [parentNode.dataLabel] : [])
            );

            if (parentNode.graphic) {
                (parentNode.graphic.element as any).point = parentNode;
            }

            (dataLabels as any).forEach(function (
                dataLabel: SVGElement
            ): void {
                if (dataLabel.div) {
                    dataLabel.div.point = parentNode;
                } else {
                    (dataLabel.element as any).point = parentNode;
                }
            });
        }
    }

    /**
     * Calculate radius of bubbles in series.
     * @private
     */
    public getPointRadius(): void {
        var series = this,
            chart = series.chart,
            plotWidth = chart.plotWidth,
            plotHeight = chart.plotHeight,
            seriesOptions = series.options,
            useSimulation = seriesOptions.useSimulation,
            smallestSize = Math.min(plotWidth, plotHeight),
            extremes = {} as Record<string, number>,
            radii = [] as Array<(number|null)>,
            allDataPoints = chart.allDataPoints,
            minSize: number,
            maxSize: number,
            value: (number|null),
            radius: (number|null),
            zExtremes: Array<number>;
        ['minSize', 'maxSize'].forEach(function (prop: string): void {
            var length = parseInt((seriesOptions as any)[prop], 10),
                isPercent = /%$/.test((seriesOptions as any)[prop]);

            extremes[prop] = isPercent ?
                smallestSize * length / 100 :
                length * Math.sqrt(allDataPoints.length);
        });

        chart.minRadius = minSize = extremes.minSize /
            Math.sqrt(allDataPoints.length);
        chart.maxRadius = maxSize = extremes.maxSize /
            Math.sqrt(allDataPoints.length);

        zExtremes = useSimulation ?
            series.calculateZExtremes() :
            [minSize, maxSize];

        (allDataPoints || []).forEach(function (point, i): void {

            value = useSimulation ?
                clamp(
                    point[2] as any,
                    zExtremes[0],
                    zExtremes[1]
                ) :
                (point[2] as any);

            radius = series.getRadius(
                zExtremes[0],
                zExtremes[1],
                minSize,
                maxSize,
                value
            );
            if (radius === 0) {
                radius = null;
            }
            allDataPoints[i][2] = radius;
            radii.push(radius);
        });

        series.radii = radii;
    }

    public init(): PackedBubbleSeries {
        Series.prototype.init.apply(this, arguments);

        /* eslint-disable no-invalid-this */

        // When one series is modified, the others need to be recomputed
        this.eventsToUnbind.push(addEvent(this, 'updatedData', function (
            this: PackedBubbleSeries
        ): void {
            this.chart.series.forEach(function (s): void {
                if (s.type === this.type) {
                    s.isDirty = true;
                }
            }, this);
        }));

        /* eslint-enable no-invalid-this */

        return this;
    }

    /**
     * Mouse up action, finalizing drag&drop.
     * @private
     * @param {Highcharts.Point} point The point that event occured.
     */
    public onMouseUp(point: PackedBubblePoint): void {
        if (point.fixedPosition && !point.removed) {
            var distanceXY,
                distanceR,
                layout = this.layout,
                parentNodeLayout = this.parentNodeLayout;

            if (parentNodeLayout && layout.options.dragBetweenSeries) {
                parentNodeLayout.nodes.forEach(function (node): void {
                    if (
                        point && point.marker &&
                        node !== point.series.parentNode
                    ) {
                        distanceXY = layout.getDistXY(point, node);
                        distanceR = (
                            layout.vectorLength(distanceXY) -
                            (node.marker as any).radius -
                            (point.marker as any).radius
                        );
                        if (distanceR < 0) {
                            node.series.addPoint(merge(point.options, {
                                plotX: point.plotX,
                                plotY: point.plotY
                            }), false);
                            layout.removeElementFromCollection(
                                point, layout.nodes
                            );
                            point.remove();
                        }
                    }
                });
            }
            dragNodesMixin.onMouseUp.apply(this, arguments as any);
        }
    }

    /**
     * This is the main function responsible
     * for positioning all of the bubbles
     * allDataPoints - bubble array, in format [pixel x value,
     * pixel y value, radius,
     * related series index, related point index]
     * @private
     * @param {Array<Highcharts.PackedBubbleData>} allDataPoints All points from all series
     * @return {Array<Highcharts.PackedBubbleData>} Positions of all bubbles
     */
    public placeBubbles(allDataPoints: Array<PackedBubbleSeries.Data>): Array<PackedBubbleSeries.Data> {

        var series = this,
            checkOverlap = series.checkOverlap,
            positionBubble = series.positionBubble,
            bubblePos = [] as Array<Array<Array<number>>>,
            stage = 1,
            j = 0,
            k = 0,
            calculatedBubble,
            sortedArr: Array<PackedBubbleSeries.Data>,
            arr = [] as Array<PackedBubbleSeries.Data>,
            i: number;

        // sort all points
        sortedArr = allDataPoints.sort(function (a, b): number {
            return (b[2] as any) - (a[2] as any);
        });

        if (sortedArr.length) {
            // create first bubble in the middle of the chart
            bubblePos.push([
                [
                    0, // starting in 0,0 coordinates
                    0,
                    sortedArr[0][2] as any, // radius
                    sortedArr[0][3], // series index
                    sortedArr[0][4]
                ] // point index
            ]); // 0 level bubble
            if (sortedArr.length > 1) {

                bubblePos.push([
                    [
                        0,
                        (
                            0 - (sortedArr[1][2] as any) -
                            (sortedArr[0][2] as any)
                        ),
                        // move bubble above first one
                        sortedArr[1][2] as any,
                        sortedArr[1][3],
                        sortedArr[1][4]
                    ]
                ]); // 1 level 1st bubble

                // first two already positioned so starting from 2
                for (i = 2; i < sortedArr.length; i++) {
                    sortedArr[i][2] = sortedArr[i][2] || 1;
                    // in case if radius is calculated as 0.
                    calculatedBubble = positionBubble(
                        bubblePos[stage][j] as any,
                        bubblePos[stage - 1][k] as any,
                        sortedArr[i] as any
                    ); // calculate initial bubble position

                    if (
                        checkOverlap(
                            calculatedBubble,
                            bubblePos[stage][0] as any
                        )
                    ) {
                        /* if new bubble is overlapping with first bubble
                            * in current level (stage)
                            */

                        bubblePos.push([]);
                        k = 0;
                        /* reset index of bubble, used for
                            * positioning the bubbles around it,
                            * we are starting from first bubble in next
                            * stage because we are changing level to higher
                            */
                        bubblePos[stage + 1].push(
                            positionBubble(
                                bubblePos[stage][j] as any,
                                bubblePos[stage][0] as any,
                                sortedArr[i] as any
                            )
                        );
                        // (last bubble, 1. from curr stage, new bubble)
                        stage++; // the new level is created, above current
                        j = 0; // set the index of bubble in curr level to 0
                    } else if (
                        stage > 1 &&
                        bubblePos[stage - 1][k + 1] &&
                        checkOverlap(
                            calculatedBubble,
                            bubblePos[stage - 1][k + 1] as any
                        )
                    ) {
                        /* if new bubble is overlapping with one of the prev
                            * stage bubbles, it means that - bubble, used for
                            * positioning the bubbles around it has changed
                            * so we need to recalculate it
                            */
                        k++;
                        bubblePos[stage].push(
                            positionBubble(
                                bubblePos[stage][j] as any,
                                bubblePos[stage - 1][k] as any,
                                sortedArr[i] as any
                            )
                        );
                        // (last bubble, prev stage bubble, new bubble)
                        j++;
                    } else { // simply add calculated bubble
                        j++;
                        bubblePos[stage].push(calculatedBubble);
                    }
                }
            }
            series.chart.stages = bubblePos;
            // it may not be necessary but adding it just in case -
            // it is containing all of the bubble levels

            series.chart.rawPositions =
                ([] as Array<Array<number>>)
                    .concat.apply([], bubblePos);
            // bubble positions merged into one array

            series.resizeRadius();
            arr = series.chart.rawPositions as any;
        }
        return arr;
    }

    /**
     * Function that is adding one bubble based on positions and sizes of
     * two other bubbles, lastBubble is the last added bubble, newOrigin is
     * the bubble for positioning new bubbles. nextBubble is the curently
     * added bubble for which we are calculating positions
     * @private
     * @param {Array<number>} lastBubble The closest last bubble
     * @param {Array<number>} newOrigin New bubble
     * @param {Array<number>} nextBubble The closest next bubble
     * @return {Array<number>} Bubble with correct positions
     */
    public positionBubble(
        lastBubble: Array<number>,
        newOrigin: Array<number>,
        nextBubble: Array<number>
    ): Array<number> {
        var sqrt = Math.sqrt,
            asin = Math.asin,
            acos = Math.acos,
            pow = Math.pow,
            abs = Math.abs,
            distance = sqrt( // dist between lastBubble and newOrigin
                pow((lastBubble[0] - newOrigin[0]), 2) +
                pow((lastBubble[1] - newOrigin[1]), 2)
            ),
            alfa = acos(
                // from cosinus theorem: alfa is an angle used for
                // calculating correct position
                (
                    pow(distance, 2) +
                    pow(nextBubble[2] + newOrigin[2], 2) -
                    pow(nextBubble[2] + lastBubble[2], 2)
                ) / (2 * (nextBubble[2] + newOrigin[2]) * distance)
            ),

            beta = asin( // from sinus theorem.
                abs(lastBubble[0] - newOrigin[0]) /
                distance
            ),
            // providing helping variables, related to angle between
            // lastBubble and newOrigin
            gamma = (lastBubble[1] - newOrigin[1]) < 0 ? 0 : Math.PI,
            // if new origin y is smaller than last bubble y value
            // (2 and 3 quarter),
            // add Math.PI to final angle

            delta = (lastBubble[0] - newOrigin[0]) *
            (lastBubble[1] - newOrigin[1]) < 0 ?
                1 : -1, // (1st and 3rd quarter)
            finalAngle = gamma + alfa + beta * delta,
            cosA = Math.cos(finalAngle),
            sinA = Math.sin(finalAngle),
            posX = newOrigin[0] + (newOrigin[2] + nextBubble[2]) * sinA,
            // center of new origin + (radius1 + radius2) * sinus A
            posY = newOrigin[1] - (newOrigin[2] + nextBubble[2]) * cosA;
        return [
            posX,
            posY,
            nextBubble[2],
            nextBubble[3],
            nextBubble[4]
        ]; // the same as described before
    }

    public render(): void {
        var series = this,
            dataLabels = [] as Array<SVGElement>;
        Series.prototype.render.apply(this, arguments);
        // #10823 - dataLabels should stay visible
        // when enabled allowOverlap.
        if (!(series.options.dataLabels as any).allowOverlap) {
            series.data.forEach(function (point): void {
                if (isArray(point.dataLabels)) {
                    point.dataLabels.forEach(function (
                        dataLabel: SVGElement
                    ): void {
                        dataLabels.push(dataLabel);
                    });
                }
            });

            // Only hide overlapping dataLabels for layouts that
            // use simulation. Spiral packedbubble don't need
            // additional dataLabel hiding on every simulation step
            if (series.options.useSimulation) {
                series.chart.hideOverlappingLabels(dataLabels);
            }
        }
    }

    /**
     * The function responsible for resizing the bubble radius.
     * In shortcut: it is taking the initially
     * calculated positions of bubbles. Then it is calculating the min max
     * of both dimensions, creating something in shape of bBox.
     * The comparison of bBox and the size of plotArea
     * (later it may be also the size set by customer) is giving the
     * value how to recalculate the radius so it will match the size
     * @private
     */
    public resizeRadius(): void {

        var chart = this.chart,
            positions = chart.rawPositions,
            min = Math.min,
            max = Math.max,
            plotLeft = chart.plotLeft,
            plotTop = chart.plotTop,
            chartHeight = chart.plotHeight,
            chartWidth = chart.plotWidth,
            minX, maxX, minY, maxY,
            radius,
            bBox,
            spaceRatio,
            smallerDimension,
            i;

        minX = minY = Number.POSITIVE_INFINITY; // set initial values
        maxX = maxY = Number.NEGATIVE_INFINITY;

        for (i = 0; i < positions.length; i++) {
            radius = positions[i][2];
            minX = min(minX, (positions[i][0] as any) - (radius as any));
            // (x center-radius) is the min x value used by specific bubble
            maxX = max(maxX, (positions[i][0] as any) + radius);
            minY = min(minY, (positions[i][1] as any) - (radius as any));
            maxY = max(maxY, (positions[i][1] as any) + radius);
        }

        bBox = [maxX - minX, maxY - minY];
        spaceRatio = [
            (chartWidth - plotLeft) / bBox[0],
            (chartHeight - plotTop) / bBox[1]
        ];

        smallerDimension = min.apply([], spaceRatio);

        if (Math.abs(smallerDimension - 1) > 1e-10) {
            // if bBox is considered not the same width as possible size
            for (i = 0; i < positions.length; i++) {
                (positions[i][2] as any) *= smallerDimension;
            }
            this.placeBubbles(positions as any);
        } else {
            /** if no radius recalculation is needed, we need to position
             * the whole bubbles in center of chart plotarea
             * for this, we are adding two parameters,
             * diffY and diffX, that are related to differences
             * between the initial center and the bounding box
             */
            chart.diffY = chartHeight / 2 +
                plotTop - minY - (maxY - minY) / 2;
            chart.diffX = chartWidth / 2 +
                plotLeft - minX - (maxX - minX) / 2;
        }
    }

    /**
     * The function responsible for calculating series bubble' s bBox.
     * Needed because of exporting failure when useSimulation
     * is set to false
     * @private
     */
    public seriesBox(): (Array<number>|null) {
        var series = this,
            chart = series.chart,
            data = series.data,
            max = Math.max,
            min = Math.min,
            radius,
            // bBox = [xMin, xMax, yMin, yMax]
            bBox = [
                chart.plotLeft,
                chart.plotLeft + chart.plotWidth,
                chart.plotTop,
                chart.plotTop + chart.plotHeight
            ];

        data.forEach(function (p): void {
            if (
                defined(p.plotX) &&
                defined(p.plotY) &&
                (p.marker as any).radius
            ) {
                radius = (p.marker as any).radius;
                bBox[0] = min(bBox[0], p.plotX - radius);
                bBox[1] = max(bBox[1], p.plotX + radius);
                bBox[2] = min(bBox[2], p.plotY - radius);
                bBox[3] = max(bBox[3], p.plotY + radius);
            }
        });
        return isNumber((bBox as any).width / (bBox as any).height) ?
            bBox :
            null;
    }

    /**
     * Needed because of z-indexing issue if point is added in series.group
     * @private
     */
    public setVisible(): void {
        var series = this;
        Series.prototype.setVisible.apply(series, arguments as any);
        if (series.parentNodeLayout && series.graph) {
            if (series.visible) {
                series.graph.show();
                if ((series.parentNode as any).dataLabel) {
                    (series.parentNode as any).dataLabel.show();
                }
            } else {
                series.graph.hide();
                series.parentNodeLayout
                    .removeElementFromCollection(
                        series.parentNode, series.parentNodeLayout.nodes
                    );
                if ((series.parentNode as any).dataLabel) {
                    (series.parentNode as any).dataLabel.hide();
                }
            }
        } else if (series.layout) {
            if (series.visible) {
                series.layout.addElementsToCollection(
                    series.points, series.layout.nodes
                );
            } else {
                series.points.forEach(function (node): void {
                    series.layout.removeElementFromCollection(
                        node, series.layout.nodes
                    );
                });
            }
        }
    }

    /**
     * Extend the base translate method to handle bubble size,
     * and correct positioning them.
     * @private
     */
    public translate(): void {

        var series = this,
            chart = series.chart,
            data = series.data,
            index = series.index,
            point,
            radius,
            positions,
            i,
            useSimulation = series.options.useSimulation;

        series.processedXData = series.xData;
        series.generatePoints();

        // merged data is an array with all of the data from all series
        if (!defined(chart.allDataPoints)) {
            chart.allDataPoints = series.accumulateAllPoints(series);
            // calculate radius for all added data
            series.getPointRadius();
        }

        // after getting initial radius, calculate bubble positions

        if (useSimulation) {
            positions = chart.allDataPoints;
        } else {
            positions = series.placeBubbles(chart.allDataPoints);
            series.options.draggable = false;
        }

        // Set the shape and arguments to be picked up in drawPoints
        for (i = 0; i < positions.length; i++) {

            if (positions[i][3] === index) {

                // update the series points with the val from positions
                // array
                point = data[positions[i][4] as any];
                radius = positions[i][2];

                if (!useSimulation) {
                    point.plotX = (
                        (positions[i][0] as any) - chart.plotLeft +
                        chart.diffX
                    );
                    point.plotY = (
                        (positions[i][1] as any) - chart.plotTop +
                        chart.diffY
                    );
                }
                point.marker = extend(point.marker, {
                    radius: radius,
                    width: 2 * (radius as any),
                    height: 2 * (radius as any)
                });
                point.radius = radius as any;
            }
        }

        if (useSimulation) {
            series.deferLayout();
        }

        fireEvent(series, 'afterTranslate');
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Prototype Properties
 *
 * */

interface PackedBubbleSeries {
    forces: Array<string>;
    hasDraggableNodes: boolean;
    isCartesian: boolean;
    noSharedTooltip: boolean;
    onMouseDown: Highcharts.DragNodesMixin['onMouseDown'];
    onMouseMove: Highcharts.DragNodesMixin['onMouseMove'];
    pointArrayMap: Array<string>;
    pointClass: typeof PackedBubblePoint;
    pointValKey: string;
    redrawHalo: Highcharts.DragNodesMixin['redrawHalo'];
    trackerGroups: Array<string>;
}
extend(PackedBubbleSeries.prototype, {

    alignDataLabel: Series.prototype.alignDataLabel,

    axisTypes: [],

    directTouch: true,

    /**
     * Array of internal forces. Each force should be later defined in
     * integrations.js.
     * @private
     */
    forces: ['barycenter', 'repulsive'],

    /**
     * An internal option used for allowing nodes dragging.
     * @private
     */
    hasDraggableNodes: true,

    isCartesian: false,

    noSharedTooltip: true,

    /**
     * Mouse down action, initializing drag&drop mode.
     * @private
     * @param {global.Event} event Browser event, before normalization.
     * @param {Highcharts.Point} point The point that event occured.
     */
    onMouseDown: dragNodesMixin.onMouseDown,

    /**
     * Mouse move action during drag&drop.
     * @private
     * @param {global.Event} event Browser event, before normalization.
     * @param {Highcharts.Point} point The point that event occured.
     */
    onMouseMove: dragNodesMixin.onMouseMove,

    pointArrayMap: ['value'],

    pointClass: PackedBubblePoint,

    pointValKey: 'value',

    /**
     * Redraw halo on mousemove during the drag&drop action.
     * @private
     * @param {Highcharts.Point} point The point that should show halo.
     */
    redrawHalo: dragNodesMixin.redrawHalo,

    requireSorting: false,

    // solving #12287
    searchPoint: H.noop as any,

    trackerGroups: ['group', 'dataLabelsGroup', 'parentNodesGroup']

});

/* *
 *
 *  Class Namespace
 *
 * */

namespace PackedBubbleSeries {

    export type Data = [
        (number|null),
        (number|null),
        (number|null),
        number,
        number,
        PackedBubblePointOptions
    ];

}

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        packedbubble: typeof PackedBubbleSeries;
    }
}
SeriesRegistry.registerSeriesType('packedbubble', PackedBubbleSeries);

/* *
 *
 *  Default Export
 *
 * */

export default PackedBubbleSeries;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * Formatter callback function.
 *
 * @callback Highcharts.SeriesPackedBubbleDataLabelsFormatterCallbackFunction
 *
 * @param {Highcharts.SeriesPackedBubbleDataLabelsFormatterContextObject} this
 *        Data label context to format
 *
 * @return {string}
 *         Formatted data label text
 */

/**
 * Context for the formatter function.
 *
 * @interface Highcharts.SeriesPackedBubbleDataLabelsFormatterContextObject
 * @extends Highcharts.PointLabelObject
 * @since 7.0.0
 *//**
 * The color of the node.
 * @name Highcharts.SeriesPackedBubbleDataLabelsFormatterContextObject#color
 * @type {Highcharts.ColorString}
 * @since 7.0.0
 *//**
 * The point (node) object. The node name, if defined, is available through
 * `this.point.name`. Arrays: `this.point.linksFrom` and `this.point.linksTo`
 * contains all nodes connected to this point.
 * @name Highcharts.SeriesPackedBubbleDataLabelsFormatterContextObject#point
 * @type {Highcharts.Point}
 * @since 7.0.0
 *//**
 * The ID of the node.
 * @name Highcharts.SeriesPackedBubbleDataLabelsFormatterContextObject#key
 * @type {string}
 * @since 7.0.0
 */

''; // detach doclets above

/* *
 *
 *  API Options
 *
 * */

/**
 * A `packedbubble` series. If the [type](#series.packedbubble.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @type      {Object}
 * @extends   series,plotOptions.packedbubble
 * @excluding cropThreshold, dataParser, dataSorting, dataURL, dragDrop, stack,
 *            boostThreshold, boostBlending
 * @product   highcharts
 * @requires  highcharts-more
 * @apioption series.packedbubble
 */

/**
 * An array of data points for the series. For the `packedbubble` series type,
 * points can be given in the following ways:
 *
 * 1.  An array of `values`.
 *
 *  ```js
 *     data: [5, 1, 20]
 *  ```
 *
 * 2.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data points
 * exceeds the series' [turboThreshold](#series.packedbubble.turboThreshold),
 * this option is not available.
 *
 *  ```js
 *     data: [{
 *         value: 1,
 *         name: "Point2",
 *         color: "#00FF00"
 *     }, {
 *         value: 5,
 *         name: "Point1",
 *         color: "#FF00FF"
 *     }]
 *  ```
 *
 * @type      {Array<Object|Array>}
 * @extends   series.line.data
 * @excluding marker, x, y
 * @sample    {highcharts} highcharts/series/data-array-of-objects/
 *            Config objects
 * @product   highcharts
 * @apioption series.packedbubble.data
 */

/**
 * @type      {Highcharts.SeriesPackedBubbleDataLabelsOptionsObject|Array<Highcharts.SeriesPackedBubbleDataLabelsOptionsObject>}
 * @product   highcharts
 * @apioption series.packedbubble.data.dataLabels
 */

/**
 * @excluding enabled,enabledThreshold,height,radius,width
 * @product   highcharts
 * @apioption series.packedbubble.marker
 */

''; // adds doclets above to transpiled file
