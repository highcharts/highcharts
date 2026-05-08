/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type AreaRangePointOptions from '../AreaRange/AreaRangePointOptions';
import type ColorType from '../../Core/Color/ColorType';
import type DashStyleValue from '../../Core/Renderer/DashStyleValue';

/* *
 *
 *  Declarations
 *
 * */

interface DumbbellPointOptions extends AreaRangePointOptions {

    /**
     * Color of the line that connects the dumbbell point's values.
     * By default it is the series' color.
     *
     * @since 8.0.0
     *
     * @product highcharts highstock
     */
    connectorColor?: ColorType;


    /**
     * Pixel width of the line that connects the dumbbell point's values.
     *
     * @since 8.0.0
     *
     * @default 1
     *
     * @product highcharts highstock
     */
    connectorWidth?: number;

    dashStyle?: DashStyleValue;

    /**
     * Color of the start markers in a dumbbell graph. This option takes
     * priority over the series color. To avoid this, set `lowColor` to
     * `undefined`.
     *
     * @since 8.0.0
     *
     * @default ${palette.neutralColor80}
     *
     * @product highcharts highstock
     */
    lowColor?: ColorType;

}

/* *
 *
 *  Default Export
 *
 * */

export default DumbbellPointOptions;
