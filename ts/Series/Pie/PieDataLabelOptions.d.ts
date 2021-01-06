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

import type ColorType from '../../Core/Color/ColorType';
import type DataLabelOptions from '../../Core/Series/DataLabelOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface PieDataLabelOptions extends DataLabelOptions {
    alignTo?: string;
    connectorColor?: ColorType;
    connectorPadding?: number;
    connectorShape?: (string|Function);
    connectorWidth?: number;
    crookDistance?: string;
    distance?: number;
    softConnector?: boolean;
}

export default PieDataLabelOptions;
