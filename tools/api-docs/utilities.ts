/* *
 *
 *  (c) Highsoft AS
 *
 * */


/* *
 *
 *  Constants
 *
 * */


const CamelCaseMap: Record<string, string> = {
    'PointOptions': 'series.line.data',
    'SeriesOptions': 'plotOptions.series'
};


const CamelPointPattern = /^([A-Z][a-z]*)PointOptions$/su;


const CamelSeriesPattern = /^([A-Z][a-z]*)SeriesOptions$/su;


const SeriesCaseMap: Record<string, string> = {
    'abands': 'ABands',
    'ad': 'AD',
    'ao': 'AO',
    'apo': 'APO',
    'arcdiagram': 'ArcDiagram',
    'area3d': 'Area3D',
    'arearange': 'AreaRange',
    'areaspline': 'AreaSpline',
    'areasplinerange': 'AreaSplineRange',
    'aroonoscillator': 'AroonOscillator',
    'atr': 'ATR',
    'bb': 'BB',
    'boxplot': 'BoxPlot',
    'cci': 'CCI',
    'cmf': 'CMF',
    'cmo': 'CMO',
    'column3d': 'Column3D',
    'columnpyramid': 'ColumnPyramid',
    'columnrange': 'ColumnRange',
    'dema': 'DEMA',
    'dependencywheel': 'DependencyWheel',
    'disparityindex': 'DisparityIndex',
    'dmi': 'DMI',
    'dotplot': 'DotPlot',
    'dpo': 'DPO',
    'ema': 'EMA',
    'errorbar': 'ErrorBar',
    'flowmap': 'FlowMap',
    'funnel3d': 'Funnel3D',
    'geoheatmap': 'GeoHeatmap',
    'heikinashi': 'HeikinAshi',
    'hlc': 'HLC',
    'hollowcandlestick': 'HollowCandlestick',
    'ikh': 'IKH',
    'keltnerchannels': 'KeltnerChannels',
    'linearregression': 'LinearRegression',
    'linearregressionangle': 'LinearRegressionAngle',
    'linearregressionintercept': 'LinearRegressionIntercept',
    'linearregressionslopes': 'LinearRegressionSlopes',
    'macd': 'MACD',
    'mapbubble': 'MapBubble',
    'mapline': 'MapLine',
    'mappoint': 'MapPoint',
    'mfi': 'MFI',
    'natr': 'NATR',
    'obv': 'OBV',
    'ohlc': 'OHLC',
    'packedbubble': 'PackedBubble',
    'pc': 'PC',
    'pivotpoints': 'PivotPoints',
    'ppo': 'PPO',
    'priceenvelopes': 'PriceEnvelopes',
    'psar': 'PSAR',
    'pyramid3d': 'Pyramid3D',
    'roc': 'ROC',
    'rsi': 'RSI',
    'scatter3d': 'Scatter3D',
    'slowstochastic': 'SlowStochastic',
    'sma': 'SMA',
    'solidgauge': 'SolidGauge',
    'tema': 'TEMA',
    'tiledwebmap': 'TiledWebMap',
    'trendline': 'TrendLine',
    'trix': 'TRIX',
    'variablepie': 'VariablePie',
    'vbp': 'VBP',
    'vwap': 'VWAP',
    'williamsr': 'WilliamsR',
    'wma': 'WMA',
    'xrange': 'XRange'
}


/* *
 *
 *  Functions
 *
 * */


function getCamelCaseSeriesName(
    seriesOptionName: string
): string {
    return (
        SeriesCaseMap[seriesOptionName] ||
        (seriesOptionName[0].toUpperCase() + seriesOptionName.substring(1))
    );
}


function getOptionName(
    camelCaseName: string
): string {

    if (CamelCaseMap[camelCaseName]) {
        return CamelCaseMap[camelCaseName];
    }

    if (
        camelCaseName.endsWith('IndicatorOptions') ||
        camelCaseName.endsWith('SeriesOptions')
    ) {
        if (CamelSeriesPattern.test(camelCaseName)) {
            return 'plotOptions.' + camelCaseName
                .replace(CamelSeriesPattern, '$1')
                .toLowerCase();
        }
        const seriesCamel = camelCaseName
            .replace('IndicatorOptions', '')
            .replace('SeriesOptions', '');
        for (const seriesCase of Object.entries(SeriesCaseMap)) {
            if (seriesCase[1] === seriesCamel) {
                return seriesCase[0];
            }
        }
    }

    if (camelCaseName.endsWith('PointOptions')) {
        if (CamelSeriesPattern.test(camelCaseName)) {
            return 'series.' + camelCaseName
                .replace(CamelPointPattern, '$1')
                .toLowerCase() +
                '.data';
        }
        const pointCamel = camelCaseName.replace('PointOptions', '');
        for (const seriesCase of Object.entries(SeriesCaseMap)) {
            if (seriesCase[1] === pointCamel) {
                return seriesCase[0];
            }
        }
    }

    if (
        camelCaseName.endsWith('Options') &&
        camelCaseName !== 'Options'
    ) {
        camelCaseName = camelCaseName.substring(0, camelCaseName.length - 7);
    }

    return (
        CamelCaseMap[camelCaseName] ||
        camelCaseName[0].toLowerCase() + camelCaseName.substring(1)
    );
}


/* *
 *
 *  Default Export
 *
 * */


export default {
    getCamelCaseSeriesName,
    getOptionName
};
