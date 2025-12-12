/* *
 *
 *  (c) 2010-2025 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type AxisType from '../../Core/Axis/AxisType';
import type {
    ControllableLabelOptions
} from './Controllables/ControllableOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Object of shape point.
 *
 * @interface Highcharts.AnnotationMockPointOptionsObject
 */
export interface AnnotationMockPointOptionsObject {
    /** @internal */
    label?: ControllableLabelOptions;

    /**
     * The x position of the point. Units can be either in axis
     * or chart pixel coordinates.
     *
     * @type      {number}
     * @name      Highcharts.AnnotationMockPointOptionsObject.x
     */
    x?: number;

    /**
     * This number defines which xAxis the point is connected to.
     * It refers to either the axis id or the index of the axis in
     * the xAxis array. If the option is not configured or the axis
     * is not found the point's x coordinate refers to the chart
     * pixels.
     *
     * @type      {number|string|null}
     * @name      Highcharts.AnnotationMockPointOptionsObject.xAxis
     */
    xAxis?: (number|AxisType|null);

    /**
     * The y position of the point. Units can be either in axis
     * or chart pixel coordinates.
     *
     * @type      {number|null}
     * @name      Highcharts.AnnotationMockPointOptionsObject.y
     */
    y?: number|null;

    /**
     * This number defines which yAxis the point is connected to.
     * It refers to either the axis id or the index of the axis in
     * the yAxis array. If the option is not configured or the axis
     * is not found the point's y coordinate refers to the chart
     * pixels.
     *
     * @type      {number|string|null}
     * @name      Highcharts.AnnotationMockPointOptionsObject.yAxis
     */
    yAxis?: (number|AxisType|null);
}

/* *
 *
 *  Export
 *
 * */

export default AnnotationMockPointOptionsObject;
