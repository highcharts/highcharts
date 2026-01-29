/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type GaugePointOptions from './GaugePointOptions';
import type GaugeSeries from './GaugeSeries';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';

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

    public dial?: SVGElement;
    public options!: GaugePointOptions;
    public series!: GaugeSeries;
    public shapeArgs!: SVGAttributes;


    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Don't do any hover colors or anything
     * @private
     */
    public setState(state?: StatesOptionsKey): void {
        this.state = state;
    }

    /* eslint-enable valid-jsdoc */
}

/* *
 *
 *  Default Export
 *
 * */

export default GaugePoint;
