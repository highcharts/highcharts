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

import type ColorType from '../../Core/Color/ColorType';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Options'{
    interface Options {
        pane?: PaneOptions|Array<PaneOptions>;
    }
}

export interface PaneBackgroundOptions {
    backgroundColor?: ColorType;
    borderColor?: ColorType;
    borderRadius?: number|string;
    borderWidth?: number;
    className?: string;
    from?: number;
    innerRadius?: (number|string);
    outerRadius?: (number|string);
    shape?: PaneBackgroundShapeValue;
    to?: number;
}

export type PaneBackgroundShapeValue = ('arc'|'circle'|'solid');

export interface PaneOptions {
    background?: PaneBackgroundOptions|Array<PaneBackgroundOptions>;
    center?: Array<(string|number)>;
    endAngle?: number;
    id?: string;
    innerSize?: (number|string);
    size?: (number|string);
    startAngle?: number;
    zIndex?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default PaneOptions;
