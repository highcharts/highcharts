/* *
 *
 *  This module implements sunburst charts in Highcharts.
 *
 *  (c) 2016-2021 Highsoft AS
 *
 *  Authors: Jon Arild Nygard
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

import type DataLabelOptions from '../../Core/Series/DataLabelOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface SunburstDataLabelOptions extends DataLabelOptions {
    allowOverlap?: boolean;
    rotationMode?: SunburstDataLabelRotationValue;
}

export type SunburstDataLabelRotationValue = ('auto'|'perpendicular'|'parallel'|'circular');

export default SunburstDataLabelOptions;
