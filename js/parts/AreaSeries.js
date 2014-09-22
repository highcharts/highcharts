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

	setStackCliffs: function () {
		var stacks = this.yAxis.stacks[this.stackKey],
			xData = this.processedXData,
			yData = this.processedYData,
			seriesIndex = this.index,
			i,
			len = yData.length,

			addCliffs = function (i, otherI, cliffName) {
				var stack = stacks[xData[i]],
					pointStack = stack.points[seriesIndex + ',' + i],
					range = pointStack[1] - pointStack[0],
					otherY = yData[otherI],
					otherStack = stacks[xData[otherI]];

				if (otherY === null || (otherStack && (otherY === null || stack[cliffName]))) {

					if (stack[cliffName]) {
						stack.points[seriesIndex][cliffName] = stack[cliffName];
					}

					if (stacks && !otherStack.points[seriesIndex]) {
						stack[cliffName] += range;
					}

				} else if (stacks && !otherStack) {
					stack[cliffName] += range;
				}
			};

		for (i = 0; i < len; i++) {
			if (yData[i] !== null) {
				addCliffs(i, i - 1, 'leftCliff');
				addCliffs(i, i + 1, 'rightCliff');
			}
		}
	},

	getGraphPath: function (points) {
		var getGraphPath = Series.prototype.getGraphPath,
			graphPath,
			options = this.options,
			stacking = options.stacking,
			yAxis = this.yAxis,
			translatedThreshold = yAxis.getThreshold(options.threshold),
			topPath,
			topPoints = [],
			bottomPath,
			bottomPoints = [],
			graphPoints = [],
			len,
			seriesIndex = this.index,
			i,
			areaPath,
			plotX,
			plotY,
			stacks = yAxis.stacks[this.stackKey],
			isNull,
			plotYBottom = [],
			plotYNullTop = [],
			yBottom,
			addDummyPoints = options.connectNulls ? noop : function (i, otherI, plotX, plotY, cliffName) {
				var stack = stacks && stacks[points[i].x],
					otherPoint = points[otherI],
					cliff,
					pointStack = stack.points[seriesIndex + ',' + i];

				if (pointStack[cliffName] !== undefined || (otherPoint && otherPoint.isNull)) {
					cliff = pointStack[cliffName] || 0;
					plotY = yAxis.toPixels(pointStack[1] - cliff, true);
					

					// Break the graph line
					if (otherI > i) {
						graphPoints.push({
							isNull: true
						});
					}
					graphPoints.push({
						plotX: plotX,
						plotY: plotY
					});
					if (otherI < i) {
						graphPoints.push({
							isNull: true
						});
					}

					// Break the area's top and bottom line
					topPoints.push({
						plotX: plotX,
						plotY: points[otherI].isNull ? 
							plotYNullTop[otherI] || translatedThreshold : 
							plotY,
						isCliff: true
					});
					bottomPoints.push({
						plotX: plotX,
						plotY: points[otherI].isNull ? 
							plotYNullTop[otherI] || translatedThreshold : 
							yAxis.toPixels(pointStack[0] - cliff, true),
						isCliff: true
					});

				}
			};

		// Find what points to use
		points = points || this.points;
		len = points.length;

		if (stacking) {
			for (i = 0; i < len; i++) {
				if (!points[i].isNull) {
					plotYBottom[i] = yAxis.toPixels(stacks[points[i].x].points[seriesIndex + ',' + i][0], true);
				}
			}
		}

		for (i = 0; i < len; i++) {

			isNull = points[i].isNull;
			plotX = points[i].plotX;
			plotY = points[i].plotY;
			yBottom = plotYBottom[i] || translatedThreshold;

			if (!isNull) {

				addDummyPoints(i, i - 1, plotX, plotY, 'leftCliff');

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

				addDummyPoints(i, i + 1, plotX, plotY, 'rightCliff');
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
