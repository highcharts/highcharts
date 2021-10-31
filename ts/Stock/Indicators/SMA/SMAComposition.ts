/* *
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

import type LineSeriesOptions from '../../../Series/Line/LineSeriesOptions';
import type SMAOptions from './SMAOptions';
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
const {
    series: Series,
    seriesTypes: {
        ohlc: { prototype: ohlcProto }
    }
} = SeriesRegistry;
import U from '../../../Core/Utilities.js';
const { addEvent, extend } = U;

/* *
 *
 *  Composition
 *
 * */
