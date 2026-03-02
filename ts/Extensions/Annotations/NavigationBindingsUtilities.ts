/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *  Author: Highsoft, Black Label
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

import type Pointer from '../../Core/Pointer';

import U from '../../Core/Utilities.js';
const {
    defined,
    isNumber,
    pick
} = U;

/* *
 *
 *  Constants
 *
 * */

/**
 * Define types for editable fields per annotation. There is no need to define
 * numbers, because they won't change their type to string.
 * @internal
 */
const annotationsFieldsTypes: Record<string, string> = {
    backgroundColor: 'color',
    backgroundColors: 'color',
    borderColor: 'color',
    borderRadius: 'string',
    color: 'color',
    fill: 'color',
    fontSize: 'string',
    labels: 'string',
    name: 'string',
    stroke: 'color',
    title: 'string'
};

/* *
 *
 *  Functions
 *
 * */

/**
 * Returns the first xAxis or yAxis that was clicked with its value.
 *
 * @internal
 *
 * @param {Array<Highcharts.PointerAxisCoordinateObject>} coords
 *        All the chart's x or y axes with a current pointer's axis value.
 *
 * @return {Highcharts.PointerAxisCoordinateObject}
 *         Object with a first found axis and its value that pointer
 *         is currently pointing.
 */
function getAssignedAxis(
    coords: Array<Pointer.AxisCoordinateObject>
): Pointer.AxisCoordinateObject {
    return coords.filter((coord): boolean => {
        const extremes = coord.axis.getExtremes(),
            axisMin = extremes.min,
            axisMax = extremes.max,
            // Correct axis edges when axis has series
            // with pointRange (like column)
            minPointOffset = pick(coord.axis.minPointOffset, 0);

        return isNumber(axisMin) && isNumber(axisMax) &&
            coord.value >= (axisMin - minPointOffset) &&
            coord.value <= (axisMax + minPointOffset) &&
            // Don't count navigator axis
            !coord.axis.options.isInternal;
    })[0]; // If the axes overlap, return the first axis that was found.
}

/**
 * Get field type according to value
 *
 * @internal
 *
 * @param {'boolean'|'number'|'string'} value
 * Atomic type (one of: string, number, boolean)
 *
 * @return {'checkbox'|'color'|'number'|'text'}
 * Field type (one of: text, number, checkbox, color)
 */
function getFieldType(
    key: (0|string),
    value: ('boolean'|'number'|'string')
): ('checkbox'|'color'|'number'|'text') {
    const predefinedType = annotationsFieldsTypes[key];
    let fieldType: string = typeof value;

    if (defined(predefinedType)) {
        fieldType = predefinedType;
    }

    return ({
        'string': 'text',
        'number': 'number',
        'boolean': 'checkbox',
        'color': 'color'
    } as Record<string, ('checkbox'|'color'|'number'|'text')>)[
        fieldType
    ];
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
const NavigationBindingUtilities = {
    annotationsFieldsTypes,
    getAssignedAxis,
    getFieldType
};

/** @internal */
export default NavigationBindingUtilities;
