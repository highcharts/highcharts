/* *
 *
 *  Highcharts cylinder - a 3D series
 *
 *  (c) 2010-2021 Highsoft AS
 *
 *  Author: Kacper Madej
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
import type Position3DObject from '../../Core/Renderer/Position3DObject';
import type PositionObject from '../../Core/Renderer/PositionObject';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import type SVGPath3D from '../../Core/Renderer/SVG/SVGPath3D';
import type SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer';
import type SVGRenderer3D from '../../Core/Renderer/SVG/SVGRenderer3D';

import H from '../../Core/Globals.js';
const {
    charts,
    deg2rad
} = H;
import Math3D from '../../Core/Math3D.js';
const { perspective } = Math3D;
import SVGElement3DCylinder from './SVGElement3DCylinder.js';
import U from '../../Core/Utilities.js';
const {
    extend,
    pick,
    pushUnique
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Renderer/SVG/SVGRendererLike' {
    interface SVGRendererLike {
        /** @requires CylinderComposition */
        cylinder(shapeArgs: SVGAttributes): SVGElement;
        /** @requires CylinderComposition */
        cylinderPath(shapeArgs: SVGAttributes): CylinderPathsObject;
        /** @requires CylinderComposition */
        getCurvedPath(points: Array<PositionObject>): SVGPath;
        /** @requires CylinderComposition */
        getCylinderBack(
            topPath: SVGPath,
            bottomPath: SVGPath
        ): SVGPath;
        /** @requires CylinderComposition */
        getCylinderEnd(
            chart: Chart,
            shapeArgs: SVGAttributes,
            isBottom?: boolean
        ): SVGPath;
        /** @requires CylinderComposition */
        getCylinderFront(
            topPath: SVGPath,
            bottomPath: SVGPath
        ): SVGPath;
    }
}

interface CylinderPathsObject extends SVGPath3D {
    back: SVGPath;
    bottom: SVGPath;
    front: SVGPath;
    top: SVGPath;
    zIndexes: Record<string, number>;
}

/* *
 *
 *  Constants
 *
 * */

const composedMembers: Array<unknown> = [];

/* *
 *
 *  Functions
 *
 * */

function compose(
    SVGRendererClass: typeof SVGRenderer
): void {

    if (pushUnique(composedMembers, SVGRendererClass)) {
        const rendererProto =
            SVGRendererClass.prototype as SVGRenderer3D.Composition;

        rendererProto.Element3D.types.cylinder = SVGElement3DCylinder;

        extend(rendererProto, {
            cylinder: rendererCylinder,
            cylinderPath: rendererCylinderPath,
            getCurvedPath: rendererGetCurvedPath,
            getCylinderBack: rendererGetCylinderBack,
            getCylinderEnd: rendererGetCylinderEnd,
            getCylinderFront: rendererGetCylinderFront
        });
    }

}

/**
 * Check if a path is simplified. The simplified path contains only lineTo
 * segments, whereas non-simplified contain curves.
 * @private
 */
function isSimplified(path: SVGPath): boolean {
    return !path.some((seg): boolean => seg[0] === 'C');
}

/** @private */
function rendererCylinder(
    this: SVGRenderer3D.Composition,
    shapeArgs: SVGAttributes
): SVGElement {
    return this.element3d('cylinder', shapeArgs);
}

/**
 * Generates paths and zIndexes.
 * @private
 */
function rendererCylinderPath(
    this: SVGRenderer3D.Composition,
    shapeArgs: SVGAttributes
): CylinderPathsObject {
    const renderer = this,
        chart = charts[renderer.chartIndex],

        // decide zIndexes of parts based on cubiod logic, for consistency.
        cuboidData = this.cuboidPath(shapeArgs),
        isTopFirst = !cuboidData.isTop,
        isFronFirst = !cuboidData.isFront,

        top = renderer.getCylinderEnd(chart as any, shapeArgs),
        bottom = renderer.getCylinderEnd(chart as any, shapeArgs, true);

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
}

/**
 * Returns curved path in format of:
 * [ M, x, y, ...[C, cp1x, cp2y, cp2x, cp2y, epx, epy]*n_times ]
 * (cp - control point, ep - end point)
 * @private
 */
function rendererGetCurvedPath(
    this: SVGRenderer3D.Composition,
    points: Array<PositionObject>): SVGPath {
    const path: SVGPath = [['M', points[0].x, points[0].y]],
        limit = points.length - 2;

    for (let i = 1; i < limit; i += 3) {
        path.push([
            'C',
            points[i].x, points[i].y,
            points[i + 1].x, points[i + 1].y,
            points[i + 2].x, points[i + 2].y
        ]);
    }
    return path;
}

/**
 * Returns cylinder Back path.
 * @private
 */
function rendererGetCylinderBack(
    this: SVGRenderer3D.Composition,
    topPath: SVGPath,
    bottomPath: SVGPath
): SVGPath {

    const path: SVGPath = [];

    if (isSimplified(topPath)) {
        const move = topPath[0],
            line2 = topPath[2];

        if (move[0] === 'M' && line2[0] === 'L') {
            path.push(['M', line2[1], line2[2]]);
            path.push(topPath[3]);

            // End at start
            path.push(['L', move[1], move[2]]);
        }
    } else {
        if (topPath[2][0] === 'C') {
            path.push(['M', topPath[2][5], topPath[2][6]]);
        }
        path.push(topPath[3], topPath[4]);
    }

    if (isSimplified(bottomPath)) {
        const move = bottomPath[0];

        if (move[0] === 'M') {
            path.push(['L', move[1], move[2]]);
            path.push(bottomPath[3]);
            path.push(bottomPath[2]);
        }
    } else {
        const curve2 = bottomPath[2],
            curve3 = bottomPath[3],
            curve4 = bottomPath[4];
        if (curve2[0] === 'C' && curve3[0] === 'C' && curve4[0] === 'C') {
            path.push(['L', curve4[5], curve4[6]]);
            path.push([
                'C',
                curve4[3],
                curve4[4],
                curve4[1],
                curve4[2],
                curve3[5],
                curve3[6]
            ]);
            path.push([
                'C',
                curve3[3],
                curve3[4],
                curve3[1],
                curve3[2],
                curve2[5],
                curve2[6]
            ]);
        }
    }
    path.push(['Z']);

    return path;
}

/**
 * Retruns cylinder path for top or bottom.
 * @private
 */
function rendererGetCylinderEnd(
    this: SVGRenderer3D.Composition,
    chart: Chart,
    shapeArgs: SVGAttributes,
    isBottom?: boolean
): SVGPath {

    const { width = 0, height = 0, alphaCorrection = 0 } =
        shapeArgs,

        // A half of the smaller one out of width or depth (optional, because
        // there's no depth for a funnel that reuses the code)
        depth = pick(shapeArgs.depth, width, 0),
        radius = Math.min(width, depth) / 2,

        // Approximated longest diameter
        angleOffset = deg2rad * (
            (chart.options.chart.options3d as any).beta - 90 +
            alphaCorrection
        ),

        // Could be top or bottom of the cylinder
        y = (shapeArgs.y || 0) + (isBottom ? height : 0),

        // Use cubic Bezier curve to draw a cricle in x,z (y is constant).
        // More math. at spencermortensen.com/articles/bezier-circle/
        c = 0.5519 * radius,
        centerX = width / 2 + (shapeArgs.x || 0),
        centerZ = depth / 2 + (shapeArgs.z || 0),

        // points could be generated in a loop, but readability will plummet
        points: Array<Position3DObject> = [{ // M - starting point
            x: 0,
            y: y,
            z: radius

        }, { // C1 - control point 1
            x: c,
            y: y,
            z: radius
        }, { // C1 - control point 2
            x: radius,
            y: y,
            z: c
        }, { // C1 - end point
            x: radius,
            y: y,
            z: 0

        }, { // C2 - control point 1
            x: radius,
            y: y,
            z: -c
        }, { // C2 - control point 2
            x: c,
            y: y,
            z: -radius
        }, { // C2 - end point
            x: 0,
            y: y,
            z: -radius

        }, { // C3 - control point 1
            x: -c,
            y: y,
            z: -radius
        }, { // C3 - control point 2
            x: -radius,
            y: y,
            z: -c
        }, { // C3 - end point
            x: -radius,
            y: y,
            z: 0

        }, { // C4 - control point 1
            x: -radius,
            y: y,
            z: c
        }, { // C4 - control point 2
            x: -c,
            y: y,
            z: radius
        }, { // C4 - end point
            x: 0,
            y: y,
            z: radius
        }],
        cosTheta = Math.cos(angleOffset),
        sinTheta = Math.sin(angleOffset);

    let path: SVGPath,
        x, z;

    // rotete to match chart's beta and translate to the shape center
    for (const point of points) {
        x = point.x;
        z = point.z;

        // x′ = (x * cosθ − z * sinθ) + centerX
        // z′ = (z * cosθ + x * sinθ) + centerZ
        point.x = (x * cosTheta - z * sinTheta) + centerX;
        point.z = (z * cosTheta + x * sinTheta) + centerZ;
    }
    const perspectivePoints = perspective(points, chart, true);

    // check for sub-pixel curve issue, compare front and back edges
    if (
        Math.abs(perspectivePoints[3].y - perspectivePoints[9].y) < 2.5 &&
        Math.abs(perspectivePoints[0].y - perspectivePoints[6].y) < 2.5
    ) {
        // use simplied shape
        path = this.toLinePath([
            perspectivePoints[0],
            perspectivePoints[3],
            perspectivePoints[6],
            perspectivePoints[9]
        ], true);
    } else {
        // or default curved path to imitate ellipse (2D circle)
        path = this.getCurvedPath(perspectivePoints);
    }

    return path;
}

/**
 * Returns cylinder Front path.
 * @private
 */
function rendererGetCylinderFront(
    this: SVGRenderer3D.Composition,
    topPath: SVGPath,
    bottomPath: SVGPath
): SVGPath {
    const path = topPath.slice(0, 3);

    if (isSimplified(bottomPath)) {

        const move = bottomPath[0];
        if (move[0] === 'M') {
            path.push(bottomPath[2]);
            path.push(bottomPath[1]);
            path.push(['L', move[1], move[2]]);
        }

    } else {
        const move = bottomPath[0],
            curve1 = bottomPath[1],
            curve2 = bottomPath[2];
        if (move[0] === 'M' && curve1[0] === 'C' && curve2[0] === 'C') {

            path.push(['L', curve2[5], curve2[6]]);

            path.push([
                'C',
                curve2[3],
                curve2[4],
                curve2[1],
                curve2[2],
                curve1[5],
                curve1[6]
            ]);
            path.push([
                'C',
                curve1[3],
                curve1[4],
                curve1[1],
                curve1[2],
                move[1],
                move[2]
            ]);
        }
    }
    path.push(['Z']);

    return path;
}

/* *
 *
 *  Default Export
 *
 * */

const CylinderComposition = {
    compose
};

export default CylinderComposition;
