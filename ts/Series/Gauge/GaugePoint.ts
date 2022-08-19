/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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
import type PointType from '../../Core/Series/Point';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const Point: typeof PointType = SeriesRegistry.series.prototype.pointClass;

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
    public options: GaugePointOptions = void 0 as any;
    public series: GaugeSeries = void 0 as any;
    public shapeArgs: SVGAttributes = void 0 as any;


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
