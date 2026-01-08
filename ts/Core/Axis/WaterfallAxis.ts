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

import H from '../Globals.js';
const { composed } = H;
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

/** @internal */
declare module './AxisComposition' {
    interface AxisComposition {
        waterfall?: WaterfallAxis['waterfall'];
    }
}

/** @internal */
declare module '../../Core/Axis/AxisType' {
    interface AxisTypeRegistry {
        WaterfallAxis: WaterfallAxis;
    }
}

/** @internal */
interface WaterfallAxis extends StackingAxis {
    waterfall?: WaterfallAxis.Composition;
}

/* *
 *
 *  Namespace
 *
 * */

/** @internal */
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

        /** @internal */
        absoluteNeg?: number;

        /** @internal */
        absolutePos?: number;

        /** @internal */
        connectorThreshold?: number;

        /** @internal */
        label?: SVGLabel;

        /** @internal */
        negTotal: number;

        /** @internal */
        posTotal: number;

        /** @internal */
        stackState: Array<number>;

        /** @internal */
        stackTotal: number;

        /** @internal */
        stateIndex: number;

        /** @internal */
        threshold: number;

    }

    /* *
     *
     *  Functions
     *
     * */

    /** @internal */
    export function compose(
        AxisClass: typeof Axis,
        ChartClass: typeof Chart
    ): void {

        if (pushUnique(composed, 'Axis.Waterfall')) {
            addEvent(AxisClass, 'init', onAxisInit);
            addEvent(AxisClass, 'afterBuildStacks', onAxisAfterBuildStacks);
            addEvent(AxisClass, 'afterRender', onAxisAfterRender);

            addEvent(ChartClass, 'beforeRedraw', onChartBeforeRedraw);
        }

    }

    /** @internal */
    function onAxisAfterBuildStacks(this: Axis): void {
        const axis = this as WaterfallAxis,
            stacks = axis.waterfall?.stacks;

        if (stacks) {
            stacks.changed = false;
            delete stacks.alreadyChanged;
        }
    }

    /** @internal */
    function onAxisAfterRender(this: Axis): void {
        const axis = this as WaterfallAxis,
            stackLabelOptions = axis.options.stackLabels;

        if (
            stackLabelOptions?.enabled &&
            axis.waterfall?.stacks
        ) {
            axis.waterfall.renderStackTotals();
        }
    }

    /** @internal */
    function onAxisInit(this: Axis): void {
        const axis = this;

        if (!axis.waterfall) {
            axis.waterfall = new Composition(axis as WaterfallAxis);
        }
    }

    /** @internal */
    function onChartBeforeRedraw(this: Chart): void {
        const axes = this.axes as Array<WaterfallAxis>,
            series = this.series;

        for (const serie of series) {
            if (serie.options.stacking) {
                for (const axis of axes) {
                    if (!axis.isXAxis && axis.waterfall) {
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

    /** @internal */
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
         * @internal
         * @function Highcharts.Axis#renderWaterfallStackTotals
         */
        public renderStackTotals(): void {
            const yAxis = this.axis,
                waterfallStacks = yAxis.waterfall?.stacks,
                stackTotalGroup = yAxis.stacking?.stackTotalGroup,
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

/** @internal */
export default WaterfallAxis;
