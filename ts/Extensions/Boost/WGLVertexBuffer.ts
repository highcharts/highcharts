/* *
 *
 *  Copyright (c) 2019-2021 Highsoft AS
 *
 *  Boost module: stripped-down renderer for higher performance
 *
 *  License: highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Class
 *
 * */

/* eslint-disable valid-jsdoc */

/**
 * Vertex Buffer abstraction.
 * A vertex buffer is a set of vertices which are passed to the GPU
 * in a single call.
 *
 * @private
 *
 * @param {WebGLContext} gl
 * the context in which to create the buffer
 * @param {GLShader} shader
 * the shader to use
 */
class WGLVertexBuffer {

    /* *
     *
     *  Constuctor
     *
     * */

    public constructor(
        gl: WebGLRenderingContext,
        shader: Highcharts.BoostGLShader,
        dataComponents?: number
        /* , type */
    ) {
        this.components = dataComponents || 2;
        this.dataComponents = dataComponents;
        this.gl = gl;
        this.shader = shader;
    }

    /* *
     *
     *  Properties
     *
     * */

    private buffer: (false|WebGLBuffer|null) = false;

    private components: number;

    public data: (Array<number>|undefined);

    private dataComponents?: number;

    private iterator = 0;

    private gl: WebGLRenderingContext;

    private preAllocated: (false|Float32Array) = false;

    private shader: Highcharts.BoostGLShader;

    private vertAttribute: (false|number) = false;

    /* *
     *
     *  Functions
     *
     * */


    /**
     * Note about pre-allocated buffers:
     *     - This is slower for charts with many series
     * @private
     */
    public allocate(size: number): void {
        size *= 4;
        this.iterator = -1;

        this.preAllocated = new Float32Array(size);
    }

    /**
     * Bind the buffer
     * @private
     */
    public bind(): (boolean|undefined) {
        if (!this.buffer) {
            return false;
        }

        // gl.bindAttribLocation(shader.program(), 0, 'aVertexPosition');
        // gl.enableVertexAttribArray(vertAttribute);
        // gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        this.gl.vertexAttribPointer(
            this.vertAttribute as any,
            this.components,
            this.gl.FLOAT,
            false,
            0,
            0
        );
        // gl.enableVertexAttribArray(vertAttribute);
    }

    /**
     * Build the buffer
     * @private
     * @param dataIn {Array<float>} - a 0 padded array of indices
     * @param attrib {String} - the name of the Attribute to bind the buffer to
     * @param dataComponents {Integer} - the number of components per. indice
     */
    public build(
        dataIn: Array<number>,
        attrib: string,
        dataComponents?: number
    ): boolean {
        let farray: (false|Float32Array|undefined);

        this.data = dataIn || [];

        if ((!this.data || this.data.length === 0) && !this.preAllocated) {
            // console.error('trying to render empty vbuffer');
            this.destroy();
            return false;
        }

        this.components = dataComponents || this.components;

        if (this.buffer) {
            this.gl.deleteBuffer(this.buffer);
        }

        if (!this.preAllocated) {
            farray = new Float32Array(this.data);
        }

        this.buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            (this.preAllocated as any) || (farray as any),
            this.gl.STATIC_DRAW
        );

        // gl.bindAttribLocation(shader.program(), 0, 'aVertexPosition');
        this.vertAttribute = this.gl
            .getAttribLocation(this.shader.program() as any, attrib);
        this.gl.enableVertexAttribArray(this.vertAttribute);

        // Trigger cleanup
        farray = false;

        return true;
    }

    /**
     * @private
     */
    public destroy(): void {
        if (this.buffer) {
            this.gl.deleteBuffer(this.buffer);
            this.buffer = false;
            this.vertAttribute = false;
        }

        this.iterator = 0;
        this.components = this.dataComponents || 2;
        this.data = [];
    }

    /**
     * @private
     */
    public push(x: number, y: number, a: number, b: number): void {
        if (this.preAllocated) { // && iterator <= preAllocated.length - 4) {
            this.preAllocated[++this.iterator] = x;
            this.preAllocated[++this.iterator] = y;
            this.preAllocated[++this.iterator] = a;
            this.preAllocated[++this.iterator] = b;
        }
    }

    /**
     * Render the buffer
     * @private
     * @param from {Integer} - the start indice
     * @param to {Integer} - the end indice
     * @param drawMode {String} - the draw mode
     */
    public render(from: number, to: number, drawMode: string): boolean {
        const length = this.preAllocated ?
            this.preAllocated.length : (this.data as any).length;

        if (!this.buffer) {
            return false;
        }

        if (!length) {
            return false;
        }

        if (!from || from > length || from < 0) {
            from = 0;
        }

        if (!to || to > length) {
            to = length;
        }

        if (from >= to) {
            return false;
        }

        drawMode = drawMode || 'points';

        this.gl.drawArrays(
            (this.gl as any)[drawMode.toUpperCase()],
            from / this.components,
            (to - from) / this.components
        );

        return true;
    }

}

/* *
 *
 *  Imports
 *
 * */

export default WGLVertexBuffer;
