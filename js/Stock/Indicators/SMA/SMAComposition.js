/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
var Series = SeriesRegistry.series, ohlcProto = SeriesRegistry.seriesTypes.ohlc.prototype;
import U from '../../../Core/Utilities.js';
var addEvent = U.addEvent, extend = U.extend;
/* *
 *
 *  Composition
 *
 * */
addEvent(Series, 'init', function (eventOptions) {
    // eslint-disable-next-line no-invalid-this
    var series = this, options = eventOptions.options;
    if (options.useOhlcData &&
        options.id !== 'highcharts-navigator-series') {
        extend(series, {
            pointValKey: ohlcProto.pointValKey,
            keys: ohlcProto.keys,
            pointArrayMap: ohlcProto.pointArrayMap,
            toYData: ohlcProto.toYData
        });
    }
});
addEvent(Series, 'afterSetOptions', function (e) {
    var options = e.options, dataGrouping = options.dataGrouping;
    if (dataGrouping &&
        options.useOhlcData &&
        options.id !== 'highcharts-navigator-series') {
        dataGrouping.approximation = 'ohlc';
    }
});
