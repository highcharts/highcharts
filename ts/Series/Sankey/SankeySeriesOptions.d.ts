/* *
 *
 *  Sankey diagram module
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type ColorType from '../../Core/Color/ColorType';
import type ColumnSeriesOptions from '../Column/ColumnSeriesOptions';
import type SankeyDataLabelOptions from './SankeyDataLabelOptions';
import type SankeyPoint from './SankeyPoint';
import type SankeySeries from './SankeySeries';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface SankeySeriesLevelOptions {
    borderColor?: ColorType;
    borderWidth?: number;
    color?: ColorType;
    colorByPoint?: boolean;
    dataLabels?: SankeyDataLabelOptions;
    level?: number;
    linkOpacity?: number;
    states?: SeriesStatesOptions<SankeySeries>;
}

export interface SankeySeriesNodeOptions {
    color?: ColorType;
    colorIndex?: number;
    column?: number;
    id?: string;
    level?: number;
    name?: string;
    offset?: (number|string);
}


export interface SankeySeriesOptions extends ColumnSeriesOptions, Highcharts.NodesSeriesOptions {
    curveFactor?: number;
    dataLabels?: SankeyDataLabelOptions;
    height?: number;
    inactiveOtherPoints?: boolean;
    levels?: Array<SankeySeriesLevelOptions>;
    linkOpacity?: number;
    mass?: undefined;
    minLinkWidth?: number;
    nodePadding?: number;
    nodes?: Array<SankeySeriesNodeOptions>;
    nodeWidth?: number;
    states?: SeriesStatesOptions<SankeySeries>;
    tooltip?: SankeySeriesTooltipOptions;
    width?: number;
}

export interface SankeySeriesTooltipOptions extends Highcharts.TooltipOptions {
    nodeFormat?: string;
    nodeFormatter?: Highcharts.FormatterCallbackFunction<SankeyPoint>;
}

export default SankeySeriesOptions;
