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
 * - Heatmap.
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
	var//Vertex shader source
		vertShade = [
			/* eslint-disable */
			'precision highp float;',
			
			'attribute vec2 aVertexPosition;',
			//'attribute float aXAxis;',
			//'attribute float aYAxis;',

			'uniform mat4 uPMatrix;',
			'uniform float pSize;',

			'uniform float xAxisTrans;',
			'uniform float xAxisMin;',
			'uniform float xAxisMinPad;',
			'uniform float xAxisPointRange;',
			'uniform float xAxisLen;',

			'uniform float yAxisTrans;',
			'uniform float yAxisMin;',
			'uniform float yAxisMinPad;',
			'uniform float yAxisPointRange;',
			'uniform float yAxisLen;',            

			'float translate(float val,',
							'float pointPlacement,',
							'float localA,',
							'float localMin,',
							'float minPixelPadding,',
							'float pointRange,',
							'float cvsOffset',
							'){',

				'float sign = -1.0;',

				'return sign * (val - localMin) * localA + cvsOffset + ',
					'(sign * minPixelPadding);',//' + localA * pointPlacement * pointRange;',
			'}',

			'float xToPixels(float value){',
				'return translate(value, 0.0, xAxisTrans, xAxisMin, xAxisMinPad, xAxisPointRange, xAxisLen);',
			'}',

			'float yToPixels(float value){',
				'return translate(value, 0.0, yAxisTrans, yAxisMin, yAxisMinPad, yAxisPointRange, yAxisLen);',
			'}',

			'void main(void) {',
				'gl_PointSize = pSize;',
				//'gl_Position = uPMatrix * vec4(aVertexPosition, 0.0, 1.0);',
				'gl_Position = uPMatrix * vec4(xToPixels(aVertexPosition.x), yToPixels(aVertexPosition.y), 0.0, 1.0);',
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
		//The shader program
		shaderProgram,
		//Uniform handle to the perspective matrix
		pUniform,
		//Uniform for point size
		psUniform,
		//Uniform for fill color
		fillColorUniform,

		//Vertex buffers - keyed on shader attribute name
		vbuffers = {},

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
		//Shader uniforms
		uniforms = {},
		//Render settings
		settings = {
			pointSize: 2,
			lineWidth: 1,
			drawMode: 'points',
			fillColor: '#AA00AA',
			useAlpha: false	
		};

	////////////////////////////////////////////////////////////////////////////

	/* Vertex Buffer abstraction */
	function VertexBuffer() {
		var buffer = false,
			vertAttribute = false,
			components,
			drawMode,
			data;

		/* Build the buffer */
		function build(dataIn, attrib, dataComponents, dMode) {
			data = dataIn || [];

			if (!data.length) {
				return console.error(data);
			}

			components = dataComponents || 2;
			drawMode = dMode || false;

			buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.bufferData(
				gl.ARRAY_BUFFER, 
				new Float32Array(data), 
				gl.STATIC_DRAW
			);

			vertAttribute = gl.getAttribLocation(shaderProgram, attrib);
			gl.enableVertexAttribArray(vertAttribute);
		}

		/* Render the buffer */
		function render() {
			if (!buffer) {
				return console.error('opengl: tried rendering buffer, but no buffer defined');
			}

			if (!data.length) {
				return console.error('skipped vertex buffer rendering - data is empty');
			}

			drawMode = drawMode || settings.drawMode;

			gl.enableVertexAttribArray(vertAttribute);
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.vertexAttribPointer(vertAttribute, components, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(vertAttribute);
			gl.drawArrays(gl[drawMode.toUpperCase()], 0, data.length / components); 
		}

		////////////////////////////////////////////////////////////////////////
		return {
			build: build,
			render: render
		};    	
	}

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

	/*  Returns an orthographic perspective matrix
	 *  @param {number} width - the width of the viewport in pixels
	 *  @param {number} height - the height of the viewport in pixels
	 */
	function orthoMatrix(width, height) {        
		return [
			2 / width, 0, 0, 0,
			0, -2 / height, 0, 0,
			0, 0, 50, 0,
			-1, 1, 0, 1
		];
	}

	function addVBuffer(attribName, dataIn, components, drawMode, uniforms) {
		vbuffers[attribName] = {
			data: dataIn || [],
			components: components,
			drawMode: drawMode,
			uniforms: uniforms
		};

		return vbuffers[attribName].data;
	}

	function clear() {
		gl.clearColor(1.0, 1.0, 1.0, 0.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	function flush() {
		exports.data = data = [];
	}

	/* Render the data */
	function render() {
		if (!gl || !width || !height) {
			console.error('no valid gl context: w =', width, 'h =', height, 'gl =', gl);
			return false;
		}

		var color = H.color(settings.fillColor).rgba;

		if (!settings.useAlpha) {
			color[3] = 1.0;
		}

		console.time('gl rendering');

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.enable(gl.BLEND);
		//gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.blendEquation(gl.FUNC_ADD);
		gl.enable(gl.DEPTH_TEST);

		createShader();

		gl.lineWidth(2);

		gl.uniformMatrix4fv(pUniform, false, orthoMatrix(width, height));
		gl.uniform1f(psUniform, settings.pointSize);
		gl.uniform4f(fillColorUniform, color[0] / 255.0, color[1] / 255.0, color[2] / 255.0, color[3]);

		addVBuffer('aVertexPosition', data);

		if (uniforms) {
			Object.keys(uniforms).forEach(function (uniform) {
				var u = pUniform = gl.getUniformLocation(shaderProgram, uniform);
				gl.uniform1f(u, uniforms[uniform]);
			});
		}

		Object.keys(vbuffers).forEach(function (attrib) {
			var def = vbuffers[attrib],
				//Prototype objects aren't the only things which constructs objects, eslint :'(
				buffer = VertexBuffer() //eslint-disable-line 
			;

		buffer.build(def.data, attrib, def.components, def.drawMode, def.uniforms);
			buffer.render();
		});

		console.timeEnd('gl rendering');
	}

	/* Add a vertex buffer */
	
	/* Init OpenGL */
	function init(canvas) {
		if (!canvas) {
			return false;
		}

		gl = canvas.getContext('webgl');
		width = canvas.width;
		height = canvas.height;

		if (gl) {        	
			clear();
			flush();
		}
	}

	/* Add data to render */
	function push(x, y, bottom) {
		data.push(x);
		data.push(y);

		if (bottom) {
			data.push(x);
			data.push(y + bottom);
			settings.drawMode = 'line_strip';
		}
	}

	/* Check if we have a valid OGL context */
	function valid() {
		return gl !== false;
	}	

	function setXAxis(axis) {
		//addVBuffer('aXAxis', data, 1, settings.drawMode);

		uniforms.xAxisTrans = axis.transA;
		uniforms.xAxisMin = axis.min;
		uniforms.xAxisMinPad = axis.minPixelPadding;
		uniforms.xAxisPointRange = axis.pointRange;
		uniforms.xAxisLen = axis.len;    
	}

	function setYAxis(axis) {
		//addVBuffer('aYAxis', data, 1, settings.drawMode);

		uniforms.yAxisTrans = axis.transA;
		uniforms.yAxisMin = axis.min;
		uniforms.yAxisMinPad = axis.minPixelPadding;
		uniforms.yAxisPointRange = axis.pointRange;
		uniforms.yAxisLen = axis.len;
	}

	////////////////////////////////////////////////////////////////////////////
	exports = {
		init: init,
		addVBuffer: addVBuffer,
		push: push,
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
		proceed.apply(this, Array.prototype.slice.call(arguments, 1));
	}
});
wrap(Series.prototype, 'setData', function (proceed) {
	if (!this.hasExtremes(true)) {
		proceed.apply(this, Array.prototype.slice.call(arguments, 1));
	}
});
wrap(Series.prototype, 'processData', function (proceed) {
	if (!this.hasExtremes(true)) {
		proceed.apply(this, Array.prototype.slice.call(arguments, 1));
	}
});

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
	getContext: function () {
		var chart = this.chart,
			width = chart.plotWidth,
			height = chart.plotHeight,
			ctx = this.ctx,
			swapXY = function (proceed, x, y, a, b, c, d) {
				proceed.call(this, y, x, a, b, c, d);
			};

		if (!this.canvas) {
			this.canvas = doc.createElement('canvas');
			this.image = chart.renderer.image('', 0, 0, width, height).add(this.group);

			//this.fobj = chart.renderer.createElement('foreignObject').add(this.group);			
			//this.fobj.element.appendChild(this.canvas);

			this.canvas.width = width;
			this.canvas.height = height;

			this.gl.init(this.canvas);
			
			if (!this.gl.valid()) {
				this.ctx = ctx = this.canvas.getContext('2d');				
			}

			if (chart.inverted) {
				each(['moveTo', 'lineTo', 'rect', 'arc'], function (fn) {
					wrap(ctx, fn, swapXY);
				});
			}
		} else {

			//ctx.clearRect(0, 0, width, height);
			if (!this.gl.valid()) {
				ctx.rect(0, 0, width, height);				
			} else {
				this.gl.flush();
			}
		}

		this.canvas.width = width;
		this.canvas.height = height;
	
		(this.image || this.fobj).attr({
			x: 0,
			y: 0,
			width: width,
			height: height
		});

		return ctx;
	},

	/** 
	 * Draw the canvas image inside an SVG image
	 */
	canvasToSVG: function () {
		if (this.image) {
			this.image.attr({ href: this.canvas.toDataURL('image/png') });			
		}
	},

	cvsLineTo: function (ctx, clientX, plotY) {
		ctx.lineTo(clientX, plotY);
	},

	renderCanvas: function () {
		var series = this,
			gl = this.gl,
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
			//hasThreshold = isNumber(threshold),
			//translatedThreshold = yBottom,
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
			// stroke = function () {
			// 	return (doFill ? ctx.fill() : ctx.stroke());
			// },
			// drawPoint = function (clientX, plotY, yBottom) {
			// 	if (c === 0) {
			// 		ctx.beginPath();
			// 	}

			// 	if (wasNull) {
			// 		ctx.moveTo(clientX, plotY);
			// 	} else {
			// 		if (cvsDrawPoint) {
			// 			cvsDrawPoint(ctx, clientX, plotY, yBottom, lastPoint);
			// 		} else if (cvsLineTo) {
			// 			cvsLineTo(ctx, clientX, plotY);
			// 		} else if (cvsMarker) {
			// 			cvsMarker(ctx, clientX, plotY, r);
			// 		}
			// 	}

			// 	// We need to stroke the line for every 1000 pixels. It will crash the browser
			// 	// memory use if we stroke too infrequently.			
			// 	if (++c === 1000) {
			// 		stroke();
			// 		c = 0;			
			// 	}

			// 	// Area charts need to keep track of the last point
			// 	lastPoint = {
			// 		clientX: clientX,
			// 		plotY: plotY,
			// 		yBottom: yBottom
			// 	};
			// },

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

		// The group
		series.plotGroup(
			'group',
			'series',
			series.visible ? 'visible' : 'hidden',
			options.zIndex,
			chart.seriesGroup
		);

		series.markerGroup = series.group;
		addEvent(series, 'destroy', function () {
			series.markerGroup = null;
		});

		points = this.points = [];
		ctx = this.getContext();
		series.buildKDTree = noop; // Do not start building while drawing 

		//We don't want to do state switches more often than needed,
		//so do it once
		if (!gl.valid()) {
			if (doFill) {
				ctx.fillStyle = fillColor;
			} else {
				ctx.strokeStyle = series.color;
				ctx.lineWidth = options.lineWidth;
			}			
		} 
		
		gl.settings.fillColor = series.color;
		if (!doFill) {
			gl.settings.lineWidth = options.lineWidth + 1;
			gl.settings.drawMode = 'line_strip';			
		}

		if (options.marker) {
			gl.settings.pointSize = options.marker.radius || 1;			
		}

		if (!gl.valid()) {
			if (cvsLineTo) {
				gl.settings.drawMode = 'line_strip';
				ctx.lineJoin = 'round';
			}			
		}

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
								plotY = 0;// yAxis.toPixels(maxVal, true);
								yBottom = 0;//yAxis.toPixels(minVal, true);

								//addKDPoint(clientX, plotY, maxI);
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
			// var loadingDiv = chart.loadingDiv,
			// 	loadingShown = chart.loadingShown;
			
			// if (gl.valid()) {			
			// 	gl.render();
			// } else {
			// 	stroke();
			// }

			// series.canvasToSVG();

			fireEvent(series, 'renderedCanvas');

			// Do not use chart.hideLoading, as it runs JS animation and will be blocked by buildKDTree.
			// CSS animation looks good, but then it must be deleted in timeout. If we add the module to core,
			// change hideLoading so we can skip this block.
			// if (loadingShown) {
			// 	extend(loadingDiv.style, {
			// 		transition: 'opacity 250ms',
			// 		opacity: 0
			// 	});
			// 	chart.loadingShown = false;
			// 	destroyLoadingDiv = setTimeout(function () {
			// 		if (loadingDiv.parentNode) { // In exporting it is falsy
			// 			loadingDiv.parentNode.removeChild(loadingDiv);
			// 		}
			// 		chart.loadingDiv = chart.loadingSpan = null;
			// 	}, 250);
			// }

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

		if (gl.valid()) {
	
			//var height = this.height;

			//Need to transform the points. This is totally cache trashing
			each(isStacked ? series.data : rawData, function (d) {
				//gl.push(d[0], d[1]);
				
				gl.data.push(d[0]);
				gl.data.push(d[1]);
				
				if (series.type === 'column') {
					//Need to add an extra point here
					//gl.push(d[0], d[1] + series.yAxis.);
				}
			});
			
			gl.setXAxis(series.xAxis, xData);
			gl.setYAxis(series.yAxis, yData);

			//Rendering is done in post proc for now
			gl.render();
			series.canvasToSVG();
			//fireEvent(series, 'renderedCanvas');

			//return true;
		}	
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
