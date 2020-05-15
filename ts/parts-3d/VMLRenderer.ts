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

import Axis from '../parts/Axis.js';
import H from '../parts/Globals.js';
import SVGRenderer from '../parts/SVGRenderer.js';
import VMLAxis3D from './VMLAxis3D.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface VMLElement {
            color?: (ColorString|GradientColorObject|PatternObject);
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

var VMLRenderer = H.VMLRenderer;

if (VMLRenderer) {

    H.setOptions({ animate: false } as any);

    VMLRenderer.prototype.face3d = SVGRenderer.prototype.face3d;
    VMLRenderer.prototype.polyhedron = SVGRenderer.prototype.polyhedron;

    VMLRenderer.prototype.elements3d = SVGRenderer.prototype.elements3d;
    VMLRenderer.prototype.element3d = SVGRenderer.prototype.element3d;
    VMLRenderer.prototype.cuboid = SVGRenderer.prototype.cuboid;
    VMLRenderer.prototype.cuboidPath = SVGRenderer.prototype.cuboidPath;

    VMLRenderer.prototype.toLinePath = SVGRenderer.prototype.toLinePath;
    VMLRenderer.prototype.toLineSegments = SVGRenderer.prototype.toLineSegments;

    VMLRenderer.prototype.arc3d = function (
        this: Highcharts.VMLRenderer,
        shapeArgs: Highcharts.SVGAttributes
    ): Highcharts.VMLElement {
        var result = SVGRenderer.prototype.arc3d.call(this, shapeArgs);

        result.css({ zIndex: result.zIndex });
        return result as any;
    };

    H.VMLRenderer.prototype.arc3dPath = SVGRenderer.prototype.arc3dPath;

    VMLAxis3D.compose(Axis);

}
