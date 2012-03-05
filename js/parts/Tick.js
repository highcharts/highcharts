/**
 * Context holding the variables that were in local closure in the chart.
 */
function TickContext(
		axis,
		options,
		labelFormatter,
		getOldChartHeight,
		getOldChartWidth,
		tickmarkOffset
	) {
	return {
		axis: axis, // object
		options: options, // object
		labelFormatter: labelFormatter, // function
		getOldChartHeight: getOldChartHeight, // function
		getOldChartWidth: getOldChartWidth, // function
		tickmarkOffset: tickmarkOffset // constant
	};
}

/**
 * The Tick class
 */
function Tick(context, pos, type) {
	this.cx = context;
	this.pos = pos;
	this.type = type || '';
	this.isNew = true;

	if (!type) {
		this.addLabel();
	}
}

Tick.prototype = {
	/**
	 * Write the tick label
	 */
	addLabel: function () {
		var tick = this,
			context = this.cx,
			axis = context.axis,
			chart = axis.chart,
			horiz = axis.horiz,
			categories = axis.categories,
			pos = tick.pos,
			labelOptions = context.options.labels,
			str,
			width = (categories && horiz && categories.length &&
				!labelOptions.step && !labelOptions.staggerLines &&
				!labelOptions.rotation &&
				chart.plotWidth / categories.length) ||
				(!horiz && chart.plotWidth / 2),
			tickPositions = axis.tickPositions,
			isFirst = pos === tickPositions[0],
			isLast = pos === tickPositions[tickPositions.length - 1],
			css,
			value = categories && defined(categories[pos]) ? categories[pos] : pos,
			label = tick.label,
			tickPositionInfo = tickPositions.info,
			dateTimeLabelFormat;

		// Set the datetime label format. If a higher rank is set for this position, use that. If not,
		// use the general format.
		if (axis.isDatetimeAxis && tickPositionInfo) {
			dateTimeLabelFormat = context.options.dateTimeLabelFormats[tickPositionInfo.higherRanks[pos] || tickPositionInfo.unitName];
		}

		// set properties for access in render method
		tick.isFirst = isFirst;
		tick.isLast = isLast;

		// get the string
		str = context.labelFormatter.call({
			axis: axis,
			chart: chart,
			isFirst: isFirst,
			isLast: isLast,
			dateTimeLabelFormat: dateTimeLabelFormat,
			value: axis.isLog ? correctFloat(lin2log(value)) : value
		});

		// prepare CSS
		css = width && { width: mathMax(1, mathRound(width - 2 * (labelOptions.padding || 10))) + PX };
		css = extend(css, labelOptions.style);

		// first call
		if (!defined(label)) {
			tick.label =
				defined(str) && labelOptions.enabled ?
					chart.renderer.text(
							str,
							0,
							0,
							labelOptions.useHTML
						)
						.attr({
							align: labelOptions.align,
							rotation: labelOptions.rotation
						})
						// without position absolute, IE export sometimes is wrong
						.css(css)
						.add(axis.axisGroup) :
					null;

		// update
		} else if (label) {
			label.attr({
					text: str
				})
				.css(css);
		}
	},

	/**
	 * Get the offset height or width of the label
	 */
	getLabelSize: function () {
		var label = this.label;
		return label ?
			((this.labelBBox = label.getBBox()))[this.cx.axis.horiz ? 'height' : 'width'] :
			0;
		},

	/**
	 * Put everything in place
	 *
	 * @param index {Number}
	 * @param old {Boolean} Use old coordinates to prepare an animation into new position
	 */
	render: function (index, old) {
		var tick = this,
			context = tick.cx,
			axis = context.axis,
			chart = axis.chart,
			renderer = chart.renderer,
			horiz = axis.horiz,
			type = tick.type,
			label = tick.label,
			pos = tick.pos,
			labelOptions = context.options.labels,
			gridLine = tick.gridLine,
			gridPrefix = type ? type + 'Grid' : 'grid',
			tickPrefix = type ? type + 'Tick' : 'tick',
			gridLineWidth = context.options[gridPrefix + 'LineWidth'],
			gridLineColor = context.options[gridPrefix + 'LineColor'],
			dashStyle = context.options[gridPrefix + 'LineDashStyle'],
			tickLength = context.options[tickPrefix + 'Length'],
			tickWidth = context.options[tickPrefix + 'Width'] || 0,
			tickColor = context.options[tickPrefix + 'Color'],
			tickPosition = context.options[tickPrefix + 'Position'],
			gridLinePath,
			mark = tick.mark,
			markPath,
			step = labelOptions.step,
			cHeight = (old && context.getOldChartHeight()) || chart.chartHeight,
			attribs,
			x,
			y;

		// get x and y position for ticks and labels
		x = horiz ?
			axis.translate(pos + context.tickmarkOffset, null, null, old) + axis.transB :
			axis.left + axis.offset + (axis.opposite ? ((old && context.getOldChartWidth()) || chart.chartWidth) - axis.right - tick.cx.axis.left : 0);

		y = horiz ?
			cHeight - axis.bottom + axis.offset - (axis.opposite ? axis.height : 0) :
			cHeight - axis.translate(pos + context.tickmarkOffset, null, null, old) - axis.transB;

		// create the grid line
		if (gridLineWidth) {
			gridLinePath = axis.getPlotLinePath(pos + context.tickmarkOffset, gridLineWidth, old);

			if (gridLine === UNDEFINED) {
				attribs = {
					stroke: gridLineColor,
					'stroke-width': gridLineWidth
				};
				if (dashStyle) {
					attribs.dashstyle = dashStyle;
				}
				if (!type) {
					attribs.zIndex = 1;
				}
				tick.gridLine = gridLine =
					gridLineWidth ?
						renderer.path(gridLinePath)
							.attr(attribs).add(axis.gridGroup) :
						null;
			}

			// If the parameter 'old' is set, the current call will be followed
			// by another call, therefore do not do any animations this time
			if (!old && gridLine && gridLinePath) {
				gridLine.animate({
					d: gridLinePath
				});
			}
		}

		// create the tick mark
		if (tickWidth) {

			// negate the length
			if (tickPosition === 'inside') {
				tickLength = -tickLength;
			}
			if (axis.opposite) {
				tickLength = -tickLength;
			}

			markPath = renderer.crispLine([
				M,
				x,
				y,
				L,
				x + (horiz ? 0 : -tickLength),
				y + (horiz ? tickLength : 0)
			], tickWidth);

			if (mark) { // updating
				mark.animate({
					d: markPath
				});
			} else { // first time
				tick.mark = renderer.path(
					markPath
				).attr({
					stroke: tickColor,
					'stroke-width': tickWidth
				}).add(axis.axisGroup);
			}
		}

		// the label is created on init - now move it into place
		if (label && !isNaN(x)) {
			x = x + labelOptions.x - (context.tickmarkOffset && horiz ?
				context.tickmarkOffset * axis.transA * (axis.reversed ? -1 : 1) : 0);
			y = y + labelOptions.y - (context.tickmarkOffset && !horiz ?
				context.tickmarkOffset * axis.transA * (axis.reversed ? 1 : -1) : 0);

			// vertically centered
			if (!defined(labelOptions.y)) {
				y += pInt(label.styles.lineHeight) * 0.9 - label.getBBox().height / 2;
			}


			// correct for staggered labels
			if (axis.staggerLines) {
				y += (index / (step || 1) % axis.staggerLines) * 16;
			}

			// apply show first and show last
			if ((tick.isFirst && !pick(context.options.showFirstLabel, 1)) ||
					(tick.isLast && !pick(context.options.showLastLabel, 1))) {
				label.hide();
			} else {
				// show those that may have been previously hidden, either by show first/last, or by step
				label.show();
			}

			// apply step
			if (step && index % step) {
				// show those indices dividable by step
				label.hide();
			}

			label[tick.isNew ? 'attr' : 'animate']({
				x: x,
				y: y
			});
		}

		tick.isNew = false;
	},

	/**
	 * Destructor for the tick prototype
	 */
	destroy: function () {
		destroyObjectProperties(this);
	}
};

