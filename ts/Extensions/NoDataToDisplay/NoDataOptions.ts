/* *
 *
 *  Plugin for displaying a message when there is no data visible in chart.
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Øystein Moseng
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

import type { AlignObject } from '../../Core/Renderer/AlignObject';
import type { CSSObject } from '../../Core/Renderer/CSSObject';
import type { SVGAttributes } from '../../Core/Renderer/SVG/SVGAttributes';

/* *
 *
 *  Declarations
 *
 * */

export interface NoDataOptions {
    /**
     * An object of additional SVG attributes for the no-data label.
     *
     * @since    3.0.8
     */
    attr?: SVGAttributes;

    /**
     * Whether to insert the label as HTML, or as pseudo-HTML rendered with
     * SVG.
     *
     * @since    4.1.10
     * @default false
     */
    useHTML?: boolean;

    /**
     * The position of the no-data label, relative to the plot area.
     *
     * @since    3.0.8
     */
    position?: AlignObject;

    /**
     * CSS styles for the no-data label.
     *
     * @since    3.0.8
     */
    style?: CSSObject;
}

/* *
 *
 *  Default Export
 *
 * */

export default NoDataOptions;
