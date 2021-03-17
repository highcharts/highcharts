/* *
 *
 *  Imports
 *
 * */

import type BBoxObject from '../../Core/Renderer/BBoxObject';
import type Chart from '../../Core/Chart/Chart';
import type ColorType from '../../Core/Color/ColorType';
import type GradientColor from '../../Core/Color/GradientColor';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type { SVGElement3DLikeCuboid } from '../../Core/Renderer/SVG/SVGElement3DLike';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import type SVGPath3D from '../../Core/Renderer/SVG/SVGPath3D';
import type SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer';
import Color from '../../Core/Color/Color.js';
const { parse: color } = Color;
import H from '../../Core/Globals.js';
const {
    charts,
    // Use H.Renderer instead of SVGRenderer for VML support.
    Renderer: {
        prototype: {
            cuboidPath,
            elements3d: Elements3D
        }
    }
} = H;
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

declare module '../../Core/Renderer/SVG/SVGElement3DLike' {
    interface SVGElement3DLike {
        funnel3d?: Highcharts.Funnel3dMethodsObject;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface SVGElement {
            finishedOnAdd?: boolean;
            lowerGroup?: SVGElement;
            upperGroup?: SVGElement;
            fontLower?: SVGElement;
            backLower?: SVGElement;
            rightLower?: SVGElement;
        }
        interface Funnel3dMethodsObject extends SVGElement3DLikeCuboid {
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
        interface SVGRenderer {
            funnel3d(shapeArgs: SVGAttributes): SVGElement;
            funnel3dPath(shapeArgs: SVGAttributes): Funnel3dPathsObject;
        }
        interface Funnel3dPathsObject extends SVGPath3D {
            frontUpper: SVGPath;
            backUpper: SVGPath;
            rightUpper: SVGPath;
        }
    }
}

/* *
 *
 *  Composition
 *
 * */

/* eslint-disable valid-jsdoc */

Elements3D.funnel3d = merge(Elements3D.cuboid, {
    parts: [
        'top', 'bottom',
        'frontUpper', 'backUpper',
        'frontLower', 'backLower',
        'rightUpper', 'rightLower'
    ],
    mainParts: ['top', 'bottom'],
    sideGroups: [
        'upperGroup', 'lowerGroup'
    ],
    sideParts: {
        upperGroup: ['frontUpper', 'backUpper', 'rightUpper'],
        lowerGroup: ['frontLower', 'backLower', 'rightLower']
    },
    pathType: 'funnel3d',

    // override opacity and color setters to control opacity
    opacitySetter: function (
        this: SVGElement,
        opacity: number
    ): SVGElement {
        var funnel3d = this,
            parts = funnel3d.parts,
            chart: Chart =
                H.charts[funnel3d.renderer.chartIndex] as any,
            filterId = 'group-opacity-' + opacity + '-' + chart.index;

        // use default for top and bottom
        funnel3d.parts = funnel3d.mainParts;
        funnel3d.singleSetterForParts('opacity', opacity);

        // restore
        funnel3d.parts = parts;

        if (!(chart.renderer as any).filterId) {

            chart.renderer.definition({
                tagName: 'filter',
                attributes: {
                    id: filterId
                },
                children: [{
                    tagName: 'feComponentTransfer',
                    children: [{
                        tagName: 'feFuncA',
                        attributes: {
                            type: 'table',
                            tableValues: '0 ' + opacity
                        }
                    }]
                }]
            });
            funnel3d.sideGroups.forEach(function (groupName: string): void {
                funnel3d[groupName].attr({
                    filter: 'url(#' + filterId + ')'
                });
            });

            // styled mode
            if (funnel3d.renderer.styledMode) {
                chart.renderer.definition({
                    tagName: 'style',
                    textContent: '.highcharts-' + filterId +
                        ' {filter:url(#' + filterId + ')}'
                });

                (funnel3d.sideGroups as any).forEach(function (
                    group: SVGElement
                ): void {
                    group.addClass('highcharts-' + filterId);
                });
            }
        }

        return funnel3d;
    },

    fillSetter: function (
        this: SVGElement,
        fill: ColorType
    ): SVGElement {
        // extract alpha channel to use the opacitySetter
        var funnel3d = this,
            fillColor: (Color|ColorType) = color(fill),
            alpha: number = (fillColor as any).rgba[3],
            partsWithColor: Record<string, ColorType> = {
                // standard color for top and bottom
                top: color(fill).brighten(0.1).get() as any,
                bottom: color(fill).brighten(-0.2).get() as any
            };

        if (alpha < 1) {
            (fillColor as any).rgba[3] = 1;
            fillColor = (fillColor as any).get('rgb');

            // set opacity through the opacitySetter
            funnel3d.attr({
                opacity: alpha
            });
        } else {
            // use default for full opacity
            fillColor = fill;
        }

        // add gradient for sides
        if (
            !(fillColor as any).linearGradient &&
            !(fillColor as any).radialGradient &&
            funnel3d.gradientForSides
        ) {
            fillColor = {
                linearGradient: { x1: 0, x2: 1, y1: 1, y2: 1 },
                stops: [
                    [0, color(fill).brighten(-0.2).get()],
                    [0.5, fill],
                    [1, color(fill).brighten(-0.2).get()]
                ]
            } as any;
        }

        // gradient support
        if ((fillColor as any).linearGradient) {
            // color in steps, as each gradient will generate a key
            funnel3d.sideGroups.forEach(function (sideGroupName: string): void {
                var box = funnel3d[sideGroupName].gradientBox,
                    gradient: NonNullable<GradientColor['linearGradient']> =
                        (fillColor as any).linearGradient,
                    alteredGradient = merge<GradientColor>(
                        (fillColor as any),
                        {
                            linearGradient: {
                                x1: box.x + gradient.x1 * box.width,
                                y1: box.y + gradient.y1 * box.height,
                                x2: box.x + gradient.x2 * box.width,
                                y2: box.y + gradient.y2 * box.height
                            }
                        }
                    );

                funnel3d.sideParts[sideGroupName].forEach(function (
                    partName: string
                ): void {
                    partsWithColor[partName] = alteredGradient;
                });
            });
        } else {
            merge(true, partsWithColor, {
                frontUpper: fillColor,
                backUpper: fillColor,
                rightUpper: fillColor,

                frontLower: fillColor,
                backLower: fillColor,
                rightLower: fillColor
            });

            if ((fillColor as any).radialGradient) {
                funnel3d.sideGroups.forEach(function (
                    sideGroupName: string
                ): void {
                    var gradBox = funnel3d[sideGroupName].gradientBox,
                        centerX = gradBox.x + gradBox.width / 2,
                        centerY = gradBox.y + gradBox.height / 2,
                        diameter = Math.min(gradBox.width, gradBox.height);

                    funnel3d.sideParts[sideGroupName].forEach(
                        function (partName: string): void {
                            funnel3d[partName].setRadialReference([
                                centerX, centerY, diameter
                            ]);
                        }
                    );
                });
            }
        }

        funnel3d.singleSetterForParts('fill', null, partsWithColor);

        // fill for animation getter (#6776)
        funnel3d.color = funnel3d.fill = fill;

        // change gradientUnits to userSpaceOnUse for linearGradient
        if ((fillColor as any).linearGradient) {
            [funnel3d.frontLower, funnel3d.frontUpper].forEach(function (
                part: Record<string, SVGElement>
            ): void {
                var elem: SVGElement = part.element,
                    grad = elem && funnel3d.renderer.gradients[elem.gradient];

                if (grad && grad.attr('gradientUnits') !== 'userSpaceOnUse') {
                    grad.attr({
                        gradientUnits: 'userSpaceOnUse'
                    });
                }
            });
        }

        return funnel3d;
    },

    adjustForGradient: function (this: SVGElement): void {
        var funnel3d = this,
            bbox: BBoxObject;

        funnel3d.sideGroups.forEach(function (sideGroupName: string): void {
            // use common extremes for groups for matching gradients
            var topLeftEdge = {
                    x: Number.MAX_VALUE,
                    y: Number.MAX_VALUE
                },
                bottomRightEdge = {
                    x: -Number.MAX_VALUE,
                    y: -Number.MAX_VALUE
                };

            // get extremes
            funnel3d.sideParts[sideGroupName].forEach(function (
                partName: string
            ): void {
                var part = funnel3d[partName];

                bbox = part.getBBox(true);
                topLeftEdge = {
                    x: Math.min(topLeftEdge.x, bbox.x),
                    y: Math.min(topLeftEdge.y, bbox.y)
                };
                bottomRightEdge = {
                    x: Math.max(bottomRightEdge.x, bbox.x + bbox.width),
                    y: Math.max(bottomRightEdge.y, bbox.y + bbox.height)
                };
            });

            // store for color fillSetter
            funnel3d[sideGroupName].gradientBox = {
                x: topLeftEdge.x,
                width: bottomRightEdge.x - topLeftEdge.x,
                y: topLeftEdge.y,
                height: bottomRightEdge.y - topLeftEdge.y
            };
        });
    },

    zIndexSetter: function (this: SVGElement): boolean {
        // this.added won't work, because zIndex is set after the prop is set,
        // but before the graphic is really added
        if (this.finishedOnAdd) {
            this.adjustForGradient();
        }

        // run default
        return this.renderer.Element.prototype.zIndexSetter.apply(
            this, arguments
        );
    },

    onAdd: function (this: SVGElement): void {
        this.adjustForGradient();
        this.finishedOnAdd = true;
    }
});

extend(H.Renderer.prototype, {
    funnel3d: function (
        this: SVGRenderer,
        shapeArgs: SVGAttributes
    ): SVGElement {
        var renderer = this,
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
    ): Highcharts.Funnel3dPathsObject {
        // Check getCylinderEnd for better error message if
        // the cylinder module is missing
        if (!this.getCylinderEnd) {
            error(
                'A required Highcharts module is missing: cylinder.js',
                true,
                charts[this.chartIndex]
            );
        }

        var renderer = this,
            chart: Chart = charts[renderer.chartIndex] as any,
            // adjust angles for visible edges
            // based on alpha, selected through visual tests
            alphaCorrection = shapeArgs.alphaCorrection = 90 -
                Math.abs(((chart.options.chart as any).options3d.alpha % 180) - 90),

            // set zIndexes of parts based on cubiod logic, for consistency
            cuboidData = cuboidPath.call(renderer, merge(shapeArgs, {
                depth: shapeArgs.width,
                width: (shapeArgs.width + shapeArgs.bottom.width) / 2
            })),
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
            ret: Highcharts.Funnel3dPathsObject,

            // masking for cylinders or a missing part of a side shape
            useAlphaCorrection;

        if (hasMiddle) {
            middleWidth = shapeArgs.middle.width;
            middleTopArgs = merge<SVGAttributes>(shapeArgs, {
                y: shapeArgs.y + shapeArgs.middle.fraction * shapeArgs.height,
                width: middleWidth,
                x: shapeArgs.x - middleWidth / 2,
                z: shapeArgs.z - middleWidth / 2
            });
            middleTop = renderer.getCylinderEnd(chart, middleTopArgs, false);

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
                    alphaCorrection: useAlphaCorrection ? -alphaCorrection : 0
                }),
                false
            ),
            renderer.getCylinderEnd(
                chart,
                merge(middleTopArgs, {
                    alphaCorrection: useAlphaCorrection ? -alphaCorrection : 0
                }),
                !hasMiddle
            )
        );

        if (hasMiddle) {
            useAlphaCorrection = (Math.min(middleWidth, bottomWidth) /
                Math.max(middleWidth, bottomWidth)) !== 1;

            merge(true, ret, {
                frontLower: renderer.getCylinderFront(middleBottom, bottom),
                backLower: renderer.getCylinderBack(middleBottom, bottom),
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

/* eslint-enable valid-jsdoc */
