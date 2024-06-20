/* *
 *
 *  (c) 2010-2024 Torstein Honsi
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

import type BubblePointOptions from './BubblePointOptions';
import type BubbleSeries from './BubbleSeries';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import Point from '../../Core/Series/Point.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        scatter: {
            prototype: {
                pointClass: ScatterPoint
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

class BubblePoint extends ScatterPoint {

    /* *
     *
     *  Properties
     *
     * */

    public options!: BubblePointOptions;

    public series!: BubbleSeries;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * @private
     */
    public haloPath(size: number): SVGPath {
        const computedSize = size === 0 ?
            0 :
            (this.marker ? this.marker.radius || 0 : 0) +
            size;

        if (this.series.chart.inverted) {
            const pos = this.pos() || [0, 0],
                { xAxis, yAxis, chart } = this.series;

            return chart.renderer.symbols.circle(
                xAxis.len - pos[1] - computedSize,
                yAxis.len - pos[0] - computedSize,
                computedSize * 2,
                computedSize * 2
            );
        }

        return Point.prototype.haloPath.call(
            this,
            // #6067
            computedSize
        );
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Class Prototype
 *
 * */

extend(BubblePoint.prototype, {
    ttBelow: false
});

/* *
 *
 *  Default Export
 *
 * */

export default BubblePoint;
