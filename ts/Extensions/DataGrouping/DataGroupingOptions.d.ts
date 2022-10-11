/* *
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

import type { ApproximationKeyValue } from './ApproximationType';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        dataGrouping?: DataGroupingOptions;
    }
}

export type DataGroupingAnchor = ('start'|'middle'|'end');

export type DataGroupingAnchorExtremes = (
    'start'|'middle'|'end'|'firstPoint'|'lastPoint'
);

export interface DataGroupingOptions {
    anchor?: DataGroupingAnchor;
    approximation?: (ApproximationKeyValue|Function);
    dateTimeLabelFormats?: Record<string, Array<string>>;
    enabled?: boolean;
    firstAnchor?: DataGroupingAnchorExtremes;
    forced?: boolean;
    groupAll?: boolean;
    groupPixelWidth?: number;
    lastAnchor?: DataGroupingAnchorExtremes;
    smoothed?: boolean;
    units?: Array<[string, (Array<number>|null)]>;
}

/* *
 *
 *  Default Export
 *
 * */

export default DataGroupingOptions;
