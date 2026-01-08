/* *
 *
 *  Plugin for displaying a message when there is no data visible in chart.
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Oystein Moseng
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type AlignObject from '../../Core/Renderer/AlignObject';
import type CSSObject from '../../Core/Renderer/CSSObject';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';

/* *
 *
 *  Declarations
 *
 * */

export interface NoDataOptions {
    attr?: SVGAttributes;
    useHTML?: boolean;
    position?: AlignObject;
    style?: CSSObject;
}

/* *
 *
 *  Default Export
 *
 * */

export default NoDataOptions;
