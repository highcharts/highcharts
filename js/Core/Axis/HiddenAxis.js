/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
/**
 * @private
 * @class
 */
var HiddenAxis = /** @class */ (function () {
    function HiddenAxis() {
    }
    /**
     * Augments methods for the x axis in order to hide it completely. Used for
     * the X axis in gauges
     *
     * @private
     *
     * @param {Highcharts.Axis} axis
     * Radial axis to augment.
     */
    HiddenAxis.init = function (axis) {
        axis.getOffset = function () { };
        axis.redraw = function () {
            this.isDirty = false; // prevent setting Y axis dirty
        };
        axis.render = function () {
            this.isDirty = false; // prevent setting Y axis dirty
        };
        axis.createLabelCollector = function () {
            return function () {
                return;
            };
        };
        axis.setScale = function () { };
        axis.setCategories = function () { };
        axis.setTitle = function () { };
        axis.isHidden = true;
    };
    return HiddenAxis;
}());
export default HiddenAxis;
