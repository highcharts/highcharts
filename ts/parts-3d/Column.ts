/* *
 *
 *  (c) 2010-2019 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface ColumnChart extends Chart {
            columnGroup: SVGElement;
        }
        interface ColumnPoint {
            height?: number;
            outside3dPlot?: (boolean|null);
            shapey?: number;
        }
        interface ColumnPointOptions {
            visible?: boolean;
        }
        interface ColumnSeries {
            chart: ColumnChart;
            handle3dGrouping: boolean;
            z: number;
        }
        interface ColumnSeriesOptions {
            depth?: number;
            edgeColor?: ColorString;
            edgeWidth?: number;
            groupZPadding?: number;
            inactiveOtherPoints?: boolean;
        }
        interface Series {
            translate3dShapes(): void;
        }
    }
}

import U from '../parts/Utilities.js';
const {
    pick,
    wrap
} = U;

import '../parts/Series.js';

var addEvent = H.addEvent,
    perspective = H.perspective,
    Series = H.Series,
    seriesTypes = H.seriesTypes,
    svg = H.svg;

/**
 * Depth of the columns in a 3D column chart.
 *
 * @type      {number}
 * @default   25
 * @since     4.0
 * @product   highcharts
 * @requires  highcharts-3d
 * @apioption plotOptions.column.depth
 */

/**
 * 3D columns only. The color of the edges. Similar to `borderColor`, except it
 * defaults to the same color as the column.
 *
 * @type      {Highcharts.ColorString}
 * @product   highcharts
 * @requires  highcharts-3d
 * @apioption plotOptions.column.edgeColor
 */

/**
 * 3D columns only. The width of the colored edges.
 *
 * @type      {number}
 * @default   1
 * @product   highcharts
 * @requires  highcharts-3d
 * @apioption plotOptions.column.edgeWidth
 */

/**
 * The spacing between columns on the Z Axis in a 3D chart.
 *
 * @type      {number}
 * @default   1
 * @since     4.0
 * @product   highcharts
 * @requires  highcharts-3d
 * @apioption plotOptions.column.groupZPadding
 */

/* eslint-disable no-invalid-this */

wrap(seriesTypes.column.prototype, 'translate', function (
    this: Highcharts.ColumnSeries,
    proceed: Function
): void {
    proceed.apply(this, [].slice.call(arguments, 1));

    // Do not do this if the chart is not 3D
    if (this.chart.is3d()) {
        this.translate3dShapes();
    }
});

// In 3D we need to pass point.outsidePlot option to the justifyDataLabel
// method for disabling justifying dataLabels in columns outside plot
wrap(H.Series.prototype, 'alignDataLabel', function (
    this: Highcharts.ColumnSeries,
    proceed: Function
): void {
    arguments[3].outside3dPlot = arguments[1].outside3dPlot;
    proceed.apply(this, [].slice.call(arguments, 1));
});

// Don't use justifyDataLabel when point is outsidePlot
wrap(H.Series.prototype, 'justifyDataLabel', function (
    this: Highcharts.ColumnSeries,
    proceed: Function
): void {
    return !(arguments[2].outside3dPlot) ?
        proceed.apply(this, [].slice.call(arguments, 1)) :
        false;
});

seriesTypes.column.prototype.translate3dPoints = function (): void {};
seriesTypes.column.prototype.translate3dShapes = function (): void {

    var series = this as Highcharts.ColumnSeries,
        chart = series.chart,
        seriesOptions = series.options,
        depth = seriesOptions.depth || 25,
        stack = seriesOptions.stacking ?
            (seriesOptions.stack || 0) :
            series.index, // #4743
        z = (stack as any) * (depth + (seriesOptions.groupZPadding || 1)),
        borderCrisp = series.borderWidth % 2 ? 0.5 : 0;

    if (chart.inverted && !series.yAxis.reversed) {
        borderCrisp *= -1;
    }

    if (seriesOptions.grouping !== false) {
        z = 0;
    }

    z += (seriesOptions.groupZPadding || 1);
    series.data.forEach(function (point: Highcharts.ColumnPoint): void {
        // #7103 Reset outside3dPlot flag
        point.outside3dPlot = null;
        if (point.y !== null) {
            var shapeArgs = point.shapeArgs,
                tooltipPos = point.tooltipPos,
                // Array for final shapeArgs calculation.
                // We are checking two dimensions (x and y).
                dimensions = [['x', 'width'], ['y', 'height']],
                borderlessBase; // Crisped rects can have +/- 0.5 pixels offset.

            // #3131 We need to check if column is inside plotArea.
            dimensions.forEach(function (d: Array<string>): void {
                borderlessBase = (shapeArgs as any)[d[0]] - borderCrisp;
                if (borderlessBase < 0) {
                    // If borderLessBase is smaller than 0, it is needed to set
                    // its value to 0 or 0.5 depending on borderWidth
                    // borderWidth may be even or odd.
                    (shapeArgs as any)[d[1]] +=
                        (shapeArgs as any)[d[0]] + borderCrisp;
                    (shapeArgs as any)[d[0]] = -borderCrisp;
                    borderlessBase = 0;
                }
                if (
                    (
                        borderlessBase + (shapeArgs as any)[d[1]] >
                        (series as any)[d[0] + 'Axis'].len
                    ) &&
                    // Do not change height/width of column if 0 (#6708)
                    (shapeArgs as any)[d[1]] !== 0
                ) {
                    (shapeArgs as any)[d[1]] =
                        (series as any)[d[0] + 'Axis'].len -
                        (shapeArgs as any)[d[0]];
                }
                if (
                    // Do not remove columns with zero height/width.
                    ((shapeArgs as any)[d[1]] !== 0) &&
                    (
                        (shapeArgs as any)[d[0]] >=
                        (series as any)[d[0] + 'Axis'].len ||
                        (shapeArgs as any)[d[0]] + (shapeArgs as any)[d[1]] <=
                        borderCrisp
                    )
                ) {
                    // Set args to 0 if column is outside the chart.
                    for (var key in shapeArgs) { // eslint-disable-line guard-for-in
                        shapeArgs[key] = 0;
                    }
                    // #7103 outside3dPlot flag is set on Points which are
                    // currently outside of plot.
                    point.outside3dPlot = true;
                }
            });

            // Change from 2d to 3d
            if (point.shapeType === 'rect') {
                point.shapeType = 'cuboid';
            }

            (shapeArgs as any).z = z;
            (shapeArgs as any).depth = depth;
            (shapeArgs as any).insidePlotArea = true;

            // Translate the tooltip position in 3d space
            tooltipPos = perspective(
                [{
                    x: (tooltipPos as any)[0],
                    y: (tooltipPos as any)[1],
                    z: z
                }],
                chart,
                true
            )[0] as any;
            point.tooltipPos = [(tooltipPos as any).x, (tooltipPos as any).y];
        }
    });
    // store for later use #4067
    series.z = z;
};

wrap(seriesTypes.column.prototype, 'animate', function (
    this: Highcharts.ColumnSeries,
    proceed: Function
): void {
    if (!this.chart.is3d()) {
        proceed.apply(this, [].slice.call(arguments, 1));
    } else {
        var args = arguments,
            init = args[1],
            yAxis = this.yAxis,
            series = this,
            reversed = this.yAxis.reversed;

        if (svg) { // VML is too slow anyway
            if (init) {
                series.data.forEach(function (
                    point: Highcharts.ColumnPoint
                ): void {
                    if (point.y !== null) {
                        point.height = (point.shapeArgs as any).height;
                        point.shapey = (point.shapeArgs as any).y; // #2968
                        (point.shapeArgs as any).height = 1;
                        if (!reversed) {
                            if (point.stackY) {
                                (point.shapeArgs as any).y =
                                    (point.plotY as any) +
                                    yAxis.translate(point.stackY);
                            } else {
                                (point.shapeArgs as any).y =
                                    (point.plotY as any) +
                                    (
                                        point.negative ?
                                            -(point.height as any) :
                                            (point.height as any)
                                    );
                            }
                        }
                    }
                });

            } else { // run the animation
                series.data.forEach(function (
                    point: Highcharts.ColumnPoint
                ): void {
                    if (point.y !== null) {
                        (point.shapeArgs as any).height = point.height;
                        (point.shapeArgs as any).y = point.shapey; // #2968
                        // null value do not have a graphic
                        if (point.graphic) {
                            point.graphic.animate(
                                point.shapeArgs as any,
                                series.options.animation
                            );
                        }
                    }
                });

                // redraw datalabels to the correct position
                this.drawDataLabels();

                // delete this function to allow it only once
                series.animate = null as any;
            }
        }
    }
});

// In case of 3d columns there is no sense to add this columns to a specific
// series group - if series is added to a group all columns will have the same
// zIndex in comparison with different series.
wrap(
    seriesTypes.column.prototype,
    'plotGroup',
    function (
        this: Highcharts.ColumnSeries,
        proceed: Function,
        prop: string,
        name: string,
        visibility?: boolean,
        zIndex?: number,
        parent?: Highcharts.SVGElement
    ): void {
        if (prop !== 'dataLabelsGroup') {
            if (this.chart.is3d()) {
                if ((this as any)[prop]) {
                    delete (this as any)[prop];
                }
                if (parent) {
                    if (!this.chart.columnGroup) {
                        this.chart.columnGroup =
                            this.chart.renderer.g('columnGroup').add(parent);
                    }
                    (this as any)[prop] = this.chart.columnGroup;
                    this.chart.columnGroup.attr(this.getPlotBox());
                    (this as any)[prop].survive = true;
                    if (prop === 'group' || prop === 'markerGroup') {
                        arguments[3] = 'visible';
                        // For 3D column group and markerGroup should be visible
                    }
                }
            }
        }
        return proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    }
);

// When series is not added to group it is needed to change setVisible method to
// allow correct Legend funcionality. This wrap is basing on pie chart series.
wrap(
    seriesTypes.column.prototype,
    'setVisible',
    function (
        this: Highcharts.ColumnSeries,
        proceed: Function,
        vis?: boolean
    ): void {
        var series = this,
            pointVis: string;

        if (series.chart.is3d()) {
            series.data.forEach(function (point: Highcharts.ColumnPoint): void {
                point.visible = point.options.visible = vis =
                    typeof vis === 'undefined' ?
                        !pick(series.visible, point.visible) : vis;
                pointVis = vis ? 'visible' : 'hidden';
                (series.options.data as any)[series.data.indexOf(point)] =
                    point.options;
                if (point.graphic) {
                    point.graphic.attr({
                        visibility: pointVis
                    });
                }
            });
        }
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    }
);

(seriesTypes.column.prototype as Highcharts.ColumnSeries)
    .handle3dGrouping = true;
addEvent(Series, 'afterInit', function (): void {
    if (
        this.chart.is3d() &&
        (this as Highcharts.ColumnSeries).handle3dGrouping
    ) {
        var seriesOptions = this.options,
            grouping = seriesOptions.grouping,
            stacking = seriesOptions.stacking,
            reversedStacks = pick(this.yAxis.options.reversedStacks, true),
            z = 0;

        // @todo grouping === true ?
        if (!(typeof grouping !== 'undefined' && !grouping)) {
            var stacks = this.chart.retrieveStacks(stacking),
                stack: number = (seriesOptions.stack as any) || 0,
                i; // position within the stack

            for (i = 0; i < stacks[stack].series.length; i++) {
                if (stacks[stack].series[i] === this) {
                    break;
                }
            }
            z = (10 * (stacks.totalStacks - stacks[stack].position)) +
                (reversedStacks ? i : -i); // #4369

            // In case when axis is reversed, columns are also reversed inside
            // the group (#3737)
            if (!this.xAxis.reversed) {
                z = (stacks.totalStacks * 10) - z;
            }
        }

        seriesOptions.zIndex = z;
    }
});

// eslint-disable-next-line valid-jsdoc
/**
 * @private
 */
function pointAttribs(
    this: Highcharts.ColumnSeries,
    proceed: Function
): Highcharts.SVGAttributes {
    var attr = proceed.apply(this, [].slice.call(arguments, 1));

    if (this.chart.is3d && this.chart.is3d()) {
        // Set the fill color to the fill color to provide a smooth edge
        attr.stroke = this.options.edgeColor || attr.fill;
        attr['stroke-width'] = pick(this.options.edgeWidth, 1); // #4055
    }

    return attr;
}

// eslint-disable-next-line valid-jsdoc
/**
 * In 3D mode, all column-series are rendered in one main group. Because of that
 * we need to apply inactive state on all points.
 * @private
 */
function setState(
    this: Highcharts.ColumnSeries,
    proceed: Function,
    state: unknown,
    inherit: unknown
): void {
    var is3d = this.chart.is3d && this.chart.is3d();

    if (is3d) {
        this.options.inactiveOtherPoints = true;
    }

    proceed.call(this, state, inherit);

    if (is3d) {
        this.options.inactiveOtherPoints = false;
    }
}

// eslint-disable-next-line valid-jsdoc
/**
 * In 3D mode, simple checking for a new shape to animate is not enough.
 * Additionally check if graphic is a group of elements
 * @private
 */
function hasNewShapeType(
    this: Highcharts.ColumnPoint,
    proceed: Highcharts.ColumnPoint['hasNewShapeType'],
    ...args: []
): boolean|undefined {
    return this.series.chart.is3d() ?
        this.graphic && this.graphic.element.nodeName !== 'g' :
        proceed.apply(this, args);
}

wrap(seriesTypes.column.prototype, 'pointAttribs', pointAttribs);
wrap(seriesTypes.column.prototype, 'setState', setState);
wrap(
    seriesTypes.column.prototype.pointClass.prototype,
    'hasNewShapeType',
    hasNewShapeType
);

if (seriesTypes.columnrange) {
    wrap(seriesTypes.columnrange.prototype, 'pointAttribs', pointAttribs);
    wrap(seriesTypes.columnrange.prototype, 'setState', setState);
    wrap(
        seriesTypes.columnrange.prototype.pointClass.prototype,
        'hasNewShapeType',
        hasNewShapeType
    );
    seriesTypes.columnrange.prototype.plotGroup =
        seriesTypes.column.prototype.plotGroup;
    seriesTypes.columnrange.prototype.setVisible =
        seriesTypes.column.prototype.setVisible;
}

wrap(Series.prototype, 'alignDataLabel', function (
    this: Highcharts.Series,
    proceed: Function
): void {

    // Only do this for 3D columns and it's derived series
    if (
        this.chart.is3d() &&
        this instanceof seriesTypes.column
    ) {
        var series = this as Highcharts.ColumnSeries,
            chart = series.chart;

        var args = arguments,
            alignTo = args[4],
            point = args[1];

        var pos = ({ x: alignTo.x, y: alignTo.y, z: series.z });

        pos = perspective([pos], chart, true)[0];
        alignTo.x = pos.x;
        // #7103 If point is outside of plotArea, hide data label.
        alignTo.y = point.outside3dPlot ? -9e9 : pos.y;
    }

    proceed.apply(this, [].slice.call(arguments, 1));
});

// Added stackLabels position calculation for 3D charts.
wrap(H.StackItem.prototype, 'getStackBox', function (
    this: Highcharts.StackItem,
    proceed: Function,
    chart: Highcharts.Chart
): void { // #3946
    var stackBox = proceed.apply(this, [].slice.call(arguments, 1));

    // Only do this for 3D chart.
    if (chart.is3d()) {
        var pos = ({
            x: stackBox.x,
            y: stackBox.y,
            z: 0
        });

        pos = H.perspective([pos], chart, true)[0];
        stackBox.x = pos.x;
        stackBox.y = pos.y;
    }

    return stackBox;
});

/*
    @merge v6.2
    @todo
    EXTENSION FOR 3D CYLINDRICAL COLUMNS
    Not supported
*/
/*
var defaultOptions = H.getOptions();
defaultOptions.plotOptions.cylinder =
    H.merge(defaultOptions.plotOptions.column);
var CylinderSeries = H.extendClass(seriesTypes.column, {
    type: 'cylinder'
});
seriesTypes.cylinder = CylinderSeries;

wrap(seriesTypes.cylinder.prototype, 'translate', function (proceed) {
    proceed.apply(this, [].slice.call(arguments, 1));

    // Do not do this if the chart is not 3D
    if (!this.chart.is3d()) {
        return;
    }

    var series = this,
        chart = series.chart,
        options = chart.options,
        cylOptions = options.plotOptions.cylinder,
        options3d = options.chart.options3d,
        depth = cylOptions.depth || 0,
        alpha = chart.alpha3d;

    var z = cylOptions.stacking ?
        (this.options.stack || 0) * depth :
        series._i * depth;
    z += depth / 2;

    if (cylOptions.grouping !== false) { z = 0; }

    each(series.data, function (point) {
        var shapeArgs = point.shapeArgs,
            deg2rad = H.deg2rad;
        point.shapeType = 'arc3d';
        shapeArgs.x += depth / 2;
        shapeArgs.z = z;
        shapeArgs.start = 0;
        shapeArgs.end = 2 * PI;
        shapeArgs.r = depth * 0.95;
        shapeArgs.innerR = 0;
        shapeArgs.depth =
            shapeArgs.height * (1 / sin((90 - alpha) * deg2rad)) - z;
        shapeArgs.alpha = 90 - alpha;
        shapeArgs.beta = 0;
    });
});
*/
