/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
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

export interface LegendItemObject {
    area?: SVGElement;
    group?: SVGElement;
    label?: (ColorAxis.LegendItemObject|SVGElement);
    labelHeight?: number;
    labels?: Array<(ColorAxis.LegendItemObject|SVGElement)>;
    labelWidth?: number;
    line?: SVGElement;
    pageIx?: number;
    symbol?: SVGElement;
    x?: number;
    y?: number;
}

export interface LegendItem {
    chart: Chart;
    checkbox?: Legend.CheckBoxElement;
    checkboxOffset?: number;
    color?: ColorType;
    itemHeight?: number;
    itemWidth?: number;
    legendItem?: LegendItemObject;
    name?: string;
    symbol?: SymbolKey;
}

/* *
 *
 *  Default Export
 *
 * */

export default LegendItem;
