/**
 * Context holding the variables that were in local closure in the chart.
 */
function TickContext(
		chart,
		axis,
		options,
		categories,
		horiz,
		getTickPositions,
		isDatetimeAxis,
		labelFormatter,
		isLog,
		getAxisGroup,
		getGridGroup,
		getOldChartHeight,
		getOldChartWidth,
		tickmarkOffset,
		getTransA,
		getTransB,
		getAxisLeft,
		getAxisRight,
		getAxisBottom,
		getAxisHeight,
		opposite,
		staggerLines,
		offset
	) {
	return {
		chart: chart, // object
		axis: axis, // object
		options: options, // object
		categories: categories, // object
		horiz: horiz, // constant
		getTickPositions: getTickPositions, // function
		isDatetimeAxis: isDatetimeAxis, // constant
		labelFormatter: labelFormatter, // function
		isLog: isLog, // constant
		getAxisGroup: getAxisGroup, // function
		getGridGroup: getGridGroup, // function
		getOldChartHeight: getOldChartHeight, // function
		getOldChartWidth: getOldChartWidth, // function
		tickmarkOffset: tickmarkOffset, // constant
		getTransA: getTransA, // function
		getTransB: getTransB, // function
		getAxisLeft: getAxisLeft, // function
		getAxisRight: getAxisRight, // function
		getAxisBottom: getAxisBottom, // function
		getAxisHeight: getAxisHeight, // function
		opposite: opposite, // constant
		staggerLines: staggerLines, // constant
		offset: offset // constant
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
			pos = tick.pos,
			labelOptions = tick.cx.options.labels,
			str,
			width = (tick.cx.categories && tick.cx.horiz && tick.cx.categories.length &&
				!labelOptions.step && !labelOptions.staggerLines &&
				!labelOptions.rotation &&
				tick.cx.chart.plotWidth / tick.cx.categories.length) ||
				(!tick.cx.horiz && tick.cx.chart.plotWidth / 2),
			tickPositions = tick.cx.getTickPositions(),
			isFirst = pos === tickPositions[0],
			isLast = pos === tickPositions[tickPositions.length - 1],
			css,
			value = tick.cx.categories && defined(tick.cx.categories[pos]) ? tick.cx.categories[pos] : pos,
			label = tick.label,
			tickPositionInfo = tickPositions.info,
			dateTimeLabelFormat;

		// Set the datetime label format. If a higher rank is set for this position, use that. If not,
		// use the general format.
		if (tick.cx.isDatetimeAxis && tickPositionInfo) {
			dateTimeLabelFormat = tick.cx.options.dateTimeLabelFormats[tickPositionInfo.higherRanks[pos] || tickPositionInfo.unitName];
		}

		// set properties for access in render method
		tick.isFirst = isFirst;
		tick.isLast = isLast;

		// get the string
		str = tick.cx.labelFormatter.call({
			axis: tick.cx.axis,
			chart: tick.cx.chart,
			isFirst: isFirst,
			isLast: isLast,
			dateTimeLabelFormat: dateTimeLabelFormat,
			value: tick.cx.isLog ? correctFloat(lin2log(value)) : value
		});

		// prepare CSS
		css = width && { width: mathMax(1, mathRound(width - 2 * (labelOptions.padding || 10))) + PX };
		css = extend(css, labelOptions.style);

		// first call
		if (!defined(label)) {
			tick.label =
				defined(str) && labelOptions.enabled ?
					tick.cx.chart.renderer.text(
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
						.add(tick.cx.getAxisGroup()) :
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
			((this.labelBBox = label.getBBox()))[this.cx.horiz ? 'height' : 'width'] :
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
			type = tick.type,
			label = tick.label,
			pos = tick.pos,
			labelOptions = tick.cx.options.labels,
			gridLine = tick.gridLine,
			gridPrefix = type ? type + 'Grid' : 'grid',
			tickPrefix = type ? type + 'Tick' : 'tick',
			gridLineWidth = tick.cx.options[gridPrefix + 'LineWidth'],
			gridLineColor = tick.cx.options[gridPrefix + 'LineColor'],
			dashStyle = tick.cx.options[gridPrefix + 'LineDashStyle'],
			tickLength = tick.cx.options[tickPrefix + 'Length'],
			tickWidth = tick.cx.options[tickPrefix + 'Width'] || 0,
			tickColor = tick.cx.options[tickPrefix + 'Color'],
			tickPosition = tick.cx.options[tickPrefix + 'Position'],
			gridLinePath,
			mark = tick.mark,
			markPath,
			step = labelOptions.step,
			cHeight = (old && tick.cx.getOldChartHeight()) || tick.cx.chart.chartHeight,
			attribs,
			x,
			y;

		// get x and y position for ticks and labels
		x = tick.cx.horiz ?
			tick.cx.axis.translate(pos + tick.cx.tickmarkOffset, null, null, old) + tick.cx.getTransB() :
			tick.cx.getAxisLeft() + tick.cx.offset + (tick.cx.opposite ? ((old && tick.cx.getOldChartWidth()) || tick.cx.chart.chartWidth) - tick.cx.getAxisRight() - tick.cx.getAxisLeft() : 0);

		y = tick.cx.horiz ?
			cHeight - tick.cx.getAxisBottom() + tick.cx.offset - (tick.cx.opposite ? tick.cs.getAxisHeight() : 0) :
			cHeight - tick.cx.axis.translate(pos + tick.cx.tickmarkOffset, null, null, old) - tick.cx.getTransB();

		// create the grid line
		if (gridLineWidth) {
			gridLinePath = tick.cx.axis.getPlotLinePath(pos + tick.cx.tickmarkOffset, gridLineWidth, old);

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
						tick.cx.chart.renderer.path(gridLinePath)
							.attr(attribs).add(tick.cx.getGridGroup()) :
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
			if (tick.cx.opposite) {
				tickLength = -tickLength;
			}

			markPath = tick.cx.chart.renderer.crispLine([
				M,
				x,
				y,
				L,
				x + (tick.cx.horiz ? 0 : -tickLength),
				y + (tick.cx.horiz ? tickLength : 0)
			], tickWidth);

			if (mark) { // updating
				mark.animate({
					d: markPath
				});
			} else { // first time
				tick.mark = tick.cx.chart.renderer.path(
					markPath
				).attr({
					stroke: tickColor,
					'stroke-width': tickWidth
				}).add(tick.cx.getAxisGroup());
			}
		}

		// the label is created on init - now move it into place
		if (label && !isNaN(x)) {
			x = x + labelOptions.x - (tick.cx.tickmarkOffset && tick.cx.horiz ?
				tick.cx.tickmarkOffset * tick.cx.getTransA() * (tick.cx.axis.reversed ? -1 : 1) : 0);
			y = y + labelOptions.y - (tick.cx.tickmarkOffset && !tick.cx.horiz ?
				tick.cx.tickmarkOffset * tick.cx.getTransA() * (tick.cx.axis.reversed ? 1 : -1) : 0);

			// vertically centered
			if (!defined(labelOptions.y)) {
				y += pInt(label.styles.lineHeight) * 0.9 - label.getBBox().height / 2;
			}


			// correct for staggered labels
			if (tick.cx.staggerLines) {
				y += (index / (step || 1) % tick.cx.staggerLines) * 16;
			}

			// apply show first and show last
			if ((tick.isFirst && !pick(tick.cx.options.showFirstLabel, 1)) ||
					(tick.isLast && !pick(tick.cx.options.showLastLabel, 1))) {
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

