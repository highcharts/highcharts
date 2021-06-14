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

import type ColumnSeries from './ColumnSeries';
import type ColumnPointOptions from './ColumnPointOptions';
import type Point from '../../Core/Series/Point.js';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import BBoxObject from '../../Core/Renderer/BBoxObject';

/* *
 *
 *  Declarations
 *
 * */

export class ColumnPoint extends Point {
    allowShadow?: boolean;
    barX: number;
    group?: SVGElement;
    opacity?: number;
    options: ColumnPointOptions;
    pointWidth: number;
    series: ColumnSeries;
}

declare module '../../Core/Series/PointLike' {
    interface PointLike {
        allowShadow?: boolean;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default ColumnPoint;
