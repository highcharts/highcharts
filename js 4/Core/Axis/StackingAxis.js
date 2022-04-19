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
import A from '../Animation/AnimationUtilities.js';
var getDeferredAnimation = A.getDeferredAnimation;
import Axis from './Axis.js';
import U from '../Utilities.js';
var addEvent = U.addEvent, destroyObjectProperties = U.destroyObjectProperties, fireEvent = U.fireEvent, isNumber = U.isNumber, objectEach = U.objectEach;
/* *
 *
 *  Composition
 *
 * */
/**
 * @private
 */
var StackingAxis;
(function (StackingAxis) {
    /* *
     *
     *  Declarations
     *
     * */
    /* *
     *
     *  Constants
     *
     * */
    var composedClasses = [];
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
    function compose(AxisClass) {
        if (composedClasses.indexOf(AxisClass) === -1) {
            composedClasses.push(AxisClass);
            addEvent(AxisClass, 'init', onInit);
            addEvent(AxisClass, 'destroy', onDestroy);
        }
        return AxisClass;
    }
    StackingAxis.compose = compose;
    /**
     * @private
     */
    function onDestroy() {
        var stacking = this.stacking;
        if (!stacking) {
            return;
        }
        var stacks = stacking.stacks;
        // Destroy each stack total
        objectEach(stacks, function (stack, stackKey) {
            destroyObjectProperties(stack);
            stacks[stackKey] = null;
        });
        if (stacking &&
            stacking.stackTotalGroup) {
            stacking.stackTotalGroup.destroy();
        }
    }
    /**
     * @private
     */
    function onInit() {
        var axis = this;
        if (!axis.stacking) {
            axis.stacking = new Additions(axis);
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
    var Additions = /** @class */ (function () {
        /* *
        *
        *  Constructors
        *
        * */
        function Additions(axis) {
            this.oldStacks = {};
            this.stacks = {};
            this.stacksTouched = 0;
            this.axis = axis;
        }
        /* *
        *
        *  Functions
        *
        * */
        /**
         * Build the stacks from top down
         * @private
         */
        Additions.prototype.buildStacks = function () {
            var stacking = this;
            var axis = stacking.axis;
            var axisSeries = axis.series;
            var reversedStacks = axis.options.reversedStacks;
            var len = axisSeries.length;
            var actualSeries, i;
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
        };
        /**
         * @private
         */
        Additions.prototype.cleanStacks = function () {
            var stacking = this, axis = stacking.axis;
            var stacks;
            if (!axis.isXAxis) {
                if (stacking.oldStacks) {
                    stacks = stacking.stacks = stacking.oldStacks;
                }
                // reset stacks
                objectEach(stacks, function (type) {
                    objectEach(type, function (stack) {
                        stack.cumulative = stack.total;
                    });
                });
            }
        };
        /**
         * Set all the stacks to initial states and destroy unused ones.
         * @private
         */
        Additions.prototype.resetStacks = function () {
            var stacking = this, axis = stacking.axis, stacks = stacking.stacks;
            if (!axis.isXAxis) {
                objectEach(stacks, function (type) {
                    objectEach(type, function (stack, x) {
                        // Clean up memory after point deletion (#1044, #4320)
                        if (isNumber(stack.touched) &&
                            stack.touched < stacking.stacksTouched) {
                            stack.destroy();
                            delete type[x];
                            // Reset stacks
                        }
                        else {
                            stack.total = null;
                            stack.cumulative = null;
                        }
                    });
                });
            }
        };
        /**
         * @private
         */
        Additions.prototype.renderStackTotals = function () {
            var stacking = this, axis = stacking.axis, chart = axis.chart, renderer = chart.renderer, stacks = stacking.stacks, stackLabelsAnim = axis.options.stackLabels &&
                axis.options.stackLabels.animation, animationConfig = getDeferredAnimation(chart, stackLabelsAnim || false), stackTotalGroup = stacking.stackTotalGroup = (stacking.stackTotalGroup ||
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
            objectEach(stacks, function (type) {
                objectEach(type, function (stack) {
                    stack.render(stackTotalGroup);
                });
            });
            stackTotalGroup.animate({
                opacity: 1
            }, animationConfig);
        };
        return Additions;
    }());
    StackingAxis.Additions = Additions;
})(StackingAxis || (StackingAxis = {}));
/* *
 *
 *  Default Export
 *
 * */
export default StackingAxis;
