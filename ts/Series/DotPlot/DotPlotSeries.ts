/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  Dot plot series type for Highcharts
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

import DotPlotSeriesDefaults from './DotPlotSeriesDefaults.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    column: ColumnSeries
} = SeriesRegistry.seriesTypes;
import U from '../../Core/Utilities.js';
const {
    extend,
    isNumber,
    merge,
    pick
} = U;

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
     *  Static Properties
     *
     * */

    public static defaultOptions: DotPlotSeriesOptions = merge(
        ColumnSeries.defaultOptions,
        DotPlotSeriesDefaults
    );

    /* *
     *
     *  Properties
     *
     * */

    public data!: Array<DotPlotPoint>;

    public options!: DotPlotSeriesOptions;

    public points!: Array<DotPlotPoint>;

    /* *
     *
     *  Functions
     *
     * */

    public drawPoints(): void {
        const series = this,
            options = series.options,
            renderer = series.chart.renderer,
            seriesMarkerOptions = options.marker,
            total = this.points.reduce(
                (acc, point): number => acc + Math.abs(point.y || 0),
                0
            ),
            totalHeight = this.points.reduce(
                (acc, point): number => acc + (point.shapeArgs?.height || 0),
                0
            ),
            itemPadding = options.itemPadding || 0,
            columnWidth = this.points[0]?.shapeArgs?.width || 0;

        let slotsPerBar = options.slotsPerBar,
            slotWidth = columnWidth;

        // Find the suitable number of slots per column
        if (!isNumber(slotsPerBar)) {
            slotsPerBar = 1;
            while (slotsPerBar < total) {
                if (
                    total / slotsPerBar <
                    (totalHeight / slotWidth) * 1.2
                ) {
                    break;
                }
                slotsPerBar++;
                slotWidth = columnWidth / slotsPerBar;
            }
        }

        const height = (totalHeight * slotsPerBar) / total;

        for (const point of series.points) {
            const pointMarkerOptions = point.marker || {},
                symbol = (
                    pointMarkerOptions.symbol ||
                    (seriesMarkerOptions as any).symbol
                ),
                radius = pick(
                    pointMarkerOptions.radius,
                    (seriesMarkerOptions as any).radius
                ),
                isSquare = symbol !== 'rect',
                width = isSquare ? height : slotWidth,
                shapeArgs = point.shapeArgs || {},
                startX = (shapeArgs.x || 0) + (
                    (shapeArgs.width || 0) -
                    slotsPerBar * width
                ) / 2,
                positiveYValue = Math.abs(point.y ?? 0),
                shapeY = (shapeArgs.y || 0),
                shapeHeight = (shapeArgs.height || 0);

            let graphics: Array<SVGElement|undefined>,
                x = startX,
                y = point.negative ? shapeY : shapeY + shapeHeight - height,
                slotColumn = 0;

            point.graphics = graphics = point.graphics || [];
            const pointAttr = point.pointAttr ?
                (
                    (point.pointAttr as any)[
                        point.selected ? 'selected' : ''
                    ] ||
                    (series.pointAttr as any)['']
                ) :
                series.pointAttribs(point, (point.selected as any) && 'select');
            delete pointAttr.r;

            if (series.chart.styledMode) {
                delete pointAttr.stroke;
                delete pointAttr['stroke-width'];
            }

            if (typeof point.y === 'number') {

                if (!point.graphic) {
                    point.graphic = renderer.g('point').add(series.group);
                }

                for (let val = 0; val < positiveYValue; val++) {
                    const attr = {
                        x: x + width * itemPadding,
                        y: y + height * itemPadding,
                        width: width * (1 - 2 * itemPadding),
                        height: height * (1 - 2 * itemPadding),
                        r: radius
                    };

                    let graphic = graphics[val];
                    if (graphic) {
                        graphic.animate(attr);
                    } else {
                        graphic = renderer
                            .symbol(symbol)
                            .attr(extend(attr, pointAttr))
                            .add(point.graphic);
                    }
                    graphic.isActive = true;
                    graphics[val] = graphic;

                    x += width;
                    slotColumn++;
                    if (slotColumn >= slotsPerBar) {
                        slotColumn = 0;
                        x = startX;
                        y = point.negative ? y + height : y - height;
                    }
                }
            }

            let i = -1;

            for (const graphic of graphics) {
                ++i;
                if (graphic) {
                    if (!graphic.isActive) {
                        graphic.destroy();
                        graphics.splice(i, 1);
                    } else {
                        graphic.isActive = false;
                    }
                }
            }
        }
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface DotPlotSeries {
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
 *  Default Export
 *
 * */

export default DotPlotSeries;
