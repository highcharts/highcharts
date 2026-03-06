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

import type Time from '../Time';

/* *
 *
 *  Declarations
 *
 * */

export interface TimeTicksInfoObject extends Time.TimeNormalizedObject {
    higherRanks: Record<string, string>;
    totalRange: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default TimeTicksInfoObject;
