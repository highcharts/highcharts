/* *
 *
 *  (c) 2009-2021 Torstein Honsi
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import ColumnSeries from '../Column/ColumnSeries.js';
import './DotPlotSymbols.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import U from '../../Core/Utilities.js';
var extend = U.extend, merge = U.merge, objectEach = U.objectEach, pick = U.pick;
import '../Column/ColumnSeries.js';
/* *
 *
 *  Class
 *
 * */
/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.dotplot
 *
 * @augments Highcharts.Series
 */
var DotPlotSeries = /** @class */ (function (_super) {
    __extends(DotPlotSeries, _super);
    function DotPlotSeries() {
        /* *
         *
         * Static Properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /* *
         *
         * Properties
         *
         * */
        _this.data = void 0;
        _this.options = void 0;
        _this.points = void 0;
        return _this;
    }
    /* *
     *
     * Functions
     *
     * */
    DotPlotSeries.prototype.drawPoints = function () {
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
    };
    DotPlotSeries.defaultOptions = merge(ColumnSeries.defaultOptions, {
        itemPadding: 0.2,
        marker: {
            symbol: 'circle',
            states: {
                hover: {},
                select: {}
            }
        }
    });
    return DotPlotSeries;
}(ColumnSeries));
extend(DotPlotSeries.prototype, {
    markerAttribs: void 0
});
SeriesRegistry.registerSeriesType('dotplot', DotPlotSeries);
/* *
 *
 * Default Export
 *
 * */
export default DotPlotSeries;
