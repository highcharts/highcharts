/* *
 *
 *  Plugin for displaying a message when there is no data visible in chart.
 *
 *  (c) 2010-2021 Highsoft AS
 *
 *  Author: Oystein Moseng
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
