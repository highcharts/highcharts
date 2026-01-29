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

import type ColumnSeries from './ColumnSeries';
import type ColumnPointOptions from './ColumnPointOptions';
import type Point from '../../Core/Series/Point.js';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/PointBase' {
    interface PointBase {
        allowShadow?: boolean;
    }
}

export class ColumnPoint extends Point {
    allowShadow?: boolean;
    barX: number;
    group?: SVGElement;
    opacity?: number;
    options: ColumnPointOptions;
    pointWidth: number;
    series: ColumnSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default ColumnPoint;
