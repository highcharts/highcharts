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

/* *
 *
 *  Imports
 *
 * */

import type DotPlotPoint from './DotPlotPoint';
import type DotPlotSeriesOptions from './DotPlotSeriesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import ColumnSeries from '../Column/ColumnSeries.js';
import './DotPlotSymbols.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import U from '../../Core/Utilities.js';
const {
    extend,
    merge,
    objectEach,
    pick
} = U;

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

class DotPlotSeries extends ColumnSeries {

    /* *
     *
     * Static Properties
     *
     * */

    public static defaultOptions: DotPlotSeriesOptions = merge(ColumnSeries.defaultOptions, {
        itemPadding: 0.2,
        marker: {
            symbol: 'circle',
            states: {
                hover: {},
                select: {}
            }
        }
    } as DotPlotSeriesOptions);

    /* *
     *
     * Properties
     *
     * */

    public data: Array<DotPlotPoint> = void 0 as any;

    public options: DotPlotSeriesOptions = void 0 as any;

    public points: Array<DotPlotPoint> = void 0 as any;

    /* *
     *
     * Functions
     *
     * */

    public drawPoints(): void {
        var series = this,
            renderer = series.chart.renderer,
            seriesMarkerOptions = this.options.marker,
            itemPaddingTranslated = this.yAxis.transA *
                (series.options.itemPadding as any),
            borderWidth = this.borderWidth,
            crisp = borderWidth % 2 ? 0.5 : 1;

        this.points.forEach(function (point: DotPlotPoint): void {
            var yPos: number,
                attr: SVGAttributes,
                graphics: Record<string, SVGElement>,
                itemY: (number|undefined),
                pointAttr,
                pointMarkerOptions = point.marker || {},
                symbol = (
                    pointMarkerOptions.symbol ||
                    (seriesMarkerOptions as any).symbol
                ),
                radius = pick(
                    pointMarkerOptions.radius,
                    (seriesMarkerOptions as any).radius
                ),
                size: number,
                yTop: number,
                isSquare = symbol !== 'rect',
                x: number,
                y: number;

            point.graphics = graphics = point.graphics || {};
            pointAttr = point.pointAttr ?
                (
                    (point.pointAttr as any)[point.selected ? 'selected' : ''] ||
                    (series.pointAttr as any)['']
                ) :
                series.pointAttribs(point, (point.selected as any) && 'select');
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
                yTop = pick(point.stackY, point.y as any);
                size = Math.min(
                    point.pointWidth,
                    series.yAxis.transA - itemPaddingTranslated
                );
                for (yPos = yTop; yPos > yTop - (point.y as any); yPos--) {

                    x = point.barX + (
                        isSquare ?
                            point.pointWidth / 2 - size / 2 :
                            0
                    );
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

                    if (graphics[itemY as any]) {
                        graphics[itemY as any].animate(attr);
                    } else {
                        graphics[itemY as any] = renderer.symbol(symbol)
                            .attr(extend(attr, pointAttr))
                            .add(point.graphic);
                    }
                    graphics[itemY as any].isActive = true;
                    (itemY as any)--;
                }
            }
            objectEach(graphics, function (
                graphic: SVGElement,
                key: string
            ): void {
                if (!graphic.isActive) {
                    graphic.destroy();
                    delete graphic[key];
                } else {
                    graphic.isActive = false;
                }
            });
        });
    }
}

interface DotPlotSeries extends ColumnSeries {
    pointAttr?: SVGAttributes;
    pointClass: typeof DotPlotPoint;
}

extend(DotPlotSeries.prototype, {
    markerAttribs: void 0
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        dotplot: typeof DotPlotSeries;
    }
}

SeriesRegistry.registerSeriesType('dotplot', DotPlotSeries);

/* *
 *
 * Default Export
 *
 * */

export default DotPlotSeries;
