/* *
 *
 *  Highcharts cylinder - a 3D series
 *
 *  (c) 2010-2020 Highsoft AS
 *
 *  Author: Kacper Madej
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../Core/Globals.js';
import Color from '../Core/Color.js';
var color = Color.parse;
import Math3D from '../Extensions/Math3D.js';
var perspective = Math3D.perspective;
import U from '../Core/Utilities.js';
var merge = U.merge, pick = U.pick, seriesType = U.seriesType;
import '../Series/ColumnSeries.js';
import '../Core/Renderer/SVG/SVGRenderer.js';
var charts = H.charts, deg2rad = H.deg2rad, 
// Work on H.Renderer instead of SVGRenderer for VML support.
RendererProto = H.Renderer.prototype, cuboidPath = RendererProto.cuboidPath, cylinderMethods;
// Check if a path is simplified. The simplified path contains only lineTo
// segments, whereas non-simplified contain curves.
var isSimplified = function (path) {
    return !path.some(function (seg) { return seg[0] === 'C'; });
};
/**
  * The cylinder series type.
  *
  * @requires module:highcharts-3d
  * @requires module:modules/cylinder
  *
  * @private
  * @class
  * @name Highcharts.seriesTypes.cylinder
  *
  * @augments Highcharts.Series
  */
seriesType('cylinder', 'column', 
/**
 * A cylinder graph is a variation of a 3d column graph. The cylinder graph
 * features cylindrical points.
 *
 * @sample {highcharts} highcharts/demo/cylinder/
 *         Cylinder graph
 *
 * @extends      plotOptions.column
 * @since        7.0.0
 * @product      highcharts
 * @excluding    allAreas, boostThreshold, colorAxis, compare, compareBase,
 *               dragDrop, boostBlending
 * @requires     modules/cylinder
 * @optionparent plotOptions.cylinder
 */
{}, {}, 
/** @lends Highcharts.seriesTypes.cylinder#pointClass# */
{
    shapeType: 'cylinder',
    hasNewShapeType: H
        .seriesTypes.column.prototype
        .pointClass.prototype
        .hasNewShapeType
});
/**
 * A `cylinder` series. If the [type](#series.cylinder.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.cylinder
 * @since     7.0.0
 * @product   highcharts
 * @excluding allAreas, boostThreshold, colorAxis, compare, compareBase,
 *            boostBlending
 * @requires  modules/cylinder
 * @apioption series.cylinder
 */
/**
 * An array of data points for the series. For the `cylinder` series type,
 * points can be given in the following ways:
 *
 * 1. An array of numerical values. In this case, the numerical values will be
 *    interpreted as `y` options. The `x` values will be automatically
 *    calculated, either starting at 0 and incremented by 1, or from
 *    `pointStart` and `pointInterval` given in the series options. If the axis
 *    has categories, these will be used. Example:
 *    ```js
 *    data: [0, 5, 3, 5]
 *    ```
 *
 * 2. An array of arrays with 2 values. In this case, the values correspond to
 *    `x,y`. If the first value is a string, it is applied as the name of the
 *    point, and the `x` value is inferred.
 *    ```js
 *    data: [
 *        [0, 0],
 *        [1, 8],
 *        [2, 9]
 *    ]
 *    ```
 *
 * 3. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.cylinder.turboThreshold), this option is not
 *    available.
 *
 *    ```js
 *    data: [{
 *        x: 1,
 *        y: 2,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        y: 4,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * @sample {highcharts} highcharts/chart/reflow-true/
 *         Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/
 *         Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *         Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/
 *         Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type      {Array<number|Array<(number|string),(number|null)>|null|*>}
 * @extends   series.column.data
 * @product   highcharts highstock
 * @apioption series.cylinder.data
 */
// cylinder extends cuboid
cylinderMethods = merge(RendererProto.elements3d.cuboid, {
    parts: ['top', 'bottom', 'front', 'back'],
    pathType: 'cylinder',
    fillSetter: function (fill) {
        this.singleSetterForParts('fill', null, {
            front: fill,
            back: fill,
            top: color(fill).brighten(0.1).get(),
            bottom: color(fill).brighten(-0.1).get()
        });
        // fill for animation getter (#6776)
        this.color = this.fill = fill;
        return this;
    }
});
RendererProto.elements3d.cylinder = cylinderMethods;
RendererProto.cylinder = function (shapeArgs) {
    return this.element3d('cylinder', shapeArgs);
};
// Generates paths and zIndexes.
RendererProto.cylinderPath = function (shapeArgs) {
    var renderer = this, chart = charts[renderer.chartIndex], 
    // decide zIndexes of parts based on cubiod logic, for consistency.
    cuboidData = cuboidPath.call(renderer, shapeArgs), isTopFirst = !cuboidData.isTop, isFronFirst = !cuboidData.isFront, top = renderer.getCylinderEnd(chart, shapeArgs), bottom = renderer.getCylinderEnd(chart, shapeArgs, true);
    return {
        front: renderer.getCylinderFront(top, bottom),
        back: renderer.getCylinderBack(top, bottom),
        top: top,
        bottom: bottom,
        zIndexes: {
            top: isTopFirst ? 3 : 0,
            bottom: isTopFirst ? 0 : 3,
            front: isFronFirst ? 2 : 1,
            back: isFronFirst ? 1 : 2,
            group: cuboidData.zIndexes.group
        }
    };
};
// Returns cylinder Front path
RendererProto.getCylinderFront = function (topPath, bottomPath) {
    var path = topPath.slice(0, 3);
    if (isSimplified(bottomPath)) {
        var move = bottomPath[0];
        if (move[0] === 'M') {
            path.push(bottomPath[2]);
            path.push(bottomPath[1]);
            path.push(['L', move[1], move[2]]);
        }
    }
    else {
        var move = bottomPath[0], curve1 = bottomPath[1], curve2 = bottomPath[2];
        if (move[0] === 'M' && curve1[0] === 'C' && curve2[0] === 'C') {
            path.push(['L', curve2[5], curve2[6]]);
            path.push(['C', curve2[3], curve2[4], curve2[1], curve2[2], curve1[5], curve1[6]]);
            path.push(['C', curve1[3], curve1[4], curve1[1], curve1[2], move[1], move[2]]);
        }
    }
    path.push(['Z']);
    return path;
};
// Returns cylinder Back path
RendererProto.getCylinderBack = function (topPath, bottomPath) {
    var path = [];
    if (isSimplified(topPath)) {
        var move = topPath[0], line2 = topPath[2];
        if (move[0] === 'M' && line2[0] === 'L') {
            path.push(['M', line2[1], line2[2]]);
            path.push(topPath[3]);
            // End at start
            path.push(['L', move[1], move[2]]);
        }
    }
    else {
        if (topPath[2][0] === 'C') {
            path.push(['M', topPath[2][5], topPath[2][6]]);
        }
        path.push(topPath[3], topPath[4]);
    }
    if (isSimplified(bottomPath)) {
        var move = bottomPath[0];
        if (move[0] === 'M') {
            path.push(['L', move[1], move[2]]);
            path.push(bottomPath[3]);
            path.push(bottomPath[2]);
        }
    }
    else {
        var curve2 = bottomPath[2], curve3 = bottomPath[3], curve4 = bottomPath[4];
        if (curve2[0] === 'C' && curve3[0] === 'C' && curve4[0] === 'C') {
            path.push(['L', curve4[5], curve4[6]]);
            path.push(['C', curve4[3], curve4[4], curve4[1], curve4[2], curve3[5], curve3[6]]);
            path.push(['C', curve3[3], curve3[4], curve3[1], curve3[2], curve2[5], curve2[6]]);
        }
    }
    path.push(['Z']);
    return path;
};
// Retruns cylinder path for top or bottom
RendererProto.getCylinderEnd = function (chart, shapeArgs, isBottom) {
    // A half of the smaller one out of width or depth (optional, because
    // there's no depth for a funnel that reuses the code)
    var depth = pick(shapeArgs.depth, shapeArgs.width), radius = Math.min(shapeArgs.width, depth) / 2, 
    // Approximated longest diameter
    angleOffset = deg2rad * (chart.options.chart.options3d.beta - 90 +
        (shapeArgs.alphaCorrection || 0)), 
    // Could be top or bottom of the cylinder
    y = shapeArgs.y + (isBottom ? shapeArgs.height : 0), 
    // Use cubic Bezier curve to draw a cricle in x,z (y is constant).
    // More math. at spencermortensen.com/articles/bezier-circle/
    c = 0.5519 * radius, centerX = shapeArgs.width / 2 + shapeArgs.x, centerZ = depth / 2 + shapeArgs.z, 
    // points could be generated in a loop, but readability will plummet
    points = [{
            x: 0,
            y: y,
            z: radius
        }, {
            x: c,
            y: y,
            z: radius
        }, {
            x: radius,
            y: y,
            z: c
        }, {
            x: radius,
            y: y,
            z: 0
        }, {
            x: radius,
            y: y,
            z: -c
        }, {
            x: c,
            y: y,
            z: -radius
        }, {
            x: 0,
            y: y,
            z: -radius
        }, {
            x: -c,
            y: y,
            z: -radius
        }, {
            x: -radius,
            y: y,
            z: -c
        }, {
            x: -radius,
            y: y,
            z: 0
        }, {
            x: -radius,
            y: y,
            z: c
        }, {
            x: -c,
            y: y,
            z: radius
        }, {
            x: 0,
            y: y,
            z: radius
        }], cosTheta = Math.cos(angleOffset), sinTheta = Math.sin(angleOffset), perspectivePoints, path, x, z;
    // rotete to match chart's beta and translate to the shape center
    points.forEach(function (point, i) {
        x = point.x;
        z = point.z;
        // x′ = (x * cosθ − z * sinθ) + centerX
        // z′ = (z * cosθ + x * sinθ) + centerZ
        points[i].x = (x * cosTheta - z * sinTheta) + centerX;
        points[i].z = (z * cosTheta + x * sinTheta) + centerZ;
    });
    perspectivePoints = perspective(points, chart, true);
    // check for sub-pixel curve issue, compare front and back edges
    if (Math.abs(perspectivePoints[3].y - perspectivePoints[9].y) < 2.5 &&
        Math.abs(perspectivePoints[0].y - perspectivePoints[6].y) < 2.5) {
        // use simplied shape
        path = this.toLinePath([
            perspectivePoints[0],
            perspectivePoints[3],
            perspectivePoints[6],
            perspectivePoints[9]
        ], true);
    }
    else {
        // or default curved path to imitate ellipse (2D circle)
        path = this.getCurvedPath(perspectivePoints);
    }
    return path;
};
// Returns curved path in format of:
// [ M, x, y, ...[C, cp1x, cp2y, cp2x, cp2y, epx, epy]*n_times ]
// (cp - control point, ep - end point)
RendererProto.getCurvedPath = function (points) {
    var path = [['M', points[0].x, points[0].y]], limit = points.length - 2, i;
    for (i = 1; i < limit; i += 3) {
        path.push([
            'C',
            points[i].x, points[i].y,
            points[i + 1].x, points[i + 1].y,
            points[i + 2].x, points[i + 2].y
        ]);
    }
    return path;
};
