/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Utilities.js';
import './Color.js';
import './Legend.js';
import './Series.js';
import './Options.js';
var color = H.color,
	each = H.each,
	LegendSymbolMixin = H.LegendSymbolMixin,
	map = H.map,
	pick = H.pick,
	Series = H.Series,
	seriesType = H.seriesType;

/**
 * Area series type.
 * @constructor seriesTypes.area
 * @extends {Series}
 */
seriesType('area', 'line', {
	softThreshold: false,
	threshold: 0
	// trackByArea: false,
	// lineColor: null, // overrides color, but lets fillColor be unaltered
	// fillOpacity: 0.75,
	// fillColor: null
}, /** @lends seriesTypes.area.prototype */ {
	singleStacks: false,
	/** 
	 * Return an array of stacked points, where null and missing points are replaced by 
	 * dummy points in order for gaps to be drawn correctly in stacks.
	 */
	getStackPoints: function (points) {
		var series = this,
			segment = [],
			keys = [],
			xAxis = this.xAxis,
			yAxis = this.yAxis,
			stack = yAxis.stacks[this.stackKey],
			pointMap = {},
			seriesIndex = series.index,
			yAxisSeries = yAxis.series,
			seriesLength = yAxisSeries.length,
			visibleSeries,
			upOrDown = pick(yAxis.options.reversedStacks, true) ? 1 : -1,
			i;


		points = points || this.points;

		if (this.options.stacking) {
			// Create a map where we can quickly look up the points by their X value.
			for (i = 0; i < points.length; i++) {
				pointMap[points[i].x] = points[i];
			}

			// Sort the keys (#1651)
			H.objectEach(stack, function (stackX, x) {
				if (stackX.total !== null) { // nulled after switching between grouping and not (#1651, #2336)
					keys.push(x);
				}
			});
			keys.sort(function (a, b) {
				return a - b;
			});

			visibleSeries = map(yAxisSeries, function () {
				return this.visible;
			});

			each(keys, function (x, idx) {
				var y = 0,
					stackPoint,
					stackedValues;

				if (pointMap[x] && !pointMap[x].isNull) {
					segment.push(pointMap[x]);

					// Find left and right cliff. -1 goes left, 1 goes right.
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
									} else if (visibleSeries[i]) {
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
						pointMap[x][cliffName] = cliff;
					});


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
					y = yAxis.translate(y, 0, 1, 0, 1); // #6272
					segment.push({ 
						isNull: true,
						plotX: xAxis.translate(x, 0, 0, 0, 1), // #6272
						x: x,
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
			//topPoints = [],
			bottomPath,
			bottomPoints = [],
			graphPoints = [],
			seriesIndex = this.index,
			i,
			areaPath,
			plotX,
			stacks = yAxis.stacks[this.stackKey],
			threshold = options.threshold,
			translatedThreshold = yAxis.getThreshold(options.threshold),
			isNull,
			yBottom,
			connectNulls = options.connectNulls || stacking === 'percent',
			/**
			 * To display null points in underlying stacked series, this series graph must be 
			 * broken, and the area also fall down to fill the gap left by the null point. #2069
			 */
			addDummyPoints = function (i, otherI, side) {
				var point = points[i],
					stackedValues = stacking && stacks[point.x].points[seriesIndex],
					nullVal = point[side + 'Null'] || 0,
					cliffVal = point[side + 'Cliff'] || 0,
					top,
					bottom,
					isNull = true;

				if (cliffVal || nullVal) {

					top = (nullVal ? stackedValues[0] : stackedValues[1]) + cliffVal;
					bottom = stackedValues[0] + cliffVal;
					isNull = !!nullVal;
				
				} else if (!stacking && points[otherI] && points[otherI].isNull) {
					top = bottom = threshold;
				}

				// Add to the top and bottom line of the area
				if (top !== undefined) {
					graphPoints.push({
						plotX: plotX,
						plotY: top === null ? translatedThreshold : yAxis.getThreshold(top),
						isNull: isNull,
						isCliff: true
					});
					bottomPoints.push({
						plotX: plotX,
						plotY: bottom === null ? translatedThreshold : yAxis.getThreshold(bottom),
						doCurve: false // #1041, gaps in areaspline areas
					});
				}
			};

		// Find what points to use
		points = points || this.points;

		// Fill in missing points
		if (stacking) {
			points = this.getStackPoints(points);
		}

		for (i = 0; i < points.length; i++) {
			isNull = points[i].isNull;
			plotX = pick(points[i].rectPlotX, points[i].plotX);
			yBottom = pick(points[i].yBottom, translatedThreshold);

			if (!isNull || connectNulls) {

				if (!connectNulls) {
					addDummyPoints(i, i - 1, 'left');
				}

				if (!(isNull && !stacking && connectNulls)) { // Skip null point when stacking is false and connectNulls true
					graphPoints.push(points[i]);
					bottomPoints.push({
						x: i,
						plotX: plotX,
						plotY: yBottom
					});
				}

				if (!connectNulls) {
					addDummyPoints(i, i + 1, 'right');
				}
			}
		}

		topPath = getGraphPath.call(this, graphPoints, true, true);
		
		bottomPoints.reversed = true;
		bottomPath = getGraphPath.call(this, bottomPoints, true, true);
		if (bottomPath.length) {
			bottomPath[0] = 'L';
		}

		areaPath = topPath.concat(bottomPath);
		graphPath = getGraphPath.call(this, graphPoints, false, connectNulls); // TODO: don't set leftCliff and rightCliff when connectNulls?

		areaPath.xMap = topPath.xMap;
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
			zones = this.zones,
			props = [[
				'area',
				'highcharts-area',
				/*= if (build.classic) { =*/
				this.color,
				options.fillColor
				/*= } =*/
			]]; // area name, main color, fill color
		
		each(zones, function (zone, i) {
			props.push([
				'zone-area-' + i, 
				'highcharts-area highcharts-zone-area-' + i + ' ' + zone.className,
				/*= if (build.classic) { =*/
				zone.color || series.color, 
				zone.fillColor || options.fillColor
				/*= } =*/
			]);
		});

		each(props, function (prop) {
			var areaKey = prop[0],
				area = series[areaKey];

			// Create or update the area
			if (area) { // update
				area.endX = areaPath.xMap;
				area.animate({ d: areaPath });

			} else { // create
				area = series[areaKey] = series.chart.renderer.path(areaPath)
					.addClass(prop[1])
					.attr({
						/*= if (build.classic) { =*/
						fill: pick(
							prop[3],
							color(prop[2]).setOpacity(pick(options.fillOpacity, 0.75)).get()
						),
						/*= } =*/
						zIndex: 0 // #1069
					}).add(series.group);
				area.isArea = true;
			}
			area.startX = areaPath.xMap;
			area.shiftUnit = options.step ? 2 : 1;
		});
	},

	drawLegendSymbol: LegendSymbolMixin.drawRectangle
});
