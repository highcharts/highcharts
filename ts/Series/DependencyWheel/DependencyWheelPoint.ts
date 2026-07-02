/* *
 *
 *  Dependency wheel module
 *
 *  (c) 2018-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
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
import type SVGLabel from '../../Core/Renderer/SVG/SVGLabel';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    sankey: { prototype: { pointClass: SankeyPoint } }
} = SeriesRegistry.seriesTypes;
import { pInt, wrap } from '../../Shared/Utilities.js';

/* *
 *
 *  Class
 *
 * */

class DependencyWheelPoint extends SankeyPoint {

    /* *
     *
     *  Properties
     *
     * */

    public angle!: number;

    public fromNode!: DependencyWheelPoint;

    public index!: number;

    public linksFrom!: Array<DependencyWheelPoint>;

    public linksTo!: Array<DependencyWheelPoint>;

    public options!: DependencyWheelPointOptions;

    public series!: DependencyWheelSeries;

    public shapeArgs!: SVGAttributes;

    public toNode!: DependencyWheelPoint;

    public weightTo?: number;

    public sumTo?: number;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Return the sum of incoming links wieght and outgoing links weightTo.
     * @internal
     */
    public getSumTo(): number {
        let sum = 0;
        for (const link of this.linksFrom) {
            sum += link.weightTo || link.weight || 0;
        }
        for (const link of this.linksTo) {
            sum += link.weight || 0;
        }
        return sum;
    }

    /**
     * Return a text path that the data label uses.
     * @private
     */
    public getDataLabelPath(label: SVGLabel): SVGElement {
        const point = this,
            renderer = point.series.chart.renderer,
            shapeArgs = point.shapeArgs,
            upperHalf = point.angle < 0 || point.angle > Math.PI,
            start = shapeArgs.start || 0,
            end = shapeArgs.end || 0;

        // First time
        if (!point.dataLabelPath) {
            // Destroy the path with the label
            wrap(label, 'destroy', function (
                this: SVGLabel,
                proceed
            ): undefined {
                if (point.dataLabelPath) {
                    point.dataLabelPath = point.dataLabelPath.destroy();
                }
                return proceed.call(this);
            });

        // Subsequent times
        } else {
            point.dataLabelPath = point.dataLabelPath.destroy();
            delete point.dataLabelPath;
        }

        // All times
        point.dataLabelPath = renderer
            .arc({
                open: true,
                longArc: Math.abs(
                    Math.abs(start) - Math.abs(end)
                ) < Math.PI ? 0 : 1
            })
            .attr({
                x: shapeArgs.x,
                y: shapeArgs.y,
                r: (
                    (shapeArgs.r || 0) + pInt(label.options?.distance || 0)
                ),
                start: (upperHalf ? start : end),
                end: (upperHalf ? end : start),
                clockwise: +upperHalf
            })
            .add(renderer.defs);

        return point.dataLabelPath;
    }

    public isValid(): boolean {
        // No null points here
        return true;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default DependencyWheelPoint;
