/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  Extension to the VML Renderer
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
import U from '../../Core/Utilities.js';
var addEvent = U.addEvent;
/* *
 *
 *  Class
 *
 * */
/* eslint-disable valid-jsdoc */
var VMLAxis3DAdditions = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    function VMLAxis3DAdditions(axis) {
        this.axis = axis;
    }
    return VMLAxis3DAdditions;
}());
var VMLAxis3D = /** @class */ (function () {
    function VMLAxis3D() {
    }
    /* *
     *
     *  Static Properties
     *
     * */
    VMLAxis3D.compose = function (AxisClass) {
        AxisClass.keepProps.push('vml');
        addEvent(AxisClass, 'destroy', VMLAxis3D.onDestroy);
        addEvent(AxisClass, 'init', VMLAxis3D.onInit);
        addEvent(AxisClass, 'render', VMLAxis3D.onRender);
    };
    /**
     * @private
     */
    VMLAxis3D.onDestroy = function () {
        var axis = this, vml = axis.vml;
        if (vml) {
            var el_1;
            [
                'backFrame',
                'bottomFrame',
                'sideFrame'
            ].forEach(function (prop) {
                el_1 = vml[prop];
                if (el_1) {
                    vml[prop] = el_1.destroy();
                }
            }, this);
        }
    };
    /**
     * @private
     */
    VMLAxis3D.onInit = function () {
        var axis = this;
        if (!axis.vml) {
            axis.vml = new VMLAxis3DAdditions(axis);
        }
    };
    /**
     * @private
     */
    VMLAxis3D.onRender = function () {
        var axis = this;
        var vml = axis.vml;
        // VML doesn't support a negative z-index
        if (vml.sideFrame) {
            vml.sideFrame.css({ zIndex: 0 });
            vml.sideFrame.front.attr({
                fill: vml.sideFrame.color
            });
        }
        if (vml.bottomFrame) {
            vml.bottomFrame.css({ zIndex: 1 });
            vml.bottomFrame.front.attr({
                fill: vml.bottomFrame.color
            });
        }
        if (vml.backFrame) {
            vml.backFrame.css({ zIndex: 0 });
            vml.backFrame.front.attr({
                fill: vml.backFrame.color
            });
        }
    };
    return VMLAxis3D;
}());
export default VMLAxis3D;
