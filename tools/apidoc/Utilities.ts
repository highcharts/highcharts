/* *
 *
 *  (c) Highsoft AS
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */


/* *
 *
 *  Imports
 *
 * */


import type * as APIDB from '../../../hc-apidoc-backend/';
import type * as DTS from '../libs/DTS';

import * as FS from 'node:fs';


/* *
 *
 *  Declarations
 *
 * */


export interface Properties {
    [key: string]: string;
}


/* *
 *
 *  Constants
 *
 * */


const CAMEL_CASE_OPTION_PATH_MAP: Record<string, string> = {
    'PointOptions': 'series.line.data',
    'SeriesOptions': 'plotOptions.series'
};


const SERIES_TYPE_CAMEL_CASE_MAP: Record<string, string> = {
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


export async function getArgs(
    argv: Array<string> = process.argv
): Promise<APIDB.CLI.Args> {
    const APIDB = await import('../../../hc-apidoc-backend/lib/index.js');

    return APIDB.CLI.getArgs(argv);
}


export function getCamelCaseSeriesName(
    seriesOptionType: string
): string {
    return (
        SERIES_TYPE_CAMEL_CASE_MAP[seriesOptionType] ||
        (seriesOptionType[0].toUpperCase() + seriesOptionType.substring(1))
    );
}


export function getOptionName(
    codeInfo: DTS.CodeInfo
): string {
    let camelCaseName = codeInfo.name;

    if (!camelCaseName) {
        return '';
    }

    if (
        camelCaseName.endsWith('IndicatorOptions') ||
        camelCaseName.endsWith('SeriesOptions')
    ) {
        const seriesCamel = (
            camelCaseName.endsWith('IndicatorOptions') ? 
                camelCaseName.substring(0, camelCaseName.length - 16) :
                camelCaseName.substring(0, camelCaseName.length - 13)
        );

        for (const seriesCase of Object.entries(SERIES_TYPE_CAMEL_CASE_MAP)) {
            if (seriesCase[1] === seriesCamel) {
                return seriesCase[0];
            }
        }
    }

    if (camelCaseName.endsWith('PointOptions')) {
        const pointCamel = camelCaseName.substring(0, 12);

        for (const seriesCase of Object.entries(SERIES_TYPE_CAMEL_CASE_MAP)) {
            if (seriesCase[1] === pointCamel) {
                return seriesCase[0];
            }
        }
    }

    if (
        camelCaseName.endsWith('Options') &&
        camelCaseName !== 'Options' &&
        codeInfo.kind !== 'Property'
    ) {
        camelCaseName = camelCaseName.substring(0, camelCaseName.length - 7);
    }

    return (
        CAMEL_CASE_OPTION_PATH_MAP[camelCaseName] ||
        (camelCaseName[0].toLowerCase() + camelCaseName.substring(1))
    );
}


export async function getProperties(
    filePath: string = 'git-ignore-me.properties'
): Promise<Properties> {
    const fileContent = await FS.promises.readFile(filePath, 'utf8');
    const properties: Properties = {};

    let splitIndex: number;

    for (const line of fileContent.split(/[\n\r]+/gsu)) {
        splitIndex = line.indexOf('=');

        if (splitIndex <= 0) {
            properties[line] = '';
        } else {
            properties[line.substring(0, splitIndex)] =
                line.substring(splitIndex + 1);
        }
    }

    return properties;
}
