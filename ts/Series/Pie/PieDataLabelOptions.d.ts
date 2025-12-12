/* *
 *
 *  (c) 2010-2025 Highsoft AS
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

import type ColorType from '../../Core/Color/ColorType';
import type DataLabel from '../../Core/Series/DataLabel';
import type DataLabelOptions from '../../Core/Series/DataLabelOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface PieDataLabelOptions extends DataLabelOptions {
    connectorColor?: ColorType;
    connectorPadding?: number;
    connectorShape?: (string|DataLabel.ConnectorShapeFunction);
    connectorWidth?: number;
    crookDistance?: string;
    softConnector?: boolean;
}

/* *
 *
 *  Default Export
 *
 * */

export default PieDataLabelOptions;
