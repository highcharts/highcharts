/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
import U from './Utilities.js';
var addEvent = U.addEvent, destroyObjectProperties = U.destroyObjectProperties, fireEvent = U.fireEvent, objectEach = U.objectEach, pick = U.pick;
/* eslint-disable valid-jsdoc */
/**
 * Adds stacking support to axes.
 * @private
 * @class
 */
var StackingAxisAdditions = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    function StackingAxisAdditions(axis) {
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
    StackingAxisAdditions.prototype.buildStacks = function () {
        var stacking = this;
        var axis = stacking.axis;
        var axisSeries = axis.series;
        var reversedStacks = pick(axis.options.reversedStacks, true);
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
    StackingAxisAdditions.prototype.cleanStacks = function () {
        var stacking = this;
        var axis = stacking.axis;
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
    StackingAxisAdditions.prototype.resetStacks = function () {
        var stacking = this;
        var axis = stacking.axis;
        var stacks = stacking.stacks;
        if (!axis.isXAxis) {
            objectEach(stacks, function (type) {
                objectEach(type, function (stack, key) {
                    // Clean up memory after point deletion (#1044, #4320)
                    if (stack.touched < stacking.stacksTouched) {
                        stack.destroy();
                        delete type[key];
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
    StackingAxisAdditions.prototype.renderStackTotals = function () {
        var stacking = this;
        var axis = stacking.axis;
        var chart = axis.chart;
        var renderer = chart.renderer;
        var stacks = stacking.stacks;
        var stackTotalGroup = stacking.stackTotalGroup = (stacking.stackTotalGroup ||
            renderer
                .g('stack-labels')
                .attr({
                visibility: 'visible',
                zIndex: 6
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
    };
    return StackingAxisAdditions;
}());
/**
 * Axis with stacking support.
 * @private
 * @class
 */
var StackingAxis = /** @class */ (function () {
    function StackingAxis() {
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * Extends axis with stacking support.
     * @private
     */
    StackingAxis.compose = function (AxisClass) {
        var axisProto = AxisClass.prototype;
        addEvent(AxisClass, 'init', StackingAxis.onInit);
        addEvent(AxisClass, 'destroy', StackingAxis.onDestroy);
    };
    /**
     * @private
     */
    StackingAxis.onDestroy = function () {
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
    };
    /**
     * @private
     */
    StackingAxis.onInit = function () {
        var axis = this;
        if (!axis.stacking) {
            axis.stacking = new StackingAxisAdditions(axis);
        }
    };
    return StackingAxis;
}());
export default StackingAxis;
