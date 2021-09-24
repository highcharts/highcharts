/* *
 *
 *  This module implements sunburst charts in Highcharts.
 *
 *  (c) 2016-2021 Highsoft AS
 *
 *  Authors: Jon Arild Nygard
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

import type SunburstPointOptions from './SunburstPointOptions';
import type SunburstSeries from './SunburstSeries';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

import DrawPointComposition from '../DrawPointComposition.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    series: {
        prototype: {
            pointClass: Point
        }
    },
    seriesTypes: {
        treemap: {
            prototype: {
                pointClass: TreemapPoint
            }
        }
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const { correctFloat, extend } = U;

/* *
 *
 *  Class
 *
 * */

class SunburstPoint extends TreemapPoint {

    /* *
     *
     *  Properties
     *
     * */

    public dataLabelPath?: SVGElement;

    public innerArcLength?: number;

    public outerArcLength?: number;

    public node: SunburstSeries.NodeObject = void 0 as any;

    public options: SunburstPointOptions = void 0 as any;

    public series: SunburstSeries = void 0 as any;

    public shapeExisting: SunburstSeries.NodeValuesObject = void 0 as any;

    public sliced?: boolean;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    public getDataLabelPath(label: SVGElement): SVGElement {
        let renderer = this.series.chart.renderer,
            shapeArgs = this.shapeExisting,
            start = shapeArgs.start,
            end = shapeArgs.end,
            angle = start + (end - start) / 2, // arc middle value
            upperHalf = angle < 0 &&
                angle > -Math.PI ||
                angle > Math.PI,
            r = (shapeArgs.r + (label.options.distance || 0)),
            moreThanHalf;

        // Check if point is a full circle
        if (
            start === -Math.PI / 2 &&
            correctFloat(end) === correctFloat(Math.PI * 1.5)
        ) {
            start = -Math.PI + Math.PI / 360;
            end = -Math.PI / 360;
            upperHalf = true;
        }
        // Check if dataLabels should be render in the
        // upper half of the circle
        if (end - start > Math.PI) {
            upperHalf = false;
            moreThanHalf = true;
        }

        if (this.dataLabelPath) {
            this.dataLabelPath = this.dataLabelPath.destroy();
        }

        this.dataLabelPath = renderer
            .arc({
                open: true,
                longArc: moreThanHalf ? 1 : 0
            })
            // Add it inside the data label group so it gets destroyed
            // with the label
            .add(label);

        this.dataLabelPath.attr({
            start: (upperHalf ? start : end),
            end: (upperHalf ? end : start),
            clockwise: +upperHalf,
            x: shapeArgs.x,
            y: shapeArgs.y,
            r: (r + shapeArgs.innerR) / 2
        });
        return this.dataLabelPath;
    }

    public isValid(): boolean {
        return true;
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Class Prototype
 *
 * */

interface SunburstPoint extends DrawPointComposition.Composition {
    setState: typeof Point.prototype.setState;
    setVisible: typeof TreemapPoint.prototype.setVisible;
}

extend(SunburstPoint.prototype, {
    getClassName: Point.prototype.getClassName,
    haloPath: Point.prototype.haloPath,
    setState: Point.prototype.setState
});

DrawPointComposition.compose(SunburstPoint);

/* *
 *
 *  Defaul Export
 *
 * */

export default SunburstPoint;
