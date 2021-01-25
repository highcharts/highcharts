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

import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';
import type TreemapPointOptions from './TreemapPointOptions';
import type TreemapSeries from './TreemapSeries';
import DrawPointMixin from '../../Mixins/DrawPoint.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    series: {
        prototype: {
            pointClass: Point
        }
    },
    seriesTypes: {
        pie: {
            prototype: {
                pointClass: PiePoint
            }
        },
        scatter: {
            prototype: {
                pointClass: ScatterPoint
            }
        }
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const {
    extend,
    isNumber,
    pick
} = U;

/* *
 *
 *  Class
 *
 * */

class TreemapPoint extends ScatterPoint implements DrawPointMixin.DrawPoint {

    /* *
     *
     *  Properties
     *
     * */

    public drillId?: (boolean|string);

    public name: string = void 0 as any;

    public node: TreemapSeries.NodeObject = void 0 as any;

    public options: TreemapPointOptions = void 0 as any;

    public parent?: string;

    public series: TreemapSeries = void 0 as any;

    public sortIndex?: number;

    public value: (number|null) = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    public getClassName(): string {
        var className = Point.prototype.getClassName.call(this),
            series = this.series,
            options = series.options;

        // Above the current level
        if (this.node.level <= series.nodeMap[series.rootNode].level) {
            className += ' highcharts-above-level';

        } else if (
            !this.node.isLeaf &&
        !pick(options.interactByLeaf, !options.allowTraversingTree)
        ) {
            className += ' highcharts-internal-node-interactive';

        } else if (!this.node.isLeaf) {
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

    public setState(state: StatesOptionsKey): void {
        Point.prototype.setState.call(this, state);

        // Graphic does not exist when point is not visible.
        if (this.graphic) {
            this.graphic.attr({
                zIndex: state === 'hover' ? 1 : 0
            });
        }
    }

    public shouldDraw(): boolean {
        return isNumber(this.plotY) && this.y !== null;
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Prototype Properties
 *
 * */

interface TreemapPoint extends DrawPointMixin.DrawPoint {
    draw: typeof DrawPointMixin.drawPoint;
    setVisible: typeof PiePoint.prototype.setVisible;
}
extend(TreemapPoint.prototype, {
    draw: DrawPointMixin.drawPoint,
    setVisible: PiePoint.prototype.setVisible
});

/* *
 *
 *  Default Export
 *
 * */

export default TreemapPoint;
