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
	index
	;

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

		shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, v);
		gl.attachShader(shaderProgram, f);
		gl.linkProgram(shaderProgram);

		gl.useProgram(shaderProgram);

		pUniform = gl.getUniformLocation(shaderProgram, 'uPMatrix');
		psUniform = gl.getUniformLocation(shaderProgram, 'pSize');
		fillColorUniform = gl.getUniformLocation(shaderProgram, 'fillColor');
		isBubbleUniform = gl.getUniformLocation(shaderProgram, 'isBubble');
		bubbleSizeAbsUniform = gl.getUniformLocation(shaderProgram, 'bubbleSizeAbs');
		bubbleSizeAreaUniform = gl.getUniformLocation(shaderProgram, 'bubbleSizeByArea');
		uSamplerUniform = gl.getUniformLocation(shaderProgram, 'uSampler');
		skipTranslationUniform = gl.getUniformLocation(shaderProgram, 'skipTranslation');
		isCircleUniform = gl.getUniformLocation(shaderProgram, 'isCircle');
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
function GLVertexBuffer(gl, shader) {
	var buffer = false,		
		vertAttribute = false,
		components,
		data;	

	/* 
	 * Build the buffer 
 	 * @param dataIn {Array<float>} - a 0 padded array of indices
 	 * @param attrib {String} - the name of the Attribute to bind the buffer to
 	 * @param dataComponents {Integer} - the number of components per. indice
	 */
	function build(dataIn, attrib, dataComponents) {
		data = dataIn || [];

		if (!data.length) {
			//console.error('trying to render empty vbuffer');
			buffer = false;
			return false;
		}

		components = dataComponents || 2;

		buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(
			gl.ARRAY_BUFFER, 
			new Float32Array(data), 
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
		if (!buffer) {
			return false;
		}

		if (!data.length) {
			return false;
		}
				
		if (!from || from > data.length || from < 0) {
			from = 0;
		}

		if (!to || to > data.length) {
			to = data.length;
		}

		drawMode = drawMode || 'points';

		gl.drawArrays(
			gl[drawMode.toUpperCase()], 
			from / components, 
			(to - from) / components
		); 

		return true;
	}

	////////////////////////////////////////////////////////////////////////
	return {
		bind: bind,
		data: data,
		build: build,
		render: render
	};    	
}

/* Main renderer. Used to render series.
 *	Notes to self:
 *		- If we need varrying sizes for things (e.g. bubble charts) we can
 *		  use a vec3 instead, and use z as the size.
 *		- May be able to build a point map by rendering to a separate canvas
 *		  and encoding values in the color data.
 *		- If we need colors per. point/line we need a separate vertex buffer
 *		- Need to figure out a way to transform the data quicker
 *
 */
function GLRenderer() {
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
		data = [],
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
			useAlpha: true	
		};

	////////////////////////////////////////////////////////////////////////////

	//Create a white circle texture for use with bubbles
	circleTexture.src = 'data:image/svg+xml;utf8,' + encodeURIComponent([
		'<?xml version="1.0" standalone="no"?>',
		'<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink">',
		'<circle cx="32" cy="32" r="32" stroke="none" fill="#FFF"/>',
		'</svg>'
	].join(''));

	circleTexture.width = 32;
	circleTexture.height = 32;

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
		//gl.clearColor(1, 1, 1, 1.0);
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
			minVal,
			caxis,
			color,
			scolor,
			d = isStacked ? series.data : (xData || rawData),
			maxVal;

		//Push a vertice to the data buffer
		function vertice(x, y, checkTreshold, pointSize) {			
			data.push(x);
			data.push(y);
			data.push(checkTreshold ? 1 : 0);
			data.push(pointSize || 1);
		}

		// Push a rectangle to the data buffer
		function pushRect(x, y, w, h, color) {

			// Push color to color buffer - need to do this per. vertex
			function pushColor() {
				if (color) {
					inst.colorData.push(color[0]);
					inst.colorData.push(color[1]);
					inst.colorData.push(color[2]);
					inst.colorData.push(color[3]);
				}				
			}

			// Normally we should use triangle_strip since it's faster,
			// but this would require more complicated pre-processing,
			// which would negate the performance increase.

			pushColor();
			vertice(x + w, y);
			pushColor();
			vertice(x, y);
			pushColor();
			vertice(x, y + h);

			pushColor();
			vertice(x, y + h);
			pushColor();
			vertice(x + w, y + h);	
			pushColor();
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
						return a.node.levelDynamic > b.node.levelDynamic;
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
					color = H.color(pointAttr.fill).rgba;
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
					if (pointAttr.stroke !== 'none' && swidth && swidth > 0) {
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
					} else {
						swidth = 0;
					}

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

		each(d, function (d, i) {
			var x,
				y,
				z,
				//clientX,
				//plotY,
				//isNull,
				low,
				chartDestroyed = typeof chart.index === 'undefined',
				isYInside = true;

			if (chartDestroyed) {
				return false;
			}

			if (useRaw) {
				x = d[0];
				y = d[1];

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
			
			if (!series.requireSorting) {
				isYInside = y >= yMin && y <= yMax;
			}

			if (!y || !isYInside || x < xMin || x > xMax) {
				return;
			}

			minVal = 0;
			if (y < 0) {
				minVal = y;
			}

			maxVal = y;
			
			if (asBar[series.type]) {
				// Need to add an extra point here
				vertice(x, minVal, 0, 0);
			}

			vertice(x, y, 0, series.type === 'bubble' ? (z || 1) : 2);

			if (caxis) {				
				color = H.color(caxis.toColor(y)).rgba;

				inst.colorData.push(color[0] / 255.0);
				inst.colorData.push(color[1] / 255.0);
				inst.colorData.push(color[2] / 255.0);
				inst.colorData.push(color[3]);
			}
							
			if (asBar[series.type]) {
				// Need to add an extra point here
				vertice(x, minVal, 0, 0);
			}

			return true;
		});		
	}

	/*
	 * Push a series to the renderer
	 * @param s {Highchart.Series} - the series to push
	 */
	function pushSeries(s) {
		if (series.length > 0) {
			series[series.length - 1].to = data.length;
		}

		//console.time('building ' + s.type + ' series');

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
				'area': 'line_strip',
				'arearange': 'line_strip',
				'column': 'line_strip',
				'line': 'line_strip',
				'scatter': 'points',
				'heatmap': 'triangles',
				'treemap': 'triangles',
				'bubble': 'points'				
			})[s.type] || 'line_strip'
		});

		// Add the series data to our buffer(s)
		pushSeriesData(s, series[series.length - 1]);

		//console.timeEnd('building ' + s.type + ' series');
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
		each(series, function (s) {
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
				color = H.color(fillColor).rgba;			

			if (!settings.useAlpha) {
				color[3] = 1.0;
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
		width = w;
		height = h;
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
		//gl.blendFunc(gl.ONE, gl.ONE);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		//gl.enable(gl.DEPTH_TEST);
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
		gl: getGL
	};

	return exports;
}  

// END OF WEBGL ABSTRACTIONS
////////////////////////////////////////////////////////////////////////////////

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

	return  patientMax(
				series.processedXData, 
				series.options.data,
				series.points
			) >= (series.options.boostThreshold || Number.MAX_VALUE);				
}

/*
 * Returns true if the chart is in series boost mode
 * @param chart {Highchart.Chart} - the chart to check
 * @returns {Boolean} - true if the chart is in series boost mode
 */
function isChartSeriesBoosting(chart) {
	return chart.series.length > 20;
}

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
	}

	target.image.attr({
		x: 0,
		y: 0,
		width: width,
		height: height,
		style: 'pointer-events: none;'
	});

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

wrap(Series.prototype, 'processData', function (proceed) {
	// If this is a heatmap, do default behaviour
	if (!isSeriesBoosting(this) || 
		this.type === 'heatmap' || 
		this.type === 'treemap') {
		proceed.apply(this, Array.prototype.slice.call(arguments, 1));		
	}

	if (!this.hasExtremes(true)) {
		proceed.apply(this, Array.prototype.slice.call(arguments, 1));
	}
});

// wrap(Series.prototype, 'setData', function (proceed) {
// 	if (!this.hasExtremes(true)) {
// 		proceed.apply(this, Array.prototype.slice.call(arguments, 1));
// 	}
// });

// wrap(Series.prototype, 'addPoint', function (proceed, options, redraw, shift, animation) {
// 	this.options.data.push(options);

// 	if (shift) {
// 		this.options.data.shift();		
// 	}

// 	this.isDirty = true;
// 	this.isDirtyData = true;

// 	if (redraw) {
// 		chart.redraw(animation); // Animation is set anyway on redraw, #5665
// 	}
// });

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
				//Shaves off about 60ms in canvas-scatter test
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
		
		// Get or create the renderer
		renderer = createAndAttachRenderer(chart, series);

		if (renderer) {
			renderer.pushSeries(series);				
		}

		// Perform the actual renderer if we're on series level
		renderIfNotSeriesBoosting(renderer, this);

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

/*
 * We need to handle heatmaps separatly, since we can't perform the size/color
 * calculations in the shader easily.
 *
 * This likely needs future optimization.
 *
 */
if (seriesTypes.heatmap) {	
	wrap(seriesTypes.heatmap.prototype, 'drawPoints', function (proceed) {
		if (!isSeriesBoosting(this)) {
			return proceed.call(this);
		}

		//Make sure we have a valid OGL context
		var renderer = createAndAttachRenderer(this.chart, this);
		if (renderer) {
			renderer.pushSeries(this);				
		}		
		renderIfNotSeriesBoosting(renderer, this);
	});

	seriesTypes.heatmap.prototype.directTouch = false; // Use k-d-tree
}

if (seriesTypes.treemap) {
	wrap(seriesTypes.treemap.prototype, 'drawPoints', function (proceed) {
		if (!isSeriesBoosting(this)) {
			return proceed.call(this);
		}
		//Make sure we have a valid OGL context
		var renderer = createAndAttachRenderer(this.chart, this);
		if (renderer) {
			renderer.pushSeries(this);				
		}	

		renderIfNotSeriesBoosting(renderer, this);	
	});
}

if (seriesTypes.bubble) {
	// By default, the bubble series does not use the KD-tree, so force it to.
	delete seriesTypes.bubble.prototype.buildKDTree;
	seriesTypes.bubble.prototype.directTouch = false;
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
 * Return a full Point object based on the index. The boost module uses stripped point objects
 * for performance reasons.
 * @param   {Number} boostPoint A stripped-down point object
 * @returns {Object}   A Point object as per http://api.highcharts.com/highcharts#Point
 */
Series.prototype.getPoint = function (boostPoint) {
	var point = boostPoint;

	if (boostPoint && !(boostPoint instanceof this.pointClass)) {
		point = (new this.pointClass()).init(this, this.options.data[boostPoint.i]); // eslint-disable-line new-cap
		point.category = point.x;

		point.dist = boostPoint.dist;
		point.distX = boostPoint.distX;
		point.plotX = boostPoint.plotX;
		point.plotY = boostPoint.plotY;
	}

	return point;
};

/**
 * Extend series.destroy to also remove the fake k-d-tree points (#5137). Normally
 * this is handled by Series.destroy that calls Point.destroy, but the fake
 * search points are not registered like that.
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

	function preRender() {
		if (chart.canvas && chart.ogl && isChartSeriesBoosting(chart)) {
			//Clear the series and vertice data
			chart.ogl.flush();
			//Clear ogl canvas
			chart.ogl.clear();				
		}
	}

	addEvent(chart, 'predraw', preRender);
	//Blit to image when done redrawing
	addEvent(chart, 'render', canvasToSVG);
	//Handles the blitting on first render
	addEvent(chart, 'load', canvasToSVG);
});
