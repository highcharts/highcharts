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
 * A canvas held by a `foreignObject` inside one of the series groups, from
 * which it takes the transform, the z-order, the clip and the entrance
 * animation.
 *
 * The split follows the SVG one: the graph belongs in `group`, which is
 * clipped to the plot box, and markers in `markerGroup`, which is not, so
 * that a marker on the edge is drawn whole.
 *
 * @internal
 */
class GPUSurface {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(series: Series, parent: SVGElement) {
        this.series = series;

        this.canvas = doc.createElement('canvas');
        this.canvas.className = 'highcharts-boost2-canvas';
        this.canvas.style.cssText = 'display:block';

        this.foreignObject = series.chart.renderer
            .createElement('foreignObject')
            .css({ pointerEvents: 'none' })
            .add(parent);

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

    /**
     * Margin around the plot box, in device pixels. Markers whose centre
     * is inside the plot area may reach beyond it.
     * @internal
     */
    public pad = 0;

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
     * Cover the plot box, extended by `overflow` on each side so that a
     * shape anchored on the edge is not cut off. The group origin is the
     * plot box origin, so the rectangle starts `overflow` before it.
     * @internal
     */
    public layout(overflow: number): void {
        const { xAxis, yAxis } = this.series,
            ratio = win.devicePixelRatio || 1,
            cssWidth = Math.max(1, Math.round(xAxis.len) + 2 * overflow),
            cssHeight = Math.max(1, Math.round(yAxis.len) + 2 * overflow);

        this.pad = Math.round(overflow * ratio);

        this.foreignObject.attr({
            x: -overflow,
            y: -overflow,
            width: cssWidth,
            height: cssHeight
        });

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
