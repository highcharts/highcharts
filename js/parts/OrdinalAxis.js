
/* ****************************************************************************
 * Start ordinal axis logic                                                   *
 *****************************************************************************/

(function () {
	var baseInit = seriesProto.init,
		baseGetSegments = seriesProto.getSegments;
		
	seriesProto.init = function () {
		var series = this,
			chart,
			xAxis;
		
		// call base method
		baseInit.apply(series, arguments);
		
		// chart and xAxis are set in base init
		chart = series.chart;
		xAxis = series.xAxis;
		
		// Destroy the extended ordinal index on updated data
		if (xAxis && xAxis.options.ordinal) {
			addEvent(series, 'updatedData', function () {
				delete xAxis.ordinalIndex;
			});
		}
		
		/**
		 * Extend the ordinal axis object. If we rewrite the axis object to a prototype model,
		 * we should add these properties to the prototype instead.
		 */
		if (xAxis && xAxis.options.ordinal && !xAxis.hasOrdinalExtension) {
				
			xAxis.hasOrdinalExtension = true;
		
			/**
			 * Calculate the ordinal positions before tick positions are calculated. 
			 * TODO: When we rewrite Axis to use a prototype model, this should be implemented
			 * as a method extension to avoid overhead in the core.
			 */
			xAxis.beforeSetTickPositions = function () {
				var axis = this,
					len,
					ordinalPositions = [],
					useOrdinal = false,
					dist,
					extremes = axis.getExtremes(),
					min = extremes.min,
					max = extremes.max,
					minIndex,
					maxIndex,
					slope,
					i;
				
				// apply the ordinal logic
				if (axis.options.ordinal) {
					
					each(axis.series, function (series, i) {
						
						if (series.visible !== false && series.takeOrdinalPosition !== false) {
							
							// concatenate the processed X data into the existing positions, or the empty array 
							ordinalPositions = ordinalPositions.concat(series.processedXData);
							len = ordinalPositions.length;
							
							// remove duplicates (#1588)
							ordinalPositions.sort(function (a, b) {
								return a - b; // without a custom function it is sorted as strings
							});
							
							if (len) {
								i = len - 1;
								while (i--) {
									if (ordinalPositions[i] === ordinalPositions[i + 1]) {
										ordinalPositions.splice(i, 1);
									}
								}
							}
						}
						
					});
					
					// cache the length
					len = ordinalPositions.length;					
					
					// Check if we really need the overhead of mapping axis data against the ordinal positions.
					// If the series consist of evenly spaced data any way, we don't need any ordinal logic.
					if (len > 2) { // two points have equal distance by default
						dist = ordinalPositions[1] - ordinalPositions[0]; 
						i = len - 1;
						while (i-- && !useOrdinal) {
							if (ordinalPositions[i + 1] - ordinalPositions[i] !== dist) {
								useOrdinal = true;
							}
						}
					}
					
					// Record the slope and offset to compute the linear values from the array index.
					// Since the ordinal positions may exceed the current range, get the start and 
					// end positions within it (#719, #665b)
					if (useOrdinal) {
						
						// Register
						axis.ordinalPositions = ordinalPositions;
						
						// This relies on the ordinalPositions being set
						minIndex = xAxis.val2lin(min, true);
						maxIndex = xAxis.val2lin(max, true);
				
						// Set the slope and offset of the values compared to the indices in the ordinal positions
						axis.ordinalSlope = slope = (max - min) / (maxIndex - minIndex);
						axis.ordinalOffset = min - (minIndex * slope);
						
					} else {
						axis.ordinalPositions = axis.ordinalSlope = axis.ordinalOffset = UNDEFINED;
					}
				}
			};
			
			/**
			 * Translate from a linear axis value to the corresponding ordinal axis position. If there
			 * are no gaps in the ordinal axis this will be the same. The translated value is the value
			 * that the point would have if the axis were linear, using the same min and max.
			 * 
			 * @param Number val The axis value
			 * @param Boolean toIndex Whether to return the index in the ordinalPositions or the new value
			 */
			xAxis.val2lin = function (val, toIndex) {
				
				var axis = this,
					ordinalPositions = axis.ordinalPositions;
				
				if (!ordinalPositions) {
					return val;
				
				} else {
				
					var ordinalLength = ordinalPositions.length,
						i,
						distance,
						ordinalIndex;
						
					// first look for an exact match in the ordinalpositions array
					i = ordinalLength;
					while (i--) {
						if (ordinalPositions[i] === val) {
							ordinalIndex = i;
							break;
						}
					}
					
					// if that failed, find the intermediate position between the two nearest values
					i = ordinalLength - 1;
					while (i--) {
						if (val > ordinalPositions[i] || i === 0) { // interpolate
							distance = (val - ordinalPositions[i]) / (ordinalPositions[i + 1] - ordinalPositions[i]); // something between 0 and 1
							ordinalIndex = i + distance;
							break;
						}
					}
					return toIndex ?
						ordinalIndex :
						axis.ordinalSlope * (ordinalIndex || 0) + axis.ordinalOffset;
				}
			};
			
			/**
			 * Translate from linear (internal) to axis value
			 * 
			 * @param Number val The linear abstracted value
			 * @param Boolean fromIndex Translate from an index in the ordinal positions rather than a value
			 */
			xAxis.lin2val = function (val, fromIndex) {
				var axis = this,
					ordinalPositions = axis.ordinalPositions;
				
				if (!ordinalPositions) { // the visible range contains only equally spaced values
					return val;
				
				} else {
				
					var ordinalSlope = axis.ordinalSlope,
						ordinalOffset = axis.ordinalOffset,
						i = ordinalPositions.length - 1,
						linearEquivalentLeft,
						linearEquivalentRight,
						distance;
						
					
					// Handle the case where we translate from the index directly, used only 
					// when panning an ordinal axis
					if (fromIndex) {
						
						if (val < 0) { // out of range, in effect panning to the left
							val = ordinalPositions[0];
						} else if (val > i) { // out of range, panning to the right
							val = ordinalPositions[i];
						} else { // split it up
							i = mathFloor(val);
							distance = val - i; // the decimal
						}
						
					// Loop down along the ordinal positions. When the linear equivalent of i matches
					// an ordinal position, interpolate between the left and right values.
					} else {
						while (i--) {
							linearEquivalentLeft = (ordinalSlope * i) + ordinalOffset;
							if (val >= linearEquivalentLeft) {
								linearEquivalentRight = (ordinalSlope * (i + 1)) + ordinalOffset;
								distance = (val - linearEquivalentLeft) / (linearEquivalentRight - linearEquivalentLeft); // something between 0 and 1
								break;
							}
						}
					}
					
					// If the index is within the range of the ordinal positions, return the associated
					// or interpolated value. If not, just return the value
					return distance !== UNDEFINED && ordinalPositions[i] !== UNDEFINED ?
						ordinalPositions[i] + (distance ? distance * (ordinalPositions[i + 1] - ordinalPositions[i]) : 0) : 
						val;
				}
			};
			
			/**
			 * Get the ordinal positions for the entire data set. This is necessary in chart panning
			 * because we need to find out what points or data groups are available outside the 
			 * visible range. When a panning operation starts, if an index for the given grouping
			 * does not exists, it is created and cached. This index is deleted on updated data, so
			 * it will be regenerated the next time a panning operation starts.
			 */
			xAxis.getExtendedPositions = function () {
				var grouping = xAxis.series[0].currentDataGrouping,
					ordinalIndex = xAxis.ordinalIndex,
					key = grouping ? grouping.count + grouping.unitName : 'raw',
					extremes = xAxis.getExtremes(),
					fakeAxis,
					fakeSeries;
					
				// If this is the first time, or the ordinal index is deleted by updatedData,
				// create it.
				if (!ordinalIndex) {
					ordinalIndex = xAxis.ordinalIndex = {};
				}
				
				
				if (!ordinalIndex[key]) {
					
					// Create a fake axis object where the extended ordinal positions are emulated
					fakeAxis = {
						series: [],
						getExtremes: function () {
							return {
								min: extremes.dataMin,
								max: extremes.dataMax
							};
						},
						options: {
							ordinal: true
						}
					};
					
					// Add the fake series to hold the full data, then apply processData to it
					each(xAxis.series, function (series) {
						fakeSeries = {
							xAxis: fakeAxis,
							xData: series.xData,
							chart: chart,
							destroyGroupedData: noop
						};
						fakeSeries.options = {
							dataGrouping : grouping ? {
								enabled: true,
								forced: true,
								approximation: 'open', // doesn't matter which, use the fastest
								units: [[grouping.unitName, [grouping.count]]]
							} : {
								enabled: false
							}
						};
						series.processData.apply(fakeSeries);
						
						fakeAxis.series.push(fakeSeries);
					});
					
					// Run beforeSetTickPositions to compute the ordinalPositions
					xAxis.beforeSetTickPositions.apply(fakeAxis);
					
					// Cache it
					ordinalIndex[key] = fakeAxis.ordinalPositions;
				}
				return ordinalIndex[key];
			};
			
			/**
			 * Find the factor to estimate how wide the plot area would have been if ordinal
			 * gaps were included. This value is used to compute an imagined plot width in order
			 * to establish the data grouping interval. 
			 * 
			 * A real world case is the intraday-candlestick
			 * example. Without this logic, it would show the correct data grouping when viewing
			 * a range within each day, but once moving the range to include the gap between two
			 * days, the interval would include the cut-away night hours and the data grouping
			 * would be wrong. So the below method tries to compensate by identifying the most
			 * common point interval, in this case days. 
			 * 
			 * An opposite case is presented in issue #718. We have a long array of daily data,
			 * then one point is appended one hour after the last point. We expect the data grouping
			 * not to change.
			 * 
			 * In the future, if we find cases where this estimation doesn't work optimally, we
			 * might need to add a second pass to the data grouping logic, where we do another run
			 * with a greater interval if the number of data groups is more than a certain fraction
			 * of the desired group count.
			 */
			xAxis.getGroupIntervalFactor = function (xMin, xMax, processedXData) {
				var i = 0,
					len = processedXData.length, 
					distances = [],
					median;
					
				// Register all the distances in an array
				for (; i < len - 1; i++) {
					distances[i] = processedXData[i + 1] - processedXData[i];
				}
				
				// Sort them and find the median
				distances.sort(function (a, b) {
					return a - b;
				});
				median = distances[mathFloor(len / 2)];
				
				// Compensate for series that don't extend through the entire axis extent. #1675.
				xMin = mathMax(xMin, processedXData[0]);
				xMax = mathMin(xMax, processedXData[len - 1]);

				// Return the factor needed for data grouping
				return (len * median) / (xMax - xMin);
			};
			
			/**
			 * Make the tick intervals closer because the ordinal gaps make the ticks spread out or cluster
			 */
			xAxis.postProcessTickInterval = function (tickInterval) {
				// TODO: http://jsfiddle.net/highcharts/FQm4E/1/
				// This is a case where this algorithm doesn't work optimally. In this case, the 
				// tick labels are spread out per week, but all the gaps reside within weeks. So 
				// we have a situation where the labels are courser than the ordinal gaps, and 
				// thus the tick interval should not be altered				
				var ordinalSlope = this.ordinalSlope;
				
				return ordinalSlope ? 
					tickInterval / (ordinalSlope / xAxis.closestPointRange) : 
					tickInterval;
			};
			
			/**
			 * In an ordinal axis, there might be areas with dense consentrations of points, then large
			 * gaps between some. Creating equally distributed ticks over this entire range
			 * may lead to a huge number of ticks that will later be removed. So instead, break the 
			 * positions up in segments, find the tick positions for each segment then concatenize them.
			 * This method is used from both data grouping logic and X axis tick position logic. 
			 */
			xAxis.getNonLinearTimeTicks = function (normalizedInterval, min, max, startOfWeek, positions, closestDistance, findHigherRanks) {
				
				var start = 0,
					end = 0,
					segmentPositions,
					higherRanks = {},
					hasCrossedHigherRank,
					info,
					posLength,
					outsideMax,
					groupPositions = [],
					lastGroupPosition = -Number.MAX_VALUE,
					tickPixelIntervalOption = xAxis.options.tickPixelInterval;
					
				// The positions are not always defined, for example for ordinal positions when data
				// has regular interval (#1557)
				if (!positions || positions.length === 1 || min === UNDEFINED) {
					return getTimeTicks(normalizedInterval, min, max, startOfWeek);
				}
				
				// Analyze the positions array to split it into segments on gaps larger than 5 times
				// the closest distance. The closest distance is already found at this point, so 
				// we reuse that instead of computing it again.
				posLength = positions.length;
				for (; end < posLength; end++) {
					
					outsideMax = end && positions[end - 1] > max;
					
					if (positions[end] < min) { // Set the last position before min
						start = end;						
					}
					
					if (end === posLength - 1 || positions[end + 1] - positions[end] > closestDistance * 5 || outsideMax) {
						
						// For each segment, calculate the tick positions from the getTimeTicks utility
						// function. The interval will be the same regardless of how long the segment is.
						if (positions[end] > lastGroupPosition) { // #1475
							segmentPositions = getTimeTicks(normalizedInterval, positions[start], positions[end], startOfWeek);
							
							// Prevent duplicate groups, for example for multiple segments within one larger time frame (#1475)
							while (segmentPositions.length && segmentPositions[0] <= lastGroupPosition) {
								segmentPositions.shift();
							}
							if (segmentPositions.length) {
								lastGroupPosition = segmentPositions[segmentPositions.length - 1];
							}
							
							groupPositions = groupPositions.concat(segmentPositions);
						}
						// Set start of next segment
						start = end + 1;						
					}
					
					if (outsideMax) {
						break;
					}
				}
				
				// Get the grouping info from the last of the segments. The info is the same for
				// all segments.
				info = segmentPositions.info;
				
				// Optionally identify ticks with higher rank, for example when the ticks
				// have crossed midnight.
				if (findHigherRanks && info.unitRange <= timeUnits[HOUR]) {
					end = groupPositions.length - 1;
					
					// Compare points two by two
					for (start = 1; start < end; start++) {
						if (new Date(groupPositions[start])[getDate]() !== new Date(groupPositions[start - 1])[getDate]()) {
							higherRanks[groupPositions[start]] = DAY;
							hasCrossedHigherRank = true;
						}
					}
					
					// If the complete array has crossed midnight, we want to mark the first
					// positions also as higher rank
					if (hasCrossedHigherRank) {
						higherRanks[groupPositions[0]] = DAY;
					}
					info.higherRanks = higherRanks;
				}
				
				// Save the info
				groupPositions.info = info;
				
				
				
				// Don't show ticks within a gap in the ordinal axis, where the space between
				// two points is greater than a portion of the tick pixel interval
				if (findHigherRanks && defined(tickPixelIntervalOption)) { // check for squashed ticks
					
					var length = groupPositions.length,
						i = length,
						itemToRemove,
						translated,
						translatedArr = [],
						lastTranslated,
						medianDistance,
						distance,
						distances = [];
						
					// Find median pixel distance in order to keep a reasonably even distance between
					// ticks (#748)
					while (i--) {
						translated = xAxis.translate(groupPositions[i]);
						if (lastTranslated) {
							distances[i] = lastTranslated - translated;
						}
						translatedArr[i] = lastTranslated = translated; 
					}
					distances.sort();
					medianDistance = distances[mathFloor(distances.length / 2)];
					if (medianDistance < tickPixelIntervalOption * 0.6) {
						medianDistance = null;
					}
					
					// Now loop over again and remove ticks where needed
					i = groupPositions[length - 1] > max ? length - 1 : length; // #817
					lastTranslated = undefined;
					while (i--) {
						translated = translatedArr[i];
						distance = lastTranslated - translated;
	
						// Remove ticks that are closer than 0.6 times the pixel interval from the one to the right,
						// but not if it is close to the median distance (#748).
						if (lastTranslated && distance < tickPixelIntervalOption * 0.8 && 
								(medianDistance === null || distance < medianDistance * 0.8)) {
							
							// Is this a higher ranked position with a normal position to the right?
							if (higherRanks[groupPositions[i]] && !higherRanks[groupPositions[i + 1]]) {
								
								// Yes: remove the lower ranked neighbour to the right
								itemToRemove = i + 1;
								lastTranslated = translated; // #709
								
							} else {
								
								// No: remove this one
								itemToRemove = i;
							}
							
							groupPositions.splice(itemToRemove, 1);
							
						} else {
							lastTranslated = translated;
						}
					}
				}
				return groupPositions;
			};
			
			
			/**
			 * Overrride the chart.pan method for ordinal axes. 
			 */
			
			var baseChartPan = chart.pan;
			chart.pan = function (chartX) {
				var xAxis = chart.xAxis[0],
					runBase = false;
				if (xAxis.options.ordinal && xAxis.series.length) {
					
					var mouseDownX = chart.mouseDownX,
						extremes = xAxis.getExtremes(),
						dataMax = extremes.dataMax,
						min = extremes.min,
						max = extremes.max,
						newMin,
						newMax,
						hoverPoints = chart.hoverPoints,
						closestPointRange = xAxis.closestPointRange,
						pointPixelWidth = xAxis.translationSlope * (xAxis.ordinalSlope || closestPointRange),
						movedUnits = (mouseDownX - chartX) / pointPixelWidth, // how many ordinal units did we move?
						extendedAxis = { ordinalPositions: xAxis.getExtendedPositions() }, // get index of all the chart's points
						ordinalPositions,
						searchAxisLeft,
						lin2val = xAxis.lin2val,
						val2lin = xAxis.val2lin,
						searchAxisRight;
					
					if (!extendedAxis.ordinalPositions) { // we have an ordinal axis, but the data is equally spaced
						runBase = true;
					
					} else if (mathAbs(movedUnits) > 1) {
						
						// Remove active points for shared tooltip
						if (hoverPoints) {
							each(hoverPoints, function (point) {
								point.setState();
							});
						}
						
						if (movedUnits < 0) {
							searchAxisLeft = extendedAxis;
							searchAxisRight = xAxis.ordinalPositions ? xAxis : extendedAxis;
						} else {
							searchAxisLeft = xAxis.ordinalPositions ? xAxis : extendedAxis;
							searchAxisRight = extendedAxis;
						}
						
						// In grouped data series, the last ordinal position represents the grouped data, which is 
						// to the left of the real data max. If we don't compensate for this, we will be allowed
						// to pan grouped data series passed the right of the plot area. 
						ordinalPositions = searchAxisRight.ordinalPositions;
						if (dataMax > ordinalPositions[ordinalPositions.length - 1]) {
							ordinalPositions.push(dataMax);
						}
						
						// Get the new min and max values by getting the ordinal index for the current extreme, 
						// then add the moved units and translate back to values. This happens on the 
						// extended ordinal positions if the new position is out of range, else it happens
						// on the current x axis which is smaller and faster.
						newMin = lin2val.apply(searchAxisLeft, [
							val2lin.apply(searchAxisLeft, [min, true]) + movedUnits, // the new index 
							true // translate from index
						]);
						newMax = lin2val.apply(searchAxisRight, [
							val2lin.apply(searchAxisRight, [max, true]) + movedUnits, // the new index 
							true // translate from index
						]);
						
						// Apply it if it is within the available data range
						if (newMin > mathMin(extremes.dataMin, min) && newMax < mathMax(dataMax, max)) {
							xAxis.setExtremes(newMin, newMax, true, false, { trigger: 'pan' });
						}
				
						chart.mouseDownX = chartX; // set new reference for next run
						css(chart.container, { cursor: 'move' });
					}
				
				} else {
					runBase = true;
				}
				
				// revert to the linear chart.pan version
				if (runBase) {
					baseChartPan.apply(chart, arguments);
				}
			}; 
		}
	};
			
	/**
	 * Extend getSegments by identifying gaps in the ordinal data so that we can draw a gap in the 
	 * line or area
	 */
	seriesProto.getSegments = function () {
		
		var series = this,
			segments,
			gapSize = series.options.gapSize,
			xAxis = series.xAxis;
	
		// call base method
		baseGetSegments.apply(series);
			
		if (xAxis.options.ordinal && gapSize) { // #1794
		
			// properties
			segments = series.segments;
			
			// extension for ordinal breaks
			each(segments, function (segment, no) {
				var i = segment.length - 1;
				while (i--) {
					if (segment[i + 1].x - segment[i].x > xAxis.closestPointRange * gapSize) {
						segments.splice( // insert after this one
							no + 1,
							0,
							segment.splice(i + 1, segment.length - i)
						);
					}
				}
			});
		}
	};
}());

/* ****************************************************************************
 * End ordinal axis logic                                                   *
 *****************************************************************************/