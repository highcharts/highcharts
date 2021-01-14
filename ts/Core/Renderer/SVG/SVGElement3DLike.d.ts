/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  Extensions to the SVGRenderer class to enable 3D shapes
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

import type AnimationOptions from '../../Animation/AnimationOptions';
import type ColorType from '../../Color/ColorType';
import type SVGAttributes from './SVGAttributes';
import type SVGElement from './SVGElement';

/* *
 *
 *  Declarations
 *
 * */

export interface SVGElement3DLike {
    base: SVGElement3DLikeBase;
    cuboid: SVGElement3DLikeCuboid;
}

export interface SVGElement3DLikeBase {
    processParts: Function;
    singleSetterForParts: Function;
    destroyParts(this: SVGElement): void;
    initArgs(
        this: SVGElement,
        args: SVGAttributes
    ): void;
}

export interface SVGElement3DLikeCuboid extends SVGElement3DLikeBase {
    parts: Array<string>;
    pathType: string;
    animate(
        this: SVGElement,
        args: SVGAttributes,
        duration?: (boolean|Partial<AnimationOptions>),
        complete?: Function
    ): SVGElement;
    attr(
        this: SVGElement,
        args: (string|SVGAttributes),
        val?: (number|string),
        complete?: any,
        continueAnimation?: any
    ): SVGElement;
    fillSetter(
        this: SVGElement,
        fill: ColorType
    ): SVGElement;
}

export default SVGElement3DLike;
