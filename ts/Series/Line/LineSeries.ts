/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type LinePoint from './LinePoint';
import type {
    LineSeriesOptions,
    LineSeriesPlotOptions
} from './LineSeriesOptions';
import type SplineSeries from '../Spline/SplineSeries';
import type SplinePoint from '../Spline/SplinePoint';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';

import LineSeriesDefaults from './LineSeriesDefaults.js';
import { Palette } from '../../Core/Color/Palettes.js';
import Series from '../../Core/Series/Series.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import U from '../../Core/Utilities.js';
const {
    defined,
    merge
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * The line series is the base type and is therefor the series base prototype.
 *
 * @private
 */
class LineSeries extends Series {

    /* *
     *
     *  Static Functions
     *
     * */

    public static defaultOptions: LineSeriesPlotOptions = merge(
        Series.defaultOptions,
        LineSeriesDefaults
    );

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<LinePoint> = void 0 as any;

    public options: LineSeriesOptions = void 0 as any;

    public points: Array<LinePoint> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Draw the graph. Called internally when rendering line-like series
     * types. The first time it generates the `series.graph` item and
     * optionally other series-wide items like `series.area` for area
     * charts. On subsequent calls these items are updated with new
     * positions and attributes.
     *
     * @function Highcharts.Series#drawGraph
     */
    public drawGraph(): void {
        const series = this,
            options = this.options,
            graphPath = (this.gappedPath || this.getGraphPath).call(this),
            styledMode = this.chart.styledMode;
        let props = [[
            'graph',
            'highcharts-graph'
        ]];

        // Presentational properties
        if (!styledMode) {
            props[0].push(
                (
                    options.lineColor ||
                    this.color ||
                    Palette.neutralColor20 // when colorByPoint = true
                ) as any,
                options.dashStyle as any
            );
        }

        props = series.getZonesGraphs(props);

        // Draw the graph
        props.forEach(function (prop, i): void {
            const graphKey = prop[0];
            let attribs: SVGAttributes,
                graph = (series as any)[graphKey];
            const verb = graph ? 'animate' : 'attr';

            if (graph) {
                graph.endX = series.preventGraphAnimation ?
                    null :
                    graphPath.xMap;
                graph.animate({ d: graphPath });

            } else if (graphPath.length) { // #1487

                /**
                 * SVG element of area-based charts. Can be used for styling
                 * purposes. If zones are configured, this element will be
                 * hidden and replaced by multiple zone areas, accessible
                 * via `series['zone-area-x']` (where x is a number,
                 * starting with 0).
                 *
                 * @name Highcharts.Series#area
                 * @type {Highcharts.SVGElement|undefined}
                 */
                /**
                 * SVG element of line-based charts. Can be used for styling
                 * purposes. If zones are configured, this element will be
                 * hidden and replaced by multiple zone lines, accessible
                 * via `series['zone-graph-x']` (where x is a number,
                 * starting with 0).
                 *
                 * @name Highcharts.Series#graph
                 * @type {Highcharts.SVGElement|undefined}
                 */
                (series as any)[graphKey] = graph = series.chart.renderer
                    .path(graphPath)
                    .addClass(prop[1])
                    .attr({ zIndex: 1 }) // #1069
                    .add(series.group);
            }

            if (graph && !styledMode) {

                attribs = {
                    'stroke': prop[2],
                    'stroke-width': options.lineWidth,
                    // Polygon series use filled graph
                    'fill': (series.fillGraph && series.color) || 'none'
                };

                if (prop[3]) {
                    attribs.dashstyle = prop[3] as any;
                } else if (options.linecap !== 'square') {
                    attribs['stroke-linecap'] =
                        attribs['stroke-linejoin'] = 'round';
                }
                graph[verb](attribs)
                    // Add shadow to normal series (0) or to first
                    // zone (1) #3932
                    .shadow((i < 2) && options.shadow);
            }

            // Helpers for animation
            if (graph) {
                graph.startX = graphPath.xMap;
                graph.isArea = graphPath.isArea; // For arearange animation
            }
        });
    }

    // eslint-disable-next-line valid-jsdoc
    /**
     * Get the graph path.
     *
     * @private
     */
    public getGraphPath(
        points?: Array<LinePoint>,
        nullsAsZeroes?: boolean,
        connectCliffs?: boolean
    ): SVGPath {
        const series = this,
            options = series.options,
            graphPath = [] as SVGPath,
            xMap = [] as Array<(number|null)>;
        let gap: boolean,
            step = options.step as any;

        points = points || series.points;

        // Bottom of a stack is reversed
        const reversed = (points as any).reversed;
        if (reversed) {
            points.reverse();
        }
        // Reverse the steps (#5004)
        step = ({
            right: 1,
            center: 2
        } as Record<string, number>)[step as any] || (step && 3);
        if (step && reversed) {
            step = 4 - step;
        }

        // Remove invalid points, especially in spline (#5015)
        points = this.getValidPoints(
            points,
            false,
            !(options.connectNulls && !nullsAsZeroes && !connectCliffs)
        ) as Array<LinePoint>;

        // Build the line
        points.forEach(function (point, i): void {

            const plotX = point.plotX,
                plotY = point.plotY,
                lastPoint = (points as any)[i - 1];
            // the path to this point from the previous
            let pathToPoint: SVGPath;

            if (
                (point.leftCliff || (lastPoint && lastPoint.rightCliff)) &&
                !connectCliffs
            ) {
                gap = true; // ... and continue
            }

            // Line series, nullsAsZeroes is not handled
            if (point.isNull && !defined(nullsAsZeroes) && i > 0) {
                gap = !options.connectNulls;

            // Area series, nullsAsZeroes is set
            } else if (point.isNull && !nullsAsZeroes) {
                gap = true;

            } else {

                if (i === 0 || gap) {
                    pathToPoint = [[
                        'M',
                        point.plotX as any,
                        point.plotY as any
                    ]];

                // Generate the spline as defined in the SplineSeries object
                } else if (
                    (series as unknown as Partial<SplineSeries>).getPointSpline
                ) {

                    pathToPoint = [(
                        series as unknown as SplineSeries
                    ).getPointSpline(
                        points as Array<SplinePoint>,
                        point as SplinePoint,
                        i
                    )];

                } else if (step) {

                    if (step === 1) { // right
                        pathToPoint = [[
                            'L',
                            lastPoint.plotX as any,
                            plotY as any
                        ]];

                    } else if (step === 2) { // center
                        pathToPoint = [[
                            'L',
                            ((lastPoint.plotX as any) + plotX) / 2,
                            lastPoint.plotY as any
                        ], [
                            'L',
                            ((lastPoint.plotX as any) + plotX) / 2,
                            plotY as any
                        ]];

                    } else {
                        pathToPoint = [[
                            'L',
                            plotX as any,
                            lastPoint.plotY as any
                        ]];
                    }
                    pathToPoint.push([
                        'L',
                        plotX as any,
                        plotY as any
                    ]);

                } else {
                    // normal line to next point
                    pathToPoint = [[
                        'L',
                        plotX as any,
                        plotY as any
                    ]];
                }

                // Prepare for animation. When step is enabled, there are
                // two path nodes for each x value.
                xMap.push(point.x);
                if (step) {
                    xMap.push(point.x);
                    if (step === 2) { // step = center (#8073)
                        xMap.push(point.x);
                    }
                }

                graphPath.push.apply(graphPath, pathToPoint);
                gap = false;
            }
        });

        (graphPath as any).xMap = xMap;
        series.graphPath = graphPath;

        return graphPath;
    }

    // eslint-disable-next-line valid-jsdoc
    /**
     * Get zones properties for building graphs. Extendable by series with
     * multiple lines within one series.
     *
     * @private
     */
    public getZonesGraphs(props: Array<Array<string>>): Array<Array<string>> {
        // Add the zone properties if any
        this.zones.forEach(function (zone, i): void {
            const propset = [
                'zone-graph-' + i,
                'highcharts-graph highcharts-zone-graph-' + i + ' ' +
                    (zone.className || '')
            ];

            if (!this.chart.styledMode) {
                propset.push(
                    (zone.color || this.color) as any,
                    (zone.dashStyle || this.options.dashStyle) as any
                );
            }
            props.push(propset);
        }, this);

        return props;
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface LineSeries {
    pointClass: typeof LinePoint;
}

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        line: typeof LineSeries;
    }
}
SeriesRegistry.registerSeriesType('line', LineSeries);

/* *
 *
 *  Default Export
 *
 * */

export default LineSeries;
