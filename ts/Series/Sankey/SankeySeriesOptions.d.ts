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
import type Templating from '../../Core/Templating';
import type NodesComposition from '../NodesComposition';
import type SankeyDataLabelOptions from './SankeyDataLabelOptions';
import type SankeyPoint from './SankeyPoint';
import type SankeySeries from './SankeySeries';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type TooltipOptions from '../../Core/TooltipOptions';

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

export interface SankeySeriesOptions extends ColumnSeriesOptions, NodesComposition.SeriesCompositionOptions {
    curveFactor?: number;
    dataLabels?: SankeyDataLabelOptions;
    height?: number;
    inactiveOtherPoints?: boolean;
    levels?: Array<SankeySeriesLevelOptions>;
    linkColorMode?: ('from'|'gradient'|'to');
    linkOpacity?: number;
    mass?: undefined;
    minLinkWidth?: number;
    nodeAlignment?: ('top'|'center'|'bottom')
    nodePadding?: number;
    nodes?: Array<SankeySeriesNodeOptions>;
    nodeWidth?: number;
    states?: SeriesStatesOptions<SankeySeries>;
    tooltip?: SankeySeriesTooltipOptions;
    width?: number;
}

export interface SankeySeriesTooltipOptions extends Partial<TooltipOptions> {
    nodeFormat?: string;
    nodeFormatter?: Templating.FormatterCallback<SankeyPoint>;
}

/* *
 *
 *  Default Export
 *
 * */

export default SankeySeriesOptions;
