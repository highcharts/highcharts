/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type Axis from './Axis';
import type Chart from '../Chart/Chart.js';
import type StackingAxis from './Stacking/StackingAxis';
import type SVGLabel from '../Renderer/SVG/SVGLabel';

import StackItem from './Stacking/StackItem.js';
import U from '../Utilities.js';
const {
    addEvent,
    objectEach,
    pushUnique
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module './AxisComposition' {
    interface AxisComposition {
        waterfall?: WaterfallAxis['waterfall'];
    }
}

declare module '../../Core/Axis/AxisType' {
    interface AxisTypeRegistry {
        WaterfallAxis: WaterfallAxis;
    }
}

interface WaterfallAxis extends StackingAxis {
    waterfall: WaterfallAxis.Composition;
}

/* *
 *
 *  Namespace
 *
 * */

namespace WaterfallAxis {

    /* *
     *
     *  Interfaces
     *
     * */

    interface StacksObject {
        changed: boolean;
        alreadyChanged?: Array<string>;
        waterfall?: Record<string, StacksItemObject>;
    }

    export interface StacksItemObject {
        absoluteNeg?: number;
        absolutePos?: number;
        connectorThreshold?: number;
        label?: SVGLabel;
        negTotal: number;
        posTotal: number;
        stackState: Array<number>;
        stackTotal: number;
        stateIndex: number;
        threshold: number;
    }

    /* *
     *
     *  Constants
     *
     * */

    const composedMembers: Array<unknown> = [];

    /* *
     *
     *  Functions
     *
     * */

    /**
     * @private
     */
    export function compose(
        AxisClass: typeof Axis,
        ChartClass: typeof Chart
    ): void {

        if (pushUnique(composedMembers, AxisClass)) {
            addEvent(AxisClass, 'init', onAxisInit);
            addEvent(AxisClass, 'afterBuildStacks', onAxisAfterBuildStacks);
            addEvent(AxisClass, 'afterRender', onAxisAfterRender);
        }

        if (pushUnique(composedMembers, ChartClass)) {
            addEvent(ChartClass, 'beforeRedraw', onChartBeforeRedraw);
        }

    }

    /**
     * @private
     */
    function onAxisAfterBuildStacks(this: Axis): void {
        const axis = this as WaterfallAxis,
            stacks = axis.waterfall.stacks;

        if (stacks) {
            stacks.changed = false;
            delete stacks.alreadyChanged;
        }
    }

    /**
     * @private
     */
    function onAxisAfterRender(this: Axis): void {
        const axis = this as WaterfallAxis,
            stackLabelOptions = axis.options.stackLabels;

        if (stackLabelOptions && stackLabelOptions.enabled &&
            axis.waterfall.stacks) {
            axis.waterfall.renderStackTotals();
        }
    }

    /**
     * @private
     */
    function onAxisInit(this: Axis): void {
        const axis = this;

        if (!axis.waterfall) {
            axis.waterfall = new Composition(axis as WaterfallAxis);
        }
    }

    /**
     * @private
     */
    function onChartBeforeRedraw(this: Chart): void {
        const axes = this.axes as Array<WaterfallAxis>,
            series = this.series;

        for (const seri of series) {
            if (seri.options.stacking) {
                for (const axis of axes) {
                    if (!axis.isXAxis) {
                        axis.waterfall.stacks.changed = true;
                    }
                }
                break;
            }
        }
    }

    /* *
     *
     *  Classes
     *
     * */

    export class Composition {

        /* *
         *
         *  Constructors
         *
         * */

        public constructor(axis: WaterfallAxis) {
            this.axis = axis;
            this.stacks = {
                changed: false
            };
        }

        /* *
         *
         *  Properties
         *
         * */

        public axis: WaterfallAxis;
        public dummyStackItem?: StackItem;
        public stacks: StacksObject;

        /* *
         *
         *  Functions
         *
         * */

        /**
         * Calls StackItem.prototype.render function that creates and renders
         * stack total label for each waterfall stack item.
         *
         * @private
         * @function Highcharts.Axis#renderWaterfallStackTotals
         */
        public renderStackTotals(): void {
            const yAxis = this.axis,
                waterfallStacks = yAxis.waterfall.stacks,
                stackTotalGroup = (
                    yAxis.stacking && yAxis.stacking.stackTotalGroup
                ),
                dummyStackItem = new StackItem(
                    yAxis,
                    yAxis.options.stackLabels || {},
                    false,
                    0,
                    void 0
                );

            this.dummyStackItem = dummyStackItem;

            // Render each waterfall stack total
            if (stackTotalGroup) {
                objectEach(waterfallStacks, (type): void => {
                    objectEach(type, (
                        stackItem: StacksItemObject,
                        key: string
                    ): void => {
                        dummyStackItem.total = stackItem.stackTotal;
                        dummyStackItem.x = +key;
                        if (stackItem.label) {
                            dummyStackItem.label = stackItem.label;
                        }

                        StackItem.prototype.render.call(
                            dummyStackItem,
                            stackTotalGroup
                        );
                        stackItem.label = dummyStackItem.label;
                        delete dummyStackItem.label;
                    });
                });
            }
            dummyStackItem.total = null;
        }

    }

}

/* *
 *
 *  Default Export
 *
 * */

export default WaterfallAxis;
