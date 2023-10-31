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

import type BBoxObject from '../../Core/Renderer/BBoxObject';
import type Chart from '../../Core/Chart/Chart';
import type ColorType from '../../Core/Color/ColorType';
import type GradientColor from '../../Core/Color/GradientColor';
import type { SVGDOMElement } from '../../Core/Renderer/DOMElementType';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

import Color from '../../Core/Color/Color.js';
const { parse: color } = Color;
import H from '../../Core/Globals.js';
const { charts } = H;
import RendererRegistry from '../../Core/Renderer/RendererRegistry.js';
const {
    Element3D: SVGElement3D
} = RendererRegistry.getRendererType().prototype;
import U from '../../Core/Utilities.js';
const { merge } = U;

/* *
 *
 *  Class
 *
 * */

class SVGElement3DFunnel extends SVGElement3D {

    /* *
     *
     *  Properties
     *
     * */

    public mainParts = ['top', 'bottom'];

    public parts = [
        'top', 'bottom',
        'frontUpper', 'backUpper',
        'frontLower', 'backLower',
        'rightUpper', 'rightLower'
    ];

    public sideGroups = [
        'upperGroup', 'lowerGroup'
    ];

    public sideParts: Record<string, Array<string>> = {
        upperGroup: ['frontUpper', 'backUpper', 'rightUpper'],
        lowerGroup: ['frontLower', 'backLower', 'rightLower']
    };

    public pathType = 'funnel3d';

    /* *
     *
     *  Functions
     *
     * */

    // override opacity and color setters to control opacity
    public opacitySetter(
        value: string,
        _key: string,
        _element: SVGDOMElement
    ): this {
        const funnel3d = this,
            opacity = parseFloat(value),
            parts = funnel3d.parts,
            chart: Chart = charts[funnel3d.renderer.chartIndex] as any,
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
            for (const groupName of funnel3d.sideGroups) {
                funnel3d[groupName].attr({
                    filter: 'url(#' + filterId + ')'
                });
            }

            // styled mode
            if (funnel3d.renderer.styledMode) {
                chart.renderer.definition({
                    tagName: 'style',
                    textContent: '.highcharts-' + filterId +
                        ' {filter:url(#' + filterId + ')}'
                });

                for (const groupName of funnel3d.sideGroups) {
                    funnel3d[groupName].addClass('highcharts-' + filterId);
                }
            }
        }

        return funnel3d;
    }

    public fillSetter(
        fill: ColorType
    ): this {
        let fillColor: (Color|ColorType) = color(fill);

        // extract alpha channel to use the opacitySetter
        const funnel3d = this,
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
            };
        }

        // gradient support
        if ((fillColor as any).linearGradient) {
            // color in steps, as each gradient will generate a key
            for (const sideGroupName of funnel3d.sideGroups) {
                const box = funnel3d[sideGroupName].gradientBox,
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

                for (const partName of funnel3d.sideParts[sideGroupName]) {
                    partsWithColor[partName] = alteredGradient;
                }
            }
        } else {
            merge(true, partsWithColor, {
                frontUpper: fillColor as any,
                backUpper: fillColor as any,
                rightUpper: fillColor as any,

                frontLower: fillColor as any,
                backLower: fillColor as any,
                rightLower: fillColor as any
            });

            if ((fillColor as any).radialGradient) {
                for (const sideGroupName of funnel3d.sideGroups) {
                    const gradBox = funnel3d[sideGroupName].gradientBox,
                        centerX = gradBox.x + gradBox.width / 2,
                        centerY = gradBox.y + gradBox.height / 2,
                        diameter = Math.min(
                            gradBox.width,
                            gradBox.height
                        );

                    for (const partName of funnel3d.sideParts[sideGroupName]) {
                        funnel3d[partName].setRadialReference([
                            centerX, centerY, diameter
                        ]);
                    }
                }
            }
        }

        funnel3d.singleSetterForParts('fill', null, partsWithColor);

        // fill for animation getter (#6776)
        funnel3d.color = funnel3d.fill = fill;

        // change gradientUnits to userSpaceOnUse for linearGradient
        if ((fillColor as any).linearGradient) {
            for (const part of [funnel3d.frontLower, funnel3d.frontUpper]) {
                const elem: SVGElement = part.element,
                    grad = (
                        elem &&
                        funnel3d.renderer.gradients[elem.gradient]
                    );

                if (
                    grad &&
                    grad.attr('gradientUnits') !== 'userSpaceOnUse'
                ) {
                    grad.attr({
                        gradientUnits: 'userSpaceOnUse'
                    });
                }
            }
        }

        return funnel3d;
    }

    public adjustForGradient(): void {
        const funnel3d = this;

        let bbox: BBoxObject;

        for (const sideGroupName of funnel3d.sideGroups) {
            // use common extremes for groups for matching gradients
            let topLeftEdge = {
                    x: Number.MAX_VALUE,
                    y: Number.MAX_VALUE
                },
                bottomRightEdge = {
                    x: -Number.MAX_VALUE,
                    y: -Number.MAX_VALUE
                };

            // get extremes
            for (const partName of funnel3d.sideParts[sideGroupName]) {
                const part = funnel3d[partName];

                bbox = part.getBBox(true);
                topLeftEdge = {
                    x: Math.min(topLeftEdge.x, bbox.x),
                    y: Math.min(topLeftEdge.y, bbox.y)
                };
                bottomRightEdge = {
                    x: Math.max(bottomRightEdge.x, bbox.x + bbox.width),
                    y: Math.max(bottomRightEdge.y, bbox.y + bbox.height)
                };
            }

            // store for color fillSetter
            funnel3d[sideGroupName].gradientBox = {
                x: topLeftEdge.x,
                width: bottomRightEdge.x - topLeftEdge.x,
                y: topLeftEdge.y,
                height: bottomRightEdge.y - topLeftEdge.y
            };
        }
    }

    public zIndexSetter(): boolean {
        // this.added won't work, because zIndex is set after the prop
        // is set, but before the graphic is really added
        if (this.finishedOnAdd) {
            this.adjustForGradient();
        }

        // run default
        return this.renderer.Element.prototype.zIndexSetter.apply(
            this, arguments
        );
    }

    public onAdd(): void {
        this.adjustForGradient();
        this.finishedOnAdd = true;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default SVGElement3DFunnel;
