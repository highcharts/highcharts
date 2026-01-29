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

    /**
     * The distance of the data label from the pie's edge. Negative
     * numbers put the data label on top of the pie slices. Can also be
     * defined as a percentage of pie's radius. Connectors are only
     * shown for data labels outside the pie.
     *
     * @sample {highcharts} highcharts/plotoptions/pie-datalabels-distance/
     *         Data labels on top of the pie
     *
     * @type    {number|string}
     * @since   2.1
     * @product highcharts highmaps
     */
    distance?: number|string;
}

/* *
 *
 *  Default Export
 *
 * */

export default PieDataLabelOptions;
