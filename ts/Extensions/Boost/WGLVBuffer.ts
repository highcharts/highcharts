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

declare global {
    namespace Highcharts {
        interface BoostGLVertexBuffer {
            data: (Array<number>|undefined);
            allocate(size: number): void;
            bind(): (boolean|undefined);
            build(
                dataIn: Array<number>,
                attrib: string,
                dataComponents?: number
            ): boolean;
            destroy(): void;
            push(x: number, y: number, a: number, b: number): void;
            render(from: number, to: number, drawMode: string): boolean;
        }
    }
}

/* eslint-disable valid-jsdoc */

/**
 * Vertex Buffer abstraction.
 * A vertex buffer is a set of vertices which are passed to the GPU
 * in a single call.
 *
 * @private
 * @function GLVertexBuffer
 *
 * @param {WebGLContext} gl
 *        the context in which to create the buffer
 *
 * @param {GLShader} shader
 *        the shader to use
 *
 * @return {*}
 */
function GLVertexBuffer(
    gl: WebGLRenderingContext,
    shader: Highcharts.BoostGLShader,
    dataComponents?: number
    /* , type */
): Highcharts.BoostGLVertexBuffer {
    var buffer: (false|WebGLBuffer|null) = false,
        vertAttribute: (false|number) = false,
        components = dataComponents || 2,
        preAllocated: (false|Float32Array) = false,
        iterator = 0,
        // farray = false,
        data: (Array<number>|undefined);

    // type = type || 'float';

    /**
     * @private
     */
    function destroy(): void {
        if (buffer) {
            gl.deleteBuffer(buffer);
            buffer = false;
            vertAttribute = false;
        }

        iterator = 0;
        components = dataComponents || 2;
        data = [];
    }

    /**
     * Build the buffer
     * @private
     * @param dataIn {Array<float>} - a 0 padded array of indices
     * @param attrib {String} - the name of the Attribute to bind the buffer to
     * @param dataComponents {Integer} - the number of components per. indice
     */
    function build(
        dataIn: Array<number>,
        attrib: string,
        dataComponents?: number
    ): boolean {
        var farray: (false|Float32Array|undefined);

        data = dataIn || [];

        if ((!data || data.length === 0) && !preAllocated) {
            // console.error('trying to render empty vbuffer');
            destroy();
            return false;
        }

        components = dataComponents || components;

        if (buffer) {
            gl.deleteBuffer(buffer);
        }

        if (!preAllocated) {
            farray = new Float32Array(data);
        }

        buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            (preAllocated as any) || (farray as any),
            gl.STATIC_DRAW
        );

        // gl.bindAttribLocation(shader.program(), 0, 'aVertexPosition');
        vertAttribute = gl.getAttribLocation(shader.program() as any, attrib);
        gl.enableVertexAttribArray(vertAttribute);

        // Trigger cleanup
        farray = false;

        return true;
    }

    /**
     * Bind the buffer
     * @private
     */
    function bind(): (boolean|undefined) {
        if (!buffer) {
            return false;
        }

        // gl.bindAttribLocation(shader.program(), 0, 'aVertexPosition');
        // gl.enableVertexAttribArray(vertAttribute);
        // gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(
            vertAttribute as any, components, gl.FLOAT, false, 0, 0
        );
        // gl.enableVertexAttribArray(vertAttribute);
    }

    /**
     * Render the buffer
     * @private
     * @param from {Integer} - the start indice
     * @param to {Integer} - the end indice
     * @param drawMode {String} - the draw mode
     */
    function render(from: number, to: number, drawMode: string): boolean {
        var length = preAllocated ? preAllocated.length : (data as any).length;

        if (!buffer) {
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

        drawMode = drawMode || 'points';

        gl.drawArrays(
            (gl as any)[drawMode.toUpperCase()],
            from / components,
            (to - from) / components
        );

        return true;
    }

    /**
     * @private
     */
    function push(x: number, y: number, a: number, b: number): void {
        if (preAllocated) { // && iterator <= preAllocated.length - 4) {
            preAllocated[++iterator] = x;
            preAllocated[++iterator] = y;
            preAllocated[++iterator] = a;
            preAllocated[++iterator] = b;
        }
    }

    /**
     * Note about pre-allocated buffers:
     *     - This is slower for charts with many series
     * @private
     */
    function allocate(size: number): void {
        size *= 4;
        iterator = -1;

        preAllocated = new Float32Array(size);
    }

    // /////////////////////////////////////////////////////////////////////////
    return {
        destroy: destroy,
        bind: bind,
        data: data,
        build: build,
        render: render,
        allocate: allocate,
        push: push
    };
}

export default GLVertexBuffer;
