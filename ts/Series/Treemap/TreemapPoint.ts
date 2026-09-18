/* *
 *
 *  (c) 2014-2026 Highsoft AS
 *
 *  Authors: Jon Arild Nygård / Øystein Moseng
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type ColorMapComposition from '../ColorMapComposition';
import type { DrawPointParams } from '../DrawPointUtilities';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';
import type TreemapNode from './TreemapNode';
import type TreemapPointOptions from './TreemapPointOptions';
import type TreemapSeries from './TreemapSeries';

import DPU from '../DrawPointUtilities.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    pie: { prototype: { pointClass: PiePoint } },
    scatter: { prototype: { pointClass: ScatterPoint } }
} = SeriesRegistry.seriesTypes;
import { extend, isNumber } from '../../Shared/Utilities.js';

/* *
 *
 *  Class
 *
 * */

class TreemapPoint extends ScatterPoint {

    /* *
     *
     *  Properties
     *
     * */

    /** @internal */
    public drillId?: (boolean|string);

    /** @internal */
    public isGroup?: boolean;

    /** @internal */
    public imageUrl?: string;

    /** @internal */
    public groupedPointsAmount: number = 0;

    /** @internal */
    public name!: string;

    /** @internal */
    public node!: TreemapNode;

    public options!: TreemapPointOptions;

    /** @internal */
    public parent?: string;

    /** @internal */
    public simulatedValue?: number;

    /** @internal */
    public series!: TreemapSeries;

    /** @internal */
    public shapeType: 'arc'|'circle'|'image'|'path'|'rect'|'text' = 'rect';

    /** @internal */
    public sortIndex?: number;

    /** @internal */
    public value!: (number|null);

    /* *
     *
     *  Functions
     *
     * */

    /** @internal */
    public draw(
        params: DrawPointParams
    ): void {
        DPU.draw(this, params);
    }

    /** @internal */
    public getClassName(): string {
        const series = this.series,
            options = series.options;

        let className = super.getClassName();

        // Above the current level
        if (
            this.node.level <= series.nodeMap[series.rootNode].level &&
            this.node.children.length
        ) {
            className += ' highcharts-above-level';

        } else if (
            !this.node.isGroup &&
            !this.node.isLeaf &&
            !series.nodeMap[series.rootNode].isGroup &&
            !(options.interactByLeaf ?? !options.allowTraversingTree)
        ) {
            className += ' highcharts-internal-node-interactive';

        } else if (
            !this.node.isGroup &&
            !this.node.isLeaf &&
            !series.nodeMap[series.rootNode].isGroup
        ) {
            className += ' highcharts-internal-node';
        }

        return className;
    }

    /**
     * A tree point is valid if it has han id too, assume it may be a parent
     * item.
     *
     * @private
     * @function Highcharts.Point#isValid
     */
    public isValid(): boolean {
        return Boolean(this.id || isNumber(this.value));
    }

    /** @internal */
    public setState(state: StatesOptionsKey): void {
        super.setState.apply(this, arguments);

        // Graphic does not exist when point is not visible.
        if (this.graphic) {
            this.graphic.attr({
                zIndex: state === 'hover' ? 1 : 0
            });
        }
    }

    /** @internal */
    public shouldDraw(): boolean {
        return isNumber(this.plotY) && this.y !== null;
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface TreemapPoint extends ColorMapComposition.PointComposition {
    /** @internal */
    setVisible: typeof PiePoint.prototype.setVisible;
}

extend(TreemapPoint.prototype, {
    setVisible: PiePoint.prototype.setVisible
});

/* *
 *
 *  Default Export
 *
 * */

export default TreemapPoint;
