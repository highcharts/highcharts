/* *
 *
 *  (c) 2014-2021 Highsoft AS
 *
 *  Authors: Jon Arild Nygard / Oystein Moseng
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type {
    AlignValue,
    VerticalAlignValue
} from '../../Core/Renderer/AlignObject';
import type ButtonThemeObject from '../../Core/Renderer/SVG/ButtonThemeObject';
import type ColorType from '../../Core/Color/ColorType';
import type DashStyleValue from '../../Core/Renderer/DashStyleValue';
import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';
import type {
    SeriesOptions,
    SeriesStatesOptions
} from '../../Core/Series/SeriesOptions';
import type TreemapPointOptions from './TreemapPointOptions';
import type TreemapSeries from './TreemapSeries';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        cropThreshold?: number;
    }
}

export type TreemapSeriesLayoutAlgorithmValue = ('sliceAndDice'|'stripes'|'squarified'|'strip');

export type TreemapSeriesLayoutStartingDirectionValue = ('vertical'|'horizontal');

export interface TreemapSeriesLevelsColorVariationOptions {
    key?: string;
    to?: number;
}

export interface TreemapSeriesLevelsOptions extends Omit<SeriesOptions, ('data'|'levels')> {
    colorVariation?: TreemapSeriesLevelsColorVariationOptions;
}

export interface TreemapSeriesOptions extends ScatterSeriesOptions {
    allowDrillToNode?: boolean;
    allowTraversingTree?: boolean;
    alternateStartingDirection?: boolean;
    borderDashStyle?: DashStyleValue;
    borderRadius?: number;
    brightness?: number;
    colors?: Array<ColorType>;
    data?: Array<TreemapPointOptions>;
    drillUpButton?: TreemapSeriesUpButtonOptions;
    ignoreHiddenPoint?: boolean;
    interactByLeaf?: boolean;
    layoutAlgorithm?: TreemapSeriesLayoutAlgorithmValue;
    layoutStartingDirection?: TreemapSeriesLayoutStartingDirectionValue;
    levelIsConstant?: boolean;
    levels?: Array<TreemapSeriesLevelsOptions>;
    setRootNode?: Function;
    sortIndex?: number;
    states?: SeriesStatesOptions<TreemapSeries>;
    traverseUpButton?: TreemapSeriesUpButtonOptions;
}

export interface TreemapSeriesUpButtonOptions {
    position?: TreemapSeriesUpButtonPositionOptions;
    relativeTo?: string;
    text?: string;
    theme?: ButtonThemeObject;
}

export interface TreemapSeriesUpButtonPositionOptions {
    align?: AlignValue;
    verticalAlign?: VerticalAlignValue;
    x?: number;
    y?: number;
}

export default TreemapSeriesOptions;
