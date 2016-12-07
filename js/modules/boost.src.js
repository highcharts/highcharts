/**
 * License: www.highcharts.com/license
 * Author: Torstein Honsi
 * 
 * This is an experimental Highcharts module that draws long data series on a canvas
 * in order to increase performance of the initial load time and tooltip responsiveness.
 *
 * Compatible with HTML5 canvas compatible browsers (not IE < 9).
 *
 *
 * 
 * Development plan
 * - Column range.
 * - Heatmap. Modify the heatmap-canvas demo so that it uses this module.
 * - Treemap.
 * - Check how it works with Highstock and data grouping. Currently it only works when navigator.adaptToUpdatedData
 *   is false. It is also recommended to set scrollbar.liveRedraw to false.
 * - Check inverted charts.
 * - Check reversed axes.
 * - Chart callback should be async after last series is drawn. (But not necessarily, we don't do
	 that with initial series animation).
 * - Cache full-size image so we don't have to redraw on hide/show and zoom up. But k-d-tree still
 *   needs to be built.
 * - Test IE9 and IE10.
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
 * - For scatter plots, use a marker.radius of 1 or less. It results in a rectangle being drawn, which is 
 *   considerably faster than a circle.
 * - Set extremes (min, max) explicitly on the axes in order for Highcharts to avoid computing extremes.
 * - Set enableMouseTracking to false on the series to improve total rendering time.
 * - The default threshold is set based on one series. If you have multiple, dense series, the combined
 *   number of points drawn gets higher, and you may want to set the threshold lower in order to 
 *   use optimizations.
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
	index
	;

////////////////////////////////////////////////////////////////////////////////

function GLShader(gl) {
	var vertShade = [
			/* eslint-disable */
			'#version 100',
			'precision highp float;',
			
			'attribute vec3 aVertexPosition;',
			//'attribute float aXAxis;',
			//'attribute float aYAxis;',

			'uniform mat4 uPMatrix;',
			'uniform float pSize;',

			'uniform float translatedThreshold;',
			'uniform bool hasThreshold;',

			'uniform float xAxisTrans;',
			'uniform float xAxisMin;',
			'uniform float xAxisMinPad;',
			'uniform float xAxisPointRange;',
			'uniform float xAxisLen;',
			'uniform bool  xAxisPostTranslate;',
			'uniform float xAxisOrdinalSlope;',
			'uniform float xAxisOrdinalOffset;',			
			'uniform float xAxisPos;',	
			'uniform bool xAxisCVSCoord;',		

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
				'return translate(value, 0.0, xAxisTrans, xAxisMin, xAxisMinPad, xAxisPointRange, xAxisLen, xAxisCVSCoord) + xAxisPos;',
			'}',

			'float yToPixels(float value, float checkTreshold){',
				'float v = translate(value, 0.0, yAxisTrans, yAxisMin, yAxisMinPad, yAxisPointRange, yAxisLen, yAxisCVSCoord) + yAxisPos;',
				//'if (checkTreshold > 0.0 && hasThreshold) {',
				//	'v = min(v, translatedThreshold);',
				//'}',
				'return v;',
			'}',

			'void main(void) {',
				'gl_PointSize = pSize;',
				//'gl_Position = uPMatrix * vec4(aVertexPosition, 0.0, 1.0);',
				'gl_Position = uPMatrix * vec4(xToPixels(aVertexPosition.x), yToPixels(aVertexPosition.y, aVertexPosition.z), 0.0, 1.0);',
			'}'
			/* eslint-enable */
		].join('\n'),
		//Fragment shader source
		fragShade = [
			/* eslint-disable */
			'precision highp float;',
			'uniform vec4 fillColor;',

			'void main(void) {',
				'gl_FragColor =  fillColor;',
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
		fillColorUniform;

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
			console.error('error compiling shaders:', gl.getShaderInfoLog(shader));
			return false;
		}

		return shader;
	}

	/* Create the shader */
	function createShader() {
		var v = stringToProgram(vertShade, 'vertex'),
			f = stringToProgram(fragShade, 'fragment')
		;

		if (!v || !f) {
			shaderProgram = false;
			console.error('error creating shader program');
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

		return true;
	}

	function bind() {
		gl.useProgram(shaderProgram);
	}

	function setUniform(name, val) {
		var u = uLocations[name] = 	uLocations[name] ||  
							  	 	gl.getUniformLocation(shaderProgram, name);
		gl.uniform1f(u, val);
	}

	function setColor(color) {
		gl.uniform4f(
			fillColorUniform, 
			color[0] / 255.0, 
			color[1] / 255.0, 
			color[2] / 255.0, 
			color[3]
		);
	}

	function setPMatrix(m) {
		gl.uniformMatrix4fv(pUniform, false, m);
	}

	function setPointSize(p) {
		gl.uniform1f(psUniform, p);
	}

	function getProgram() {
		return shaderProgram;
	}

	if (gl) {
		createShader();		
	}

	return {
		psUniform: function () { return psUniform; },
		pUniform: function () { return pUniform; },
		fillColorUniform: function() { return fillColorUniform; },
		bind: bind,
		program: getProgram,
		create: createShader,
		setUniform: setUniform,
		setPMatrix: setPMatrix,
		setColor: setColor,
		setPointSize: setPointSize
	};
}

/* Vertex Buffer abstraction */
function GLVertexBuffer(gl, shader) {
	var buffer = false,		
		vertAttribute = false,
		components,
		drawMode,
		data;	

	/* Build the buffer */
	function build(dataIn, attrib, dataComponents) {
		data = dataIn || [];

		if (!data.length) {
			return console.error(data);
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
	}

	/* Bind the buffer */
	function bind() {		
		gl.enableVertexAttribArray(vertAttribute);
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.vertexAttribPointer(vertAttribute, components, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vertAttribute);
	}

	/* Render the buffer */
	function render(from, to, drawMode) {
		if (!buffer) {
			return console.error('opengl: tried rendering buffer, but no buffer defined');
		}

		if (!data.length) {
			return console.error('skipped vertex buffer rendering - data is empty');
		}
				
		if (!from || from > data.length || from < 0) {
			from = 0;
		}

		if (!to || to > data.length) {
			to = data.length;
		}

		drawMode = drawMode || 'points';

		gl.drawArrays(gl[drawMode.toUpperCase()], from / components, (to - from) / components); 
	}

	////////////////////////////////////////////////////////////////////////
	return {
		bind: bind,
		data: data,
		build: build,
		render: render
	};    	
}

//Keep the GL renderer somewhat isolated
/*
	Notes to self:
		- If we need varrying sizes for things (e.g. bubble charts) we can
		  use a vec3 instead, and use z as the size.
		- May be able to build a point map by rendering to a separate canvas
		  and encoding values in the color data.
		- If we need colors per. point/line we need a separate vertex buffer
		- Need to figure out a way to transform the data quicker

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
		//Things to draw as "rectangles"
		asRect = {
			'column': true,
			'area': true
		},
		//Render settings
		settings = {
			pointSize: 1,
			lineWidth: 2,
			fillColor: '#AA00AA',
			useAlpha: true	
		};

	////////////////////////////////////////////////////////////////////////////

	/*  Returns an orthographic perspective matrix
	 *  @param {number} width - the width of the viewport in pixels
	 *  @param {number} height - the height of the viewport in pixels
	 */
	function orthoMatrix(width, height) {        
		return [
			2 / width, 0, 0, 0,
			0, -(2 / height), 0, 0,
			0, 0, 1, 0,
			-1, 1, 0, 1
		];
	}

	function clear() {
		gl.clearColor(1.0, 1.0, 1.0, 0.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	function pushSeriesData(series) {
		var isRange = series.pointArrayMap && series.pointArrayMap.join(',') === 'low,high',
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
			xData = options.xData || series.processedXData,
			yData = options.yData || series.processedYData,
			useRaw = !xData,
			minVal,
			d = isStacked ? series.data : (rawData),
			maxVal;

		each(d, function (d, i) {
			var x,
				y,
				clientX,
				plotY,
				isNull,
				low,
				chartDestroyed = typeof chart.index === 'undefined',
				isYInside = true;

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
			x = d[0];
			y = d[1];

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
			if (maxVal < 0 && asRect[series.type]) {
				maxVal = y;
			}
			
			if (asRect[series.type]) {
				//Need to add an extra point here
				//gl.push(d[0], d[1] + series.yAxis.);
				exports.data.push(x);
				exports.data.push(minVal);
				exports.data.push(0);
			}
			
			data.push(x);					
			data.push(maxVal);			
			data.push(0);								
							
			if (asRect[series.type]) {
				//Need to add an extra point here
				//gl.push(d[0], d[1] + series.yAxis.);
				data.push(x);
				data.push(minVal);
				data.push(0);
			}

		});		
	}

	function pushSeries(s) {
		if (series.length > 0) {
			series[series.length - 1].to = data.length;
		}

		series.push({
			from: data.length,
			series: s 
		});

		//Add the series data
		pushSeriesData(s);
	}

	function flush() {
		series = [];
		exports.data = data = [];
	}

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

	function setThreshold(has, translation) {
		shader.setUniform('hasThreshold', has);
		shader.setUniform('translatedThreshold', translation);
	}

	/* Render the data */
	function render() {
		if (!gl || !width || !height) {
			console.error(
				'no valid gl context: w =', 
				width, 'h =', 
				height, 
				'gl =', 
				gl
			);
			return false;
		}		

		shader.bind();

		gl.lineWidth(settings.lineWidth);
		shader.setPointSize(settings.pointSize);

		//Build a single buffer for all series
		vbuffer.build(exports.data, 'aVertexPosition', 3);
		vbuffer.bind();

		//Render the series - this is a lot of draw calls
		each(series, function (s, i) {
			var options = s.series.options,
				yBottom = s.series.yAxis.getThreshold(threshold),
				threshold = options.threshold,
				hasThreshold = isNumber(threshold),
				translatedThreshold = yBottom,
				drawMode = 'line_strip',
				fillColor = s.series.fillOpacity ?
					new Color(s.series.color).setOpacity(pick(options.fillOpacity, 0.85)).get() :
					s.series.color,
				color = H.color(fillColor).rgba;			

			if (!settings.useAlpha) {
				color[3] = 1.0;
			}

			shader.setColor(color);
			setXAxis(s.series.xAxis);
			setYAxis(s.series.yAxis);
			setThreshold(hasThreshold, translatedThreshold);

			//Draw mode
			if (s.series.type === 'scatter') {
				drawMode = 'points';
			}

			//Do the actual rendering
			vbuffer.render(s.from, s.to, drawMode);
		});
	}
	
	function setSize(w, h) {
		width = w;
		height = h;
		shader.setPMatrix(orthoMatrix(width, height));
	}
	
	/* Init OpenGL */
	function init(canvas) {
		if (!canvas) {
			return false;
		}

		console.time('gl setup');

		gl = canvas.getContext('webgl');

		if (gl) {        	
			flush();
		}

		gl.enable(gl.BLEND);
		//gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.blendEquation(gl.FUNC_SUB);
		//gl.enable(gl.DEPTH_TEST);

		shader = GLShader(gl);		
		vbuffer = GLVertexBuffer(gl, shader);

		setSize(canvas.width, canvas.height);

		isInited = true;

		console.timeEnd('gl setup');
	}

	/* Check if we have a valid OGL context */
	function valid() {
		return gl !== false;
	}

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
		data: data
	};

	return exports;
}  

////////////////////////////////////////////////////////////////////////////////

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
each(['area', 'arearange', 'column', 'line', 'scatter', 'heatmap'], function (type) {
	if (plotOptions[type]) {
		plotOptions[type].boostThreshold = 5000;
	}
});

/**
 * Override a bunch of methods the same way. If the number of points is below the threshold,
 * run the original method. If not, check for a canvas version or do nothing.
 */
each(['translate', 'generatePoints', 'drawTracker', 'drawPoints', 'render'], function (method) {
	function branch(proceed) {
		var letItPass = this.options.stacking && (method === 'translate' || method === 'generatePoints');
		if ((this.processedXData || this.options.data).length < (this.options.boostThreshold || Number.MAX_VALUE) ||
				letItPass) {

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

	// A special case for some types - its translate method is already wrapped
	if (method === 'translate') {
		if (seriesTypes.column) {
			wrap(seriesTypes.column.prototype, method, branch);
		}
		if (seriesTypes.arearange) {
			wrap(seriesTypes.arearange.prototype, method, branch);
		}
		if (seriesTypes.heatmap) {
			wrap(seriesTypes.heatmap.prototype, method, branch);
		}
	}
});

/**
 * Do not compute extremes when min and max are set.
 * If we use this in the core, we can add the hook to hasExtremes to the methods directly.
 */
wrap(Series.prototype, 'getExtremes', function (proceed) {
	if (!this.hasExtremes()) {
		return proceed.apply(this, Array.prototype.slice.call(arguments, 1));
	}
});

// wrap(Series.prototype, 'setData', function (proceed) {
// 	if (!this.hasExtremes(true)) {
// 		proceed.apply(this, Array.prototype.slice.call(arguments, 1));
// 	}
// });

wrap(Series.prototype, 'processData', function (proceed) {
	if (!this.hasExtremes(true)) {
		proceed.apply(this, Array.prototype.slice.call(arguments, 1));
	}
});

// wrap(Point.prototype, 'haloPath', function (proceed, size) {
// 	var series = this.series,
// 		chart = series.chart;

// 	return chart.renderer.symbols.circle(
// 		series.xAxis.pos + Math.floor(this.plotX) - size,
// 		series.yAxis.pos + this.plotY - size,
// 		size * 2, 
// 		size * 2
// 	);
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

// wrap(Series.prototype, 'render', function (proceed) {
// 	if (this.drawGraph) {
// 		this.drawGraph();		
// 	}

// 	if (series.visible) {
// 		series.drawPoints();
// 	}
// });


H.extend(Series.prototype, {
	//This is totally a constructor, eslint.
	gl: GLRenderer(), //eslint-disable-line
	pointRange: 0,
	directTouch: false,
	allowDG: false, // No data grouping, let boost handle large data 
	hasExtremes: function (checkX) {
		var options = this.options,
			data = options.data,
			xAxis = this.xAxis && this.xAxis.options,
			yAxis = this.yAxis && this.yAxis.options;
		return data.length > (options.boostThreshold || Number.MAX_VALUE) && isNumber(yAxis.min) && isNumber(yAxis.max) &&
			(!checkX || (isNumber(xAxis.min) && isNumber(xAxis.max)));
	},

	/**
	 * If implemented in the core, parts of this can probably be shared with other similar
	 * methods in Highcharts.
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

	/**
	 * Create a hidden canvas to draw the graph on. The contents is later copied over 
	 * to an SVG image element.
	 */
	setUpContext: function (level) {
		var chart = this.chart,
			target = level === 'series' ? this : chart,
			width = chart.chartWidth,
			height = chart.chartHeight,
			swapXY = function (proceed, x, y, a, b, c, d) {
				proceed.call(this, y, x, a, b, c, d);
			};

		if (!target.canvas) {		
			target.canvas = doc.createElement('canvas');		
			target.image = target.renderer.image(
								'', 
								0, 
								0, 
								width, 
								height
							).add(target.seriesGroup || target.group);

			if (target.inverted) {
				each(['moveTo', 'lineTo', 'rect', 'arc'], function (fn) {
					wrap(ctx, fn, swapXY);
				});
			}
		}
		
		target.canvas.width = width;
		target.canvas.height = height;					
		
		if (!target.ogl) {
			target.ogl = GLRenderer();
			target.ogl.init(target.canvas);
			target.ogl.clear();
		}

		if (level !== 'series') {
			//this.group = target.seriesGroup;
			//this.group.toFront();

		}

		target.image.attr({
			x: 0,
			y: 0,
			width: width,
			height: height,
			style: {'pointer-events': 'none'}
		});
	},

	renderCanvas: function () {
		var series = this,
			options = series.options,
			chart = series.chart,
			xAxis = this.xAxis,
			yAxis = this.yAxis,
			ctx,
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
			cvsLineTo = options.lineWidth ? this.cvsLineTo : false,
		//	cvsMarker = r <= 1 ? this.cvsMarkerSquare : this.cvsMarkerCircle,
			enableMouseTracking = options.enableMouseTracking !== false,
		//	lastPoint,
			threshold = options.threshold,
			yBottom = yAxis.getThreshold(threshold),
			hasThreshold = isNumber(threshold),
			translatedThreshold = yBottom,
			doFill = this.fill,
			isRange = series.pointArrayMap && series.pointArrayMap.join(',') === 'low,high',
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
					new Color(series.color).setOpacity(pick(options.fillOpacity, 0.75)).get() :
					series.color,

			addKDPoint = function (clientX, plotY, i) {
				//Shaves off about 60ms in canvas-scatter test
				index = clientX + ',' + plotY;

				// The k-d tree requires series points. Reduce the amount of points, since the time to build the 
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
			}
			;			
			
		// If we are zooming out from SVG mode, destroy the graphics
		if (this.points || this.graph) {
			this.destroyGraphics();
		}

		this.markerGroup = series.plotGroup(
			'markerGroup',
			'markers',
			true,
			1,
			chart.seriesGroup
		);

		points = this.points = [];

		//Make sure we have a valid OGL context
		this.setUpContext();
		chart.ogl.pushSeries(series);		

		// Do not start building while drawing 
		series.buildKDTree = noop; 

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

					clientX = Math.round(xAxis.toPixels(x, true));

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
						plotY = Math.round(yAxis.toPixels(y, true));						
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

		// if (chart.ogl) {
		// 	//Need to transform the points. This is totally cache trashing
		// 	/*
		// 		Notes:
		// 			- The shader deals with translations
		// 			- Values passed to the shader are data values; not coords

		// 	*/
		// 	each(isStacked ? series.data : (rawData), function (d, i) {
		// 		var x,
		// 			y,
		// 			clientX,
		// 			plotY,
		// 			isNull,
		// 			low,
		// 			chartDestroyed = typeof chart.index === 'undefined',
		// 			isYInside = true;

		// 	// if (!chartDestroyed) {
		// 		if (useRaw) {
		// 			x = d[0];
		// 			y = d[1];
		// 		} else {
		// 			x = d;
		// 			y = yData[i];
		// 		}

		// 		// Resolve low and high for range series
		// 		if (isRange) {
		// 			if (useRaw) {
		// 				y = d.slice(1, 3);
		// 			}
		// 			low = y[0];
		// 			y = y[1];
		// 		} else if (isStacked) {
		// 			x = d.x;
		// 			y = d.stackY;
		// 			low = y - d.y;
		// 		}

		// 	// 	isNull = y === null;

		// 	// 	// Optimize for scatter zooming
		// 	// 	if (!requireSorting) {
		// 	// 		isYInside = y >= yMin && y <= yMax;
		// 	// 	}

		// 	// 	if (!isNull && x >= xMin && x <= xMax && isYInside) {

		// 	// 		//clientX = Math.round(xAxis.toPixels(x, true));

		// 	// 		if (sampling) {
		// 	// 			if (minI === undefined || x === lastClientX) {

		// 	// 				if (!isRange) {
		// 	// 					low = y;
		// 	// 				}

		// 	// 				if (maxI === undefined || y > maxVal) {
		// 	// 					maxVal = y;
		// 	// 					maxI = i;
		// 	// 				}

		// 	// 				if (minI === undefined || low < minVal) {
		// 	// 					minVal = low;
		// 	// 					minI = i;
		// 	// 				}
		// 	// 			}
						

		// 	// 			if (x !== lastClientX) { // Add points and reset
		// 	// 				if (minI !== undefined) { // then maxI is also a number
		// 	// 					//plotY = yAxis.toPixels(maxVal, true);
		// 	// 					//yBottom = yAxis.toPixels(minVal, true);							
		// 	// 					gl.push(x, maxVal, minVal, 1.0);
		// 	// 				}

		// 	// 				minI = maxI = undefined;
		// 	// 				lastClientX = x;
		// 	// 			}
		// 	// 		} else {
		// 	// 			//plotY = Math.round(yAxis.toPixels(y, true));						
		// 	// 			//addKDPoint(clientX, plotY, i);
		// 	// 			gl.push(x, maxVal, minVal);
		// 	// 		}
		// 	// 	} 
				
		// 	// 	wasNull = isNull && !connectNulls;
		// 	// }

		// 		x = d[0];
		// 		y = d[1];

		// 		if (!requireSorting) {
		// 			isYInside = y >= yMin && y <= yMax;
		// 		}

		// 		if (!y || !isYInside || x < xMin || x > xMax) {
		// 			return;
		// 		}

		// 		minVal = 0;
		// 		if (y < 0) {
		// 			minVal = y;
		// 		}

		// 		maxVal = 0;
		// 		if (y > 0) {
		// 			maxVal = y;
		// 		}
				
		// 		if (series.type === 'column') {
		// 			//Need to add an extra point here
		// 			//gl.push(d[0], d[1] + series.yAxis.);
		// 			chart.ogl.data.push(x);
		// 			chart.ogl.data.push(minVal);
		// 			chart.ogl.data.push(0);
		// 		}
				
		// 		chart.ogl.data.push(x);					
		// 		chart.ogl.data.push(maxVal);			
		// 		chart.ogl.data.push(0);								
								
		// 		if (series.type === 'column') {
		// 			//Need to add an extra point here
		// 			//gl.push(d[0], d[1] + series.yAxis.);
		// 			chart.ogl.data.push(x);
		// 			chart.ogl.data.push(minVal);
		// 			chart.ogl.data.push(0);
		// 		}

		// 	});
		// }	

		// Loop over the points to build the k-d tree
		eachAsync(
			isStacked ? series.data : (xData || rawData), 
			processPoint, 
			doneProcessing, 
			chart.renderer.forExport ? Number.MAX_VALUE : undefined
		);
	}
});

seriesTypes.scatter.prototype.cvsMarkerCircle = function (ctx, clientX, plotY, r) {
	ctx.moveTo(clientX, plotY);
	ctx.arc(clientX, plotY, r, 0, 2 * Math.PI, false);
};

// Rect is twice as fast as arc, should be used for small markers
seriesTypes.scatter.prototype.cvsMarkerSquare = function (ctx, clientX, plotY, r) {
	ctx.rect(clientX - r, plotY - r, r * 2, r * 2);
};
seriesTypes.scatter.prototype.fill = true;

extend(seriesTypes.area.prototype, {
	cvsDrawPoint: function (ctx, clientX, plotY, yBottom, lastPoint) {
		if (lastPoint && clientX !== lastPoint.clientX) {
			ctx.moveTo(lastPoint.clientX, lastPoint.yBottom);
			ctx.lineTo(lastPoint.clientX, lastPoint.plotY);
			ctx.lineTo(clientX, plotY);
			ctx.lineTo(clientX, yBottom);
		}
	},
	fill: true,
	fillOpacity: true,
	sampling: true
});

extend(seriesTypes.column.prototype, {
	cvsDrawPoint: function (ctx, clientX, plotY, yBottom) {
		ctx.rect(clientX - 1, plotY, 1, yBottom - plotY);
	},
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
		console.time('gl rendering');
		
		if (chart.ogl) {
			chart.ogl.render();
		}
		
		console.timeEnd('gl rendering');

		//console.log('points', chart.series[0].options.data.length);
		
		if (chart.image && chart.canvas) {
			chart.image.attr({ 
				href: chart.canvas.toDataURL('image/png') 
			});			
		}
	}

	function preRender() {
		var gl;

		if (!chart.canvas || !chart.ogl) {
			return;
		}

		chart.ogl.flush();

		//Clear ogl
		gl = chart.canvas.getContext('webgl');
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);	
	}

	addEvent(chart, 'predraw', preRender);
	//Blit to image when done redrawing
	addEvent(chart, 'render', canvasToSVG);
	//Handles the blitting on first render
	addEvent(chart, 'load', canvasToSVG);
});
