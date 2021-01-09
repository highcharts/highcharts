/* *
 *
 *  Tilemaps module
 *
 *  (c) 2010-2021 Highsoft AS
 *  Author: Øystein Moseng
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

import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import type TilemapPointOptions from './TilemapPointOptions';
import type TilemapSeries from './TilemapSeries';
import ColorSeriesModule from '../../Mixins/ColorSeries.js';
const { colorPointMixin } = ColorSeriesModule;
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    series: {
        prototype: {
            pointClass: Point
        }
    },
    seriesTypes: {
        heatmap: {
            prototype: {
                pointClass: HeatmapPoint
            }
        }
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

    public options: TilemapPointOptions = void 0 as any;

    public pointPadding?: number;

    public radius: number = void 0 as any;

    public series: TilemapSeries = void 0 as any;

    public tileEdges: Record<string, number> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * @private
     * @function Highcharts.Point#haloPath
     *
     * @return {Highcharts.SVGElement|Highcharts.SVGPathArray|Array<Highcharts.SVGElement>}
     */
    public haloPath(): SVGPath {
        return this.series.tileShape.haloPath.apply(this, arguments);
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Prototype Properties
 *
 * */

interface TilemapPoint {
    setVisible: typeof colorPointMixin.setVisible;
}
extend(TilemapPoint.prototype, {
    setState: Point.prototype.setState,
    setVisible: colorPointMixin.setVisible
});

/* *
 *
 *  Default Export
 *
 * */

export default TilemapPoint;
