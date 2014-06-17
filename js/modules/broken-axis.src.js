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
		each = H.each,
		pick = H.pick,
		wrap = H.wrap,
		extend = H.extend,
		Axis = H.Axis;

	console.log('--- Loading Broken Axis Module ---');


	extend(Axis.prototype, {		
		/**
		 * Build the breaks
		 */
		beforeSetTickPositions: function () {
			var axis = this,
				breakOptions = this.options.breaks,
				breaks =  [];

			if (breakOptions) {
				var min = axis.min,
					max = axis.max,
					cut = 0,
					i;

				each(breakOptions, function(brk) {
					var step = brk.repeat,
						len = brk.to - brk.from;

					i = (min - (min % step) + brk.from);	// Go to first occurence of the break

					for (; i < max; i += step) {
						breaks.push({
							from: i,
							to: i + len
						});
						cut += len; 
					}
				});
			}
			this.breaklen = cut;
			this.breaks = breaks;
		},

		/**
		* Checks if a given value is within a break
		*/
		isInBreak: function (val, inclusive) {
			if (!this.options.breaks) { return false; }

			var breaks = this.breaks,
				i = breaks.length,
				brk;

			while (i-- > 0) {
				brk = breaks[i];
				if (inclusive) {
					if (val >= brk.from && val < brk.to) {
						return true;
					}
				} else {
					if (val > brk.from && val < brk.to) {
						return true;
					}
				}
			}
			return false;
		}
	});

	wrap(Axis.prototype, 'init', function (proceed, chart, userOptions) {

		var axis = this;

		proceed.call(this, chart, userOptions);
		
		if (this.options.breaks) {
			// Make the axis use val2lin and lin2val for post translation
			this.postTranslate = true;

			this.val2lin = function (val) {
				var nval = val,
					breaks = axis.breaks,
					brk, i;


				if (!this.isInBreak(val)) {
					for (i = 0; i < breaks.length; i++) {
						brk = breaks[i];
						if (val >= brk.to) {
							nval -= (brk.to - brk.from);
							//nval += brk.breakWidth;
						}
						if (val < brk.from) {
							break;
						}
					}
				}
				
				return nval;
			};

			this.lin2val = function (val) {
				return val;
			};

			// POC of increasing the translation slope to achieve the correct min and max
			// based on the ratio of ticks removed
			this.setAxisTranslation = function (saveOld) {
				Axis.prototype.setAxisTranslation.call(this, saveOld);
				if (this.tickPositions) {
					this.transA /= (this.tickPositions.length+1) / (this.tickPositions.length + this.breaklen);
				}
			};
		}
	});


	wrap(Axis.prototype, 'setTickPositions', function (proceed) {
		proceed.apply(this, Array.prototype.slice.call(arguments, 1));
		var axis = this,
			tickPositions = this.tickPositions,
			newPositions = [],
			i;

		for (i=0; i < tickPositions.length; i++) {
			if (!axis.isInBreak(tickPositions[i], true)) {
				newPositions.push(tickPositions[i]);
			}
		}

		this.tickPositions = newPositions;
	});




}(Highcharts));