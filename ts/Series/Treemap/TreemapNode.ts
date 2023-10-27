/* *
 *
 *  (c) 2010-2022 Pawel Lysy
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

import type TreemapSeries from './TreemapSeries.js';
import type BBoxObject from '../../Core/Renderer/BBoxObject.js';
import type TreemapPoint from './TreemapPoint.js';

/* *
*
*  Class
*
* */
class TreemapNode {

    /* *
    *
    *  Properties
    *
    * */

    childrenTotal = 0;
    ignore?: boolean;
    isLeaf?: boolean;
    levelDynamic?: number;
    name?: string;
    parent?: string;
    parentNode?: TreemapNode;
    pointValues?: TreemapNode.NodeValuesObject;
    sortIndex?: number;
    values?: TreemapNode.NodeValuesObject;
    visible = false;
    zIndex?: number;


    /* *
    *
    *  Functions
    *
    * */

    public init(
        id: string,
        i: number,
        children: Array<TreemapNode>,
        height: number,
        level: number,
        series: TreemapSeries,
        parent?: string
    ): TreemapNode {
        this.id = id;
        this.i = i;
        this.children = children;
        this.height = height;
        this.level = level;
        this.series = series;
        this.parent = parent;

        return this;
    }
}

/* *
*
*  Class interface
*
* */

interface TreemapNode {
    height: number;
    i: number;
    id: string;
    children: Array<TreemapNode>;
    level: number;
    series: TreemapSeries;
    val: number;
    point: TreemapPoint;
}

/* *
*
*  Class Namespace
*
* */

namespace TreemapNode {
    export interface NodeValuesObject extends BBoxObject {
        direction: number;
        val: number;
    }
}

/* *
*
*  Default Export
*
* */

export default TreemapNode;
