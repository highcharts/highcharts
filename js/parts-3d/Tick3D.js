/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  Extenstion for 3d axes
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import U from '../parts/Utilities.js';
var addEvent = U.addEvent, extend = U.extend, wrap = U.wrap;
/* eslint-disable valid-jsdoc */
/**
 * Tick with 3D support
 * @private
 * @class
 */
var Tick3D = /** @class */ (function () {
    function Tick3D() {
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * @private
     */
    Tick3D.compose = function (TickClass) {
        addEvent(TickClass, 'afterGetLabelPosition', Tick3D.onAfterGetLabelPosition);
        var tickProto = TickClass.prototype;
        wrap(tickProto, 'getMarkPath', Tick3D.wrapGetMarkPath);
    };
    /**
     * @private
     */
    Tick3D.onAfterGetLabelPosition = function (e) {
        var axis3D = this.axis.axis3D;
        if (axis3D) {
            extend(e.pos, axis3D.fix3dPosition(e.pos));
        }
    };
    /**
     * @private
     */
    Tick3D.wrapGetMarkPath = function (proceed) {
        var tick = this;
        var axis = tick.axis;
        var axis3D = axis.axis3D;
        var path = proceed.apply(tick, [].slice.call(arguments, 1));
        var pArr = [
            { x: path[1], y: path[2], z: 0 },
            { x: path[4], y: path[5], z: 0 }
        ];
        if (axis3D) {
            axis3D.fix3dPosition(pArr[0]);
            axis3D.fix3dPosition(pArr[1]);
        }
        return axis.chart.renderer.toLineSegments(pArr);
    };
    return Tick3D;
}());
export default Tick3D;
