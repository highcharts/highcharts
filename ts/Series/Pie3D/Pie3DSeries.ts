/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  3D pie series
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

import type ColorString from '../../Core/Color/ColorString';
import type PositionObject from '../../Core/Renderer/PositionObject';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import H from '../../Core/Globals.js';
const {
    deg2rad,
    svg
} = H;
import Pie3DPoint from './Pie3DPoint.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        pie: PieSeries
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const {
    extend,
    pick
} = U;

/* *
 *
 *  Declarations
 *
 * */

/**
 * Internal types
 * @private
 */
declare module '../Pie/PieSeriesOptions' {
    interface PieSeriesOptions {
        depth?: number;
        edgeColor?: ColorString;
        edgeWidth?: number;
    }
}

/* *
 *
 *  Class
 *
 * */

class Pie3DSeries extends PieSeries {

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * @private
     */
    public addPoint(): void {
        super.addPoint.apply(this, arguments);
        if (this.chart.is3d()) {
            // destroy (and rebuild) everything!!!
            this.update(this.userOptions, true); // #3845 pass the old options
        }
    }

    /**
     * @private
     */
    public animate(init?: boolean): void {
        if (!this.chart.is3d()) {
            super.animate.apply(this, arguments);
        } else {
            var animation = this.options.animation,
                attribs: SVGAttributes,
                center = this.center,
                group = this.group,
                markerGroup = this.markerGroup;

            if (svg) { // VML is too slow anyway

                if (animation === true) {
                    animation = {};
                }
                // Initialize the animation
                if (init) {

                    // Scale down the group and place it in the center
                    (group as any).oldtranslateX = pick(
                        (group as any).oldtranslateX,
                        (group as any).translateX);
                    (group as any).oldtranslateY = pick(
                        (group as any).oldtranslateY,
                        (group as any).translateY);
                    attribs = {
                        translateX: center[0],
                        translateY: center[1],
                        scaleX: 0.001, // #1499
                        scaleY: 0.001
                    };

                    (group as any).attr(attribs);
                    if (markerGroup) {
                        markerGroup.attrSetters = (group as any).attrSetters;
                        markerGroup.attr(attribs);
                    }

                // Run the animation
                } else {
                    attribs = {
                        translateX: (group as any).oldtranslateX,
                        translateY: (group as any).oldtranslateY,
                        scaleX: 1,
                        scaleY: 1
                    };
                    (group as any).animate(attribs, animation);

                    if (markerGroup) {
                        markerGroup.animate(attribs, animation);
                    }
                }

            }
        }
    }

    /**
     * @private
     */
    public drawDataLabels(): void {
        if (this.chart.is3d()) {
            var series = this,
                chart = series.chart,
                options3d = (chart.options.chart as any).options3d;

            series.data.forEach(function (point): void {
                var shapeArgs = point.shapeArgs,
                    r = (shapeArgs as any).r,
                    // #3240 issue with datalabels for 0 and null values
                    a1 = ((shapeArgs as any).alpha || options3d.alpha) * deg2rad,
                    b1 = ((shapeArgs as any).beta || options3d.beta) * deg2rad,
                    a2 = ((shapeArgs as any).start + (shapeArgs as any).end) / 2,
                    labelPosition = point.labelPosition,
                    connectorPosition = (labelPosition as any).connectorPosition,
                    yOffset = (-r * (1 - Math.cos(a1)) * Math.sin(a2)),
                    xOffset = r * (Math.cos(b1) - 1) * Math.cos(a2);

                // Apply perspective on label positions
                [
                    (labelPosition as any).natural,
                    connectorPosition.breakAt,
                    connectorPosition.touchingSliceAt
                ].forEach(function (coordinates: PositionObject): void {
                    coordinates.x += xOffset;
                    coordinates.y += yOffset;
                });
            });
        }

        super.drawDataLabels.apply(this, arguments);
    }

    /**
     * @private
     */
    public pointAttribs(point: Pie3DPoint): SVGAttributes {
        var attr = super.pointAttribs.apply(this, arguments),
            options = this.options;

        if (this.chart.is3d() && !this.chart.styledMode) {
            attr.stroke = options.edgeColor || point.color || this.color;
            attr['stroke-width'] = pick(options.edgeWidth, 1);
        }

        return attr;
    }

    /**
     * @private
     */
    public translate(): void {
        super.translate.apply(this, arguments);

        // Do not do this if the chart is not 3D
        if (!this.chart.is3d()) {
            return;
        }

        var series = this,
            seriesOptions = series.options,
            depth = seriesOptions.depth || 0,
            options3d = (series.chart.options.chart as any).options3d,
            alpha = options3d.alpha,
            beta = options3d.beta,
            z: number = seriesOptions.stacking ?
                ((seriesOptions.stack as any) || 0) * depth :
                series._i * depth;

        z += depth / 2;

        if (seriesOptions.grouping !== false) {
            z = 0;
        }

        series.data.forEach(function (point): void {

            var shapeArgs = point.shapeArgs,
                angle: number;

            point.shapeType = 'arc3d';

            (shapeArgs as any).z = z;
            (shapeArgs as any).depth = depth * 0.75;
            (shapeArgs as any).alpha = alpha;
            (shapeArgs as any).beta = beta;
            (shapeArgs as any).center = series.center;

            angle = ((shapeArgs as any).end + (shapeArgs as any).start) / 2;

            point.slicedTranslation = {
                translateX: Math.round(
                    Math.cos(angle) *
                    (seriesOptions.slicedOffset as any) *
                    Math.cos(alpha * deg2rad)
                ),
                translateY: Math.round(
                    Math.sin(angle) *
                    (seriesOptions.slicedOffset as any) *
                    Math.cos(alpha * deg2rad)
                )
            };
        });
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Prototype Properties
 *
 * */

interface Pie3DSeries {
    pointClass: typeof Pie3DPoint;
}
extend(Pie3DSeries, {
    pointClass: Pie3DPoint
});

/* *
 *
 *  Default Export
 *
 * */

export default Pie3DSeries;

/* *
 *
 *  API Options
 *
 * */

/**
 * The thickness of a 3D pie.
 *
 * @type      {number}
 * @default   0
 * @since     4.0
 * @product   highcharts
 * @requires  highcharts-3d
 * @apioption plotOptions.pie.depth
 */

''; // keeps doclets above after transpilation
