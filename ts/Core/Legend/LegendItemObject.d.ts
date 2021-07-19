/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type Chart from '../Chart/Chart';
import type ColorAxis from '../Axis/Color/ColorAxis';
import type Legend from './Legend';
import type Point from '../Series/Point';
import type Series from '../Series/Series';
import type SVGElement from '../Renderer/SVG/SVGElement';
import type { SymbolKey } from '../Renderer/SVG/SymbolType';

/* *
 *
 *  Declarations
 *
 * */

export interface LegendItemObject {
    _legendItemPos?: Array<number>;
    chart: Chart;
    checkbox?: Legend.CheckBoxElement;
    checkboxOffset?: number;
    itemHeight?: number;
    itemWidth?: number;
    legendGroup?: SVGElement;
    legendItem?: (ColorAxis.LegendItemObject|SVGElement);
    legendItems?: Array<(ColorAxis.LegendItemObject|SVGElement)>;
    legendItemHeight?: number;
    legendItemWidth?: number;
    legendLine?: SVGElement;
    legendSymbol?: SVGElement;
    pageIx?: number;
    symbol?: SymbolKey;
}

/* *
 *
 *  Default Export
 *
 * */

export default LegendItemObject;
