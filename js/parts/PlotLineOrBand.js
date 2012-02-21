/**
 * Context holding the variables that were in local closure in the chart.
 */
function PlotLineOrBandContext(chart, axis, isLog, getMin, getMax, getAxisWidth, getAxisHeight, horiz, plotLinesAndBands) {
	return {
		chart: chart, // object
		axis: axis, // object
		isLog: isLog, // constant
		getMin: getMin, // function
		getMax: getMax, // function
		getAxisWidth: getAxisWidth, // function
		getAxisHeight: getAxisHeight, // function
		horiz: horiz, // constant
		plotLinesAndBands: plotLinesAndBands // object
	};
}


/**
 * The object wrapper for plot lines and plot bands
 * @param {Object} options
 */
function PlotLineOrBand(context, options) {
	this.cx = context;

	if (options) {
		this.options = options;
		this.id = options.id;
	}

	//plotLine.render()
	return this;
}

PlotLineOrBand.prototype = {

	/**
	 * Render the plot line or plot band. If it is already existing,
	 * move it.
	 */
	render: function () {
		var plotLine = this,
			halfPointRange = (plotLine.cx.axis.pointRange || 0) / 2,
			options = plotLine.options,
			optionsLabel = options.label,
			label = plotLine.label,
			width = options.width,
			to = options.to,
			from = options.from,
			value = options.value,
			toPath, // bands only
			dashStyle = options.dashStyle,
			svgElem = plotLine.svgElem,
			path = [],
			addEvent,
			eventType,
			xs,
			ys,
			x,
			y,
			color = options.color,
			zIndex = options.zIndex,
			events = options.events,
			attribs;

		// logarithmic conversion
		if (plotLine.cx.isLog) {
			from = log2lin(from);
			to = log2lin(to);
			value = log2lin(value);
	}

		// plot line
		if (width) {
			path = plotLine.cx.axis.getPlotLinePath(value, width);
			attribs = {
				stroke: color,
				'stroke-width': width
			};
			if (dashStyle) {
				attribs.dashstyle = dashStyle;
			}
		} else if (defined(from) && defined(to)) { // plot band
			// keep within plot area
			from = mathMax(from, plotLine.cx.getMin() - halfPointRange);
			to = mathMin(to, plotLine.cx.getMax() + halfPointRange);

			toPath = plotLine.cx.axis.getPlotLinePath(to);
			path = plotLine.cx.axis.getPlotLinePath(from);
			if (path && toPath) {
				path.push(
					toPath[4],
					toPath[5],
					toPath[1],
					toPath[2]
				);
			} else { // outside the axis area
				path = null;
			}
			attribs = {
				fill: color
			};
		} else {
			return;
		}
		// zIndex
		if (defined(zIndex)) {
			attribs.zIndex = zIndex;
		}

		// common for lines and bands
		if (svgElem) {
			if (path) {
				svgElem.animate({
					d: path
				}, null, svgElem.onGetPath);
			} else {
				svgElem.hide();
				svgElem.onGetPath = function () {
					svgElem.show();
				};
			}
		} else if (path && path.length) {
			plotLine.svgElem = svgElem = plotLine.cx.chart.renderer.path(path)
				.attr(attribs).add();

			// events
			if (events) {
				addEvent = function (eventType) {
					svgElem.on(eventType, function (e) {
						events[eventType].apply(plotLine, [e]);
					});
				};
				for (eventType in events) {
					addEvent(eventType);
				}
			}
		}

		// the plot band/line label
		if (optionsLabel && defined(optionsLabel.text) && path && path.length && plotLine.cx.getAxisWidth() > 0 && plotLine.cx.getAxisHeight() > 0) {
			// apply defaults
			var horiz = plotLine.cx.horiz;
			optionsLabel = merge({
				align: horiz && toPath && 'center',
				x: horiz ? !toPath && 4 : 10,
				verticalAlign : !horiz && toPath && 'middle',
				y: horiz ? toPath ? 16 : 10 : toPath ? 6 : -4,
				rotation: horiz && !toPath && 90
			}, optionsLabel);

			// add the SVG element
			if (!label) {
				plotLine.label = label = plotLine.cx.chart.renderer.text(
						optionsLabel.text,
						0,
						0
					)
					.attr({
						align: optionsLabel.textAlign || optionsLabel.align,
						rotation: optionsLabel.rotation,
						zIndex: zIndex
					})
					.css(optionsLabel.style)
					.add();
			}

			// get the bounding box and align the label
			xs = [path[1], path[4], pick(path[6], path[1])];
			ys = [path[2], path[5], pick(path[7], path[2])];
			x = arrayMin(xs);
			y = arrayMin(ys);

			label.align(optionsLabel, false, {
				x: x,
				y: y,
				width: arrayMax(xs) - x,
				height: arrayMax(ys) - y
			});
			label.show();

		} else if (label) { // move out of sight
			label.hide();
		}

		// chainable
		return plotLine;
	},

	/**
	 * Remove the plot line or band
	 */
	destroy: function () {
		var obj = this;

		destroyObjectProperties(obj);

		// remove it from the lookup
		erase(this.cx.plotLinesAndBands, obj);
	}
};
