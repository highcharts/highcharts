/* *
 *
 *  Experimental Highcharts module which enables visualization of a word cloud.
 *
 *  (c) 2016-2021 Highsoft AS
 *  Authors: Jon Arild Nygard
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 * */

/* *
 *
 *  Imports
 *
 * */
import type ColumnSeriesOptions from '../Column/ColumnSeriesOptions';
import type CSSObject from '../../Core/Renderer/CSSObject';
import type {
    PointOptions,
    PointShortOptions
} from '../../Core/Series/PointOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type WordcloudSeries from './WordcloudSeries';
import type WordcloudPointOptions from './WordcloudPointOptions';


/* *
 *
 *  Declarations
 *
 * */
export interface WordcloudSeriesOptions extends ColumnSeriesOptions {
    allowExtendPlayingField?: boolean;
    data?: Array<(PointOptions|PointShortOptions|WordcloudPointOptions)>;
    maxFontSize?: number;
    minFontSize?: number;
    placementStrategy?: string;
    rotation?: WordcloudSeriesRotationOptions;
    spiral?: string;
    states?: SeriesStatesOptions<WordcloudSeries>;
    style?: CSSObject;
}

export interface WordcloudSeriesRotationOptions {
    from?: number;
    orientations?: number;
    to?: number;
}

/* *
 *
 *  Default Export
 *
 * */
export default WordcloudSeriesOptions;
