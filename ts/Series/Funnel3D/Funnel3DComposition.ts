/* *
 *
 *  Highcharts funnel3d series module
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
import type ColorType from '../../Core/Color/ColorType';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type SVGElement3D from '../../Core/Renderer/SVG/SVGElement3D';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import type SVGPath3D from '../../Core/Renderer/SVG/SVGPath3D';
import type SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer';

import SVGElement3DFunnel from './SVGElement3DFunnel.js';
import H from '../../Core/Globals.js';
const { charts } = H;
import SVGRenderer3D from '../../Core/Renderer/SVG/SVGRenderer3D.js';
import U from '../../Core/Utilities.js';
const {
    error,
    extend,
    merge
} = U;
import '../../Core/Renderer/SVG/SVGRenderer.js';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Renderer/SVG/SVGElementLike' {
    interface SVGElementLike {
        finishedOnAdd?: boolean;
        lowerGroup?: SVGElement;
        upperGroup?: SVGElement;
        fontLower?: SVGElement;
        backLower?: SVGElement;
        rightLower?: SVGElement;
    }
}

declare module '../../Core/Renderer/SVG/SVGRendererLike' {
    interface SVGRendererLike {
        funnel3d(shapeArgs: SVGAttributes): SVGElement;
        funnel3dPath(shapeArgs: SVGAttributes): Funnel3DPathsObject;
    }
}

interface Funnel3DMethodsObject {
    parts: Array<string>;
    mainParts: Array<string>;
    sideGroups: Array<string>;
    sideParts: Record<string, Array<string>>;
    pathType: string;
    opacitySetter(opacity: number): SVGElement;
    fillSetter(this: SVGElement, fill: ColorType): SVGElement;
    adjustForGradient(this: SVGElement): void;
    zIndexSetter(this: SVGElement): boolean;
    onAdd(this: SVGElement): void;
}

interface Funnel3DPathsObject extends SVGPath3D {
    backLower: SVGPath;
    backUpper: SVGPath;
    frontLower: SVGPath;
    frontUpper: SVGPath;
    rightLower: SVGPath;
    rightUpper: SVGPath;
}

/* *
 *
 *  Composition
 *
 * */

namespace Funnel3DComposition {

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable require-jsdoc, valid-jsdoc */

    export function compose(SVGRendererClass: typeof SVGRenderer): void {
        SVGRenderer3D.compose(SVGRendererClass);
        SVGRendererClass.prototype.Element3D.types.funnel3d =
            SVGElement3DFunnel;
        wrapRenderer3D(SVGRendererClass);
    }

    function wrapRenderer3D(SVGRendererClass: typeof SVGRenderer): void {
        const rendererProto = SVGRendererClass.prototype;

        extend(rendererProto, {
            funnel3d: function (
                this: SVGRenderer,
                shapeArgs: SVGAttributes
            ): SVGElement {
                const renderer = this,
                    funnel3d: SVGElement =
                        renderer.element3d('funnel3d', shapeArgs) as any,
                    styledMode = renderer.styledMode,
                    // hide stroke for Firefox
                    strokeAttrs: SVGAttributes = {
                        'stroke-width': 1,
                        stroke: 'none'
                    };

                // create groups for sides for oppacity setter
                funnel3d.upperGroup = renderer.g('funnel3d-upper-group').attr({
                    zIndex: funnel3d.frontUpper.zIndex
                }).add(funnel3d);

                [
                    funnel3d.frontUpper,
                    funnel3d.backUpper,
                    funnel3d.rightUpper
                ].forEach(function (upperElem: SVGElement): void {

                    if (!styledMode) {
                        upperElem.attr(strokeAttrs);
                    }
                    upperElem.add(funnel3d.upperGroup);
                });

                funnel3d.lowerGroup = renderer.g('funnel3d-lower-group').attr({
                    zIndex: funnel3d.frontLower.zIndex
                }).add(funnel3d);

                [
                    funnel3d.frontLower,
                    funnel3d.backLower,
                    funnel3d.rightLower
                ].forEach(function (lowerElem: SVGElement): void {
                    if (!styledMode) {
                        lowerElem.attr(strokeAttrs);
                    }
                    lowerElem.add(funnel3d.lowerGroup);
                });

                funnel3d.gradientForSides = (shapeArgs as any).gradientForSides;

                return funnel3d;
            },
            /**
             * Generates paths and zIndexes.
             * @private
             */
            funnel3dPath: function (
                this: SVGRenderer,
                shapeArgs: any // @todo: Type it. It's an extended SVGAttributes.
            ): Funnel3DPathsObject {
                // Check getCylinderEnd for better error message if
                // the cylinder module is missing
                if (!this.getCylinderEnd) {
                    error(
                        'A required Highcharts module is missing: cylinder.js',
                        true,
                        charts[this.chartIndex]
                    );
                }

                let renderer = this,
                    chart: Chart = charts[renderer.chartIndex] as any,
                    // adjust angles for visible edges
                    // based on alpha, selected through visual tests
                    alphaCorrection = shapeArgs.alphaCorrection = 90 - Math.abs(
                        ((chart.options.chart.options3d as any).alpha % 180) -
                        90
                    ),

                    // set zIndexes of parts based on cubiod logic, for
                    // consistency
                    cuboidData = rendererProto.cuboidPath.call(renderer, merge(
                        shapeArgs, {
                            depth: shapeArgs.width,
                            width: (
                                shapeArgs.width + shapeArgs.bottom.width
                            ) / 2
                        }
                    )),
                    isTopFirst = cuboidData.isTop,
                    isFrontFirst = !cuboidData.isFront,
                    hasMiddle = !!shapeArgs.middle,
                    //
                    top = renderer.getCylinderEnd(
                        chart,
                        merge(shapeArgs, {
                            x: shapeArgs.x - shapeArgs.width / 2,
                            z: shapeArgs.z - shapeArgs.width / 2,
                            alphaCorrection: alphaCorrection
                        })
                    ),
                    bottomWidth = shapeArgs.bottom.width,
                    bottomArgs = merge<SVGAttributes>(shapeArgs, {
                        width: bottomWidth,
                        x: shapeArgs.x - bottomWidth / 2,
                        z: shapeArgs.z - bottomWidth / 2,
                        alphaCorrection: alphaCorrection
                    }),
                    bottom = renderer.getCylinderEnd(chart, bottomArgs, true),
                    //
                    middleWidth = bottomWidth,
                    middleTopArgs = bottomArgs,
                    middleTop = bottom,
                    middleBottom = bottom,
                    ret: Funnel3DPathsObject,

                    // masking for cylinders or a missing part of a side shape
                    useAlphaCorrection;

                if (hasMiddle) {
                    middleWidth = shapeArgs.middle.width;
                    middleTopArgs = merge<SVGAttributes>(shapeArgs, {
                        y: (
                            shapeArgs.y +
                            shapeArgs.middle.fraction * shapeArgs.height
                        ),
                        width: middleWidth,
                        x: shapeArgs.x - middleWidth / 2,
                        z: shapeArgs.z - middleWidth / 2
                    });
                    middleTop = renderer.getCylinderEnd(
                        chart,
                        middleTopArgs,
                        false
                    );

                    middleBottom = renderer.getCylinderEnd(
                        chart,
                        middleTopArgs,
                        false
                    );
                }

                ret = {
                    top: top,
                    bottom: bottom,
                    frontUpper: renderer.getCylinderFront(top, middleTop),
                    zIndexes: {
                        group: cuboidData.zIndexes.group,
                        top: isTopFirst !== 0 ? 0 : 3,
                        bottom: isTopFirst !== 1 ? 0 : 3,
                        frontUpper: isFrontFirst ? 2 : 1,
                        backUpper: isFrontFirst ? 1 : 2,
                        rightUpper: isFrontFirst ? 2 : 1
                    }
                } as any;

                ret.backUpper = renderer.getCylinderBack(top, middleTop);
                useAlphaCorrection = (Math.min(middleWidth, shapeArgs.width) /
                    Math.max(middleWidth, shapeArgs.width)) !== 1;

                ret.rightUpper = renderer.getCylinderFront(
                    renderer.getCylinderEnd(
                        chart,
                        merge(shapeArgs, {
                            x: shapeArgs.x - shapeArgs.width / 2,
                            z: shapeArgs.z - shapeArgs.width / 2,
                            alphaCorrection: useAlphaCorrection ?
                                -alphaCorrection : 0
                        }),
                        false
                    ),
                    renderer.getCylinderEnd(
                        chart,
                        merge(middleTopArgs, {
                            alphaCorrection: useAlphaCorrection ?
                                -alphaCorrection : 0
                        }),
                        !hasMiddle
                    )
                );

                if (hasMiddle) {
                    useAlphaCorrection = (Math.min(middleWidth, bottomWidth) /
                        Math.max(middleWidth, bottomWidth)) !== 1;

                    merge(true, ret, {
                        frontLower: renderer.getCylinderFront(
                            middleBottom,
                            bottom
                        ),
                        backLower: renderer.getCylinderBack(
                            middleBottom,
                            bottom
                        ),
                        rightLower: renderer.getCylinderFront(
                            renderer.getCylinderEnd(
                                chart,
                                merge(bottomArgs, {
                                    alphaCorrection: useAlphaCorrection ?
                                        -alphaCorrection : 0
                                }),
                                true
                            ),
                            renderer.getCylinderEnd(
                                chart,
                                merge(middleTopArgs, {
                                    alphaCorrection: useAlphaCorrection ?
                                        -alphaCorrection : 0
                                }),
                                false
                            )
                        ),
                        zIndexes: {
                            frontLower: isFrontFirst ? 2 : 1,
                            backLower: isFrontFirst ? 1 : 2,
                            rightLower: isFrontFirst ? 1 : 2
                        }
                    });
                }

                return ret;
            }
        });
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default Funnel3DComposition;
