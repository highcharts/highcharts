/* ****************************************************************************
 * Start Box plot series code											  *
 *****************************************************************************/

/*
 * To do : 
 * - Separate options for stem dash style and widths of horizontal lines. This calls for multiple
 *   shapes for each point, which is new. Consider letting point.graphic be a group.
 * - Data labels? Some of the logic from range series can be used for inspiration
 * - Disallow data grouping
 */

// 1 - set default options
defaultPlotOptions.boxplot = merge(defaultPlotOptions.column, {
	fillColor: 'white',
	lineColor: 'black',
	lineWidth: 2,
	states: {
		hover: {
			lineWidth: 2
		}
	},
	threshold: null,
	tooltip: {
		pointFormat: '<span style="color:{series.color};font-weight:bold">{series.name}</span><br/>' +
			'Minimum: {point.low}<br/>' +
			'Lower quartile: {point.q1}<br/>' +
			'Median: {point.median}<br/>' +
			'Higher quartile: {point.q3}<br/>' +
			'Maximum: {point.high}<br/>'
	},
	whiskerLength: '50%'
});

// 2 - Create the series object
seriesTypes.boxplot = extendClass(seriesTypes.column, {
	type: 'boxplot',
	pointArrayMap: ['low', 'q1', 'median', 'q3', 'high'], // array point configs are mapped to this
	toYData: function (point) { // return a plain array for speedy calculation
		return [point.low, point.q1, point.median, point.q3, point.high];
	},
	pointValKey: 'high',
	
	/**
	 * One-to-one mapping from options to SVG attributes
	 */
	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		fill: 'fillColor',
		stroke: 'color',
		'stroke-width': 'lineWidth'
	},

	/**
	 * Translate data points from raw values x and y to plotX and plotY
	 */
	translate: function () {
		var series = this,
			yAxis = series.yAxis,
			pointArrayMap = series.pointArrayMap;

		seriesTypes.column.prototype.translate.apply(series);

		// do the translation on each point dimension
		each(series.points, function (point) {
			each(pointArrayMap, function (key) {
				if (point[key] !== null) {
					point[key + 'Plot'] = yAxis.translate(point[key], 0, 1, 0, 1);
				}
			});
		});
	},

	/**
	 * Draw the data points
	 */
	drawPoints: function () {
		var series = this,  //state = series.state,
			points = series.points,
			chart = series.chart,
			pointAttr,
			q1Plot,
			q3Plot,
			highPlot,
			lowPlot,
			medianPlot,
			crispCorr,
			crispX,
			graphic,
			path,
			halfWidth,
			whiskerLength = parseInt(series.options.whiskerLength, 10) / 100;


		each(points, function (point) {

			graphic = point.graphic;
			if (point.plotY !== UNDEFINED) {

				pointAttr = point.pointAttr[point.selected ? 'selected' : ''];

				// crisp vector coordinates (todo: do this in translate?)
				crispCorr = (pointAttr['stroke-width'] % 2) / 2;
				crispX = mathRound(point.plotX) + crispCorr;
				halfWidth = mathRound(point.barW / 2);
				q1Plot = mathRound(point.q1Plot) + crispCorr;
				q3Plot = mathRound(point.q3Plot) + crispCorr;
				medianPlot = mathRound(point.medianPlot) + crispCorr;
				highPlot = mathRound(point.highPlot) + crispCorr;
				lowPlot = mathRound(point.lowPlot) + crispCorr;

				// create the box
				path = [
					'M',
					crispX - halfWidth, q3Plot,
					'L',
					crispX - halfWidth, q1Plot,
					'L',
					crispX + halfWidth, q1Plot,
					'L',
					crispX + halfWidth, q3Plot,
					'L',
					crispX - halfWidth, q3Plot,
					
					// stem up
					'M',
					crispX, q3Plot,
					'L',
					crispX, highPlot,
					
					// stem down
					'M',
					crispX, q1Plot,
					'L',
					crispX, lowPlot
				];
				
				if (whiskerLength) {
					path.push(					
						// high whisker
						'M',
						crispX - halfWidth * whiskerLength, 
						highPlot,
						'L',
						crispX + halfWidth * whiskerLength, 
						highPlot,
						
						// low whisker
						'M',
						crispX - halfWidth * whiskerLength, 
						lowPlot,
						'L',
						crispX + halfWidth * whiskerLength, 
						lowPlot
					);
				}
					
				path.push(
					// median
					'M',
					crispX - halfWidth, 
					medianPlot,
					crispX + halfWidth, 
					medianPlot,
					
					// close
					'Z'
				);

				if (graphic) {
					graphic.animate({ d: path });
				} else {
					point.graphic = chart.renderer.path(path)
						.attr(pointAttr)
						.add(series.group);
				}

			}
		});

	}


});

/* ****************************************************************************
 * End Box plot series code												*
 *****************************************************************************/
