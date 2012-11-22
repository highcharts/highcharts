/* ****************************************************************************
 * Start Box plot series code											      *
 *****************************************************************************/

// 1 - set default options
defaultPlotOptions.boxplot = merge(defaultPlotOptions.column, {
	fillColor: 'white',
	lineWidth: 1,
	states: {
		hover: {
			brightness: -0.3
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
	whiskerLength: '50%',
	whiskerWidth: 2,
	//whiskerColor: undefined,
	medianWidth: 2
	//medianColor: undefined,
	//stemWidth: undefined,
	//stemColor: undefined,
	//stemDashStyle: 'solid'
});

// 2 - Create the series object
seriesTypes.boxplot = extendClass(seriesTypes.column, {
	type: 'boxplot',
	pointArrayMap: ['low', 'q1', 'median', 'q3', 'high'], // array point configs are mapped to this
	toYData: function (point) { // return a plain array for speedy calculation
		return [point.low, point.q1, point.median, point.q3, point.high];
	},
	pointValKey: 'high', // defines the top of the tracker
	
	/**
	 * One-to-one mapping from options to SVG attributes
	 */
	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		fill: 'fillColor',
		stroke: 'color',
		'stroke-width': 'lineWidth'
	},
	
	/**
	 * Disable data labels and animation for box plot
	 */
	drawDataLabels: noop, // docs	
	animate: noop, // docs

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
			options = series.options,
			chart = series.chart,
			renderer = chart.renderer,
			pointAttr,
			q1Plot,
			q3Plot,
			highPlot,
			lowPlot,
			medianPlot,
			crispCorr,
			crispX,
			graphic,
			stemPath,
			stemAttr,
			boxPath,
			whiskersPath,
			whiskersAttr,
			medianPath,
			medianAttr,
			width,
			left,
			right,
			halfWidth,
			shapeArgs,
			whiskerLength = parseInt(series.options.whiskerLength, 10) / 100;


		each(points, function (point) {

			graphic = point.graphic;
			shapeArgs = point.shapeArgs; // the box
			stemAttr = {};
			whiskersAttr = {};
			medianAttr = {};
			
			if (point.plotY !== UNDEFINED) {

				pointAttr = point.pointAttr[point.selected ? 'selected' : ''];

				// crisp vector coordinates
				width = shapeArgs.width;
				left = mathFloor(shapeArgs.x);
				right = left + width;
				halfWidth = mathRound(width / 2);
				//crispX = mathRound(left + halfWidth) + crispCorr;
				q1Plot = mathFloor(point.q1Plot);// + crispCorr;
				q3Plot = mathFloor(point.q3Plot);// + crispCorr;
				highPlot = mathFloor(point.highPlot);// + crispCorr;
				lowPlot = mathFloor(point.lowPlot);// + crispCorr;
				
				// Stem attributes
				stemAttr.stroke = point.stemColor || options.stemColor || series.color;
				stemAttr['stroke-width'] = point.stemWidth || options.stemWidth || options.lineWidth;
				stemAttr.dashstyle = point.stemDashStyle || options.stemDashStyle;
				
				// Whiskers attributes
				whiskersAttr.stroke = point.whiskerColor || options.whiskerColor || series.color;
				whiskersAttr['stroke-width'] = point.whiskerWidth || options.whiskerWidth || options.lineWidth;
				
				// Median attributes
				medianAttr.stroke = point.medianColor || options.medianColor || series.color;
				medianAttr['stroke-width'] = point.medianWidth || options.medianWidth || options.lineWidth;
				
				
				// The stem
				crispCorr = (stemAttr['stroke-width'] % 2) / 2;
				crispX = left + halfWidth + crispCorr;				
				stemPath = [
					// stem up
					'M',
					crispX, q3Plot,
					'L',
					crispX, highPlot,
					
					// stem down
					'M',
					crispX, q1Plot,
					'L',
					crispX, lowPlot,
					'z'
				];
				
				// The box
				crispCorr = (pointAttr['stroke-width'] % 2) / 2;
				crispX = mathFloor(crispX) + crispCorr;
				q1Plot = mathFloor(q1Plot) + crispCorr;
				q3Plot = mathFloor(q3Plot) + crispCorr;
				left += crispCorr;
				right += crispCorr;
				boxPath = [
					'M',
					left, q3Plot,
					'L',
					left, q1Plot,
					'L',
					right, q1Plot,
					'L',
					right, q3Plot,
					'L',
					left, q3Plot,
					'z'
				];
				
				// The whiskers
				if (whiskerLength) {
					crispCorr = (whiskersAttr['stroke-width'] % 2) / 2;
					highPlot = highPlot + crispCorr;
					lowPlot = lowPlot + crispCorr;
					whiskersPath = [
						// High whisker
						'M',
						crispX - halfWidth * whiskerLength, 
						highPlot,
						'L',
						crispX + halfWidth * whiskerLength, 
						highPlot,
						
						// Low whisker
						'M',
						crispX - halfWidth * whiskerLength, 
						lowPlot,
						'L',
						crispX + halfWidth * whiskerLength, 
						lowPlot
					];
				}
				
				// The median
				crispCorr = (medianAttr['stroke-width'] % 2) / 2;				
				medianPlot = mathRound(point.medianPlot) + crispCorr;
				medianPath = [
					'M',
					left, 
					medianPlot,
					right, 
					medianPlot,
					'z'
				];
				
				// Create or update the graphics
				if (graphic) { // update
					
					point.stem.animate({ d: stemPath });
					if (whiskerLength) {
						point.whiskers.animate({ d: whiskersPath });
					}
					point.box.animate({ d: boxPath });
					point.medianShape.animate({ d: medianPath });
					
				} else { // create new
					point.graphic = graphic = renderer.g()
						.add(series.group);
					
					point.stem = renderer.path(stemPath)
						.attr(stemAttr)
						.add(graphic);
						
					if (whiskerLength) {
						point.whiskers = renderer.path(whiskersPath) 
							.attr(whiskersAttr)
							.add(graphic);
					}
					
					point.box = renderer.path(boxPath)
						.attr(pointAttr)
						.add(graphic);
						
					point.medianShape = renderer.path(medianPath)
						.attr(medianAttr)
						.add(graphic);		
				}
			}
		});

	}


});

/* ****************************************************************************
 * End Box plot series code												*
 *****************************************************************************/
