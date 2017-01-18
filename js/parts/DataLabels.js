/**
 * (c) 2010-2016 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Utilities.js';
import './Series.js';
var addEvent = H.addEvent,
	arrayMax = H.arrayMax,
	defined = H.defined,
	each = H.each,
	extend = H.extend,
	format = H.format,
	map = H.map,
	merge = H.merge,
	noop = H.noop,
	pick = H.pick,
	relativeLength = H.relativeLength,
	Series = H.Series,
	seriesTypes = H.seriesTypes,
	stableSort = H.stableSort;


/**
 * Generatl distribution algorithm for distributing labels of differing size along a
 * confined length in two dimensions. The algorithm takes an array of objects containing
 * a size, a target and a rank. It will place the labels as close as possible to their 
 * targets, skipping the lowest ranked labels if necessary.
 */
H.distribute = function (boxes, len) {
	
	var i, 
		overlapping = true,
		origBoxes = boxes, // Original array will be altered with added .pos
		restBoxes = [], // The outranked overshoot
		box,
		target,
		total = 0;

	function sortByTarget(a, b) {
		return a.target - b.target;
	}
	
	// If the total size exceeds the len, remove those boxes with the lowest rank
	i = boxes.length;
	while (i--) {
		total += boxes[i].size;
	}

	// Sort by rank, then slice away overshoot
	if (total > len) {
		stableSort(boxes, function (a, b) {
			return (b.rank || 0) - (a.rank || 0);
		});
		i = 0;
		total = 0;
		while (total <= len) {
			total += boxes[i].size;
			i++;
		}
		restBoxes = boxes.splice(i - 1, boxes.length);
	}
	
	// Order by target
	stableSort(boxes, sortByTarget);


	// So far we have been mutating the original array. Now
	// create a copy with target arrays
	boxes = map(boxes, function (box) {
		return {
			size: box.size,
			targets: [box.target]
		};
	});
	
	while (overlapping) {
		// Initial positions: target centered in box
		i = boxes.length;
		while (i--) {
			box = boxes[i];
			// Composite box, average of targets
			target = (Math.min.apply(0, box.targets) + Math.max.apply(0, box.targets)) / 2;
			box.pos = Math.min(Math.max(0, target - box.size / 2), len - box.size);
		}

		// Detect overlap and join boxes
		i = boxes.length;
		overlapping = false;
		while (i--) {
			if (i > 0 && boxes[i - 1].pos + boxes[i - 1].size > boxes[i].pos) { // Overlap
				boxes[i - 1].size += boxes[i].size; // Add this size to the previous box
				boxes[i - 1].targets = boxes[i - 1].targets.concat(boxes[i].targets);
				
				// Overlapping right, push left
				if (boxes[i - 1].pos + boxes[i - 1].size > len) {
					boxes[i - 1].pos = len - boxes[i - 1].size;
				}
				boxes.splice(i, 1); // Remove this item
				overlapping = true;
			}
		}
	}

	// Now the composite boxes are placed, we need to put the original boxes within them
	i = 0;
	each(boxes, function (box) {
		var posInCompositeBox = 0;
		each(box.targets, function () {
			origBoxes[i].pos = box.pos + posInCompositeBox;
			posInCompositeBox += origBoxes[i].size;
			i++;
		});
	});
	
	// Add the rest (hidden) boxes and sort by target
	origBoxes.push.apply(origBoxes, restBoxes);
	stableSort(origBoxes, sortByTarget);
};


/**
 * Draw the data labels
 */
Series.prototype.drawDataLabels = function () {
	var series = this,
		seriesOptions = series.options,
		options = seriesOptions.dataLabels,
		points = series.points,
		pointOptions,
		generalOptions,
		hasRendered = series.hasRendered || 0,
		str,
		dataLabelsGroup,
		defer = pick(options.defer, true),
		renderer = series.chart.renderer;

	if (options.enabled || series._hasPointLabels) {

		// Process default alignment of data labels for columns
		if (series.dlProcessOptions) {
			series.dlProcessOptions(options);
		}

		// Create a separate group for the data labels to avoid rotation
		dataLabelsGroup = series.plotGroup(
			'dataLabelsGroup',
			'data-labels',
			defer && !hasRendered ? 'hidden' : 'visible', // #5133
			options.zIndex || 6
		);

		if (defer) {
			dataLabelsGroup.attr({ opacity: +hasRendered }); // #3300
			if (!hasRendered) {
				addEvent(series, 'afterAnimate', function () {
					if (series.visible) { // #2597, #3023, #3024
						dataLabelsGroup.show(true);
					}
					dataLabelsGroup[seriesOptions.animation ? 'animate' : 'attr']({ opacity: 1 }, { duration: 200 });
				});
			}
		}

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
				isNew = !dataLabel,
				style;
			// Determine if each data label is enabled
			// @note dataLabelAttribs (like pointAttribs) would eradicate
			// the need for dlOptions, and simplify the section below.
			pointOptions = point.dlOptions || (point.options && point.options.dataLabels); // dlOptions is used in treemaps
			enabled = pick(pointOptions && pointOptions.enabled, generalOptions.enabled) && point.y !== null; // #2282, #4641
			if (enabled) {
				// Create individual options structure that can be extended without
				// affecting others
				options = merge(generalOptions, pointOptions);
				labelConfig = point.getLabelConfig();
				str = options.format ?
					format(options.format, labelConfig) :
					options.formatter.call(labelConfig, options);
				style = options.style;
				rotation = options.rotation;
				/*= if (build.classic) { =*/
				// Determine the color
				style.color = pick(options.color, style.color, series.color, '${palette.neutralColor100}');
				// Get automated contrast color
				if (style.color === 'contrast') {
					style.color = options.inside || options.distance < 0 || !!seriesOptions.stacking ?
						renderer.getContrast(point.color || series.color) :
						'${palette.neutralColor100}';
				}
				if (seriesOptions.cursor) {
					style.cursor = seriesOptions.cursor;
				}
				/*= } =*/
				
				attr = {
					//align: align,
					/*= if (build.classic) { =*/
					fill: options.backgroundColor,
					stroke: options.borderColor,
					'stroke-width': options.borderWidth,
					/*= } =*/
					r: options.borderRadius || 0,
					rotation: rotation,
					padding: options.padding,
					zIndex: 1
				};

				// Remove unused attributes (#947)
				for (name in attr) {
					if (attr[name] === undefined) {
						delete attr[name];
					}
				}
			}
			// If the point is outside the plot area, destroy it. #678, #820
			if (dataLabel && (!enabled || !defined(str))) {
				point.dataLabel = dataLabel = dataLabel.destroy();
				if (connector) {
					point.connector = connector.destroy();
				}
			// Individual labels are disabled if the are explicitly disabled
			// in the point options, or if they fall outside the plot area.
			} else if (enabled && defined(str)) {
				// create new label
				if (!dataLabel) {
					dataLabel = point.dataLabel = renderer[rotation ? 'text' : 'label']( // labels don't support rotation
						str,
						0,
						-9999,
						options.shape,
						null,
						null,
						options.useHTML,
						null, 
						'data-label'
					);
					dataLabel.addClass(
						'highcharts-data-label-color-' + point.colorIndex +
						' ' + (options.className || '') +
						(options.useHTML ? 'highcharts-tracker' : '') // #3398
					);
				} else {
					attr.text = str;
				}
				dataLabel.attr(attr);
				/*= if (build.classic) { =*/
				// Styles must be applied before add in order to read text bounding box
				dataLabel.css(style).shadow(options.shadow);
				/*= } =*/

				if (!dataLabel.added) {
					dataLabel.add(dataLabelsGroup);
				}
				// Now the data label is created and placed at 0,0, so we need to align it
				series.alignDataLabel(point, dataLabel, options, null, isNew);
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
		plotX = pick(point.plotX, -9999),
		plotY = pick(point.plotY, -9999),
		bBox = dataLabel.getBBox(),
		fontSize,
		baseline,
		rotation = options.rotation,
		normRotation,
		negRotation,
		align = options.align,
		rotCorr, // rotation correction
		// Math.round for rounding errors (#2683), alignTo to allow column labels (#2700)
		visible = 
			this.visible &&
			(
				point.series.forceDL ||
				chart.isInsidePlot(plotX, Math.round(plotY), inverted) ||
				(
					alignTo && chart.isInsidePlot(
						plotX,
						inverted ? alignTo.x + 1 : alignTo.y + alignTo.height - 1,
						inverted
					)
				)
			),
		alignAttr, // the final position;
		justify = pick(options.overflow, 'justify') === 'justify';

	if (visible) {

		/*= if (build.classic) { =*/
		fontSize = options.style.fontSize;
		/*= } =*/

		baseline = chart.renderer.fontMetrics(fontSize, dataLabel).b;

		// The alignment box is a singular point
		alignTo = extend({
			x: inverted ? chart.plotWidth - plotY : plotX,
			y: Math.round(inverted ? chart.plotHeight - plotX : plotY),
			width: 0,
			height: 0
		}, alignTo);

		// Add the text size for alignment calculation
		extend(options, {
			width: bBox.width,
			height: bBox.height
		});

		// Allow a hook for changing alignment in the last moment, then do the alignment
		if (rotation) {
			justify = false; // Not supported for rotated text
			rotCorr = chart.renderer.rotCorr(baseline, rotation); // #3723
			alignAttr = {
				x: alignTo.x + options.x + alignTo.width / 2 + rotCorr.x,
				y: alignTo.y + options.y + { top: 0, middle: 0.5, bottom: 1 }[options.verticalAlign] * alignTo.height
			};
			dataLabel[isNew ? 'attr' : 'animate'](alignAttr)
				.attr({ // #3003
					align: align
				});

			// Compensate for the rotated label sticking out on the sides
			normRotation = (rotation + 720) % 360;
			negRotation = normRotation > 180 && normRotation < 360;

			if (align === 'left') {
				alignAttr.y -= negRotation ? bBox.height : 0;
			} else if (align === 'center') {
				alignAttr.x -= bBox.width / 2;
				alignAttr.y -= bBox.height / 2;
			} else if (align === 'right') {
				alignAttr.x -= bBox.width;
				alignAttr.y -= negRotation ? 0 : bBox.height;
			}
			

		} else {
			dataLabel.align(options, null, alignTo);
			alignAttr = dataLabel.alignAttr;
		}

		// Handle justify or crop
		if (justify) {
			this.justifyDataLabel(dataLabel, options, alignAttr, bBox, alignTo, isNew);
			
		// Now check that the data label is within the plot area
		} else if (pick(options.crop, true)) {
			visible = chart.isInsidePlot(alignAttr.x, alignAttr.y) && chart.isInsidePlot(alignAttr.x + bBox.width, alignAttr.y + bBox.height);
		}

		// When we're using a shape, make it possible with a connector or an arrow pointing to thie point
		if (options.shape && !rotation) {
			dataLabel.attr({
				anchorX: point.plotX,
				anchorY: point.plotY
			});
		}
	}

	// Show or hide based on the final aligned position
	if (!visible) {
		dataLabel.attr({ y: -9999 });
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
		justified,
		padding = dataLabel.box ? 0 : (dataLabel.padding || 0);

	// Off left
	off = alignAttr.x + padding;
	if (off < 0) {
		if (align === 'right') {
			options.align = 'left';
		} else {
			options.x = -off;
		}
		justified = true;
	}

	// Off right
	off = alignAttr.x + bBox.width - padding;
	if (off > chart.plotWidth) {
		if (align === 'left') {
			options.align = 'right';
		} else {
			options.x = chart.plotWidth - off;
		}
		justified = true;
	}

	// Off top
	off = alignAttr.y + padding;
	if (off < 0) {
		if (verticalAlign === 'bottom') {
			options.verticalAlign = 'top';
		} else {
			options.y = -off;
		}
		justified = true;
	}

	// Off bottom
	off = alignAttr.y + bBox.height - padding;
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
			j,
			overflow = [0, 0, 0, 0]; // top, right, bottom, left

		// get out if not enabled
		if (!series.visible || (!options.enabled && !series._hasPointLabels)) {
			return;
		}

		// run parent method
		Series.prototype.drawDataLabels.apply(series);

		each(data, function (point) {
			if (point.dataLabel && point.visible) { // #407, #2510

				// Arrange points for detection collision
				halves[point.half].push(point);

				// Reset positions (#4905)
				point.dataLabel._pos = null;
			}
		});

		/* Loop over the points in each half, starting from the top and bottom
		 * of the pie to detect overlapping labels.
		 */
		each(halves, function (points, i) {

			var top,
				bottom,
				length = points.length,
				positions,
				naturalY,
				size;

			if (!length) {
				return;
			}

			// Sort by angle
			series.sortByAngle(points, i - 0.5);

			// Only do anti-collision when we are outside the pie and have connectors (#856)
			if (distanceOption > 0) {
				top = Math.max(0, centerY - radius - distanceOption);
				bottom = Math.min(centerY + radius + distanceOption, chart.plotHeight);
				positions = map(points, function (point) {
					if (point.dataLabel) {
						size = point.dataLabel.getBBox().height || 21;
						return {
							target: point.labelPos[1] - top + size / 2,
							size: size,
							rank: point.y
						};
					}
				});
				H.distribute(positions, bottom + size - top);
			}

			// now the used slots are sorted, fill them up sequentially
			for (j = 0; j < length; j++) {

				point = points[j];
				labelPos = point.labelPos;
				dataLabel = point.dataLabel;
				visibility = point.visible === false ? 'hidden' : 'inherit';
				naturalY = labelPos[1];

				if (positions) {
					if (positions[j].pos === undefined) {
						visibility = 'hidden';
					} else {
						labelHeight = positions[j].size;
						y = top + positions[j].pos;
					}

				} else {
					y = naturalY;
				}

				// get the x - use the natural x position for labels near the top and bottom, to prevent the top
				// and botton slice connectors from touching each other on either side
				if (options.justify) {
					x = seriesCenter[0] + (i ? -1 : 1) * (radius + distanceOption);
				} else {
					x = series.getX(y < top + 2 || y > bottom - 2 ? naturalY : y, i);
				}


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
				labelPos.x = x;
				labelPos.y = y;


				// Detect overflowing data labels
				if (series.options.size === null) {
					dataLabelWidth = dataLabel.width;
					// Overflow left
					if (x - dataLabelWidth < connectorPadding) {
						overflow[3] = Math.max(Math.round(dataLabelWidth - x + connectorPadding), overflow[3]);

					// Overflow right
					} else if (x + dataLabelWidth > plotWidth - connectorPadding) {
						overflow[1] = Math.max(Math.round(x + dataLabelWidth - plotWidth + connectorPadding), overflow[1]);
					}

					// Overflow top
					if (y - labelHeight / 2 < 0) {
						overflow[0] = Math.max(Math.round(-y + labelHeight / 2), overflow[0]);

					// Overflow left
					} else if (y + labelHeight / 2 > plotHeight) {
						overflow[2] = Math.max(Math.round(y + labelHeight / 2 - plotHeight), overflow[2]);
					}
				}
			} // for each point
		}); // for each half

		// Do not apply the final placement and draw the connectors until we have verified
		// that labels are not spilling over.
		if (arrayMax(overflow) === 0 || this.verifyDataLabelOverflow(overflow)) {

			// Place the labels in the final position
			this.placeDataLabels();

			// Draw the connectors
			if (outside && connectorWidth) {
				each(this.points, function (point) {
					var isNew;

					connector = point.connector;
					dataLabel = point.dataLabel;

					if (dataLabel && dataLabel._pos && point.visible) {
						visibility = dataLabel._attr.visibility;

						isNew = !connector;

						if (isNew) {
							point.connector = connector = chart.renderer.path()
								.addClass('highcharts-data-label-connector highcharts-color-' + point.colorIndex)
								.add(series.dataLabelsGroup);

							/*= if (build.classic) { =*/
							connector.attr({
								'stroke-width': connectorWidth,
								'stroke': options.connectorColor || point.color || '${palette.neutralColor60}'
							});
							/*= } =*/
						}
						connector[isNew ? 'attr' : 'animate']({
							d: series.connectorPath(point.labelPos)
						});
						connector.attr('visibility', visibility);

					} else if (connector) {
						point.connector = connector.destroy();
					}
				});
			}
		}
	};

	/**
	 * Extendable method for getting the path of the connector between the data label
	 * and the pie slice.
	 */
	seriesTypes.pie.prototype.connectorPath = function (labelPos) {
		var x = labelPos.x,
			y = labelPos.y;
		return pick(this.options.dataLabels.softConnector, true) ? [
			'M',
			x + (labelPos[6] === 'left' ? 5 : -5), y, // end of the string at the label
			'C',
			x, y, // first break, next to the label
			2 * labelPos[2] - labelPos[4], 2 * labelPos[3] - labelPos[5],
			labelPos[2], labelPos[3], // second break
			'L',
			labelPos[4], labelPos[5] // base
		] : [
			'M',
			x + (labelPos[6] === 'left' ? 5 : -5), y, // end of the string at the label
			'L',
			labelPos[2], labelPos[3], // second break
			'L',
			labelPos[4], labelPos[5] // base
		];
	};

	/**
	 * Perform the final placement of the data labels after we have verified that they
	 * fall within the plot area.
	 */
	seriesTypes.pie.prototype.placeDataLabels = function () {
		each(this.points, function (point) {
			var dataLabel = point.dataLabel,
				_pos;

			if (dataLabel && point.visible) {
				_pos = dataLabel._pos;
				if (_pos) {
					dataLabel.attr(dataLabel._attr);
					dataLabel[dataLabel.moved ? 'animate' : 'attr'](_pos);
					dataLabel.moved = true;
				} else if (dataLabel) {
					dataLabel.attr({ y: -9999 });
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
			newSize = Math.max(center[2] - Math.max(overflow[1], overflow[3]), minSize);

		} else { // Auto center
			newSize = Math.max(
				center[2] - overflow[1] - overflow[3], // horizontal overflow
				minSize
			);
			center[0] += (overflow[3] - overflow[1]) / 2; // horizontal center
		}

		// Handle vertical size and center
		if (centerOption[1] !== null) { // Fixed center
			newSize = Math.max(Math.min(newSize, center[2] - Math.max(overflow[0], overflow[2])), minSize);

		} else { // Auto center
			newSize = Math.max(
				Math.min(
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
			center[3] = Math.min(relativeLength(options.innerSize || 0, newSize), newSize); // #3632
			this.translate(center);
			
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
		var inverted = this.chart.inverted,
			series = point.series,
			dlBox = point.dlBox || point.shapeArgs, // data label box for alignment
			below = pick(point.below, point.plotY > pick(this.translatedThreshold, series.yAxis.len)), // point.below is used in range series
			inside = pick(options.inside, !!this.options.stacking), // draw it inside the box?
			overshoot;

		// Align to the column itself, or the top of it
		if (dlBox) { // Area range uses this method but not alignTo
			alignTo = merge(dlBox);

			if (alignTo.y < 0) {
				alignTo.height += alignTo.y;
				alignTo.y = 0;
			}
			overshoot = alignTo.y + alignTo.height - series.yAxis.len;
			if (overshoot > 0) {
				alignTo.height -= overshoot;
			}

			if (inverted) {
				alignTo = {
					x: series.yAxis.len - alignTo.y - alignTo.height,
					y: series.xAxis.len - alignTo.x - alignTo.width,
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
