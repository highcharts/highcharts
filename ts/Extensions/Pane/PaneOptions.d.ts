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
    background?: Array<PaneBackgroundOptions>;
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
