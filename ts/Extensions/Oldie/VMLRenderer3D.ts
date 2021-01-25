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

import type ColorType from '../../Core/Color/ColorType';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGRenderer3D from '../../Core/Renderer/SVG/SVGRenderer3D';
import Axis from '../../Core/Axis/Axis.js';
import U from '../../Core/Utilities.js';
const { setOptions } = U;
import VMLAxis3D from './VMLAxis3D.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface VMLElement {
            color?: ColorType;
            front?: VMLElement;
        }
        interface VMLRenderer {
            arc3dPath: SVGRenderer['arc3dPath'];
            cuboid: SVGRenderer['cuboid'];
            cuboidPath: SVGRenderer['cuboidPath'];
            element3d: SVGRenderer['element3d'];
            elements3d: SVGRenderer['elements3d'];
            face3d: SVGRenderer['face3d'];
            polyhedron: SVGRenderer['polyhedron'];
            toLinePath: SVGRenderer['toLinePath'];
            toLineSegments: SVGRenderer['toLineSegments'];
            arc3d(shapeArgs: SVGAttributes): VMLElement;
        }
    }
}

class VMLRenderer3D {

    /* *
     *
     *  Static Properties
     *
     * */

    public static compose(vmlClass: typeof Highcharts.VMLRenderer, svgClass: typeof SVGRenderer3D): void {
        const svgProto = svgClass.prototype;
        const vmlProto = vmlClass.prototype;

        setOptions({ animate: false } as any);

        vmlProto.face3d = svgProto.face3d;
        vmlProto.polyhedron = svgProto.polyhedron;

        vmlProto.elements3d = svgProto.elements3d;
        vmlProto.element3d = svgProto.element3d;
        vmlProto.cuboid = svgProto.cuboid;
        vmlProto.cuboidPath = svgProto.cuboidPath;

        vmlProto.toLinePath = svgProto.toLinePath;
        vmlProto.toLineSegments = svgProto.toLineSegments;

        vmlProto.arc3d = function (
            this: Highcharts.VMLRenderer,
            shapeArgs: SVGAttributes
        ): Highcharts.VMLElement {
            var result = svgProto.arc3d.call(this, shapeArgs);

            result.css({ zIndex: result.zIndex });
            return result as any;
        };

        vmlProto.arc3dPath = svgProto.arc3dPath;

        VMLAxis3D.compose(Axis);
    }
}

export default VMLRenderer3D;
