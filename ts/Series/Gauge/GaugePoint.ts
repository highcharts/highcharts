/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type GaugePointOptions from './GaugePointOptions.js';
import type GaugeSeries from './GaugeSeries.js';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes.js';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement.js';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions.js';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    series: {
        prototype: {
            pointClass: Point
        }
    }
} = SeriesRegistry;

/* *
 *
 *  Class
 *
 * */

class GaugePoint extends Point {

    /* *
     *
     *  Properties
     *
     * */

    /** @internal */
    public dial?: SVGElement;
    public options!: GaugePointOptions;
    /** @internal */
    public series!: GaugeSeries;
    /** @internal */
    public shapeArgs!: SVGAttributes;


    /* *
     *
     *  Functions
     *
     * */


    /**
     * Don't do any hover colors or anything
     * @private
     */
    public setState(state?: StatesOptionsKey): void {
        this.state = state;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default GaugePoint;
