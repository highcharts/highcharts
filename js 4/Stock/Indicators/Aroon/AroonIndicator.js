/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import MultipleLinesComposition from '../MultipleLinesComposition.js';
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
var SMAIndicator = SeriesRegistry.seriesTypes.sma;
import U from '../../../Core/Utilities.js';
var extend = U.extend, merge = U.merge, pick = U.pick;
/* eslint-disable valid-jsdoc */
// Utils
// Index of element with extreme value from array (min or max)
/**
 * @private
 */
function getExtremeIndexInArray(arr, extreme) {
    var extremeValue = arr[0], valueIndex = 0, i;
    for (i = 1; i < arr.length; i++) {
        if (extreme === 'max' && arr[i] >= extremeValue ||
            extreme === 'min' && arr[i] <= extremeValue) {
            extremeValue = arr[i];
            valueIndex = i;
        }
    }
    return valueIndex;
}
/* eslint-enable valid-jsdoc */
/* *
 *
 *  Class
 *
 * */
/**
 * The Aroon series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.aroon
 *
 * @augments Highcharts.Series
 */
var AroonIndicator = /** @class */ (function (_super) {
    __extends(AroonIndicator, _super);
    function AroonIndicator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /* *
         *
         *  Properties
         *
         * */
        _this.data = void 0;
        _this.options = void 0;
        _this.points = void 0;
        return _this;
    }
    /* *
     *
     *  Functions
     *
     * */
    AroonIndicator.prototype.getValues = function (series, params) {
        var period = params.period, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, 
        // 0- date, 1- Aroon Up, 2- Aroon Down
        AR = [], xData = [], yData = [], slicedY, low = 2, high = 1, aroonUp, aroonDown, xLow, xHigh, i;
        // For a N-period, we start from N-1 point, to calculate Nth point
        // That is why we later need to comprehend slice() elements list
        // with (+1)
        for (i = period - 1; i < yValLen; i++) {
            slicedY = yVal.slice(i - period + 1, i + 2);
            xLow = getExtremeIndexInArray(slicedY.map(function (elem) {
                return pick(elem[low], elem);
            }), 'min');
            xHigh = getExtremeIndexInArray(slicedY.map(function (elem) {
                return pick(elem[high], elem);
            }), 'max');
            aroonUp = (xHigh / period) * 100;
            aroonDown = (xLow / period) * 100;
            if (xVal[i + 1]) {
                AR.push([xVal[i + 1], aroonUp, aroonDown]);
                xData.push(xVal[i + 1]);
                yData.push([aroonUp, aroonDown]);
            }
        }
        return {
            values: AR,
            xData: xData,
            yData: yData
        };
    };
    /**
     * Aroon. This series requires the `linkedTo` option to be
     * set and should be loaded after the `stock/indicators/indicators.js`.
     *
     * @sample {highstock} stock/indicators/aroon
     *         Aroon
     *
     * @extends      plotOptions.sma
     * @since        7.0.0
     * @product      highstock
     * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
     *               navigatorOptions, pointInterval, pointIntervalUnit,
     *               pointPlacement, pointRange, pointStart, showInNavigator,
     *               stacking
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/aroon
     * @optionparent plotOptions.aroon
     */
    AroonIndicator.defaultOptions = merge(SMAIndicator.defaultOptions, {
        /**
         * Paramters used in calculation of aroon series points.
         *
         * @excluding index
         */
        params: {
            index: void 0,
            period: 25
        },
        marker: {
            enabled: false
        },
        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span><b> {series.name}</b><br/>Aroon Up: {point.y}<br/>Aroon Down: {point.aroonDown}<br/>'
        },
        /**
         * aroonDown line options.
         */
        aroonDown: {
            /**
             * Styles for an aroonDown line.
             */
            styles: {
                /**
                 * Pixel width of the line.
                 */
                lineWidth: 1,
                /**
                 * Color of the line. If not set, it's inherited from
                 * [plotOptions.aroon.color](#plotOptions.aroon.color).
                 *
                 * @type {Highcharts.ColorString}
                 */
                lineColor: void 0
            }
        },
        dataGrouping: {
            approximation: 'averages'
        }
    });
    return AroonIndicator;
}(SMAIndicator));
extend(AroonIndicator.prototype, {
    areaLinesNames: [],
    linesApiNames: ['aroonDown'],
    nameBase: 'Aroon',
    pointArrayMap: ['y', 'aroonDown'],
    pointValKey: 'y'
});
MultipleLinesComposition.compose(AroonIndicator);
SeriesRegistry.registerSeriesType('aroon', AroonIndicator);
/* *
 *
 *  Default Export
 *
 * */
export default AroonIndicator;
/**
 * A Aroon indicator. If the [type](#series.aroon.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.aroon
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, compare, compareBase, dataParser, dataURL,
 *            joinBy, keys, navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/aroon
 * @apioption series.aroon
 */
''; // to avoid removal of the above jsdoc
