/**
 * License: www.highcharts.com/license
 * Author: Torstein Honsi
 * 
 * This is an experimental Highcharts module that draws long data series on a canvas
 * in order to increase performance of the initial load time and tooltip responsiveness.
 *
 * Compatible with WebGL compatible browsers (not IE < 11).
 *
 * Development plan
 * - Column range.
 * - Check how it works with Highstock and data grouping. Currently it only works when navigator.adaptToUpdatedData
 *   is false. It is also recommended to set scrollbar.liveRedraw to false.
 * - Check inverted charts.
 * - Check reversed axes.
 * - Chart callback should be async after last series is drawn. (But not necessarily, we don't do
	 that with initial series animation).
 * - Cache full-size image so we don't have to redraw on hide/show and zoom up. But k-d-tree still
 *   needs to be built.
 * - Stacking is not perhaps not correct since it doesn't use the translation given in 
 *   the translate method. If this gets to complicated, a possible way out would be to 
 *   have a simplified renderCanvas method that simply draws the areaPath on a canvas.
 *
 * If this module is taken in as part of the core
 * - All the loading logic should be merged with core. Update styles in the core.
 * - Most of the method wraps should probably be added directly in parent methods.
 *
 * Notes for boost mode
 * - Area lines are not drawn
 * - Point markers are not drawn on line-type series
 * - Lines are not drawn on scatter charts
 * - Zones and negativeColor don't work
 * - Columns are always one pixel wide. Don't set the threshold too low.
 * - Disable animations 
 *
 * Optimizing tips for users
 * - Set extremes (min, max) explicitly on the axes in order for Highcharts to avoid computing extremes.
 * - Set enableMouseTracking to false on the series to improve total rendering time.
 * - The default threshold is set based on one series. If you have multiple, dense series, the combined
 *   number of points drawn gets higher, and you may want to set the threshold lower in order to 
 *   use optimizations.
 * - If drawing large scatter charts, it's beneficial to set the marker radius to a value
 *   less than 1. This is to add additional spacing to make the chart more readable.
 */

'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Color.js';
import '../parts/Series.js';
import '../parts/Options.js';
import '../parts/Point.js';
import '../parts/Interaction.js';

var win = H.win,
	doc = win.document,
	noop = function () {},
	Color = H.Color,
	Series = H.Series,
	Point = H.Point,
	seriesTypes = H.seriesTypes,
	each = H.each,
	extend = H.extend,
	addEvent = H.addEvent,
	fireEvent = H.fireEvent,
	grep = H.grep,
	isNumber = H.isNumber,
	//merge = H.merge,
	pick = H.pick,
	wrap = H.wrap,
	plotOptions = H.getOptions().plotOptions,
	CHUNK_SIZE = 50000,
	//destroyLoadingDiv,
	index,
	colorMap = {
		aliceblue: [ 240, 248, 255, 1 ],
		antiquewhite: [ 250, 235, 215, 1 ],
		aqua: [ 0, 255, 255, 1 ],
		aquamarine: [ 127, 255, 212, 1 ],
		azure: [ 240, 255, 255, 1 ],
		beige: [ 245, 245, 220, 1 ],
		bisque: [ 255, 228, 196, 1 ],
		black: [ 0, 0, 0, 1 ],
		blanchedalmond: [ 255, 235, 205, 1 ],
		blue: [ 0, 0, 255, 1 ],
		blueviolet: [ 138, 43, 226, 1 ],
		brown: [ 165, 42, 42, 1 ],
		burlywood: [ 222, 184, 135, 1 ],
		cadetblue: [ 95, 158, 160, 1 ],
		chartreuse: [ 127, 255, 0, 1 ],
		chocolate: [ 210, 105, 30, 1 ],
		coral: [ 255, 127, 80, 1 ],
		cornflowerblue: [ 100, 149, 237, 1 ],
		cornsilk: [ 255, 248, 220, 1 ],
		crimson: [ 220, 20, 60, 1 ],
		cyan: [ 0, 255, 255, 1 ],
		darkblue: [ 0, 0, 139, 1 ],
		darkcyan: [ 0, 139, 139, 1 ],
		darkgoldenrod: [ 184, 134, 11, 1 ],
		darkgray: [ 169, 169, 169, 1 ],
		darkgrey: [ 169, 169, 169, 1 ],
		darkgreen: [ 0, 100, 0, 1 ],
		darkkhaki: [ 189, 183, 107, 1 ],
		darkmagenta: [ 139, 0, 139, 1 ],
		darkolivegreen: [ 85, 107, 47, 1 ],
		darkorange: [ 255, 140, 0, 1 ],
		darkorchid: [ 153, 50, 204, 1 ],
		darkred: [ 139, 0, 0, 1 ],
		darksalmon: [ 233, 150, 122, 1 ],
		darkseagreen: [ 143, 188, 143, 1 ],
		darkslateblue: [ 72, 61, 139, 1 ],
		darkslategray: [ 47, 79, 79, 1 ],
		darkslategrey: [ 47, 79, 79, 1 ],
		darkturquoise: [ 0, 206, 209, 1 ],
		darkviolet: [ 148, 0, 211, 1 ],
		deeppink: [ 255, 20, 147, 1 ],
		deepskyblue: [ 0, 191, 255, 1 ],
		dimgray: [ 105, 105, 105, 1 ],
		dimgrey: [ 105, 105, 105, 1 ],
		dodgerblue: [ 30, 144, 255, 1 ],
		firebrick: [ 178, 34, 34, 1 ],
		floralwhite: [ 255, 250, 240, 1 ],
		forestgreen: [ 34, 139, 34, 1 ],
		fuchsia: [ 255, 0, 255, 1 ],
		gainsboro: [ 220, 220, 220, 1 ],
		ghostwhite: [ 248, 248, 255, 1 ],
		gold: [ 255, 215, 0, 1 ],
		goldenrod: [ 218, 165, 32, 1 ],
		gray: [ 128, 128, 128, 1 ],
		grey: [ 128, 128, 128, 1 ],
		green: [ 0, 128, 0, 1 ],
		greenyellow: [ 173, 255, 47, 1 ],
		honeydew: [ 240, 255, 240, 1 ],
		hotpink: [ 255, 105, 180, 1 ],
		indianred: [ 205, 92, 92, 1 ],
		indigo: [ 75, 0, 130, 1 ],
		ivory: [ 255, 255, 240, 1 ],
		khaki: [ 240, 230, 140, 1 ],
		lavender: [ 230, 230, 250, 1 ],
		lavenderblush: [ 255, 240, 245, 1 ],
		lawngreen: [ 124, 252, 0, 1 ],
		lemonchiffon: [ 255, 250, 205, 1 ],
		lightblue: [ 173, 216, 230, 1 ],
		lightcoral: [ 240, 128, 128, 1 ],
		lightcyan: [ 224, 255, 255, 1 ],
		lightgoldenrodyellow: [ 250, 250, 210, 1 ],
		lightgray: [ 211, 211, 211, 1 ],
		lightgrey: [ 211, 211, 211, 1 ],
		lightgreen: [ 144, 238, 144, 1 ],
		lightpink: [ 255, 182, 193, 1 ],
		lightsalmon: [ 255, 160, 122, 1 ],
		lightseagreen: [ 32, 178, 170, 1 ],
		lightskyblue: [ 135, 206, 250, 1 ],
		lightslategray: [ 119, 136, 153, 1 ],
		lightslategrey: [ 119, 136, 153, 1 ],
		lightsteelblue: [ 176, 196, 222, 1 ],
		lightyellow: [ 255, 255, 224, 1 ],
		lime: [ 0, 255, 0, 1 ],
		limegreen: [ 50, 205, 50, 1 ],
		linen: [ 250, 240, 230, 1 ],
		magenta: [ 255, 0, 255, 1 ],
		maroon: [ 128, 0, 0, 1 ],
		mediumaquamarine: [ 102, 205, 170, 1 ],
		mediumblue: [ 0, 0, 205, 1 ],
		mediumorchid: [ 186, 85, 211, 1 ],
		mediumpurple: [ 147, 112, 216, 1 ],
		mediumseagreen: [ 60, 179, 113, 1 ],
		mediumslateblue: [ 123, 104, 238, 1 ],
		mediumspringgreen: [ 0, 250, 154, 1 ],
		mediumturquoise: [ 72, 209, 204, 1 ],
		mediumvioletred: [ 199, 21, 133, 1 ],
		midnightblue: [ 25, 25, 112, 1 ],
		mintcream: [ 245, 255, 250, 1 ],
		mistyrose: [ 255, 228, 225, 1 ],
		moccasin: [ 255, 228, 181, 1 ],
		navajowhite: [ 255, 222, 173, 1 ],
		navy: [ 0, 0, 128, 1 ],
		oldlace: [ 253, 245, 230, 1 ],
		olive: [ 128, 128, 0, 1 ],
		olivedrab: [ 107, 142, 35, 1 ],
		orange: [ 255, 165, 0, 1 ],
		orangered: [ 255, 69, 0, 1 ],
		orchid: [ 218, 112, 214, 1 ],
		palegoldenrod: [ 238, 232, 170, 1 ],
		palegreen: [ 152, 251, 152, 1 ],
		paleturquoise: [ 175, 238, 238, 1 ],
		palevioletred: [ 216, 112, 147, 1 ],
		papayawhip: [ 255, 239, 213, 1 ],
		peachpuff: [ 255, 218, 185, 1 ],
		peru: [ 205, 133, 63, 1 ],
		pink: [ 255, 192, 203, 1 ],
		plum: [ 221, 160, 221, 1 ],
		powderblue: [ 176, 224, 230, 1 ],
		purple: [ 128, 0, 128, 1 ],
		red: [ 255, 0, 0, 1 ],
		rosybrown: [ 188, 143, 143, 1 ],
		royalblue: [ 65, 105, 225, 1 ],
		saddlebrown: [ 139, 69, 19, 1 ],
		salmon: [ 250, 128, 114, 1 ],
		sandybrown: [ 244, 164, 96, 1 ],
		seagreen: [ 46, 139, 87, 1 ],
		seashell: [ 255, 245, 238, 1 ],
		sienna: [ 160, 82, 45, 1 ],
		silver: [ 192, 192, 192, 1 ],
		skyblue: [ 135, 206, 235, 1 ],
		slateblue: [ 106, 90, 205, 1 ],
		slategray: [ 112, 128, 144, 1 ],
		slategrey: [ 112, 128, 144, 1 ],
		snow: [ 255, 250, 250, 1 ],
		springgreen: [ 0, 255, 127, 1 ],
		steelblue: [ 70, 130, 180, 1 ],
		tan: [ 210, 180, 140, 1 ],
		teal: [ 0, 128, 128, 1 ],
		thistle: [ 216, 191, 216, 1 ],
		tomato: [ 255, 99, 71, 1 ],
		turquoise: [ 64, 224, 208, 1 ],
		violet: [ 238, 130, 238, 1 ],
		wheat: [ 245, 222, 179, 1 ],
		white: [ 255, 255, 255, 1 ],
		whitesmoke: [ 245, 245, 245, 1 ],
		yellow: [ 255, 255, 0, 1 ],
		yellowgreen: [ 154, 205, 50, 1 ]
	};

// Faster conversion to RGB for hex colors
function toRGBAFast(col) {

	// Parse as a hex color
	if (col && col.length === 7 && col[0] === '#') {
		col = parseInt(col.substr(1), 16);

		return [
			(col & 0xFF0000) >> 16,
			(col & 0x00FF00) >> 8,
			(col & 0x0000FF),
			1.0 
		];
	}
	
	// We may need to look it up
	col = col.toLowerCase();
	if (colorMap[col]) {
		col = colorMap[col];
		return [
			col[0],
			col[1],
			col[2],
			1
		];
	}

	// Fall back to highcharts regex
	return H.Color(col).rgba;
}

/*
 * Returns true if the chart is in series boost mode
 * @param chart {Highchart.Chart} - the chart to check
 * @returns {Boolean} - true if the chart is in series boost mode
 */
function isChartSeriesBoosting(chart) {	
	return chart.series.length >= (chart.options.chart.seriesBoostThreshold || 10);
}

/*
 * Returns true if the series is in boost mode
 * @param series {Highchart.Series} - the series to check
 * @returns {boolean} - true if the series is in boost mode
 */
function isSeriesBoosting(series) {
	function patientMax() {
		var args = Array.prototype.slice.call(arguments),
			r = -Number.MAX_VALUE;

		each(args, function (t) {
			if (typeof t !== 'undefined' && typeof t.length !== 'undefined') {
				//r = r < t.length ? t.length : r;
				if (t.length > 0) {
					r = t.length;
					return true;
				}
			}
		});

		return r;
	}		

	return  isChartSeriesBoosting(series.chart) ||
			patientMax(
				series.processedXData, 
				series.options.data,
				series.points
			) >= (series.options.boostThreshold || Number.MAX_VALUE);				
}

////////////////////////////////////////////////////////////////////////////////
// START OF WEBGL ABSTRACTIONS

/* 
 * A static shader mimicing axis translation functions found in parts/Axis
 * @param gl {WebGLContext} - the context in which the shader is active
 */
function GLShader(gl) {
	var vertShade = [
			/* eslint-disable */
			'#version 100',
			'precision highp float;',
			
			'attribute vec4 aVertexPosition;',
			'attribute vec4 aColor;',

			'varying highp vec2 position;',
			'varying highp vec4 vColor;',
			//'attribute float aXAxis;',
			//'attribute float aYAxis;',

			'uniform mat4 uPMatrix;',
			'uniform float pSize;',

			'uniform float translatedThreshold;',
			'uniform bool hasThreshold;',

			'uniform float width;',
			'uniform float height;',

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

			'uniform bool  isBubble;',
			'uniform bool  bubbleSizeByArea;',
			'uniform float bubbleZMin;',
			'uniform float bubbleZMax;',
			'uniform float bubbleZThreshold;',
			'uniform float bubbleMinSize;',
			'uniform float bubbleMaxSize;',
			'uniform bool  bubbleSizeAbs;',

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
							'bool  cvsCoord',
							'){',

				'float sign = 1.0;',
				'float cvsOffset = 0.0;',

				'if (cvsCoord) {',
					'sign *= -1.0;',
					'cvsOffset = len;',
				'}',

				'return sign * (val - localMin) * localA + cvsOffset + ',
					'(sign * minPixelPadding);',//' + localA * pointPlacement * pointRange;',
			'}',

			'float xToPixels(float value){',
				'if (skipTranslation){',
					'return value + xAxisPos;',
				'}',

				'return translate(value, 0.0, xAxisTrans, xAxisMin, xAxisMinPad, xAxisPointRange, xAxisLen, xAxisCVSCoord) + xAxisPos;',
			'}',

			'float yToPixels(float value, float checkTreshold){',
				'if (skipTranslation){',
					'return value + yAxisPos;',
				'}',

				'float v = translate(value, 0.0, yAxisTrans, yAxisMin, yAxisMinPad, yAxisPointRange, yAxisLen, yAxisCVSCoord) + yAxisPos;',
				//'if (checkTreshold > 0.0 && hasThreshold) {',
				//	'v = min(v, translatedThreshold);',
				//'}',
				'return v;',
			'}',

			'void main(void) {',
				'if (isBubble){',
					'gl_PointSize = bubbleRadius();',
				'} else {',
					'gl_PointSize = pSize;',
				'}',
				//'gl_PointSize = 10.0;',
				'vColor = aColor;',
				'gl_Position = uPMatrix * vec4(xToPixels(aVertexPosition.x), yToPixels(aVertexPosition.y, aVertexPosition.z), 0.0, 1.0);',
			'}'
			/* eslint-enable */
		].join('\n'),
		//Fragment shader source
		fragShade = [
			/* eslint-disable */
			'precision highp float;',
			'uniform vec4 fillColor;',
			'varying highp vec2 position;',  
			'varying highp vec4 vColor;',    
  			'uniform sampler2D uSampler;',
  			'uniform bool isCircle;',
  			'uniform bool hasColor;',

  			// 'vec4 toColor(float value, vec2 point) {',
  			// 	'return vec4(0.0, 0.0, 0.0, 0.0);',
  			// '}',

			'void main(void) {',				
				'vec4 col = fillColor;',

				'if (hasColor) {',
					'col = vColor;',
				'}',

				'if (isCircle) {',
					'gl_FragColor = col * texture2D(uSampler, gl_PointCoord.st);',
				'} else {',
					'gl_FragColor = col;',
				'}',
			'}'
			/* eslint-enable */
		].join('\n'),
		uLocations = {},
		//The shader program
		shaderProgram,
		//Uniform handle to the perspective matrix
		pUniform,
		//Uniform for point size
		psUniform,
		//Uniform for fill color
		fillColorUniform,
		//Uniform for isBubble
		isBubbleUniform,
		//Uniform for bubble abs sizing
		bubbleSizeAbsUniform,
		bubbleSizeAreaUniform,
		//Skip translation uniform
		skipTranslationUniform,
		//Set to 1 if circle
		isCircleUniform,
		//Texture uniform
		uSamplerUniform;

	/* String to shader program
	 * @param {string} str - the program source
	 * @param {string} type - the program type: either `vertex` or `fragment`
	 * @returns {bool|shader}
	 */
	function stringToProgram(str, type) {
		var t = type === 'vertex' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER,
			shader = gl.createShader(t)
		;

		gl.shaderSource(shader, str);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			//console.error('shader error:', gl.getShaderInfoLog(shader));
			return false;
		}
		return shader;
	}

	/*
	 * Create the shader.
	 * Loads the shader program statically defined above
	 */
	function createShader() {
		var v = stringToProgram(vertShade, 'vertex'),
			f = stringToProgram(fragShade, 'fragment')
		;

		if (!v || !f) {
			shaderProgram = false;
			//console.error('error creating shader program');
			return false;
		}

		function uloc(n) {
			return gl.getUniformLocation(shaderProgram, n);
		}

		shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, v);
		gl.attachShader(shaderProgram, f);
		gl.linkProgram(shaderProgram);

		gl.useProgram(shaderProgram);

		pUniform = uloc('uPMatrix');
		psUniform = uloc('pSize');
		fillColorUniform = uloc('fillColor');
		isBubbleUniform = uloc('isBubble');
		bubbleSizeAbsUniform = uloc('bubbleSizeAbs');
		bubbleSizeAreaUniform = uloc('bubbleSizeByArea');
		uSamplerUniform = uloc('uSampler');
		skipTranslationUniform = uloc('skipTranslation');
		isCircleUniform = uloc('isCircle');
		return true;
	}

	/*
	 * Bind the shader.
	 * This makes the shader the active one until another one is bound,
	 * or until 0 is bound.
	 */
	function bind() {
		gl.useProgram(shaderProgram);
	}

	/*
	 * Set a uniform value.
	 * This uses a hash map to cache uniform locations.
	 * @param name {string} - the name of the uniform to set
	 * @param val {float} - the value to set
	 */
	function setUniform(name, val) {
		var u = uLocations[name] =	uLocations[name] ||
									gl.getUniformLocation(shaderProgram, name);
		gl.uniform1f(u, val);
	}

	/*
	 * Set the active texture
	 * @param texture - the texture
	 */
	function setTexture() {
		gl.uniform1i(uSamplerUniform, 0);
	}

	////////////////////////////////////////////////////////////////////////////

	/* 
	 * Enable/disable circle drawing
	 */
	function setDrawAsCircle(flag) {
		gl.uniform1i(isCircleUniform, flag ? 1 : 0);
	}

	/*
	 * Flush
	 */
	function reset() {
		gl.uniform1i(isBubbleUniform, 0);
		gl.uniform1i(isCircleUniform, 0);
	}

	/* 
	 * Set bubble uniforms
	 * @param series {Highcharts.Series} - the series to use
	 */
	function setBubbleUniforms(series, zCalcMin, zCalcMax) {
		var seriesOptions = series.options,
			zMin = Number.MAX_VALUE,
			zMax = -Number.MAX_VALUE;

		if (series.type === 'bubble') {
			zMin = pick(seriesOptions.zMin, Math.min(
				zMin,
				Math.max(
					zCalcMin, 
					seriesOptions.displayNegative === false ? 
					seriesOptions.zThreshold : -Number.MAX_VALUE
				)
			));

			zMax = pick(seriesOptions.zMax, Math.max(zMax, zCalcMax));

			gl.uniform1i(isBubbleUniform, 1);
			gl.uniform1i(isCircleUniform, 1);
			gl.uniform1i(bubbleSizeAreaUniform, series.options.sizeBy !== 'width');
			gl.uniform1i(bubbleSizeAbsUniform, series.options.sizeByAbsoluteValue);
			setUniform('bubbleZMin', zMin);
			setUniform('bubbleZMax', zMax);
			setUniform('bubbleZThreshold', series.options.zThreshold);
			setUniform('bubbleMinSize', series.minPxSize);
			setUniform('bubbleMaxSize', series.maxPxSize);
		}
	}

	/*
	 * Set the Color uniform.
	 * @param color {Array<float>} - an array with RGBA values
	 */
	function setColor(color) {
		gl.uniform4f(
			fillColorUniform, 
			color[0] / 255.0, 
			color[1] / 255.0, 
			color[2] / 255.0, 
			color[3]
		);
	}

	/*
	 * Set skip translation
	 */
	function setSkipTranslation(flag) {
		gl.uniform1i(skipTranslationUniform, flag === true ? 1 : 0);
	}

	/*
	 * Set the perspective matrix
	 * @param m {Matrix4x4} - the matrix 
	 */
	function setPMatrix(m) {
		gl.uniformMatrix4fv(pUniform, false, m);
	}

	/*
	 * Set the point size.
	 * @param p {float} - point size
	 */
	function setPointSize(p) {
		gl.uniform1f(psUniform, p);
	}

	/*
	 * Get the shader program handle
	 * @returns {GLInt} - the handle for the program
	 */
	function getProgram() {
		return shaderProgram;
	}

	if (gl) {
		createShader();		
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
		reset: reset
	};
}

/* 
 * Vertex Buffer abstraction 
 * A vertex buffer is a set of vertices which are passed to the GPU
 * in a single call.
 * @param gl {WebGLContext} - the context in which to create the buffer
 * @param shader {GLShader} - the shader to use
 */
function GLVertexBuffer(gl, shader, dataComponents, type) {
	var buffer = false,
		vertAttribute = false,
		components = dataComponents || 2,
		preAllocated = false,
		iterator = 0,
		data;

	type = type || 'float';

	/* 
	 * Build the buffer 
 	 * @param dataIn {Array<float>} - a 0 padded array of indices
 	 * @param attrib {String} - the name of the Attribute to bind the buffer to
 	 * @param dataComponents {Integer} - the number of components per. indice
	 */
	function build(dataIn, attrib, dataComponents) {

		data = dataIn || [];

		if ((!data || data.length === 0) && !preAllocated) {
			//console.error('trying to render empty vbuffer');
			buffer = false;
			return false;
		}

		components = dataComponents || components;

		buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(
			gl.ARRAY_BUFFER, 
			preAllocated || new Float32Array(data), 
			gl.STATIC_DRAW
		);

		vertAttribute = gl.getAttribLocation(shader.program(), attrib);
		gl.enableVertexAttribArray(vertAttribute);

		return true;
	}

	/* 
	 * Bind the buffer
	 */
	function bind() {		
		if (!buffer) {
			return;
		}

		gl.enableVertexAttribArray(vertAttribute);
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.vertexAttribPointer(vertAttribute, components, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vertAttribute);
	}

	/* 
	 * Render the buffer 
	 * @param from {Integer} - the start indice
	 * @param to {Integer} - the end indice
	 * @param drawMode {String} - the draw mode
	 */
	function render(from, to, drawMode) {
		var length = preAllocated ? preAllocated.length : data.length;

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
			gl[drawMode.toUpperCase()], 
			from / components, 
			(to - from) / components
		); 

		return true;
	}

	function push(x, y, a, b) {
		if (preAllocated) {// && iterator <= preAllocated.length - 4) {			
			preAllocated[++iterator] = x;
			preAllocated[++iterator] = y;			
			preAllocated[++iterator] = a;
			preAllocated[++iterator] = b;			
		}
	}

	/*
	 * Note about pre-allocated buffers:
	 * 	- This is slower for charts with many series
	 */
	function allocate(size) {
		size *= 4;
		console.log('resetting iterator');
		iterator = -1;

		//if (!preAllocated || (preAllocated && preAllocated.length !== size)) {
			console.log('allocating vbuffer of size', size);
			preAllocated = new Float32Array(size);
		//}
	}

	////////////////////////////////////////////////////////////////////////////
	return {
		bind: bind,
		data: data,
		build: build,
		render: render,
		allocate: allocate,
		push: push
	};    	
}

/* Main renderer. Used to render series.
 *	Notes to self:
 *		- May be able to build a point map by rendering to a separate canvas
 *		  and encoding values in the color data.
 *		- Need to figure out a way to transform the data quicker
 */
function GLRenderer(options) {
	var //Shader
		shader = false,
		//Vertex buffers - keyed on shader attribute name
		vbuffer = false,
		//Opengl context
		gl = false,
		//Width of our viewport in pixels
		width = 0,
		//Height of our viewport in pixels
		height = 0,
		//The data to render - array of coordinates
		data = false,		
		//Exports
		exports = {},
		//Is it inited?
		isInited = false,
		//The series stack
		series = [],	
		//Texture for circles
		circleTexture = new Image(),
		//Handle for the circle texture
		circleTextureHandle,
		//Things to draw as "rectangles" (i.e lines)
		asBar = {
			'column': true,
			'area': true
		},
		asCircle = {
			'scatter': true,
			'bubble': true
		},
		//Render settings
		settings = {
			pointSize: 1,
			lineWidth: 2,
			fillColor: '#AA00AA',
			useAlpha: true,
			usePreallocated: false,
			useGPUTranslations: false,
			timeRendering: true,
			timeSeriesProcessing: true
		};

	////////////////////////////////////////////////////////////////////////////

	//Create a white circle texture for use with bubbles
	circleTexture.src = 'data:image/svg+xml;utf8,' + encodeURIComponent([
		'<?xml version="1.0" standalone="no"?>',
		'<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink">',
		'<circle cx="512" cy="512" r="512" stroke="none" fill="#FFF"/>',
		'</svg>'
	].join(''));

	circleTexture.width = 32;
	circleTexture.height = 32;

	function seriesPointCount(series) {
		var isStacked,
			xData,
			s;
	
		if (isSeriesBoosting(series)) {
			isStacked = !!series.options.stacking;
			xData = series.xData || series.options.xData || series.processedXData;
			s = (isStacked ? series.data : (xData || series.options.data)).length;

			if (series.type === 'treemap') {
				s *= 12;
			} else if (series.type === 'heatmap') {
				s *= 6;				
			} else if (asBar[series.type]) {
				s *= 2;
			}

			return s;
		}

		return 0;
	}

	/* Allocate a float buffer to fit all series */
	function allocateBuffer(chart) {
		var s = 0;

		if (!settings.usePreallocated) {
			return;
		}

		each(chart.series, function (series) {
			if (isSeriesBoosting(series)) {				
				s += seriesPointCount(series);
			}
		});
		
		vbuffer.allocate(s);		
	}

	function allocateBufferForSingleSeries(series) {
		var s = 0;

		if (!settings.usePreallocated) {
			return;
		}

		if (isSeriesBoosting(series)) {
			s = seriesPointCount(series);			
		}

		vbuffer.allocate(s);
	}

	/*  
	 * Returns an orthographic perspective matrix
	 * @param {number} width - the width of the viewport in pixels
	 * @param {number} height - the height of the viewport in pixels
	 */
	function orthoMatrix(width, height) {        
		return [
			2 / width, 0, 0, 0,
			0, -(2 / height), 0, 0,
			0, 0, 1, 0,
			-1, 1, 0, 1
		];
	}

	/*
	 * Clear the depth and color buffer
	 */
	function clear() {
		//gl.clearColor(0, 0, 1, 0.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	/*
	 * Get the WebGL context
	 * @returns {WebGLContext} - the context
	 */
	function getGL() {
		return gl;
	}

	/*
	 * Push data for a single series
	 * This calculates additional vertices and transforms the data to be 
	 * aligned correctly in memory
	 */
	function pushSeriesData(series, inst) {
		var isRange = series.pointArrayMap && 
						series.pointArrayMap.join(',') === 'low,high',
			chart = series.chart,
			options = series.options,
			isStacked = !!options.stacking,
			rawData = options.data,
			xExtremes = series.xAxis.getExtremes(),
			xMin = xExtremes.min,
			xMax = xExtremes.max,
			yExtremes = series.yAxis.getExtremes(),
			yMin = yExtremes.min,
			yMax = yExtremes.max,
			xData = series.xData || options.xData || series.processedXData,
			yData = series.yData || options.yData || series.processedYData,
			zData = series.zData || options.zData || series.processedZData,
			useRaw = !xData || xData.length === 0,			
			points = series.points || false,
			colorIndex = 0,
			lastX = false,
			//colorByPoint = series.options.colorByPoint,
			minVal,
			caxis,
			color,
			scolor,
			sdata = isStacked ? series.data : (xData || rawData),
			connectNulls = options.connectNulls,			
			maxVal;

		if (options.boostData && options.boostData.length > 0) {
			console.log('using padded data');
			return;
		}

		// Push color to color buffer - need to do this per. vertex
		function pushColor(color) {
			if (color) {
				inst.colorData.push(color[0]);
				inst.colorData.push(color[1]);
				inst.colorData.push(color[2]);
				inst.colorData.push(color[3]);
			}				
		}

		//Push a vertice to the data buffer
		function vertice(x, y, checkTreshold, pointSize, color) {
			pushColor(color);	
			if (settings.usePreallocated) {
				vbuffer.push(x, y, checkTreshold ? 1 : 0, pointSize || 1);						
			} else {
				data.push(x);
				data.push(y);
				data.push(checkTreshold ? 1 : 0);
				data.push(pointSize || 1);				
			}
		}

		// Push a rectangle to the data buffer
		function pushRect(x, y, w, h, color) {
			pushColor(color);
			vertice(x + w, y);
			pushColor(color);
			vertice(x, y);
			pushColor(color);
			vertice(x, y + h);

			pushColor(color);
			vertice(x, y + h);
			pushColor(color);
			vertice(x + w, y + h);	
			pushColor(color);
			vertice(x + w, y);
		}

		// Special case for point shapes
		if (points && points.length > 0) {			
			
			// If we're doing points, we assume that the points are already
			// translated, so we skip the shader translation.
			inst.skipTranslation = true;
			// Force triangle draw mode
			inst.drawMode = 'triangles';

			// We don't have a z component in the shader, so we need to sort.
			if (points[0].node && points[0].node.levelDynamic) {				
				points.sort(function (a, b) {
					if (a.node) {
						if (a.node.levelDynamic > b.node.levelDynamic) {
							return 1;
						} else if (a.node.levelDynamic < b.node.levelDynamic) {
							return -1;
						}
					}
					return 0;
				});
			}
			
			each(points, function (point) {
				var plotY = point.plotY,
					shapeArgs,
					swidth,
					dstyle,
					pointAttr;

				if (plotY !== undefined && !isNaN(plotY) && point.y !== null) {
					shapeArgs = point.shapeArgs;
					pointAttr = (point.pointAttr && point.pointAttr['']) || 
								point.series.pointAttribs(point),
					swidth = pointAttr['stroke-width'];

					// Handle point colors
					color = toRGBAFast(pointAttr.fill);
					color[0] /= 255.0;
					color[1] /= 255.0;
					color[2] /= 255.0;
					
					// So there are two ways of doing this. Either we can
					// create a rectangle of two triangles, or we can do a 
					// point and use point size. Latter is faster, but 
					// only supports squares. So we're doing triangles.
					// We could also use one color per. vertice to get 
					// color interpolation.
			
					// If there's stroking, we do an additional rect
					//if (pointAttr.stroke !== 'none' && swidth && swidth > 0) {
					if (series.type === 'treemap') {
						swidth = swidth || 1;
						scolor = toRGBAFast(pointAttr.stroke); 

						scolor[0] /= 255.0;
						scolor[1] /= 255.0;
						scolor[2] /= 255.0;

						pushRect(
							shapeArgs.x, 
							shapeArgs.y, 
							shapeArgs.width, 
							shapeArgs.height,
							scolor
						);
					
						swidth /= 2;
					}
					// } else {
					// 	swidth = 0;
					// }

					pushRect(
						shapeArgs.x + swidth, 
						shapeArgs.y + swidth, 
						shapeArgs.width - (swidth * 2), 
						shapeArgs.height - (swidth * 2),
						color
					);
				}
			});

			return;
		}

		// Extract color axis
		each(chart.axes || [], function (a) {
			if (H.ColorAxis && a instanceof H.ColorAxis) {
				caxis = a;
			}
		});	

		each(sdata, function (d, i) {
			var x,
				y,
				z,
				px = false,
				nx = false,
				//clientX,
				//plotY,
				//isNull,
				low,
				chartDestroyed = typeof chart.index === 'undefined',
				nextInside = false,
				prevInside = false,
				pcolor = false,
				drawAsBar = asBar[series.type],
				isYInside = true;

			if (chartDestroyed) {
				return false;
			}

			// if (colorByPoint) {
			// 	colorIndex = ++colorIndex % series.chart.options.colors.length;
			// 	pcolor = toRGBAFast(series.chart.options.colors[colorIndex]);
			// 	pcolor[0] /= 255.0;
			// 	pcolor[1] /= 255.0;
			// 	pcolor[2] /= 255.0;
			// }

			if (useRaw) {
				x = d[0];
				y = d[1];

				if (data[i + 1]) {
					nx = data[i + 1][0];
				}

				if (data[i - 1]) {
					px = data[i - 1][0];
				}

				if (d.length >= 3) {
					z = d[2];

					if (d[2] > inst.zMax) {
						inst.zMax = d[2];
					}

					if (d[2] < inst.zMin) {
						inst.zMin = d[2];
					}
				}
			
			} else {
				x = d;
				y = yData[i];

				if (data[i + 1]) {
					nx = data[i + 1];
				}

				if (data[i - 1]) {
					px = data[i - 1];
				}

				if (zData && zData.length) {
					z = zData[i];
				
					if (zData[i] > inst.zMax) {
						inst.zMax = zData[i];
					} 

					if (zData[i] < inst.zMin) {
						inst.zMin = zData[i];
					}					
				}
			}

			if (nx && nx >= xMin && nx <= xMax) {
				nextInside = true;
			}

			if (px && px >= xMin && px <= xMax) {
				prevInside = true;
			}

			if (isRange) {
				if (useRaw) {
					y = d.slice(1, 3);
				}

				low = y[0];
				y = y[1];
			
			} else if (isStacked) {
				x = d.x;
				y = d.stackY;
				low = y - d.y;
			}				
			
			if (!series.requireSorting) {
				isYInside = y >= yMin && y <= yMax;
			}

			if (!y || !isYInside) {
				return;
			}

			if ((x < xMin || x > xMax) && !nextInside && !prevInside) {
				return;
			}

			// Skip translations - temporary floating point fix
			if (!settings.useGPUTranslations) {
				inst.skipTranslation = true;
				x = series.xAxis.toPixels(x, true);
				y = series.yAxis.toPixels(y, true);				
			}

			if (drawAsBar) {
				
				maxVal = y;
				minVal = 0;

				if (y < 0) {
					minVal = y;
					y = 0;
				}
			
				if (!settings.useGPUTranslations) {
					minVal = series.yAxis.toPixels(minVal, true);					
				}

				// Need to add an extra point here
				vertice(x, minVal, 0, 0, pcolor);
			}

			vertice(x, y, 0, series.type === 'bubble' ? (z || 1) : 2, pcolor);

			// if (caxis) {				
			// 	color = H.color(caxis.toColor(y)).rgba;

			// 	inst.colorData.push(color[0] / 255.0);
			// 	inst.colorData.push(color[1] / 255.0);
			// 	inst.colorData.push(color[2] / 255.0);
			// 	inst.colorData.push(color[3]);
			// }

			// if (drawAsBar) {
			// 	// Need to add an extra point here				
			// //	vertice(x, minVal, 0, 0, pcolor);
			// }

			// if (lastX === x) {
			// 	console.error('duplicate x data', x);
			// }

			// lastX = x;

			return true;
		});		
	}

	/*
	 * Push a series to the renderer
	 * If we render the series immediatly, we don't have to loop later
	 * @param s {Highchart.Series} - the series to push
	 */
	function pushSeries(s) {
		if (series.length > 0) {
			series[series.length - 1].to = data.length;
		}

		if (settings.timeSeriesProcessing) {
			console.time('building ' + s.type + ' series');			
		}

		series.push({
			from: data.length,
			// Push RGBA values to this array to use per. point coloring.
			// It should be 0-padded, so each component should be pushed in
			// succession.
			colorData: [],
			series: s,
			zMin: Number.MAX_VALUE,
			zMax: -Number.MAX_VALUE,
			drawMode: ({
				'area': 'lines',
				'arearange': 'lines',
				'areaspline': 'line_strip',
				'column': 'lines',
				'line': 'line_strip',
				'scatter': 'points',
				'heatmap': 'triangles',
				'treemap': 'triangles',
				'bubble': 'points'				
			})[s.type] || 'line_strip'
		});

		// Add the series data to our buffer(s)
		pushSeriesData(s, series[series.length - 1]);

		if (settings.timeSeriesProcessing) {
			console.timeEnd('building ' + s.type + ' series');			
		}
	}

	/*
	 * Flush the renderer.
	 * This removes pushed series and vertices.
	 * Should be called after clearing and before rendering
	 */
	function flush() {
		series = [];
		exports.data = data = [];
	}

	/*
	 * Pass x-axis to shader
	 * @param axis {Highcharts.Axis} - the x-axis
	 */
	function setXAxis(axis) {
		if (!shader) {
			return;
		}

		shader.setUniform('xAxisTrans', axis.transA);
		shader.setUniform('xAxisMin', axis.min);
		shader.setUniform('xAxisMinPad', axis.minPixelPadding);
		shader.setUniform('xAxisPointRange', axis.pointRange);
		shader.setUniform('xAxisLen', axis.len);
		shader.setUniform('xAxisPos', axis.pos);
		shader.setUniform('xAxisCVSCoord', !axis.horiz);
	}

	/*
	 * Pass y-axis to shader
	 * @param axis {Highcharts.Axis} - the y-axis
	 */
	function setYAxis(axis) {
		if (!shader) {
			return;
		}

		shader.setUniform('yAxisTrans', axis.transA);
		shader.setUniform('yAxisMin', axis.min);
		shader.setUniform('yAxisMinPad', axis.minPixelPadding);
		shader.setUniform('yAxisPointRange', axis.pointRange);
		shader.setUniform('yAxisLen', axis.len);
		shader.setUniform('yAxisPos', axis.pos);
		shader.setUniform('yAxisCVSCoord', !axis.horiz);
	}

	/* 
	 * Set the translation threshold
	 * @param has {boolean} - has threshold flag
	 * @param translation {Float} - the threshold
	 */
	function setThreshold(has, translation) {
		shader.setUniform('hasThreshold', has);
		shader.setUniform('translatedThreshold', translation);
	}

	/* 
	 * Render the data 
	 * This renders all pushed series.
	 */
	function render() {
		if (!gl || !width || !height) {
			return false;
		}		

		shader.bind();

		shader.setUniform('width', width);
		shader.setUniform('height', height);

		gl.lineWidth(settings.lineWidth);

		// Build a single buffer for all series
		vbuffer.build(exports.data, 'aVertexPosition', 4);
		vbuffer.bind();

		gl.bindTexture(gl.TEXTURE_2D, circleTextureHandle);
		shader.setTexture(circleTextureHandle);

		// Render the series
		each(series, function (s, si) {
			var options = s.series.options,
				threshold = options.threshold,
				hasThreshold = isNumber(threshold),
				yBottom = s.series.yAxis.getThreshold(threshold),
				translatedThreshold = yBottom,
				cbuffer,
				fillColor = s.series.fillOpacity ?
					new Color(s.series.color).setOpacity(
								pick(options.fillOpacity, 0.85)
							).get() :
					s.series.color,
				color;			

			if (options.colorByPoint) {
				fillColor = s.series.chart.options.colors[si ];
			}

			color = toRGBAFast(fillColor);

			if (!settings.useAlpha) {
				color[3] = 1.0;
			}

			//Blending
			if (options.boostBlending === 'add') {
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
				gl.blendEquation(gl.FUNC_ADD);

			} else if (options.boostBlending === 'mult') {
				gl.blendFunc(gl.DST_COLOR, gl.ZERO);
			
			} else if (options.boostBlending === 'darken') {
				gl.blendFunc(gl.ONE, gl.ONE);
				gl.blendEquation(gl.FUNC_MIN);
			
			} else {
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);//, gl.ONE, gl.ZERO);
				gl.blendEquation(gl.FUNC_ADD);
			}

			shader.reset();

			// If there are entries in the colorData buffer, build and bind it.
			if (s.colorData.length > 0) {
				shader.setUniform('hasColor', 1.0);
				cbuffer = GLVertexBuffer(gl, shader);
				cbuffer.build(s.colorData, 'aColor', 4);
				cbuffer.bind();
			}

			// Set series specific uniforms
			shader.setColor(color);
			setXAxis(s.series.xAxis);
			setYAxis(s.series.yAxis);
			setThreshold(hasThreshold, translatedThreshold);

			if (s.drawMode === 'points') {
				if (options.marker && options.marker.radius) {
					shader.setPointSize(options.marker.radius * 2.0);
				} else {
					shader.setPointSize(1);
				}				
			}

			// If set to true, the toPixels translations in the shader
			// is skipped, i.e it's assumed that the value is a pixel coord.
			shader.setSkipTranslation(s.skipTranslation);		
			
			if (s.series.type === 'bubble') {
				shader.setBubbleUniforms(s.series, s.zMin, s.zMax);
			} 

			shader.setDrawAsCircle(asCircle[s.series.type] || false);

			// Do the actual rendering
			vbuffer.render(s.from, s.to, s.drawMode);
		});
	}
	
	/* 
	 * Set the viewport size in pixels
	 * Creates an orthographic perspective matrix and applies it.
	 * @param w {Integer} - the width of the viewport
	 * @param h {Integer} - the height of the viewport
	 */
	function setSize(w, h) {
		// Skip if there's no change
		if (width === w && h === h) {
			return;
		}

		console.log('setting size', w, h);
		width = w;
		height = h;
		shader.bind();
		shader.setPMatrix(orthoMatrix(width, height));
	}
	
	/* 
	 * Init OpenGL 
	 * @param canvas {HTMLCanvas} - the canvas to render to
	 */
	function init(canvas) {
		if (!canvas) {
			//console.err('no valid canvas - unable to init webgl');
			return false;
		}

		console.time('gl setup');

		gl = canvas.getContext('webgl');

		if (!gl) {
			// Try again with an experimental context
			gl = canvas.getContext('experimental-webgl');
		}

		if (gl) {        	
			flush();
		} else {
			return false;
		}

		gl.enable(gl.BLEND);
		//gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.disable(gl.DEPTH_TEST);
		gl.depthMask(gl.FALSE);

		shader = GLShader(gl);		
		vbuffer = GLVertexBuffer(gl, shader);

		setSize(canvas.width, canvas.height);

		// Set up the circle texture used for bubbles
		circleTextureHandle = gl.createTexture();
		
		if (circleTextureHandle) {			
			gl.bindTexture(gl.TEXTURE_2D, circleTextureHandle);

			gl.texImage2D(
				gl.TEXTURE_2D, 
				0, 
				gl.RGBA, 
				gl.RGBA, 
				gl.UNSIGNED_BYTE, 
				circleTexture
			);
			
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.generateMipmap(gl.TEXTURE_2D);

			gl.bindTexture(gl.TEXTURE_2D, null);
		}

		isInited = true;

		console.timeEnd('gl setup');

		return true;
	}

	/* 
	 * Check if we have a valid OGL context 
	 * @returns {Boolean} - true if the context is valid
	 */
	function valid() {
		return gl !== false;
	}

	/*
	 * Check if the renderer has been initialized
	 * @returns {Boolean} - true if it has, false if not
	 */
	function inited() {
		return isInited;
	}

	////////////////////////////////////////////////////////////////////////////
	exports = {
		allocateBufferForSingleSeries: allocateBufferForSingleSeries,
		pushSeries: pushSeries,
		setSize: setSize,
		inited: inited,
		setThreshold: setThreshold,
		init: init,
		render: render,
		settings: settings,
		valid: valid,
		clear: clear,
		flush: flush,
		setXAxis: setXAxis,
		setYAxis: setYAxis,
		data: data,
		gl: getGL,
		allocateBuffer: allocateBuffer
	};

	return exports;
}  

// END OF WEBGL ABSTRACTIONS
////////////////////////////////////////////////////////////////////////////////



/* 
 * Create a canvas + context and attach it to the target
 * @param target {Highcharts.Chart|Highcharts.Series} - the canvas target
 * @param chart {Highcharts.Chart} - the chart
 */
function createAndAttachRenderer(chart, series) {
	var width = chart.chartWidth,
		height = chart.chartHeight,
		target = chart,
		targetGroup = chart.seriesGroup || series.group,
		swapXY = function (proceed, x, y, a, b, c, d) {
			proceed.call(series, y, x, a, b, c, d);
		};

	if (isChartSeriesBoosting(chart)) {
		target = chart;		
	} else {
		target = series;		
	}

	if (!target.canvas) {		
		target.canvas = doc.createElement('canvas');

		target.image = chart.renderer.image(
			'', 
			0, 
			0, 
			width, 
			height
		).add(targetGroup);

		// target.boostClipRect = chart.renderer.clipRect(
		// 	chart.plotLeft,
		// 	chart.plotTop,
		// 	chart.plotWidth,
		// 	chart.chartHeight
		// );

		//target.image.clip(target.boostClipRect);

		if (target.inverted) {
			each(['moveTo', 'lineTo', 'rect', 'arc'], function (fn) {
				wrap(false, fn, swapXY);
			});
		}

		if (target instanceof H.Chart) {
			target.markerGroup = target.renderer.g().add(targetGroup);

			target.markerGroup.translateX = series.xAxis.pos;
			target.markerGroup.translateY = series.yAxis.pos;
			target.markerGroup.updateTransform();
		}
	}
	
	target.canvas.width = width;
	target.canvas.height = height;					
	
	if (!target.ogl) {
		target.ogl = GLRenderer();
		target.ogl.init(target.canvas);
		target.ogl.clear();

		if (target instanceof H.Chart) {
			target.ogl.allocateBuffer(chart);
		}
	}

	target.image.attr({
		x: 0,
		y: 0,
		width: width,
		height: height,
		style: 'pointer-events: none'
	});

	// target.boostClipRect.attr({
	// 	x: chart.plotLeft,
	// 	y: chart.plotTop,
	// 	width: chart.plotWidth,
	// 	height: chart.chartHeight
	// });

	//target.image.clip(target.boostClipRect);

	//console.log('renderer initied', width, height);
	target.ogl.setSize(width, height);

	return target.ogl;
}

/*
 * Performs the actual render if the renderer is 
 * attached to the series.
 * @param renderer {OGLRenderer} - the renderer
 * @param series {Highcharts.Series} - the series
 */
function renderIfNotSeriesBoosting(renderer, series) {
	if (renderer && 
		series.image && 
		series.canvas && 
		!isChartSeriesBoosting(series.chart)
	) {
		renderer.clear();		
		console.time('gl rendering');
		renderer.render();
		console.timeEnd('gl rendering');
		renderer.flush();

		series.image.attr({
			href: series.canvas.toDataURL('image/png')
		});

		renderer.clear();
	}
}

function allocateIfNotSeriesBoosting(renderer, series) {
	if (renderer && 
		series.image && 
		series.canvas && 
		!isChartSeriesBoosting(series.chart)
	) {
		renderer.allocateBufferForSingleSeries(series);
	}
}

/*
 * An "async" foreach loop.
 * Uses a setTimeout to keep the loop from blocking the UI thread
 * @param arr {Array} - the array to loop through
 * @param fn {Function} - the callback to call for each item
 * @param finalFunc {Function} - the callback to call when done
 * @param chunkSize {Number} - the number of iterations per. timeout
 * @param i {Number} - the current index
 * @param noTimeout {Boolean} - set to true to skip timeouts 
 */
function eachAsync(arr, fn, finalFunc, chunkSize, i, noTimeout) {
	i = i || 0;
	chunkSize = chunkSize || CHUNK_SIZE;
	
	var threshold = i + chunkSize,
		proceed = true;

	while (proceed && i < threshold && i < arr.length) {
		proceed = fn(arr[i], i);
		++i;
	}
	if (proceed) {
		if (i < arr.length) {

			if (noTimeout) {
				eachAsync(arr, fn, finalFunc, chunkSize, i, noTimeout);
			} else if (win.requestAnimationFrame) {
				//If available, do requestAnimationFrame - shaves off a few ms 
				win.requestAnimationFrame(function () {
					eachAsync(arr, fn, finalFunc, chunkSize, i);
				});
			} else {
				setTimeout(function () {
					eachAsync(arr, fn, finalFunc, chunkSize, i);
				});
			}
			
		} else if (finalFunc) {
			finalFunc();
		}
	}
}

// Set default options
each([
	'area', 
	'arearange', 
	'column', 
	'line', 
	'scatter', 
	'heatmap', 
	'bubble',
	'treemap',
	'heatmap'
], 
	function (type) {
		if (plotOptions[type]) {
			plotOptions[type].boostThreshold = 5000;
			plotOptions[type].boostData = [];
		}
	}
);

/**
 * Override a bunch of methods the same way. If the number of points is 
 * below the threshold, run the original method. If not, check for a 
 * canvas version or do nothing.
 *
 * Note that we're not overriding any of these for heatmaps.
 */
each([	
	'translate',
	'generatePoints',
	'drawTracker',
	'drawPoints',
	'render'	
], function (method) {
	function branch(proceed) {
		var letItPass = this.options.stacking && 
						(method === 'translate' || method === 'generatePoints');
		
		if (!isSeriesBoosting(this) || 
			letItPass || 
			this.type === 'heatmap' ||
			this.type === 'treemap'
		) {

			// Clear image
			if (method === 'render' && this.image) {
				this.image.attr({ href: '' });
				this.animate = null; // We're zooming in, don't run animation
			}

			proceed.call(this);

		// If a canvas version of the method exists, like renderCanvas(), run
		} else if (this[method + 'Canvas']) {
			this[method + 'Canvas']();
		}
	}

	wrap(Series.prototype, method, branch);

	// A special case for some types - their translate method is already wrapped
	if (method === 'translate') {
		if (seriesTypes.column) {
			wrap(seriesTypes.column.prototype, method, branch);
		}

		if (seriesTypes.arearange) {
			wrap(seriesTypes.arearange.prototype, method, branch);
		}	

		if (seriesTypes.treemap) {
			wrap(seriesTypes.treemap.prototype, method, branch);
		}	
	}
});

/**
 * Do not compute extremes when min and max are set.
 * If we use this in the core, we can add the hook 
 * to hasExtremes to the methods directly.
 */
wrap(Series.prototype, 'getExtremes', function (proceed) {
	if (!isSeriesBoosting(this) || !this.hasExtremes()) {
		return proceed.apply(this, Array.prototype.slice.call(arguments, 1));
	}
});

/** If the series is a heatmap or treemap, or if the series is not boosting
 *  do the default behaviour. Otherwise, process if the series has no 
 *  extremes.
 */
wrap(Series.prototype, 'processData', function (proceed) {
	// If this is a heatmap, do default behaviour
	if (!isSeriesBoosting(this) || 
		this.type === 'heatmap' || 
		this.type === 'treemap') {
		proceed.apply(this, Array.prototype.slice.call(arguments, 1));		
	}

	if (!this.hasExtremes || !this.hasExtremes(true)) {
		proceed.apply(this, Array.prototype.slice.call(arguments, 1));
	}
});

H.extend(Series.prototype, {
	pointRange: 0,
	directTouch: false,
	allowDG: false, // No data grouping, let boost handle large data 
	hasExtremes: function (checkX) {
		var options = this.options,
			data = options.data,
			xAxis = this.xAxis && this.xAxis.options,
			yAxis = this.yAxis && this.yAxis.options;
		
		return 	data.length > (options.boostThreshold || Number.MAX_VALUE) && 
				isNumber(yAxis.min) && isNumber(yAxis.max) &&
				(!checkX || (isNumber(xAxis.min) && isNumber(xAxis.max)));
	},

	/**
	 * If implemented in the core, parts of this can probably be 
	 * shared with other similar methods in Highcharts.
	 */
	destroyGraphics: function () {
		var series = this,
			points = this.points,
			point,
			i;

		if (points) {
			for (i = 0; i < points.length; i = i + 1) {
				point = points[i];
				if (point && point.graphic) {
					point.graphic = point.graphic.destroy();
				}
			}
		}

		each(['graph', 'area', 'tracker'], function (prop) {
			if (series[prop]) {
				series[prop] = series[prop].destroy();
			}
		});
	},

	renderCanvas: function () {
		var series = this,
			options = series.options,
			renderer = false,
			chart = series.chart,
			xAxis = this.xAxis,
			yAxis = this.yAxis,
			//ctx,
			//c = 0,
			xData = options.xData || series.processedXData,
			yData = options.yData || series.processedYData,

			rawData = options.data,
			xExtremes = xAxis.getExtremes(),
			xMin = xExtremes.min,
			xMax = xExtremes.max,
			yExtremes = yAxis.getExtremes(),
			yMin = yExtremes.min,
			yMax = yExtremes.max,
			pointTaken = {},
			lastClientX,
			sampling = !!series.sampling,
			points,
			//r = options.marker && options.marker.radius,
			//cvsDrawPoint = this.cvsDrawPoint,
			//cvsLineTo = options.lineWidth ? this.cvsLineTo : false,
		//	cvsMarker = r <= 1 ? this.cvsMarkerSquare : this.cvsMarkerCircle,
			enableMouseTracking = options.enableMouseTracking !== false,
		//	lastPoint,
			threshold = options.threshold,
			yBottom = yAxis.getThreshold(threshold),
			hasThreshold = isNumber(threshold),
			translatedThreshold = yBottom,
			doFill = this.fill,
			isRange = series.pointArrayMap && 
					series.pointArrayMap.join(',') === 'low,high',
			isStacked = !!options.stacking,
			cropStart = series.cropStart || 0,
			//loadingOptions = chart.options.loading,
			requireSorting = series.requireSorting,
			wasNull,
			connectNulls = options.connectNulls,
			useRaw = !xData,
			minVal,
			maxVal,
			minI,
			maxI,			
			fillColor = series.fillOpacity ?
					new Color(series.color).setOpacity(
							pick(options.fillOpacity, 0.75)
						).get() : series.color,

			addKDPoint = function (clientX, plotY, i) {
				//Shaves off about 60ms compared to repeated concatination
				index = clientX + ',' + plotY;

				// The k-d tree requires series points. 
				// Reduce the amount of points, since the time to build the 
				// tree increases exponentially.
				if (enableMouseTracking && !pointTaken[index]) {
					pointTaken[index] = true;

					if (chart.inverted) {
						clientX = xAxis.len - clientX;
						plotY = yAxis.len - plotY;
					}

					points.push({
						clientX: clientX, 
						plotX: clientX,
						plotY: plotY,
						i: cropStart + i
					});
				}
			};			

		// Get or create the renderer
		renderer = createAndAttachRenderer(chart, series);

		if (!this.visible) {
			if (!isChartSeriesBoosting(chart) && renderer) {
				renderer.clear();
			}
			return;
		}

		// If we are zooming out from SVG mode, destroy the graphics
		if (this.points || this.graph) {
			this.destroyGraphics();
		}

		// If we're rendering per. series we should create the marker groups
		// as usual.
		if (!isChartSeriesBoosting(chart)) {
			this.markerGroup = series.plotGroup(
				'markerGroup',
				'markers',
				true,
				1,
				chart.seriesGroup
			);
		} else {
			//Use a single group for the markers
			this.markerGroup = chart.markerGroup;			
		}			

		points = this.points = [];			

		// Do not start building while drawing 
		series.buildKDTree = noop; 
		
		if (renderer) {
			allocateIfNotSeriesBoosting(renderer, this);
			renderer.pushSeries(series);				
			// Perform the actual renderer if we're on series level
			renderIfNotSeriesBoosting(renderer, this);
		}

		/* This builds the KD-tree */
		function processPoint(d, i) {
			var x,
				y,
				clientX,
				plotY,
				isNull,
				low,
				chartDestroyed = typeof chart.index === 'undefined',
				isYInside = true;

			if (!chartDestroyed) {
				if (useRaw) {
					x = d[0];
					y = d[1];
				} else {
					x = d;
					y = yData[i];
				}

				// Resolve low and high for range series
				if (isRange) {
					if (useRaw) {
						y = d.slice(1, 3);
					}
					low = y[0];
					y = y[1];
				} else if (isStacked) {
					x = d.x;
					y = d.stackY;
					low = y - d.y;
				}

				isNull = y === null;

				// Optimize for scatter zooming
				if (!requireSorting) {
					isYInside = y >= yMin && y <= yMax;
				}

				if (!isNull && x >= xMin && x <= xMax && isYInside) {

					// We use ceil to allow the KD tree to work with sub pixels,
					// which can be used in boost to space pixels
					clientX = Math.ceil(xAxis.toPixels(x, true));

					if (sampling) {
						if (minI === undefined || clientX === lastClientX) {
							if (!isRange) {
								low = y;
							}
							if (maxI === undefined || y > maxVal) {
								maxVal = y;
								maxI = i;
							}
							if (minI === undefined || low < minVal) {
								minVal = low;
								minI = i;
							}

						}
						if (clientX !== lastClientX) { // Add points and reset
							if (minI !== undefined) { // then maxI is also a number
								plotY = yAxis.toPixels(maxVal, true);
								yBottom = yAxis.toPixels(minVal, true);

								addKDPoint(clientX, plotY, maxI);
								if (yBottom !== plotY) {
									addKDPoint(clientX, yBottom, minI);
								}
							}

							minI = maxI = undefined;
							lastClientX = clientX;
						}
					} else {
						plotY = Math.ceil(yAxis.toPixels(y, true));						
						addKDPoint(clientX, plotY, i);
					}
				}
				wasNull = isNull && !connectNulls;
			}

			return !chartDestroyed;
		}

		function doneProcessing() {
			fireEvent(series, 'renderedCanvas');
			// Pass tests in Pointer. 
			// Replace this with a single property, and replace when zooming in
			// below boostThreshold.
			series.directTouch = false;
			series.options.stickyTracking = true;

			delete series.buildKDTree; // Go back to prototype, ready to build
			series.buildKDTree();
		}

		// Loop over the points to build the k-d tree
		eachAsync(
			isStacked ? series.data : (xData || rawData), 
			processPoint, 
			doneProcessing, 
			chart.renderer.forExport ? Number.MAX_VALUE : undefined
		);
	}
});

/* Used for treemap|heatmap.drawPoints */
function pointDrawHandler(proceed) {
	if (!isSeriesBoosting(this)) {
		return proceed.call(this);
	}

	//Make sure we have a valid OGL context
	var renderer = createAndAttachRenderer(this.chart, this);
	
	if (renderer) {
		allocateIfNotSeriesBoosting(renderer, this);
		renderer.pushSeries(this);				
	}		
	
	renderIfNotSeriesBoosting(renderer, this);
}

/*
 * We need to handle heatmaps separatly, since we can't perform the size/color
 * calculations in the shader easily.
 *
 * This likely needs future optimization.
 *
 */
if (seriesTypes.heatmap) {	
	wrap(seriesTypes.heatmap.prototype, 'drawPoints', pointDrawHandler);
	seriesTypes.heatmap.prototype.directTouch = false; // Use k-d-tree
}

if (seriesTypes.treemap) {
	wrap(seriesTypes.treemap.prototype, 'drawPoints', pointDrawHandler);
	seriesTypes.treemap.prototype.directTouch = false; // Use k-d-tree
}

if (seriesTypes.bubble) {
	// By default, the bubble series does not use the KD-tree, so force it to.
	delete seriesTypes.bubble.prototype.buildKDTree;
	seriesTypes.bubble.prototype.directTouch = false;
	
	// Needed for markers to work correctly
	wrap(seriesTypes.bubble.prototype, 'markerAttribs', function (proceed) {
		if (isSeriesBoosting(this)) {
			return false;
		}
		return proceed.apply(this, [].slice.call(arguments, 1));
	});
}

seriesTypes.scatter.prototype.fill = true;

extend(seriesTypes.area.prototype, {	
	fill: true,
	fillOpacity: true,
	sampling: true
});

extend(seriesTypes.column.prototype, {
	fill: true,
	sampling: true
});

/**
 * Return a full Point object based on the index. 
 * The boost module uses stripped point objects for performance reasons.
 * @param   {Number} boostPoint A stripped-down point object
 * @returns {Object} A Point object as per http://api.highcharts.com/highcharts#Point
 */
Series.prototype.getPoint = function (boostPoint) {
	var point = boostPoint,
		xData = this.xData || this.options.xData || this.processedXData || false
	;

	if (boostPoint && !(boostPoint instanceof this.pointClass)) {
		point = (new this.pointClass()).init( // eslint-disable-line new-cap
					this, 
					this.options.data[boostPoint.i], 
					xData ? xData[boostPoint.i] : undefined
				); 

		point.category = point.x;

		point.dist = boostPoint.dist;
		point.distX = boostPoint.distX;
		point.plotX = boostPoint.plotX;
		point.plotY = boostPoint.plotY;
	}	

	return point;
};

wrap(Series.prototype, 'setVisible', function (proceed, vis, redraw) {
	//if (isSeriesBoosting(this) || isChartSeriesBoosting(this.chart)) {
		
		proceed.call(this, vis, false);

		if (this.ogl) {
			this.ogl.clear();
			this.ogl.flush();

			this.image.attr({
				href: ''
			});
		} else if (this.chart.ogl) {
			this.chart.ogl.flush();
			this.chart.ogl.clear();

			this.chart.image.attr({
				href: ''
			});

		}
		
		this.chart.redraw();

	// } else {		
	// 	proceed.call(this, vis, redraw);
	// }
});

/**
 * Extend series.destroy to also remove the fake k-d-tree points (#5137). 
 * Normally this is handled by Series.destroy that calls Point.destroy, 
 * but the fake search points are not registered like that.
 */
wrap(Series.prototype, 'destroy', function (proceed) {
	var series = this,
		chart = series.chart;

	if (chart.hoverPoints) {
		chart.hoverPoints = grep(chart.hoverPoints, function (point) {
			return point.series === series;
		});
	}

	if (chart.hoverPoint && chart.hoverPoint.series === series) {
		chart.hoverPoint = null;
	}

	proceed.call(this);
});

/**
 * Return a point instance from the k-d-tree
 */
wrap(Series.prototype, 'searchPoint', function (proceed) {
	return this.getPoint(
		proceed.apply(this, [].slice.call(arguments, 1))
	);
});

/**
 * Take care of the canvas blitting
 */
H.Chart.prototype.callbacks.push(function (chart) {

	/* Convert chart-level canvas to image */
	function canvasToSVG() {			
		if (chart.ogl && isChartSeriesBoosting(chart)) {

			console.time('gl rendering');			
			chart.ogl.render();		
			console.timeEnd('gl rendering');

			if (chart.image && chart.canvas) {
				chart.image.attr({ 
					href: chart.canvas.toDataURL('image/png') 
				});			
			}
		}
	}

	/* Clear chart-level canvas */
	function preRender() {
		if (chart.canvas && chart.ogl && isChartSeriesBoosting(chart)) {

			chart.image.attr({
				href: ''
			});

			// Clear the series and vertice data.			
			chart.ogl.flush();
			// Clear ogl canvas
			chart.ogl.clear();
			// Allocate
			chart.ogl.allocateBuffer(chart);
		}
	}

	addEvent(chart, 'predraw', preRender);
	//Blit to image when done redrawing
	addEvent(chart, 'render', canvasToSVG);
	//Handles the blitting on first render
	addEvent(chart, 'load', canvasToSVG);
});
