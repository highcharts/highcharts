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

import type ColumnSeries from './ColumnSeries';
import type ColumnPointOptions from './ColumnPointOptions';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

import Point from '../../Core/Series/Point.js';

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
declare module '../../Core/Series/PointBase' {
    interface PointBase {
        /** @internal */
        allowShadow?: boolean;
    }
}

export class ColumnPoint extends Point {
    /** @internal */
    allowShadow?: boolean;
    /** @internal */
    barX!: number;
    /** @internal */
    group?: SVGElement;
    /** @internal */
    opacity?: number;
    options!: ColumnPointOptions;
    /** @internal */
    pointWidth?: number;
    /** @internal */
    series!: ColumnSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default ColumnPoint;
