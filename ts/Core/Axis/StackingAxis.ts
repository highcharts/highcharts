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

import type Series from '../Series/Series';
import type StackItem from '../../Extensions/Stacking';
import type SVGElement from '../Renderer/SVG/SVGElement';

import A from '../Animation/AnimationUtilities.js';
const { getDeferredAnimation } = A;
import Axis from './Axis.js';
import U from '../Utilities.js';
const { addEvent, destroyObjectProperties, fireEvent, isNumber, objectEach } =
    U;

/* *
 *
 *  Declarations
 *
 * */

declare module './AxisComposition' {
    interface AxisComposition {
        stacking?: StackingAxis.Additions;
    }
}

declare module './AxisType' {
    interface AxisTypeRegistry {
        StackingAxis: StackingAxis.Composition;
    }
}

/* *
 *
 *  Composition
 *
 * */

/**
 * @private
 */
namespace StackingAxis {
    /* *
     *
     *  Declarations
     *
     * */

    export declare class Composition extends Axis {
        stacking: Additions;
    }

    /* *
     *
     *  Constants
     *
     * */

    const composedClasses: Array<Function> = [];

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Extends axis with stacking support.
     * @private
     */
    export function compose<T extends typeof Axis>(
        AxisClass: T
    ): T & typeof Composition {
        if (composedClasses.indexOf(AxisClass) === -1) {
            composedClasses.push(AxisClass);

            addEvent(AxisClass, 'init', onInit);
            addEvent(AxisClass, 'destroy', onDestroy);
        }

        return AxisClass as T & typeof Composition;
    }

    /**
     * @private
     */
    function onDestroy(this: Axis): void {
        const stacking = this.stacking;

        if (!stacking) {
            return;
        }

        const stacks = stacking.stacks;

        // Destroy each stack total
        objectEach(
            stacks,
            function (
                stack: Record<string, StackItem>,
                stackKey: string
            ): void {
                destroyObjectProperties(stack);

                stacks[stackKey] = null as any;
            }
        );

        if (stacking && stacking.stackTotalGroup) {
            stacking.stackTotalGroup.destroy();
        }
    }

    /**
     * @private
     */
    function onInit(this: Axis): void {
        const axis = this;
        if (!axis.stacking) {
            axis.stacking = new Additions(axis as Composition);
        }
    }

    /* *
     *
     *  Class
     *
     * */

    /**
     * Adds stacking support to axes.
     * @private
     * @class
     */
    export class Additions {
        /* *
         *
         *  Constructors
         *
         * */

        public constructor(axis: Composition) {
            this.axis = axis;
        }

        /* *
         *
         *  Properties
         *
         * */

        axis: Composition;
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
            const reversedStacks = axis.options.reversedStacks;
            const len = axisSeries.length;

            let actualSeries: Series, i: number;

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
            const stacking = this,
                axis = stacking.axis;

            let stacks;

            if (!axis.isXAxis) {
                if (stacking.oldStacks) {
                    stacks = stacking.stacks = stacking.oldStacks;
                }

                // reset stacks
                objectEach(
                    stacks,
                    function (type: Record<string, StackItem>): void {
                        objectEach(type, function (stack: StackItem): void {
                            stack.cumulative = stack.total;
                        });
                    }
                );
            }
        }

        /**
         * Set all the stacks to initial states and destroy unused ones.
         * @private
         */
        public resetStacks(): void {
            const stacking = this,
                { axis, stacks } = stacking;

            if (!axis.isXAxis) {
                objectEach(stacks, (type): void => {
                    objectEach(type, (stack, x): void => {
                        // Clean up memory after point deletion (#1044, #4320)
                        if (
                            isNumber(stack.touched) &&
                            stack.touched < stacking.stacksTouched
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
            const stacking = this,
                axis = stacking.axis,
                chart = axis.chart,
                renderer = chart.renderer,
                stacks = stacking.stacks,
                stackLabelsAnim =
                    axis.options.stackLabels &&
                    axis.options.stackLabels.animation,
                animationConfig = getDeferredAnimation(
                    chart,
                    stackLabelsAnim || false
                ),
                stackTotalGroup = (stacking.stackTotalGroup =
                    stacking.stackTotalGroup ||
                    renderer
                        .g('stack-labels')
                        .attr({
                            visibility: 'visible',
                            zIndex: 6,
                            opacity: 0
                        })
                        .add());

            // plotLeft/Top will change when y axis gets wider so we need to
            // translate the stackTotalGroup at every render call. See bug #506
            // and #516
            stackTotalGroup.translate(chart.plotLeft, chart.plotTop);

            // Render each stack total
            objectEach(
                stacks,
                function (type: Record<string, Highcharts.StackItem>): void {
                    objectEach(
                        type,
                        function (stack: Highcharts.StackItem): void {
                            stack.render(stackTotalGroup);
                        }
                    );
                }
            );
            stackTotalGroup.animate(
                {
                    opacity: 1
                },
                animationConfig
            );
        }
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default StackingAxis;
