/* *
 *
 *  Networkgraph series
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Paweł Fus
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

import type AnimationOptions from '../../Core/Animation/AnimationOptions';
import type ColorType from '../../Core/Color/ColorType';
import type DashStyleValue from '../../Core/Renderer/DashStyleValue';
import type { NetworkgraphDataLabelsOptions } from './NetworkgraphSeriesOptions';
import type NodesComposition from '../NodesComposition';
import type {
    PointMarkerOptions,
    PointOptions
} from '../../Core/Series/PointOptions';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/PointOptions' {
    interface PointMarkerStateInactiveOptions
    {
        animation?: (boolean|Partial<AnimationOptions>);
    }
}

/**
 * @product highcharts
 *
 * @optionparent series.networkgraph.data
 */
export interface NetworkgraphDataOptions extends PointOptions {

    dataLabels?: (NetworkgraphDataLabelsOptions|Array<NetworkgraphDataLabelsOptions>);

    from?: string;

    to?: string;

}

/**
 * @product highcharts
 *
 * @optionparent series.networkgraph.nodes
 */
export interface NetworkgraphPointOptions
    extends PointOptions, NodesComposition.PointCompositionOptions {

    /**
     * The color of the auto generated node.
     */
    color?: ColorType;

    /**
     * The color index of the auto generated node, especially for use in styled
     * mode.
     */
    colorIndex?: number;

    dashStyle?: DashStyleValue;

    /**
     * Individual data label for each node. The options are the same as the ones
     * for [series.networkgraph.dataLabels](#series.networkgraph.dataLabels).
     *
     * @type {Highcharts.SeriesNetworkgraphDataLabelsOptionsObject|Array<Highcharts.SeriesNetworkgraphDataLabelsOptionsObject>}
     *
     * @apioption series.networkgraph.nodes.dataLabels
     */
    dataLabels?: (NetworkgraphDataLabelsOptions|Array<NetworkgraphDataLabelsOptions>);

    /**
     * The id of the auto-generated node, referring to the `from` or `to`
     * setting of the link.
     */
    id?: string;

    /**
     * Options for the node markers.
     */
    marker?: PointMarkerOptions;

    /**
     * Mass of the node. By default, each node has mass equal to it's marker
     * radius. Mass is used to determine how two connected nodes should affect
     * each other:
     *
     * Attractive force is multiplied by the ratio of two connected nodes; if a
     * big node has weights twice as the small one, then the small one
     * will move towards the big one twice faster than the big one to the small
     * one.
     *
     * @sample highcharts/series-networkgraph/ragdoll/
     *         Mass determined by marker.radius
     *
     * @product highcharts
     */
    mass?: number;

    /**
     * The name to display for the node in data labels and tooltips. Use this
     * when the name is different from the `id`. Where the id must be unique for
     * each node, this is not necessary for the name.
     *
     * @sample highcharts/series-networkgraph/data-options/
     *         Networkgraph diagram with node options
     *
     * @product highcharts
     */
    name?: string;

    opacity?: number;

    width?: number;

}

/* *
 *
 *  Default Export
 *
 * */

export default NetworkgraphPointOptions;
