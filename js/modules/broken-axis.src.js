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
			var	repeat = brk.repeat,
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


	wrap(Axis.prototype, 'init', function (proceed, chart, userOptions) {

		proceed.call(this, chart, userOptions);

		var axis = this;
		
		if (this.options.breaks) {
			var axis = this;
			axis.dateCorrection = axis.options.type === 'datetime' ? 4 * 24 * 3600 * 1000 : 0; // Jan. 1st 1970 is a Thursday 
			axis.postTranslate = true;

			this.val2lin = function (val) {	
				var nval = val,
					breaks = axis.options.breaks,
					i = breaks.length,
					brk,
					occ,
					corr;
					
				while (i--) {
					brk = breaks[i];
					corr = axis.dateCorrection + ((brk.to - axis.dateCorrection) % brk.repeat);
					occ = Math.floor((val - (axis.min - Math.abs((axis.min - corr) % brk.repeat))) / brk.repeat);
					nval -=  occ * (brk.to - brk.from); // Number of occurences * break width
					nval += occ * (brk.width || 0);
				}				
				
				return nval;
			};
			
			this.lin2val = function (val) {
				var nval = val,
					breaks = axis.options.breaks,
					i = breaks.length,
					occ,
					brk,
					corr;

				while (i--) {
					brk = breaks[i];
					corr = axis.dateCorrection + ((brk.to - axis.dateCorrection) % brk.repeat);
					occ = Math.floor((val - (axis.min - Math.abs((axis.min - corr) % brk.repeat))) / brk.repeat);
					nval +=  occ * (brk.to - brk.from); // Number of occurences * break width
					nval -= occ * (brk.width || 0);
				}		

				return nval;
			};
			
			this.setAxisTranslation = function (saveOld) {
				Axis.prototype.setAxisTranslation.call(this, saveOld);

				fireEvent(axis, 'beforeBreaks');	

				var oldLen = axis.max - axis.min,
					newLen = oldLen,
					breaks = axis.options.breaks,
					i = breaks.length,
					j,
					occ,
					brk,
					corr;

				var detectedBreaks = [];

				while (i--) {
					brk = breaks[i];
					occ = 0, 
					corr = axis.dateCorrection + ((brk.to - axis.dateCorrection) % brk.repeat),
					j = axis.min - Math.abs((axis.min - corr) % brk.repeat);
					for (j; j + brk.repeat <= axis.max; j += brk.repeat) {
						detectedBreaks.push({from: j + brk.repeat - (brk.to - brk.from), to: j + brk.repeat, brk: brk});
						occ++;
					}
					newLen -= occ * (brk.to - brk.from); // Number of occurences * break width
					newLen += occ * (brk.width || 0);

					if (axis.isInBreak(brk,axis.max)) {
						newLen -= (axis.max % brk.repeat) - ((brk.from % brk.repeat) * (axis.max > 0 ? 1 : -1));
					}					
					if (axis.isInBreak(brk, axis.min)) {
						//newLen -= ((brk.from % brk.repeat)+ (brk.to - brk.from)) - (axis.min % brk.repeat);
					} 
				}
				this.transA *= oldLen / newLen; 

				for (i = 0; i < detectedBreaks.length; i ++) {
					if (detectedBreaks[i].brk.callback) {
						detectedBreaks[i].brk.callback.call(axis, detectedBreaks[i]);
					}
				}
				fireEvent(axis, 'afterBreaks', {breaks: detectedBreaks});				
			};

		}
		
	});

	
	wrap(Series.prototype, 'generatePoints', function (proceed) {
		proceed.apply(this, Array.prototype.slice.call(arguments, 1));

		var series = this,
			points = series.points,
			newPoints = [],
			xAxis = this.xAxis,
			yAxis = this.yAxis,
			i = 0,
			point;

		while (i < points.length) {
			point = points[i];			
			if (!xAxis.isInAnyBreak(point.x) && !yAxis.isInAnyBreak(point.y)) {
				newPoints.push(point);
			}
			i++;
		}
		this.points = newPoints;

	});


}(Highcharts));