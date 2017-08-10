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
	pick = H.pick;

seriesType('item', 'column', {
	itemPadding: 0.2
}, {
	drawPoints: function () {
		var series = this,
			renderer = series.chart.renderer;

		each(this.points, function (point) {
			var yPos,
				attr,
				graphics,
				itemY,
				pointAttr,
				yTop;

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

				itemY = point.y;
				yTop = pick(point.stackY, point.y);
				for (yPos = yTop; yPos > yTop - point.y; yPos--) {
					attr = {
						x: point.barX + point.pointWidth / 2,
						y: series.yAxis.toPixels(yPos, true),
						r: Math.min(
							point.pointWidth / 2,
							(
								(series.yAxis.transA / 2) *
								(1 - series.options.itemPadding)
							)
						)
					};
					if (graphics[itemY]) {
						graphics[itemY].animate(attr);
					} else {
						graphics[itemY] = renderer.circle(attr)
							.attr(pointAttr)
							.add(point.graphic);
					}
					graphics[itemY].isActive = true;
					itemY--;
				}
			}
			H.objectEach(graphics, function (graphic, key) {
				if (!graphic.isActive) {
					graphic.destroy();
					delete graphic[key];
				} else {
					graphic.isActive = false;
				}
			});
		});

	}
});

