/* *
 *
 *  Dependency wheel module
 *
 *  (c) 2018-2021 Torstein Honsi
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

import type DependencyWheelPointOptions from './DependencyWheelPointOptions';
import type DependencyWheelSeries from './DependencyWheelSeries';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import NodesMixin from '../../Mixins/Nodes.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        sankey: SankeySeries
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const { extend } = U;

/* *
 *
 *  Class
 *
 * */

class DependencyWheelPoint extends SankeySeries.prototype.pointClass {

    /* *
     *
     *  Properties
     *
     * */

    public angle: number = void 0 as any;

    public fromNode: DependencyWheelPoint = void 0 as any;

    public index: number = void 0 as any;

    public linksFrom: Array<DependencyWheelPoint> = void 0 as any;

    public linksTo: Array<DependencyWheelPoint> = void 0 as any;

    public options: DependencyWheelPointOptions = void 0 as any;

    public series: DependencyWheelSeries = void 0 as any;

    public shapeArgs: SVGAttributes = void 0 as any;

    public toNode: DependencyWheelPoint = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Return a text path that the data label uses.
     * @private
     */
    public getDataLabelPath(label: SVGElement): SVGElement {
        var renderer = this.series.chart.renderer,
            shapeArgs = this.shapeArgs,
            upperHalf = this.angle < 0 || this.angle > Math.PI,
            start = shapeArgs.start || 0,
            end = shapeArgs.end || 0;

        if (!this.dataLabelPath) {
            this.dataLabelPath = renderer
                .arc({
                    open: true,
                    longArc: Math.abs(Math.abs(start) - Math.abs(end)) < Math.PI ? 0 : 1
                })
                // Add it inside the data label group so it gets destroyed
                // with the label
                .add(label);
        }

        this.dataLabelPath.attr({
            x: shapeArgs.x,
            y: shapeArgs.y,
            r: (
                shapeArgs.r +
                ((this.dataLabel as any).options.distance || 0)
            ),
            start: (upperHalf ? start : end),
            end: (upperHalf ? end : start),
            clockwise: +upperHalf
        });

        return this.dataLabelPath;
    }

    public isValid(): boolean {
        // No null points here
        return true;
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Prototype Properties
 *
 * */

interface DependencyWheelPoint {
    setState: typeof NodesMixin['setNodeState'];
}
extend(DependencyWheelPoint.prototype, {
    setState: NodesMixin.setNodeState
});

/* *
 *
 *  Default Export
 *
 * */

export default DependencyWheelPoint;
