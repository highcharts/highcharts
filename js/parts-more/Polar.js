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
import U from '../parts/Utilities.js';
var pick = U.pick, splat = U.splat;
import '../parts/Pointer.js';
import '../parts/Series.js';
import '../parts/Pointer.js';
// Extensions for polar charts. Additionally, much of the geometry required for
// polar charts is gathered in RadialAxes.js.
var Pointer = H.Pointer, Series = H.Series, seriesTypes = H.seriesTypes, wrap = H.wrap, seriesProto = Series.prototype, pointerProto = Pointer.prototype, colProto;
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * Search a k-d tree by the point angle, used for shared tooltips in polar
 * charts
 * @private
 */
seriesProto.searchPointByAngle = function (e) {
    var series = this, chart = series.chart, xAxis = series.xAxis, center = xAxis.pane.center, plotX = e.chartX - center[0] - chart.plotLeft, plotY = e.chartY - center[1] - chart.plotTop;
    return this.searchKDTree({
        clientX: 180 + (Math.atan2(plotX, plotY) * (-180 / Math.PI))
    });
};
/**
 * #6212 Calculate connectors for spline series in polar chart.
 * @private
 * @param {boolean} calculateNeighbours
 *        Check if connectors should be calculated for neighbour points as
 *        well allows short recurence
 */
seriesProto.getConnectors = function (segment, index, calculateNeighbours, connectEnds) {
    var i, prevPointInd, nextPointInd, previousPoint, nextPoint, previousX, previousY, nextX, nextY, plotX, plotY, ret, 
    // 1 means control points midway between points, 2 means 1/3 from
    // the point, 3 is 1/4 etc;
    smoothing = 1.5, denom = smoothing + 1, leftContX, leftContY, rightContX, rightContY, dLControlPoint, // distance left control point
    dRControlPoint, leftContAngle, rightContAngle, jointAngle, addedNumber = connectEnds ? 1 : 0;
    // Calculate final index of points depending on the initial index value.
    // Because of calculating neighbours, index may be outisde segment
    // array.
    if (index >= 0 && index <= segment.length - 1) {
        i = index;
    }
    else if (index < 0) {
        i = segment.length - 1 + index;
    }
    else {
        i = 0;
    }
    prevPointInd = (i - 1 < 0) ? segment.length - (1 + addedNumber) : i - 1;
    nextPointInd = (i + 1 > segment.length - 1) ? addedNumber : i + 1;
    previousPoint = segment[prevPointInd];
    nextPoint = segment[nextPointInd];
    previousX = previousPoint.plotX;
    previousY = previousPoint.plotY;
    nextX = nextPoint.plotX;
    nextY = nextPoint.plotY;
    plotX = segment[i].plotX; // actual point
    plotY = segment[i].plotY;
    leftContX = (smoothing * plotX + previousX) / denom;
    leftContY = (smoothing * plotY + previousY) / denom;
    rightContX = (smoothing * plotX + nextX) / denom;
    rightContY = (smoothing * plotY + nextY) / denom;
    dLControlPoint = Math.sqrt(Math.pow(leftContX - plotX, 2) + Math.pow(leftContY - plotY, 2));
    dRControlPoint = Math.sqrt(Math.pow(rightContX - plotX, 2) + Math.pow(rightContY - plotY, 2));
    leftContAngle = Math.atan2(leftContY - plotY, leftContX - plotX);
    rightContAngle = Math.atan2(rightContY - plotY, rightContX - plotX);
    jointAngle = (Math.PI / 2) + ((leftContAngle + rightContAngle) / 2);
    // Ensure the right direction, jointAngle should be in the same quadrant
    // as leftContAngle
    if (Math.abs(leftContAngle - jointAngle) > Math.PI / 2) {
        jointAngle -= Math.PI;
    }
    // Find the corrected control points for a spline straight through the
    // point
    leftContX = plotX + Math.cos(jointAngle) * dLControlPoint;
    leftContY = plotY + Math.sin(jointAngle) * dLControlPoint;
    rightContX = plotX + Math.cos(Math.PI + jointAngle) * dRControlPoint;
    rightContY = plotY + Math.sin(Math.PI + jointAngle) * dRControlPoint;
    // push current point's connectors into returned object
    ret = {
        rightContX: rightContX,
        rightContY: rightContY,
        leftContX: leftContX,
        leftContY: leftContY,
        plotX: plotX,
        plotY: plotY
    };
    // calculate connectors for previous and next point and push them inside
    // returned object
    if (calculateNeighbours) {
        ret.prevPointCont = this.getConnectors(segment, prevPointInd, false, connectEnds);
    }
    return ret;
};
/**
 * Translate a point's plotX and plotY from the internal angle and radius
 * measures to true plotX, plotY coordinates
 * @private
 */
seriesProto.toXY = function (point) {
    var xy, chart = this.chart, plotX = point.plotX, plotY = point.plotY, clientX;
    // Save rectangular plotX, plotY for later computation
    point.rectPlotX = plotX;
    point.rectPlotY = plotY;
    // Find the polar plotX and plotY
    xy = this.xAxis.postTranslate(point.plotX, this.yAxis.len - plotY);
    point.plotX = point.polarPlotX = xy.x - chart.plotLeft;
    point.plotY = point.polarPlotY = xy.y - chart.plotTop;
    // If shared tooltip, record the angle in degrees in order to align X
    // points. Otherwise, use a standard k-d tree to get the nearest point
    // in two dimensions.
    if (this.kdByAngle) {
        clientX = ((plotX / Math.PI * 180) +
            this.xAxis.pane.options.startAngle) % 360;
        if (clientX < 0) { // #2665
            clientX += 360;
        }
        point.clientX = clientX;
    }
    else {
        point.clientX = point.plotX;
    }
};
if (seriesTypes.spline) {
    /**
     * Overridden method for calculating a spline from one point to the next
     * @private
     */
    wrap(seriesTypes.spline.prototype, 'getPointSpline', function (proceed, segment, point, i) {
        var ret, connectors;
        if (this.chart.polar) {
            // moveTo or lineTo
            if (!i) {
                ret = ['M', point.plotX, point.plotY];
            }
            else { // curve from last point to this
                connectors = this.getConnectors(segment, i, true, this.connectEnds);
                ret = [
                    'C',
                    connectors.prevPointCont.rightContX,
                    connectors.prevPointCont.rightContY,
                    connectors.leftContX,
                    connectors.leftContY,
                    connectors.plotX,
                    connectors.plotY
                ];
            }
        }
        else {
            ret = proceed.call(this, segment, point, i);
        }
        return ret;
    });
    // #6430 Areasplinerange series use unwrapped getPointSpline method, so
    // we need to set this method again.
    if (seriesTypes.areasplinerange) {
        seriesTypes.areasplinerange.prototype.getPointSpline =
            seriesTypes.spline.prototype.getPointSpline;
    }
}
/**
 * Extend translate. The plotX and plotY values are computed as if the polar
 * chart were a cartesian plane, where plotX denotes the angle in radians
 * and (yAxis.len - plotY) is the pixel distance from center.
 * @private
 */
H.addEvent(Series, 'afterTranslate', function () {
    var chart = this.chart, points, i;
    if (chart.polar && this.xAxis) {
        // Prepare k-d-tree handling. It searches by angle (clientX) in
        // case of shared tooltip, and by two dimensional distance in case
        // of non-shared.
        this.kdByAngle = chart.tooltip && chart.tooltip.shared;
        if (this.kdByAngle) {
            this.searchPoint = this.searchPointByAngle;
        }
        else {
            this.options.findNearestPointBy = 'xy';
        }
        // Postprocess plot coordinates
        if (!this.preventPostTranslate) {
            points = this.points;
            i = points.length;
            while (i--) {
                // Translate plotX, plotY from angle and radius to true plot
                // coordinates
                this.toXY(points[i]);
                // Treat points below Y axis min as null (#10082)
                if (!chart.hasParallelCoordinates &&
                    !this.yAxis.reversed &&
                    points[i].y < this.yAxis.min) {
                    points[i].isNull = true;
                }
            }
        }
        // Perform clip after render
        if (!this.hasClipCircleSetter) {
            this.hasClipCircleSetter = Boolean(H.addEvent(this, 'afterRender', function () {
                var circ;
                if (chart.polar) {
                    circ = this.yAxis.center;
                    this.group.clip(chart.renderer.clipCircle(circ[0], circ[1], circ[2] / 2));
                    this.setClip = H.noop;
                }
            }));
        }
    }
}, { order: 2 }); // Run after translation of ||-coords
/**
 * Extend getSegmentPath to allow connecting ends across 0 to provide a
 * closed circle in line-like series.
 * @private
 */
wrap(seriesProto, 'getGraphPath', function (proceed, points) {
    var series = this, i, firstValid, popLastPoint;
    // Connect the path
    if (this.chart.polar) {
        points = points || this.points;
        // Append first valid point in order to connect the ends
        for (i = 0; i < points.length; i++) {
            if (!points[i].isNull) {
                firstValid = i;
                break;
            }
        }
        /**
         * Polar charts only. Whether to connect the ends of a line series
         * plot across the extremes.
         *
         * @sample {highcharts} highcharts/plotoptions/line-connectends-false/
         *         Do not connect
         *
         * @type      {boolean}
         * @since     2.3.0
         * @product   highcharts
         * @apioption plotOptions.series.connectEnds
         */
        if (this.options.connectEnds !== false &&
            firstValid !== undefined) {
            this.connectEnds = true; // re-used in splines
            points.splice(points.length, 0, points[firstValid]);
            popLastPoint = true;
        }
        // For area charts, pseudo points are added to the graph, now we
        // need to translate these
        points.forEach(function (point) {
            if (point.polarPlotY === undefined) {
                series.toXY(point);
            }
        });
    }
    // Run uber method
    var ret = proceed.apply(this, [].slice.call(arguments, 1));
    // #6212 points.splice method is adding points to an array. In case of
    // areaspline getGraphPath method is used two times and in both times
    // points are added to an array. That is why points.pop is used, to get
    // unmodified points.
    if (popLastPoint) {
        points.pop();
    }
    return ret;
});
var polarAnimate = function (proceed, init) {
    var chart = this.chart, animation = this.options.animation, group = this.group, markerGroup = this.markerGroup, center = this.xAxis.center, plotLeft = chart.plotLeft, plotTop = chart.plotTop, attribs;
    // Specific animation for polar charts
    if (chart.polar) {
        // Enable animation on polar charts only in SVG. In VML, the scaling
        // is different, plus animation would be so slow it would't matter.
        if (chart.renderer.isSVG) {
            if (animation === true) {
                animation = {};
            }
            // Initialize the animation
            if (init) {
                // Scale down the group and place it in the center
                attribs = {
                    translateX: center[0] + plotLeft,
                    translateY: center[1] + plotTop,
                    scaleX: 0.001,
                    scaleY: 0.001
                };
                group.attr(attribs);
                if (markerGroup) {
                    markerGroup.attr(attribs);
                }
                // Run the animation
            }
            else {
                attribs = {
                    translateX: plotLeft,
                    translateY: plotTop,
                    scaleX: 1,
                    scaleY: 1
                };
                group.animate(attribs, animation);
                if (markerGroup) {
                    markerGroup.animate(attribs, animation);
                }
                // Delete this function to allow it only once
                this.animate = null;
            }
        }
        // For non-polar charts, revert to the basic animation
    }
    else {
        proceed.call(this, init);
    }
};
// Define the animate method for regular series
wrap(seriesProto, 'animate', polarAnimate);
if (seriesTypes.column) {
    colProto = seriesTypes.column.prototype;
    colProto.polarArc = function (low, high, start, end) {
        var center = this.xAxis.center, len = this.yAxis.len;
        return this.chart.renderer.symbols.arc(center[0], center[1], len - high, null, {
            start: start,
            end: end,
            innerR: len - pick(low, len)
        });
    };
    /**
     * Define the animate method for columnseries
     * @private
     */
    wrap(colProto, 'animate', polarAnimate);
    /**
     * Extend the column prototype's translate method
     * @private
     */
    wrap(colProto, 'translate', function (proceed) {
        var xAxis = this.xAxis, startAngleRad = xAxis.startAngleRad, start, points, point, i;
        this.preventPostTranslate = true;
        // Run uber method
        proceed.call(this);
        // Postprocess plot coordinates
        if (xAxis.isRadial) {
            points = this.points;
            i = points.length;
            while (i--) {
                point = points[i];
                start = point.barX + startAngleRad;
                point.shapeType = 'path';
                point.shapeArgs = {
                    d: this.polarArc(point.yBottom, point.plotY, start, start + point.pointWidth)
                };
                // Provide correct plotX, plotY for tooltip
                this.toXY(point);
                point.tooltipPos = [point.plotX, point.plotY];
                point.ttBelow = point.plotY > xAxis.center[1];
            }
        }
    });
    /**
     * Align column data labels outside the columns. #1199.
     * @private
     */
    wrap(colProto, 'alignDataLabel', function (proceed, point, dataLabel, options, alignTo, isNew) {
        if (this.chart.polar) {
            var angle = point.rectPlotX / Math.PI * 180, align, verticalAlign;
            // Align nicely outside the perimeter of the columns
            if (options.align === null) {
                if (angle > 20 && angle < 160) {
                    align = 'left'; // right hemisphere
                }
                else if (angle > 200 && angle < 340) {
                    align = 'right'; // left hemisphere
                }
                else {
                    align = 'center'; // top or bottom
                }
                options.align = align;
            }
            if (options.verticalAlign === null) {
                if (angle < 45 || angle > 315) {
                    verticalAlign = 'bottom'; // top part
                }
                else if (angle > 135 && angle < 225) {
                    verticalAlign = 'top'; // bottom part
                }
                else {
                    verticalAlign = 'middle'; // left or right
                }
                options.verticalAlign = verticalAlign;
            }
            seriesProto.alignDataLabel.call(this, point, dataLabel, options, alignTo, isNew);
        }
        else {
            proceed.call(this, point, dataLabel, options, alignTo, isNew);
        }
    });
}
/**
 * Extend getCoordinates to prepare for polar axis values
 * @private
 */
wrap(pointerProto, 'getCoordinates', function (proceed, e) {
    var chart = this.chart, ret = {
        xAxis: [],
        yAxis: []
    };
    if (chart.polar) {
        chart.axes.forEach(function (axis) {
            var isXAxis = axis.isXAxis, center = axis.center, x, y;
            // Skip colorAxis
            if (axis.coll === 'colorAxis') {
                return;
            }
            x = e.chartX - center[0] - chart.plotLeft;
            y = e.chartY - center[1] - chart.plotTop;
            ret[isXAxis ? 'xAxis' : 'yAxis'].push({
                axis: axis,
                value: axis.translate(isXAxis ?
                    Math.PI - Math.atan2(x, y) : // angle
                    // distance from center
                    Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)), true)
            });
        });
    }
    else {
        ret = proceed.call(this, e);
    }
    return ret;
});
H.SVGRenderer.prototype.clipCircle = function (x, y, r) {
    var wrapper, id = H.uniqueKey(), clipPath = this.createElement('clipPath').attr({
        id: id
    }).add(this.defs);
    wrapper = this.circle(x, y, r).add(clipPath);
    wrapper.id = id;
    wrapper.clipPath = clipPath;
    return wrapper;
};
H.addEvent(H.Chart, 'getAxes', function () {
    if (!this.pane) {
        this.pane = [];
    }
    splat(this.options.pane).forEach(function (paneOptions) {
        new H.Pane(// eslint-disable-line no-new
        paneOptions, this);
    }, this);
});
H.addEvent(H.Chart, 'afterDrawChartBox', function () {
    this.pane.forEach(function (pane) {
        pane.render();
    });
});
/**
 * Extend chart.get to also search in panes. Used internally in
 * responsiveness and chart.update.
 * @private
 */
wrap(H.Chart.prototype, 'get', function (proceed, id) {
    return H.find(this.pane, function (pane) {
        return pane.options.id === id;
    }) || proceed.call(this, id);
});
