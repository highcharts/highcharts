/**
 * A wrapper for Chart with all the default values for a Stock chart
 */
Highcharts.StockChart = function (options, callback) {
	var seriesOptions = options.series, // to increase performance, don't merge the data 
		opposite,
		lineOptions = {

			marker: {
				enabled: false,
				states: {
					hover: {
						enabled: true,
						radius: 5
					}
				}
			},
			gapSize: 5,
			shadow: false,
			states: {
				hover: {
					lineWidth: 2
				}
			},
			dataGrouping: {
				enabled: true
			}
		};

	// apply X axis options to both single and multi y axes
	options.xAxis = map(splat(options.xAxis || {}), function (xAxisOptions) {
		return merge({ // defaults
				gapGridLineWidth: 1,
				gapGridLineColor: 'silver',
				minPadding: 0,
				maxPadding: 0,
				title: {
					text: null
				},
				showLastLabel: true
			}, xAxisOptions, // user options 
			{ // forced options
				type: 'datetime',
				categories: null
			});
	});

	// apply Y axis options to both single and multi y axes
	options.yAxis = map(splat(options.yAxis || {}), function (yAxisOptions) {
		opposite = yAxisOptions.opposite;
		return merge({ // defaults
			labels: {
				align: opposite ? 'right' : 'left',
				x: opposite ? -2 : 2,
				y: -2
			},
			showLastLabel: false,
			title: {
				text: null
			}
		}, yAxisOptions // user options
		);
	});

	options.series = null;

	options = merge({
		chart: {
			panning: true
		},
		navigator: {
			enabled: true
		},
		scrollbar: {
			enabled: true
		},
		rangeSelector: {
			enabled: true
		},
		title: {
			text: null
		},
		tooltip: {
			shared: true,
			crosshairs: true
		},
		legend: {
			enabled: false
		},

		plotOptions: {
			line: lineOptions,
			spline: lineOptions,
			area: lineOptions,
			areaspline: lineOptions,
			column: {
				shadow: false,
				borderWidth: 0,
				dataGrouping: {
					enabled: true
				}
			}
		}

	},
	options, // user's options

	{ // forced options
		chart: {
			inverted: false
		}
	});

	options.series = seriesOptions;


	return new Chart(options, callback);
};


/* ****************************************************************************
 * Start value compare logic                                                  *
 *****************************************************************************/
 
var seriesInit = seriesProto.init, 
	seriesProcessData = seriesProto.processData,
	pointTooltipFormatter = Point.prototype.tooltipFormatter;
	
/**
 * Extend series.init by adding a method to modify the y value used for plotting
 * on the y axis. This method is called both from the axis when finding dataMin
 * and dataMax, and from the series.translate method.
 */
seriesProto.init = function () {
	
	// call base method
	seriesInit.apply(this, arguments);
	
	// local variables
	var series = this,
		compare = series.options.compare;
	
	if (compare) {
		series.modifyValue = function (value, point) {
			var compareValue = this.compareValue;
			
			// get the modified value
			value = compare === 'value' ? 
				value - compareValue : // compare value
				value = 100 * (value / compareValue) - 100; // compare percent
				
			// record for tooltip etc.
			if (point) {
				point.change = value;
			}
			
			return value;
		};
	}	
};

/**
 * Extend series.processData by finding the first y value in the plot area,
 * used for comparing the following values 
 */
seriesProto.processData = function () {
	var series = this;
	
	// call base method
	seriesProcessData.apply(this);
	
	if (series.options.compare) {
		
		// local variables
		var i = 0,
			processedXData = series.processedXData,
			processedYData = series.processedYData,
			length = processedYData.length,
			min = series.xAxis.getExtremes().min;
		
		// find the first value for comparison
		for (; i < length; i++) {
			if (typeof processedYData[i] === NUMBER && processedXData[i] >= min) {
				series.compareValue = processedYData[i];
				break;
			}
		}
	}
};

/**
 * Extend the tooltip formatter by adding support for the point.change variable
 * as well as the changeDecimals option
 */
Point.prototype.tooltipFormatter = function (pointFormat) {
	var point = this;
	
	pointFormat = pointFormat.replace(
		'{point.change}',
		(point.change > 0 ? '+' : '') + numberFormat(point.change, point.series.tooltipOptions.changeDecimals || 2)
	); 
	
	return pointTooltipFormatter.apply(this, [pointFormat]);
};

/* ****************************************************************************
 * End value compare logic                                                    *
 *****************************************************************************/


/* ****************************************************************************
 * Start ordinal axis logic                                                   *
 *****************************************************************************/

(function() {
	var baseInit = seriesProto.init,
		baseProcessData = seriesProto.processData,
		baseGetSegments = seriesProto.getSegments;
		
	seriesProto.init = function() {
		var series = this,
			xAxis;
		
		// call base method
		baseInit.apply(series, arguments);
		
		// xAxis is set in base init
		xAxis = series.xAxis;
		
		if (xAxis && xAxis.options.ordinal && !xAxis.hasOrdinalExtension) {
				
			xAxis.hasOrdinalExtension = true;
		
			/**
			 * Calculate the ordinal positions before tick positions are calculated. 
			 * TODO: When we rewrite Axis to use a prototype model, this should be implemented
			 * as a method extension to avoid overhead in the core.
			 */
			xAxis.beforeSetTickPositions = function() {
				var len,
					ordinalPositions = [],
					useOrdinal = false,
					dist;
				
				// apply the ordinal logic
				if (xAxis.options.ordinal) {
					
					each (xAxis.series, function(series, i) {
					
						// concatenate the processed X data into the existing positions, or the empty array 
						ordinalPositions = ordinalPositions.concat(series.processedXData);
						
						// if we're dealing with more than one series, remove duplicates
						if (i) {
						
							ordinalPositions.sort(function(a, b) {
								return a - b; // without a custom function it is sorted as strings
							});
						
							i = ordinalPositions.length - 1;
							while (i--) {
								if (ordinalPositions[i] === ordinalPositions[i + 1]) {
									ordinalPositions.splice(i, 1);
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
						xAxis.ordinalSlope = (ordinalPositions[len - 1] - ordinalPositions[0]) / (len - 1);
						xAxis.ordinalOffset = ordinalPositions[0];					
						xAxis.ordinalPositions = ordinalPositions;
					
					} else {
						xAxis.ordinalPositions = UNDEFINED;
					}
				}
			};
			
			/**
			 * Translate from a linear axis value to the corresponding ordinal axis position. If there
			 * are no gaps in the ordinal axis this will be the same. The translated value is the value
			 * that the point would have if the axis were linear, using the same min and max.
			 */
			xAxis.val2lin = function (val) {
				
				var ordinalPositions = xAxis.ordinalPositions;
				
				if (!ordinalPositions) {
					return val;
				
				} else {
				
					var ordinalPositions = ordinalPositions,
						ordinalLength = ordinalPositions.length,
						i,
						lastN,
						distance,
						closest,
						ordinalIndex;
						
					// first look for an exact match in the ordinalpositions array
					i = ordinalLength;
					while (ordinalIndex === UNDEFINED && i--) {
						if (ordinalPositions[i] === val) {
							ordinalIndex = i;
						}
					}
					
					// if that failed, find the intermediate position between the two nearest values
					i = ordinalLength - 1;
					while (ordinalIndex === UNDEFINED && i--) {
						if (val > ordinalPositions[i]) { // interpolate
							distance = (val - ordinalPositions[i]) / (ordinalPositions[i + 1] - ordinalPositions[i]); // something between 0 and 1
							ordinalIndex = i + distance;
						}
					}
					
					return xAxis.ordinalSlope * (ordinalIndex || 0) + xAxis.ordinalOffset;
				}
			};
			
			/**
			 * Translate from linear (internal) to axis value
			 */
			xAxis.lin2val = function (val) {
				
				var ordinalPositions = xAxis.ordinalPositions;
				
				if (!ordinalPositions) {
					return val;
				
				} else {
				
					var ordinalSlope = xAxis.ordinalSlope,
						ordinalOffset = xAxis.ordinalOffset,
						i = ordinalPositions.length - 1,
						linearEquivalentLeft,
						linearEquivalentRight,
						ret = val,
						distance;
						
					// Loop down along the ordinal positions. When the linear equivalent of i matches
					// an ordinal position, interpolate between the left and right values.
					while (i--) {
						linearEquivalentLeft = (ordinalSlope * i) + ordinalOffset;
						if (val > linearEquivalentLeft) {
							linearEquivalentRight = (ordinalSlope * (i + 1)) + ordinalOffset;
							distance = (val - linearEquivalentLeft) / (linearEquivalentRight - linearEquivalentLeft); // something between 0 and 1
							ret = ordinalPositions[i] + distance * (ordinalPositions[i + 1] - ordinalPositions[i]);
							break;
						}
					}
					return ret;
				}
			};
			
			/**
			 * Make the tick intervals closer because the ordinal gaps make the ticks spread out or cluster
			 */
			xAxis.postProcessTickInterval = function (tickInterval) {					
				return tickInterval / (xAxis.ordinalSlope / xAxis.closestPointRange);
			};
			
			/**
			 * Post process tick positions. The tickPositions array is altered. Don't show ticks 
			 * within a gap in the ordinal axis, where the space between
			 * two points is greater than a portion of the tick pixel interval
			 */
			addEvent(xAxis, 'afterSetTickPositions', function(e) {
				
				var options = xAxis.options,
					tickPixelIntervalOption = options.tickPixelInterval,
					tickPositions = e.tickPositions,
					gaps = {};
				
				if (defined(tickPixelIntervalOption)) { // check for squashed ticks
					var i = tickPositions.length,
						translated,
						lastTranslated,
						tickInfo = tickPositions.info,
						higherRanks = tickInfo ? tickInfo.higherRanks : [];
					
					while (i--) {
						translated = xAxis.translate(tickPositions[i]);
						
						// remove ticks that are closer than 0.3 times the pixel interval from the one to the right 
						if (lastTranslated && lastTranslated - translated < tickPixelIntervalOption * 0.3) {
							
							
							tickPositions.splice(
								// is this a higher ranked position with a normal position to the right?
								higherRanks[tickPositions[i]] && !higherRanks[tickPositions[i + 1]] ?
									// yes: remove the lower ranked neighbour to the right
									i + 1 :
									// no: remove this one
									i,
							1);
							
							// when tick positions are removed, register the next one to the right or with higher rank
							// so that we can add a grid line to ticks 
							if (i) { // don't mark the first tick 
								gaps[tickPositions[i]] = 1;
							}
						} else {
							lastTranslated = translated;
						}
					}
					
					// register gaps on the tickPositions array and overwrite previous gaps
					tickPositions.gaps = gaps;
				}
			});
		}
	};
			
	/**
	 * Extend getSegments by identifying gaps in the ordinal data so that we can draw a gap in the 
	 * line or area
	 */
	seriesProto.getSegments = function() {
		
		var series = this,
			segments,
			gapSize = series.options.gapSize;
	
		// call base method
		baseGetSegments.apply(series);
		
		if (gapSize) {
		
			// properties
			segments = series.segments;
			
			// extension for ordinal breaks
			each (segments, function(segment, no) {
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
})();

/* ****************************************************************************
 * End ordinal axis logic                                                   *
 *****************************************************************************/