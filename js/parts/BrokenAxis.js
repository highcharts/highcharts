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
						nval += brk.breakWidth;
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
		this.setAxisTranslation = function (saveOld) {
			Axis.prototype.setAxisTranslation.call(this, saveOld);

			this.transA *= 1.3;
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
	/* 
	 * ADD CODE TO EMSURE THE LAST TICK IS RENDERED

	if (axis.isInBreak(tickPositions[tickPositions.length-1])) {
		// add a tick
	}
	*/
	this.tickPositions = newPositions;
});

// Extend the Axis prototype
extend(Axis.prototype, {
	/**
	 * Build the breaks
	 */

	buildBreaks: function () {
		if (this.options.breaks && !this.breaks) {
			var axis = this,
				breaks,
				breakOptions;
	
			breakOptions = axis.options.breaks;
			breaks = axis.breaks = [];

			each(breakOptions, function(brk) {
				if (brk.repeat) {
					var size = brk.to - brk.from,
						step = brk.repeat,
						max = axis.max,
						i = brk.from ;

					while(i < max) {
						breaks.push({
							from: i,
							to: (i + size > max ? max : i + size),
							breakWidth: brk.breakWidth || 0
						});
						i += step;
					}
				} else {
					breaks.push(brk);
				}
			});

			this.breaks = breaks;
		}
	},

	/**
	* Checks if a given value is within a break
	*/
	isInBreak: function (val, inclusive) {
		if (!this.options.breaks) { return false; }

		if (!this.breaks) {
			this.buildBreaks();
		}

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

/**
 * Extend getSegments to handle data in the breaks
 */ 
Series.prototype.getSegments = function () {
	var series = this,
		lastNull = -1,
		segments = [],
		i,
		points = series.points,
		pointsLength = points.length,
		xAxis = this.xAxis,
		yAxis = this.yAxis;

	if (pointsLength) { // no action required for []

		// if connect nulls, just remove null points
		if (series.options.connectNulls) {
			i = pointsLength;
			while (i--) {
				if (points[i].y === null || xAxis.isInBreak(points[i].x) || yAxis.isInBreak(points[i].y)) {
					points.splice(i, 1);
				}
			}
			if (points.length) {
				segments = [points];
			}

		// else, split on null points
		} else {
			each(points, function (point, i) {
				if (point.y === null || xAxis.isInBreak(points[i].x) || yAxis.isInBreak(points[i].y)) {
					if (i > lastNull + 1) {
						segments.push(points.slice(lastNull + 1, i));
					}
					lastNull = i;
				} else if (i === pointsLength - 1) { // last value
					segments.push(points.slice(lastNull + 1, i + 1));
				}
			});
		}
	}

	// register it
	series.segments = segments;
};

wrap(Series.prototype, 'drawPoints', function (proceed) {
	proceed.apply(this, Array.prototype.slice.call(arguments, 1));

	var series = this,
		points = series.points,
		xAxis = this.xAxis,
		yAxis = this.yAxis;

	each(points, function (point) {
		if (point.graphic) {
			if (xAxis.isInBreak(point.x) || yAxis.isInBreak(point.y)) {
				point.graphic.destroy();
			}
		}
	});
});