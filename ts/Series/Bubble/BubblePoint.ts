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

import type BubblePointOptions from './BubblePointOptions';
import type BubbleSeries from './BubbleSeries';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import Point from '../../Core/Series/Point.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import SVGElementLike from '../../Core/Renderer/SVG/SVGElementLike.js';
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
const {
    extend,
    removeEvent
} = U;


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

    public graphics?: Array<SVGElementLike> = void 0 as any;

    public options: BubblePointOptions = void 0 as any;

    public series: BubbleSeries = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Destroy a point.
     *
     * @private
     */
    public destroy(): void {
        if (!this.series.options.temperatureColors) {
            super.destroy();
        } else { // if multiple graphics (temperatureColors)
            const point = this;
            let prop;

            // Remove all events and elements
            if (
                point.graphic ||
                point.graphics ||
                point.dataLabel ||
                point.dataLabels
            ) {
                removeEvent(point);
                point.destroyElements();
            }

            for (prop in point) { // eslint-disable-line guard-for-in
                (point as any)[prop] = null;
            }
        }
    }


    // public destroy(): void {
    //     const point = this,
    //         series = point.series,
    //         chart = series.chart,
    //         dataSorting = series.options.dataSorting,
    //         hoverPoints = chart.hoverPoints,
    //         globalAnimation = point.series.chart.renderer.globalAnimation,
    //         animation = animObject(globalAnimation);
    //     let prop;

    //     /**
    //      * Allow to call after animation.
    //      * @private
    //      */
    //     function destroyPoint(): void {
    //         // Remove all events and elements
    //         if (
    //            point.graphic ||
    //            point.graphics ||
    //            point.dataLabel ||
    //            point.dataLabels
    //          ) {
    //             removeEvent(point);
    //             point.destroyElements();
    //         }

    //         for (prop in point) { // eslint-disable-line guard-for-in
    //             (point as any)[prop] = null;
    //         }
    //     }

    //     if (point.legendItem) { // pies have legend items
    //         chart.legend.destroyItem(point);
    //     }

    //     if (hoverPoints) {
    //         point.setState();
    //         erase(hoverPoints, point);
    //         if (!hoverPoints.length) {
    //             chart.hoverPoints = null as any;
    //         }

    //     }
    //     if (point === chart.hoverPoint) {
    //         point.onMouseOut();
    //     }

    //     // Remove properties after animation
    //     if (!dataSorting || !dataSorting.enabled) {
    //         destroyPoint();

    //     } else {
    //         this.animateBeforeDestroy();
    //         syncTimeout(destroyPoint, animation.duration);
    //     }

    //     chart.pointCount--;
    // }

    /**
     *
     * @private
     */
    public getGraphicalProps(
        kinds?: Record<string, number>
    ): Point.GraphicalProps {
        const graphicalProps = super.getGraphicalProps(kinds);

        if (this.series.options.temperatureColors) {
            // Add graphics prop containing all graphical marker elements to
            // graphicalProps.
            graphicalProps.plural.push('graphics');
        }

        return graphicalProps;
    }

    /**
     * @private
     */
    public haloPath(size: number): SVGPath {
        return Point.prototype.haloPath.call(
            this,
            // #6067
            size === 0 ? 0 : (this.marker ? this.marker.radius || 0 : 0) + size
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
