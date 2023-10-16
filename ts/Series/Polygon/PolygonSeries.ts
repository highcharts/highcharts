/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type PolygonPoint from './PolygonPoint';
import type PolygonSeriesOptions from './PolygonSeriesOptions';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';

import H from '../../Core/Globals.js';
const { noop } = H;
import PolygonSeriesDefaults from './PolygonSeriesDefaults.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    area: AreaSeries,
    line: LineSeries,
    scatter: ScatterSeries
} = SeriesRegistry.seriesTypes;
import U from '../../Core/Utilities.js';
const {
    extend,
    merge
} = U;

/* *
 *
 *  Class
 *
 * */

class PolygonSeries extends ScatterSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions: PolygonSeriesOptions = merge(
        ScatterSeries.defaultOptions,
        PolygonSeriesDefaults
    );

    /* *
     *
     *  Properties
     *
     * */

    public areaPath?: SVGPath;
    public data: Array<PolygonPoint> = void 0 as any;
    public options: PolygonSeriesOptions = void 0 as any;
    public points: Array<PolygonPoint> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    public getGraphPath(): SVGPath {
        const graphPath: SVGPath = LineSeries.prototype.getGraphPath.call(this);

        let i = graphPath.length + 1;

        // Close all segments
        while (i--) {
            if ((i === graphPath.length || graphPath[i][0] === 'M') && i > 0) {
                graphPath.splice(i, 0, ['Z']);
            }
        }
        this.areaPath = graphPath;
        return graphPath;
    }

    public drawGraph(): void {
        // Hack into the fill logic in area.drawGraph
        this.options.fillColor = this.color;
        AreaSeries.prototype.drawGraph.call(this);
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface PolygonSeries {
    pointClass: typeof PolygonPoint;
    type: string;
}

extend(PolygonSeries.prototype, {
    type: 'polygon',
    drawTracker: LineSeries.prototype.drawTracker,
    setStackedPoints: noop // No stacking points on polygons (#5310)
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        polygon: typeof PolygonSeries;
    }
}

SeriesRegistry.registerSeriesType('polygon', PolygonSeries);

/* *
 *
 *  Default Export
 *
 * */

export default PolygonSeries;
