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
var each = H.each,
    extend = H.extend,
    pick = H.pick,
    seriesType = H.seriesType;

seriesType('item', 'column', {
    itemPadding: 0.2,
    marker: {
        symbol: 'circle',
        states: {
            hover: {},
            select: {}
        }
    }
}, {
    drawPoints: function () {
        var series = this,
            renderer = series.chart.renderer,
            seriesMarkerOptions = this.options.marker,
            itemPaddingTranslated = this.yAxis.transA *
                series.options.itemPadding;

        each(this.points, function (point) {
            var yPos,
                attr,
                graphics,
                itemY,
                pointAttr,
                pointMarkerOptions = point.marker || {},
                symbol = (
                    pointMarkerOptions.symbol ||
                    seriesMarkerOptions.symbol
                ),
                size,
                yTop,
                isSquare = symbol !== 'rect';

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
                    point.graphic = renderer.g('point').add(series.group);
                }

                itemY = point.y;
                yTop = pick(point.stackY, point.y);
                size = Math.min(
                    point.pointWidth,
                    series.yAxis.transA - itemPaddingTranslated
                );
                for (yPos = yTop; yPos > yTop - point.y; yPos--) {

                    attr = {
                        x: point.barX + (
                            isSquare ?
                                point.pointWidth / 2 - size / 2 :
                                0
                        ),
                        y: series.yAxis.toPixels(yPos, true) +
                            itemPaddingTranslated / 2,
                        width: isSquare ? size : point.pointWidth,
                        height: size
                    };

                    if (graphics[itemY]) {
                        graphics[itemY].animate(attr);
                    } else {
                        graphics[itemY] = renderer.symbol(symbol)
                            .attr(extend(attr, pointAttr))
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

H.SVGRenderer.prototype.symbols.rect = function (x, y, w, h) {
    return ['M', x, y, 'L', x + w, y, x + w, y + h, x, y + h, x, y];
};

