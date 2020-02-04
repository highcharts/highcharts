/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  Extension to the VML Renderer
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../parts/Globals.js';
import U from '../parts/Utilities.js';
var addEvent = U.addEvent;
import '../parts/Axis.js';
import '../parts/SvgRenderer.js';
var Axis = H.Axis, SVGRenderer = H.SVGRenderer, VMLRenderer = H.VMLRenderer;
if (VMLRenderer) {
    H.setOptions({ animate: false });
    VMLRenderer.prototype.face3d = SVGRenderer.prototype.face3d;
    VMLRenderer.prototype.polyhedron = SVGRenderer.prototype.polyhedron;
    VMLRenderer.prototype.elements3d = SVGRenderer.prototype.elements3d;
    VMLRenderer.prototype.element3d = SVGRenderer.prototype.element3d;
    VMLRenderer.prototype.cuboid = SVGRenderer.prototype.cuboid;
    VMLRenderer.prototype.cuboidPath = SVGRenderer.prototype.cuboidPath;
    VMLRenderer.prototype.toLinePath = SVGRenderer.prototype.toLinePath;
    VMLRenderer.prototype.toLineSegments = SVGRenderer.prototype.toLineSegments;
    VMLRenderer.prototype.arc3d = function (shapeArgs) {
        var result = SVGRenderer.prototype.arc3d.call(this, shapeArgs);
        result.css({ zIndex: result.zIndex });
        return result;
    };
    H.VMLRenderer.prototype.arc3dPath = H.SVGRenderer.prototype.arc3dPath;
    /* eslint-disable no-invalid-this */
    addEvent(Axis, 'render', function () {
        // VML doesn't support a negative z-index
        if (this.sideFrame) {
            this.sideFrame.css({ zIndex: 0 });
            this.sideFrame.front.attr({
                fill: this.sideFrame.color
            });
        }
        if (this.bottomFrame) {
            this.bottomFrame.css({ zIndex: 1 });
            this.bottomFrame.front.attr({
                fill: this.bottomFrame.color
            });
        }
        if (this.backFrame) {
            this.backFrame.css({ zIndex: 0 });
            this.backFrame.front.attr({
                fill: this.backFrame.color
            });
        }
    });
    /* eslint-enable no-invalid-this */
}
