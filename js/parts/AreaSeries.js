/**
 * Set the default options for area
 */
defaultPlotOptions.area = merge(defaultSeriesOptions, {
	threshold: 0
	// trackByArea: false,
	// lineColor: null, // overrides color, but lets fillColor be unaltered
	// fillOpacity: 0.75,
	// fillColor: null
});

/**
 * AreaSeries object
 */
var AreaSeries = extendClass(Series, {
	type: 'area',

	/** 
	 * Return an array of stacked points, where null and missing points are replaced by 
	 * dummy points in order for gaps to be drawn correctly in stacks.
	 */
	getStackPoints: function () {
		var series = this,
			segment = [],
			keys = [],
			xAxis = this.xAxis,
			yAxis = this.yAxis,
			stack = yAxis.stacks[this.stackKey],
			pointMap = {},
			points = this.points,
			seriesIndex = series.index,
			seriesLength = yAxis.series.length,
			upOrDown = pick(yAxis.options.reversedStacks, true) ? 1 : -1,
			connectNulls = series.options.connectNulls,
			i,
			x;

		if (this.options.stacking && !this.cropped) { // cropped causes artefacts in Stock, and perf issue
			// Create a map where we can quickly look up the points by their X value.
			for (i = 0; i < points.length; i++) {
				pointMap[points[i].x] = points[i];
			}

			// Sort the keys (#1651)
			for (x in stack) {
				if (stack[x].total !== null) { // nulled after switching between grouping and not (#1651, #2336)
					keys.push(+x);
				}
			}
			keys.sort(function (a, b) {
				return a - b;
			});

			each(keys, function (x, idx) {
				var y = 0,
					stackPoint,
					stackedValues;

				if (pointMap[x] && !pointMap[x].isNull) {
					segment.push(pointMap[x]);

					// Find left and right cliff. -1 goes left, 1 goes right.
					if (!connectNulls) {
						each([-1, 1], function (direction) {
							var nullName = direction === 1 ? 'rightNull' : 'leftNull',
								cliffName = direction === 1 ? 'rightCliff' : 'leftCliff',
								cliff = 0,
								otherStack = stack[keys[idx + direction]];

							// If there is a stack next to this one, to the left or to the right...
							if (otherStack) {
								i = seriesIndex;
								while (i >= 0 && i < seriesLength) { // Can go either up or down, depending on reversedStacks
									stackPoint = otherStack.points[i];
									if (!stackPoint) {
										// If the next point in this series is missing, mark the point
										// with point.leftNull or point.rightNull = true.
										if (i === seriesIndex) {
											pointMap[x][nullName] = true;

										// If there are missing points in the next stack in any of the 
										// series below this one, we need to substract the missing values
										// and add a hiatus to the left or right.
										} else {
											stackedValues = stack[x].points[i];
											if (stackedValues) {
												cliff -= stackedValues[1] - stackedValues[0];
											}
										}
									}
									// When reversedStacks is true, loop up, else loop down
									i += upOrDown; 
								}					
							}
							if (cliff !== 0) {
								pointMap[x][cliffName] = cliff;
							}
						});
					}


				// There is no point for this X value in this series, so we 
				// insert a dummy point in order for the areas to be drawn
				// correctly.
				} else {

					// Loop down the stack to find the series below this one that has
					// a value (#1991)
					i = seriesIndex;
					while (i >= 0 && i < seriesLength) {
						stackPoint = stack[x].points[i];
						if (stackPoint) {
							y = stackPoint[1];
							break;
						}
						// When reversedStacks is true, loop up, else loop down
						i += upOrDown;
					}

					y = yAxis.toPixels(y, true);
					segment.push({ 
						isNull: true,
						plotX: xAxis.toPixels(x, true),
						plotY: y,
						yBottom: y
					});
				}
			});

		} 

		return segment;
	},

	getGraphPath: function (points) {
		var getGraphPath = Series.prototype.getGraphPath,
			graphPath,
			options = this.options,
			stacking = options.stacking,
			yAxis = this.yAxis,
			topPath,
			topPoints = [],
			bottomPath,
			bottomPoints = [],
			graphPoints = [],
			seriesIndex = this.index,
			i,
			areaPath,
			plotX,
			plotY,
			stacks = yAxis.stacks[this.stackKey],
			isNull,
			yBottom,
			connectNulls = options.connectNulls,

			addDummyPoints = function (i, otherI, plotX, cliffName) {
				var point = points[i],
					stackedValues = stacks[point.x].points[seriesIndex],
					nullName = i > otherI ? 'leftNull' : 'rightNull';


				if (point[cliffName]) {

					// Add to the graph
					if (otherI > i) {
						graphPoints.push({
							isNull: true
						});
					}
					graphPoints.push({
						plotX: plotX,
						plotY: yAxis.toPixels(stackedValues[1] + point[cliffName], true)
					});
					if (otherI < i) {
						graphPoints.push({
							isNull: true
						});
					}
					
				}

				if (point[cliffName] || point[nullName]) {
					// Add to the top and bottom line of the area
					topPoints.push({
						plotX: plotX,
						plotY: yAxis.toPixels(
							(point[nullName] ? stackedValues[0] : stackedValues[1]) + (point[cliffName] || 0),
							true
						),
						isCliff: true
					});
					bottomPoints.push({
						plotX: plotX,
						plotY: yAxis.toPixels(
							stackedValues[0] + (point[cliffName] || 0), 
							true
						),
						isCliff: true
					});

				} 
			};

		// Find what points to use
		points = points || this.points;

		
		// Fill in missing points
		if (stacking) {
			points = this.getStackPoints();
		}

		for (i = 0; i < points.length; i++) {
			isNull = points[i].isNull;
			plotX = points[i].plotX;
			plotY = points[i].plotY;
			yBottom = points[i].yBottom;

			if (!isNull || connectNulls) {

				if (!connectNulls) {
					addDummyPoints(i, i - 1, plotX, 'leftCliff');
				}

				graphPoints.push({
					plotX: plotX,
					plotY: plotY
				});
				topPoints.push({
					plotX: plotX,
					plotY: plotY
				});
				bottomPoints.push({
					plotX: plotX,
					plotY: yBottom
				});

				if (!connectNulls) {
					addDummyPoints(i, i + 1, plotX, 'rightCliff');
				}
			
			} else {
				graphPoints.push({
					isNull: true
				});
			}
		}
		topPath = getGraphPath.call(this, topPoints);
		bottomPath = getGraphPath.call(this, bottomPoints.reverse());
		if (bottomPath.length) {
			bottomPath[0] = L;
		}

		areaPath = topPath.concat(bottomPath);
		graphPath = getGraphPath.call(this, graphPoints);

		this.areaPath = areaPath;
		return graphPath;
	},
	
	/**
	 * Draw the graph and the underlying area. This method calls the Series base
	 * function and adds the area. The areaPath is calculated in the getSegmentPath
	 * method called from Series.prototype.drawGraph.
	 */
	drawGraph: function () {
		
		// Define or reset areaPath
		this.areaPath = [];
		
		// Call the base method
		Series.prototype.drawGraph.apply(this);
		
		// Define local variables
		var series = this,
			areaPath = this.areaPath,
			options = this.options,
			negativeColor = options.negativeColor,
			negativeFillColor = options.negativeFillColor,
			props = [['area', this.color, options.fillColor]]; // area name, main color, fill color
		
		if (negativeColor || negativeFillColor) {
			props.push(['areaNeg', negativeColor, negativeFillColor]);
		}
		
		each(props, function (prop) {
			var areaKey = prop[0],
				area = series[areaKey];
				
			// Create or update the area
			if (area) { // update
				area.animate({ d: areaPath });
	
			} else { // create
				series[areaKey] = series.chart.renderer.path(areaPath)
					.attr({
						fill: pick(
							prop[2],
							Color(prop[1]).setOpacity(pick(options.fillOpacity, 0.75)).get()
						),
						zIndex: 0 // #1069
					}).add(series.group);
			}
		});
	},

	drawLegendSymbol: LegendSymbolMixin.drawRectangle
});

seriesTypes.area = AreaSeries;
