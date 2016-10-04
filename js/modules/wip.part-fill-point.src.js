/***********************************
 * Highcharts PartFillPoint module *
 ***********************************/
'use strict';
import H from '../parts/Globals.js';

H.each(['column', 'columnrange'], function (type) {
	H.seriesTypes[type].prototype.supportsPartFill = true;
});

H.wrap(H.Chart.prototype, 'render', function (proceed) {
	var chart = this;

	H.each(chart.series, function (series) {

		if (series.supportsPartFill) {
			H.wrap(series, 'translate', function (proceed) {
				var i,
					points,
					point,
					shapeArgs;

				proceed.apply(series, Array.prototype.slice.call(arguments, 1));

				points = series.points;
				for (i = 0; i < points.length; i++) {
					point = points[i];
					if (point.partialFill) {
						shapeArgs = point.shapeArgs;
						point.partFillShape = {
							x: shapeArgs.x + 1,
							y: shapeArgs.y + Math.abs(shapeArgs.height - (shapeArgs.height * point.partialFill)),
							width: shapeArgs.width - 2,
							height: shapeArgs.height * point.partialFill
						};
					}
				}
			});

			H.wrap(series, 'drawPoints', function (proceed) {
				var series = this,
					chart = this.chart,
					options = series.options,
					renderer = chart.renderer,
					animationLimit = options.animationLimit || 250,
					partFillShape;

				proceed.apply(series, Array.prototype.slice.call(arguments, 1));
				// draw the columns
				H.each(series.points, function (point) {
					var plotY = point.plotY,
						partFillOptions = (H.isObject(point.partialFill)) ? point.partialFill : {},
						fill = partFillOptions.fill || '#000',
						partFillGraphic = point.partFillGraphic;

					if (H.isNumber(plotY) && point.y !== null) {
						partFillShape = point.partFillShape;

						if (partFillGraphic) {
							H.stop(partFillGraphic);
							partFillGraphic[chart.pointCount < animationLimit ? 'animate' : 'attr'](
								H.merge(partFillShape)
							);
						} else {
							point.partFillGraphic = partFillGraphic = renderer[point.shapeType](partFillShape)
								.attr({
									'class': point.getClassName()
								})
								.add(point.group || series.group);
						}

						partFillGraphic
							.attr(series.pointAttribs(point, point.selected && 'select'))
							.attr('fill', fill)
							.attr('stroke-width', 0)
							.shadow(options.shadow, null, options.stacking && !options.borderRadius);

					} else if (partFillGraphic) {
						point.partFillGraphic = partFillGraphic.destroy();
					}
				});
			});
		}
	});
	proceed.apply(chart, Array.prototype.slice.call(arguments, 1));
});
