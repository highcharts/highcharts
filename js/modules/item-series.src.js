/**
 * (c) 2009-2017 Torstein Honsi
 *
 * Item series type for Highcharts
 *
 * License: www.highcharts.com/license
 */

/**
 * @todo
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
	pick = H.pick,
	stop = H.stop;

seriesType('item', 'column', {
	itemPadding: 0.2
}, {
	drawPoints: function () {
		var series = this,
			renderer = series.chart.renderer;

		each(this.points, function (point) {
			var y,
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

				for (y = pick(point.stackY, point.y); y > 0; y--) {
					attr = {
						x: point.barX + point.pointWidth / 2,
						y: series.yAxis.toPixels(y, true),
						r: Math.min(
							point.pointWidth / 2,
							(
								(series.yAxis.transA / 2) *
								(1 - series.options.itemPadding)
							)
						)
					};
					if (graphics[y]) {
						stop(graphics[y]);
						graphics[y].attr(attr);
					} else {
						graphics[y] = renderer.circle(attr)
							.attr(pointAttr)
							.add(point.graphic);
					}
				}
			}
		});

	}
});

