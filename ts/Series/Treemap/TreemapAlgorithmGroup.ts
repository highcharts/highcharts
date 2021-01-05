/* *
 *
 *  (c) 2014-2021 Highsoft AS
 *
 *  Authors: Jon Arild Nygard / Oystein Moseng
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

import type PositionObject from '../../Core/Renderer/PositionObject';
import type TreemapSeries from './TreemapSeries';

/* *
 *
 *  Class
 *
 * */

class TreemapAlgorithmGroup {

    /* *
     *
     *  Constructor
     *
     * */

    constructor(
        h: number,
        w: number,
        d: number,
        p: TreemapAlgorithmGroup.PlotObject
    ) {
        this.height = h;
        this.width = w;
        this.plot = p;
        this.direction = d;
        this.startDirection = d;
        this.total = 0;
        this.nW = 0;
        this.lW = 0;
        this.nH = 0;
        this.lH = 0;
        this.elArr = [];
        this.lP = {
            total: 0,
            lH: 0,
            nH: 0,
            lW: 0,
            nW: 0,
            nR: 0,
            lR: 0,
            aspectRatio: function (w: number, h: number): number {
                return Math.max((w / h), (h / w));
            }
        };
    }

    /* *
     *
     *  Properties
     *
     * */

    public direction: number;

    public elArr: Array<number>;

    public height: number

    public lH: number;

    public lP: TreemapAlgorithmGroup.LPObject;

    public lW: number;

    public nH: number;

    public nW: number;

    public plot: TreemapAlgorithmGroup.PlotObject;

    public startDirection: number;

    public total: number;

    public width: number;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    public addElement(el: number): void {
        this.lP.total = this.elArr[this.elArr.length - 1];
        this.total = this.total + el;
        if (this.direction === 0) {
        // Calculate last point old aspect ratio
            this.lW = this.nW;
            this.lP.lH = this.lP.total / this.lW;
            this.lP.lR = this.lP.aspectRatio(this.lW, this.lP.lH);
            // Calculate last point new aspect ratio
            this.nW = this.total / this.height;
            this.lP.nH = this.lP.total / this.nW;
            this.lP.nR = this.lP.aspectRatio(this.nW, this.lP.nH);
        } else {
        // Calculate last point old aspect ratio
            this.lH = this.nH;
            this.lP.lW = this.lP.total / this.lH;
            this.lP.lR = this.lP.aspectRatio(this.lP.lW, this.lH);
            // Calculate last point new aspect ratio
            this.nH = this.total / this.width;
            this.lP.nW = this.lP.total / this.nH;
            this.lP.nR = this.lP.aspectRatio(this.lP.nW, this.nH);
        }
        this.elArr.push(el);
    }

    public reset(): void {
        this.nW = 0;
        this.lW = 0;
        this.elArr = [];
        this.total = 0;
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Class Namespace
 *
 * */

namespace TreemapAlgorithmGroup {
    export interface LPObject {
        lH: number;
        lR: number;
        lW: number;
        nH: number;
        nR: number;
        nW: number;
        total: number;
        aspectRatio(w: number, h: number): number;
    }
    export interface PlotObject extends PositionObject {
        parent: TreemapSeries.NodeValuesObject;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default TreemapAlgorithmGroup;
