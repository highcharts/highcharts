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
import type ColorType from '../Color/ColorType';
import type Legend from './Legend';
import type SVGElement from '../Renderer/SVG/SVGElement';
import type { SymbolKey } from '../Renderer/SVG/SymbolType';

/* *
 *
 *  Declarations
 *
 * */

export interface LegendDataObject {
    group?: SVGElement;
    item?: (ColorAxis.LegendItemObject|SVGElement);
    items?: Array<(ColorAxis.LegendItemObject|SVGElement)>;
    symbol?: SVGElement;
}

export interface LegendItemObject {
    _legendItemPos?: Array<number>;
    chart: Chart;
    checkbox?: Legend.CheckBoxElement;
    checkboxOffset?: number;
    color?: ColorType;
    itemHeight?: number;
    itemWidth?: number;
    legendData?: LegendDataObject;
    legendItemHeight?: number;
    legendItemWidth?: number;
    legendLine?: SVGElement;
    name?: string;
    pageIx?: number;
    symbol?: SymbolKey;
}

/* *
 *
 *  Default Export
 *
 * */

export default LegendItemObject;
