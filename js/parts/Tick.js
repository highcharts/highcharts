/**
 * (c) 2010-2016 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Utilities.js';
var correctFloat = H.correctFloat,
	defined = H.defined,
	destroyObjectProperties = H.destroyObjectProperties,
	isNumber = H.isNumber,
	merge = H.merge,
	pick = H.pick,
	deg2rad = H.deg2rad;

/**
 * The Tick class
 */
H.Tick = function (axis, pos, type, noLabel) {
	this.axis = axis;
	this.pos = pos;
	this.type = type || '';
	this.isNew = true;

	if (!type && !noLabel) {
		this.addLabel();
	}
};

H.Tick.prototype = {
	/**
	 * Write the tick label
	 */
	addLabel: function () {
		var tick = this,
			axis = tick.axis,
			options = axis.options,
			chart = axis.chart,
			categories = axis.categories,
			names = axis.names,
			pos = tick.pos,
			labelOptions = options.labels,
			str,
			tickPositions = axis.tickPositions,
			isFirst = pos === tickPositions[0],
			isLast = pos === tickPositions[tickPositions.length - 1],
			value = categories ?
				pick(categories[pos], names[pos], pos) :
				pos,
			label = tick.label,
			tickPositionInfo = tickPositions.info,
			dateTimeLabelFormat;

		// Set the datetime label format. If a higher rank is set for this position, use that. If not,
		// use the general format.
		if (axis.isDatetimeAxis && tickPositionInfo) {
			dateTimeLabelFormat =
				options.dateTimeLabelFormats[
					tickPositionInfo.higherRanks[pos] || tickPositionInfo.unitName
				];
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
			value: axis.isLog ? correctFloat(axis.lin2log(value)) : value
		});

		// prepare CSS
		//css = width && { width: Math.max(1, Math.round(width - 2 * (labelOptions.padding || 10))) + 'px' };
		
		// first call
		if (!defined(label)) {

			tick.label = label =
				defined(str) && labelOptions.enabled ?
					chart.renderer.text(
							str,
							0,
							0,
							labelOptions.useHTML
						)
						/*= if (build.classic) { =*/
						// without position absolute, IE export sometimes is wrong
						.css(merge(labelOptions.style))
						/*= } =*/
						.add(axis.labelGroup) :
					null;
			tick.labelLength = label && label.getBBox().width; // Un-rotated length
			tick.rotation = 0; // Base value to detect change for new calls to getBBox

		// update
		} else if (label) {
			label.attr({ text: str });
		}
	},

	/**
	 * Get the offset height or width of the label
	 */
	getLabelSize: function () {
		return this.label ?
			this.label.getBBox()[this.axis.horiz ? 'height' : 'width'] :
			0;
	},

	/**
	 * Handle the label overflow by adjusting the labels to the left and right edge, or
	 * hide them if they collide into the neighbour label.
	 */
	handleOverflow: function (xy) {
		var axis = this.axis,
			pxPos = xy.x,
			chartWidth = axis.chart.chartWidth,
			spacing = axis.chart.spacing,
			leftBound = pick(axis.labelLeft, Math.min(axis.pos, spacing[3])),
			rightBound = pick(axis.labelRight, Math.max(axis.pos + axis.len, chartWidth - spacing[1])),
			label = this.label,
			rotation = this.rotation,
			factor = { left: 0, center: 0.5, right: 1 }[axis.labelAlign],
			labelWidth = label.getBBox().width,
			slotWidth = axis.getSlotWidth(),
			modifiedSlotWidth = slotWidth,
			xCorrection = factor,
			goRight = 1,
			leftPos,
			rightPos,
			textWidth,
			css = {};

		// Check if the label overshoots the chart spacing box. If it does, move it.
		// If it now overshoots the slotWidth, add ellipsis.
		if (!rotation) {
			leftPos = pxPos - factor * labelWidth;
			rightPos = pxPos + (1 - factor) * labelWidth;

			if (leftPos < leftBound) {
				modifiedSlotWidth = xy.x + modifiedSlotWidth * (1 - factor) - leftBound;
			} else if (rightPos > rightBound) {
				modifiedSlotWidth = rightBound - xy.x + modifiedSlotWidth * factor;
				goRight = -1;
			}

			modifiedSlotWidth = Math.min(slotWidth, modifiedSlotWidth); // #4177
			if (modifiedSlotWidth < slotWidth && axis.labelAlign === 'center') {
				xy.x += goRight * (slotWidth - modifiedSlotWidth - xCorrection *
					(slotWidth - Math.min(labelWidth, modifiedSlotWidth)));
			}
			// If the label width exceeds the available space, set a text width to be
			// picked up below. Also, if a width has been set before, we need to set a new
			// one because the reported labelWidth will be limited by the box (#3938).
			if (labelWidth > modifiedSlotWidth || (axis.autoRotation && (label.styles || {}).width)) {
				textWidth = modifiedSlotWidth;
			}

		// Add ellipsis to prevent rotated labels to be clipped against the edge of the chart
		} else if (rotation < 0 && pxPos - factor * labelWidth < leftBound) {
			textWidth = Math.round(pxPos / Math.cos(rotation * deg2rad) - leftBound);
		} else if (rotation > 0 && pxPos + factor * labelWidth > rightBound) {
			textWidth = Math.round((chartWidth - pxPos) / Math.cos(rotation * deg2rad));
		}

		if (textWidth) {
			css.width = textWidth;
			if (!(axis.options.labels.style || {}).textOverflow) {
				css.textOverflow = 'ellipsis';
			}
			label.css(css);
		}
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
				axis.left + axis.offset +
					(axis.opposite ?
						((old && chart.oldChartWidth) || chart.chartWidth) - axis.right - axis.left :
						0
					),

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
			rotCorr = axis.tickRotCorr || { x: 0, y: 0 },
			yOffset = labelOptions.y,
			line;

		if (!defined(yOffset)) {
			if (axis.side === 0) {
				yOffset = label.rotation ? -8 : -label.getBBox().height;
			} else if (axis.side === 2) {
				yOffset = rotCorr.y + 8;
			} else {
				// #3140, #3140
				yOffset = Math.cos(label.rotation * deg2rad) * (rotCorr.y - label.getBBox(false, 0).height / 2);
			}
		}

		x = x + labelOptions.x + rotCorr.x - (tickmarkOffset && horiz ?
			tickmarkOffset * transA * (reversed ? -1 : 1) : 0);
		y = y + yOffset - (tickmarkOffset && !horiz ?
			tickmarkOffset * transA * (reversed ? 1 : -1) : 0);

		// Correct for staggered labels
		if (staggerLines) {
			line = (index / (step || 1) % staggerLines);
			if (axis.opposite) {
				line = staggerLines - line - 1;
			}
			y += line * (axis.labelOffset / staggerLines);
		}

		return {
			x: x,
			y: Math.round(y)
		};
	},

	/**
	 * Extendible method to return the path of the marker
	 */
	getMarkPath: function (x, y, tickLength, tickWidth, horiz, renderer) {
		return renderer.crispLine([
			'M',
			x,
			y,
			'L',
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
			tickPrefix = type ? type + 'Tick' : 'tick',
			tickSize = axis.tickSize(tickPrefix),
			gridLinePath,
			mark = tick.mark,
			isNewMark = !mark,
			step = labelOptions.step,
			attribs = {},
			show = true,
			tickmarkOffset = axis.tickmarkOffset,
			xy = tick.getPosition(horiz, pos, tickmarkOffset, old),
			x = xy.x,
			y = xy.y,
			reverseCrisp = ((horiz && x === axis.pos + axis.len) ||
				(!horiz && y === axis.pos)) ? -1 : 1; // #1480, #1687

		/*= if (build.classic) { =*/
		var gridPrefix = type ? type + 'Grid' : 'grid',
			gridLineWidth = options[gridPrefix + 'LineWidth'],
			gridLineColor = options[gridPrefix + 'LineColor'],
			dashStyle = options[gridPrefix + 'LineDashStyle'],
			tickWidth = pick(options[tickPrefix + 'Width'], !type && axis.isXAxis ? 1 : 0), // X axis defaults to 1
			tickColor = options[tickPrefix + 'Color'];
		/*= } =*/

		opacity = pick(opacity, 1);
		this.isActive = true;

		// Create the grid line
		if (!gridLine) {
			/*= if (build.classic) { =*/
			attribs.stroke = gridLineColor;
			attribs['stroke-width'] = gridLineWidth;
			if (dashStyle) {
				attribs.dashstyle = dashStyle;
			}
			/*= } =*/
			if (!type) {
				attribs.zIndex = 1;
			}
			if (old) {
				attribs.opacity = 0;
			}
			tick.gridLine = gridLine = renderer.path()
				.attr(attribs)
				.addClass('highcharts-' + (type ? type + '-' : '') + 'grid-line')
				.add(axis.gridGroup);
		}

		// If the parameter 'old' is set, the current call will be followed
		// by another call, therefore do not do any animations this time
		if (!old && gridLine) {
			gridLinePath = axis.getPlotLinePath(pos + tickmarkOffset, gridLine.strokeWidth() * reverseCrisp, old, true);
			if (gridLinePath) {
				gridLine[tick.isNew ? 'attr' : 'animate']({
					d: gridLinePath,
					opacity: opacity
				});
			}
		}

		// create the tick mark
		if (tickSize) {

			// negate the length
			if (axis.opposite) {
				tickSize[0] = -tickSize[0];
			}

			// First time, create it
			if (isNewMark) {
				tick.mark = mark = renderer.path()
					.addClass('highcharts-' + (type ? type + '-' : '') + 'tick')
					.add(axis.axisGroup);

				/*= if (build.classic) { =*/
				mark.attr({
					stroke: tickColor,
					'stroke-width': tickWidth
				});
				/*= } =*/
			}
			mark[isNewMark ? 'attr' : 'animate']({
				d: tick.getMarkPath(x, y, tickSize[0], mark.strokeWidth() * reverseCrisp, horiz, renderer),
				opacity: opacity
			});

		}

		// the label is created on init - now move it into place
		if (label && isNumber(x)) {
			label.xy = xy = tick.getLabelPosition(x, y, label, horiz, labelOptions, tickmarkOffset, index, step);

			// Apply show first and show last. If the tick is both first and last, it is
			// a single centered tick, in which case we show the label anyway (#2100).
			if ((tick.isFirst && !tick.isLast && !pick(options.showFirstLabel, 1)) ||
					(tick.isLast && !tick.isFirst && !pick(options.showLastLabel, 1))) {
				show = false;

			// Handle label overflow and show or hide accordingly
			} else if (horiz && !axis.isRadial && !labelOptions.step &&
					!labelOptions.rotation && !old && opacity !== 0) {
				tick.handleOverflow(xy);
			}

			// apply step
			if (step && index % step) {
				// show those indices dividable by step
				show = false;
			}

			// Set the new position, and show or hide
			if (show && isNumber(xy.y)) {
				xy.opacity = opacity;
				label[tick.isNew ? 'attr' : 'animate'](xy);
			} else {
				label.attr('y', -9999); // #1338
			}
			tick.isNew = false;
		}
	},

	/**
	 * Destructor for the tick prototype
	 */
	destroy: function () {
		destroyObjectProperties(this, this.axis);
	}
};
