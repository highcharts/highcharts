/* *
 *
 *  Networkgraph series
 *
 *  (c) 2010-2021 Paweł Fus
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

import type AnimationOptions from '../../Core/Animation/AnimationOptions';
import type ColorType from '../../Core/Color/ColorType';
import type NodesComposition from '../NodesComposition';
import type PointOptions from '../../Core/Series/PointOptions';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/PointOptions' {
    interface PointStateInactiveOptions
    {
        animation?: (boolean|Partial<AnimationOptions>);
    }
}

export interface NetworkgraphPointOptions
    extends PointOptions, NodesComposition.PointCompositionOptions {
    color?: ColorType;
    colorIndex?: number;
    dashStyle?: string;
    mass?: number;
    name?: string;
    opacity?: number;
    width?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default NetworkgraphPointOptions;
