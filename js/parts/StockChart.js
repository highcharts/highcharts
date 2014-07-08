/**
 * A wrapper for Chart with all the default values for a Stock chart
 */
Highcharts.StockChart = function (options, callback) {
	var seriesOptions = options.series, // to increase performance, don't merge the data 
		opposite,

		// Always disable startOnTick:true on the main axis when the navigator is enabled (#1090)
		navigatorEnabled = pick(options.navigator && options.navigator.enabled, true),
		disableStartOnTick = navigatorEnabled ? {
			startOnTick: false,
			endOnTick: false
		} : null,

		lineOptions = {

			marker: {
				enabled: false,
				radius: 2
			},
			// gapSize: 0,
			states: {
				hover: {
					lineWidth: 2
				}
			}
		},
		columnOptions = {
			shadow: false,
			borderWidth: 0
		};

	// apply X axis options to both single and multi y axes
	options.xAxis = map(splat(options.xAxis || {}), function (xAxisOptions) {
		return merge({ // defaults
				minPadding: 0,
				maxPadding: 0,
				ordinal: true,
				title: {
					text: null
				},
				labels: {
					overflow: 'justify'
				},
				showLastLabel: true
			}, xAxisOptions, // user options 
			{ // forced options
				type: 'datetime',
				categories: null
			},
			disableStartOnTick
		);
	});

	// apply Y axis options to both single and multi y axes
	options.yAxis = map(splat(options.yAxis || {}), function (yAxisOptions) {
		opposite = pick(yAxisOptions.opposite, true);
		return merge({ // defaults
			labels: {
				y: -2
			},
			opposite: opposite,
			showLastLabel: false,
			title: {
				text: null
			}
		}, yAxisOptions // user options
		);
	});

	options.series = null;

	options = merge({
		chart: {
			panning: true,
			pinchType: 'x'
		},
		navigator: {
			enabled: true
		},
		scrollbar: {
			enabled: true
		},
		rangeSelector: {
			enabled: true
		},
		title: {
			text: null,
			style: {
				fontSize: '16px'
			}
		},
		tooltip: {
			shared: true,
			crosshairs: true
		},
		legend: {
			enabled: false
		},

		plotOptions: {
			line: lineOptions,
			spline: lineOptions,
			area: lineOptions,
			areaspline: lineOptions,
			arearange: lineOptions,
			areasplinerange: lineOptions,
			column: columnOptions,
			columnrange: columnOptions,
			candlestick: columnOptions,
			ohlc: columnOptions
		}

	},
	options, // user's options

	{ // forced options
		_stock: true, // internal flag
		chart: {
			inverted: false
		}
	});

	options.series = seriesOptions;


	return new Chart(options, callback);
};

// Implement the pinchType option
wrap(Pointer.prototype, 'init', function (proceed, chart, options) {

	var pinchType = options.chart.pinchType || '';
		
	proceed.call(this, chart, options);

	// Pinch status
	this.pinchX = this.pinchHor = pinchType.indexOf('x') !== -1;
	this.pinchY = this.pinchVert = pinchType.indexOf('y') !== -1;
	this.hasZoom = this.hasZoom || this.pinchHor || this.pinchVert;
});

// Override the automatic label alignment so that the first Y axis' labels
// are drawn on top of the grid line, and subsequent axes are drawn outside
wrap(Axis.prototype, 'autoLabelAlign', function (proceed) {
	if (this.chart.options._stock && this.coll === 'yAxis') {
		if (inArray(this, this.chart.yAxis) === 0) {
			if (this.options.labels.x === 15) { // default
				this.options.labels.x = 0;
			}
			return 'right';
		}
	}
	return proceed.call(this, [].slice.call(arguments, 1));
});

// Override getPlotLinePath to allow for multipane charts
Axis.prototype.getPlotLinePath = function (value, lineWidth, old, force, translatedValue) {
	var axis = this,
		series = (this.isLinked && !this.series ? this.linkedParent.series : this.series),
		chart = axis.chart,
		renderer = chart.renderer,
		axisLeft = axis.left,
		axisTop = axis.top,
		x1,
		y1,
		x2,
		y2,
		result = [],
		axes,
		axes2,
		uniqueAxes;

	// Get the related axes based on series
	axes = (axis.isXAxis ? 
		(defined(axis.options.yAxis) ?
			[chart.yAxis[axis.options.yAxis]] : 
			map(series, function (S) { return S.yAxis; })
		) :
		(defined(axis.options.xAxis) ?
			[chart.xAxis[axis.options.xAxis]] : 
			map(series, function (S) { return S.xAxis; })
		)
	);


	// Get the related axes based options.*Axis setting #2810
	axes2 = (axis.isXAxis ? chart.yAxis : chart.xAxis);
	each(axes2, function (A) {
		if (defined(A.options.id) ? A.options.id.indexOf('navigator') === -1 : true) {
			var a = (A.isXAxis ? 'yAxis' : 'xAxis'),
				rax = (defined(A.options[a]) ? chart[a][A.options[a]] : chart[a][0]);	

			if (axis === rax) {
				axes.push(A);
			}
		}
	});


	// Remove duplicates in the axes array. If there are no axes in the axes array,
	// we are adding an axis without data, so we need to populate this with grid
	// lines (#2796).
	uniqueAxes = axes.length ? [] : [axis];
	each(axes, function (axis2) {
		if (inArray(axis2, uniqueAxes) === -1) {
			uniqueAxes.push(axis2);
		}
	});
	
	translatedValue = pick(translatedValue, axis.translate(value, null, null, old));
	
	if (!isNaN(translatedValue)) {
		if (axis.horiz) {
			each(uniqueAxes, function (axis2) {
				y1 = axis2.top;
				y2 = y1 + axis2.len;
				x1 = x2 = mathRound(translatedValue + axis.transB);

				if ((x1 >= axisLeft && x1 <= axisLeft + axis.width) || force) {
					result.push('M', x1, y1, 'L', x2, y2);
				}
			});
		} else {
			each(uniqueAxes, function (axis2) {
				x1 = axis2.left;
				x2 = x1 + axis2.width;
				y1 = y2 = mathRound(axisTop + axis.height - translatedValue);

				if ((y1 >= axisTop && y1 <= axisTop + axis.height) || force) {
					result.push('M', x1, y1, 'L', x2, y2);
				}
			});
		}
	}
	if (result.length > 0) {
		return renderer.crispPolyLine(result, lineWidth || 1); 
	}
};

// Override getPlotBandPath to allow for multipane charts
Axis.prototype.getPlotBandPath = function (from, to) {		
	var toPath = this.getPlotLinePath(to),
		path = this.getPlotLinePath(from),
		result = [],
		i;

	if (path && toPath) {
		// Go over each subpath
		for (i = 0; i < path.length; i += 6) {
			result.push('M', path[i + 1], path[i + 2], 'L', path[i + 4], path[i + 5], toPath[i + 4], toPath[i + 5], toPath[i + 1], toPath[i + 2]);
		}
	} else { // outside the axis area
		result = null;
	}
		
	return result;
};

// Function to crisp a line with multiple segments
SVGRenderer.prototype.crispPolyLine = function (points, width) {
	// points format: [M, 0, 0, L, 100, 0]		
	// normalize to a crisp line
	var i;
	for (i = 0; i < points.length; i = i + 6) {
		if (points[i + 1] === points[i + 4]) {
			// Substract due to #1129. Now bottom and left axis gridlines behave the same.
			points[i + 1] = points[i + 4] = mathRound(points[i + 1]) - (width % 2 / 2);
		}
		if (points[i + 2] === points[i + 5]) {
			points[i + 2] = points[i + 5] = mathRound(points[i + 2]) + (width % 2 / 2);
		}
	}
	return points;
};
if (Renderer === Highcharts.VMLRenderer) {
	VMLRenderer.prototype.crispPolyLine = SVGRenderer.prototype.crispPolyLine;
}


// Wrapper to hide the label
wrap(Axis.prototype, 'hideCrosshair', function (proceed, i) {
	proceed.call(this, i);

	if (!defined(this.crossLabelArray)) { return; }

	if (defined(i)) {
		if (this.crossLabelArray[i]) { this.crossLabelArray[i].hide(); }
	} else {
		each(this.crossLabelArray, function (crosslabel) {
			crosslabel.hide();
		});
	}
});

// Wrapper to draw the label
wrap(Axis.prototype, 'drawCrosshair', function (proceed, e, point) {
	// Draw the crosshair
	proceed.call(this, e, point);

	// Check if the label has to be drawn
	if (!defined(this.crosshair.label) || !this.crosshair.label.enabled || !defined(point)) { 
		return; 
	}

	var chart = this.chart,
		options = this.options.crosshair.label,		// the label's options
		axis = this.isXAxis ? 'x' : 'y',			// axis name
		horiz = this.horiz,							// axis orientation
		opposite = this.opposite,					// axis position
		left = this.left,							// left position
		top = this.top,								// top position
		crossLabel = this.crossLabel,				// reference to the svgElement
		posx,
		posy,
		crossBox,
		formatOption = options.format,
		formatFormat = '',
		limit;

	// If the label does not exist yet, create it.
	if (!crossLabel) {
		crossLabel = this.crossLabel = chart.renderer.label()			
		.attr({
			align: options.align || (horiz ? 'center' : opposite ? (this.labelAlign === 'right' ? 'right' : 'left') : (this.labelAlign === 'left' ? 'left' : 'center')),
			zIndex: 12,
			height: horiz ? 16 : UNDEFINED,
			fill: options.backgroundColor || (this.series[0] && this.series[0].color) || 'gray',
			padding: pick(options.padding, 2),
			stroke: options.borderColor || null,
			'stroke-width': options.borderWidth || 0
		})
		.css(extend({				
			color: 'white',
			fontWeight: 'normal',
			fontSize: '11px',
			textAlign: 'center'
		}, options.style))
		.add();
	}

	if (horiz) {
		posx = point.plotX + left;
		posy = top + (opposite ? 0 : this.height);
	} else {
		posx = opposite ? this.width + left : 0;
		posy = point.plotY + top;
	}

	// if the crosshair goes out of view (too high or too low, hide it and hide the label)
	if (posy < top || posy > top + this.height) {
		this.hideCrosshair();
		return;
	}

	// TODO: Dynamic date formats like in Series.tooltipHeaderFormat. 
	if (!formatOption && !options.formatter) {
		if (this.isDatetimeAxis) {
			formatFormat = '%b %d, %Y';
		}
		formatOption = '{value' + (formatFormat ? ':' + formatFormat : '') + '}';
	}

	// show the label
	crossLabel.attr({
		text: formatOption ? format(formatOption, {value: point[axis]}) : options.formatter.call(this, point[axis]), 
		x: posx, 
		y: posy, 
		visibility: VISIBLE
	});
	crossBox = crossLabel.getBBox();

	// now it is placed we can correct its position
	if (horiz) {
		if (((this.options.tickPosition === 'inside') && !opposite) ||
			((this.options.tickPosition !== 'inside') && opposite)) {
			posy = crossLabel.y - crossBox.height;
		}	
	} else {
		posy = crossLabel.y - (crossBox.height / 2);
	}

	// check the edges
	if (horiz) {
		limit = {
			left: left - crossBox.x,
			right: left + this.width - crossBox.x
		};
	} else {
		limit = {
			left: this.labelAlign === 'left' ? left : 0,
			right: this.labelAlign === 'right' ? left + this.width : chart.chartWidth
		};
	}

	// left edge
	if (crossLabel.translateX < limit.left) {
		posx += limit.left - crossLabel.translateX;
	}
	// right edge
	if (crossLabel.translateX + crossBox.width >= limit.right) {
		posx -= crossLabel.translateX + crossBox.width - limit.right;
	}

	// show the crosslabel
	crossLabel.attr({x: posx, y: posy, visibility: VISIBLE});
});

/* ****************************************************************************
 * Start value compare logic                                                  *
 *****************************************************************************/
 
var seriesInit = seriesProto.init, 
	seriesProcessData = seriesProto.processData,
	pointTooltipFormatter = Point.prototype.tooltipFormatter;
	
/**
 * Extend series.init by adding a method to modify the y value used for plotting
 * on the y axis. This method is called both from the axis when finding dataMin
 * and dataMax, and from the series.translate method.
 */
seriesProto.init = function () {
	
	// Call base method
	seriesInit.apply(this, arguments);
	
	// Set comparison mode
	this.setCompare(this.options.compare);
};

/**
 * The setCompare method can be called also from the outside after render time
 */
seriesProto.setCompare = function (compare) {

	// Set or unset the modifyValue method
	this.modifyValue = (compare === 'value' || compare === 'percent') ? function (value, point) {
		var compareValue = this.compareValue;
		
		if (value !== UNDEFINED) { // #2601

			// get the modified value
			value = compare === 'value' ? 
				value - compareValue : // compare value
				value = 100 * (value / compareValue) - 100; // compare percent
				
			// record for tooltip etc.
			if (point) {
				point.change = value;
			}
			
		}
		
		return value;
	} : null;

	// Mark dirty
	if (this.chart.hasRendered) {
		this.isDirty = true;
	}

};

/**
 * Extend series.processData by finding the first y value in the plot area,
 * used for comparing the following values 
 */
seriesProto.processData = function () {
	var series = this,
		i = 0,
		processedXData,
		processedYData,
		length;
	
	// call base method
	seriesProcessData.apply(this, arguments);

	if (series.xAxis && series.processedYData) { // not pies
		
		// local variables
		processedXData = series.processedXData;
		processedYData = series.processedYData;
		length = processedYData.length;
		
		// find the first value for comparison
		for (; i < length; i++) {
			if (typeof processedYData[i] === NUMBER && processedXData[i] >= series.xAxis.min) {
				series.compareValue = processedYData[i];
				break;
			}
		}
	}
};

/**
 * Modify series extremes
 */
wrap(seriesProto, 'getExtremes', function (proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	if (this.modifyValue) {
		this.dataMax = this.modifyValue(this.dataMax);
		this.dataMin = this.modifyValue(this.dataMin);
	}		
});

/**
 * Add a utility method, setCompare, to the Y axis
 */
Axis.prototype.setCompare = function (compare, redraw) {
	if (!this.isXAxis) {
		each(this.series, function (series) {
			series.setCompare(compare);
		});
		if (pick(redraw, true)) {
			this.chart.redraw();
		}
	}
};

/**
 * Extend the tooltip formatter by adding support for the point.change variable
 * as well as the changeDecimals option
 */
Point.prototype.tooltipFormatter = function (pointFormat) {
	var point = this;
	
	pointFormat = pointFormat.replace(
		'{point.change}',
		(point.change > 0 ? '+' : '') + numberFormat(point.change, pick(point.series.tooltipOptions.changeDecimals, 2))
	); 
	
	return pointTooltipFormatter.apply(this, [pointFormat]);
};

/* ****************************************************************************
 * End value compare logic                                                    *
 *****************************************************************************/


/**
 * Extend the Series prototype to create a separate series clip box. This is related
 * to using multiple panes, and a future pane logic should incorporate this feature.
 */
wrap(Series.prototype, 'render', function (proceed) {
	// Only do this on stock charts (#2939), and only if the series type handles clipping
	// in the animate method (#2975).
	if (this.chart.options._stock) {

		// First render, initial clip box
		if (!this.clipBox && this.animate && this.animate.toString().indexOf('sharedClip') !== -1) {
			this.clipBox = merge(this.chart.clipBox);
			this.clipBox.width = this.xAxis.len;
			this.clipBox.height = this.yAxis.len;

		// On redrawing, resizing etc, update the clip rectangle
		} else if (this.chart[this.sharedClipKey]) {
			this.chart[this.sharedClipKey].attr({
				width: this.xAxis.len,
				height: this.yAxis.len
			});
		}
	}
	proceed.call(this);
});
