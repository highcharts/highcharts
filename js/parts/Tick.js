/**
 * The Tick class
 */
function Tick(axis, pos, type, noLabel) {
	this.axis = axis;
	this.pos = pos;
	this.type = type || '';
	this.isNew = true;

	if (!type && !noLabel) {
		this.addLabel();
	}
}

Tick.prototype = {
	/**
	 * Write the tick label
	 */
	addLabel: function () {
		var tick = this,
			axis = tick.axis,
			options = axis.options,
			chart = axis.chart,
			horiz = axis.horiz,
			categories = axis.categories,
			names = axis.series[0] && axis.series[0].names,
			pos = tick.pos,
			labelOptions = options.labels,
			str,
			tickPositions = axis.tickPositions,
			width = (horiz && categories &&
				!labelOptions.step && !labelOptions.staggerLines &&
				!labelOptions.rotation &&
				chart.plotWidth / tickPositions.length) ||
				(!horiz && (chart.optionsMarginLeft || chart.chartWidth * 0.33)), // #1580, #1931
			isFirst = pos === tickPositions[0],
			isLast = pos === tickPositions[tickPositions.length - 1],
			css,
			attr,
			value = categories ?
				pick(categories[pos], names && names[pos], pos) : 
				pos,
			label = tick.label,
			tickPositionInfo = tickPositions.info,
			dateTimeLabelFormat;

		// Set the datetime label format. If a higher rank is set for this position, use that. If not,
		// use the general format.
		if (axis.isDatetimeAxis && tickPositionInfo) {
			dateTimeLabelFormat = options.dateTimeLabelFormats[tickPositionInfo.higherRanks[pos] || tickPositionInfo.unitName];
		}

		// set properties for access in render method
		tick.isFirst = isFirst;
		tick.isLast = isLast;

		// get the string
		str = axis.labelFormatter.call({
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
			attr = {
				align: axis.labelAlign
			};
			if (isNumber(labelOptions.rotation)) {
				attr.rotation = labelOptions.rotation;
			}			
			tick.label =
				defined(str) && labelOptions.enabled ?
					chart.renderer.text(
							str,
							0,
							0,
							labelOptions.useHTML
						)
						.attr(attr)
						// without position absolute, IE export sometimes is wrong
						.css(css)
						.add(axis.labelGroup) :
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
		var label = this.label,
			axis = this.axis;
		return label ?
			((this.labelBBox = label.getBBox()))[axis.horiz ? 'height' : 'width'] :
			0;
	},

	/**
	 * Find how far the labels extend to the right and left of the tick's x position. Used for anti-collision
	 * detection with overflow logic.
	 */
	getLabelSides: function () {
		var bBox = this.labelBBox, // assume getLabelSize has run at this point
			axis = this.axis,
			options = axis.options,
			labelOptions = options.labels,
			width = bBox.width,
			leftSide = width * { left: 0, center: 0.5, right: 1 }[axis.labelAlign] - labelOptions.x;

		return [-leftSide, width - leftSide];
	},

	/**
	 * Handle the label overflow by adjusting the labels to the left and right edge, or
	 * hide them if they collide into the neighbour label.
	 */
	handleOverflow: function (index, xy) {
		var show = true,
			axis = this.axis,
			chart = axis.chart,
			isFirst = this.isFirst,
			isLast = this.isLast,
			x = xy.x,
			reversed = axis.reversed,
			tickPositions = axis.tickPositions;

		if (isFirst || isLast) {

			var sides = this.getLabelSides(),
				leftSide = sides[0],
				rightSide = sides[1],
				plotLeft = chart.plotLeft,
				plotRight = plotLeft + axis.len,
				neighbour = axis.ticks[tickPositions[index + (isFirst ? 1 : -1)]],
				neighbourEdge = neighbour && neighbour.label.xy && neighbour.label.xy.x + neighbour.getLabelSides()[isFirst ? 0 : 1];

			if ((isFirst && !reversed) || (isLast && reversed)) {
				// Is the label spilling out to the left of the plot area?
				if (x + leftSide < plotLeft) {

					// Align it to plot left
					x = plotLeft - leftSide;

					// Hide it if it now overlaps the neighbour label
					if (neighbour && x + rightSide > neighbourEdge) {
						show = false;
					}
				}

			} else {
				// Is the label spilling out to the right of the plot area?
				if (x + rightSide > plotRight) {

					// Align it to plot right
					x = plotRight - rightSide;

					// Hide it if it now overlaps the neighbour label
					if (neighbour && x + leftSide < neighbourEdge) {
						show = false;
					}

				}
			}

			// Set the modified x position of the label
			xy.x = x;
		}
		return show;
	},

	/**
	 * Get the x and y position for ticks and labels
	 */
	getPosition: function (horiz, pos, tickmarkOffset, old) {
		var axis = this.axis,
			chart = axis.chart,
			cHeight = (old && chart.oldChartHeight) || chart.chartHeight;
		
		return {
			x: horiz ?
				axis.translate(pos + tickmarkOffset, null, null, old) + axis.transB :
				axis.left + axis.offset + (axis.opposite ? ((old && chart.oldChartWidth) || chart.chartWidth) - axis.right - axis.left : 0),

			y: horiz ?
				cHeight - axis.bottom + axis.offset - (axis.opposite ? axis.height : 0) :
				cHeight - axis.translate(pos + tickmarkOffset, null, null, old) - axis.transB
		};
		
	},
	
	/**
	 * Get the x, y position of the tick label
	 */
	getLabelPosition: function (x, y, label, horiz, labelOptions, tickmarkOffset, index, step) {
		var axis = this.axis,
			transA = axis.transA,
			reversed = axis.reversed,
			staggerLines = axis.staggerLines,
			baseline = axis.chart.renderer.fontMetrics(labelOptions.style.fontSize).b,
			rotation = labelOptions.rotation;
			
		x = x + labelOptions.x - (tickmarkOffset && horiz ?
			tickmarkOffset * transA * (reversed ? -1 : 1) : 0);
		y = y + labelOptions.y - (tickmarkOffset && !horiz ?
			tickmarkOffset * transA * (reversed ? 1 : -1) : 0);

		// Correct for rotation (#1764)
		if (rotation && axis.side === 2) {
			y -= baseline - baseline * mathCos(rotation * deg2rad);
		}
		
		// Vertically centered
		if (!defined(labelOptions.y) && !rotation) { // #1951
			y += baseline - label.getBBox().height / 2;
		}
		
		// Correct for staggered labels
		if (staggerLines) {
			y += (index / (step || 1) % staggerLines) * 16;
		}
		
		return {
			x: x,
			y: y
		};
	},
	
	/**
	 * Extendible method to return the path of the marker
	 */
	getMarkPath: function (x, y, tickLength, tickWidth, horiz, renderer) {
		return renderer.crispLine([
				M,
				x,
				y,
				L,
				x + (horiz ? 0 : -tickLength),
				y + (horiz ? tickLength : 0)
			], tickWidth);
	},

	/**
	 * Put everything in place
	 *
	 * @param index {Number}
	 * @param old {Boolean} Use old coordinates to prepare an animation into new position
	 */
	render: function (index, old, opacity) {
		var tick = this,
			axis = tick.axis,
			options = axis.options,
			chart = axis.chart,
			renderer = chart.renderer,
			horiz = axis.horiz,
			type = tick.type,
			label = tick.label,
			pos = tick.pos,
			labelOptions = options.labels,
			gridLine = tick.gridLine,
			gridPrefix = type ? type + 'Grid' : 'grid',
			tickPrefix = type ? type + 'Tick' : 'tick',
			gridLineWidth = options[gridPrefix + 'LineWidth'],
			gridLineColor = options[gridPrefix + 'LineColor'],
			dashStyle = options[gridPrefix + 'LineDashStyle'],
			tickLength = options[tickPrefix + 'Length'],
			tickWidth = options[tickPrefix + 'Width'] || 0,
			tickColor = options[tickPrefix + 'Color'],
			tickPosition = options[tickPrefix + 'Position'],
			gridLinePath,
			mark = tick.mark,
			markPath,
			step = labelOptions.step,
			attribs,
			show = true,
			tickmarkOffset = axis.tickmarkOffset,
			xy = tick.getPosition(horiz, pos, tickmarkOffset, old),
			x = xy.x,
			y = xy.y,
			reverseCrisp = ((horiz && x === axis.pos) || (!horiz && y === axis.pos + axis.len)) ? -1 : 1, // #1480
			staggerLines = axis.staggerLines;

		this.isActive = true;
		
		// create the grid line
		if (gridLineWidth) {
			gridLinePath = axis.getPlotLinePath(pos + tickmarkOffset, gridLineWidth * reverseCrisp, old, true);

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
				if (old) {
					attribs.opacity = 0;
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
				gridLine[tick.isNew ? 'attr' : 'animate']({
					d: gridLinePath,
					opacity: opacity
				});
			}
		}

		// create the tick mark
		if (tickWidth && tickLength) {

			// negate the length
			if (tickPosition === 'inside') {
				tickLength = -tickLength;
			}
			if (axis.opposite) {
				tickLength = -tickLength;
			}

			markPath = tick.getMarkPath(x, y, tickLength, tickWidth * reverseCrisp, horiz, renderer);

			if (mark) { // updating
				mark.animate({
					d: markPath,
					opacity: opacity
				});
			} else { // first time
				tick.mark = renderer.path(
					markPath
				).attr({
					stroke: tickColor,
					'stroke-width': tickWidth,
					opacity: opacity
				}).add(axis.axisGroup);
			}
		}

		// the label is created on init - now move it into place
		if (label && !isNaN(x)) {
			label.xy = xy = tick.getLabelPosition(x, y, label, horiz, labelOptions, tickmarkOffset, index, step);

			// apply show first and show last
			if ((tick.isFirst && !pick(options.showFirstLabel, 1)) ||
					(tick.isLast && !pick(options.showLastLabel, 1))) {
				show = false;

			// Handle label overflow and show or hide accordingly
			} else if (!staggerLines && horiz && labelOptions.overflow === 'justify' && !tick.handleOverflow(index, xy)) {
				show = false;
			}

			// apply step
			if (step && index % step) {
				// show those indices dividable by step
				show = false;
			}

			// Set the new position, and show or hide
			if (show && !isNaN(xy.y)) {
				xy.opacity = opacity;
				label[tick.isNew ? 'attr' : 'animate'](xy);
				tick.isNew = false;
			} else {
				label.attr('y', -9999); // #1338
			}
		}
	},

	/**
	 * Destructor for the tick prototype
	 */
	destroy: function () {
		destroyObjectProperties(this, this.axis);
	}
};

