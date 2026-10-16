/* *
 *
 *  Sankey diagram module
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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
import type { PointDataLabelOptionsModifier } from '../../Core/Series/DataLabel';
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
     * @product highcharts
     */
    color?: ColorType;

    /** @internal */
    column?: number;

    /**
     * @product highcharts
     */
    dataLabels?: (
        SankeyPointDataLabelOptions |
        Array<SankeyPointDataLabelOptions>
    );

    /**
     * The node that the link runs from.
     *
     * @product highcharts
     */
    from?: string;

    /** @internal */
    height?: number;

    /** @internal */
    level?: number;

    /**
     * Determines color mode for the individual _link_. Overrides the series
     * [linkColorMode](#series.sankey.linkColorMode). Available options:
     *
     * - `from` color of the sankey link will be the same as the 'from node'
     *
     * - `gradient` color of the sankey link will be set to gradient between
     * colors of 'from node' and 'to node'
     *
     * - `to` color of the sankey link will be same as the 'to node'.
     *
     * @product highcharts
     */
    linkColorMode?: ('from'|'gradient'|'to');

    /** @internal */
    offset?: (number|string);

    /** @internal */
    offsetHorizontal?: (number|string);

    /** @internal */
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

    /** @internal */
    width?: number;

}

export type SankeyPointDataLabelOptions =
    SankeyDataLabelOptions & PointDataLabelOptionsModifier;

/* *
 *
 *  Default Export
 *
 * */

export default SankeyPointOptions;
