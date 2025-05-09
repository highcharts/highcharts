/* *
 *
 *  (c) 2010-2025 Pawel Lysy
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type SunburstSeriesOptions from './SunburstSeriesOptions.js';
import type ColorType from '../../Core/Color/ColorType.js';
import type SunburstSeries from './SunburstSeries.js';
import type CU from '../CenteredUtilities.js';
import type TU from '../TreeUtilities.js';

import TreemapNode from '../Treemap/TreemapNode.js';

/* *
 *
 *  Class
 *
 * */

class SunburstNode extends TreemapNode {

    /* *
     *
     *  Properties
     *
     * */

    color?: ColorType;
    colorIndex?: number;
    shapeArgs?: SunburstNode.NodeValuesObject;
    sliced?: boolean;
    values?: SunburstNode.NodeValuesObject;

}

/* *
 *
 *  Class Prototype
 *
 * */

interface SunburstNode {
    series: SunburstSeries;
    children: Array<SunburstNode>;
}

/* *
 *
 *  Class Namespace
 *
 * */

namespace SunburstNode {

    /* *
     *
     *  Declarations
     *
     * */

    export interface NodeValuesObject
        extends CU.RadianAngles,
        TreemapNode.NodeValuesObject,
        TU.SetTreeValuesOptions<SunburstSeries> {
        color: ColorType;
        mapOptionsToLevel: SunburstSeriesOptions['levels'];
        borderRadius?: number|string;
        index: number;
        innerR: number;
        r: number;
        radius: number;
        siblings: number;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default SunburstNode;
