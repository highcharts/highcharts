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

	getGraphPath: function () {
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
			points = this.stackPoints || this.points,
			len = points.length,
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
					otherStack = stacks && otherPoint && stacks[otherPoint.x],
					cliff,
					n,
					pointKey;

				if (otherStack && points[otherI].isNull) {
					otherStack.hasNulls = true;
				}

				if ((otherPoint && otherPoint.isNull) || (otherStack && (otherStack.hasNulls || stack[cliffName]))) {

					// Get the point key (TODO: check if we can use a less rigid point key system, what issue did this pattern solve?)
					if (stacks) {
						for (n in otherStack.points) {
							if (n.indexOf(seriesIndex + ',') === 0) {
								pointKey = n;
								break;
							}
						}
					}

					if (stacks && otherStack.points[pointKey]) {
						cliff = stack[cliffName];
					} else {
						cliff = yBottom - plotY;
						if (stack) {
							stack[cliffName] += cliff;
						}
					}
					
					if (otherI > i) {
						graphPoints.push({
							isNull: true
						});
					}
					graphPoints.push({
						plotX: plotX,
						plotY: plotY + cliff
					});
					if (otherI < i) {
						graphPoints.push({
							isNull: true
						});
					}
					
					topPoints.push({
						plotX: plotX,
						plotY: points[otherI].isNull ? 
							plotYNullTop[otherI] || translatedThreshold : 
							plotY + cliff,
						isCliff: true
					});
					bottomPoints.push({
						plotX: plotX,
						plotY: points[otherI].isNull ? 
							plotYNullTop[otherI] || translatedThreshold : 
							yBottom + cliff,
						isCliff: true
					});

				} else if (stacks && !otherStack) {
					cliff = yBottom - plotY;
					stack[cliffName] += cliff;
				}
			};

		if (stacking && seriesIndex > 0) {
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
		//this.points = topPoints;
		topPath = getGraphPath.call(this, topPoints);
		//this.points = bottomPoints.reverse();
		bottomPath = getGraphPath.call(this, bottomPoints.reverse());
		if (bottomPath.length) {
			bottomPath[0] = L;
		}

		areaPath = topPath.concat(bottomPath);
		//this.points = graphPoints;

		graphPath = getGraphPath.call(this, graphPoints);
		//this.points = points;

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
