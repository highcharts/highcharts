/**
 * License: www.highcharts.com/license
 * Author: Christer Vasseng, Torstein Honsi
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
 * - Chart callback should be async after last series is drawn. (But not necessarily, we don't do
	 that with initial series animation).
 *
 * If this module is taken in as part of the core
 * - All the loading logic should be merged with core. Update styles in the core.
 * - Most of the method wraps should probably be added directly in parent methods.
 *
 * Notes for boost mode
 * - Area lines are not drawn
 * - Lines are not drawn on scatter charts
 * - Zones and negativeColor don't work
 * - Columns are always one pixel wide. Don't set the threshold too low.
 * - Disable animations
 * - Marker shapes are not supported: markers will always be circles
 *
 * Optimizing tips for users
 * - Set extremes (min, max) explicitly on the axes in order for Highcharts to avoid computing extremes.
 * - Set enableMouseTracking to false on the series to improve total rendering time.
 * - The default threshold is set based on one series. If you have multiple, dense series, the combined
 *   number of points drawn gets higher, and you may want to set the threshold lower in order to 
 *   use optimizations.
 * - If drawing large scatter charts, it's beneficial to set the marker radius to a value
 *   less than 1. This is to add additional spacing to make the chart more readable.
 * - If the value increments on both the X and Y axis aren't small, consider setting
 *	 useGPUTranslations to true on the boost settings object. If you do this and
 *	 the increments are small (e.g. datetime axis with small time increments)
 *	 it may cause rendering issues due to floating point rounding errors,
 *	 so your millage may vary.
 *
 * Settings
 *	There are two ways of setting the boost threshold:
 *	- Per. series: boost based on number of points in individual series
 *	- Per. chart: boost based on the number of series 
 *
 *  To set the series boost threshold, set seriesBoostThreshold on the chart object.
 *  To set the series-specific threshold, set boostThreshold on the series object.
 * 
 *  In addition, the following can be set in the boost object:
 *  {
 *  	//Wether or not to use alpha blending
 *  	useAlpha: boolean - default: true
 *  	//Set to true to perform translations on the GPU.
 *  	//Much faster, but may cause rendering issues
 *  	//when using values far from 0 due to floating point
 *  	//rounding issues
 *  	useGPUTranslations: boolean - default: false
 *  	//Use pre-allocated buffers, much faster,
 *  	//but may cause rendering issues with some data sets
 *  	usePreallocated: boolean - default: false
 *  	//Output rendering time in console
 *  	timeRendering: boolean - default: false
 *  	//Output processing time in console
 *  	timeSeriesProcessing: boolean - default: false
 *  	//Output setup time in console
 *  	timeSetup: boolean - default: false
 *  }
 */

 /**
  * Set the series threshold for when the boost should kick in globally.
  *
  * Setting to e.g. 20 will cause the whole chart to enter boost mode
  * if there are 20 or more series active. When the chart is in boost mode,
  * every series in it will be rendered to a common canvas. This offers 
  * a significant speed improvment in charts with a very high
  * amount of series.
  *  
  * Note: only available when including the boost module.
  *
  * @default  null
  * @apioption boost.seriesThreshold
  */
 
 /**
  * Set the point threshold for when a series should enter boost mode.
  *
  * Setting it to e.g. 2000 will cause the series to enter boost mode
  * when there are 2000 or more points in the series.
  *
  * Note: only available when including the boost module.
  *
  * @default  5000
  * @apioption series.boostThreshold
  */

 /* global Float32Array */

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
	seriesTypes = H.seriesTypes,
	each = H.each,
	extend = H.extend,
	addEvent = H.addEvent,
	fireEvent = H.fireEvent,
	grep = H.grep,
	isNumber = H.isNumber,
	merge = H.merge,
	pick = H.pick,
	wrap = H.wrap,
	plotOptions = H.getOptions().plotOptions,
	CHUNK_SIZE = 50000,
	index;

// Register color names since GL can't render those directly.
Color.prototype.names = {
	aliceblue: '#f0f8ff',
	antiquewhite: '#faebd7',
	aqua: '#00ffff',
	aquamarine: '#7fffd4',
	azure: '#f0ffff',
	beige: '#f5f5dc',
	bisque: '#ffe4c4',
	black: '#000000',
	blanchedalmond: '#ffebcd',
	blue: '#0000ff',
	blueviolet: '#8a2be2',
	brown: '#a52a2a',
	burlywood: '#deb887',
	cadetblue: '#5f9ea0',
	chartreuse: '#7fff00',
	chocolate: '#d2691e',
	coral: '#ff7f50',
	cornflowerblue: '#6495ed',
	cornsilk: '#fff8dc',
	crimson: '#dc143c',
	cyan: '#00ffff',
	darkblue: '#00008b',
	darkcyan: '#008b8b',
	darkgoldenrod: '#b8860b',
	darkgray: '#a9a9a9',
	darkgreen: '#006400',
	darkkhaki: '#bdb76b',
	darkmagenta: '#8b008b',
	darkolivegreen: '#556b2f',
	darkorange: '#ff8c00',
	darkorchid: '#9932cc',
	darkred: '#8b0000',
	darksalmon: '#e9967a',
	darkseagreen: '#8fbc8f',
	darkslateblue: '#483d8b',
	darkslategray: '#2f4f4f',
	darkturquoise: '#00ced1',
	darkviolet: '#9400d3',
	deeppink: '#ff1493',
	deepskyblue: '#00bfff',
	dimgray: '#696969',
	dodgerblue: '#1e90ff',
	feldspar: '#d19275',
	firebrick: '#b22222',
	floralwhite: '#fffaf0',
	forestgreen: '#228b22',
	fuchsia: '#ff00ff',
	gainsboro: '#dcdcdc',
	ghostwhite: '#f8f8ff',
	gold: '#ffd700',
	goldenrod: '#daa520',
	gray: '#808080',
	green: '#008000',
	greenyellow: '#adff2f',
	honeydew: '#f0fff0',
	hotpink: '#ff69b4',
	indianred: '#cd5c5c',
	indigo: '#4b0082',
	ivory: '#fffff0',
	khaki: '#f0e68c',
	lavender: '#e6e6fa',
	lavenderblush: '#fff0f5',
	lawngreen: '#7cfc00',
	lemonchiffon: '#fffacd',
	lightblue: '#add8e6',
	lightcoral: '#f08080',
	lightcyan: '#e0ffff',
	lightgoldenrodyellow: '#fafad2',
	lightgrey: '#d3d3d3',
	lightgreen: '#90ee90',
	lightpink: '#ffb6c1',
	lightsalmon: '#ffa07a',
	lightseagreen: '#20b2aa',
	lightskyblue: '#87cefa',
	lightslateblue: '#8470ff',
	lightslategray: '#778899',
	lightsteelblue: '#b0c4de',
	lightyellow: '#ffffe0',
	lime: '#00ff00',
	limegreen: '#32cd32',
	linen: '#faf0e6',
	magenta: '#ff00ff',
	maroon: '#800000',
	mediumaquamarine: '#66cdaa',
	mediumblue: '#0000cd',
	mediumorchid: '#ba55d3',
	mediumpurple: '#9370d8',
	mediumseagreen: '#3cb371',
	mediumslateblue: '#7b68ee',
	mediumspringgreen: '#00fa9a',
	mediumturquoise: '#48d1cc',
	mediumvioletred: '#c71585',
	midnightblue: '#191970',
	mintcream: '#f5fffa',
	mistyrose: '#ffe4e1',
	moccasin: '#ffe4b5',
	navajowhite: '#ffdead',
	navy: '#000080',
	oldlace: '#fdf5e6',
	olive: '#808000',
	olivedrab: '#6b8e23',
	orange: '#ffa500',
	orangered: '#ff4500',
	orchid: '#da70d6',
	palegoldenrod: '#eee8aa',
	palegreen: '#98fb98',
	paleturquoise: '#afeeee',
	palevioletred: '#d87093',
	papayawhip: '#ffefd5',
	peachpuff: '#ffdab9',
	peru: '#cd853f',
	pink: '#ffc0cb',
	plum: '#dda0dd',
	powderblue: '#b0e0e6',
	purple: '#800080',
	red: '#ff0000',
	rosybrown: '#bc8f8f',
	royalblue: '#4169e1',
	saddlebrown: '#8b4513',
	salmon: '#fa8072',
	sandybrown: '#f4a460',
	seagreen: '#2e8b57',
	seashell: '#fff5ee',
	sienna: '#a0522d',
	silver: '#c0c0c0',
	skyblue: '#87ceeb',
	slateblue: '#6a5acd',
	slategray: '#708090',
	snow: '#fffafa',
	springgreen: '#00ff7f',
	steelblue: '#4682b4',
	tan: '#d2b48c',
	teal: '#008080',
	thistle: '#d8bfd8',
	tomato: '#ff6347',
	turquoise: '#40e0d0',
	violet: '#ee82ee',
	violetred: '#d02090',
	wheat: '#f5deb3',
	white: '#ffffff',
	whitesmoke: '#f5f5f5',
	yellow: '#ffff00',
	yellowgreen: '#9acd32'
};

/**
 * Tolerant max() funciton
 * @return {number} max value
 */
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

/*
 * Returns true if we should force chart series boosting
 */
function shouldForceChartSeriesBoosting(chart) {
	// If there are more than five series currently boosting,
	// we should boost the whole chart to avoid running out of webgl contexts.
	var sboostCount = 0,
		series;

	if (chart.series.length > 1) {
		for (var i = 0; i < chart.series.length; i++) {
			series = chart.series[i];
			if (patientMax(
				series.processedXData, 
				series.options.data,
				series.points
			) >= (series.options.boostThreshold || Number.MAX_VALUE)) {
				sboostCount++;
			}
		}
	}

	return sboostCount > 5;
}

/*
 * Returns true if the chart is in series boost mode
 * @param chart {Highchart.Chart} - the chart to check
 * @returns {Boolean} - true if the chart is in series boost mode
 */
function isChartSeriesBoosting(chart) {
	return shouldForceChartSeriesBoosting(chart) || chart.series.length >= pick(
		chart.options.boost && chart.options.boost.seriesThreshold, // docs
		50
	);
}

/*
 * Returns true if the series is in boost mode
 * @param series {Highchart.Series} - the series to check
 * @returns {boolean} - true if the series is in boost mode
 */
function isSeriesBoosting(series) {
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
					'return value;// + xAxisPos;',
				'}',

				'return translate(value, 0.0, xAxisTrans, xAxisMin, xAxisMinPad, xAxisPointRange, xAxisLen, xAxisCVSCoord);// + xAxisPos;',
			'}',

			'float yToPixels(float value, float checkTreshold){',
				'float v;',
				'if (skipTranslation){',
					'v = value;// + yAxisPos;',
				'} else {',
					'v = translate(value, 0.0, yAxisTrans, yAxisMin, yAxisMinPad, yAxisPointRange, yAxisLen, yAxisCVSCoord);// + yAxisPos;',
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
				//'gl_PointSize = 10.0;',
				'vColor = aColor;',

				'if (isInverted) {',
					'gl_Position = uPMatrix * vec4(xToPixels(aVertexPosition.y) + yAxisPos, yToPixels(aVertexPosition.x, aVertexPosition.z) + xAxisPos, 0.0, 1.0);',
				'} else {',
					'gl_Position = uPMatrix * vec4(xToPixels(aVertexPosition.x) + xAxisPos, yToPixels(aVertexPosition.y, aVertexPosition.z) + yAxisPos, 0.0, 1.0);',
				'}',
				//'gl_Position = uPMatrix * vec4(aVertexPosition.x, aVertexPosition.y, 0.0, 1.0);',
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
		//Uniform for invertion
		isInverted,
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

	/*
	 * Destroy the shader
	 */
	function destroy() {
		if (gl && shaderProgram) {
			gl.deleteProgram(shaderProgram);
		}
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

	/*
	 * Set if inversion state
	 * @flag is the state
	 */
	function setInverted(flag) {
		gl.uniform1i(isInverted, flag);
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
		reset: reset,
		setInverted: setInverted,
		destroy: destroy
	};
}

/* 
 * Vertex Buffer abstraction 
 * A vertex buffer is a set of vertices which are passed to the GPU
 * in a single call.
 * @param gl {WebGLContext} - the context in which to create the buffer
 * @param shader {GLShader} - the shader to use
 */
function GLVertexBuffer(gl, shader, dataComponents /*, type */) {
	var buffer = false,
		vertAttribute = false,
		components = dataComponents || 2,
		preAllocated = false,
		iterator = 0,
		data;

	// type = type || 'float';

	function destroy() {
		if (buffer) {
			gl.deleteBuffer(buffer);
		}
	}

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

		if (buffer) {
			gl.deleteBuffer(buffer);
		}

		buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(
			gl.ARRAY_BUFFER, 
			preAllocated || new Float32Array(data), 
			gl.STATIC_DRAW
		);

		// gl.bindAttribLocation(shader.program(), 0, 'aVertexPosition');
		vertAttribute = gl.getAttribLocation(shader.program(), attrib);
		gl.enableVertexAttribArray(vertAttribute);

		return true;
	}

	/* 
	 * Bind the buffer
	 */
	function bind() {		
		if (!buffer) {
			return false;
		}

		// gl.bindAttribLocation(shader.program(), 0, 'aVertexPosition');
		//gl.enableVertexAttribArray(vertAttribute);
		//gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.vertexAttribPointer(vertAttribute, components, gl.FLOAT, false, 0, 0);
		//gl.enableVertexAttribArray(vertAttribute);
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
		if (preAllocated) { // && iterator <= preAllocated.length - 4) {			
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
		iterator = -1;

		//if (!preAllocated || (preAllocated && preAllocated.length !== size)) {			
		preAllocated = new Float32Array(size);
		//}
	}

	////////////////////////////////////////////////////////////////////////////
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

/* Main renderer. Used to render series.
 *	Notes to self:
 *		- May be able to build a point map by rendering to a separate canvas
 *		  and encoding values in the color data.
 *		- Need to figure out a way to transform the data quicker
 */
function GLRenderer(postRenderCallback) {
	var // Shader
		shader = false,
		// Vertex buffers - keyed on shader attribute name
		vbuffer = false,
		// Opengl context
		gl = false,
		// Width of our viewport in pixels
		width = 0,
		// Height of our viewport in pixels
		height = 0,
		// The data to render - array of coordinates
		data = false,		
		// The marker data
		markerData = false,
		// Is the texture ready?
		textureIsReady = false,
		// Exports
		exports = {},
		// Is it inited?
		isInited = false,
		// The series stack
		series = [],	
		// Texture for circles
		circleTexture = doc.createElement('canvas'),
		// Context for circle texture
		circleCtx = circleTexture.getContext('2d'),
		// Handle for the circle texture
		circleTextureHandle,
		// Things to draw as "rectangles" (i.e lines)
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
			lineWidth: 3,
			fillColor: '#AA00AA',
			useAlpha: true,
			usePreallocated: false,
			useGPUTranslations: false,
			timeRendering: false,
			timeSeriesProcessing: false,
			timeSetup: false
		};

	////////////////////////////////////////////////////////////////////////////

	function setOptions(options) {
		merge(true, settings, options);
	}

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
		var near = 0, 
			far = 1;
		
		return [
			2 / width, 0, 0, 0,
			0, -(2 / height), 0, 0,
			0, 0, -2 / (far - near), 0,
			-1, 1, -(far + near) / (far - near), 1
		];
	}

	/*
	 * Clear the depth and color buffer
	 */
	function clear() {		
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
			yAxis = series.yAxis,
			xAxis = series.xAxis,
			useRaw = !xData || xData.length === 0,			
			// threshold = options.threshold,
			// yBottom = chart.yAxis[0].getThreshold(threshold),
			// hasThreshold = isNumber(threshold),
			// colorByPoint = series.options.colorByPoint,
			// This is required for color by point, so make sure this is 
			// uncommented if enabling that
			// colorIndex = 0,
			// Required for color axis support
			// caxis,			
			// connectNulls = options.connectNulls,			
			// For some reason eslint doesn't pick up that this is actually used
			maxVal, //eslint-disable-line no-unused-vars
			points = series.points || false,
			lastX = false,
			minVal,
			color,
			scolor,
			sdata = isStacked ? series.data : (xData || rawData),
			closestLeft = { x: Number.MIN_VALUE, y: 0 },
			closestRight = { x: Number.MIN_VALUE, y: 0 }
			;

		if (options.boostData && options.boostData.length > 0) {			
			return;
		}

		series.closestPointRangePx = Number.MAX_VALUE;

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
					pointAttr;

				if (plotY !== undefined && !isNaN(plotY) && point.y !== null) {
					shapeArgs = point.shapeArgs;

					/*= if (build.classic) { =*/
					pointAttr = point.series.pointAttribs(point);
					/*= } else { =*/
					pointAttr = point.series.colorAttribs(point);
					/*= } =*/
					swidth = pointAttr['stroke-width'] || 0;

					// Handle point colors
					color = H.color(pointAttr.fill).rgba;
					color[0] /= 255.0;
					color[1] /= 255.0;
					color[2] /= 255.0;
					
					// So there are two ways of doing this. Either we can
					// create a rectangle of two triangles, or we can do a 
					// point and use point size. Latter is faster, but 
					// only supports squares. So we're doing triangles.
					// We could also use one color per. vertice to get 
					// better color interpolation.
			
					// If there's stroking, we do an additional rect
					//if (pointAttr.stroke !== 'none' && swidth && swidth > 0) {
					if (series.type === 'treemap') {
						swidth = swidth || 1;
						scolor = H.color(pointAttr.stroke).rgba; 

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
		// each(chart.axes || [], function (a) {
		// 	if (H.ColorAxis && a instanceof H.ColorAxis) {
		// 		caxis = a;
		// 	}
		// });	

		each(sdata, function (d, i) {
			var x,
				y,
				z,
				px = false,
				nx = false,
				// This is in fact used.
				low, //eslint-disable-line no-unused-vars
				chartDestroyed = typeof chart.index === 'undefined',
				nextInside = false,
				prevInside = false,
				pcolor = false,
				drawAsBar = asBar[series.type],
				isXInside = false,
				isYInside = true;

			if (chartDestroyed) {
				return false;
			}

			// Uncomment this to enable color by point.
			// This currently left disabled as the charts look really ugly
			// when enabled and there's a lot of points.
			// Leaving in for the future (tm).
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

				if (sdata[i + 1]) {
					nx = sdata[i + 1][0];
				}

				if (sdata[i - 1]) {
					px = sdata[i - 1][0];
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

				if (sdata[i + 1]) {
					nx = sdata[i + 1];
				}

				if (sdata[i - 1]) {
					px = sdata[i - 1];
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

			if (x > xMax && closestRight.x < xMax) {
				closestRight.x = x;
				closestRight.y = y;
			}

			if (x < xMin && closestLeft.x < xMin) {
				closestLeft.x = x;
				closestLeft.y = y;
			}

			if (y !== 0 && (!y || !isYInside)) {
				return;
			}

			if (x >= xMin && x <= xMax) {
				isXInside = true;
			}

			if (!isXInside && !nextInside && !prevInside) {
				return;
			}

			// Skip translations - temporary floating point fix
			if (!settings.useGPUTranslations) {
				inst.skipTranslation = true;
				x = xAxis.toPixels(x, true);
				y = yAxis.toPixels(y, true);
			}

			if (drawAsBar) {
				
				maxVal = y;
				minVal = 0;

				if (y < 0) {
					minVal = y;
					y = 0;
				}
			
				if (!settings.useGPUTranslations) {
					minVal = yAxis.toPixels(minVal, true);					
				}

				// Need to add an extra point here
				vertice(x, minVal, 0, 0, pcolor);
			}			

			// No markers on out of bounds things.
			// Out of bound things are shown if and only if the next
			// or previous point is inside the rect.
			if (inst.hasMarkers) { // && isXInside) {
				// x = H.correctFloat(
				// 	Math.min(Math.max(-1e5, xAxis.translate(
				// 		x,
				// 		0,
				// 		0,
				// 		0,
				// 		1,
				// 		0.5,
				// 		false
				// 	)), 1e5)
				// );

				if (lastX !== false) {
					series.closestPointRangePx = Math.min(
						series.closestPointRangePx,
						Math.abs(x - lastX)
					);					
				}			
			}
			
			vertice(
				x, 
				y, 
				0, 
				series.type === 'bubble' ? (z || 1) : 2, 
				pcolor
			);

			// Uncomment this to support color axis.
			// if (caxis) {				
			// 	color = H.color(caxis.toColor(y)).rgba;

			// 	inst.colorData.push(color[0] / 255.0);
			// 	inst.colorData.push(color[1] / 255.0);
			// 	inst.colorData.push(color[2] / 255.0);
			// 	inst.colorData.push(color[3]);
			// }

			lastX = x;

			//return true;
		});

		function pushSupplementPoint(point) {
			if (!settings.useGPUTranslations) {
				inst.skipTranslation = true;
				point.x = xAxis.toPixels(point.x, true);
				point.y = yAxis.toPixels(point.y, true);
			}

			// We should only do this for lines, and we should ignore markers
			// since there's no point here that would have a marker.
			
			vertice(
				point.x,
				point.y,
				0,
				2
			);
		}

		if (!lastX) {
			// There are no points within the selected range
			pushSupplementPoint(closestLeft);
			pushSupplementPoint(closestRight);
		}
	}

	/*
	 * Push a series to the renderer
	 * If we render the series immediatly, we don't have to loop later
	 * @param s {Highchart.Series} - the series to push
	 */
	function pushSeries(s) {
		if (series.length > 0) {
			series[series.length - 1].to = data.length;
			if (series[series.length - 1].hasMarkers) {
				series[series.length - 1].markerTo = markerData.length;
			}
		}

		if (settings.timeSeriesProcessing) {			
			console.time('building ' + s.type + ' series'); //eslint-disable-line no-console		 	
		}		

		series.push({
			from: data.length,
			markerFrom: markerData.length,
			// Push RGBA values to this array to use per. point coloring.
			// It should be 0-padded, so each component should be pushed in
			// succession.
			colorData: [],
			series: s,
			zMin: Number.MAX_VALUE,
			zMax: -Number.MAX_VALUE,
			hasMarkers: s.options.marker ? s.options.marker.enabled !== false : false,
			showMarksers: true,
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
			console.timeEnd('building ' + s.type + ' series'); //eslint-disable-line no-console		
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
		markerData = [];
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
	function render(chart) {

		if (chart) {
			if (!chart.chartHeight || !chart.chartWidth) {
				//chart.setChartSize();
			}

			width = chart.chartWidth || 800;
			height = chart.chartHeight || 400;
		} else {
			return false;
		}

		if (!gl || !width || !height) {
			return false;
		}

		if (settings.timeRendering) {			
			console.time('gl rendering'); //eslint-disable-line no-console
		}
	
		shader.bind();

		gl.viewport(0, 0, width, height);
		shader.setPMatrix(orthoMatrix(width, height));

		if (settings.lineWidth > 1 && !H.isMS) {
			gl.lineWidth(settings.lineWidth);
		}
		
		vbuffer.build(exports.data, 'aVertexPosition', 4);
		vbuffer.bind();

		if (textureIsReady) {			
			gl.bindTexture(gl.TEXTURE_2D, circleTextureHandle);
			shader.setTexture(circleTextureHandle);			
		}

		shader.setInverted(chart.options.chart ? chart.options.chart.inverted : false);

		// Render the series
		each(series, function (s, si) {
			var options = s.series.options,
				threshold = options.threshold,
				hasThreshold = isNumber(threshold),
				yBottom = s.series.yAxis.getThreshold(threshold),
				translatedThreshold = yBottom,
				cbuffer,
				showMarkers = pick(
					options.marker ? options.marker.enabled : null,
					s.series.xAxis.isRadial ? true : null,
					s.series.closestPointRangePx > 
						2 * ((
								options.marker ? 
								options.marker.radius : 
								10
							) || 10)
				),
				fillColor = s.series.fillOpacity ?
					new Color(s.series.color).setOpacity(
								pick(options.fillOpacity, 0.85)
							).get() :
					s.series.color,
				color;			

			vbuffer.bind();

			if (options.colorByPoint) {
				fillColor = s.series.chart.options.colors[si ];
			}

			color = H.color(fillColor).rgba;

			if (!settings.useAlpha) {
				color[3] = 1.0;
			}

			//Blending
			if (options.boostBlending === 'add') { // docs
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
				gl.blendEquation(gl.FUNC_ADD);

			} else if (options.boostBlending === 'mult') {
				gl.blendFunc(gl.DST_COLOR, gl.ZERO);
			
			} else if (options.boostBlending === 'darken') {
				gl.blendFunc(gl.ONE, gl.ONE);
				gl.blendEquation(gl.FUNC_MIN);
			
			} else {
				//gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);//, gl.ONE, gl.ZERO);
				//gl.blendEquation(gl.FUNC_ADD);
				gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
			}

			shader.reset();		

			// If there are entries in the colorData buffer, build and bind it.
			if (s.colorData.length > 0) {
				shader.setUniform('hasColor', 1.0);
				cbuffer = GLVertexBuffer(gl, shader); //eslint-disable-line new-cap
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

			shader.setDrawAsCircle((asCircle[s.series.type] && textureIsReady) || false);				
			
			// Do the actual rendering
			vbuffer.render(s.from, s.to, s.drawMode);

			if (s.hasMarkers && showMarkers) {
				if (options.marker && options.marker.radius) {
					shader.setPointSize(options.marker.radius * 2.0);
				} else {
					shader.setPointSize(10);
				}
				shader.setDrawAsCircle(true);
				vbuffer.render(s.from, s.to, 'POINTS');
			}
		});

		vbuffer.destroy();

		if (settings.timeRendering) {			
			console.timeEnd('gl rendering'); //eslint-disable-line no-console
		}

		flush();

		if (postRenderCallback) {
			postRenderCallback();
		}
	}

	/* 
	 * Render the data when ready
	 */
	function renderWhenReady(chart) {
		clear();
		
		if (chart.renderer.forExport) {
			return render(chart);
		}
		
		if (isInited) {
			render(chart);
		} else {
			setTimeout(function () {
				renderWhenReady(chart);
			}, 1);
		}
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

		width = w;
		height = h;

		shader.bind();
		shader.setPMatrix(orthoMatrix(width, height));
	}
	
	/* 
	 * Init OpenGL 
	 * @param canvas {HTMLCanvas} - the canvas to render to
	 */
	function init(canvas, noFlush) {
		var i = 0,
			contexts = [
				'webgl', 
				'experimental-webgl', 
				'moz-webgl', 
				'webkit-3d'
			];

		isInited = false;
		
		if (!canvas) {
			return false;
		}

		if (settings.timeSetup) {			
			console.time('gl setup'); //eslint-disable-line no-console	
		}

		for (; i < contexts.length; i++) {
			gl = canvas.getContext(contexts[i]);
			if (gl) {
				break;
			}
		}

		if (gl) {   
			if (!noFlush) {
				flush();				
			}	 	
		} else {
			return false;
		}

		gl.enable(gl.BLEND);
		// gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.disable(gl.DEPTH_TEST);
		gl.depthMask(gl.FALSE);

		shader = GLShader(gl); //eslint-disable-line new-cap	
		vbuffer = GLVertexBuffer(gl, shader); //eslint-disable-line new-cap

		textureIsReady = false;

		// Set up the circle texture used for bubbles
		circleTextureHandle = gl.createTexture();

		// Draw the circle
		circleTexture.width = 512;
		circleTexture.height = 512;

		circleCtx.fillStyle = '#FFF';		
		circleCtx.beginPath();
		circleCtx.arc(256, 256, 256, 0, 2 * Math.PI);
		circleCtx.fill();

		try {

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
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

			gl.generateMipmap(gl.TEXTURE_2D);

			gl.bindTexture(gl.TEXTURE_2D, null);

			textureIsReady = true;
		} catch (e) {}

		isInited = true;

		if (settings.timeSetup) {
			console.timeEnd('gl setup'); //eslint-disable-line no-console
		}		

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

	function destroy() {
		vbuffer.destroy();
		shader.destroy();
		if (gl) {
			//gl.deleteTexture(circleTextureHandle);
		}
	}

	////////////////////////////////////////////////////////////////////////////
	exports = {
		allocateBufferForSingleSeries: allocateBufferForSingleSeries,
		pushSeries: pushSeries,
		setSize: setSize,
		inited: inited,
		setThreshold: setThreshold,
		init: init,
		render: renderWhenReady,
		settings: settings,
		valid: valid,
		clear: clear,
		flush: flush,
		setXAxis: setXAxis,
		setYAxis: setYAxis,
		data: data,
		gl: getGL,
		allocateBuffer: allocateBuffer,
		destroy: destroy,
		setOptions: setOptions
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

	if (target.ogl) {
		//target.ogl.destroy();
	}

	if (!target.image) {		
		target.canvas = doc.createElement('canvas');

		target.image = chart.renderer.image(
			'', 
			0, 
			0, 
			width, 
			height
		).add(targetGroup);

		target.boostClipRect = chart.renderer.clipRect(
			chart.plotLeft,
			chart.plotTop,
			chart.plotWidth,
			chart.chartHeight
		);

		target.image.clip(target.boostClipRect);

		if (target.inverted) {
			each(['moveTo', 'lineTo', 'rect', 'arc'], function (fn) {
				wrap(false, fn, swapXY);
			});
		}

		if (target instanceof H.Chart) {
			target.markerGroup = target.renderer.g().add(targetGroup);

			target.markerGroup.translate(series.xAxis.pos, series.yAxis.pos);
		}
	}
	
	target.canvas.width = width;
	target.canvas.height = height;					
	
	target.image.attr({
		x: 0,
		y: 0,
		width: width,
		height: height,
		style: 'pointer-events: none'
	});
	
	target.boostClipRect.attr({
		x: chart.plotLeft,
		y: chart.plotTop,
		width: chart.plotWidth,
		height: chart.chartHeight
	});
	
	if (!target.ogl) {
		
		
		target.ogl = GLRenderer(function () { // eslint-disable-line new-cap
			target.image.attr({ 
				href: target.canvas.toDataURL('image/png')
			});	
		}); //eslint-disable-line new-cap
		
		target.ogl.init(target.canvas);
		// target.ogl.clear();
		target.ogl.setOptions(chart.options.boost || {});

		if (target instanceof H.Chart) {
			target.ogl.allocateBuffer(chart);
		}
	}

	target.ogl.setSize(width, height);

	return target.ogl;
}

/*
 * Performs the actual render if the renderer is 
 * attached to the series.
 * @param renderer {OGLRenderer} - the renderer
 * @param series {Highcharts.Series} - the series
 */
function renderIfNotSeriesBoosting(renderer, series, chart) {
	if (renderer && 
		series.image && 
		series.canvas && 
		!isChartSeriesBoosting(chart || series.chart)
	) {
		renderer.render(chart || series.chart);
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

////////////////////////////////////////////////////////////////////////////////
// Following is the parts of the boost that's common between OGL/Legacy

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
		point.index = boostPoint.i;
	}	

	return point;
};

/**
 * Return a point instance from the k-d-tree
 */
wrap(Series.prototype, 'searchPoint', function (proceed) {
	return this.getPoint(
		proceed.apply(this, [].slice.call(arguments, 1))
	);
});

/**
 * Extend series.destroy to also remove the fake k-d-tree points (#5137). 
 * Normally this is handled by Series.destroy that calls Point.destroy, 
 * but the fake search points are not registered like that.
 */
wrap(Series.prototype, 'destroy', function (proceed) {
	var series = this,
		chart = series.chart;

	if (chart.markerGroup === series.markerGroup) {
		series.markerGroup = null;
	}

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
 * Do not compute extremes when min and max are set.
 * If we use this in the core, we can add the hook 
 * to hasExtremes to the methods directly.
 */
wrap(Series.prototype, 'getExtremes', function (proceed) {
	if (!isSeriesBoosting(this) || (!this.hasExtremes || !this.hasExtremes())) {
		return proceed.apply(this, Array.prototype.slice.call(arguments, 1));
	}
});

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
			if (method === 'render' && this.image && !isChartSeriesBoosting(this.chart)) {
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

/*
 * Returns true if the current browser supports webgl
 */
function hasWebGLSupport() {
	var i = 0,
		canvas,
		contexts = ['webgl', 'experimental-webgl', 'moz-webgl', 'webkit-3d'],
		context = false;

	if (typeof win.WebGLRenderingContext !== 'undefined') {
		canvas = doc.createElement('canvas');

		for (; i < contexts.length; i++) {
			try {
				context = canvas.getContext(contexts[i]);
				if (typeof context !== 'undefined' && context !== null) {
					return true;
				}				
			} catch (e) {

			}
		}
	}

	return false;
}

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



////////////////////////////////////////////////////////////////////////////////
// We're wrapped in a closure, so just return if there's no webgl support

if (!hasWebGLSupport()) {	
	if (typeof H.initCanvasBoost !== 'undefined') {
		// Fallback to canvas boost		
		H.initCanvasBoost();
	} else {
		H.error(26);
	}
} else {

	////////////////////////////////////////////////////////////////////////////
	// GL-SPECIFIC WRAPPINGS FOLLOWS

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
				options = series.options || {},
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
				enableMouseTracking = options.enableMouseTracking !== false,
				threshold = options.threshold,
				yBottom = yAxis.getThreshold(threshold),
				isRange = series.pointArrayMap && 
					series.pointArrayMap.join(',') === 'low,high',
				isStacked = !!options.stacking,
				cropStart = series.cropStart || 0,
				requireSorting = series.requireSorting,
				useRaw = !xData,
				minVal,
				maxVal,
				minI,
				maxI,			
				
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
					this.image.attr({ href: '' });
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
				renderIfNotSeriesBoosting(renderer, this, chart);	
				//console.log(series, chart);
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

						// We use ceil to allow the KD tree to work with sub
						// pixels, which can be used in boost to space pixels
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
				}

				return !chartDestroyed;
			}

			function doneProcessing() {
				fireEvent(series, 'renderedCanvas');
				// Pass tests in Pointer. 
				// Replace this with a single property, and replace when zooming
				// in below boostThreshold.
				series.directTouch = false;
				series.options.stickyTracking = true;

				// Go back to prototype, ready to build
				delete series.buildKDTree;
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

	/*
	 * We need to handle heatmaps separatly, since we can't perform the
	 * size/color calculations in the shader easily.
	 *
	 * This likely needs future optimization.
	 *
	 */
	each(['heatmap', 'treemap'],
		function (t) {
			if (seriesTypes[t]) {	
				wrap(seriesTypes[t].prototype, 'drawPoints', pointDrawHandler);
				seriesTypes[t].prototype.directTouch = false; // Use k-d-tree
			}
		}
	);

	if (seriesTypes.bubble) {
		// By default, the bubble series does not use the KD-tree, so force it
		// to.
		delete seriesTypes.bubble.prototype.buildKDTree;
		seriesTypes.bubble.prototype.directTouch = false;
		
		// Needed for markers to work correctly
		wrap(
			seriesTypes.bubble.prototype,
			'markerAttribs',
			function (proceed) {
				if (isSeriesBoosting(this)) {
					return false;
				}
				return proceed.apply(this, [].slice.call(arguments, 1));
			}
		);
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

	wrap(Series.prototype, 'setVisible', function (proceed, vis) {
		proceed.call(this, vis, false);
		if (this.visible === false && this.ogl && this.canvas && this.image) {
			this.ogl.clear();
			this.image.attr({ href: '' });
		} else {
			this.chart.redraw();		
		}
	});

	/**
	 * Take care of the canvas blitting
	 */
	H.Chart.prototype.callbacks.push(function (chart) {

		/* Convert chart-level canvas to image */
		function canvasToSVG() {			
			if (chart.ogl && isChartSeriesBoosting(chart)) {
				chart.ogl.render(chart);
			}
		}

		/* Clear chart-level canvas */
		function preRender() {

			if (!isChartSeriesBoosting(chart) && chart.didBoost) {
				chart.didBoost = false;
				// Clear the canvas
				if (chart.image) {
					chart.image.attr({ href: '' });
				}
			}

			if (chart.canvas && chart.ogl && isChartSeriesBoosting(chart)) {
				chart.didBoost = true;
			
				// Allocate
				chart.ogl.allocateBuffer(chart);
			}

			//see #6518 + #6739
			if (chart.markerGroup && chart.xAxis && chart.xAxis.length > 0 && chart.yAxis && chart.yAxis.length > 0) {
				chart.markerGroup.translate(
					chart.xAxis[0].pos,
					chart.yAxis[0].pos
				);
			}

		}

		addEvent(chart, 'predraw', preRender);
		addEvent(chart, 'render', canvasToSVG);
	});
} // if hasCanvasSupport
