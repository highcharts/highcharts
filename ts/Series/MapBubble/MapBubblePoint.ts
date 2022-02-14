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

import MapPoint from '../Map/MapPoint.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        bubble: BubbleSeries,
        map: MapSeries
    }
} = SeriesRegistry;

/* *
 *
 *  Class
 *
 * */

class MapBubblePoint extends BubbleSeries.prototype.pointClass {

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */


    /**
     * @private
     */
    public isValid(): boolean {
        return typeof this.z === 'number';
    }

    public applyOptions = MapSeries.prototype.pointClass.prototype.applyOptions;
    public getProjectedBounds = MapPoint.prototype.getProjectedBounds;

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Default Export
 *
 * */

export default MapBubblePoint;
