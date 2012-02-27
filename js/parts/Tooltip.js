/**
 * Context holding the variables that were in local closure in the chart.
 */
function TooltipContext(
		chart,
		getRenderer,
		setTooltipTick
	) {
	return {
		chart: chart, // object
		getRenderer: getRenderer, // object
		setTooltipTick: setTooltipTick // function
	};
}

/**
 * The tooltip object
 * @param {Object} options Tooltip options
 */
function Tooltip(context, options) {
	var chart = context.chart,
		renderer = context.getRenderer(),
		isInsidePlot = chart.isInsidePlot,
		setTooltipTick = context.setTooltipTick;

	var currentSeries,
		borderWidth = options.borderWidth,
		crosshairsOptions = options.crosshairs,
		crosshairs = [],
		style = options.style,
		shared = options.shared,
		padding = pInt(style.padding),
		tooltipIsHidden = true,
		currentX = 0,
		currentY = 0;

	// remove padding CSS and apply padding on box instead
	style.padding = 0;

	// create the label
	var label = renderer.label('', 0, 0, null, null, null, options.useHTML)
		.attr({
			padding: padding,
			fill: options.backgroundColor,
			'stroke-width': borderWidth,
			r: options.borderRadius,
			zIndex: 8
		})
		.css(style)
		.hide()
		.add();

	// When using canVG the shadow shows up as a gray circle
	// even if the tooltip is hidden.
	if (!useCanVG) {
		label.shadow(options.shadow);
	}

	/**
	 * Destroy the tooltip and its elements.
	 */
	function destroy() {
		each(crosshairs, function (crosshair) {
			if (crosshair) {
				crosshair.destroy();
			}
		});

		// Destroy and clear local variables
		if (label) {
			label = label.destroy();
		}
	}

	/**
	 * In case no user defined formatter is given, this will be used
	 */
	function defaultFormatter() {
		var pThis = this,
			items = pThis.points || splat(pThis),
			series = items[0].series,
			s;

		// build the header
		s = [series.tooltipHeaderFormatter(items[0].key)];

		// build the values
		each(items, function (item) {
			series = item.series;
			s.push((series.tooltipFormatter && series.tooltipFormatter(item)) ||
				item.point.tooltipFormatter(series.tooltipOptions.pointFormat));
		});
		
		// footer
		s.push(options.footerFormat || '');
		
		return s.join('');
	}

	/**
	 * Provide a soft movement for the tooltip
	 *
	 * @param {Number} finalX
	 * @param {Number} finalY
	 */
	function move(finalX, finalY) {

		// get intermediate values for animation
		currentX = tooltipIsHidden ? finalX : (2 * currentX + finalX) / 3;
		currentY = tooltipIsHidden ? finalY : (currentY + finalY) / 2;

		// move to the intermediate value
		label.attr({ x: currentX, y: currentY });

		// run on next tick of the mouse tracker
		if (mathAbs(finalX - currentX) > 1 || mathAbs(finalY - currentY) > 1) {
			setTooltipTick(function () {
				move(finalX, finalY);
			});
		} else {
			setTooltipTick(null);
		}
	}

	/**
	 * Hide the tooltip
	 */
	function hide() {
		if (!tooltipIsHidden) {
			var hoverPoints = chart.hoverPoints;

			label.hide();

			// hide previous hoverPoints and set new
			if (hoverPoints) {
				each(hoverPoints, function (point) {
					point.setState();
				});
			}
			chart.hoverPoints = null;


			tooltipIsHidden = true;
		}

	}

	/**
	 * Hide the crosshairs
	 */
	function hideCrosshairs() {
		each(crosshairs, function (crosshair) {
			if (crosshair) {
				crosshair.hide();
			}
		});
	}

	/**
	 * Refresh the tooltip's text and position.
	 * @param {Object} point
	 *
	 */
	function refresh(point) {
		var x,
			y,
			show,
			plotX,
			plotY,
			textConfig = {},
			text,
			pointConfig = [],
			tooltipPos = point.tooltipPos,
			formatter = options.formatter || defaultFormatter,
			hoverPoints = chart.hoverPoints,
			placedTooltipPoint,
			borderColor;

		// shared tooltip, array is sent over
		if (shared && !(point.series && point.series.noSharedTooltip)) {
			plotY = 0;

			// hide previous hoverPoints and set new
			if (hoverPoints) {
				each(hoverPoints, function (point) {
					point.setState();
				});
			}
			chart.hoverPoints = point;

			each(point, function (item) {
				item.setState(HOVER_STATE);
				plotY += item.plotY; // for average

				pointConfig.push(item.getLabelConfig());
			});

			plotX = point[0].plotX;
			plotY = mathRound(plotY) / point.length; // mathRound because Opera 10 has problems here

			textConfig = {
				x: point[0].category
			};
			textConfig.points = pointConfig;
			point = point[0];

		// single point tooltip
		} else {
			textConfig = point.getLabelConfig();
		}
		text = formatter.call(textConfig);

		// register the current series
		currentSeries = point.series;

		// get the reference point coordinates (pie charts use tooltipPos)
		plotX = pick(plotX, point.plotX);
		plotY = pick(plotY, point.plotY);

		x = mathRound(tooltipPos ? tooltipPos[0] : (chart.inverted ? chart.plotWidth - plotY : plotX));
		y = mathRound(tooltipPos ? tooltipPos[1] : (chart.inverted ? chart.plotHeight - plotX : plotY));


		// For line type series, hide tooltip if the point falls outside the plot
		show = shared || !currentSeries.isCartesian || currentSeries.tooltipOutsidePlot || isInsidePlot(x, y);

		// update the inner HTML
		if (text === false || !show) {
			hide();
		} else {

			// show it
			if (tooltipIsHidden) {
				label.show();
				tooltipIsHidden = false;
			}

			// update text
			label.attr({
				text: text
			});

			// set the stroke color of the box
			borderColor = options.borderColor || point.color || currentSeries.color || '#606060';
			label.attr({
				stroke: borderColor
			});

			placedTooltipPoint = placeBox(
				label.width,
				label.height,
				chart.plotLeft,
				chart.plotTop,
				chart.plotWidth,
				chart.plotHeight,
				{x: x, y: y},
				pick(options.distance, 12),
				chart.inverted
			);

			// do the move
			move(mathRound(placedTooltipPoint.x), mathRound(placedTooltipPoint.y));
		}


		// crosshairs
		if (crosshairsOptions) {
			crosshairsOptions = splat(crosshairsOptions); // [x, y]

			var path,
				i = crosshairsOptions.length,
				attribs,
				axis;

			while (i--) {
				axis = point.series[i ? 'yAxis' : 'xAxis'];
				if (crosshairsOptions[i] && axis) {
					path = axis
						.getPlotLinePath(point[i ? 'y' : 'x'], 1);
					if (crosshairs[i]) {
						crosshairs[i].attr({ d: path, visibility: VISIBLE });

					} else {
						attribs = {
							'stroke-width': crosshairsOptions[i].width || 1,
							stroke: crosshairsOptions[i].color || '#C0C0C0',
							zIndex: crosshairsOptions[i].zIndex || 2
						};
						if (crosshairsOptions[i].dashStyle) {
							attribs.dashstyle = crosshairsOptions[i].dashStyle;
						}
						crosshairs[i] = renderer.path(path)
							.attr(attribs)
							.add();
					}
				}
			}
		}
		fireEvent(chart, 'tooltipRefresh', {
				text: text,
				x: x + chart.plotLeft,
				y: y + chart.plotTop,
				borderColor: borderColor
			});
	}



	// public members
	return {
		shared: shared,
		refresh: refresh,
		hide: hide,
		hideCrosshairs: hideCrosshairs,
		destroy: destroy
	};
}
