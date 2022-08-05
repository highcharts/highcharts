/* *
 *
 *  (c) 2009-2021 Highsoft, Black Label
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

import type Pointer from '../../Core/Pointer';

import U from '../../Core/Utilities.js';
const {
    isNumber,
    pick
} = U;

/* *
 *
 *  Functions
 *
 * */

/**
 * Returns the first xAxis or yAxis that was clicked with its value.
 *
 * @private
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
            // don't count navigator axis
            !coord.axis.options.isInternal;
    })[0]; // If the axes overlap, return the first axis that was found.
}

/**
 * Get field type according to value
 *
 * @private
 *
 * @param {'boolean'|'number'|'string'} value
 * Atomic type (one of: string, number, boolean)
 *
 * @return {'checkbox'|'number'|'text'}
 * Field type (one of: text, number, checkbox)
 */
function getFieldType(
    value: ('boolean'|'number'|'string')
): ('checkbox'|'number'|'text') {
    return ({
        'string': 'text',
        'number': 'number',
        'boolean': 'checkbox'
    } as Record<string, ('checkbox'|'number'|'text')>)[
        typeof value
    ];
}

/* *
 *
 *  Default Export
 *
 * */

const NavigationBindingUtilities = {
    getAssignedAxis,
    getFieldType
};

export default NavigationBindingUtilities;
