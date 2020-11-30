/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
import BaseSeries from '../../Core/Series/Series.js';
const {
    seriesTypes: {
        line: {
            prototype: {
                pointClass: LinePoint
            }
        }
    }
} = BaseSeries;

/* *
 *
 *  Class
 *
 * */

class GaugePoint extends LinePoint {

    /* *
     *
     *  Properties
     *
     * */

    public dial?: SVGElement;
    public options: GaugePointOptions = void 0 as any;
    public series: GaugeSeries = void 0 as any;
    public shapeArgs: SVGAttributes = void 0 as any;


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
 *  Default export
 *
 * */

export default GaugePoint;
