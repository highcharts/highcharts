/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
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

import type ColorType from '../Core/Color/ColorType';
import type DashStyleValue from '../Core/Renderer/DashStyleValue';
import type Point from '../Core/Series/Point';
import type ScatterPoint from './Scatter/ScatterPoint';
import type ScatterSeries from './Scatter/ScatterSeries';

import SeriesRegistry from '../Core/Series/SeriesRegistry.js';
const {
    column: { prototype: columnProto }
} = SeriesRegistry.seriesTypes;
import SVGElement from '../Core/Renderer/SVG/SVGElement.js';
import U from '../Core/Utilities.js';
const {
    addEvent,
    defined
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Series/PointBase' {
    interface PointBase {
        dataLabelOnNull?: boolean;
    }
}

/* *
 *
 *  Composition
 *
 * */

namespace ColorMapComposition {

    // These properties can be set as both attributes and CSS properties
    interface ColorAttribsType {
        dashstyle?: DashStyleValue;
        fill?: ColorType;
        stroke?: ColorType;
        'stroke-linecap'?: 'butt'|'round'|'square';
        'stroke-linejoin'?: 'butt'|'round'|'square';
        'stroke-width'?: number;
    }

    /* *
     *
     *  Declarations
     *
     * */

    export declare class PointComposition extends ScatterPoint {
        dataLabelOnNull?: boolean;
        moveToTopOnHover?: boolean;
        series: SeriesComposition;
        value: (number|null);
        isValid(): boolean;
    }

    export declare class SeriesComposition extends ScatterSeries {
        colorProp?: 'fill'|'stroke';
        data: Array<PointComposition>;
        parallelArrays: Array<string>;
        pointArrayMap: Array<string>;
        points: Array<PointComposition>;
        trackerGroups: Array<string>;
        colorAttribs(point: PointComposition): ColorAttribsType;
    }

    /* *
     *
     *  Constants
     *
     * */

    export const pointMembers = {
        dataLabelOnNull: true,
        moveToTopOnHover: true,
        isValid: pointIsValid
    };

    export const seriesMembers = {
        colorKey: 'value',
        axisTypes: ['xAxis', 'yAxis', 'colorAxis'] as
            Array<'xAxis'|'yAxis'|'colorAxis'>,
        parallelArrays: ['x', 'y', 'value'],
        pointArrayMap: ['value'],
        trackerGroups: ['group', 'markerGroup', 'dataLabelsGroup'],
        colorAttribs: seriesColorAttribs,
        pointAttribs: columnProto.pointAttribs
    };

    /* *
     *
     *  Functions
     *
     * */

    /**
     * @private
     */
    export function compose<T extends typeof ScatterSeries>(
        SeriesClass: T
    ): (T&typeof SeriesComposition) {
        const PointClass = SeriesClass.prototype.pointClass;

        addEvent(PointClass, 'afterSetState', onPointAfterSetState);

        return SeriesClass as (T&typeof SeriesComposition);
    }

    /**
     * Move points to the top of the z-index order when hovered.
     * @private
     */
    function onPointAfterSetState(
        this: Point,
        e?: Record<string, any>
    ): void {
        const point = this as PointComposition,
            series = point.series,
            renderer = series.chart.renderer;

        if (point.moveToTopOnHover && point.graphic) {
            if (!series.stateMarkerGraphic) {
                // Create a `use` element and add it to the end of the group,
                // which would make it appear on top of the other elements. This
                // deals with z-index without reordering DOM elements (#13049).
                series.stateMarkerGraphic = new SVGElement(renderer, 'use')
                    .css({
                        pointerEvents: 'none'
                    })
                    .add(point.graphic.parentGroup);
            }
            if (e?.state === 'hover') {
                // Give the graphic DOM element the same id as the Point
                // instance
                point.graphic.attr({
                    id: this.id
                });

                series.stateMarkerGraphic.attr({
                    href: `${renderer.url}#${this.id}`,
                    visibility: 'visible'
                });
            } else {
                series.stateMarkerGraphic.attr({
                    href: ''
                });
            }
        }
    }

    /**
     * Color points have a value option that determines whether or not it is
     * a null point
     * @private
     */
    function pointIsValid(
        this: PointComposition
    ): boolean {
        return (
            this.value !== null &&
            this.value !== Infinity &&
            this.value !== -Infinity &&
            // Undefined is allowed, but NaN is not (#17279)
            (this.value === void 0 || !isNaN(this.value))
        );
    }

    /**
     * Get the color attributes to apply on the graphic
     * @private
     * @function Highcharts.colorMapSeriesMixin.colorAttribs
     * @param {Highcharts.Point} point
     * @return {Highcharts.SVGAttributes}
     *         The SVG attributes
     */
    function seriesColorAttribs(
        this: SeriesComposition,
        point: PointComposition
    ): ColorAttribsType {
        const ret: ColorAttribsType = {};

        if (
            defined(point.color) &&
            (!point.state || point.state === 'normal') // #15746
        ) {
            ret[this.colorProp || 'fill'] = point.color;
        }
        return ret;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default ColorMapComposition;
