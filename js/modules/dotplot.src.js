/* *
 *
 *  (c) 2009-2020 Torstein Honsi
 *
 *  Dot plot series type for Highcharts
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
/**
 * @private
 * @todo
 * - Check update, remove etc.
 * - Custom icons like persons, carts etc. Either as images, font icons or
 *   Highcharts symbols.
 */
'use strict';
import H from '../parts/Globals.js';
import U from '../parts/Utilities.js';
var extend = U.extend, objectEach = U.objectEach, pick = U.pick, seriesType = U.seriesType;
import '../parts/Series.js';
/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.dotplot
 *
 * @augments Highcharts.Series
 */
seriesType('dotplot', 'column', {
    itemPadding: 0.2,
    marker: {
        symbol: 'circle',
        states: {
            hover: {},
            select: {}
        }
    }
}, {
    markerAttribs: void 0,
    drawPoints: function () {
        var series = this, renderer = series.chart.renderer, seriesMarkerOptions = this.options.marker, itemPaddingTranslated = this.yAxis.transA *
            series.options.itemPadding, borderWidth = this.borderWidth, crisp = borderWidth % 2 ? 0.5 : 1;
        this.points.forEach(function (point) {
            var yPos, attr, graphics, itemY, pointAttr, pointMarkerOptions = point.marker || {}, symbol = (pointMarkerOptions.symbol ||
                seriesMarkerOptions.symbol), radius = pick(pointMarkerOptions.radius, seriesMarkerOptions.radius), size, yTop, isSquare = symbol !== 'rect', x, y;
            point.graphics = graphics = point.graphics || {};
            pointAttr = point.pointAttr ?
                (point.pointAttr[point.selected ? 'selected' : ''] ||
                    series.pointAttr['']) :
                series.pointAttribs(point, point.selected && 'select');
            delete pointAttr.r;
            if (series.chart.styledMode) {
                delete pointAttr.stroke;
                delete pointAttr['stroke-width'];
            }
            if (point.y !== null) {
                if (!point.graphic) {
                    point.graphic = renderer.g('point').add(series.group);
                }
                itemY = point.y;
                yTop = pick(point.stackY, point.y);
                size = Math.min(point.pointWidth, series.yAxis.transA - itemPaddingTranslated);
                for (yPos = yTop; yPos > yTop - point.y; yPos--) {
                    x = point.barX + (isSquare ?
                        point.pointWidth / 2 - size / 2 :
                        0);
                    y = series.yAxis.toPixels(yPos, true) +
                        itemPaddingTranslated / 2;
                    if (series.options.crisp) {
                        x = Math.round(x) - crisp;
                        y = Math.round(y) + crisp;
                    }
                    attr = {
                        x: x,
                        y: y,
                        width: Math.round(isSquare ? size : point.pointWidth),
                        height: Math.round(size),
                        r: radius
                    };
                    if (graphics[itemY]) {
                        graphics[itemY].animate(attr);
                    }
                    else {
                        graphics[itemY] = renderer.symbol(symbol)
                            .attr(extend(attr, pointAttr))
                            .add(point.graphic);
                    }
                    graphics[itemY].isActive = true;
                    itemY--;
                }
            }
            objectEach(graphics, function (graphic, key) {
                if (!graphic.isActive) {
                    graphic.destroy();
                    delete graphic[key];
                }
                else {
                    graphic.isActive = false;
                }
            });
        });
    }
});
H.SVGRenderer.prototype.symbols.rect = function (x, y, w, h, options) {
    return H.SVGRenderer.prototype.symbols.callout(x, y, w, h, options);
};
