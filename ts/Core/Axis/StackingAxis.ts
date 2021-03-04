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

import type Series from '../Series/Series';
import type StackItem from '../../Extensions/Stacking';
import type SVGElement from '../Renderer/SVG/SVGElement';
import A from '../Animation/AnimationUtilities.js';
const { getDeferredAnimation } = A;
import Axis from './Axis.js';
import U from '../Utilities.js';
const {
    addEvent,
    destroyObjectProperties,
    fireEvent,
    isNumber,
    objectEach,
    pick
} = U;

/**
 * @private
 */
declare module './Types' {
    interface AxisComposition {
        stacking?: StackingAxis['stacking'];
    }
    interface AxisTypeRegistry {
        StackingAxis: StackingAxis;
    }
}

/* eslint-disable valid-jsdoc */

/**
 * Adds stacking support to axes.
 * @private
 * @class
 */
class StackingAxisAdditions {

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(axis: StackingAxis) {
        this.axis = axis;
    }

    /* *
     *
     *  Properties
     *
     * */

    axis: StackingAxis;
    oldStacks: Record<string, Record<string, StackItem>> = {};
    stacks: Record<string, Record<string, StackItem>> = {};
    stacksTouched: number = 0;
    stackTotalGroup?: SVGElement;
    usePercentage?: boolean;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Build the stacks from top down
     * @private
     */
    public buildStacks(): void {
        const stacking = this;
        const axis = stacking.axis;
        const axisSeries = axis.series;
        const reversedStacks = pick(axis.options.reversedStacks, true);
        const len = axisSeries.length;

        let actualSeries: Series,
            i: number;

        if (!axis.isXAxis) {
            stacking.usePercentage = false;
            i = len;
            while (i--) {
                actualSeries = axisSeries[reversedStacks ? i : len - i - 1];
                actualSeries.setStackedPoints();
                actualSeries.setGroupedPoints();
            }

            // Loop up again to compute percent and stream stack
            for (i = 0; i < len; i++) {
                axisSeries[i].modifyStacks();
            }
            fireEvent(axis, 'afterBuildStacks');
        }
    }

    /**
     * @private
     */
    public cleanStacks(): void {
        const stacking = this;
        const axis = stacking.axis;

        let stacks;

        if (!axis.isXAxis) {
            if (stacking.oldStacks) {
                stacks = stacking.stacks = stacking.oldStacks;
            }

            // reset stacks
            objectEach(stacks, function (
                type: Record<string, StackItem>
            ): void {
                objectEach(type, function (stack: StackItem): void {
                    stack.cumulative = stack.total;
                });
            });
        }
    }

    /**
     * Set all the stacks to initial states and destroy unused ones.
     * @private
     */
    public resetStacks(): void {
        const { axis, stacks } = this;

        if (!axis.isXAxis) {

            objectEach(stacks, (type): void => {
                objectEach(type, (stack, x): void => {
                    // Clean up memory after point deletion (#1044, #4320)
                    if (
                        isNumber(stack.touched) &&
                        stack.touched < this.stacksTouched
                    ) {
                        stack.destroy();
                        delete type[x];

                    // Reset stacks
                    } else {
                        stack.total = null;
                        stack.cumulative = null;
                    }
                });
            });
        }
    }

    /**
     * @private
     */
    public renderStackTotals(): void {
        const stacking = this;
        const axis = stacking.axis;
        const chart = axis.chart;
        const renderer = chart.renderer;
        const stacks = stacking.stacks;
        const stackLabelsAnim = axis.options.stackLabels.animation;
        const animationConfig = getDeferredAnimation(chart, stackLabelsAnim);
        const stackTotalGroup = stacking.stackTotalGroup = (
            stacking.stackTotalGroup ||
            renderer
                .g('stack-labels')
                .attr({
                    visibility: 'visible',
                    zIndex: 6,
                    opacity: 0
                })
                .add()
        );

        // plotLeft/Top will change when y axis gets wider so we need to
        // translate the stackTotalGroup at every render call. See bug #506
        // and #516
        stackTotalGroup.translate(chart.plotLeft, chart.plotTop);

        // Render each stack total
        objectEach(stacks, function (
            type: Record<string, Highcharts.StackItem>
        ): void {
            objectEach(type, function (stack: Highcharts.StackItem): void {
                stack.render(stackTotalGroup);
            });
        });
        stackTotalGroup.animate({
            opacity: 1
        }, animationConfig);
    }

}

/**
 * Axis with stacking support.
 * @private
 * @class
 */
class StackingAxis {

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Extends axis with stacking support.
     * @private
     */
    public static compose(AxisClass: typeof Axis): void {

        const axisProto = AxisClass.prototype;

        addEvent(AxisClass, 'init', StackingAxis.onInit);
        addEvent(AxisClass, 'destroy', StackingAxis.onDestroy);

    }

    /**
     * @private
     */
    public static onDestroy(this: Axis): void {
        const stacking = this.stacking;

        if (!stacking) {
            return;
        }

        const stacks = stacking.stacks;

        // Destroy each stack total
        objectEach(stacks, function (
            stack: Record<string, StackItem>,
            stackKey: string
        ): void {
            destroyObjectProperties(stack);

            stacks[stackKey] = null as any;
        });

        if (
            stacking &&
            stacking.stackTotalGroup
        ) {
            stacking.stackTotalGroup.destroy();
        }
    }

    /**
     * @private
     */
    public static onInit(this: Axis): void {
        const axis = this;
        if (!axis.stacking) {
            axis.stacking = new StackingAxisAdditions(axis as StackingAxis);
        }
    }
}

interface StackingAxis extends Axis {
    stacking: StackingAxisAdditions;
}

export default StackingAxis;
