/**
 * @license Map plugin v0.1 for Highcharts
 *
 * (c) 2011-2013 Torstein Hønsi
 *
 * License: www.highcharts.com/license
 */

/* 
 * See www.H.com/studies/world-map.htm for use case.
 *
 * To do:
 * - Optimize long variable names and alias adapter methods and Highcharts namespace variables
 * - Zoom and pan GUI
 */
/*global HighchartsAdapter*/
(function (H) {
	var UNDEFINED,
		Axis = H.Axis,
		Chart = H.Chart,
		Color = H.Color,
		Point = H.Point,
		Pointer = H.Pointer,
		Series = H.Series,
		SVGRenderer = H.SVGRenderer,
		VMLRenderer = H.VMLRenderer,
		
		symbols = SVGRenderer.prototype.symbols,
		each = H.each,
		extend = H.extend,
		extendClass = H.extendClass,
		merge = H.merge,
		pick = H.pick,
		numberFormat = H.numberFormat,
		defaultOptions = H.getOptions(),
		seriesTypes = H.seriesTypes,
		plotOptions = defaultOptions.plotOptions,
		wrap = H.wrap,
		noop = function () {};

	// Add language
	extend(defaultOptions.lang, {
		zoomIn: 'Zoom in',
		zoomOut: 'Zoom out'
	});

	/*
	 * Return an intermediate color between two colors, according to pos where 0
	 * is the from color and 1 is the to color
	 */
	function tweenColors(from, to, pos) {
		var i = 4,
			val,
			rgba = [];

		while (i--) {
			val = to.rgba[i] + (from.rgba[i] - to.rgba[i]) * (1 - pos);
			rgba[i] = i === 3 ? val : Math.round(val); // Do not round opacity
		}
		return 'rgba(' + rgba.join(',') + ')';
	}

	// Set the default map navigation options
	defaultOptions.mapNavigation = {
		buttonOptions: {
			alignTo: 'plotBox',
			align: 'left',
			verticalAlign: 'top',
			x: 0,
			width: 18,
			height: 18,
			style: {
				fontSize: '15px',
				fontWeight: 'bold',
				textAlign: 'center'
			},
			theme: {
				'stroke-width': 1
			}
		},
		buttons: {
			zoomIn: {
				onclick: function () {
					this.mapZoom(0.5);
				},
				text: '+',
				y: 0
			},
			zoomOut: {
				onclick: function () {
					this.mapZoom(2);
				},
				text: '-',
				y: 28
			}
		}
		// enabled: false,
		// enableButtons: null, // inherit from enabled
		// enableTouchZoom: null, // inherit from enabled
		// enableDoubleClickZoom: null, // inherit from enabled
		// enableDoubleClickZoomTo: false
		// enableMouseWheelZoom: null, // inherit from enabled
	};
	
	/**
	 * Utility for reading SVG paths directly.
	 */
	H.splitPath = function (path) {
		var i;

		// Move letters apart
		path = path.replace(/([A-Za-z])/g, ' $1 ');
		// Trim
		path = path.replace(/^\s*/, "").replace(/\s*$/, "");
		
		// Split on spaces and commas
		path = path.split(/[ ,]+/);
		
		// Parse numbers
		for (i = 0; i < path.length; i++) {
			if (!/[a-zA-Z]/.test(path[i])) {
				path[i] = parseFloat(path[i]);
			}
		}
		return path;
	};

	// A placeholder for map definitions
	H.maps = {};
	
	/**
	 * Override to use the extreme coordinates from the SVG shape, not the
	 * data values
	 */
	wrap(Axis.prototype, 'getSeriesExtremes', function (proceed) {
		var isXAxis = this.isXAxis,
			dataMin,
			dataMax,
			xData = [];

		// Remove the xData array and cache it locally so that the proceed method doesn't use it
		if (isXAxis) {
			each(this.series, function (series, i) {
				if (series.useMapGeometry) {
					xData[i] = series.xData;
					series.xData = [];
				}
			});
		}

		// Call base to reach normal cartesian series (like mappoint)
		proceed.call(this);

		// Run extremes logic for map and mapline
		if (isXAxis) {
			dataMin = pick(this.dataMin, Number.MAX_VALUE);
			dataMax = pick(this.dataMax, Number.MIN_VALUE);
			each(this.series, function (series, i) {
				if (series.useMapGeometry) {
					dataMin = Math.min(dataMin, pick(series.minX, dataMin));
					dataMax = Math.max(dataMax, pick(series.maxX, dataMin));
					series.xData = xData[i]; // Reset xData array
				}
			});
			
			this.dataMin = dataMin;
			this.dataMax = dataMax;
		}
	});
	
	/**
	 * Override axis translation to make sure the aspect ratio is always kept
	 */
	wrap(Axis.prototype, 'setAxisTranslation', function (proceed) {
		var chart = this.chart,
			mapRatio,
			plotRatio = chart.plotWidth / chart.plotHeight,
			isXAxis = this.isXAxis,
			adjustedAxisLength,
			xAxis = chart.xAxis[0],
			padAxis;
		
		// Run the parent method
		proceed.call(this);
		
		// On Y axis, handle both
		if (chart.options.chart.type === 'map' && !isXAxis && xAxis.transA !== UNDEFINED) {
			
			// Use the same translation for both axes
			this.transA = xAxis.transA = Math.min(this.transA, xAxis.transA);
			
			mapRatio = (xAxis.max - xAxis.min) / (this.max - this.min);
			
			// What axis to pad to put the map in the middle
			padAxis = mapRatio > plotRatio ? this : xAxis;
			
			// Pad it
			adjustedAxisLength = (padAxis.max - padAxis.min) * padAxis.transA;
			padAxis.minPixelPadding = (padAxis.len - adjustedAxisLength) / 2;
		}
	});

	// Extend the Pointer
	extend(Pointer.prototype, {

		/**
		 * The event handler for the doubleclick event
		 */
		onContainerDblClick: function (e) {
			var chart = this.chart;

			e = this.normalize(e);

			if (chart.options.mapNavigation.enableDoubleClickZoomTo) {
				if (chart.pointer.inClass(e.target, 'highcharts-tracker')) {
					chart.zoomToShape(chart.hoverPoint);
				}
			} else if (chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop)) {
				chart.mapZoom(
					0.5,
					chart.xAxis[0].toValue(e.chartX),
					chart.yAxis[0].toValue(e.chartY)
				);
			}
		},

		/**
		 * The event handler for the mouse scroll event
		 */
		onContainerMouseWheel: function (e) {
			var chart = this.chart,
				delta;

			e = this.normalize(e);

			// Firefox uses e.detail, WebKit and IE uses wheelDelta
			delta = e.detail || -(e.wheelDelta / 120);
			if (chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop)) {
				chart.mapZoom(
					delta > 0 ? 2 : 0.5,
					chart.xAxis[0].toValue(e.chartX),
					chart.yAxis[0].toValue(e.chartY)
				);
			}
		}
	});
	
	// Implement the pinchType option
	wrap(Pointer.prototype, 'init', function (proceed, chart, options) {

		proceed.call(this, chart, options);

		// Pinch status
		if (pick(options.mapNavigation.enableTouchZoom, options.mapNavigation.enabled)) {
			this.pinchX = this.pinchHor = 
				this.pinchY = this.pinchVert = true;
		}
	});

	// Extend the pinchTranslate method to preserve fixed ratio when zooming
	wrap(Pointer.prototype, 'pinchTranslate', function (proceed, zoomHor, zoomVert, pinchDown, touches, transform, selectionMarker, clip, lastValidTouch) {
		var xBigger;

		proceed.call(this, zoomHor, zoomVert, pinchDown, touches, transform, selectionMarker, clip, lastValidTouch);

		// Keep ratio
		if (this.chart.options.chart.type === 'map') {
			xBigger = transform.scaleX > transform.scaleY;
			this.pinchTranslateDirection(
				!xBigger, 
				pinchDown, 
				touches, 
				transform, 
				selectionMarker, 
				clip, 
				lastValidTouch, 
				xBigger ? transform.scaleX : transform.scaleY
			);
		}
	});


	/**
	 * The ColorAxis object for inclusion in gradient legends
	 */
	var ColorAxis = H.ColorAxis = function () {
		this.init.apply(this, arguments);
	};
	extend(ColorAxis.prototype, Axis.prototype);
	extend(ColorAxis.prototype, {
		defaultColorAxisOptions: {
			lineWidth: 0,
			gridLineWidth: 1,
			tickPixelInterval: 70,
			startOnTick: true,
			endOnTick: true,
			offset: 0,
			crosshair: { // docs: use another name?
				animation: {
					duration: 50
				},
				color: 'gray',
				width: 0.01
			},
			labels: {
				overflow: 'justify'
			}
		},
		init: function (chart, userOptions) {
			var horiz = chart.options.legend.layout !== 'vertical',
				options;

			// Build the options
			options = merge(this.defaultColorAxisOptions, {
				side: horiz ? 2 : 1,
				reversed: !horiz
			}, userOptions, {
				isX: horiz,
				opposite: !horiz,
				showEmpty: false,
				title: null
			});

			Axis.prototype.init.call(this, chart, options);

			// Base init() pushes it to the xAxis array, now pop it again
			chart[this.isXAxis ? 'xAxis' : 'yAxis'].pop();

			// Override original axis properties
			this.isXAxis = true;
			this.horiz = horiz;
		},
		setAxisSize: function () {
			var symbol = this.series.length && this.series[0].legendSymbol,
				chart = this.chart;

			if (symbol) {
				this.left = symbol.x;
				this.top = symbol.y;
				this.width = symbol.width;
				this.height = symbol.height;
				this.right = chart.chartWidth - this.left - this.width;
				this.bottom = chart.chartHeight - this.top - this.height;

				this.len = this.horiz ? this.width : this.height;
				this.pos = this.horiz ? this.left : this.top;
			}
		},
		getOffset: function () {
			if (this.series.length) {
				var group = this.series[0].legendGroup;
				Axis.prototype.getOffset.call(this);
				if (!this.added) {

					// Move the axis elements inside the legend group
					this.axisGroup.add(group);
					this.gridGroup.add(group);
					this.labelGroup.add(group);

					this.added = true;
				}
			}
		},
		getSeriesExtremes: function () {
			var series = this.series[0];
			this.dataMin = series.valueMin;
			this.dataMax = series.valueMax;
		},
		drawCrosshair: function (e, point) {
			var newCross = !this.cross,
				plotX = point && point.plotX,
				plotY = point && point.plotY,
				crossPos,
				axisPos = this.pos,
				axisLen = this.len;
			
			if (point) {
				crossPos = this.toPixels(point.value);
				if (crossPos < axisPos) {
					crossPos = axisPos - 2;
				} else if (crossPos > axisPos + axisLen) {
					crossPos = axisPos + axisLen + 2;
				}
				
				point.plotX = crossPos;
				point.plotY = this.len - crossPos;
				Axis.prototype.drawCrosshair.call(this, e, point);
				point.plotX = plotX;
				point.plotY = plotY;
				
				if (!newCross && this.cross) {
					this.cross
						.attr({
							fill: this.crosshair.color
						})
						.add(this.labelGroup);
				}
			}
		},
		getPlotLinePath: function (a, b, c, d, pos) {
			if (pos) { // crosshairs only
				return this.horiz ? 
					['M', pos - 4, this.top - 6, 'L', pos + 4, this.top - 6, pos, this.top, 'Z'] : 
					['M', this.left, pos, 'L', this.left - 6, pos + 6, this.left - 6, pos - 6, 'Z'];
			} else {
				return Axis.prototype.getPlotLinePath.call(this, a, b, c, d);
			}
		}
	});


	// Add events to the Chart object itself
	extend(Chart.prototype, {
		renderMapNavigation: function () {
			var chart = this,
				options = this.options.mapNavigation,
				buttons = options.buttons,
				n,
				button,
				buttonOptions,
				attr,
				states,
				outerHandler = function () { 
					this.handler.call(chart); 
				};

			if (pick(options.enableButtons, options.enabled)) {
				for (n in buttons) {
					if (buttons.hasOwnProperty(n)) {
						buttonOptions = merge(options.buttonOptions, buttons[n]);
						attr = buttonOptions.theme;
						states = attr.states;
						button = chart.renderer.button(
								buttonOptions.text, 
								0, 
								0, 
								outerHandler, 
								attr, 
								states && states.hover,
								states && states.select, 
								0, 
								n === 'zoomIn' ? 'topbutton' : 'bottombutton'
							)
							.attr({
								width: buttonOptions.width,
								height: buttonOptions.height,
								title: chart.options.lang[n],
								zIndex: 5
							})
							.css(buttonOptions.style)
							.add();
						button.handler = buttonOptions.onclick;
						button.align(extend(buttonOptions, { width: button.width, height: 2 * button.height }), null, buttonOptions.alignTo);
					}
				}
			}
		},

		/**
		 * Fit an inner box to an outer. If the inner box overflows left or right, align it to the sides of the
		 * outer. If it overflows both sides, fit it within the outer. This is a pattern that occurs more places
		 * in Highcharts, perhaps it should be elevated to a common utility function.
		 */
		fitToBox: function (inner, outer) {
			each([['x', 'width'], ['y', 'height']], function (dim) {
				var pos = dim[0],
					size = dim[1];

				if (inner[pos] + inner[size] > outer[pos] + outer[size]) { // right overflow
					if (inner[size] > outer[size]) { // the general size is greater, fit fully to outer
						inner[size] = outer[size];
						inner[pos] = outer[pos];
					} else { // align right
						inner[pos] = outer[pos] + outer[size] - inner[size];
					}
				}
				if (inner[size] > outer[size]) {
					inner[size] = outer[size];
				}
				if (inner[pos] < outer[pos]) {
					inner[pos] = outer[pos];
				}
			});
			

			return inner;
		},

		/**
		 * Zoom the map in or out by a certain amount. Less than 1 zooms in, greater than 1 zooms out.
		 */
		mapZoom: function (howMuch, centerXArg, centerYArg) {

			if (this.isMapZooming) {
				return;
			}

			var chart = this,
				xAxis = chart.xAxis[0],
				xRange = xAxis.max - xAxis.min,
				centerX = pick(centerXArg, xAxis.min + xRange / 2),
				newXRange = xRange * howMuch,
				yAxis = chart.yAxis[0],
				yRange = yAxis.max - yAxis.min,
				centerY = pick(centerYArg, yAxis.min + yRange / 2),
				newYRange = yRange * howMuch,
				newXMin = centerX - newXRange / 2,
				newYMin = centerY - newYRange / 2,
				animation = pick(chart.options.chart.animation, true),
				delay,
				newExt = chart.fitToBox({
					x: newXMin,
					y: newYMin,
					width: newXRange,
					height: newYRange
				}, {
					x: xAxis.dataMin,
					y: yAxis.dataMin,
					width: xAxis.dataMax - xAxis.dataMin,
					height: yAxis.dataMax - yAxis.dataMin
				});

			xAxis.setExtremes(newExt.x, newExt.x + newExt.width, false);
			yAxis.setExtremes(newExt.y, newExt.y + newExt.height, false);

			// Prevent zooming until this one is finished animating
			delay = animation ? animation.duration || 500 : 0;
			if (delay) {
				chart.isMapZooming = true;
				setTimeout(function () {
					chart.isMapZooming = false;
				}, delay);
			}
			

			chart.redraw();
		},

		/**
		 * Zoom the chart to view a specific area point
		 */
		zoomToShape: function (point) {
			var series = point.series,
				chart = series.chart;

			series.xAxis.setExtremes(
				point._minX,
				point._maxX,
				false
			);
			series.yAxis.setExtremes(
				point._minY,
				point._maxY,
				false
			);
			chart.redraw();
		}
	});

	/**
	 * Extend the chart getAxes method to also get the color axis
	 */
	wrap(Chart.prototype, 'getAxes', function (proceed) {

		var options = this.options,
			colorAxisOptions = options.colorAxis;

		proceed.call(this);

		this.colorAxis = [];
		if (colorAxisOptions) {
			this.colorAxis.push(new ColorAxis(this, colorAxisOptions));
		}
	});

	/**
	 * Extend the Chart.render method to add zooming and panning
	 */
	wrap(Chart.prototype, 'render', function (proceed) {
		var chart = this,
			mapNavigation = chart.options.mapNavigation;

		proceed.call(chart);

		// Render the plus and minus buttons
		chart.renderMapNavigation();

		// Add the double click event
		if (pick(mapNavigation.enableDoubleClickZoom, mapNavigation.enabled) || mapNavigation.enableDoubleClickZoomTo) {
			H.addEvent(chart.container, 'dblclick', function (e) {
				chart.pointer.onContainerDblClick(e);
			});
		}

		// Add the mousewheel event
		if (pick(mapNavigation.enableMouseWheelZoom, mapNavigation.enabled)) {
			H.addEvent(chart.container, document.onmousewheel === undefined ? 'DOMMouseScroll' : 'mousewheel', function (e) {
				chart.pointer.onContainerMouseWheel(e);
			});
		}
	});


	
	/**
	 * Extend the default options with map options
	 */
	plotOptions.map = merge(plotOptions.scatter, {
		allAreas: true,
		animation: false, // makes the complex shapes slow
		nullColor: '#F8F8F8',
		borderColor: 'silver',
		borderWidth: 1,
		marker: null,
		stickyTracking: false,
		dataLabels: {
			verticalAlign: 'middle'
		},
		turboThreshold: 0,
		tooltip: {
			followPointer: true,
			pointFormat: '{point.name}: {point.value}<br/>'
		},
		states: {
			normal: {
				animation: true
			}
		}
	});

	/**
	 * The MapAreaPoint object
	 */
	var MapAreaPoint = extendClass(Point, {
		/**
		 * Extend the Point object to split paths
		 */
		applyOptions: function (options, x) {

			var point = Point.prototype.applyOptions.call(this, options, x),
				series = this.series,
				seriesOptions = series.options,
				joinBy = seriesOptions.joinBy,
				mapPoint;

			if (joinBy && seriesOptions.mapData) {
				mapPoint = series.getMapData(joinBy, point[joinBy]);
					
				if (mapPoint) {
					// This applies only to bubbles
					if (series.xyFromShape) {
						point.x = mapPoint._midX;
						point.y = mapPoint._midY;
					}
					extend(point, mapPoint); // copy over properties
				} else {
					point.value = point.value || null;
				}
			}
			
			return point;
		},

		/**
		 * Set the visibility of a single map area
		 */
		setVisible: function (vis) {
			var point = this,
				method = vis ? 'show' : 'hide';

			// Show and hide associated elements
			each(['graphic', 'dataLabel'], function (key) {
				if (point[key]) {
					point[key][method]();
				}
			});
		},

		/**
		 * Stop the fade-out 
		 */
		onMouseOver: function (e) {
			clearTimeout(this.colorInterval);
			Point.prototype.onMouseOver.call(this, e);
		},
		/**
		 * Custom animation for tweening out the colors. Animation reduces blinking when hovering
		 * over islands and coast lines. We run a custom implementation of animation becuase we
		 * need to be able to run this independently from other animations like zoom redraw. Also,
		 * adding color animation to the adapters would introduce almost the same amount of code.
		 */
		onMouseOut: function () {
			var point = this,
				start = +new Date(),
				normalColor = Color(point.options.color),
				hoverColor = Color(point.pointAttr.hover.fill),
				animation = point.series.options.states.normal.animation,
				duration = animation && (animation.duration || 500);

			if (duration && normalColor.rgba.length === 4 && hoverColor.rgba.length === 4) {
				delete point.pointAttr[''].fill; // avoid resetting it in Point.setState

				clearTimeout(point.colorInterval);
				point.colorInterval = setInterval(function () {
					var pos = (new Date() - start) / duration,
						graphic = point.graphic;
					if (pos > 1) {
						pos = 1;
					}
					if (graphic) {
						graphic.attr('fill', tweenColors(hoverColor, normalColor, pos));
					}
					if (pos >= 1) {
						clearTimeout(point.colorInterval);
					}
				}, 13);
			}
			Point.prototype.onMouseOut.call(point);
		}
	});

	/**
	 * Add the series type
	 */
	seriesTypes.map = extendClass(seriesTypes.scatter, {
		type: 'map',
		pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
			stroke: 'borderColor',
			'stroke-width': 'borderWidth',
			fill: 'color'
		},
		pointClass: MapAreaPoint,
		axisTypes: ['xAxis', 'yAxis', 'colorAxis'],
		optionalAxis: 'colorAxis',
		trackerGroups: ['group', 'markerGroup', 'dataLabelsGroup'],
		getSymbol: noop,
		supportsDrilldown: true,
		getExtremesFromAll: true,
		useMapGeometry: true, // get axis extremes from paths, not values
		parallelArrays: ['x', 'y', 'value'],
		init: function (chart) {
			var series = this,
				legendOptions = chart.options.legend,
				valueDecimals = legendOptions.valueDecimals,
				valueSuffix = legendOptions.valueSuffix || '',
				legendItems = [],
				name,
				from,
				to,
				valueRanges;

			
			Series.prototype.init.apply(this, arguments);
			valueRanges = series.options.valueRanges;

			if (valueRanges) {
				each(valueRanges, function (range, i) {
					var vis = true;
					from = range.from;
					to = range.to;
					
					// Assemble the default name. This can be overridden by legend.options.labelFormatter
					name = '';
					if (from === UNDEFINED) {
						name = '< ';
					} else if (to === UNDEFINED) {
						name = '> ';
					}
					if (from !== UNDEFINED) {
						name += numberFormat(from, valueDecimals) + valueSuffix;
					}
					if (from !== UNDEFINED && to !== UNDEFINED) {
						name += ' - ';
					}
					if (to !== UNDEFINED) {
						name += numberFormat(to, valueDecimals) + valueSuffix;
					}
					
					// Add a mock object to the legend items
					legendItems.push(H.extend({
						chart: series.chart,
						name: name,
						options: {},
						drawLegendSymbol: H.LegendSymbolMixin.drawRectangle,
						visible: true,
						setState: noop,
						setVisible: function () {
							vis = this.visible = !vis;
							each(series.points, function (point) {
								if (point.valueRange === i) {
									point.setVisible(vis);
								}
							});
							
							chart.legend.colorizeItem(this, vis);
						}
					}, range));
				});
				series.legendItems = legendItems;

			} 
		},

		/**
		 * Extend bindAxes to also bind the color axis if defined. This implementation
		 * doesn't handle linking series to axis by id or index like for xAxis and yAxis,
		 * because running the parent bindAxes method throws an error 18 when a colorAxis
		 * is not defined. In order to use that, we need to prevent calling error 18.
		 */
		/*bindAxes: function () {
			var colorAxis = this.chart.colorAxis[0];

			Series.prototype.bindAxes.call(this);

			if (colorAxis) {
				this.colorAxis = colorAxis;
				colorAxis.series.push(this);
			}
		},*/

		/**
		 * Gets the series' symbol in the legend and extended legend with more information.
		 * 
		 * @param {Object} legend The legend object
		 * @param {Object} item The series (this) or point
		 */
		drawLegendSymbol: function (legend, item) {

			if (!this.colorAxis) {
				H.LegendSymbolMixin.drawRectangle.call(this, legend, item);
			
			} else {

				var padding = legend.padding,
					legendOptions = legend.options,
					horiz = legendOptions.layout === 'horizontal',
					box,
					width = pick(legendOptions.symbolWidth, horiz ? 200 : 12),
					height = pick(legendOptions.symbolHeight, horiz ? 12 : 200),
					labelPadding = pick(legendOptions.labelPadding, horiz ? 10 : 30),
					colorAxis = this.colorAxis.options,
					grad;


				// Create the color gradient
				grad = horiz ? [0, 0, 1, 0] : [0, 0, 0, 1]; 
				this.legendColor = {
					linearGradient: { x1: grad[0], y1: grad[1], x2: grad[2], y2: grad[3] },
					stops: colorAxis.stops || [
						[0, colorAxis.minColor],
						[1, colorAxis.maxColor]
					]
				};

				// Don't show the series name
				legendOptions.labelFormatter = noop;

				// Create the gradient
				item.legendSymbol = this.chart.renderer.rect(
					0,
					legend.baseline - 11,
					width,
					height
				).attr({
					zIndex: 1
				}).add(item.legendGroup);
				box = item.legendSymbol.getBBox();

				// Set how much space this legend item takes up
				this.legendItemWidth = width + padding + (horiz ? 0 : labelPadding);
				this.legendItemHeight = height + padding + (horiz ? labelPadding : 0);
			}
		},


		/**
		 * Get the bounding box of all paths in the map combined.
		 */
		getBox: function (paths) {
			var maxX = Number.MIN_VALUE, 
				minX =  Number.MAX_VALUE, 
				maxY = Number.MIN_VALUE, 
				minY =  Number.MAX_VALUE,
				hasBox;
			
			// Find the bounding box
			each(paths || [], function (point) {

				if (point.path) {
					if (typeof point.path === 'string') {
						point.path = H.splitPath(point.path);
					}

					var path = point.path || [],
						i = path.length,
						even = false, // while loop reads from the end
						pointMaxX = Number.MIN_VALUE, 
						pointMinX =  Number.MAX_VALUE, 
						pointMaxY = Number.MIN_VALUE, 
						pointMinY =  Number.MAX_VALUE;

					// The first time a map point is used, analyze its box
					if (!point._foundBox) {
						while (i--) {
							if (typeof path[i] === 'number' && !isNaN(path[i])) {
								if (even) { // even = x
									pointMaxX = Math.max(pointMaxX, path[i]);
									pointMinX = Math.min(pointMinX, path[i]);
								} else { // odd = Y
									pointMaxY = Math.max(pointMaxY, path[i]);
									pointMinY = Math.min(pointMinY, path[i]);
								}
								even = !even;
							}
						}
						// Cache point bounding box for use to position data labels, bubbles etc
						point._midX = pointMinX + (pointMaxX - pointMinX) * (point.middleX || 0.5); // pick is slower and very marginally needed
						point._midY = pointMinY + (pointMaxY - pointMinY) * (point.middleY || 0.5);
						point._maxX = pointMaxX;
						point._minX = pointMinX;
						point._maxY = pointMaxY;
						point._minY = pointMinY;
						point._foundBox = true;
					}

					maxX = Math.max(maxX, point._maxX);
					minX = Math.min(minX, point._minX);
					maxY = Math.max(maxY, point._maxY);
					minY = Math.min(minY, point._minY);

					hasBox = true;
				}
			});

			// Set the box for the whole series
			if (hasBox) {
				this.minY = Math.min(minY, pick(this.minY, Number.MAX_VALUE));
				this.maxY = Math.max(maxY, pick(this.maxY, Number.MIN_VALUE));
				this.minX = Math.min(minX, pick(this.minX, Number.MAX_VALUE));
				this.maxX = Math.max(maxX, pick(this.maxX, Number.MIN_VALUE));
			}
		},
		
		getExtremes: function () {
			// Get the actual value extremes for colors
			Series.prototype.getExtremes.call(this, this.valueData);
			this.valueMin = this.dataMin;
			this.valueMax = this.dataMax;

			// Extremes for the mock Y axis
			this.dataMin = this.minY;
			this.dataMax = this.maxY;
		},
		
		/**
		 * Translate the path so that it automatically fits into the plot area box
		 * @param {Object} path
		 */
		translatePath: function (path) {
			
			var series = this,
				even = false, // while loop reads from the end
				xAxis = series.xAxis,
				yAxis = series.yAxis,
				xMin = xAxis.min,
				xTransA = xAxis.transA,
				xMinPixelPadding = xAxis.minPixelPadding,
				yMin = yAxis.min,
				yTransA = yAxis.transA,
				yMinPixelPadding = yAxis.minPixelPadding,
				i,
				ret = []; // Preserve the original

			// Do the translation
			if (path) {
				i = path.length;
				while (i--) {
					if (typeof path[i] === 'number') {
						ret[i] = even ? 
							(path[i] - xMin) * xTransA + xMinPixelPadding :
							(path[i] - yMin) * yTransA + yMinPixelPadding;
						even = !even;
					} else {
						ret[i] = path[i];
					}
				}
			}

			return ret;
		},
		
		/**
		 * Extend setData to join in mapData. If the allAreas option is true, all areas 
		 * from the mapData are used, and those that don't correspond to a data value
		 * are given null values.
		 */
		setData: function (data, redraw) {
			var options = this.options,
				mapData = options.mapData,
				joinBy = options.joinBy,
				dataUsed = [];
			

			this.getBox(data);
			this.getBox(mapData);
			if (options.allAreas && mapData) {

				data = data || [];

				// Registered the point codes that actually hold data
				if (joinBy) {
					each(data, function (point) {
						dataUsed.push(point[joinBy]);
					});
				}

				// Add those map points that don't correspond to data, which will be drawn as null points
				dataUsed = '|' + dataUsed.join('|') + '|'; // String search is faster than array.indexOf 
				each(mapData, function (mapPoint) {
					if (!joinBy || dataUsed.indexOf('|' + mapPoint[joinBy] + '|') === -1) {
						data.push(merge(mapPoint, { value: null }));
					}
				});
			}
			Series.prototype.setData.call(this, data, redraw);
		},

		/**
		 * For each point, get the corresponding map data
		 */
		getMapData: function (key, value) {
			var options = this.options,
				mapData = options.mapData,
				mapMap = this.mapMap,
				i = mapData.length;

			// Create a cache for quicker lookup second time
			if (!mapMap) {
				mapMap = this.mapMap = {};
			}
			if (mapMap[value] !== undefined) {
				return mapData[mapMap[value]];

			} else if (value !== undefined) {
				while (i--) {
					if (mapData[i][key] === value) {
						mapMap[value] = i; // cache it
						return mapData[i];
					}
				}
			}
		},
		
		/**
		 * Add the path option for data points. Find the max value for color calculation.
		 */
		translate: function () {
			var series = this,
				xAxis = series.xAxis,
				yAxis = series.yAxis,
				doAnimation = series.chart.pointCount < 100;
	
			series.generatePoints();
	
			each(series.data, function (point) {
				
				var display = doAnimation || 
					(point._maxX > xAxis.min &&
					point._minX < xAxis.max &&
					point._maxY > yAxis.min &&
					point._minY < yAxis.max);

				point.shapeType = 'path';
				point.shapeArgs = {
					d: display ? series.translatePath(point.path) : ''
				};
			});
			
			series.translateColors();
		},
		
		/**
		 * In choropleth maps, the color is a result of the value, so this needs translation too
		 */
		translateColors: function () {
			
			var seriesOptions = this.options,
				valueRanges = seriesOptions.valueRanges,
				colorAxis = this.colorAxis,
				nullColor = seriesOptions.nullColor,
				from,
				to,
				valueMin,
				valueMax,
				stops;

			if (colorAxis) {
				stops = colorAxis.options.stops || [
					[0, colorAxis.options.minColor],
					[1, colorAxis.options.maxColor]
				];
				each(stops, function (stop) {
					stop.color = Color(stop[1]);
				});
				valueMin = colorAxis.min;
				valueMax = colorAxis.max;
			}
			each(this.data, function (point) {
				var value = point.value,
					isNull = value === null,
					range,
					color,
					i,
					pos;

				if (valueRanges) {
					i = valueRanges.length;
					if (isNull) {
						color = nullColor;
					} else {
						while (i--) {
							range = valueRanges[i];
							from = range.from;
							to = range.to;
							if ((from === UNDEFINED || value >= from) && (to === UNDEFINED || value <= to)) {
								color = range.color;
								break;
							}	
						}
						point.valueRange = i;
					}
				} else if (colorAxis && !isNull) {
					if (colorAxis.isLog) {
						value = colorAxis.val2lin(value);
					}
					pos = 1 - ((valueMax - value) / (valueMax - valueMin));
					i = stops.length;
					while (i--) {
						if (pos > stops[i][0]) {
							break;
						}
					}
					from = stops[i] || stops[i + 1];
					to = stops[i + 1] || from;

					// The position within the gradient
					pos = 1 - (to[0] - pos) / ((to[0] - from[0]) || 1);
					
					color = tweenColors(
						from.color, 
						to.color,
						pos
					);
				} else if (isNull) {
					color = nullColor;
				} 

				if (color) {
					point.color = null; // reset from previous drilldowns, use of the same data options
					point.options.color = color;
				}
			});
		},
		
		drawGraph: noop,
		
		/**
		 * We need the points' bounding boxes in order to draw the data labels, so 
		 * we skip it now and call it from drawPoints instead.
		 */
		drawDataLabels: noop,
		
		/** 
		 * Use the drawPoints method of column, that is able to handle simple shapeArgs.
		 * Extend it by assigning the tooltip position.
		 */
		drawPoints: function () {
			var series = this,
				xAxis = series.xAxis,
				yAxis = series.yAxis;
			
			// Make points pass test in drawing // TODO: check with point.value
			each(series.data, function (point) {
				point.plotY = 1; // pass null test in column.drawPoints
			});
			
			// Draw them
			seriesTypes.column.prototype.drawPoints.apply(series);
			
			each(series.data, function (point) {

				// Record the middle point (loosely based on centroid), determined
				// by the middleX and middleY options.
				point.plotX = xAxis.toPixels(point._midX, true);
				point.plotY = yAxis.toPixels(point._midY, true);
			});

			// Now draw the data labels
			Series.prototype.drawDataLabels.call(series);
			
		},

		/**
		 * Animate in the new series from the clicked point in the old series.
		 * Depends on the drilldown.js module
		 */
		animateDrilldown: function (init) {
			var toBox = this.chart.plotBox,
				level = this.chart.drilldownLevels[this.chart.drilldownLevels.length - 1],
				fromBox = level.bBox,
				animationOptions = this.chart.options.drilldown.animation,
				scale;
				
			if (!init) {

				scale = Math.min(fromBox.width / toBox.width, fromBox.height / toBox.height);
				level.shapeArgs = {
					scaleX: scale,
					scaleY: scale,
					translateX: fromBox.x,
					translateY: fromBox.y
				};
				
				// TODO: Animate this.group instead
				each(this.points, function (point) {

					point.graphic
						.attr(level.shapeArgs)
						.animate({
							scaleX: 1,
							scaleY: 1,
							translateX: 0,
							translateY: 0
						}, animationOptions);

				});

				delete this.animate;
			}
			
		},

		/**
		 * When drilling up, pull out the individual point graphics from the lower series
		 * and animate them into the origin point in the upper series.
		 */
		animateDrillupFrom: function (level) {
			seriesTypes.column.prototype.animateDrillupFrom.call(this, level);
		},


		/**
		 * When drilling up, keep the upper series invisible until the lower series has
		 * moved into place
		 */
		animateDrillupTo: function (init) {
			seriesTypes.column.prototype.animateDrillupTo.call(this, init);
		}
	});


	// The mapline series type
	plotOptions.mapline = merge(plotOptions.map, {
		lineWidth: 1,
		backgroundColor: 'none'
	});
	seriesTypes.mapline = extendClass(seriesTypes.map, {
		type: 'mapline',
		pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
			stroke: 'color',
			'stroke-width': 'lineWidth',
			fill: 'backgroundColor'
		},
		drawLegendSymbol: seriesTypes.line.prototype.drawLegendSymbol
	});

	// The mappoint series type
	plotOptions.mappoint = merge(plotOptions.scatter, {
		dataLabels: {
			enabled: true,
			format: '{point.name}',
			color: 'black',
			style: {
				textShadow: '0 0 5px white'
			}
		}
	});
	seriesTypes.mappoint = extendClass(seriesTypes.scatter, {
		type: 'mappoint'
	});

	// The mapbubble series type
	if (seriesTypes.bubble) {

		plotOptions.mapbubble = merge(plotOptions.bubble, {
			tooltip: {
				pointFormat: '{point.name}: {point.z}'
			}
		});
		seriesTypes.mapbubble = extendClass(seriesTypes.bubble, {
			pointClass: extendClass(Point, {
				applyOptions: MapAreaPoint.prototype.applyOptions
			}),
			xyFromShape: true,
			type: 'mapbubble',
			pointArrayMap: ['z'], // If one single value is passed, it is interpreted as z
			/**
			 * Return the map area identified by the dataJoinBy option
			 */
			getMapData: seriesTypes.map.prototype.getMapData,
			getBox: seriesTypes.map.prototype.getBox,
			setData: seriesTypes.map.prototype.setData
		});
	}

	// Create symbols for the zoom buttons
	function selectiveRoundedRect(attr, x, y, w, h, rTopLeft, rTopRight, rBottomRight, rBottomLeft) {
		var normalize = (attr['stroke-width'] % 2 / 2);
			
		x -= normalize;
		y -= normalize;

		return ['M', x + rTopLeft, y,
            // top side
            'L', x + w - rTopRight, y,
            // top right corner
            'C', x + w - rTopRight / 2, y, x + w, y + rTopRight / 2, x + w, y + rTopRight,
            // right side
            'L', x + w, y + h - rBottomRight,
            // bottom right corner
            'C', x + w, y + h - rBottomRight / 2, x + w - rBottomRight / 2, y + h, x + w - rBottomRight, y + h,
            // bottom side
            'L', x + rBottomLeft, y + h,
            // bottom left corner
            'C', x + rBottomLeft / 2, y + h, x, y + h - rBottomLeft / 2, x, y + h - rBottomLeft,
            // left side
            'L', x, y + rTopLeft,
            // top left corner
            'C', x, y + rTopLeft / 2, x + rTopLeft / 2, y, x + rTopLeft, y,
            'Z'
        ];
	}
	symbols.topbutton = function (x, y, w, h, attr) {
		return selectiveRoundedRect(attr, x, y, w, h, attr.r, attr.r, 0, 0);
	};
	symbols.bottombutton = function (x, y, w, h, attr) {
		return selectiveRoundedRect(attr, x, y, w, h, 0, 0, attr.r, attr.r);
	};
	// The symbol callbacks are generated on the SVGRenderer object in all browsers. Even
	// VML browsers need this in order to generate shapes in export. Now share
	// them with the VMLRenderer.
	if (H.Renderer === VMLRenderer) {
		each(['topbutton', 'bottombutton'], function (shape) {
			VMLRenderer.prototype.symbols[shape] = symbols[shape];
		});
	}

	
	/**
	 * A wrapper for Chart with all the default values for a Map
	 */
	H.Map = function (options, callback) {
		
		var hiddenAxis = {
				endOnTick: false,
				gridLineWidth: 0,
				labels: {
					enabled: false
				},
				lineWidth: 0,
				minPadding: 0,
				maxPadding: 0,
				startOnTick: false,
				tickWidth: 0,
				title: null
			},
			seriesOptions;
		
		// Don't merge the data
		seriesOptions = options.series;
		options.series = null;
		
		options = merge({
			chart: {
				panning: 'xy'
			},
			xAxis: hiddenAxis,
			yAxis: merge(hiddenAxis, { reversed: true })	
		},
		options, // user's options
	
		{ // forced options
			chart: {
				type: 'map',
				inverted: false,
				alignTicks: false
			}
		});
	
		options.series = seriesOptions;
	
	
		return new Chart(options, callback);
	};
}(Highcharts));
