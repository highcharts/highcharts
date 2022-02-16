/* *
 *
 *  Arc diagram module
 *
 *  (c) 2021 Piotr Madej, Grzegorz Blachliński
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

import type ArcDiagramSeries from './ArcDiagramSeries';
import type SankeySeriesOptions from '../Sankey/SankeySeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface ArcDiagramSeriesOptions extends SankeySeriesOptions {
    states?: SeriesStatesOptions<ArcDiagramSeries>;
    equalNodes?: boolean;
    centeredLinks?: boolean;
    linkRadius?: number;
    reversed: boolean;
    scale?: number;
    offset: string;
    linkWeight?: number;
}

export default ArcDiagramSeriesOptions;
