/**
 * Draw the data labels
 */
Series.prototype.drawDataLabels = function () {

	var series = this,
		seriesOptions = series.options,
		cursor = seriesOptions.cursor,
		options = seriesOptions.dataLabels,
		points = series.points,
		pointOptions,
		generalOptions,
		str,
		dataLabelsGroup;

	if (options.enabled || series._hasPointLabels) {

		// Process default alignment of data labels for columns
		if (series.dlProcessOptions) {
			series.dlProcessOptions(options);
		}

		// Create a separate group for the data labels to avoid rotation
		dataLabelsGroup = series.plotGroup(
			'dataLabelsGroup',
			'data-labels',
			series.visible ? VISIBLE : HIDDEN,
			options.zIndex || 6
		);

		// Make the labels for each point
		generalOptions = options;
		each(points, function (point) {

			var enabled,
				dataLabel = point.dataLabel,
				labelConfig,
				attr,
				name,
				rotation,
				connector = point.connector,
				isNew = true;

			// Determine if each data label is enabled
			pointOptions = point.options && point.options.dataLabels;
			enabled = pick(pointOptions && pointOptions.enabled, generalOptions.enabled); // #2282


			// If the point is outside the plot area, destroy it. #678, #820
			if (dataLabel && !enabled) {
				point.dataLabel = dataLabel.destroy();

			// Individual labels are disabled if the are explicitly disabled
			// in the point options, or if they fall outside the plot area.
			} else if (enabled) {

				// Create individual options structure that can be extended without
				// affecting others
				options = merge(generalOptions, pointOptions);

				rotation = options.rotation;

				// Get the string
				labelConfig = point.getLabelConfig();
				str = options.format ?
					format(options.format, labelConfig) :
					options.formatter.call(labelConfig, options);

				// Determine the color
				options.style.color = pick(options.color, options.style.color, series.color, 'black');


				// update existing label
				if (dataLabel) {

					if (defined(str)) {
						dataLabel
							.attr({
								text: str
							});
						isNew = false;

					} else { // #1437 - the label is shown conditionally
						point.dataLabel = dataLabel = dataLabel.destroy();
						if (connector) {
							point.connector = connector.destroy();
						}
					}

				// create new label
				} else if (defined(str)) {
					attr = {
						//align: align,
						fill: options.backgroundColor,
						stroke: options.borderColor,
						'stroke-width': options.borderWidth,
						r: options.borderRadius || 0,
						rotation: rotation,
						padding: options.padding,
						zIndex: 1
					};
					// Remove unused attributes (#947)
					for (name in attr) {
						if (attr[name] === UNDEFINED) {
							delete attr[name];
						}
					}

					dataLabel = point.dataLabel = series.chart.renderer[rotation ? 'text' : 'label']( // labels don't support rotation
						str,
						0,
						-999,
						null,
						null,
						null,
						options.useHTML
					)
					.attr(attr)
					.css(extend(options.style, cursor && { cursor: cursor }))
					.add(dataLabelsGroup)
					.shadow(options.shadow);

				}

				if (dataLabel) {
					// Now the data label is created and placed at 0,0, so we need to align it
					series.alignDataLabel(point, dataLabel, options, null, isNew);
				}
			}
		});
	}
};

/**
 * Align each individual data label
 */
Series.prototype.alignDataLabel = function (point, dataLabel, options, alignTo, isNew) {
	var chart = this.chart,
		inverted = chart.inverted,
		plotX = pick(point.plotX, -999),
		plotY = pick(point.plotY, -999),
		bBox = dataLabel.getBBox(),
		// Math.round for rounding errors (#2683), alignTo to allow column labels (#2700)
		visible = this.visible && (point.series.forceDL || chart.isInsidePlot(plotX, mathRound(plotY), inverted) ||
			(alignTo && chart.isInsidePlot(plotX, inverted ? alignTo.x + 1 : alignTo.y + alignTo.height - 1, inverted))),
		alignAttr; // the final position;

	if (visible) {

		// The alignment box is a singular point
		alignTo = extend({
			x: inverted ? chart.plotWidth - plotY : plotX,
			y: mathRound(inverted ? chart.plotHeight - plotX : plotY),
			width: 0,
			height: 0
		}, alignTo);

		// Add the text size for alignment calculation
		extend(options, {
			width: bBox.width,
			height: bBox.height
		});

		// Allow a hook for changing alignment in the last moment, then do the alignment
		if (options.rotation) { // Fancy box alignment isn't supported for rotated text
			alignAttr = {
				align: options.align,
				x: alignTo.x + options.x + alignTo.width / 2,
				y: alignTo.y + options.y + alignTo.height / 2
			};
			dataLabel[isNew ? 'attr' : 'animate'](alignAttr);
		} else {
			dataLabel.align(options, null, alignTo);
			alignAttr = dataLabel.alignAttr;

			// Handle justify or crop
			if (pick(options.overflow, 'justify') === 'justify') {
				this.justifyDataLabel(dataLabel, options, alignAttr, bBox, alignTo, isNew);

			} else if (pick(options.crop, true)) {
				// Now check that the data label is within the plot area
				visible = chart.isInsidePlot(alignAttr.x, alignAttr.y) && chart.isInsidePlot(alignAttr.x + bBox.width, alignAttr.y + bBox.height);

			}
		}
	}

	// Show or hide based on the final aligned position
	if (!visible) {
		dataLabel.attr({ y: -999 });
		dataLabel.placed = false; // don't animate back in
	}

};

/**
 * If data labels fall partly outside the plot area, align them back in, in a way that
 * doesn't hide the point.
 */
Series.prototype.justifyDataLabel = function (dataLabel, options, alignAttr, bBox, alignTo, isNew) {
	var chart = this.chart,
		align = options.align,
		verticalAlign = options.verticalAlign,
		off,
		justified;

	// Off left
	off = alignAttr.x;
	if (off < 0) {
		if (align === 'right') {
			options.align = 'left';
		} else {
			options.x = -off;
		}
		justified = true;
	}

	// Off right
	off = alignAttr.x + bBox.width;
	if (off > chart.plotWidth) {
		if (align === 'left') {
			options.align = 'right';
		} else {
			options.x = chart.plotWidth - off;
		}
		justified = true;
	}

	// Off top
	off = alignAttr.y;
	if (off < 0) {
		if (verticalAlign === 'bottom') {
			options.verticalAlign = 'top';
		} else {
			options.y = -off;
		}
		justified = true;
	}

	// Off bottom
	off = alignAttr.y + bBox.height;
	if (off > chart.plotHeight) {
		if (verticalAlign === 'top') {
			options.verticalAlign = 'bottom';
		} else {
			options.y = chart.plotHeight - off;
		}
		justified = true;
	}

	if (justified) {
		dataLabel.placed = !isNew;
		dataLabel.align(options, null, alignTo);
	}
};

/**
 * Override the base drawDataLabels method by pie specific functionality
 */
if (seriesTypes.pie) {
	seriesTypes.pie.prototype.drawDataLabels = function () {
		var series = this,
			data = series.data,
			point,
			chart = series.chart,
			options = series.options.dataLabels,
			connectorPadding = pick(options.connectorPadding, 10),
			connectorWidth = pick(options.connectorWidth, 1),
			plotWidth = chart.plotWidth,
			plotHeight = chart.plotHeight,
			connector,
			connectorPath,
			softConnector = pick(options.softConnector, true),
			distanceOption = options.distance,
			seriesCenter = series.center,
			radius = seriesCenter[2] / 2,
			centerY = seriesCenter[1],
			outside = distanceOption > 0,
			dataLabel,
			dataLabelWidth,
			labelPos,
			labelHeight,
			halves = [// divide the points into right and left halves for anti collision
				[], // right
				[]  // left
			],
			x,
			y,
			visibility,
			rankArr,
			i,
			j,
			overflow = [0, 0, 0, 0], // top, right, bottom, left
			sort = function (a, b) {
				return b.y - a.y;
			};

		// get out if not enabled
		if (!series.visible || (!options.enabled && !series._hasPointLabels)) {
			return;
		}

		// run parent method
		Series.prototype.drawDataLabels.apply(series);

		// arrange points for detection collision
		each(data, function (point) {
			if (point.dataLabel && point.visible) { // #407, #2510
				halves[point.half].push(point);
			}
		});

		// assume equal label heights
		i = 0;
		while (!labelHeight && data[i]) { // #1569
			labelHeight = data[i] && data[i].dataLabel && (data[i].dataLabel.getBBox().height || 21); // 21 is for #968
			i++;
		}

		/* Loop over the points in each half, starting from the top and bottom
		 * of the pie to detect overlapping labels.
		 */
		i = 2;
		while (i--) {

			var slots = [],
				slotsLength,
				usedSlots = [],
				points = halves[i],
				pos,
				length = points.length,
				slotIndex;

			// Sort by angle
			series.sortByAngle(points, i - 0.5);

			// Only do anti-collision when we are outside the pie and have connectors (#856)
			if (distanceOption > 0) {

				// build the slots
				for (pos = centerY - radius - distanceOption; pos <= centerY + radius + distanceOption; pos += labelHeight) {
					slots.push(pos);

					// visualize the slot
					/*
					var slotX = series.getX(pos, i) + chart.plotLeft - (i ? 100 : 0),
						slotY = pos + chart.plotTop;
					if (!isNaN(slotX)) {
						chart.renderer.rect(slotX, slotY - 7, 100, labelHeight, 1)
							.attr({
								'stroke-width': 1,
								stroke: 'silver'
							})
							.add();
						chart.renderer.text('Slot '+ (slots.length - 1), slotX, slotY + 4)
							.attr({
								fill: 'silver'
							}).add();
					}
					*/
				}
				slotsLength = slots.length;

				// if there are more values than available slots, remove lowest values
				if (length > slotsLength) {
					// create an array for sorting and ranking the points within each quarter
					rankArr = [].concat(points);
					rankArr.sort(sort);
					j = length;
					while (j--) {
						rankArr[j].rank = j;
					}
					j = length;
					while (j--) {
						if (points[j].rank >= slotsLength) {
							points.splice(j, 1);
						}
					}
					length = points.length;
				}

				// The label goes to the nearest open slot, but not closer to the edge than
				// the label's index.
				for (j = 0; j < length; j++) {

					point = points[j];
					labelPos = point.labelPos;

					var closest = 9999,
						distance,
						slotI;

					// find the closest slot index
					for (slotI = 0; slotI < slotsLength; slotI++) {
						distance = mathAbs(slots[slotI] - labelPos[1]);
						if (distance < closest) {
							closest = distance;
							slotIndex = slotI;
						}
					}

					// if that slot index is closer to the edges of the slots, move it
					// to the closest appropriate slot
					if (slotIndex < j && slots[j] !== null) { // cluster at the top
						slotIndex = j;
					} else if (slotsLength  < length - j + slotIndex && slots[j] !== null) { // cluster at the bottom
						slotIndex = slotsLength - length + j;
						while (slots[slotIndex] === null) { // make sure it is not taken
							slotIndex++;
						}
					} else {
						// Slot is taken, find next free slot below. In the next run, the next slice will find the
						// slot above these, because it is the closest one
						while (slots[slotIndex] === null) { // make sure it is not taken
							slotIndex++;
						}
					}

					usedSlots.push({ i: slotIndex, y: slots[slotIndex] });
					slots[slotIndex] = null; // mark as taken
				}
				// sort them in order to fill in from the top
				usedSlots.sort(sort);
			}

			// now the used slots are sorted, fill them up sequentially
			for (j = 0; j < length; j++) {

				var slot, naturalY;

				point = points[j];
				labelPos = point.labelPos;
				dataLabel = point.dataLabel;
				visibility = point.visible === false ? HIDDEN : VISIBLE;
				naturalY = labelPos[1];

				if (distanceOption > 0) {
					slot = usedSlots.pop();
					slotIndex = slot.i;

					// if the slot next to currrent slot is free, the y value is allowed
					// to fall back to the natural position
					y = slot.y;
					if ((naturalY > y && slots[slotIndex + 1] !== null) ||
							(naturalY < y &&  slots[slotIndex - 1] !== null)) {
						y = naturalY;
					}

				} else {
					y = naturalY;
				}

				// get the x - use the natural x position for first and last slot, to prevent the top
				// and botton slice connectors from touching each other on either side
				x = options.justify ?
					seriesCenter[0] + (i ? -1 : 1) * (radius + distanceOption) :
					series.getX(slotIndex === 0 || slotIndex === slots.length - 1 ? naturalY : y, i);


				// Record the placement and visibility
				dataLabel._attr = {
					visibility: visibility,
					align: labelPos[6]
				};
				dataLabel._pos = {
					x: x + options.x +
						({ left: connectorPadding, right: -connectorPadding }[labelPos[6]] || 0),
					y: y + options.y - 10 // 10 is for the baseline (label vs text)
				};
				dataLabel.connX = x;
				dataLabel.connY = y;


				// Detect overflowing data labels
				if (this.options.size === null) {
					dataLabelWidth = dataLabel.width;
					// Overflow left
					if (x - dataLabelWidth < connectorPadding) {
						overflow[3] = mathMax(mathRound(dataLabelWidth - x + connectorPadding), overflow[3]);

					// Overflow right
					} else if (x + dataLabelWidth > plotWidth - connectorPadding) {
						overflow[1] = mathMax(mathRound(x + dataLabelWidth - plotWidth + connectorPadding), overflow[1]);
					}

					// Overflow top
					if (y - labelHeight / 2 < 0) {
						overflow[0] = mathMax(mathRound(-y + labelHeight / 2), overflow[0]);

					// Overflow left
					} else if (y + labelHeight / 2 > plotHeight) {
						overflow[2] = mathMax(mathRound(y + labelHeight / 2 - plotHeight), overflow[2]);
					}
				}
			} // for each point
		} // for each half

		// Do not apply the final placement and draw the connectors until we have verified
		// that labels are not spilling over.
		if (arrayMax(overflow) === 0 || this.verifyDataLabelOverflow(overflow)) {

			// Place the labels in the final position
			this.placeDataLabels();

			// Draw the connectors
			if (outside && connectorWidth) {
				each(this.points, function (point) {
					connector = point.connector;
					labelPos = point.labelPos;
					dataLabel = point.dataLabel;

					if (dataLabel && dataLabel._pos) {
						visibility = dataLabel._attr.visibility;
						x = dataLabel.connX;
						y = dataLabel.connY;
						connectorPath = softConnector ? [
							M,
							x + (labelPos[6] === 'left' ? 5 : -5), y, // end of the string at the label
							'C',
							x, y, // first break, next to the label
							2 * labelPos[2] - labelPos[4], 2 * labelPos[3] - labelPos[5],
							labelPos[2], labelPos[3], // second break
							L,
							labelPos[4], labelPos[5] // base
						] : [
							M,
							x + (labelPos[6] === 'left' ? 5 : -5), y, // end of the string at the label
							L,
							labelPos[2], labelPos[3], // second break
							L,
							labelPos[4], labelPos[5] // base
						];

						if (connector) {
							connector.animate({ d: connectorPath });
							connector.attr('visibility', visibility);

						} else {
							point.connector = connector = series.chart.renderer.path(connectorPath).attr({
								'stroke-width': connectorWidth,
								stroke: options.connectorColor || point.color || '#606060',
								visibility: visibility
								//zIndex: 0 // #2722 (reversed)
							})
							.add(series.group);
						}
					} else if (connector) {
						point.connector = connector.destroy();
					}
				});
			}
		}
	};
	/**
	 * Perform the final placement of the data labels after we have verified that they
	 * fall within the plot area.
	 */
	seriesTypes.pie.prototype.placeDataLabels = function () {
		each(this.points, function (point) {
			var dataLabel = point.dataLabel,
				_pos;

			if (dataLabel) {
				_pos = dataLabel._pos;
				if (_pos) {
					dataLabel.attr(dataLabel._attr);
					dataLabel[dataLabel.moved ? 'animate' : 'attr'](_pos);
					dataLabel.moved = true;
				} else if (dataLabel) {
					dataLabel.attr({ y: -999 });
				}
			}
		});
	};

	seriesTypes.pie.prototype.alignDataLabel =  noop;

	/**
	 * Verify whether the data labels are allowed to draw, or we should run more translation and data
	 * label positioning to keep them inside the plot area. Returns true when data labels are ready
	 * to draw.
	 */
	seriesTypes.pie.prototype.verifyDataLabelOverflow = function (overflow) {

		var center = this.center,
			options = this.options,
			centerOption = options.center,
			minSize = options.minSize || 80,
			newSize = minSize,
			ret;

		// Handle horizontal size and center
		if (centerOption[0] !== null) { // Fixed center
			newSize = mathMax(center[2] - mathMax(overflow[1], overflow[3]), minSize);

		} else { // Auto center
			newSize = mathMax(
				center[2] - overflow[1] - overflow[3], // horizontal overflow
				minSize
			);
			center[0] += (overflow[3] - overflow[1]) / 2; // horizontal center
		}

		// Handle vertical size and center
		if (centerOption[1] !== null) { // Fixed center
			newSize = mathMax(mathMin(newSize, center[2] - mathMax(overflow[0], overflow[2])), minSize);

		} else { // Auto center
			newSize = mathMax(
				mathMin(
					newSize,
					center[2] - overflow[0] - overflow[2] // vertical overflow
				),
				minSize
			);
			center[1] += (overflow[0] - overflow[2]) / 2; // vertical center
		}

		// If the size must be decreased, we need to run translate and drawDataLabels again
		if (newSize < center[2]) {
			center[2] = newSize;
			this.translate(center);
			each(this.points, function (point) {
				if (point.dataLabel) {
					point.dataLabel._pos = null; // reset
				}
			});

			if (this.drawDataLabels) {
				this.drawDataLabels();
			}
		// Else, return true to indicate that the pie and its labels is within the plot area
		} else {
			ret = true;
		}
		return ret;
	};
}

if (seriesTypes.column) {

	/**
	 * Override the basic data label alignment by adjusting for the position of the column
	 */
	seriesTypes.column.prototype.alignDataLabel = function (point, dataLabel, options,  alignTo, isNew) {
		var chart = this.chart,
			inverted = chart.inverted,
			dlBox = point.dlBox || point.shapeArgs, // data label box for alignment
			below = point.below || (point.plotY > pick(this.translatedThreshold, chart.plotSizeY)),
			inside = pick(options.inside, !!this.options.stacking); // draw it inside the box?

		// Align to the column itself, or the top of it
		if (dlBox) { // Area range uses this method but not alignTo
			alignTo = merge(dlBox);

			if (inverted) {
				alignTo = {
					x: chart.plotWidth - alignTo.y - alignTo.height,
					y: chart.plotHeight - alignTo.x - alignTo.width,
					width: alignTo.height,
					height: alignTo.width
				};
			}

			// Compute the alignment box
			if (!inside) {
				if (inverted) {
					alignTo.x += below ? 0 : alignTo.width;
					alignTo.width = 0;
				} else {
					alignTo.y += below ? alignTo.height : 0;
					alignTo.height = 0;
				}
			}
		}


		// When alignment is undefined (typically columns and bars), display the individual
		// point below or above the point depending on the threshold
		options.align = pick(
			options.align,
			!inverted || inside ? 'center' : below ? 'right' : 'left'
		);
		options.verticalAlign = pick(
			options.verticalAlign,
			inverted || inside ? 'middle' : below ? 'top' : 'bottom'
		);

		// Call the parent method
		Series.prototype.alignDataLabel.call(this, point, dataLabel, options, alignTo, isNew);
	};
}



