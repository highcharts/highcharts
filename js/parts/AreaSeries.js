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
	
	/* *
	 * For stacks, don't split segments on null values. Instead, draw null values with 
	 * no marker. Also insert dummy points for any X position that exists in other series
	 * in the stack.
	 * / 
	setAllStackPoints: function () {
		var segment = [],
			keys = [],
			xAxis = this.xAxis,
			yAxis = this.yAxis,
			stack = yAxis.stacks[this.stackKey],
			pointMap = {},
			plotX,
			plotY,
			points = this.points,
			connectNulls = this.options.connectNulls,
			val,
			seriesIndex = this.index,
			i,
			x;

		if (this.options.stacking && !this.cropped) { // cropped causes artefacts in Stock, and perf issue
			// Create a map where we can quickly look up the points by their X value.
			for (i = 0; i < points.length; i++) {
				pointMap[points[i].x] = points[i];
			}

			// Sort the keys (#1651)
			for (x in stack) {
				keys.push(+x);
			}
			keys.sort(function (a, b) {
				return a - b;
			});

			each(keys, function (x) {
				//if (connectNulls && (!pointMap[x] || pointMap[x].y === null)) { // #1836
				//	return;

				// The point exists, push it to the segment
				//} else if (pointMap[x]) {
				if (pointMap[x] && !pointMap[x].isNull) {
					segment.push(pointMap[x]);

				// There is no point for this X value in this series, so we 
				// insert a dummy point in order for the areas to be drawn
				// correctly.
				} else {
					/ *plotX = xAxis.translate(x);
					val = stack[x].percent ? (stack[x].total ? stack[x].cum * 100 / stack[x].total : 0) : stack[x].cum; // #1991
					plotY = yAxis.toPixels(val, true);
					segment.push({ 
						y: null, 
						plotX: plotX,
						clientX: plotX, 
						plotY: plotY, 
						yBottom: plotY,
						onMouseOver: noop
					});* /
					segment.push({
						isNull: true,
						x: x
					});
					stack[x].nullFrom = seriesIndex;
				}
			});
			this.stackPoints = segment;
		}
	},* /
	
	/ **
	 * Extend the base Series getSegmentPath method by adding the path for the area.
	 * This path is pushed to the series.areaPath property.
	 * /
	getSegmentPath: function (segment) {
		
		var segmentPath = Series.prototype.getSegmentPath.call(this, segment), // call base method
			areaSegmentPath = [].concat(segmentPath), // work on a copy for the area path
			i,
			options = this.options,
			segLength = segmentPath.length,
			translatedThreshold = this.yAxis.getThreshold(options.threshold), // #2181
			yBottom;
		
		if (segLength === 3) { // for animation from 1 to two points
			areaSegmentPath.push(L, segmentPath[1], segmentPath[2]);
		}
		if (options.stacking && !this.closedStacks) {
			
			// Follow stack back. Todo: implement areaspline. A general solution could be to 
			// reverse the entire graphPath of the previous series, though may be hard with
			// splines and with series with different extremes
			for (i = segment.length - 1; i >= 0; i--) {

				yBottom = pick(segment[i].yBottom, translatedThreshold);
			
				// step line?
				if (i < segment.length - 1 && options.step) {
					areaSegmentPath.push(segment[i + 1].plotX, yBottom);
				}
				
				areaSegmentPath.push(segment[i].plotX, yBottom);
			}

		} else { // follow zero line back
			this.closeSegment(areaSegmentPath, segment, translatedThreshold);
		}
		this.areaPath = this.areaPath.concat(areaSegmentPath);
		return segmentPath;
	},
	
	/ **
	 * Extendable method to close the segment path of an area. This is overridden in polar 
	 * charts.
	 * /
	closeSegment: function (path, segment, translatedThreshold) {
		path.push(
			L,
			segment[segment.length - 1].plotX,
			translatedThreshold,
			L,
			segment[0].plotX,
			translatedThreshold
		);
	},
	*/
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
			addDummyPoints = function (i, otherI, plotX, plotY, cliffName) {
				var stack = stacks[points[i].x],
					otherStack = points[otherI] && stacks[points[otherI].x],
					cliff;

				if (otherStack && points[otherI].isNull) {
					otherStack.hasNulls = true;
				}
				
				if (otherStack && (otherStack.hasNulls || stack[cliffName])) {
					
					if (otherStack.points[seriesIndex]) {
						cliff = stack[cliffName];
					} else {
						cliff = yBottom - plotY;
						// Add it up
						stack[cliffName] += cliff;
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
							plotY + cliff
					});
					bottomPoints.push({
						plotX: plotX,
						plotY: points[otherI].isNull ? 
							plotYNullTop[otherI] || translatedThreshold : 
							yBottom + cliff
					});

				} else if (!otherStack) {
					cliff = yBottom - plotY;
					// Add it up
					stack[cliffName] += cliff;					
				}
			};
			// Get the series index of the previous valid point in the stack
			/*getPreviousSeries = function (x) {
				var i = seriesIndex;
				while (i--) {
					if (stacks[x].points[i]) {
						return i;
					} else {
						stacks[x].hasNulls = true;
					}
				}
			};*/

		if (stacking && seriesIndex > 0) {
			for (i = 0; i < len; i++) {
				//previousSeries = getPreviousSeries(points[i].x);
				if (!points[i].isNull) {
					plotYBottom[i] = yAxis.toPixels(stacks[points[i].x].points[seriesIndex][0], true);
				}
				
				//if (previousSeries !== seriesIndex - 1) {
					/*plotYNullBottom[i] = previousSeries !== undefined ?
						yAxis.toPixels(stacks[points[i].x].points[previousSeries][0], true):
						translatedThreshold;*/
					/*plotYNullTop[i] = points[i].isNull ? 
						translatedThreshold : 
						points[i].plotY - plotYBottom[i] + plotYNullBottom[i];*/
					
				//}
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
		this.points = topPoints;
		topPath = getGraphPath.call(this);
		this.points = bottomPoints.reverse();
		bottomPath = getGraphPath.call(this);
		if (bottomPath.length) {
			bottomPath[0] = L;
		}

		areaPath = topPath.concat(bottomPath);
		this.points = graphPoints;

		graphPath = getGraphPath.call(this);
		this.points = points;

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
	
	/**
	 * Get the series' symbol in the legend
	 * 
	 * @param {Object} legend The legend object
	 * @param {Object} item The series (this) or point
	 */
	drawLegendSymbol: function (legend, item) {
		
		item.legendSymbol = this.chart.renderer.rect(
			0,
			legend.baseline - 11,
			legend.options.symbolWidth,
			12,
			2
		).attr({
			zIndex: 3
		}).add(item.legendGroup);		
		
	}
});

seriesTypes.area = AreaSeries;