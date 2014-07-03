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
		Axis = H.Axis,
		Series = H.Series;

	extend(Axis.prototype, {
		isInBreak: function (brk, val) {
			var	j = val % brk.repeat,
				from = brk.from % brk.repeat,
				to = brk.to % brk.repeat;

				if (from > to && (j > from || j < to)) {
					return true;
				} else if (j > from && j < to) {
					return true;
				}
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
			axis.postTranslate = true;

			this.val2lin = function (val) {		
				var nval = val,
					breaks = axis.options.breaks,
					i = breaks.length,
					brk,
					occ;

				while (i--) {
					brk = breaks[i]; 
					occ = Math.floor((val - (axis.min + (axis.min % brk.repeat))) / brk.repeat) + 1;
					nval -=  occ * (brk.to - brk.from); // Number of occurences * break width


					if (axis.isInBreak(brk, axis.min)) {
						nval -= ((brk.repeat - axis.min % brk.repeat) + (brk.to % brk.repeat)) % brk.repeat; // ???
					} 
					nval += axis.options.minPadding;
				}				

				return nval;
			};

			this.lin2val = function (val) {
				var nval = val,
					breaks = axis.options.breaks,
					i = breaks.length,
					occ,
					brk;

					while(i--) {
						brk = breaks[i];
						occ = Math.floor((val - (axis.min + (axis.min % brk.repeat))) / brk.repeat) + 1;
						nval += occ * (brk.to - brk.from); // Number of occurences * break width
					}

				return nval;
			};

			this.setAxisTranslation = function (saveOld) {
				Axis.prototype.setAxisTranslation.call(this, saveOld);
				var oldLen = axis.max - axis.min,
					newLen = oldLen,
					breaks = axis.options.breaks,
					i = breaks.length,
					occ,
					brk;
				while (i--) {
					brk = breaks[i];
					newLen -= Math.floor(oldLen / brk.repeat) * (brk.to - brk.from); // Number of occurences * break width

					if (axis.isInBreak(brk, axis.max)) {
						newLen -= ((brk.repeat - axis.max % brk.repeat) + (brk.to % brk.repeat)) % brk.repeat; // ???
					} 

				}		
				//newLen *= 1 + axis.options.maxPadding + axis.options.minPadding; // add the padding
				this.transA *= oldLen / newLen; 				
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