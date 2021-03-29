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

import type ColorType from '../../Core/Color/ColorType';
import type DataLabelOptions from '../../Core/Series/DataLabelOptions';
import type ScatterPointOptions from '../Scatter/ScatterPointOptions';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';

/* *
 *
 *  Declarations
 *
 * */

export interface MapPointOptions extends ScatterPointOptions {
    color?: ColorType;
    dataLabels?: DataLabelOptions;
    drilldown?: string;
    id?: string;
    labelrank?: number;
    middleX?: number;
    middleY?: number;
    name?: string;
    path?: (string|SVGPath);
    value?: (number|null);
}

export default MapPointOptions;
