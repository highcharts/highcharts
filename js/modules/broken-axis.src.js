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
		isInBreak: function (val) {			
			if (!this.options.breaks) { return false; }
			
			var breaks = this.options.breaks,
				i = breaks.length,
				j,
				brk,
				from, to;

			while (i--) {
				brk = breaks[i];
				j = val % brk.repeat;
				from = brk.from % brk.repeat;
				to = brk.to % brk.repeat;

				if (from > to && (j > from || j < to)) {
					return true;
				} else if (j > from && j < to) {
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
			if (!axis.isInBreak(tickPositions[i])) {
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
					brk;

				while (i--) {
					brk = breaks[i];
					nval -= floor((val - axis.min) / brk.repeat) * (brk.to - brk.from); // Number of occurences * break width
				}				

				return nval;
			};

			this.lin2val = function (val) {
				var nval = val,
					breaks = axis.options.breaks,
					i = breaks.length,
					brk;

					while(i--) {
						brk = breaks[i];
						nval += floor((val - axis.min) / (brk.repeat - (brk.to - brk.from))) * (brk.to - brk.from); // Number of occurences * break width
					}

				return nval;
			};

			this.setAxisTranslation = function (saveOld) {
				Axis.prototype.setAxisTranslation.call(this, saveOld);
				var oldLen = axis.max - axis.min,
					newLen = oldLen,
					breaks = axis.options.breaks,
					i = breaks.length,
					brk;
				while (i--) {
					brk = breaks[i];
					newLen -= floor(oldLen / brk.repeat) * (brk.to - brk.from); // Number of occurences * break width
				}		
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
			if (!xAxis.isInBreak(point.x) && !yAxis.isInBreak(point.y)) {
				newPoints.push(point);
			}
			i++;
		}
		this.points = newPoints;

	});


}(Highcharts));