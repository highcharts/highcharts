/**
 * @product.name@ JS v@product.version@ (@product.date@)
 * Highcharts Broken Axis module
 * 
 * Author: Stephane Vanraes, Torstein Honsi
 * License: www.highcharts.com/license
 */

/*global HighchartsAdapter*/
(function (H) {	

	"use strict";

	var pick = H.pick,
		wrap = H.wrap,
		extend = H.extend,
		fireEvent = HighchartsAdapter.fireEvent,
		Axis = H.Axis,
		Series = H.Series;

	function stripArguments() {
		return Array.prototype.slice.call(arguments, 1);
	}

	extend(Axis.prototype, {
		isInBreak: function (brk, val) {
			var repeat = brk.repeat || Infinity,
				from = brk.from,
				length = brk.to - brk.from,
				test = (val >= from ? (val - from) % repeat :  repeat - ((from - val) % repeat));

			if (!brk.inclusive) {
				return (test < length && test !== 0);
			} else {
				return (test <= length);
			}
		},

		isInAnyBreak: function (val, testKeep) {
			// Sanity Check			
			if (!this.options.breaks) { return false; }

			var breaks = this.options.breaks,
				i = breaks.length,
				inbrk = false,
				keep = false;


			while (i--) {
				if (this.isInBreak(breaks[i], val)) {
					inbrk = true;
					if (!keep) {
						keep = pick(breaks[i].showPoints, this.isXAxis ? false : true);
					}
				}
			}

			if (inbrk && testKeep) {
				return inbrk && !keep;
			} else {
				return inbrk;
			}
		}
	});

	wrap(Axis.prototype, 'setTickPositions', function (proceed) {
		proceed.apply(this, Array.prototype.slice.call(arguments, 1));
		
		if (this.options.breaks) {
			var axis = this,
				tickPositions = this.tickPositions,
				info = this.tickPositions.info,
				newPositions = [],
				i;

			if (info && info.totalRange >= axis.closestPointRange) { 
				return;
			}

			for (i = 0; i < tickPositions.length; i++) {
				if (!axis.isInAnyBreak(tickPositions[i])) {
					newPositions.push(tickPositions[i]);
				}
			}

			this.tickPositions = newPositions;
			this.tickPositions.info = info;
		}
	});
	
	wrap(Axis.prototype, 'init', function (proceed, chart, userOptions) {
		// Force Axis to be not-ordinal when breaks are defined
		if (userOptions.breaks && userOptions.breaks.length) {
			userOptions.ordinal = false;
		}

		proceed.call(this, chart, userOptions);

		if (this.options.breaks) {

			var axis = this;
			
			axis.doPostTranslate = true;

			this.val2lin = function (val) {
				var nval = val,
					brk,
					i;

				for (i = 0; i < axis.breakArray.length; i++) {
					brk = axis.breakArray[i];
					if (brk.to <= val) {
						nval -= (brk.len);
					} else if (brk.from >= val) {
						break;
					} else if (axis.isInBreak(brk, val)) {
						nval -= (val - brk.from);
						break;
					}
				}

				return nval;
			};
			
			this.lin2val = function (val) {
				var nval = val,
					brk,
					i;

				for (i = 0; i < axis.breakArray.length; i++) {
					brk = axis.breakArray[i];
					if (brk.from >= nval) {
						break;
					} else if (brk.to < nval) {
						nval += (brk.to - brk.from);
					} else if (axis.isInBreak(brk, nval)) {
						nval += (brk.to - brk.from);
					}
				}

				return nval;
			};

			this.setExtremes = function (newMin, newMax, redraw, animation, eventArguments) {
				// If trying to set extremes inside a break, extend it to before and after the break ( #3857 )
				while (this.isInAnyBreak(newMin)) {
					newMin -= this.closestPointRange;
				}				
				while (this.isInAnyBreak(newMax)) {
					newMax -= this.closestPointRange;
				}
				Axis.prototype.setExtremes.call(this, newMin, newMax, redraw, animation, eventArguments);
			};

			this.setAxisTranslation = function (saveOld) {
				Axis.prototype.setAxisTranslation.call(this, saveOld);

				var breaks = axis.options.breaks,
					breakArrayT = [],	// Temporary one
					breakArray = [],
					length = 0, 
					inBrk,
					repeat,
					brk,
					min = axis.userMin || axis.min,
					max = axis.userMax || axis.max,
					start,
					i,
					j;

				// Min & Max Check
				for (i in breaks) {
					brk = breaks[i];
					if (axis.isInBreak(brk, min)) {
						min += (brk.to % brk.repeat) - (min % brk.repeat);
					}
					if (axis.isInBreak(brk, max)) {
						max -= (max % brk.repeat) - (brk.from % brk.repeat);
					}
				}

				// Construct an array holding all breaks in the axis
				for (i in breaks) {
					brk = breaks[i];
					start = brk.from;
					repeat = brk.repeat || Infinity;

					while (start - repeat > min) {
						start -= repeat;
					}
					while (start < min) {
						start += repeat;
					}

					for (j = start; j < max; j += repeat) {
						breakArrayT.push({
							value: j,
							move: 'in'
						});
						breakArrayT.push({
							value: j + (brk.to - brk.from),
							move: 'out',
							size: brk.breakSize
						});
					}
				}

				breakArrayT.sort(function (a, b) {
					if (a.value === b.value) {
						return (a.move === 'in' ? 0 : 1) - (b.move === 'in' ? 0 : 1);
					} else {
						return a.value - b.value;
					}
				});
				
				// Simplify the breaks
				inBrk = 0;
				start = min;

				for (i in breakArrayT) {
					brk = breakArrayT[i];
					inBrk += (brk.move === 'in' ? 1 : -1);

					if (inBrk === 1 && brk.move === 'in') {
						start = brk.value;
					}
					if (inBrk === 0) {
						breakArray.push({
							from: start,
							to: brk.value,
							len: brk.value - start - (brk.size || 0)
						});
						length += brk.value - start - (brk.size || 0);
					}
				}

				axis.breakArray = breakArray;

				fireEvent(axis, 'afterBreaks');
				
				axis.transA *= ((max - axis.min) / (max - min - length));

				axis.min = min;
				axis.max = max;

			};
		}
	});

	wrap(Series.prototype, 'generatePoints', function (proceed) {

		proceed.apply(this, stripArguments(arguments));

		var series = this,
			xAxis = series.xAxis,
			yAxis = series.yAxis,
			points = series.points,
			point,
			i = points.length;


		if (xAxis && yAxis && (xAxis.options.breaks || yAxis.options.breaks)) {
			while (i--) {
				point = points[i];

				if (xAxis.isInAnyBreak(point.x, true) || yAxis.isInAnyBreak(point.y, true)) {
					points.splice(i, 1);
					this.data[i].destroyElements(); // removes the graphics for this point if they exist
				}
			}
		}

	});

	wrap(H.seriesTypes.column.prototype, 'drawPoints', function (proceed) {
		proceed.apply(this);

		var series = this,
			points = series.points,
			yAxis = series.yAxis,
			breaks = yAxis.breakArray || [],
			point,
			brk,
			i,
			j,
			y;

		for (i = 0; i < points.length; i++) {
			point = points[i];
			y = point.stackY || point.y;
			for (j = 0; j < breaks.length; j++) {
				brk = breaks[j];
				if (y < brk.from) {
					break;
				} else if (y > brk.to) {
					fireEvent(yAxis, 'pointBreak', {point: point, brk: brk});
				} else {
					fireEvent(yAxis, 'pointInBreak', {point: point, brk: brk});
				}
			}
		}

	});
}(Highcharts));
