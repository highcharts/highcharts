/**
 * Set the default options for pie
 */
defaultPlotOptions.pie = merge(defaultSeriesOptions, {
	borderColor: '#FFFFFF',
	borderWidth: 1,
	center: ['50%', '50%'],
	colorByPoint: true, // always true for pies
	dataLabels: {
		// align: null,
		// connectorWidth: 1,
		// connectorColor: point.color,
		// connectorPadding: 5,
		distance: 30,
		enabled: true,
		formatter: function () {
			return this.point.name;
		}
		// softConnector: true,
		//y: 0
	},
	//innerSize: 0,
	legendType: 'point',
	marker: null, // point options are specified in the base options
	size: '75%',
	showInLegend: false,
	slicedOffset: 10,
	states: {
		hover: {
			brightness: 0.1,
			shadow: false
		}
	}
});

/**
 * Extended point object for pies
 */
var PiePoint = extendClass(Point, {
	/**
	 * Initiate the pie slice
	 */
	init: function () {

		Point.prototype.init.apply(this, arguments);

		var point = this,
			toggleSlice;

		//visible: options.visible !== false,
		extend(point, {
			visible: point.visible !== false,
			name: pick(point.name, 'Slice')
		});

		// add event listener for select
		toggleSlice = function () {
			point.slice();
		};
		addEvent(point, 'select', toggleSlice);
		addEvent(point, 'unselect', toggleSlice);

		return point;
	},

	/**
	 * Toggle the visibility of the pie slice
	 * @param {Boolean} vis Whether to show the slice or not. If undefined, the
	 *    visibility is toggled
	 */
	setVisible: function (vis) {
		var point = this,
			series = point.series,
			chart = series.chart,
			tracker = point.tracker,
			dataLabel = point.dataLabel,
			connector = point.connector,
			shadowGroup = point.shadowGroup,
			method;

		// if called without an argument, toggle visibility
		point.visible = vis = vis === UNDEFINED ? !point.visible : vis;

		method = vis ? 'show' : 'hide';

		point.group[method]();
		if (tracker) {
			tracker[method]();
		}
		if (dataLabel) {
			dataLabel[method]();
		}
		if (connector) {
			connector[method]();
		}
		if (shadowGroup) {
			shadowGroup[method]();
		}
		if (point.legendItem) {
			chart.legend.colorizeItem(point, vis);
		}
		
		// Handle ignore hidden slices
		if (!series.isDirty && series.options.ignoreHiddenPoint) {
			series.isDirty = true;
			chart.redraw();
		}
	},

	/**
	 * Set or toggle whether the slice is cut out from the pie
	 * @param {Boolean} sliced When undefined, the slice state is toggled
	 * @param {Boolean} redraw Whether to redraw the chart. True by default.
	 */
	slice: function (sliced, redraw, animation) {
		var point = this,
			series = point.series,
			chart = series.chart,
			slicedTranslation = point.slicedTranslation,
			translation;

		setAnimation(animation, chart);

		// redraw is true by default
		redraw = pick(redraw, true);

		// if called without an argument, toggle
		sliced = point.sliced = defined(sliced) ? sliced : !point.sliced;

		translation = {
			translateX: (sliced ? slicedTranslation[0] : chart.plotLeft),
			translateY: (sliced ? slicedTranslation[1] : chart.plotTop)
		};
		point.group.animate(translation);
		if (point.shadowGroup) {
			point.shadowGroup.animate(translation);
		}

	}
});

/**
 * The Pie series class
 */
var PieSeries = {
	type: 'pie',
	isCartesian: false,
	pointClass: PiePoint,
	requireSorting: false,
	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		stroke: 'borderColor',
		'stroke-width': 'borderWidth',
		fill: 'color'
	},

	/**
	 * Pies have one color each point
	 */
	getColor: function () {
		// record first color for use in setData
		this.initialColor = this.chart.counters.color;
	},

	/**
	 * Animate the pies in
	 */
	animate: function () {
		var series = this,
			points = series.points,
			startAngleRad = series.startAngleRad;

		each(points, function (point) {
			var graphic = point.graphic,
				args = point.shapeArgs;

			if (graphic) {
				// start values
				graphic.attr({
					r: series.center[3] / 2, // animate from inner radius (#779)
					start: startAngleRad,
					end: startAngleRad
				});

				// animate
				graphic.animate({
					r: args.r,
					start: args.start,
					end: args.end
				}, series.options.animation);
			}
		});

		// delete this function to allow it only once
		series.animate = null;

	},

	/**
	 * Extend the basic setData method by running processData and generatePoints immediately,
	 * in order to access the points from the legend.
	 */
	setData: function (data, redraw) {
		Series.prototype.setData.call(this, data, false);
		this.processData();
		this.generatePoints();
		if (pick(redraw, true)) {
			this.chart.redraw();
		} 
	},
	
	/**
	 * Get the center of the pie based on the size and center options relative to the  
	 * plot area. Borrowed by the polar and gauge series types.
	 */
	getCenter: function () {
		
		var options = this.options,
			chart = this.chart,
			plotWidth = chart.plotWidth,
			plotHeight = chart.plotHeight,
			positions = options.center.concat([options.size, options.innerSize || 0]),
			smallestSize = mathMin(plotWidth, plotHeight),
			isPercent;			
		
		return map(positions, function (length, i) {

			isPercent = /%$/.test(length);
			return isPercent ?
				// i == 0: centerX, relative to width
				// i == 1: centerY, relative to height
				// i == 2: size, relative to smallestSize
				// i == 4: innerSize, relative to smallestSize
				[plotWidth, plotHeight, smallestSize, smallestSize][i] *
					pInt(length) / 100 :
				length;
		});
	},
	
	/**
	 * Do translation for pie slices
	 */
	translate: function () {
		this.generatePoints();
		
		var total = 0,
			series = this,
			cumulative = 0,
			precision = 1000, // issue #172
			options = series.options,
			slicedOffset = options.slicedOffset,
			connectorOffset = slicedOffset + options.borderWidth,
			positions,
			chart = series.chart,
			start,
			end,
			angle,
			startAngleRad = series.startAngleRad = mathPI / 180 * ((options.startAngle || 0) % 360 - 90),
			points = series.points,
			circ = 2 * mathPI,
			fraction,
			radiusX, // the x component of the radius vector for a given point
			radiusY,
			labelDistance = options.dataLabels.distance,
			ignoreHiddenPoint = options.ignoreHiddenPoint,
			i,
			len = points.length,
			point;

		// get positions - either an integer or a percentage string must be given
		series.center = positions = series.getCenter();

		// utility for getting the x value from a given y, used for anticollision logic in data labels
		series.getX = function (y, left) {

			angle = math.asin((y - positions[1]) / (positions[2] / 2 + labelDistance));

			return positions[0] +
				(left ? -1 : 1) *
				(mathCos(angle) * (positions[2] / 2 + labelDistance));
		};

		// get the total sum
		for (i = 0; i < len; i++) {
			point = points[i];
			total += (ignoreHiddenPoint && !point.visible) ? 0 : point.y;
		}

		// Calculate the geometry for each point
		for (i = 0; i < len; i++) {
			
			point = points[i];
			
			// set start and end angle
			fraction = total ? point.y / total : 0;
			start = mathRound((startAngleRad + (cumulative * circ)) * precision) / precision;
			if (!ignoreHiddenPoint || point.visible) {
				cumulative += fraction;
			}
			end = mathRound((startAngleRad + (cumulative * circ)) * precision) / precision;

			// set the shape
			point.shapeType = 'arc';
			point.shapeArgs = {
				x: positions[0],
				y: positions[1],
				r: positions[2] / 2,
				innerR: positions[3] / 2,
				start: start,
				end: end
			};

			// center for the sliced out slice
			angle = (end + start) / 2;
			if (angle > 0.75 * circ) {
				angle -= 2 * mathPI;
			}
			point.slicedTranslation = map([
				mathCos(angle) * slicedOffset + chart.plotLeft,
				mathSin(angle) * slicedOffset + chart.plotTop
			], mathRound);

			// set the anchor point for tooltips
			radiusX = mathCos(angle) * positions[2] / 2;
			radiusY = mathSin(angle) * positions[2] / 2;
			point.tooltipPos = [
				positions[0] + radiusX * 0.7,
				positions[1] + radiusY * 0.7
			];
			
			point.half = angle < circ / 4 ? 0 : 1;
			point.angle = angle;

			// set the anchor point for data labels
			point.labelPos = [
				positions[0] + radiusX + mathCos(angle) * labelDistance, // first break of connector
				positions[1] + radiusY + mathSin(angle) * labelDistance, // a/a
				positions[0] + radiusX + mathCos(angle) * connectorOffset, // second break, right outside pie
				positions[1] + radiusY + mathSin(angle) * connectorOffset, // a/a
				positions[0] + radiusX, // landing point for connector
				positions[1] + radiusY, // a/a
				labelDistance < 0 ? // alignment
					'center' :
					point.half ? 'right' : 'left', // alignment
				angle // center angle
			];
			
			// API properties
			point.percentage = fraction * 100;
			point.total = total;

		}


		this.setTooltipPoints();
	},

	/**
	 * Render the slices
	 */
	render: function () {
		var series = this;

		// cache attributes for shapes
		series.getAttribs();

		this.drawPoints();

		// draw the mouse tracking area
		if (series.options.enableMouseTracking !== false) {
			series.drawTracker();
		}

		this.drawDataLabels();

		if (series.options.animation && series.animate) {
			series.animate();
		}

		// (See #322) series.isDirty = series.isDirtyData = false; // means data is in accordance with what you see
		series.isDirty = false; // means data is in accordance with what you see
	},

	/**
	 * Draw the data points
	 */
	drawPoints: function () {
		var series = this,
			chart = series.chart,
			renderer = chart.renderer,
			groupTranslation,
			//center,
			graphic,
			group,
			shadow = series.options.shadow,
			shadowGroup,
			shapeArgs;

		// draw the slices
		each(series.points, function (point) {
			graphic = point.graphic;
			shapeArgs = point.shapeArgs;
			group = point.group;
			shadowGroup = point.shadowGroup;

			// put the shadow behind all points
			if (shadow && !shadowGroup) {
				shadowGroup = point.shadowGroup = renderer.g('shadow')
					.attr({ zIndex: 4 })
					.add();
			}

			// create the group the first time
			if (!group) {
				group = point.group = renderer.g('point')
					.attr({ zIndex: 5 })
					.add();
			}

			// if the point is sliced, use special translation, else use plot area traslation
			groupTranslation = point.sliced ? point.slicedTranslation : [chart.plotLeft, chart.plotTop];
			group.translate(groupTranslation[0], groupTranslation[1]);
			if (shadowGroup) {
				shadowGroup.translate(groupTranslation[0], groupTranslation[1]);
			}

			// draw the slice
			if (graphic) {
				graphic.animate(shapeArgs);
			} else {
				point.graphic = graphic = renderer.arc(shapeArgs)
					.setRadialReference(series.center)
					.attr(extend(
						point.pointAttr[NORMAL_STATE],
						{ 'stroke-linejoin': 'round' }
					))
					.add(point.group)
					.shadow(shadow, shadowGroup);
				
			}

			// detect point specific visibility
			if (point.visible === false) {
				point.setVisible(false);
			}

		});

	},

	/**
	 * Override the base drawDataLabels method by pie specific functionality
	 */
	drawDataLabels: function () {
		var series = this,
			data = series.data,
			point,
			chart = series.chart,
			options = series.options.dataLabels,
			connectorPadding = pick(options.connectorPadding, 10),
			connectorWidth = pick(options.connectorWidth, 1),
			connector,
			connectorPath,
			softConnector = pick(options.softConnector, true),
			distanceOption = options.distance,
			seriesCenter = series.center,
			radius = seriesCenter[2] / 2,
			centerY = seriesCenter[1],
			outside = distanceOption > 0,
			dataLabel,
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
			i = 2,
			j,
			sort = function (a, b) {
				return b.y - a.y;
			},
			sortByAngle = function (points, sign) {
				points.sort(function (a, b) {
					return (b.angle - a.angle) * sign;
				});
			};

		// get out if not enabled
		if (!options.enabled && !series._hasPointLabels) {
			return;
		}

		// run parent method
		Series.prototype.drawDataLabels.apply(series);

		// arrange points for detection collision
		each(data, function (point) {
			if (point.dataLabel) { // it may have been cancelled in the base method (#407)
				halves[point.half].push(point);
			}
		});

		// assume equal label heights
		labelHeight = halves[0][0] && halves[0][0].dataLabel && (halves[0][0].dataLabel.getBBox().height || 21); // 21 is for #968

		/* Loop over the points in each half, starting from the top and bottom
		 * of the pie to detect overlapping labels.
		 */
		while (i--) {

			var slots = [],
				slotsLength,
				usedSlots = [],
				points = halves[i],
				pos,
				length = points.length,
				slotIndex;
				
			// Sort by angle
			sortByAngle(points, i - 0.5);

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
						chart.renderer.rect(slotX, slotY - 7, 100, labelHeight)
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
				
				// move or place the data label
				dataLabel
					.attr({
						visibility: visibility,
						align: labelPos[6]
					})[dataLabel.moved ? 'animate' : 'attr']({
						x: x + options.x +
							({ left: connectorPadding, right: -connectorPadding }[labelPos[6]] || 0),
						y: y + options.y - 10 // 10 is for the baseline (label vs text)
					});
				dataLabel.moved = true;

				// draw the connector
				if (outside && connectorWidth) {
					connector = point.connector;

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
							visibility: visibility,
							zIndex: 3
						})
						.translate(chart.plotLeft, chart.plotTop)
						.add();
					}
				}
			}
		}
	},
	
	alignDataLabel: noop,

	/**
	 * Draw point specific tracker objects. Inherit directly from column series.
	 */
	drawTracker: ColumnSeries.prototype.drawTracker,

	/**
	 * Use a simple symbol from column prototype
	 */
	drawLegendSymbol: AreaSeries.prototype.drawLegendSymbol,

	/**
	 * Pies don't have point marker symbols
	 */
	getSymbol: function () {}

};
PieSeries = extendClass(Series, PieSeries);
seriesTypes.pie = PieSeries;

