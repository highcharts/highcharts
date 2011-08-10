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
		toggleSlice = function() {
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
	setVisible: function(vis) {
		var point = this,
			chart = point.series.chart,
			tracker = point.tracker,
			dataLabel = point.dataLabel,
			connector = point.connector,
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
		if (point.legendItem) {
			chart.legend.colorizeItem(point, vis);
		}
	},

	/**
	 * Set or toggle whether the slice is cut out from the pie
	 * @param {Boolean} sliced When undefined, the slice state is toggled
	 * @param {Boolean} redraw Whether to redraw the chart. True by default.
	 */
	slice: function(sliced, redraw, animation) {
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
var PieSeries = extendClass(Series, {
	type: 'pie',
	isCartesian: false,
	pointClass: PiePoint,
	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		stroke: 'borderColor',
		'stroke-width': 'borderWidth',
		fill: 'color'
	},

	/**
	 * Pies have one color each point
	 */
	getColor: function() {
		// record first color for use in setData
		this.initialColor = this.chart.counters.color;
	},

	/**
	 * Animate the column heights one by one from zero
	 * @param {Boolean} init Whether to initialize the animation or run it
	 */
	animate: function(init) {
		var series = this,
			points = series.points;

		each(points, function(point) {
			var graphic = point.graphic,
				args = point.shapeArgs,
				up = -mathPI / 2;

			if (graphic) {
				// start values
				graphic.attr({
					r: 0,
					start: up,
					end: up
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
	setData: function() {
		Series.prototype.setData.apply(this, arguments);
		this.processData();
		this.generatePoints();
	},
	/**
	 * Do translation for pie slices
	 */
	translate: function() {
		var total = 0,
			series = this,
			cumulative = -0.25, // start at top
			precision = 1000, // issue #172
			options = series.options,
			slicedOffset = options.slicedOffset,
			connectorOffset = slicedOffset + options.borderWidth,
			positions = options.center.concat([options.size, options.innerSize || 0]),
			chart = series.chart,
			plotWidth = chart.plotWidth,
			plotHeight = chart.plotHeight,
			start,
			end,
			angle,
			points = series.points,
			circ = 2 * mathPI,
			fraction,
			smallestSize = mathMin(plotWidth, plotHeight),
			isPercent,
			radiusX, // the x component of the radius vector for a given point
			radiusY,
			labelDistance = options.dataLabels.distance;

		// get positions - either an integer or a percentage string must be given
		positions = map(positions, function(length, i) {

			isPercent = /%$/.test(length);
			return isPercent ?
				// i == 0: centerX, relative to width
				// i == 1: centerY, relative to height
				// i == 2: size, relative to smallestSize
				// i == 4: innerSize, relative to smallestSize
				[plotWidth, plotHeight, smallestSize, smallestSize][i] *
					pInt(length) / 100:
				length;
		});

		// utility for getting the x value from a given y, used for anticollision logic in data labels
		series.getX = function(y, left) {

			angle = math.asin((y - positions[1]) / (positions[2] / 2 + labelDistance));

			return positions[0] +
				(left ? -1 : 1) *
				(mathCos(angle) * (positions[2] / 2 + labelDistance));
		};

		// set center for later use
		series.center = positions;

		// get the total sum
		each(points, function(point) {
			total += point.y;
		});

		each(points, function(point) {
			// set start and end angle
			fraction = total ? point.y / total : 0;
			start = mathRound(cumulative * circ * precision) / precision;
			cumulative += fraction;
			end = mathRound(cumulative * circ * precision) / precision;

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
					angle < circ / 4 ? 'left' : 'right', // alignment
				angle // center angle
			];


			// API properties
			point.percentage = fraction * 100;
			point.total = total;

		});

		this.setTooltipPoints();
	},

	/**
	 * Render the slices
	 */
	render: function() {
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
	drawPoints: function() {
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
		each(series.points, function(point) {
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
				point.graphic =
					renderer.arc(shapeArgs)
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
	drawDataLabels: function() {
		var series = this,
			points = series.points,
			point,
			chart = series.chart,
			options = series.options.dataLabels,
			connectorPadding = pick(options.connectorPadding, 10),
			connectorWidth = pick(options.connectorWidth, 1),
			connector,
			connectorPath,
			outside = options.distance > 0,
			dataLabel,
			labelPos,
			labelHeight,
			lastY,
			centerY = series.center[1],
			quarters = [// divide the points into quarters for anti collision
				[], // top right
				[], // bottom right
				[], // bottom left
				[] // top left
			],
			x,
			y,
			visibility,
			overlapping,
			rankArr,
			secondPass,
			sign,
			lowerHalf,
			sort,
			i = 4,
			j;

		// run parent method
		Series.prototype.drawDataLabels.apply(series);

		// arrange points for detection collision
		each(points, function(point) {
			var angle = point.labelPos[7],
				quarter;
			if (angle < 0) {
				quarter = 0;
			} else if (angle < mathPI / 2) {
				quarter = 1;
			} else if (angle < mathPI) {
				quarter = 2;
			} else {
				quarter = 3;
			}
			quarters[quarter].push(point);
		});
		quarters[1].reverse();
		quarters[3].reverse();

		// define the sorting algorithm
		sort = function(a,b) {
			return a.y > b.y;
		};
		/* Loop over the points in each quartile, starting from the top and bottom
		 * of the pie to detect overlapping labels.
		 */
		while (i--) {
			overlapping = 0;

			// create an array for sorting and ranking the points within each quarter
			rankArr = [].concat(quarters[i]);
			rankArr.sort(sort);
			j = rankArr.length;
			while (j--) {
				rankArr[j].rank = j;
			}

			/* In the first pass, count the number of overlapping labels. In the second
			 * pass, remove the labels with lowest rank/values.
			 */
			for (secondPass = 0; secondPass < 2; secondPass++) {
				lowerHalf = i % 3;
				lastY = lowerHalf ? 9999 : -9999;
				sign = lowerHalf ? -1 : 1;

				for (j = 0; j < quarters[i].length; j++) {
					point = quarters[i][j];

					dataLabel = point.dataLabel;
					if (dataLabel) {
						labelPos = point.labelPos;
						visibility = VISIBLE;
						x = labelPos[0];
						y = labelPos[1];


						// assume all labels have equal height
						if (!labelHeight) {
							labelHeight = dataLabel && dataLabel.getBBox().height;
						}

						// anticollision
						if (outside) {
							if (secondPass && point.rank < overlapping) {
								visibility = HIDDEN;
							} else if ((!lowerHalf && y < lastY + labelHeight) ||
									(lowerHalf && y > lastY - labelHeight)) {
								y = lastY + sign * labelHeight;
								x = series.getX(y, i > 1);
								if ((!lowerHalf && y + labelHeight > centerY) ||
										(lowerHalf && y -labelHeight < centerY)) {
									if (secondPass) {
										visibility = HIDDEN;
									} else {
										overlapping++;
									}
								}
							}
						}

						if (point.visible === false) {
							visibility = HIDDEN;
						}

						if (visibility === VISIBLE) {
							lastY = y;
						}

						if (secondPass) {

							// move or place the data label
							dataLabel
								.attr({
									visibility: visibility,
									align: labelPos[6]
								})[dataLabel.moved ? 'animate' : 'attr']({
									x: x + options.x +
										({ left: connectorPadding, right: -connectorPadding }[labelPos[6]] || 0),
									y: y + options.y
								});
							dataLabel.moved = true;

							// draw the connector
							if (outside && connectorWidth) {
								connector = point.connector;

								connectorPath = [
									M,
									x + (labelPos[6] === 'left' ? 5 : -5), y, // end of the string at the label
									L,
									x, y, // first break, next to the label
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
										stroke: options.connectorColor || '#606060',
										visibility: visibility,
										zIndex: 3
									})
									.translate(chart.plotLeft, chart.plotTop)
									.add();
								}
							}
						}
					}
				}
			}
		}
	},

	/**
	 * Draw point specific tracker objects. Inherit directly from column series.
	 */
	drawTracker: ColumnSeries.prototype.drawTracker,

	/**
	 * Pies don't have point marker symbols
	 */
	getSymbol: function() {}

});
seriesTypes.pie = PieSeries;

