
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
					i;
				
				// apply the ordinal logic
				if (axis.options.ordinal) {
					
					each(axis.series, function (series, i) {
						
						if (series.visible !== false) {
							
							// concatenate the processed X data into the existing positions, or the empty array 
							ordinalPositions = ordinalPositions.concat(series.processedXData);
							len = ordinalPositions.length;
							
							// if we're dealing with more than one series, remove duplicates
							if (i && len) {
							
								ordinalPositions.sort(function (a, b) {
									return a - b; // without a custom function it is sorted as strings
								});
							
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
					
					// record the slope and offset to compute the linear values from the array index
					if (useOrdinal) {
						axis.ordinalSlope = (ordinalPositions[len - 1] - ordinalPositions[0]) / (len - 1);
						axis.ordinalOffset = ordinalPositions[0];					
						axis.ordinalPositions = ordinalPositions;
					
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
						if (val > ordinalPositions[i]) { // interpolate
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
						ordinalPositions[i] + distance * (ordinalPositions[i + 1] - ordinalPositions[i]) : 
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
							chart: chart
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
			 * Make the tick intervals closer because the ordinal gaps make the ticks spread out or cluster
			 */
			xAxis.postProcessTickInterval = function (tickInterval) {
				var ordinalSlope = this.ordinalSlope;
				
				return ordinalSlope ? 
					tickInterval / (ordinalSlope / xAxis.closestPointRange) : 
					tickInterval;
			};
			
			/**
			 * Post process tick positions. The tickPositions array is altered. Don't show ticks 
			 * within a gap in the ordinal axis, where the space between
			 * two points is greater than a portion of the tick pixel interval
			 */
			addEvent(xAxis, 'afterSetTickPositions', function (e) {
				
				var options = xAxis.options,
					tickPixelIntervalOption = options.tickPixelInterval,
					tickPositions = e.tickPositions;
				
				if (xAxis.ordinalPositions && defined(tickPixelIntervalOption)) { // check for squashed ticks
					var i = tickPositions.length,
						translated,
						lastTranslated,
						tickInfo = tickPositions.info,
						higherRanks = tickInfo ? tickInfo.higherRanks : [];
					
					while (i--) {
						translated = xAxis.translate(tickPositions[i]);
						
						// remove ticks that are closer than 0.6 times the pixel interval from the one to the right 
						if (lastTranslated && lastTranslated - translated < tickPixelIntervalOption * 0.6) {
							
							
							tickPositions.splice(
								// is this a higher ranked position with a normal position to the right?
								higherRanks[tickPositions[i]] && !higherRanks[tickPositions[i + 1]] ?
									// yes: remove the lower ranked neighbour to the right
									i + 1 :
									// no: remove this one
									i,
								1
							);
						} else {
							lastTranslated = translated;
						}
					}
				}
			});
			
			
			/**
			 * Overrride the chart.pan method for ordinal axes. 
			 */
			
			var baseChartPan = chart.pan;
			chart.pan = function (chartX) {
				var xAxis = chart.xAxis[0],
					runBase = false;
				if (xAxis.options.ordinal) {
					
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
							xAxis.setExtremes(newMin, newMax, true, false);
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
			gapSize = series.options.gapSize;
	
		// call base method
		baseGetSegments.apply(series);
		
		if (series.xAxis.options.ordinal && gapSize) {
		
			// properties
			segments = series.segments;
			
			// extension for ordinal breaks
			each(segments, function (segment, no) {
				var i = segment.length - 1;
				while (i--) {
					if (segment[i + 1].x - segment[i].x > series.xAxis.closestPointRange * gapSize) {
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