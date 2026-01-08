/* *
 *
 *  Sankey diagram module
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
import type ColumnPointOptions from '../Column/ColumnPointOptions';
import type SankeyDataLabelOptions from './SankeyDataLabelOptions';
import type NodesComposition from '../NodesComposition';

/* *
 *
 *  Declarations
 *
 * */

export interface SankeyPointOptions extends ColumnPointOptions, NodesComposition.PointCompositionOptions {

    /**
     * The color for the individual _link_. By default, the link color is the
     * same as the node it extends from. The `series.fillOpacity` option also
     * applies to the points, so when setting a specific link color, consider
     * setting the `fillOpacity` to 1.
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     *
     * @product highcharts
     */
    color?: ColorType;

    column?: number;

    /**
     * @product highcharts
     */
    dataLabels?: (SankeyDataLabelOptions|Array<SankeyDataLabelOptions>);

    /**
     * The node that the link runs from.
     *
     * @product highcharts
     */
    from?: string;

    height?: number;

    level?: number;

    linkColorMode?: ('from'|'gradient'|'to');

    offset?: (number|string);

    offsetHorizontal?: (number|string);

    offsetVertical?: (number|string);

    /**
     * The node that the link runs to.
     *
     * @product highcharts
     */
    to?: string;

    /**
     * The weight of the link.
     *
     * @product highcharts
     */
    weight?: (number|null);

    width?: number;

}

/* *
 *
 *  Default Export
 *
 * */

export default SankeyPointOptions;
