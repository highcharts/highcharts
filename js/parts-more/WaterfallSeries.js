/* ****************************************************************************
 * Start Waterfall series code                                                *
 *****************************************************************************/

// 1 - set default options
defaultPlotOptions.waterfall = merge(defaultPlotOptions.column, {
});

// 2 - Create the series object
seriesTypes.waterfall = extendClass(seriesTypes.column, {
	type: 'waterfall',

	upColorProp: 'fill',

	pointArrayMap: ['y', 'low'],

	pointValKey: 'y',

	translate: function () {
		var previous;

		seriesTypes.column.prototype.translate.apply(this);

		each(this.points, function (point) {
			var shapeArgs = point.shapeArgs,
				height = shapeArgs.height,
				y = shapeArgs.y;

			if (previous && !point.yBottom) {
				y = previous;

				if (point.y >= 0) {
					y -= height;
					previous = y;
				} else {
					previous = y + height;
				}

				shapeArgs.y = y;
				shapeArgs.height = height;
			} else {
				previous = y;
			}
		});
	},

	processData: function (force) {
		Series.prototype.processData.call(this, force);

		var series = this,
			yData = series.yData,
			length = yData.length,
			previous,
			current,
			i;


		for (i = 1; i < length; i++) {
			current = yData[i];
			previous = yData[i - 1];

			if (current[1] === null) {
				current[1] = current[1] + previous[0] + previous[1];
			}

			current[2] = current[0] + current[1];
		}
	},

	toYData: function (pt) {
		var low = pt.low === UNDEFINED ? null : pt.low;
		return [pt.y, low];
	},

	getAttribs: function () {
		seriesTypes.column.prototype.getAttribs.apply(this, arguments);

		var series = this,
			options = series.options,
			stateOptions = options.states,
			upColor = options.upColor || series.color,
			seriesDownPointAttr = merge(series.pointAttr),
			upColorProp = series.upColorProp;

		seriesDownPointAttr[''][upColorProp] = upColor;
		seriesDownPointAttr.hover[upColorProp] = stateOptions.hover.upColor || upColor;
		seriesDownPointAttr.select[upColorProp] = stateOptions.select.upColor || upColor;

		each(series.points, function (point) {
			if (point.y > 0) {
				point.pointAttr = seriesDownPointAttr;
			}
		});
	},

	drawGraph: Series.prototype.drawGraph
});

/* ****************************************************************************
 * End Waterfall series code                                                  *
 *****************************************************************************/
