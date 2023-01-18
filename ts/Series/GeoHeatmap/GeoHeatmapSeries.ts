/* *
 *
 *  (c) 2010-2023 Highsoft AS
 *  Authors:
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type GeoHeatmapSeriesOptions from './GeoHeatmapSeriesOptions';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import GeoHeatmapPoint from './GeoHeatmapPoint.js';
import HeatmapSeries from '../Heatmap/HeatmapSeries.js';

import U from '../../Core/Utilities.js';
import '../Heatmap/HeatmapSeries.js';
import ScatterSeries from '../Scatter/ScatterSeries.js';
import SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer.js';
import SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import Point from '../../Core/Series/Point.js';
import ColorAxis from '../../Core/Axis/Color/ColorAxis.js';
const { prototype: { symbols } } = SVGRenderer;

const {
    seriesTypes: {
        map: {
            prototype: mapProto
        },
        mappoint: {
            prototype: mapPointProto
        }
    }
} = SeriesRegistry;

const {
    extend,
    merge
} = U;

/* *
 *
 *  Declarations
 *
 * */


/* *
 *
 *  Class
 *
 * */

/**
 * The Geo Heatmap series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.geoheatmap
 *
 * @augments Highcharts.Series
 */

class GeoHeatmapSeries extends HeatmapSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions: GeoHeatmapSeriesOptions =
        HeatmapSeries.defaultOptions as any;

    /* *
     *
     *  Properties
     *
     * */

    public options: GeoHeatmapSeriesOptions = void 0 as any;
    public colorAxis: ColorAxis = void 0 as any;

    public clearBounds = mapProto.clearBounds;

    public searchPoint(
        e: any,
        compareX?: boolean
    ): (Point|undefined) {
        return this.searchKDTree({
            clientX: e.chartX - this.chart.plotLeft,
            plotY: e.chartY - this.chart.plotTop
        }, compareX, e);
    }

    /* *
     *
     *  Functions
     *
     * */

    public init(): void {
        ScatterSeries.prototype.init.apply(this, arguments);

        const options = this.options;
    }

    translate(): void {
        mapPointProto.translate.call(this);

        const series = this,
            options = series.options,
            symbol = options.marker && options.marker.symbol || 'rect',
            shape = symbols[symbol] ? symbol : 'rect',
            hasRegularShape = ['circle', 'square'].indexOf(shape) !== -1;

        series.generatePoints();
        series.points.forEach(function (point): void {
            const cellAttr = point.getCellAttributes();
            let x = Math.min(cellAttr.x1, cellAttr.x2),
                y = Math.min(cellAttr.y1, cellAttr.y2),
                width = Math.max(Math.abs(cellAttr.x2 - cellAttr.x1), 0),
                height = Math.max(Math.abs(cellAttr.y2 - cellAttr.y1), 0);
            point.hasImage = (
                point.marker && point.marker.symbol || symbol || ''
            ).indexOf('url') === 0;

            // If marker shape is regular (square), find the shorter cell's
            // side.
            if (hasRegularShape) {
                const sizeDiff = Math.abs(width - height);
                x = Math.min(cellAttr.x1, cellAttr.x2) +
                    (width < height ? 0 : sizeDiff / 2);
                y = Math.min(cellAttr.y1, cellAttr.y2) +
                    (width < height ? sizeDiff / 2 : 0);
                width = height = Math.min(width, height);
            }

            if (point.hasImage) {
                point.marker = { width, height };
            }

            point.plotX = point.clientX = (cellAttr.x1 + cellAttr.x2) / 2;
            point.plotY = (cellAttr.y1 + cellAttr.y2) / 2;
            point.shapeType = 'path';
            point.shapeArgs = merge<SVGAttributes>(
                true,
                { x, y, width, height },
                {
                    d: symbols[shape](
                        x,
                        y,
                        width,
                        height,
                        { r: options.borderRadius }
                    )
                }
            );
        });
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface GeoHeatmapSeries {
    pointClass: typeof GeoHeatmapPoint;
    type: string;
    getProjectedBounds: typeof mapProto.getProjectedBounds;
    pointArrayMap: Array<string>;
    setData: typeof mapProto.setData;
    processData: typeof mapProto.processData;
    projectPoint: typeof mapPointProto.projectPoint;
    // setOptions: typeof mapProto.setOptions;
    updateData: typeof mapProto.updateData;
    xyFromShape: boolean;
}

extend(GeoHeatmapSeries.prototype, {

    type: 'geoheatmap',

    axisTypes: ['colorAxis'],

    parallelArrays: ['z'],

    getProjectedBounds: mapProto.getProjectedBounds,

    isCartesian: false,

    // If one single value is passed, it is interpreted as value
    pointArrayMap: ['z'],

    pointClass: GeoHeatmapPoint,

    processData: mapProto.processData,

    projectPoint: mapPointProto.projectPoint,

    setData: mapProto.setData,

    setOptions: mapProto.setOptions as any,

    updateData: mapProto.updateData,

    useMapGeometry: true,

    xyFromShape: true,

    zoneAxis: 'z',

    colorKey: 'z'
});
/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        geoheatmap: typeof GeoHeatmapSeries;
    }
}
SeriesRegistry.registerSeriesType('geoheatmap', GeoHeatmapSeries);

/* *
 *
 *  Default Export
 *
 * */

export default GeoHeatmapSeries;

/* *
 *
 *  API Declarations
 *
 * */

/* *
 *
 *  API Options
 *
 * */

''; // adds doclets above to transpiled file
