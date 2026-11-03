/* *
 *
 *  (c) 2026 Highsoft AS
 *
 *  Boost2: GPU surface for a single series.
 *
 *  License: highcharts.com/license
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Series from '../../Core/Series/Series';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

import GPUContext from './GPUContext.js';
import H from '../../Core/Globals.js';
const { doc, win } = H;

/* *
 *
 *  Class
 *
 * */

/**
 * One canvas per series, held by a `foreignObject` inside the series group,
 * which gives it the group's transform, clip and z-order.
 *
 * @internal
 */
class GPUSurface {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(series: Series) {
        this.series = series;

        this.canvas = doc.createElement('canvas');
        this.canvas.className = 'highcharts-boost2-canvas';
        this.canvas.style.cssText = 'display:block';

        this.foreignObject = series.chart.renderer
            .createElement('foreignObject')
            .attr({ x: 0, y: 0 })
            .css({ pointerEvents: 'none' })
            .add(series.group);

        this.foreignObject.element.appendChild(this.canvas);

        this.context = this.canvas.getContext(
            'webgpu'
        ) as unknown as GPUCanvasContext;

        this.context.configure({
            device: GPUContext.device!,
            format: GPUContext.format!,
            alphaMode: 'premultiplied'
        });
    }

    /* *
     *
     *  Properties
     *
     * */

    /** @internal */
    public canvas: HTMLCanvasElement;

    /** @internal */
    public context: GPUCanvasContext;

    /** @internal */
    public width = 0;

    /** @internal */
    public height = 0;

    /** @internal */
    private series: Series;

    /** @internal */
    private foreignObject: SVGElement;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Fit the canvas to the plot area. The series group already carries the
     * plot box transform, so the `foreignObject` stays at the origin.
     * @internal
     */
    public layout(): void {
        const { xAxis, yAxis } = this.series,
            ratio = win.devicePixelRatio || 1,
            cssWidth = Math.max(1, Math.round(xAxis.len)),
            cssHeight = Math.max(1, Math.round(yAxis.len));

        this.foreignObject.attr({ width: cssWidth, height: cssHeight });

        this.canvas.style.width = cssWidth + 'px';
        this.canvas.style.height = cssHeight + 'px';

        const width = Math.round(cssWidth * ratio),
            height = Math.round(cssHeight * ratio);

        if (this.width !== width || this.height !== height) {
            this.canvas.width = this.width = width;
            this.canvas.height = this.height = height;
        }
    }

    /**
     * Begin a render pass that clears the surface to transparent.
     * @internal
     */
    public beginPass(encoder: GPUCommandEncoder): GPURenderPassEncoder {
        return encoder.beginRenderPass({
            colorAttachments: [{
                view: this.context.getCurrentTexture().createView(),
                loadOp: 'clear',
                clearValue: [0, 0, 0, 0],
                storeOp: 'store'
            }]
        });
    }

    /** @internal */
    public destroy(): void {
        this.foreignObject.destroy();
    }

}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default GPUSurface;
