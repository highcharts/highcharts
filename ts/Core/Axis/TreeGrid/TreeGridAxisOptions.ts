/* *
 *  (c) 2016-2026 Highsoft AS
 *  Authors: Jon Arild Nygård
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

import type AxisOptions from '../AxisOptions.js';
import type ColorType from '../../Color/ColorType.js';

/* *
 *
 *  Declarations
 *
 * */

declare module '../AxisOptions.js' {
    interface AxisBreakOptions {
        showPoints?: boolean;
        maxOffset?: number;
    }
    interface AxisLabelOptions {
        // TODO: type mismatch with JSDoc
        levels?: number;

        /**
         * The symbol for the collapse and expand icon in a
         * treegrid.
         *
         * @product gantt
         */
        symbol?: TreeGridAxisLabelIconOptions;
    }
}

// TODO: simplify type based on actual usage in code (this should resolve docs)
export interface TreeGridAxisLabelIconOptions {
    height?: number;
    lineColor?: ColorType;
    lineWidth?: number;
    padding?: number;
    type?: number;
    width?: number;
    x?: number;
    y?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default AxisOptions;
