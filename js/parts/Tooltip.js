/**
 * The tooltip object
 * @param {Object} chart The chart instance
 * @param {Object} options Tooltip options
 */
function Tooltip(chart, options) {
	var borderWidth = options.borderWidth,
		style = options.style,
		shared = options.shared,
		padding = pInt(style.padding);

	// Save the chart and options
	this.chart = chart;
	this.options = options;

	// remove padding CSS and apply padding on box instead
	style.padding = 0;

	// Keep track of the current series
	//this.currentSeries = UNDEFINED;

	// List of crosshairs
	this.crosshairs = [];

	// Current values of x and y when animating
	this.currentX = 0;
	this.currentY = 0;

	// The tooltipTick function, initialized to nothing
	//this.tooltipTick = UNDEFINED;

	// The tooltip is initially hidden
	this.tooltipIsHidden = true;

	// create the label
	this.label = chart.renderer.label('', 0, 0, null, null, null, options.useHTML, null, 'tooltip')
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
		this.label.shadow(options.shadow);
	}

	// Public property for getting the shared state.
	this.shared = shared;
}

Tooltip.prototype = {
	/**
	 * Destroy the tooltip and its elements.
	 */
	destroy: function () {
		each(this.crosshairs, function (crosshair) {
			if (crosshair) {
				crosshair.destroy();
			}
		});

		// Destroy and clear local variables
		if (this.label) {
			this.label = this.label.destroy();
		}
	},

	/**
	 * Provide a soft movement for the tooltip
	 *
	 * @param {Number} finalX
	 * @param {Number} finalY
	 * @private
	 */
	move: function (finalX, finalY) {
		var tooltip = this;

		// get intermediate values for animation
		tooltip.currentX = tooltip.tooltipIsHidden ? finalX : (2 * tooltip.currentX + finalX) / 3;
		tooltip.currentY = tooltip.tooltipIsHidden ? finalY : (tooltip.currentY + finalY) / 2;

		// move to the intermediate value
		tooltip.label.attr({ x: tooltip.currentX, y: tooltip.currentY });

		// run on next tick of the mouse tracker
		if (mathAbs(finalX - tooltip.currentX) > 1 || mathAbs(finalY - tooltip.currentY) > 1) {
			tooltip.tooltipTick = function () {
				tooltip.move(finalX, finalY);
			};
		} else {
			tooltip.tooltipTick = null;
		}
	},

	/**
	 * Hide the tooltip
	 */
	hide: function () {
		if (!this.tooltipIsHidden) {
			var hoverPoints = this.chart.hoverPoints;

			this.label.hide();

			// hide previous hoverPoints and set new
			if (hoverPoints) {
				each(hoverPoints, function (point) {
					point.setState();
				});
			}

			this.chart.hoverPoints = null;
			this.tooltipIsHidden = true;
		}
	},

	/**
	 * Hide the crosshairs
	 */
	hideCrosshairs: function () {
		each(this.crosshairs, function (crosshair) {
			if (crosshair) {
				crosshair.hide();
			}
		});
	},
	
	/** 
	 * Extendable method to get the anchor position of the tooltip
	 * from a point or set of points
	 */
	getAnchor: function (points) {
		var ret,
			chart = this.chart,
			inverted = chart.inverted,
			plotX = 0,
			plotY = 0;
		
		points = splat(points);
		
		// Pie uses a special tooltipPos
		ret = points[0].tooltipPos;
		
		// When shared, use the average position
		if (!ret) {
			each(points, function (point) {
				plotX += point.plotX;
				plotY += point.plotLow ? (point.plotLow + point.plotHigh) / 2 : point.plotY;
			});
			
			plotX /= points.length;
			plotY /= points.length;
			
			ret = [
				inverted ? chart.plotWidth - plotY : plotX,
				inverted ? chart.plotHeight - plotX : plotY
			];
		}

		return map(ret, mathRound);
	},
	
	/**
	 * Place the tooltip in a chart without spilling over
	 * and not covering the point it self.
	 */
	getPosition: function (boxWidth, boxHeight, point) {
		
		// Set up the variables
		var chart = this.chart,
			plotLeft = chart.plotLeft,
			plotTop = chart.plotTop,
			plotWidth = chart.plotWidth,
			plotHeight = chart.plotHeight,
			distance = pick(this.options.distance, 12),
			pointX = point.plotX,
			pointY = point.plotY,
			x = pointX + plotLeft + (chart.inverted ? distance : -boxWidth - distance),
			y = pointY - boxHeight + plotTop + 15, // 15 means the point is 15 pixels up from the bottom of the tooltip
			alignedRight;
	
		// It is too far to the left, adjust it
		if (x < 7) {
			x = plotLeft + pointX + distance;
		}
	
		// Test to see if the tooltip is too far to the right,
		// if it is, move it back to be inside and then up to not cover the point.
		if ((x + boxWidth) > (plotLeft + plotWidth)) {
			x -= (x + boxWidth) - (plotLeft + plotWidth);
			y = pointY - boxHeight + plotTop - distance;
			alignedRight = true;
		}
	
		// If it is now above the plot area, align it to the top of the plot area
		if (y < plotTop + 5) {
			y = plotTop + 5;
	
			// If the tooltip is still covering the point, move it below instead
			if (alignedRight && pointY >= y && pointY <= (y + boxHeight)) {
				y = pointY + plotTop + distance; // below
			}
		} 
	
		// Now if the tooltip is below the chart, move it up. It's better to cover the
		// point than to disappear outside the chart. #834.
		if (y + boxHeight > plotTop + plotHeight) {
			y = plotTop + plotHeight - boxHeight - distance; // below
		}
		
	
		return {x: x, y: y};
	},

	/**
	 * Refresh the tooltip's text and position.
	 * @param {Object} point
	 */
	refresh: function (point) {
		var tooltip = this,
			chart = tooltip.chart,
			label = tooltip.label,
			options = tooltip.options;

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

		var x,
			y,
			show,
			anchor,
			textConfig = {},
			text,
			pointConfig = [],
			formatter = options.formatter || defaultFormatter,
			hoverPoints = chart.hoverPoints,
			placedTooltipPoint,
			borderColor,
			crosshairsOptions = options.crosshairs;
			
		// get the reference point coordinates (pie charts use tooltipPos)
		anchor = tooltip.getAnchor(point);
		x = anchor[0];
		y = anchor[1];

		// shared tooltip, array is sent over
		if (tooltip.shared && !(point.series && point.series.noSharedTooltip)) {
			
			// hide previous hoverPoints and set new
			if (hoverPoints) {
				each(hoverPoints, function (point) {
					point.setState();
				});
			}
			chart.hoverPoints = point;

			each(point, function (item) {
				item.setState(HOVER_STATE);

				pointConfig.push(item.getLabelConfig());
			});

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
		tooltip.currentSeries = point.series;


		// For line type series, hide tooltip if the point falls outside the plot
		show = tooltip.shared || !tooltip.currentSeries.isCartesian || tooltip.currentSeries.tooltipOutsidePlot || chart.isInsidePlot(x, y);

		// update the inner HTML
		if (text === false || !show) {
			this.hide();
		} else {

			// show it
			if (tooltip.tooltipIsHidden) {
				label.show();
			}

			// update text
			label.attr({
				text: text
			});

			// set the stroke color of the box
			borderColor = options.borderColor || point.color || tooltip.currentSeries.color || '#606060';
			label.attr({
				stroke: borderColor
			});

			placedTooltipPoint = (options.positioner || tooltip.getPosition).call( // docs
				tooltip,
				label.width,
				label.height,
				{ plotX: x, plotY: y }
			);

			// do the move
			tooltip.move(mathRound(placedTooltipPoint.x), mathRound(placedTooltipPoint.y));
			
			
			tooltip.tooltipIsHidden = false;
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

					path = axis.getPlotLinePath(
						i ? pick(point.stackY, point.y) : point.x, // #814
						1
					);

					if (tooltip.crosshairs[i]) {
						tooltip.crosshairs[i].attr({ d: path, visibility: VISIBLE });
					} else {
						attribs = {
							'stroke-width': crosshairsOptions[i].width || 1,
							stroke: crosshairsOptions[i].color || '#C0C0C0',
							zIndex: crosshairsOptions[i].zIndex || 2
						};
						if (crosshairsOptions[i].dashStyle) {
							attribs.dashstyle = crosshairsOptions[i].dashStyle;
						}
						tooltip.crosshairs[i] = chart.renderer.path(path)
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
	},

	/**
	 * Runs the tooltip animation one tick.
	 */
	tick: function () {
		if (this.tooltipTick) {
			this.tooltipTick();
		}
	}
};
