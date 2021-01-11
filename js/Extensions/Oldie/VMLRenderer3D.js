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
import Axis from '../../Core/Axis/Axis.js';
import U from '../../Core/Utilities.js';
var setOptions = U.setOptions;
import VMLAxis3D from './VMLAxis3D.js';
var VMLRenderer3D = /** @class */ (function () {
    function VMLRenderer3D() {
    }
    /* *
     *
     *  Static Properties
     *
     * */
    VMLRenderer3D.compose = function (vmlClass, svgClass) {
        var svgProto = svgClass.prototype;
        var vmlProto = vmlClass.prototype;
        setOptions({ animate: false });
        vmlProto.face3d = svgProto.face3d;
        vmlProto.polyhedron = svgProto.polyhedron;
        vmlProto.elements3d = svgProto.elements3d;
        vmlProto.element3d = svgProto.element3d;
        vmlProto.cuboid = svgProto.cuboid;
        vmlProto.cuboidPath = svgProto.cuboidPath;
        vmlProto.toLinePath = svgProto.toLinePath;
        vmlProto.toLineSegments = svgProto.toLineSegments;
        vmlProto.arc3d = function (shapeArgs) {
            var result = svgProto.arc3d.call(this, shapeArgs);
            result.css({ zIndex: result.zIndex });
            return result;
        };
        vmlProto.arc3dPath = svgProto.arc3dPath;
        VMLAxis3D.compose(Axis);
    };
    return VMLRenderer3D;
}());
export default VMLRenderer3D;
