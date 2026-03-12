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
    /**
     * The color of the line connecting the data label to the pie slice.
     * The default color is the same as the point's color.
     *
     * In styled mode, the connector stroke is given in the
     * `.highcharts-data-label-connector` class.
     *
     * @sample {highcharts} highcharts/plotoptions/pie-datalabels-connectorcolor/
     *         Blue connectors
     * @sample {highcharts} highcharts/css/pie-point/
     *         Styled connectors
     *
     * @since   2.1
     * @product highcharts highmaps
     */
    connectorColor?: ColorType;

    /**
     * The distance from the data label to the connector. Note that
     * data labels also have a default `padding`, so in order for the
     * connector to touch the text, the `padding` must also be 0.
     *
     * @sample {highcharts} highcharts/plotoptions/pie-datalabels-connectorpadding/
     *         No padding
     *
     * @since   2.1
     * @product highcharts highmaps
     * @default 5
     */
    connectorPadding?: number;

    /**
     * Specifies the method that is used to generate the connector path.
     * Highcharts provides 3 built-in connector shapes: `'crookedLine'`
     * (default since v11), `'fixedOffset'` and `'straight'`.
     *
     * Users can provide their own method by passing a function instead of a
     * string. Three arguments are passed to the callback:
     *
     * - An object that holds the information about the coordinates of the
     *   label (`x` & `y` properties) and how the label is located in
     *   relation to the pie (`alignment` property). `alignment` can by one
     *   of the following: `'left'` (pie on the left side of the data
     *   label), `'right'` (pie on the right side of the data label) or
     *   `'center'` (data label overlaps the pie).
     *
     * - An object that holds the information about the position of the
     *   connector. Its `touchingSliceAt` property tells the position of
     *   the place where the connector touches the slice.
     *
     * - Data label options
     *
     * The function has to return an SVG path definition in array form (see
     * the example).
     *
     * @sample {highcharts}
     *         highcharts/plotoptions/pie-datalabels-connectorshape-string/
     *         connectorShape is a String
     * @sample {highcharts}
     *         highcharts/plotoptions/pie-datalabels-connectorshape-function/
     *         connectorShape is a function
     *
     * @since   7.0.0
     * @product highcharts highmaps
     * @default 'crookedLine'
     */
    connectorShape?: (string|DataLabel.ConnectorShapeFunction);

    /**
     * The width of the line connecting the data label to the pie slice.
     *
     * In styled mode, the connector stroke width is given in the
     * `.highcharts-data-label-connector` class.
     *
     * @sample {highcharts} highcharts/plotoptions/pie-datalabels-connectorwidth-disabled/
     *         Disable the connector
     * @sample {highcharts} highcharts/css/pie-point/
     *         Styled connectors
     *
     * @since   2.1
     * @product highcharts highmaps
     * @default 1
     */
    connectorWidth?: number;

    /**
     * Works only if `connectorShape` is `'crookedLine'`. It defines how
     * far from the vertical plot edge the connector path should be
     * crooked. With the default, `undefined`, the crook is placed so that
     * the horizontal line from the label intersects with the radial line
     * extending through the center of the pie slice.
     *
     * @sample {highcharts} highcharts/plotoptions/pie-datalabels-crookdistance/
     *         crookDistance set to 90%
     *
     * @since   7.0.0
     * @product highcharts highmaps
     * @default undefined
     */
    crookDistance?: string;

    /**
     * The distance of the data label from the pie's edge. Negative
     * numbers put the data label on top of the pie slices. Can also be
     * defined as a percentage of pie's radius. Connectors are only
     * shown for data labels outside the pie.
     *
     * @sample {highcharts} highcharts/plotoptions/pie-datalabels-distance/
     *         Data labels on top of the pie
     *
     * @since   2.1
     * @product highcharts highmaps
     */
    distance?: number|string;

    /**
     * Whether to render the connector as a soft arc or a line with a sharp
     * break. Works only if `connectorShape` equals to `fixedOffset`.
     *
     * @sample {highcharts}
     *         highcharts/plotoptions/pie-datalabels-softconnector-true/
     *         Soft
     * @sample {highcharts}
     *         highcharts/plotoptions/pie-datalabels-softconnector-false/
     *         Non soft
     *
     * @since   2.1.7
     * @product highcharts highmaps
     * @default true
     */
    softConnector?: boolean;

    /**
     * @sample {highcharts} highcharts/plotoptions/pie-datalabels-overflow
     *         Long labels truncated with an ellipsis
     * @sample {highcharts} highcharts/plotoptions/pie-datalabels-overflow-wrap
     *         Long labels are wrapped
     */
    style?: DataLabelOptions['style'];

    /**
     * @default 0
     */
    x?: DataLabelOptions['x'];
}

/* *
 *
 *  Default Export
 *
 * */

export default PieDataLabelOptions;
