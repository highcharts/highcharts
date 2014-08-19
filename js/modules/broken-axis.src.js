/**
 * Highcharts Broken Axis plugin
 * 
 * Author: Torstein Honsi
 * License: MIT License
 *
 * Demo: http://jsfiddle.net/highcharts/Vf3yT/
 */

/*global HighchartsAdapter*/
(function (H) {	

	"use strict";

	var noop = function () {},
		floor = Math.floor,
		each = H.each,
		pick = H.pick,
		wrap = H.wrap,
		extend = H.extend,
 		fireEvent = HighchartsAdapter.fireEvent,
		Axis = H.Axis,
		Series = H.Series,
		noop = function () {};

	extend(Axis.prototype, {
		isInBreak: function (brk, val) {
			var	repeat = brk.repeat || Infinity,
				val = val % repeat,
				val2 = val + repeat,
				from = brk.from % repeat,
				to = from + (brk.to - brk.from);

			return ((val > from && val < to) || (val2 > from && val2 < to));
		},

		isInAnyBreak: function (val) {			
			if (!this.options.breaks) { return false; }
			
			var breaks = this.options.breaks,
				i = breaks.length;

			while (i--) {
				if (this.isInBreak(breaks[i], val)) {
					return true;
				}
			}
			return false
		}
	});
/*
	wrap(Axis.prototype, 'setTickPositions', function (proceed) {
		proceed.apply(this, Array.prototype.slice.call(arguments, 1));
		
		var axis = this,
			tickPositions = this.tickPositions,
			info = this.tickPositions.info,
			newPositions = [],
			i;

		for (i=0; i < tickPositions.length; i++) {
			if (!axis.isInAnyBreak(tickPositions[i])) {
				newPositions.push(tickPositions[i]);
			}
		}

		this.tickPositions = newPositions;
		this.tickPositions.info = info;
	});
*/
	
	wrap(Axis.prototype, 'init', function (proceed, chart, userOptions) {

		proceed.call(this, chart, userOptions);

		var axis = this;
		
		if (this.options.breaks) {
			var axis = this;
			axis.postTranslate = true;

			this.val2lin = function (val) {
				return val - axis.shifts[val];
			};
			
			this.lin2val = function (val) {
				return val + axis.shifts[val];
			};
			
			this.setAxisTranslation = function (saveOld) {
				Axis.prototype.setAxisTranslation.call(this, saveOld);
				
				var breaks = axis.options.breaks,
					brkPoints = axis.breakPoints = [],
					shifts = axis.shifts = {},
					min = Math.round(axis.userMin || axis.min),
					max = Math.round(axis.userMax || axis.max),
					shift = 0,
					inbrk = false,
					i;

				for (i = min; i <= max; i += axis.closestPointRange) {
					if (axis.isInAnyBreak(i)) {
						shift += axis.closestPointRange;
						inbrk = true;
					} else if (inbrk) { 
						shift += axis.closestPointRange;
						inbrk = false;
					}
					shifts[i] = shift;
				}

				var pre = null;
				
				inbrk = true;

				for (i in shifts) {
					if (shifts[i] == shifts[pre] && inbrk) {
						brkPoints.push(pre);
						inbrk = false;
					} else if (shifts[i] !== shifts[pre] && !inbrk) {
						 brkPoints.push(pre);
						 inbrk = true;
					}
					pre = i;
				}

				axis.transA *= (max - min) / (max - min - shift);
			};

		}
		
	});
	
	
	wrap(Series.prototype, 'generatePoints', function (proceed) {
		var series = this,
			data = this.options.data,
			ndata = [],
			xAxis = this.xAxis,
			i = 0,
			point;

		while(i < data.length) {
			point = data[i];
			if (!xAxis.isInAnyBreak(point.x)) {
				ndata.push(point);
			} 
			i++;
		}

		this.options.data = ndata;


		proceed.apply(this, Array.prototype.slice.call(arguments, 1));

	});


}(Highcharts));