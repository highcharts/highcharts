/* *
 *
 *  Tilemaps module
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Øystein Moseng
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import type TilemapPointOptions from './TilemapPointOptions';
import type TilemapSeries from './TilemapSeries';

import ColorAxisComposition from '../../Core/Axis/Color/ColorAxisComposition.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    series: { prototype: { pointClass: Point } },
    seriesTypes: {
        heatmap: { prototype: { pointClass: HeatmapPoint } }
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const { extend } = U;

/* *
 *
 *  Class
 *
 * */

class TilemapPoint extends HeatmapPoint {

    /* *
     *
     *  Properties
     *
     * */

    public options!: TilemapPointOptions;

    public pointPadding?: number;

    public radius!: number;

    public series!: TilemapSeries;

    public tileEdges!: Record<string, number>;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * @private
     * @function Highcharts.Point#haloPath
     */
    public haloPath(): SVGPath {
        return this.series.tileShape.haloPath.apply(this, arguments);
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface TilemapPoint {
    setVisible: ColorAxisComposition.PointComposition['setVisible'];
}

extend(TilemapPoint.prototype, {
    setState: Point.prototype.setState,
    setVisible: ColorAxisComposition.pointSetVisible
});

/* *
 *
 *  Default Export
 *
 * */

export default TilemapPoint;
