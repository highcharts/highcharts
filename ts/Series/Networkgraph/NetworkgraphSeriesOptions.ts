/* *
 *
 *  Networkgraph series
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Paweł Fus
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
import type DashStyleValue from '../../Core/Renderer/DashStyleValue';
import type { DataLabelOptions } from '../../Core/Series/DataLabelOptions';
import type { EventCallback } from '../../Core/Callback';
import type {
    NetworkgraphDataOptions,
    NetworkgraphPointOptions
} from './NetworkgraphPointOptions';
import type NetworkgraphPoint from './NetworkgraphPoint';
import type NetworkgraphSeries from './NetworkgraphSeries';
import type NodesComposition from '../NodesComposition';
import type Point from '../../Core/Series/Point';
import type {
    PointMarkerOptions,
    PointShortOptions
} from '../../Core/Series/PointOptions';
import type ReingoldFruchtermanLayout from './ReingoldFruchtermanLayout';
import type {
    SeriesEventsOptions,
    SeriesOptions,
    SeriesStatesOptions
} from '../../Core/Series/SeriesOptions';
import type {
    OrganizationLinkOptions
} from '../Organization/OrganizationSeriesOptions';
import type {
    TreegraphLinkOptions
} from '../Treegraph/TreegraphLink';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesStateInactiveOptions {
        linkOpacity?: number;
    }
}

// Prevent ColorType (link.color) getting loosened by DeepPartial in
// StateGenericOptions, with care about inheritance.
declare module '../../Core/Series/StatesOptions' {
    interface StateOptionsBase {
        link?: (
            SeriesLinkOptionsBase &
            NetworkgraphLinkOptions &
            OrganizationLinkOptions &
            TreegraphLinkOptions
        );
    }
}

export interface NetworkgraphDataLabelsFormatterCallbackFunction {
    (
        this: Point|NetworkgraphPoint,
        options: DataLabelOptions
    ): (number|string|null|undefined);
}

export interface NetworkgraphDataLabelsOptions
    extends DataLabelOptions {

    /**
     * The
     * [format string](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting)
     * specifying what to show for _node_ in the networkgraph. In v7.0
     * defaults to `{key}`, since v7.1 defaults to `undefined` and
     * `formatter` is used instead.
     *
     * @since 7.0.0
     */
    format?: string;

    /**
     * Callback JavaScript function to format the data label for a node.
     * Note that if a `format` is defined, the format takes precedence and
     * the formatter is ignored.
     *
     * @since 7.0.0
     */
    formatter?: NetworkgraphDataLabelsFormatterCallbackFunction;

    /**
     * The
     * [format string](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting)
     * specifying what to show for _links_ in the networkgraph.
     *
     * @since 7.1.0
     */
    linkFormat?: string;

    /**
     * Callback to format data labels for _links_ in the networkgraph. The
     * `linkFormat` option takes precedence over the `linkFormatter`.
     *
     * @since 7.1.0
     */
    linkFormatter?: NetworkgraphDataLabelsFormatterCallbackFunction;

    /**
     * Options for a _link_ label text which should follow link connection.
     * Border and background are disabled for a label that follows a path.
     *
     * **Note:** Only SVG-based renderer supports this option. Setting
     * `useHTML` to true will disable this option.
     *
     * @since 7.1.0
     */
    linkTextPath?: DataLabelOptions['textPath'];
}

/**
 * @product highcharts
 *
 * @optionparent series.networkgraph.events
 */
export interface NetworkgraphEventsOptions extends SeriesEventsOptions {

    /**
     * Fires after the simulation is ended and the layout is stable.
     */
    afterSimulation?: NetworkgraphAfterSimulationCallback;

}

/**
 * Shared base for link options of node-based series.
 *
 * @product highcharts
 */
export interface SeriesLinkOptionsBase {
    /**
     * Color of the link between two nodes.
     */
    color?: ColorType;
}

/**
 * @product highcharts
 *
 * @optionparent series.networkgraph.link
 */
export interface NetworkgraphLinkOptions extends SeriesLinkOptionsBase {
    /**
     * A name for the dash style to use for links.
     */
    dashStyle?: DashStyleValue;

    /**
     * Opacity of the link between two nodes.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * Width (px) of the link between two nodes.
     */
    width?: number;
}

/**
 * A networkgraph is a type of relationship chart, where connections
 * (links) attracts nodes (points) and other nodes repulse each other.
 *
 * A `networkgraph` series. If the [type](#series.networkgraph.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends plotOptions.line
 *
 * @extends series,plotOptions.networkgraph
 *
 * @product highcharts
 *
 * @sample highcharts/demo/network-graph/
 *         Networkgraph
 *
 * @since 7.0.0
 *
 * @excluding boostThreshold, animation, animationLimit, connectEnds,
 *            colorAxis, colorKey, connectNulls, cropThreshold, dragDrop,
 *            getExtremesFromAll, label, linecap, negativeColor,
 *            pointInterval, pointIntervalUnit, pointPlacement,
 *            pointStart, softThreshold, stack, stacking, step,
 *            threshold, xAxis, yAxis, zoneAxis, dataSorting,
 *            boostBlending
 *
 * @excluding boostThreshold, animation, animationLimit, connectEnds,
 *            connectNulls, cropThreshold, dragDrop, getExtremesFromAll, label,
 *            linecap, negativeColor, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointStart, softThreshold, stack, stacking,
 *            step, threshold, xAxis, yAxis, zoneAxis, dataSorting,
 *            boostBlending
 *
 * @requires modules/networkgraph
 */
export interface NetworkgraphSeriesOptions
    extends SeriesOptions, NodesComposition.SeriesCompositionOptions {

    /**
     * An array of data points for the series. For the `networkgraph` series
     *  type,
     * points can be given in the following way:
     *
     * An array of objects with named values. The following snippet shows only a
     * few settings, see the complete options set below. If the total number of
     * data points exceeds the series'
     * [turboThreshold](#series.area.turboThreshold), this option is not
     *  available.
     *
     *  ```js
     *     data: [{
     *         from: 'Category1',
     *         to: 'Category2'
     *     }, {
     *         from: 'Category1',
     *         to: 'Category3'
     *     }]
     *  ```
     *
     * @extends series.line.data
     *
     * @excluding drilldown,marker,x,y,draDrop
     *
     * @sample {highcharts} highcharts/chart/reflow-true/
     *         Numerical values
     *
     * @sample {highcharts} highcharts/series/data-array-of-arrays/
     *         Arrays of numeric x and y
     *
     * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
     *         Arrays of datetime x and y
     *
     * @sample {highcharts} highcharts/series/data-array-of-name-value/
     *         Arrays of point.name and y
     *
     * @sample {highcharts} highcharts/series/data-array-of-objects/
     *         Config objects
     *
     * @product highcharts
     */
    data?: Array<(NetworkgraphDataOptions|PointShortOptions)>;

    /**
     * @sample highcharts/series-networkgraph/link-datalabels
     *         Networkgraph with labels on links
     *
     * @sample highcharts/series-networkgraph/textpath-datalabels
     *         Networkgraph with labels around nodes
     *
     * @sample highcharts/series-networkgraph/link-datalabels
     *         Data labels moved into the nodes
     *
     * @sample highcharts/series-networkgraph/link-datalabels
     *         Data labels moved under the links
     */
    dataLabels?: NetworkgraphDataLabelsOptions;

    /**
     * Flag to determine if nodes are draggable or not.
     */
    draggable?: boolean;

    /**
     * General event handlers for the series items.
     */
    events?: NetworkgraphEventsOptions;

    /**
     * Whether to apply the inactive state to the other points when one point
     * is hovered.
     *
     * @default true
     */
    inactiveOtherPoints?: boolean;

    /**
     * Options for the layout algorithm positioning the nodes.
     */
    layoutAlgorithm?: ReingoldFruchtermanLayout.Options;

    /**
     * Link style options
     */
    link?: NetworkgraphLinkOptions;

    /**
     * Options for the point markers of the nodes.
     */
    marker?: PointMarkerOptions & {
        states?: PointMarkerOptions['states'] & {
            /**
             * The opposite state of a hover for a single point node.
             * Applied to all not connected nodes to the hovered one.
             */
            inactive?: Required<PointMarkerOptions>['states']['inactive'] & {
                /**
                 * Animation when not hovering over the node.
                 *
                 * @default { duration: 50 }
                 */
                animation?: Required<Required<PointMarkerOptions>['states']>['inactive']['animation'];

                /**
                 * Opacity of inactive markers.
                 *
                 * @default 0.3
                 */
                opacity?: Required<Required<PointMarkerOptions>['states']>['inactive']['opacity'];
            };
        };
    };

    /**
     * A collection of options for the individual nodes. The nodes in a
     * networkgraph diagram are auto-generated instances of `Highcharts.Point`,
     * but options can be applied here and linked by the `id`.
     *
     * @sample highcharts/series-networkgraph/data-options/
     *         Networkgraph diagram with node options
     *
     * @product highcharts
     */
    nodes?: Array<NetworkgraphPointOptions>;

    /**
     * States for the networkgraph series.
     */
    states?: NetworkgraphSeriesStatesOptions;

    /**
     * Whether to display this particular series or series type in the
     * legend.
     *
     * @default false
     */
    showInLegend?: boolean;

    /**
     * Sticky tracking of mouse events.
     *
     * @default false
     */
    stickyTracking?: boolean;

}

type SeriesStatesOptionsAlias = SeriesStatesOptions<NetworkgraphSeriesOptions>;
export interface NetworkgraphSeriesStatesOptions extends
    SeriesStatesOptionsAlias {

    /**
     * The opposite state of a hover for a single point link. Applied
     * to all links that are not coming from the hovered node.
     *
     * @declare Highcharts.SeriesStatesInactiveOptionsObject
     */
    inactive?: SeriesStatesOptionsAlias['inactive'] & {
        /**
         * Deprecated. Use
         * [link.opacity](#series.networkgraph.states.inactive.link.opacity)
         * instead.
         *
         * Opacity of inactive links.
         *
         * @deprecated 13.0.1
         * @default 0.3
         */
        linkOpacity?: number;
    };
}

export type NetworkgraphAfterSimulationCallback =
    EventCallback<NetworkgraphSeries, Event>;

/* *
 *
 *  Default Export
 *
 * */

export default NetworkgraphSeriesOptions;
