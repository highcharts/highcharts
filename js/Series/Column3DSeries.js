/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../Core/Globals.js';
import Math3D from '../Extensions/Math3D.js';
var perspective = Math3D.perspective;
import StackItem from '../Extensions/Stacking.js';
import U from '../Core/Utilities.js';
var addEvent = U.addEvent, pick = U.pick, wrap = U.wrap;
import '../Core/Series/Series.js';
var Series = H.Series, seriesTypes = H.seriesTypes, svg = H.svg;
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
/**
 * @private
 * @param {Highcharts.Chart} chart
 * Chart with stacks
 * @param {string} stacking
 * Stacking option
 * @return {Highcharts.Stack3dDictionary}
 */
function retrieveStacks(chart, stacking) {
    var series = chart.series, stacks = {};
    var stackNumber, i = 1;
    series.forEach(function (s) {
        stackNumber = pick(s.options.stack, (stacking ? 0 : series.length - 1 - s.index)); // #3841, #4532
        if (!stacks[stackNumber]) {
            stacks[stackNumber] = { series: [s], position: i };
            i++;
        }
        else {
            stacks[stackNumber].series.push(s);
        }
    });
    stacks.totalStacks = i + 1;
    return stacks;
}
wrap(seriesTypes.column.prototype, 'translate', function (proceed) {
    proceed.apply(this, [].slice.call(arguments, 1));
    // Do not do this if the chart is not 3D
    if (this.chart.is3d()) {
        this.translate3dShapes();
    }
});
// Don't use justifyDataLabel when point is outsidePlot
wrap(Series.prototype, 'justifyDataLabel', function (proceed) {
    return !(arguments[2].outside3dPlot) ?
        proceed.apply(this, [].slice.call(arguments, 1)) :
        false;
});
seriesTypes.column.prototype.translate3dPoints = function () { };
seriesTypes.column.prototype.translate3dShapes = function () {
    var series = this, chart = series.chart, seriesOptions = series.options, depth = seriesOptions.depth, stack = seriesOptions.stacking ?
        (seriesOptions.stack || 0) :
        series.index, // #4743
    z = stack * (depth + (seriesOptions.groupZPadding || 1)), borderCrisp = series.borderWidth % 2 ? 0.5 : 0, point2dPos; // Position of point in 2D, used for 3D position calculation.
    if (chart.inverted && !series.yAxis.reversed) {
        borderCrisp *= -1;
    }
    if (seriesOptions.grouping !== false) {
        z = 0;
    }
    z += (seriesOptions.groupZPadding || 1);
    series.data.forEach(function (point) {
        // #7103 Reset outside3dPlot flag
        point.outside3dPlot = null;
        if (point.y !== null) {
            var shapeArgs = point.shapeArgs, tooltipPos = point.tooltipPos, 
            // Array for final shapeArgs calculation.
            // We are checking two dimensions (x and y).
            dimensions = [['x', 'width'], ['y', 'height']], borderlessBase; // Crisped rects can have +/- 0.5 pixels offset.
            // #3131 We need to check if column is inside plotArea.
            dimensions.forEach(function (d) {
                borderlessBase = shapeArgs[d[0]] - borderCrisp;
                if (borderlessBase < 0) {
                    // If borderLessBase is smaller than 0, it is needed to set
                    // its value to 0 or 0.5 depending on borderWidth
                    // borderWidth may be even or odd.
                    shapeArgs[d[1]] +=
                        shapeArgs[d[0]] + borderCrisp;
                    shapeArgs[d[0]] = -borderCrisp;
                    borderlessBase = 0;
                }
                if ((borderlessBase + shapeArgs[d[1]] >
                    series[d[0] + 'Axis'].len) &&
                    // Do not change height/width of column if 0 (#6708)
                    shapeArgs[d[1]] !== 0) {
                    shapeArgs[d[1]] =
                        series[d[0] + 'Axis'].len -
                            shapeArgs[d[0]];
                }
                if (
                // Do not remove columns with zero height/width.
                (shapeArgs[d[1]] !== 0) &&
                    (shapeArgs[d[0]] >=
                        series[d[0] + 'Axis'].len ||
                        shapeArgs[d[0]] + shapeArgs[d[1]] <=
                            borderCrisp)) {
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
            shapeArgs.z = z;
            shapeArgs.depth = depth;
            shapeArgs.insidePlotArea = true;
            // Point's position in 2D
            point2dPos = {
                x: shapeArgs.x + shapeArgs.width / 2,
                y: shapeArgs.y,
                z: z + depth / 2 // The center of column in Z dimension
            };
            // Recalculate point positions for inverted graphs
            if (chart.inverted) {
                point2dPos.x = shapeArgs.height;
                point2dPos.y = point.clientX;
            }
            // Calculate and store point's position in 3D,
            // using perspective method.
            point.plot3d = perspective([point2dPos], chart, true, false)[0];
            // Translate the tooltip position in 3d space
            tooltipPos = perspective([{
                    x: tooltipPos[0],
                    y: tooltipPos[1],
                    z: z + depth / 2 // The center of column in Z dimension
                }], chart, true, false)[0];
            point.tooltipPos = [tooltipPos.x, tooltipPos.y];
        }
    });
    // store for later use #4067
    series.z = z;
};
wrap(seriesTypes.column.prototype, 'animate', function (proceed) {
    if (!this.chart.is3d()) {
        proceed.apply(this, [].slice.call(arguments, 1));
    }
    else {
        var args = arguments, init = args[1], yAxis = this.yAxis, series = this, reversed = this.yAxis.reversed;
        if (svg) { // VML is too slow anyway
            if (init) {
                series.data.forEach(function (point) {
                    if (point.y !== null) {
                        point.height = point.shapeArgs.height;
                        point.shapey = point.shapeArgs.y; // #2968
                        point.shapeArgs.height = 1;
                        if (!reversed) {
                            if (point.stackY) {
                                point.shapeArgs.y =
                                    point.plotY +
                                        yAxis.translate(point.stackY);
                            }
                            else {
                                point.shapeArgs.y =
                                    point.plotY +
                                        (point.negative ?
                                            -point.height :
                                            point.height);
                            }
                        }
                    }
                });
            }
            else { // run the animation
                series.data.forEach(function (point) {
                    if (point.y !== null) {
                        point.shapeArgs.height = point.height;
                        point.shapeArgs.y = point.shapey; // #2968
                        // null value do not have a graphic
                        if (point.graphic) {
                            point.graphic.animate(point.shapeArgs, series.options.animation);
                        }
                    }
                });
                // redraw datalabels to the correct position
                this.drawDataLabels();
            }
        }
    }
});
// In case of 3d columns there is no sense to add this columns to a specific
// series group - if series is added to a group all columns will have the same
// zIndex in comparison with different series.
wrap(seriesTypes.column.prototype, 'plotGroup', function (proceed, prop, name, visibility, zIndex, parent) {
    if (prop !== 'dataLabelsGroup') {
        if (this.chart.is3d()) {
            if (this[prop]) {
                delete this[prop];
            }
            if (parent) {
                if (!this.chart.columnGroup) {
                    this.chart.columnGroup =
                        this.chart.renderer.g('columnGroup').add(parent);
                }
                this[prop] = this.chart.columnGroup;
                this.chart.columnGroup.attr(this.getPlotBox());
                this[prop].survive = true;
                if (prop === 'group' || prop === 'markerGroup') {
                    arguments[3] = 'visible';
                    // For 3D column group and markerGroup should be visible
                }
            }
        }
    }
    return proceed.apply(this, Array.prototype.slice.call(arguments, 1));
});
// When series is not added to group it is needed to change setVisible method to
// allow correct Legend funcionality. This wrap is basing on pie chart series.
wrap(seriesTypes.column.prototype, 'setVisible', function (proceed, vis) {
    var series = this, pointVis;
    if (series.chart.is3d()) {
        series.data.forEach(function (point) {
            point.visible = point.options.visible = vis =
                typeof vis === 'undefined' ?
                    !pick(series.visible, point.visible) : vis;
            pointVis = vis ? 'visible' : 'hidden';
            series.options.data[series.data.indexOf(point)] =
                point.options;
            if (point.graphic) {
                point.graphic.attr({
                    visibility: pointVis
                });
            }
        });
    }
    proceed.apply(this, Array.prototype.slice.call(arguments, 1));
});
seriesTypes.column.prototype
    .handle3dGrouping = true;
addEvent(Series, 'afterInit', function () {
    if (this.chart.is3d() &&
        this.handle3dGrouping) {
        var series = this, seriesOptions = this.options, grouping = seriesOptions.grouping, stacking = seriesOptions.stacking, reversedStacks = pick(this.yAxis.options.reversedStacks, true), z = 0;
        // @todo grouping === true ?
        if (!(typeof grouping !== 'undefined' && !grouping)) {
            var stacks = retrieveStacks(this.chart, stacking), stack = seriesOptions.stack || 0, i; // position within the stack
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
        seriesOptions.depth = seriesOptions.depth || 25;
        series.z = series.z || 0;
        seriesOptions.zIndex = z;
    }
});
// eslint-disable-next-line valid-jsdoc
/**
 * @private
 */
function pointAttribs(proceed) {
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
function setState(proceed, state, inherit) {
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
function hasNewShapeType(proceed) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return this.series.chart.is3d() ?
        this.graphic && this.graphic.element.nodeName !== 'g' :
        proceed.apply(this, args);
}
wrap(seriesTypes.column.prototype, 'pointAttribs', pointAttribs);
wrap(seriesTypes.column.prototype, 'setState', setState);
wrap(seriesTypes.column.prototype.pointClass.prototype, 'hasNewShapeType', hasNewShapeType);
if (seriesTypes.columnrange) {
    wrap(seriesTypes.columnrange.prototype, 'pointAttribs', pointAttribs);
    wrap(seriesTypes.columnrange.prototype, 'setState', setState);
    wrap(seriesTypes.columnrange.prototype.pointClass.prototype, 'hasNewShapeType', hasNewShapeType);
    seriesTypes.columnrange.prototype.plotGroup =
        seriesTypes.column.prototype.plotGroup;
    seriesTypes.columnrange.prototype.setVisible =
        seriesTypes.column.prototype.setVisible;
}
wrap(Series.prototype, 'alignDataLabel', function (proceed, point, dataLabel, options, alignTo) {
    var chart = this.chart;
    // In 3D we need to pass point.outsidePlot option to the justifyDataLabel
    // method for disabling justifying dataLabels in columns outside plot
    options.outside3dPlot = point.outside3dPlot;
    // Only do this for 3D columns and it's derived series
    if (chart.is3d() &&
        this.is('column')) {
        var series = this, seriesOptions = series.options, inside = pick(options.inside, !!series.options.stacking), options3d = chart.options.chart.options3d, xOffset = point.pointWidth / 2 || 0;
        var dLPosition = {
            x: alignTo.x + xOffset,
            y: alignTo.y,
            z: series.z + seriesOptions.depth / 2
        };
        if (chart.inverted) {
            // Inside dataLabels are positioned according to above
            // logic and there is no need to position them using
            // non-3D algorighm (that use alignTo.width)
            if (inside) {
                alignTo.width = 0;
                dLPosition.x += point.shapeArgs.height / 2;
            }
            // When chart is upside down
            // (alpha angle between 180 and 360 degrees)
            // it is needed to add column width to calculated value.
            if (options3d.alpha >= 90 && options3d.alpha <= 270) {
                dLPosition.y += point.shapeArgs.width;
            }
        }
        // dLPosition is recalculated for 3D graphs
        dLPosition = perspective([dLPosition], chart, true, false)[0];
        alignTo.x = dLPosition.x - xOffset;
        // #7103 If point is outside of plotArea, hide data label.
        alignTo.y = point.outside3dPlot ? -9e9 : dLPosition.y;
    }
    proceed.apply(this, [].slice.call(arguments, 1));
});
// Added stackLabels position calculation for 3D charts.
wrap(StackItem.prototype, 'getStackBox', function (proceed, chart, stackItem, x, y, xWidth, h, axis) {
    var stackBox = proceed.apply(this, [].slice.call(arguments, 1));
    // Only do this for 3D graph
    if (chart.is3d() && stackItem.base) {
        // First element of stackItem.base is an index of base series.
        var baseSeriesInd = +(stackItem.base).split(',')[0];
        var columnSeries = chart.series[baseSeriesInd];
        var options3d = chart.options.chart.options3d;
        // Only do this if base series is a column or inherited type,
        // use its barW, z and depth parameters
        // for correct stackLabels position calculation
        if (columnSeries &&
            columnSeries instanceof seriesTypes.column) {
            var dLPosition = {
                x: stackBox.x + (chart.inverted ? h : xWidth / 2),
                y: stackBox.y,
                z: columnSeries.options.depth / 2
            };
            if (chart.inverted) {
                // Do not use default offset calculation logic
                // for 3D inverted stackLabels.
                stackBox.width = 0;
                // When chart is upside down
                // (alpha angle between 180 and 360 degrees)
                // it is needed to add column width to calculated value.
                if (options3d.alpha >= 90 && options3d.alpha <= 270) {
                    dLPosition.y += xWidth;
                }
            }
            dLPosition = perspective([dLPosition], chart, true, false)[0];
            stackBox.x = dLPosition.x - xWidth / 2;
            stackBox.y = dLPosition.y;
        }
    }
    return stackBox;
});
