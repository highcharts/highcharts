/* ****************************************************************************
 * Start Flags series code													*
 *****************************************************************************/

var symbols = SVGRenderer.prototype.symbols;

// 1 - set default options
defaultPlotOptions.flags = merge(defaultPlotOptions.column, {
	dataGrouping: null,
	fillColor: 'white',
	lineWidth: 1,
	pointRange: 0, // #673
	//radius: 2,
	shape: 'flag',
	stackDistance: 7,
	states: {
		hover: {
			lineColor: 'black',
			fillColor: '#FCFFC5'
		}
	},
	style: {
		fontSize: '11px',
		fontWeight: 'bold',
		textAlign: 'center'
	},
	threshold: null,
	y: -30
});

// 2 - Create the CandlestickSeries object
seriesTypes.flags = extendClass(seriesTypes.column, {
	type: 'flags',
	noSharedTooltip: true,
	/**
	 * Inherit the initialization from base Series
	 */
	init: Series.prototype.init,

	/**
	 * One-to-one mapping from options to SVG attributes
	 */
	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		fill: 'fillColor',
		stroke: 'color',
		'stroke-width': 'lineWidth',
		r: 'radius'
	},

	/**
	 * Extend the translate method by placing the point on the related series
	 */
	translate: function () {

		seriesTypes.column.prototype.translate.apply(this);

		var series = this,
			options = series.options,
			chart = series.chart,
			points = series.points,
			cursor = points.length - 1,
			i,
			point,
			lastPoint,
			optionsOnSeries = options.onSeries,
			onSeries = optionsOnSeries && chart.get(optionsOnSeries),
			step = onSeries && onSeries.options.step,
			onData,
			leftPoint,
			lastX,
			rightPoint;


		// relate to a master series
		if (onSeries && onSeries.points && onSeries.points.length > 0) {
			onData = onSeries.points;
			i = onData.length;
			lastX = onData[i - 1].x;

			// sort the data points
			points.sort(function (a, b) {
				return (a.x - b.x);
			});

			while (i-- && points[cursor]) {
				point = points[cursor];
				leftPoint = onData[i];
				
				
				if (leftPoint.x <= point.x) {
					
					if (point.x <= lastX) { // #803
					
						point.plotY = leftPoint.plotY;
					
						// interpolate between points, #666
						if (leftPoint.x < point.x && !step) { 
							rightPoint = onData[i + 1];
							if (rightPoint) {
								point.plotY += 
									((point.x - leftPoint.x) / (rightPoint.x - leftPoint.x)) * // the distance ratio, between 0 and 1 
									(rightPoint.plotY - leftPoint.plotY); // the y distance
							}
						}
					}
					
					cursor--;
					i++; // check again for points in the same x position
					if (cursor < 0) {
						break;
					}
				}
			}
		}

		each(points, function (point, i) {
			// place on y axis or custom position
			if (!onSeries) {
				point.plotY = isNaN(point.y) ? chart.plotHeight : point.plotY;
			}
			// if multiple flags appear at the same x, order them into a stack
			lastPoint = points[i - 1];
			if (lastPoint && lastPoint.plotX === point.plotX) {
				if (lastPoint.stackIndex === UNDEFINED) {
					lastPoint.stackIndex = 0;
				}
				point.stackIndex = lastPoint.stackIndex + 1;
			}

		});


	},

	/**
	 * Draw the markers
	 */
	drawPoints: function () {
		var series = this,
			pointAttr,
			points = series.points,
			chart = series.chart,
			renderer = chart.renderer,
			plotX,
			plotY,
			options = series.options,
			optionsY = options.y,
			shape = options.shape,
			box,
			bBox,
			i,
			point,
			graphic,
			connector,
			stackIndex,
			crisp = (options.lineWidth % 2 / 2),
			anchorX,
			anchorY;

		i = points.length;
		while (i--) {
			point = points[i];
			plotX = point.plotX + crisp;
			stackIndex = point.stackIndex;
			plotY = point.plotY;
			if (plotY !== UNDEFINED) {
				plotY = point.plotY + optionsY + crisp - (stackIndex !== UNDEFINED && stackIndex * options.stackDistance);
			}
			anchorX = stackIndex ? UNDEFINED : point.plotX + crisp; // skip connectors for higher level stacked points
			anchorY = stackIndex ? UNDEFINED : point.plotY;

			graphic = point.graphic;
			connector = point.connector;

			// only draw the point if y is defined
			if (plotY !== UNDEFINED) {
				// shortcuts
				pointAttr = point.pointAttr[point.selected ? 'select' : ''];
				if (graphic) { // update
					graphic.attr({
						x: plotX,
						y: plotY,
						r: pointAttr.r,
						anchorX: anchorX,
						anchorY: anchorY
					});
				} else {
					graphic = point.graphic = renderer.label(
						point.options.title || options.title || 'A',
						plotX,
						plotY,
						shape,
						anchorX,
						anchorY
					)
					.css(merge(options.style, point.style))
					.attr(pointAttr)
					.attr({
						align: shape === 'flag' ? 'left' : 'center',
						width: options.width,
						height: options.height
					})
					.add(series.group)
					.shadow(options.shadow);

				}

				// get the bounding box
				box = graphic.box;
				bBox = box.getBBox();

				// set the shape arguments for the tracker element
				point.shapeArgs = extend(
					bBox,
					{
						x: plotX - (shape === 'flag' ? 0 : box.attr('width') / 2), // flags align left, else align center
						y: plotY
					}
				);

			} else if (graphic) {
				point.graphic = graphic.destroy();
			}

		}

	},

	/**
	 * Extend the column trackers with listeners to expand and contract stacks
	 */
	drawTracker: function () {
		var series = this;

		seriesTypes.column.prototype.drawTracker.apply(series);

		// put each point in front on mouse over, this allows readability of vertically
		// stacked elements as well as tight points on the x axis
		each(series.points, function (point) {
			addEvent(point.tracker.element, 'mouseover', function () {
				point.graphic.toFront();
			});
		});
	},

	/**
	 * Override the regular tooltip formatter by returning the point text given
	 * in the options
	 */
	tooltipFormatter: function (item) {
		return item.point.text;
	},

	/**
	 * Disable animation
	 */
	animate: function () {}

});

// create the flag icon with anchor
symbols.flag = function (x, y, w, h, options) {
	var anchorX = (options && options.anchorX) || x,
		anchorY = (options &&  options.anchorY) || y;

	return [
		'M', anchorX, anchorY,
		'L', x, y + h,
		x, y,
		x + w, y,
		x + w, y + h,
		x, y + h,
		'M', anchorX, anchorY,
		'Z'
	];
};

// create the circlepin and squarepin icons with anchor
each(['circle', 'square'], function (shape) {
	symbols[shape + 'pin'] = function (x, y, w, h, options) {

		var anchorX = options && options.anchorX,
			anchorY = options &&  options.anchorY,
			path = symbols[shape](x, y, w, h);

		if (anchorX && anchorY) {
			path.push('M', anchorX, y + h, 'L', anchorX, anchorY);
		}

		return path;
	};
});

// The symbol callbacks are generated on the SVGRenderer object in all browsers. Even
// VML browsers need this in order to generate shapes in export. Now share
// them with the VMLRenderer.
if (Renderer === VMLRenderer) {
	each(['flag', 'circlepin', 'squarepin'], function (shape) {
		VMLRenderer.prototype.symbols[shape] = symbols[shape];
	});
}

/* ****************************************************************************
 * End Flags series code													  *
 *****************************************************************************/
