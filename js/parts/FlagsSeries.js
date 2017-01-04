/**
 * (c) 2010-2016 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Utilities.js';
import './Series.js';
import './SvgRenderer.js';
import './VmlRenderer.js';
var addEvent = H.addEvent,
	each = H.each,
	merge = H.merge,
	noop = H.noop,
	Renderer = H.Renderer,
	Series = H.Series,
	seriesType = H.seriesType,
	seriesTypes = H.seriesTypes,
	SVGRenderer = H.SVGRenderer,
	TrackerMixin = H.TrackerMixin,
	VMLRenderer = H.VMLRenderer,
	symbols = SVGRenderer.prototype.symbols;

/**
 * The flags series type.
 *
 * @constructor seriesTypes.flags
 * @augments seriesTypes.column
 */
seriesType('flags', 'column', {
	pointRange: 0, // #673
	//radius: 2,
	shape: 'flag',
	stackDistance: 12,
	textAlign: 'center',
	tooltip: {
		pointFormat: '{point.text}<br/>'
	},
	threshold: null,
	y: -30,
	/*= if (build.classic) { =*/
	fillColor: '${palette.backgroundColor}',
	// lineColor: color,
	lineWidth: 1,
	states: {
		hover: {
			lineColor: '${palette.neutralColor100}',
			fillColor: '${palette.highlightColor20}'
		}
	},
	style: {
		fontSize: '11px',
		fontWeight: 'bold'
	}
	/*= } =*/

}, /** @lends seriesTypes.flags.prototype */ {
	sorted: false,
	noSharedTooltip: true,
	allowDG: false,
	takeOrdinalPosition: false, // #1074
	trackerGroups: ['markerGroup'],
	forceCrop: true,
	/**
	 * Inherit the initialization from base Series.
	 */
	init: Series.prototype.init,

	/*= if (build.classic) { =*/
	/**
	 * Get presentational attributes
	 */
	pointAttribs: function (point, state) {
		var options = this.options,
			color = (point && point.color) || this.color,
			lineColor = options.lineColor,
			lineWidth = (point && point.lineWidth),
			fill = (point && point.fillColor) || options.fillColor;

		if (state) {
			fill = options.states[state].fillColor;
			lineColor = options.states[state].lineColor;
			lineWidth = options.states[state].lineWidth;
		}

		return {
			'fill': fill || color,
			'stroke': lineColor || color,
			'stroke-width': lineWidth || options.lineWidth || 0
		};
	},
	/*= } =*/

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
			point,
			lastPoint,
			optionsOnSeries = options.onSeries,
			onSeries = optionsOnSeries && chart.get(optionsOnSeries),
			onKey = options.onKey || 'y',
			step = onSeries && onSeries.options.step,
			onData = onSeries && onSeries.points,
			i = onData && onData.length,
			xAxis = series.xAxis,
			xAxisExt = xAxis.getExtremes(),
			xOffset = 0,
			leftPoint,
			lastX,
			rightPoint,
			currentDataGrouping;

		// relate to a master series
		if (onSeries && onSeries.visible && i) {
			xOffset = (onSeries.pointXOffset || 0) + (onSeries.barW || 0) / 2;
			currentDataGrouping = onSeries.currentDataGrouping;
			lastX = onData[i - 1].x + (currentDataGrouping ? currentDataGrouping.totalRange : 0); // #2374

			// sort the data points
			points.sort(function (a, b) {
				return (a.x - b.x);
			});

			onKey = 'plot' + onKey[0].toUpperCase() + onKey.substr(1);
			while (i-- && points[cursor]) {
				point = points[cursor];
				leftPoint = onData[i];
				if (leftPoint.x <= point.x && leftPoint[onKey] !== undefined) {
					if (point.x <= lastX) { // #803

						point.plotY = leftPoint[onKey];

						// interpolate between points, #666
						if (leftPoint.x < point.x && !step) {
							rightPoint = onData[i + 1];
							if (rightPoint && rightPoint[onKey] !== undefined) {
								point.plotY +=
									((point.x - leftPoint.x) / (rightPoint.x - leftPoint.x)) * // the distance ratio, between 0 and 1
									(rightPoint[onKey] - leftPoint[onKey]); // the y distance
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

		// Add plotY position and handle stacking
		each(points, function (point, i) {

			var stackIndex;

			// Undefined plotY means the point is either on axis, outside series range or hidden series.
			// If the series is outside the range of the x axis it should fall through with
			// an undefined plotY, but then we must remove the shapeArgs (#847).
			if (point.plotY === undefined) {
				if (point.x >= xAxisExt.min && point.x <= xAxisExt.max) { // we're inside xAxis range
					point.plotY = chart.chartHeight - xAxis.bottom - (xAxis.opposite ? xAxis.height : 0) + xAxis.offset - chart.plotTop;
				} else {
					point.shapeArgs = {}; // 847
				}
			}
			point.plotX += xOffset; // #2049
			// if multiple flags appear at the same x, order them into a stack
			lastPoint = points[i - 1];
			if (lastPoint && lastPoint.plotX === point.plotX) {
				if (lastPoint.stackIndex === undefined) {
					lastPoint.stackIndex = 0;
				}
				stackIndex = lastPoint.stackIndex + 1;
			}
			point.stackIndex = stackIndex; // #3639
		});


	},

	/**
	 * Draw the markers
	 */
	drawPoints: function () {
		var series = this,
			points = series.points,
			chart = series.chart,
			renderer = chart.renderer,
			plotX,
			plotY,
			options = series.options,
			optionsY = options.y,
			shape,
			i,
			point,
			graphic,
			stackIndex,
			anchorX,
			anchorY,
			outsideRight,
			yAxis = series.yAxis;

		i = points.length;
		while (i--) {
			point = points[i];
			outsideRight = point.plotX > series.xAxis.len;
			plotX = point.plotX;
			stackIndex = point.stackIndex;
			shape = point.options.shape || options.shape;
			plotY = point.plotY;

			if (plotY !== undefined) {
				plotY = point.plotY + optionsY - (stackIndex !== undefined && stackIndex * options.stackDistance);
			}
			anchorX = stackIndex ? undefined : point.plotX; // skip connectors for higher level stacked points
			anchorY = stackIndex ? undefined : point.plotY;

			graphic = point.graphic;

			// Only draw the point if y is defined and the flag is within the visible area
			if (plotY !== undefined && plotX >= 0 && !outsideRight) {
				
				// Create the flag
				if (!graphic) {
					graphic = point.graphic = renderer.label(
						'',
						null,
						null,
						shape,
						null,
						null,
						options.useHTML
					)
					/*= if (build.classic) { =*/
					.attr(series.pointAttribs(point))
					.css(merge(options.style, point.style))
					/*= } =*/
					.attr({
						align: shape === 'flag' ? 'left' : 'center',
						width: options.width,
						height: options.height,
						'text-align': options.textAlign
					})
					.addClass('highcharts-point')
					.add(series.markerGroup);

					/*= if (build.classic) { =*/
					graphic.shadow(options.shadow);
					/*= } =*/
				}

				if (plotX > 0) { // #3119
					plotX -= graphic.strokeWidth() % 2; // #4285
				}

				// Plant the flag
				graphic.attr({
					text: point.options.title || options.title || 'A',
					x: plotX,
					y: plotY,
					anchorX: anchorX,
					anchorY: anchorY
				});

				// Set the tooltip anchor position
				point.tooltipPos = chart.inverted ? [yAxis.len + yAxis.pos - chart.plotLeft - plotY, series.xAxis.len - plotX] : [plotX, plotY];

			} else if (graphic) {
				point.graphic = graphic.destroy();
			}

		}

	},

	/**
	 * Extend the column trackers with listeners to expand and contract stacks
	 */
	drawTracker: function () {
		var series = this,
			points = series.points;

		TrackerMixin.drawTrackerPoint.apply(this);

		// Bring each stacked flag up on mouse over, this allows readability of vertically
		// stacked elements as well as tight points on the x axis. #1924.
		each(points, function (point) {
			var graphic = point.graphic;
			if (graphic) {
				addEvent(graphic.element, 'mouseover', function () {

					// Raise this point
					if (point.stackIndex > 0 && !point.raised) {
						point._y = graphic.y;
						graphic.attr({
							y: point._y - 8
						});
						point.raised = true;
					}

					// Revert other raised points
					each(points, function (otherPoint) {
						if (otherPoint !== point && otherPoint.raised && otherPoint.graphic) {
							otherPoint.graphic.attr({
								y: otherPoint._y
							});
							otherPoint.raised = false;
						}
					});
				});
			}
		});
	},

	animate: noop, // Disable animation
	buildKDTree: noop,
	setClip: noop

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
		'Z'
	];
};

// create the circlepin and squarepin icons with anchor
each(['circle', 'square'], function (shape) {
	symbols[shape + 'pin'] = function (x, y, w, h, options) {

		var anchorX = options && options.anchorX,
			anchorY = options &&  options.anchorY,
			path,
			labelTopOrBottomY;

		// For single-letter flags, make sure circular flags are not taller than their width
		if (shape === 'circle' && h > w) {
			x -= Math.round((h - w) / 2);
			w = h;
		}

		path = symbols[shape](x, y, w, h);

		if (anchorX && anchorY) {
			// if the label is below the anchor, draw the connecting line from the top edge of the label
			// otherwise start drawing from the bottom edge
			labelTopOrBottomY = (y > anchorY) ? y : y + h;
			path.push('M', anchorX, labelTopOrBottomY, 'L', anchorX, anchorY);
		}

		return path;
	};
});

/*= if (build.classic) { =*/
// The symbol callbacks are generated on the SVGRenderer object in all browsers. Even
// VML browsers need this in order to generate shapes in export. Now share
// them with the VMLRenderer.
if (Renderer === VMLRenderer) {
	each(['flag', 'circlepin', 'squarepin'], function (shape) {
		VMLRenderer.prototype.symbols[shape] = symbols[shape];
	});
}
/*= } =*/
/* ****************************************************************************
 * End Flags series code													  *
 *****************************************************************************/
