/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
import BaseSeries from '../../Core/Series/Series.js';
import multipleLinesMixin from '../../Mixins/MultipleLines.js';
import requiredIndicator from '../../Mixins/IndicatorRequired.js';
import U from '../../Core/Utilities.js';
var merge = U.merge;
// im port './AroonIndicator.js';
var AROON = BaseSeries.seriesTypes.aroon;
/**
 * The Aroon Oscillator series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.aroonoscillator
 *
 * @augments Highcharts.Series
 */
BaseSeries.seriesType('aroonoscillator', 'aroon', 
/**
 * Aroon Oscillator. This series requires the `linkedTo` option to be set
 * and should be loaded after the `stock/indicators/indicators.js` and
 * `stock/indicators/aroon.js`.
 *
 * @sample {highstock} stock/indicators/aroon-oscillator
 *         Aroon Oscillator
 *
 * @extends      plotOptions.aroon
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, aroonDown, colorAxis, compare, compareBase,
 *               joinBy, keys, navigatorOptions, pointInterval,
 *               pointIntervalUnit, pointPlacement, pointRange, pointStart,
 *               showInNavigator, stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/aroon
 * @requires     stock/indicators/aroon-oscillator
 * @optionparent plotOptions.aroonoscillator
 */
{
    /**
     * Paramters used in calculation of aroon oscillator series points.
     *
     * @excluding periods, index
     */
    params: {
        /**
         * Period for Aroon Oscillator
         *
         * @since   7.0.0
         * @product highstock
         */
        period: 25
    },
    tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span><b> {series.name}</b>: {point.y}'
    }
}, 
/**
 * @lends Highcharts.Series#
 */
merge(multipleLinesMixin, {
    nameBase: 'Aroon Oscillator',
    pointArrayMap: ['y'],
    pointValKey: 'y',
    linesApiNames: [],
    init: function () {
        var args = arguments, ctx = this;
        requiredIndicator.isParentLoaded(AROON, 'aroon', ctx.type, function (indicator) {
            indicator.prototype.init.apply(ctx, args);
            return;
        });
    },
    getValues: function (series, params) {
        // 0- date, 1- Aroon Oscillator
        var ARO = [], xData = [], yData = [], aroon, aroonUp, aroonDown, oscillator, i;
        aroon = AROON.prototype.getValues.call(this, series, params);
        for (i = 0; i < aroon.yData.length; i++) {
            aroonUp = aroon.yData[i][0];
            aroonDown = aroon.yData[i][1];
            oscillator = aroonUp - aroonDown;
            ARO.push([aroon.xData[i], oscillator]);
            xData.push(aroon.xData[i]);
            yData.push(oscillator);
        }
        return {
            values: ARO,
            xData: xData,
            yData: yData
        };
    }
}));
/**
 * An `Aroon Oscillator` series. If the [type](#series.aroonoscillator.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.aroonoscillator
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, aroonDown, colorAxis, compare, compareBase, dataParser,
 *            dataURL, joinBy, keys, navigatorOptions, pointInterval,
 *            pointIntervalUnit, pointPlacement, pointRange, pointStart,
 *            showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/aroon
 * @requires  stock/indicators/aroon-oscillator
 * @apioption series.aroonoscillator
 */
''; // adds doclet above to the transpiled file
