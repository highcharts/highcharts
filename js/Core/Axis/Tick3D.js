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
import U from '../Utilities.js';
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
        var chart = this.axis.chart;
        var axis3D = this.axis.axis3D;
        var path = proceed.apply(this, [].slice.call(arguments, 1));
        if (axis3D) {
            var start = path[0];
            var end = path[1];
            if (start[0] === 'M' && end[0] === 'L') {
                var pArr = [
                    axis3D.fix3dPosition({ x: start[1], y: start[2], z: 0 }),
                    axis3D.fix3dPosition({ x: end[1], y: end[2], z: 0 })
                ];
                return this.axis.chart.renderer.toLineSegments(pArr);
            }
        }
        return path;
    };
    return Tick3D;
}());
export default Tick3D;
