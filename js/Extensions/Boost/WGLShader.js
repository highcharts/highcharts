/* *
 *
 *  Copyright (c) 2019-2020 Highsoft AS
 *
 *  Boost module: stripped-down renderer for higher performance
 *
 *  License: highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import U from '../../Core/Utilities.js';
var clamp = U.clamp, error = U.error, pick = U.pick;
/* eslint-disable valid-jsdoc */
/**
 * A static shader mimicing axis translation functions found in Core/Axis
 *
 * @private
 * @function GLShader
 *
 * @param {WebGLContext} gl
 *        the context in which the shader is active
 *
 * @return {*}
 */
function GLShader(gl) {
    var vertShade = [
        /* eslint-disable max-len, @typescript-eslint/indent */
        '#version 100',
        '#define LN10 2.302585092994046',
        'precision highp float;',
        'attribute vec4 aVertexPosition;',
        'attribute vec4 aColor;',
        'varying highp vec2 position;',
        'varying highp vec4 vColor;',
        'uniform mat4 uPMatrix;',
        'uniform float pSize;',
        'uniform float translatedThreshold;',
        'uniform bool hasThreshold;',
        'uniform bool skipTranslation;',
        'uniform float xAxisTrans;',
        'uniform float xAxisMin;',
        'uniform float xAxisMinPad;',
        'uniform float xAxisPointRange;',
        'uniform float xAxisLen;',
        'uniform bool  xAxisPostTranslate;',
        'uniform float xAxisOrdinalSlope;',
        'uniform float xAxisOrdinalOffset;',
        'uniform float xAxisPos;',
        'uniform bool  xAxisCVSCoord;',
        'uniform bool  xAxisIsLog;',
        'uniform bool  xAxisReversed;',
        'uniform float yAxisTrans;',
        'uniform float yAxisMin;',
        'uniform float yAxisMinPad;',
        'uniform float yAxisPointRange;',
        'uniform float yAxisLen;',
        'uniform bool  yAxisPostTranslate;',
        'uniform float yAxisOrdinalSlope;',
        'uniform float yAxisOrdinalOffset;',
        'uniform float yAxisPos;',
        'uniform bool  yAxisCVSCoord;',
        'uniform bool  yAxisIsLog;',
        'uniform bool  yAxisReversed;',
        'uniform bool  isBubble;',
        'uniform bool  bubbleSizeByArea;',
        'uniform float bubbleZMin;',
        'uniform float bubbleZMax;',
        'uniform float bubbleZThreshold;',
        'uniform float bubbleMinSize;',
        'uniform float bubbleMaxSize;',
        'uniform bool  bubbleSizeAbs;',
        'uniform bool  isInverted;',
        'float bubbleRadius(){',
        'float value = aVertexPosition.w;',
        'float zMax = bubbleZMax;',
        'float zMin = bubbleZMin;',
        'float radius = 0.0;',
        'float pos = 0.0;',
        'float zRange = zMax - zMin;',
        'if (bubbleSizeAbs){',
        'value = value - bubbleZThreshold;',
        'zMax = max(zMax - bubbleZThreshold, zMin - bubbleZThreshold);',
        'zMin = 0.0;',
        '}',
        'if (value < zMin){',
        'radius = bubbleZMin / 2.0 - 1.0;',
        '} else {',
        'pos = zRange > 0.0 ? (value - zMin) / zRange : 0.5;',
        'if (bubbleSizeByArea && pos > 0.0){',
        'pos = sqrt(pos);',
        '}',
        'radius = ceil(bubbleMinSize + pos * (bubbleMaxSize - bubbleMinSize)) / 2.0;',
        '}',
        'return radius * 2.0;',
        '}',
        'float translate(float val,',
        'float pointPlacement,',
        'float localA,',
        'float localMin,',
        'float minPixelPadding,',
        'float pointRange,',
        'float len,',
        'bool  cvsCoord,',
        'bool  isLog,',
        'bool  reversed',
        '){',
        'float sign = 1.0;',
        'float cvsOffset = 0.0;',
        'if (cvsCoord) {',
        'sign *= -1.0;',
        'cvsOffset = len;',
        '}',
        'if (isLog) {',
        'val = log(val) / LN10;',
        '}',
        'if (reversed) {',
        'sign *= -1.0;',
        'cvsOffset -= sign * len;',
        '}',
        'return sign * (val - localMin) * localA + cvsOffset + ',
        '(sign * minPixelPadding);',
        '}',
        'float xToPixels(float value) {',
        'if (skipTranslation){',
        'return value;// + xAxisPos;',
        '}',
        'return translate(value, 0.0, xAxisTrans, xAxisMin, xAxisMinPad, xAxisPointRange, xAxisLen, xAxisCVSCoord, xAxisIsLog, xAxisReversed);// + xAxisPos;',
        '}',
        'float yToPixels(float value, float checkTreshold) {',
        'float v;',
        'if (skipTranslation){',
        'v = value;// + yAxisPos;',
        '} else {',
        'v = translate(value, 0.0, yAxisTrans, yAxisMin, yAxisMinPad, yAxisPointRange, yAxisLen, yAxisCVSCoord, yAxisIsLog, yAxisReversed);// + yAxisPos;',
        'if (v > yAxisLen) {',
        'v = yAxisLen;',
        '}',
        '}',
        'if (checkTreshold > 0.0 && hasThreshold) {',
        'v = min(v, translatedThreshold);',
        '}',
        'return v;',
        '}',
        'void main(void) {',
        'if (isBubble){',
        'gl_PointSize = bubbleRadius();',
        '} else {',
        'gl_PointSize = pSize;',
        '}',
        // 'gl_PointSize = 10.0;',
        'vColor = aColor;',
        'if (skipTranslation && isInverted) {',
        // If we get translated values from JS, just swap them (x, y)
        'gl_Position = uPMatrix * vec4(aVertexPosition.y + yAxisPos, aVertexPosition.x + xAxisPos, 0.0, 1.0);',
        '} else if (isInverted) {',
        // But when calculating pixel positions directly,
        // swap axes and values (x, y)
        'gl_Position = uPMatrix * vec4(yToPixels(aVertexPosition.y, aVertexPosition.z) + yAxisPos, xToPixels(aVertexPosition.x) + xAxisPos, 0.0, 1.0);',
        '} else {',
        'gl_Position = uPMatrix * vec4(xToPixels(aVertexPosition.x) + xAxisPos, yToPixels(aVertexPosition.y, aVertexPosition.z) + yAxisPos, 0.0, 1.0);',
        '}',
        // 'gl_Position = uPMatrix * vec4(aVertexPosition.x, aVertexPosition.y, 0.0, 1.0);',
        '}'
        /* eslint-enable max-len, @typescript-eslint/indent */
    ].join('\n'), 
    // Fragment shader source
    fragShade = [
        /* eslint-disable max-len, @typescript-eslint/indent */
        'precision highp float;',
        'uniform vec4 fillColor;',
        'varying highp vec2 position;',
        'varying highp vec4 vColor;',
        'uniform sampler2D uSampler;',
        'uniform bool isCircle;',
        'uniform bool hasColor;',
        // 'vec4 toColor(float value, vec2 point) {',
        //     'return vec4(0.0, 0.0, 0.0, 0.0);',
        // '}',
        'void main(void) {',
        'vec4 col = fillColor;',
        'vec4 tcol;',
        'if (hasColor) {',
        'col = vColor;',
        '}',
        'if (isCircle) {',
        'tcol = texture2D(uSampler, gl_PointCoord.st);',
        'col *= tcol;',
        'if (tcol.r < 0.0) {',
        'discard;',
        '} else {',
        'gl_FragColor = col;',
        '}',
        '} else {',
        'gl_FragColor = col;',
        '}',
        '}'
        /* eslint-enable max-len, @typescript-eslint/indent */
    ].join('\n'), uLocations = {}, 
    // The shader program
    shaderProgram, 
    // Uniform handle to the perspective matrix
    pUniform, 
    // Uniform for point size
    psUniform, 
    // Uniform for fill color
    fillColorUniform, 
    // Uniform for isBubble
    isBubbleUniform, 
    // Uniform for bubble abs sizing
    bubbleSizeAbsUniform, bubbleSizeAreaUniform, 
    // Skip translation uniform
    skipTranslationUniform, 
    // Set to 1 if circle
    isCircleUniform, 
    // Uniform for invertion
    isInverted, 
    // Error stack
    errors = [], 
    // Texture uniform
    uSamplerUniform;
    /**
     * Handle errors accumulated in errors stack
     * @private
     */
    function handleErrors() {
        if (errors.length) {
            error('[highcharts boost] shader error - ' + errors.join('\n'));
        }
    }
    /**
     * String to shader program
     * @private
     * @param {string} str - the program source
     * @param {string} type - the program type: either `vertex` or `fragment`
     * @returns {bool|shader}
     */
    function stringToProgram(str, type) {
        var t = type === 'vertex' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER, shader = gl.createShader(t);
        gl.shaderSource(shader, str);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            errors.push('when compiling ' +
                type +
                ' shader:\n' +
                gl.getShaderInfoLog(shader));
            return false;
        }
        return shader;
    }
    /**
     * Create the shader.
     * Loads the shader program statically defined above
     * @private
     */
    function createShader() {
        var v = stringToProgram(vertShade, 'vertex'), f = stringToProgram(fragShade, 'fragment');
        if (!v || !f) {
            shaderProgram = false;
            handleErrors();
            return false;
        }
        /**
         * @private
         */
        function uloc(n) {
            return gl.getUniformLocation(shaderProgram, n);
        }
        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, v);
        gl.attachShader(shaderProgram, f);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            errors.push(gl.getProgramInfoLog(shaderProgram));
            handleErrors();
            shaderProgram = false;
            return false;
        }
        gl.useProgram(shaderProgram);
        gl.bindAttribLocation(shaderProgram, 0, 'aVertexPosition');
        pUniform = uloc('uPMatrix');
        psUniform = uloc('pSize');
        fillColorUniform = uloc('fillColor');
        isBubbleUniform = uloc('isBubble');
        bubbleSizeAbsUniform = uloc('bubbleSizeAbs');
        bubbleSizeAreaUniform = uloc('bubbleSizeByArea');
        uSamplerUniform = uloc('uSampler');
        skipTranslationUniform = uloc('skipTranslation');
        isCircleUniform = uloc('isCircle');
        isInverted = uloc('isInverted');
        return true;
    }
    /**
     * Destroy the shader
     * @private
     */
    function destroy() {
        if (gl && shaderProgram) {
            gl.deleteProgram(shaderProgram);
            shaderProgram = false;
        }
    }
    /**
     * Bind the shader.
     * This makes the shader the active one until another one is bound,
     * or until 0 is bound.
     * @private
     */
    function bind() {
        if (gl && shaderProgram) {
            gl.useProgram(shaderProgram);
        }
    }
    /**
     * Set a uniform value.
     * This uses a hash map to cache uniform locations.
     * @private
     * @param name {string} - the name of the uniform to set
     * @param val {float} - the value to set
     */
    function setUniform(name, val) {
        if (gl && shaderProgram) {
            var u = uLocations[name] = (uLocations[name] ||
                gl.getUniformLocation(shaderProgram, name));
            gl.uniform1f(u, val);
        }
    }
    /**
     * Set the active texture
     * @private
     * @param texture - the texture
     */
    function setTexture(texture) {
        if (gl && shaderProgram) {
            gl.uniform1i(uSamplerUniform, texture);
        }
    }
    /**
     * Set if inversion state
     * @private
     * @flag is the state
     */
    function setInverted(flag) {
        if (gl && shaderProgram) {
            gl.uniform1i(isInverted, flag);
        }
    }
    /**
     * Enable/disable circle drawing
     * @private
     */
    function setDrawAsCircle(flag) {
        if (gl && shaderProgram) {
            gl.uniform1i(isCircleUniform, flag ? 1 : 0);
        }
    }
    /**
     * Flush
     * @private
     */
    function reset() {
        if (gl && shaderProgram) {
            gl.uniform1i(isBubbleUniform, 0);
            gl.uniform1i(isCircleUniform, 0);
        }
    }
    /**
     * Set bubble uniforms
     * @private
     * @param series {Highcharts.Series} - the series to use
     */
    function setBubbleUniforms(series, zCalcMin, zCalcMax) {
        var seriesOptions = series.options, zMin = Number.MAX_VALUE, zMax = -Number.MAX_VALUE;
        if (gl && shaderProgram && series.type === 'bubble') {
            zMin = pick(seriesOptions.zMin, clamp(zCalcMin, seriesOptions.displayNegative === false ?
                seriesOptions.zThreshold : -Number.MAX_VALUE, zMin));
            zMax = pick(seriesOptions.zMax, Math.max(zMax, zCalcMax));
            gl.uniform1i(isBubbleUniform, 1);
            gl.uniform1i(isCircleUniform, 1);
            gl.uniform1i(bubbleSizeAreaUniform, (series.options.sizeBy !== 'width'));
            gl.uniform1i(bubbleSizeAbsUniform, series.options
                .sizeByAbsoluteValue);
            setUniform('bubbleZMin', zMin);
            setUniform('bubbleZMax', zMax);
            setUniform('bubbleZThreshold', series.options.zThreshold);
            setUniform('bubbleMinSize', series.minPxSize);
            setUniform('bubbleMaxSize', series.maxPxSize);
        }
    }
    /**
     * Set the Color uniform.
     * @private
     * @param color {Array<float>} - an array with RGBA values
     */
    function setColor(color) {
        if (gl && shaderProgram) {
            gl.uniform4f(fillColorUniform, color[0] / 255.0, color[1] / 255.0, color[2] / 255.0, color[3]);
        }
    }
    /**
     * Set skip translation
     * @private
     */
    function setSkipTranslation(flag) {
        if (gl && shaderProgram) {
            gl.uniform1i(skipTranslationUniform, flag === true ? 1 : 0);
        }
    }
    /**
     * Set the perspective matrix
     * @private
     * @param m {Matrix4x4} - the matrix
     */
    function setPMatrix(m) {
        if (gl && shaderProgram) {
            gl.uniformMatrix4fv(pUniform, false, m);
        }
    }
    /**
     * Set the point size.
     * @private
     * @param p {float} - point size
     */
    function setPointSize(p) {
        if (gl && shaderProgram) {
            gl.uniform1f(psUniform, p);
        }
    }
    /**
     * Get the shader program handle
     * @private
     * @return {GLInt} - the handle for the program
     */
    function getProgram() {
        return shaderProgram;
    }
    if (gl) {
        if (!createShader()) {
            return false;
        }
    }
    return {
        psUniform: function () {
            return psUniform;
        },
        pUniform: function () {
            return pUniform;
        },
        fillColorUniform: function () {
            return fillColorUniform;
        },
        setBubbleUniforms: setBubbleUniforms,
        bind: bind,
        program: getProgram,
        create: createShader,
        setUniform: setUniform,
        setPMatrix: setPMatrix,
        setColor: setColor,
        setPointSize: setPointSize,
        setSkipTranslation: setSkipTranslation,
        setTexture: setTexture,
        setDrawAsCircle: setDrawAsCircle,
        reset: reset,
        setInverted: setInverted,
        destroy: destroy
    };
}
export default GLShader;
