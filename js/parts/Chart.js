
/**
 * The chart class
 * @param {Object} options
 * @param {Function} callback Function to run when the chart has loaded
 */
function Chart(options, callback) {

	// Handle regular options
	var seriesOptions = options.series; // skip merging data points to increase performance
	options.series = null;
	options = merge(defaultOptions, options); // do the merge
	options.series = seriesOptions; // set back the series data

	var optionsChart = options.chart,
		optionsMargin = optionsChart.margin,
		margin = isObject(optionsMargin) ?
			optionsMargin :
			[optionsMargin, optionsMargin, optionsMargin, optionsMargin],
		optionsMarginTop = pick(optionsChart.marginTop, margin[0]),
		optionsMarginRight = pick(optionsChart.marginRight, margin[1]),
		optionsMarginBottom = pick(optionsChart.marginBottom, margin[2]),
		optionsMarginLeft = pick(optionsChart.marginLeft, margin[3]),
		spacingTop = optionsChart.spacingTop,
		spacingRight = optionsChart.spacingRight,
		spacingBottom = optionsChart.spacingBottom,
		spacingLeft = optionsChart.spacingLeft,
		spacingBox,
		chartTitleOptions,
		chartSubtitleOptions,
		plotTop,
		marginRight,
		marginBottom,
		plotLeft,
		axisOffset,
		renderTo,
		renderToClone,
		container,
		containerId,
		containerWidth,
		containerHeight,
		chartWidth,
		chartHeight,
		oldChartWidth,
		oldChartHeight,
		chartBackground,
		plotBackground,
		plotBGImage,
		plotBorder,
		chart = this,
		chartEvents = optionsChart.events,
		runChartClick = chartEvents && !!chartEvents.click,
		eventType,
		isInsidePlot, // function
		loadingDiv,
		loadingSpan,
		loadingShown,
		plotHeight,
		plotWidth,
		tracker,
		legend,
		hasCartesianSeries = optionsChart.showAxes,
		isResizing = 0,
		axes = [],
		maxTicks, // handle the greatest amount of ticks on grouped axes
		series = [],
		inverted,
		renderer,
		drawChartBox, // function
		getMargins, // function
		resetMargins, // function
		setChartSize, // function
		resize,
		zoom, // function
		zoomOut, // function
		mouseTrackerContext = new MouseTrackerContext(
			chart,
			optionsChart,
			axes,
			function () { return zoom; },
			function () { return hasCartesianSeries; },
			runChartClick
		);

	/**
	 * Initialize an individual series, called internally before render time
	 */
	function initSeries(options) {
		var type = options.type || optionsChart.type || optionsChart.defaultSeriesType,
			typeClass = seriesTypes[type],
			serie,
			hasRendered = chart.hasRendered;

		// an inverted chart can't take a column series and vice versa
		if (hasRendered) {
			if (inverted && type === 'column') {
				typeClass = seriesTypes.bar;
			} else if (!inverted && type === 'bar') {
				typeClass = seriesTypes.column;
			}
		}

		serie = new typeClass();

		serie.init(chart, options);

		// set internal chart properties
		if (!hasRendered && serie.inverted) {
			inverted = true;
		}
		if (serie.isCartesian) {
			hasCartesianSeries = serie.isCartesian;
		}

		series.push(serie);

		return serie;
	}

	/**
	 * Add a series dynamically after  time
	 *
	 * @param {Object} options The config options
	 * @param {Boolean} redraw Whether to redraw the chart after adding. Defaults to true.
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 *
	 * @return {Object} series The newly created series object
	 */
	function addSeries(options, redraw, animation) {
		var series;

		if (options) {
			setAnimation(animation, chart);
			redraw = pick(redraw, true); // defaults to true

			fireEvent(chart, 'addSeries', { options: options }, function () {
				series = initSeries(options);
				series.isDirty = true;

				chart.isDirtyLegend = true; // the series array is out of sync with the display
				if (redraw) {
					chart.redraw();
				}
			});
		}

		return series;
	}

	/**
	 * Check whether a given point is within the plot area
	 *
	 * @param {Number} x Pixel x relative to the plot area
	 * @param {Number} y Pixel y relative to the plot area
	 */
	isInsidePlot = function (x, y) {
		return x >= 0 &&
			x <= plotWidth &&
			y >= 0 &&
			y <= plotHeight;
	};

	/**
	 * Adjust all axes tick amounts
	 */
	function adjustTickAmounts() {
		if (optionsChart.alignTicks !== false) {
			each(axes, function (axis) {
				axis.adjustTickAmount();
			});
		}
		maxTicks = null;
	}

	/**
	 * Redraw legend, axes or series based on updated data
	 *
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 */
	function redraw(animation) {
		var redrawLegend = chart.isDirtyLegend,
			hasStackedSeries,
			isDirtyBox = chart.isDirtyBox, // todo: check if it has actually changed?
			seriesLength = series.length,
			i = seriesLength,
			clipRect = chart.clipRect,
			serie;

		setAnimation(animation, chart);

		// link stacked series
		while (i--) {
			serie = series[i];
			if (serie.isDirty && serie.options.stacking) {
				hasStackedSeries = true;
				break;
			}
		}
		if (hasStackedSeries) { // mark others as dirty
			i = seriesLength;
			while (i--) {
				serie = series[i];
				if (serie.options.stacking) {
					serie.isDirty = true;
				}
			}
		}

		// handle updated data in the series
		each(series, function (serie) {
			if (serie.isDirty) { // prepare the data so axis can read it
				if (serie.options.legendType === 'point') {
					redrawLegend = true;
				}
			}
		});

		// handle added or removed series
		if (redrawLegend && legend.renderLegend) { // series or pie points are added or removed
			// draw legend graphics
			legend.renderLegend();

			chart.isDirtyLegend = false;
		}


		if (hasCartesianSeries) {
			if (!isResizing) {

				// reset maxTicks
				maxTicks = null;

				// set axes scales
				each(axes, function (axis) {
					axis.setScale();
				});
			}
			adjustTickAmounts();
			getMargins();

			// redraw axes
			each(axes, function (axis) {
				fireEvent(axis, 'afterSetExtremes', axis.getExtremes()); // #747, #751					
				if (axis.isDirty) {					
					axis.redraw();					
				}
			});


		}

		// the plot areas size has changed
		if (isDirtyBox) {
			drawChartBox();

			// move clip rect
			if (clipRect) {
				stop(clipRect);
				clipRect.animate({ // for chart resize
					width: chart.plotSizeX,
					height: chart.plotSizeY + 1
				});
			}

		}


		// redraw affected series
		each(series, function (serie) {
			if (serie.isDirty && serie.visible &&
					(!serie.isCartesian || serie.xAxis)) { // issue #153
				serie.redraw();
			}
		});


		// hide tooltip and hover states
		if (tracker && tracker.resetTracker) {
			tracker.resetTracker();
		}

		// redraw if canvas
		renderer.draw();

		// fire the event
		fireEvent(chart, 'redraw'); // jQuery breaks this when calling it from addEvent. Overwrites chart.redraw
	}



	/**
	 * Dim the chart and show a loading text or symbol
	 * @param {String} str An optional text to show in the loading label instead of the default one
	 */
	function showLoading(str) {
		var loadingOptions = options.loading;

		// create the layer at the first call
		if (!loadingDiv) {
			loadingDiv = createElement(DIV, {
				className: PREFIX + 'loading'
			}, extend(loadingOptions.style, {
				left: plotLeft + PX,
				top: plotTop + PX,
				width: plotWidth + PX,
				height: plotHeight + PX,
				zIndex: 10,
				display: NONE
			}), container);

			loadingSpan = createElement(
				'span',
				null,
				loadingOptions.labelStyle,
				loadingDiv
			);

		}

		// update text
		loadingSpan.innerHTML = str || options.lang.loading;

		// show it
		if (!loadingShown) {
			css(loadingDiv, { opacity: 0, display: '' });
			animate(loadingDiv, {
				opacity: loadingOptions.style.opacity
			}, {
				duration: loadingOptions.showDuration || 0
			});
			loadingShown = true;
		}
	}
	/**
	 * Hide the loading layer
	 */
	function hideLoading() {
		if (loadingDiv) {
			animate(loadingDiv, {
				opacity: 0
			}, {
				duration: options.loading.hideDuration || 100,
				complete: function () {
					css(loadingDiv, { display: NONE });
				}
			});
		}
		loadingShown = false;
	}

	/**
	 * Get an axis, series or point object by id.
	 * @param id {String} The id as given in the configuration options
	 */
	function get(id) {
		var i,
			j,
			points;

		// search axes
		for (i = 0; i < axes.length; i++) {
			if (axes[i].options.id === id) {
				return axes[i];
			}
		}

		// search series
		for (i = 0; i < series.length; i++) {
			if (series[i].options.id === id) {
				return series[i];
			}
		}

		// search points
		for (i = 0; i < series.length; i++) {
			points = series[i].points || [];
			for (j = 0; j < points.length; j++) {
				if (points[j].id === id) {
					return points[j];
				}
			}
		}
		return null;
	}

	/**
	 * Create the Axis instances based on the config options
	 */
	function getAxes() {
		var xAxisOptions = options.xAxis || {},
			yAxisOptions = options.yAxis || {},
			optionsArray,
			axis;

		// make sure the options are arrays and add some members
		xAxisOptions = splat(xAxisOptions);
		each(xAxisOptions, function (axis, i) {
			axis.index = i;
			axis.isX = true;
		});

		yAxisOptions = splat(yAxisOptions);
		each(yAxisOptions, function (axis, i) {
			axis.index = i;
		});

		// concatenate all axis options into one array
		optionsArray = xAxisOptions.concat(yAxisOptions);

		var axisContext = new AxisContext(
			chart,
			axes,
			function () { return oldChartWidth; },
			function () { return oldChartHeight; },
			optionsChart,
			function () { return maxTicks; },
			function (newMaxTicks) { maxTicks = newMaxTicks; },
			function () { return axisOffset; },
			function (newAxisOffset) { axisOffset = newAxisOffset; }
		);

		each(optionsArray, function (axisOptions) {
			axis = new Axis(axisContext, axisOptions);
		});

		adjustTickAmounts();
	}


	/**
	 * Get the currently selected points from all series
	 */
	function getSelectedPoints() {
		var points = [];
		each(series, function (serie) {
			points = points.concat(grep(serie.points, function (point) {
				return point.selected;
			}));
		});
		return points;
	}

	/**
	 * Get the currently selected series
	 */
	function getSelectedSeries() {
		return grep(series, function (serie) {
			return serie.selected;
		});
	}

	/**
	 * Display the zoom button
	 */
	function showResetZoom() {
		var lang = defaultOptions.lang,
			btnOptions = optionsChart.resetZoomButton,
			theme = btnOptions.theme,
			states = theme.states,
			box = btnOptions.relativeTo === 'chart' ? null : {
				x: plotLeft,
				y: plotTop,
				width: plotWidth,
				height: plotHeight
			};
		chart.resetZoomButton = renderer.button(lang.resetZoom, null, null, zoomOut, theme, states && states.hover)
			.attr({
				align: btnOptions.position.align,
				title: lang.resetZoomTitle
			})
			.add()
			.align(btnOptions.position, false, box);
	}

	/**
	 * Zoom out to 1:1
	 */
	zoomOut = function () {
		var resetZoomButton = chart.resetZoomButton;

		fireEvent(chart, 'selection', { resetSelection: true }, zoom);
		if (resetZoomButton) {
			chart.resetZoomButton = resetZoomButton.destroy();
		}
	};
	/**
	 * Zoom into a given portion of the chart given by axis coordinates
	 * @param {Object} event
	 */
	zoom = function (event) {

		// add button to reset selection
		var animate = chart.pointCount < 100,
			hasZoomed;

		if (chart.resetZoomEnabled !== false && !chart.resetZoomButton) { // hook for Stock charts etc.
			showResetZoom();
		}

		// if zoom is called with no arguments, reset the axes
		if (!event || event.resetSelection) {
			each(axes, function (axis) {
				if (axis.options.zoomEnabled !== false) {
					axis.setExtremes(null, null, false);
					hasZoomed = true;
				}
			});
		} else { // else, zoom in on all axes
			each(event.xAxis.concat(event.yAxis), function (axisData) {
				var axis = axisData.axis;

				// don't zoom more than minRange
				if (chart.tracker[axis.isXAxis ? 'zoomX' : 'zoomY']) {
					axis.setExtremes(axisData.min, axisData.max, false);
					hasZoomed = true;
				}
			});
		}

		// Redraw
		if (hasZoomed) {
			redraw(true, animate);
		}
	};

	/**
	 * Pan the chart by dragging the mouse across the pane. This function is called
	 * on mouse move, and the distance to pan is computed from chartX compared to
	 * the first chartX position in the dragging operation.
	 */
	chart.pan = function (chartX) {

		var xAxis = chart.xAxis[0],
			mouseDownX = chart.mouseDownX,
			halfPointRange = xAxis.pointRange / 2,
			extremes = xAxis.getExtremes(),
			newMin = xAxis.translate(mouseDownX - chartX, true) + halfPointRange,
			newMax = xAxis.translate(mouseDownX + plotWidth - chartX, true) - halfPointRange,
			hoverPoints = chart.hoverPoints;

		// remove active points for shared tooltip
		if (hoverPoints) {
			each(hoverPoints, function (point) {
				point.setState();
			});
		}

		if (newMin > mathMin(extremes.dataMin, extremes.min) && newMax < mathMax(extremes.dataMax, extremes.max)) {
			xAxis.setExtremes(newMin, newMax, true, false);
		}

		chart.mouseDownX = chartX; // set new reference for next run
		css(container, { cursor: 'move' });
	};

	/**
	 * Show the title and subtitle of the chart
	 *
	 * @param titleOptions {Object} New title options
	 * @param subtitleOptions {Object} New subtitle options
	 *
	 */
	function setTitle(titleOptions, subtitleOptions) {

		chartTitleOptions = merge(options.title, titleOptions);
		chartSubtitleOptions = merge(options.subtitle, subtitleOptions);

		// add title and subtitle
		each([
			['title', titleOptions, chartTitleOptions],
			['subtitle', subtitleOptions, chartSubtitleOptions]
		], function (arr) {
			var name = arr[0],
				title = chart[name],
				titleOptions = arr[1],
				chartTitleOptions = arr[2];

			if (title && titleOptions) {
				title = title.destroy(); // remove old
			}
			if (chartTitleOptions && chartTitleOptions.text && !title) {
				chart[name] = renderer.text(
					chartTitleOptions.text,
					0,
					0,
					chartTitleOptions.useHTML
				)
				.attr({
					align: chartTitleOptions.align,
					'class': PREFIX + name,
					zIndex: 1
				})
				.css(chartTitleOptions.style)
				.add()
				.align(chartTitleOptions, false, spacingBox);
			}
		});

	}

	/**
	 * Get chart width and height according to options and container size
	 */
	function getChartSize() {

		containerWidth = (renderToClone || renderTo).offsetWidth;
		containerHeight = (renderToClone || renderTo).offsetHeight;
		chart.chartWidth = chartWidth = optionsChart.width || containerWidth || 600;
		chart.chartHeight = chartHeight = optionsChart.height ||
			// the offsetHeight of an empty container is 0 in standard browsers, but 19 in IE7:
			(containerHeight > 19 ? containerHeight : 400);
	}


	/**
	 * Get the containing element, determine the size and create the inner container
	 * div to hold the chart
	 */
	function getContainer() {
		renderTo = optionsChart.renderTo;
		containerId = PREFIX + idCounter++;

		if (isString(renderTo)) {
			renderTo = doc.getElementById(renderTo);
		}
		
		// Display an error if the renderTo is wrong
		if (!renderTo) {
			error(13, true);
		}

		// remove previous chart
		renderTo.innerHTML = '';

		// If the container doesn't have an offsetWidth, it has or is a child of a node
		// that has display:none. We need to temporarily move it out to a visible
		// state to determine the size, else the legend and tooltips won't render
		// properly
		if (!renderTo.offsetWidth) {
			renderToClone = renderTo.cloneNode(0);
			css(renderToClone, {
				position: ABSOLUTE,
				top: '-9999px',
				display: ''
			});
			doc.body.appendChild(renderToClone);
		}

		// get the width and height
		getChartSize();

		// create the inner container
		chart.container = container = createElement(DIV, {
				className: PREFIX + 'container' +
					(optionsChart.className ? ' ' + optionsChart.className : ''),
				id: containerId
			}, extend({
				position: RELATIVE,
				overflow: HIDDEN, // needed for context menu (avoid scrollbars) and
					// content overflow in IE
				width: chartWidth + PX,
				height: chartHeight + PX,
				textAlign: 'left',
				lineHeight: 'normal' // #427
			}, optionsChart.style),
			renderToClone || renderTo
		);

		chart.renderer = renderer =
			optionsChart.forExport ? // force SVG, used for SVG export
				new SVGRenderer(container, chartWidth, chartHeight, true) :
				new Renderer(container, chartWidth, chartHeight);

		if (useCanVG) {
			// If we need canvg library, extend and configure the renderer
			// to get the tracker for translating mouse events
			renderer.create(chart, container, chartWidth, chartHeight);
		}

		// Issue 110 workaround:
		// In Firefox, if a div is positioned by percentage, its pixel position may land
		// between pixels. The container itself doesn't display this, but an SVG element
		// inside this container will be drawn at subpixel precision. In order to draw
		// sharp lines, this must be compensated for. This doesn't seem to work inside
		// iframes though (like in jsFiddle).
		var subPixelFix, rect;
		if (isFirefox && container.getBoundingClientRect) {
			subPixelFix = function () {
				css(container, { left: 0, top: 0 });
				rect = container.getBoundingClientRect();
				css(container, {
					left: (-(rect.left - pInt(rect.left))) + PX,
					top: (-(rect.top - pInt(rect.top))) + PX
				});
			};

			// run the fix now
			subPixelFix();

			// run it on resize
			addEvent(win, 'resize', subPixelFix);

			// remove it on chart destroy
			addEvent(chart, 'destroy', function () {
				removeEvent(win, 'resize', subPixelFix);
			});
		}
	}

	/**
	 * Calculate margins by rendering axis labels in a preliminary position. Title,
	 * subtitle and legend have already been rendered at this stage, but will be
	 * moved into their final positions
	 */
	getMargins = function () {
		var legendOptions = options.legend,
			legendMargin = pick(legendOptions.margin, 10),
			legendX = legendOptions.x,
			legendY = legendOptions.y,
			align = legendOptions.align,
			verticalAlign = legendOptions.verticalAlign,
			titleOffset;

		resetMargins();

		// adjust for title and subtitle
		if ((chart.title || chart.subtitle) && !defined(optionsMarginTop)) {
			titleOffset = mathMax(
				(chart.title && !chartTitleOptions.floating && !chartTitleOptions.verticalAlign && chartTitleOptions.y) || 0,
				(chart.subtitle && !chartSubtitleOptions.floating && !chartSubtitleOptions.verticalAlign && chartSubtitleOptions.y) || 0
			);
			if (titleOffset) {
				plotTop = mathMax(plotTop, titleOffset + pick(chartTitleOptions.margin, 15) + spacingTop);
			}
		}
		// adjust for legend
		if (legendOptions.enabled && !legendOptions.floating) {
			if (align === 'right') { // horizontal alignment handled first
				if (!defined(optionsMarginRight)) {
					marginRight = mathMax(
						marginRight,
						legend.getLegendWidth() - legendX + legendMargin + spacingRight
					);
				}
			} else if (align === 'left') {
				if (!defined(optionsMarginLeft)) {
					plotLeft = mathMax(
						plotLeft,
						legend.getLegendWidth() + legendX + legendMargin + spacingLeft
					);
				}

			} else if (verticalAlign === 'top') {
				if (!defined(optionsMarginTop)) {
					plotTop = mathMax(
						plotTop,
						legend.getLegendHeight() + legendY + legendMargin + spacingTop
					);
				}

			} else if (verticalAlign === 'bottom') {
				if (!defined(optionsMarginBottom)) {
					marginBottom = mathMax(
						marginBottom,
						legend.getLegendHeight() - legendY + legendMargin + spacingBottom
					);
				}
			}
		}

		// adjust for scroller
		if (chart.extraBottomMargin) {
			marginBottom += chart.extraBottomMargin;
		}
		if (chart.extraTopMargin) {
			plotTop += chart.extraTopMargin;
		}

		// pre-render axes to get labels offset width
		if (hasCartesianSeries) {
			each(axes, function (axis) {
				axis.getOffset();
			});
		}

		if (!defined(optionsMarginLeft)) {
			plotLeft += axisOffset[3];
		}
		if (!defined(optionsMarginTop)) {
			plotTop += axisOffset[0];
		}
		if (!defined(optionsMarginBottom)) {
			marginBottom += axisOffset[2];
		}
		if (!defined(optionsMarginRight)) {
			marginRight += axisOffset[1];
		}

		setChartSize();

	};

	/**
	 * Add the event handlers necessary for auto resizing
	 *
	 */
	function initReflow() {
		var reflowTimeout;
		function reflow(e) {
			var width = optionsChart.width || renderTo.offsetWidth,
				height = optionsChart.height || renderTo.offsetHeight,
				target = e.target;
				
			// Width and height checks for display:none. Target is doc in IE8 and Opera,
			// win in Firefox, Chrome and IE9.
			if (width && height && (target === win || target === doc)) {
				
				if (width !== containerWidth || height !== containerHeight) {
					clearTimeout(reflowTimeout);
					reflowTimeout = setTimeout(function () {
						resize(width, height, false);
					}, 100);
				}
				containerWidth = width;
				containerHeight = height;
			}
		}
		addEvent(win, 'resize', reflow);
		addEvent(chart, 'destroy', function () {
			removeEvent(win, 'resize', reflow);
		});
	}

	/**
	 * Fires endResize event on chart instance.
	 */
	function fireEndResize() {
		if (chart) {
			fireEvent(chart, 'endResize', null, function () {
				isResizing -= 1;
			});
		}
	}

	/**
	 * Resize the chart to a given width and height
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Object|Boolean} animation
	 */
	resize = function (width, height, animation) {
		var chartTitle = chart.title,
			chartSubtitle = chart.subtitle;

		isResizing += 1;

		// set the animation for the current process
		setAnimation(animation, chart);

		oldChartHeight = chartHeight;
		oldChartWidth = chartWidth;
		if (defined(width)) {
			chart.chartWidth = chartWidth = mathRound(width);
		}
		if (defined(height)) {
			chart.chartHeight = chartHeight = mathRound(height);
		}

		css(container, {
			width: chartWidth + PX,
			height: chartHeight + PX
		});
		renderer.setSize(chartWidth, chartHeight, animation);

		// update axis lengths for more correct tick intervals:
		plotWidth = chartWidth - plotLeft - marginRight;
		plotHeight = chartHeight - plotTop - marginBottom;

		// handle axes
		maxTicks = null;
		each(axes, function (axis) {
			axis.isDirty = true;
			axis.setScale();
		});

		// make sure non-cartesian series are also handled
		each(series, function (serie) {
			serie.isDirty = true;
		});

		chart.isDirtyLegend = true; // force legend redraw
		chart.isDirtyBox = true; // force redraw of plot and chart border

		getMargins();

		// move titles
		if (chartTitle) {
			chartTitle.align(null, null, spacingBox);
		}
		if (chartSubtitle) {
			chartSubtitle.align(null, null, spacingBox);
		}

		redraw(animation);


		oldChartHeight = null;
		fireEvent(chart, 'resize');

		// fire endResize and set isResizing back
		// If animation is disabled, fire without delay
		if (globalAnimation === false) {
			fireEndResize();
		} else { // else set a timeout with the animation duration
			setTimeout(fireEndResize, (globalAnimation && globalAnimation.duration) || 500);
		}
	};

	/**
	 * Set the public chart properties. This is done before and after the pre-render
	 * to determine margin sizes
	 */
	setChartSize = function () {

		chart.plotLeft = plotLeft = mathRound(plotLeft);
		chart.plotTop = plotTop = mathRound(plotTop);
		chart.plotWidth = plotWidth = mathRound(chartWidth - plotLeft - marginRight);
		chart.plotHeight = plotHeight = mathRound(chartHeight - plotTop - marginBottom);

		chart.plotSizeX = inverted ? plotHeight : plotWidth;
		chart.plotSizeY = inverted ? plotWidth : plotHeight;

		spacingBox = {
			x: spacingLeft,
			y: spacingTop,
			width: chartWidth - spacingLeft - spacingRight,
			height: chartHeight - spacingTop - spacingBottom
		};

		each(axes, function (axis) {
			axis.setAxisSize();
			axis.setAxisTranslation();
		});
	};

	/**
	 * Initial margins before auto size margins are applied
	 */
	resetMargins = function () {
		plotTop = pick(optionsMarginTop, spacingTop);
		marginRight = pick(optionsMarginRight, spacingRight);
		marginBottom = pick(optionsMarginBottom, spacingBottom);
		plotLeft = pick(optionsMarginLeft, spacingLeft);
		axisOffset = [0, 0, 0, 0]; // top, right, bottom, left
	};

	/**
	 * Draw the borders and backgrounds for chart and plot area
	 */
	drawChartBox = function () {
		var chartBorderWidth = optionsChart.borderWidth || 0,
			chartBackgroundColor = optionsChart.backgroundColor,
			plotBackgroundColor = optionsChart.plotBackgroundColor,
			plotBackgroundImage = optionsChart.plotBackgroundImage,
			mgn,
			plotSize = {
				x: plotLeft,
				y: plotTop,
				width: plotWidth,
				height: plotHeight
			};

		// Chart area
		mgn = chartBorderWidth + (optionsChart.shadow ? 8 : 0);

		if (chartBorderWidth || chartBackgroundColor) {
			if (!chartBackground) {
				chartBackground = renderer.rect(mgn / 2, mgn / 2, chartWidth - mgn, chartHeight - mgn,
						optionsChart.borderRadius, chartBorderWidth)
					.attr({
						stroke: optionsChart.borderColor,
						'stroke-width': chartBorderWidth,
						fill: chartBackgroundColor || NONE
					})
					.add()
					.shadow(optionsChart.shadow);
			} else { // resize
				chartBackground.animate(
					chartBackground.crisp(null, null, null, chartWidth - mgn, chartHeight - mgn)
				);
			}
		}


		// Plot background
		if (plotBackgroundColor) {
			if (!plotBackground) {
				plotBackground = renderer.rect(plotLeft, plotTop, plotWidth, plotHeight, 0)
					.attr({
						fill: plotBackgroundColor
					})
					.add()
					.shadow(optionsChart.plotShadow);
			} else {
				plotBackground.animate(plotSize);
			}
		}
		if (plotBackgroundImage) {
			if (!plotBGImage) {
				plotBGImage = renderer.image(plotBackgroundImage, plotLeft, plotTop, plotWidth, plotHeight)
					.add();
			} else {
				plotBGImage.animate(plotSize);
			}
		}

		// Plot area border
		if (optionsChart.plotBorderWidth) {
			if (!plotBorder) {
				plotBorder = renderer.rect(plotLeft, plotTop, plotWidth, plotHeight, 0, optionsChart.plotBorderWidth)
					.attr({
						stroke: optionsChart.plotBorderColor,
						'stroke-width': optionsChart.plotBorderWidth,
						zIndex: 4
					})
					.add();
			} else {
				plotBorder.animate(
					plotBorder.crisp(null, plotLeft, plotTop, plotWidth, plotHeight)
				);
			}
		}

		// reset
		chart.isDirtyBox = false;
	};

	/**
	 * Detect whether the chart is inverted, either by setting the chart.inverted option
	 * or adding a bar series to the configuration options
	 */
	function setInverted() {
		var BAR = 'bar',
			isInverted = (
				inverted || // it is set before
				optionsChart.inverted ||
				optionsChart.type === BAR || // default series type
				optionsChart.defaultSeriesType === BAR // backwards compatible
			),
			seriesOptions = options.series,
			i = seriesOptions && seriesOptions.length;

		// check if a bar series is present in the config options
		while (!isInverted && i--) {
			if (seriesOptions[i].type === BAR) {
				isInverted = true;
			}
		}

		// set the chart property and the chart scope variable
		chart.inverted = inverted = isInverted;
	}

	/**
	 * Render all graphics for the chart
	 */
	function render() {
		var labels = options.labels,
			credits = options.credits,
			creditsHref;

		// Title
		setTitle();


		// Legend
		var legendContext = new LegendContext(
			chart,
			function () { return spacingBox; },
			function () { return isResizing; }
		);

		legend = chart.legend = new Legend(legendContext);

		// Get margins by pre-rendering axes
		// set axes scales
		each(axes, function (axis) {
			axis.setScale();
		});
		getMargins();
		each(axes, function (axis) {
			axis.setTickPositions(true); // update to reflect the new margins
		});
		adjustTickAmounts();
		getMargins(); // second pass to check for new labels


		// Draw the borders and backgrounds
		drawChartBox();

		// Axes
		if (hasCartesianSeries) {
			each(axes, function (axis) {
				axis.render();
			});
		}


		// The series
		if (!chart.seriesGroup) {
			chart.seriesGroup = renderer.g('series-group')
				.attr({ zIndex: 3 })
				.add();
		}
		each(series, function (serie) {
			serie.translate();
			serie.setTooltipPoints();
			serie.render();
		});


		// Labels
		if (labels.items) {
			each(labels.items, function () {
				var style = extend(labels.style, this.style),
					x = pInt(style.left) + plotLeft,
					y = pInt(style.top) + plotTop + 12;

				// delete to prevent rewriting in IE
				delete style.left;
				delete style.top;

				renderer.text(
					this.html,
					x,
					y
				)
				.attr({ zIndex: 2 })
				.css(style)
				.add();

			});
		}

		// Credits
		if (credits.enabled && !chart.credits) {
			creditsHref = credits.href;
			chart.credits = renderer.text(
				credits.text,
				0,
				0
			)
			.on('click', function () {
				if (creditsHref) {
					location.href = creditsHref;
				}
			})
			.attr({
				align: credits.position.align,
				zIndex: 8
			})
			.css(credits.style)
			.add()
			.align(credits.position);
		}

		// Set flag
		chart.hasRendered = true;

	}

	/**
	 * Clean up memory usage
	 */
	function destroy() {
		var i,
			parentNode = container && container.parentNode;

		// If the chart is destroyed already, do nothing.
		// This will happen if if a script invokes chart.destroy and
		// then it will be called again on win.unload
		if (chart === null) {
			return;
		}

		// fire the chart.destoy event
		fireEvent(chart, 'destroy');

		// remove events
		removeEvent(chart);

		// ==== Destroy collections:
		// Destroy axes
		i = axes.length;
		while (i--) {
			axes[i] = axes[i].destroy();
		}

		// Destroy each series
		i = series.length;
		while (i--) {
			series[i] = series[i].destroy();
		}

		// ==== Destroy chart properties:
		each(['title', 'subtitle', 'seriesGroup', 'clipRect', 'credits', 'tracker', 'scroller', 'rangeSelector'], function (name) {
			var prop = chart[name];

			if (prop) {
				chart[name] = prop.destroy();
			}
		});

		// ==== Destroy local variables:
		each([chartBackground, plotBorder, plotBackground, legend, renderer, tracker], function (obj) {
			if (obj && obj.destroy) {
				obj.destroy();
			}
		});
		chartBackground = plotBorder = plotBackground = legend = renderer = tracker = null;

		// remove container and all SVG
		if (container) { // can break in IE when destroyed before finished loading
			container.innerHTML = '';
			removeEvent(container);
			if (parentNode) {
				discardElement(container);
			}

			// IE6 leak
			container = null;
		}

		// clean it all up
		for (i in chart) {
			delete chart[i];
		}

		chart = null;
		options = null;
	}
	/**
	 * Prepare for first rendering after all data are loaded
	 */
	function firstRender() {
		// VML namespaces can't be added until after complete. Listening
		// for Perini's doScroll hack is not enough.
		var ONREADYSTATECHANGE = 'onreadystatechange',
		COMPLETE = 'complete';
		// Note: in spite of JSLint's complaints, win == win.top is required
		/*jslint eqeq: true*/
		if ((!hasSVG && (win == win.top && doc.readyState !== COMPLETE)) || (useCanVG && !win.canvg)) {
		/*jslint eqeq: false*/
			if (useCanVG) {
				// Delay rendering until canvg library is downloaded and ready
				CanVGController.push(firstRender, options.global.canvasToolsURL);
			} else {
				doc.attachEvent(ONREADYSTATECHANGE, function () {
					doc.detachEvent(ONREADYSTATECHANGE, firstRender);
					if (doc.readyState === COMPLETE) {
						firstRender();
					}
				});
			}
			return;
		}

		// create the container
		getContainer();

		// Run an early event after the container and renderer are established
		fireEvent(chart, 'init');

		// Initialize range selector for stock charts
		if (Highcharts.RangeSelector && options.rangeSelector.enabled) {
			chart.rangeSelector = new Highcharts.RangeSelector(chart);
		}

		resetMargins();
		setChartSize();

		// Set the common inversion and transformation for inverted series after initSeries
		setInverted();

		// get axes
		getAxes();

		// Initialize the series
		each(options.series || [], function (serieOptions) {
			initSeries(serieOptions);
		});

		// Run an event where series and axes can be added
		//fireEvent(chart, 'beforeRender');

		// Initialize scroller for stock charts
		if (Highcharts.Scroller && (options.navigator.enabled || options.scrollbar.enabled)) {
			chart.scroller = new Highcharts.Scroller(chart);
		}

		chart.render = render;

		// depends on inverted and on margins being set
		chart.tracker = tracker = new MouseTracker(mouseTrackerContext, options.tooltip);


		render();

		// add canvas
		renderer.draw();
		// run callbacks
		if (callback) {
			callback.apply(chart, [chart]);
		}
		each(chart.callbacks, function (fn) {
			fn.apply(chart, [chart]);
		});
		
		
		// If the chart was rendered outside the top container, put it back in
		if (renderToClone) {
			renderTo.appendChild(container);
			discardElement(renderToClone);
		}

		fireEvent(chart, 'load');

	}

	// Run chart

	// Set up auto resize
	if (optionsChart.reflow !== false) {
		addEvent(chart, 'load', initReflow);
	}

	// Chart event handlers
	if (chartEvents) {
		for (eventType in chartEvents) {
			addEvent(chart, eventType, chartEvents[eventType]);
		}
	}


	chart.options = options;
	chart.series = series;


	chart.xAxis = [];
	chart.yAxis = [];




	// Expose methods and variables
	chart.addSeries = addSeries;
	chart.animation = useCanVG ? false : pick(optionsChart.animation, true);
	chart.Axis = Axis;
	chart.destroy = destroy;
	chart.get = get;
	chart.getSelectedPoints = getSelectedPoints;
	chart.getSelectedSeries = getSelectedSeries;
	chart.hideLoading = hideLoading;
	chart.initSeries = initSeries;
	chart.isInsidePlot = isInsidePlot;
	chart.redraw = redraw;
	chart.setSize = resize;
	chart.setTitle = setTitle;
	chart.showLoading = showLoading;
	chart.pointCount = 0;
	chart.counters = new ChartCounters();
	/*
	if ($) $(function () {
		$container = $('#container');
		var origChartWidth,
			origChartHeight;
		if ($container) {
			$('<button>+</button>')
				.insertBefore($container)
				.click(function () {
					if (origChartWidth === UNDEFINED) {
						origChartWidth = chartWidth;
						origChartHeight = chartHeight;
					}
					chart.resize(chartWidth *= 1.1, chartHeight *= 1.1);
				});
			$('<button>-</button>')
				.insertBefore($container)
				.click(function () {
					if (origChartWidth === UNDEFINED) {
						origChartWidth = chartWidth;
						origChartHeight = chartHeight;
					}
					chart.resize(chartWidth *= 0.9, chartHeight *= 0.9);
				});
			$('<button>1:1</button>')
				.insertBefore($container)
				.click(function () {
					if (origChartWidth === UNDEFINED) {
						origChartWidth = chartWidth;
						origChartHeight = chartHeight;
					}
					chart.resize(origChartWidth, origChartHeight);
				});
		}
	})
	*/




	firstRender();


} // end Chart

// Hook for exporting module
Chart.prototype.callbacks = [];
