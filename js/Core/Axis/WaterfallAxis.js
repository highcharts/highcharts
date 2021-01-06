/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
import StackItem from '../../Extensions/Stacking.js';
import U from '../Utilities.js';
var addEvent = U.addEvent, objectEach = U.objectEach;
/**
 * @private
 */
var WaterfallAxis;
(function (WaterfallAxis) {
    /* *
     *
     *  Interfaces
     *
     * */
    /* *
     *
     *  Classes
     *
     * */
    /**
     * @private
     */
    var Composition = /** @class */ (function () {
        /* eslint-disable no-invalid-this, valid-jsdoc */
        /* *
         *
         *  Constructors
         *
         * */
        /**
         * @private
         */
        function Composition(axis) {
            this.axis = axis;
            this.stacks = {
                changed: false
            };
        }
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
        Composition.prototype.renderStackTotals = function () {
            var yAxis = this.axis, waterfallStacks = yAxis.waterfall.stacks, stackTotalGroup = yAxis.stacking && yAxis.stacking.stackTotalGroup, dummyStackItem = new StackItem(yAxis, yAxis.options.stackLabels, false, 0, void 0);
            this.dummyStackItem = dummyStackItem;
            // Render each waterfall stack total
            objectEach(waterfallStacks, function (type) {
                objectEach(type, function (stackItem) {
                    dummyStackItem.total = stackItem.stackTotal;
                    if (stackItem.label) {
                        dummyStackItem.label = stackItem.label;
                    }
                    StackItem.prototype.render.call(dummyStackItem, stackTotalGroup);
                    stackItem.label = dummyStackItem.label;
                    delete dummyStackItem.label;
                });
            });
            dummyStackItem.total = null;
        };
        return Composition;
    }());
    WaterfallAxis.Composition = Composition;
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable no-invalid-this, valid-jsdoc */
    /**
     * @private
     */
    function compose(AxisClass, ChartClass) {
        addEvent(AxisClass, 'init', onInit);
        addEvent(AxisClass, 'afterBuildStacks', onAfterBuildStacks);
        addEvent(AxisClass, 'afterRender', onAfterRender);
        addEvent(ChartClass, 'beforeRedraw', onBeforeRedraw);
    }
    WaterfallAxis.compose = compose;
    /**
     * @private
     */
    function onAfterBuildStacks() {
        var axis = this;
        var stacks = axis.waterfall.stacks;
        if (stacks) {
            stacks.changed = false;
            delete stacks.alreadyChanged;
        }
    }
    /**
     * @private
     */
    function onAfterRender() {
        var axis = this;
        var stackLabelOptions = axis.options.stackLabels;
        if (stackLabelOptions && stackLabelOptions.enabled &&
            axis.waterfall.stacks) {
            axis.waterfall.renderStackTotals();
        }
    }
    /**
     * @private
     */
    function onBeforeRedraw() {
        var axes = this.axes, series = this.series, i = series.length;
        while (i--) {
            if (series[i].options.stacking) {
                axes.forEach(function (axis) {
                    if (!axis.isXAxis) {
                        axis.waterfall.stacks.changed = true;
                    }
                });
                i = 0;
            }
        }
    }
    /**
     * @private
     */
    function onInit() {
        var axis = this;
        if (!axis.waterfall) {
            axis.waterfall = new Composition(axis);
        }
    }
})(WaterfallAxis || (WaterfallAxis = {}));
/* *
 *
 *  Default Export
 *
 * */
export default WaterfallAxis;
