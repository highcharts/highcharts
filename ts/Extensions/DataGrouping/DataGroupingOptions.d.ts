/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type { ApproximationKeyValue } from './ApproximationType';
import type Time from '../../Core/Time';

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
    dateTimeLabelFormats?: Record<string, Array<Time.DateTimeFormat>>;
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
