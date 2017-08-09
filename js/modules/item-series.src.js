/**
 * (c) 2009-2017 Torstein Honsi
 *
 * Item series type for Highcharts
 *
 * License: www.highcharts.com/license
 */

/**
 * @todo
 * - Stacking
 * - Check update, remove etc.
 * - Custom icons like persons, carts etc. Either as images, font icons or
 *   Highcharts symbols.
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Series.js';
var seriesType = H.seriesType,
	each = H.each,
	stop = H.stop;

seriesType('item', 'column', {
	itemPadding: 0.2
}, {
	drawPoints: function () {
		var series = this,
			renderer = series.chart.renderer;

		each(this.points, function (point) {
			var i,
				attr,
				graphics,
				pointAttr;

			point.graphics = graphics = point.graphics || {};
			pointAttr = point.pointAttr ?
				(
					point.pointAttr[point.selected ? 'selected' : ''] ||
					series.pointAttr['']
				) :
				series.pointAttribs(point, point.selected && 'select');
			delete pointAttr.r;

			if (point.y !== null) {

				if (!point.graphic) {
					point.graphic = renderer.g().add(series.group);
				}

				for (i = 1; i <= point.y; i++) {
					attr = {
						x: point.plotX,
						y: series.yAxis.toPixels(i, true),
						r: Math.min(
							-series.pointXOffset,
							(
								(series.yAxis.transA / 2) *
								(1 - series.options.itemPadding)
							)
						)
					};
					if (graphics[i]) {
						stop(graphics[i]);
						graphics[i].attr(attr);
					} else {
						graphics[i] = renderer.circle(attr)
							.attr(pointAttr)
							.add(point.graphic);
					}
				}
			}
		});

	}
});

