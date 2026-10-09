/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *  Author: Highsoft, Black Label
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type AxisType from '../../Core/Axis/AxisType';

import { isNumber } from '../../Shared/Utilities.js';

/* *
 *
 *  Functions
 *
 * */

/**
 * Interpolates an axis value between `from` and `to`. Use for midpoints,
 * Fibonacci levels and similar fractions of a range. On a logarithmic axis
 * the fraction is measured in pixels, so equal steps match the screen.
 *
 * @internal
 *
 * @param {number|null|undefined} from
 *        Start value.
 * @param {number|null|undefined} to
 *        End value.
 * @param {number} fraction
 *        Position along the range. `0` is `from` and `1` is `to`.
 * @param {Highcharts.Axis|null|undefined} axis
 *        Axis the values belong to.
 * @return {number}
 *         Axis value at that position.
 */
export function interpolateAxisValue(
    from: number | null | undefined,
    to: number | null | undefined,
    fraction: number,
    axis?: AxisType | null
): number {
    if (!isNumber(from) || !isNumber(to)) {
        return 0;
    }

    if (axis?.logarithmic) {
        const start = axis.toPixels(from),
            end = axis.toPixels(to);

        return axis.toValue(start + (end - start) * fraction);
    }

    return from + (to - from) * fraction;
}
