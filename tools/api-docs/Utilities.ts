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
};

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

    if (camelCaseName.endsWith('IndicatorOptions')) {
        return 'plotOptions.' + camelCaseName
            .substring(0, camelCaseName.length - 16)
            .toLowerCase();
    }

    if (camelCaseName.endsWith('PointOptions')) {
        if (camelCaseName === 'PointOptions') {
            return 'series.line.data';
        }
        return 'series.' + camelCaseName
            .substring(0, camelCaseName.length - 12)
            .toLowerCase() + '.data';
    }

    if (camelCaseName.endsWith('SeriesOptions')) {
        if (camelCaseName === 'SeriesOptions') {
            return 'plotOptions.series';
        }
        return 'plotOptions.' + camelCaseName
            .substring(0, camelCaseName.length - 13)
            .toLowerCase();
    }

    if (
        camelCaseName.endsWith('Options') &&
        camelCaseName !== 'Options'
    ) {
        camelCaseName = camelCaseName.substring(0, camelCaseName.length - 7);
    }

    return (
        CamelCaseMap[camelCaseName] ||
        (camelCaseName[0].toLowerCase() + camelCaseName.substring(1))
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
