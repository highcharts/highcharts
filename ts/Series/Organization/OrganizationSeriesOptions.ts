/* *
 *
 *  Organization chart module
 *
 *  (c) 2018-2026 Highsoft AS
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

import type ColorString from '../../Core/Color/ColorString';
import type OrganizationDataLabelOptions from './OrganizationDataLabelOptions';
import type {
    SankeySeriesLevelOptions,
    SankeySeriesNodeOptions,
    SankeySeriesOptions
} from '../Sankey/SankeySeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type {
    SeriesLinkOptionsBase
} from '../Networkgraph/NetworkgraphSeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

declare module '../Sankey/SankeySeriesOptions' {
    interface SankeySeriesOptions {
        /** @requires OrganizationSeries */
        linkColor?: OrganizationSeriesOptions['linkColor'];
        /** @requires OrganizationSeries */
        linkLineWidth?: OrganizationSeriesOptions['linkLineWidth'];
        /** @requires OrganizationSeries */
        link?: OrganizationSeriesOptions['link'];
    }
}

export type OrganizationLinkTypeValues = 'curved' | 'straight' | 'orthogonal';

export type OrganizationNodesLayoutValue = ('normal'|'hanging');

/**
 * Link styling options.
 *
 * @since 10.3.0
 *
 * @product highcharts
 */
export interface OrganizationLinkOptions extends SeriesLinkOptionsBase {

    /**
     * Modifier of the shape of the curved link. Works best for values between
     * 0 and 1, where 0 is a straight line, and 1 is a shape close to the
     * default one.
     *
     * @default 0.5
     *
     * @since 10.3.0
     *
     * @product highcharts
     */
    curveFactor?: number;

    /**
     * The line width of the links connecting nodes, in pixels.
     *
     * @sample highcharts/series-organization/link-options
     *         Square links
     *
     * @default 1
     */
    lineWidth?: number;

    /**
     * Opacity of the links between nodes.
     */
    linkOpacity?: number;

    /**
     * The offset of the link in relation to the node, in pixels.
     *
     * @since 10.3.0
     *
     * @product highcharts
     */
    offset?: number;

    /**
     * Radius for the rounded corners of the links between nodes. Works for the
     * `orthogonal` link type.
     *
     * @sample highcharts/series-organization/link-options
     *         Square links
     *
     * @default 10
     */
    radius?: number;

    /**
     * Type of the link shape.
     *
     * @sample highcharts/series-organization/different-link-types
     *         Different link types
     *
     * @declare Highcharts.OrganizationLinkTypeValue
     *
     * @default 'orthogonal'
     *
     * @product highcharts
     */
    type?: OrganizationLinkTypeValues;
}

export type OrganizationHangingIndentTranslationValue = (
    'inherit'|'cumulative'|'shrink'
);


/**
 * Set options on specific levels. Takes precedence over series options, but
 * not point options.
 *
 * @product highcharts
 */
export interface OrganizationSeriesLevelOptions
    extends SankeySeriesLevelOptions {

    /**
     * The border radius of the node cards on this level.
     */
    borderRadius?: number;

    /**
     * The color of the links between nodes on this level. This option is
     * deprecated and moved to
     * [link.color](#plotOptions.organization.link.color).
     *
     * @deprecated 10.3.0
     */
    linkColor?: ColorString;

    /**
     * The line width of the links connecting nodes on this level, in pixels.
     * This option is deprecated and moved to
     * [link.lineWidth](#plotOptions.organization.link.lineWidth).
     *
     * @deprecated 10.3.0
     */
    linkLineWidth?: number;

    /**
     * Link styling options for this level.
     *
     * @since 10.3.0
     */
    link?: OrganizationLinkOptions;

    /**
     * States for this level.
     */
    states: SeriesStatesOptions<OrganizationSeriesOptions>;
}

/**
 * A collection of options for the individual nodes. The nodes in an org chart
 * are auto-generated instances of `Highcharts.Point`, but options can be
 * applied here and linked by the `id`.
 *
 * @product highcharts
 */
export interface OrganizationSeriesNodeOptions
    extends SankeySeriesNodeOptions {

    /**
     * The job description for the node card, will be inserted by the default
     * `dataLabel.nodeFormatter`.
     *
     * @sample highcharts/demo/organization-chart
     *         Org chart with job descriptions
     *
     * @product highcharts
     */
    description?: string;

    /**
     * An image for the node card, will be inserted by the default
     * `dataLabel.nodeFormatter`.
     *
     * @sample highcharts/demo/organization-chart
     *         Org chart with images
     *
     * @product highcharts
     */
    image?: string;

    /**
     * Layout for the node's children. If `hanging`, this node's children will
     * hang below their parent, allowing a tighter packing of nodes in the
     * diagram.
     *
     * Note: Since version 10.0.0, the `hanging` layout is set by default for
     * children of a parent using `hanging` layout.
     *
     * @sample highcharts/demo/organization-chart
     *         Hanging layout
     *
     * @default normal
     *
     * @product highcharts
     */
    layout?: OrganizationNodesLayoutValue;

    /**
     * The job title for the node card, will be inserted by the default
     * `dataLabel.nodeFormatter`.
     *
     * @sample highcharts/demo/organization-chart
     *         Org chart with job titles
     *
     * @product highcharts
     */
    title?: string;
}

export interface OrganizationSeriesOptions extends SankeySeriesOptions {

    /**
     * Options for the data labels appearing on top of the nodes and links.
     *
     * @declare Highcharts.SeriesOrganizationDataLabelsOptionsObject
     */
    dataLabels: OrganizationDataLabelOptions;

    /**
     * The indentation in pixels of hanging nodes, nodes which parent has
     * [layout](#series.organization.nodes.layout) set to `hanging`.
     *
     * @default 20
     */
    hangingIndent?: number;

    /**
     * Defines the indentation of a `hanging` layout parent's children.
     * Possible options:
     *
     * - `inherit` (default): Only the first child adds the indentation,
     * children of a child with indentation inherit the indentation.
     * - `cumulative`: All children of a child with indentation add its
     * own indent. The option may cause overlapping of nodes.
     * Then use `shrink` option:
     * - `shrink`: Nodes shrink by the
     * [hangingIndent](#plotOptions.organization.hangingIndent)
     * value until they reach the
     * [minNodeLength](#plotOptions.organization.minNodeLength).
     *
     * @sample highcharts/series-organization/hanging-cumulative
     *         Every indent increases the indentation
     *
     * @sample highcharts/series-organization/hanging-shrink
     *         Every indent decreases the nodes' width
     *
     * @declare Highcharts.OrganizationHangingIndentTranslationValue
     *
     * @default 'inherit'
     *
     * @since 10.0.0
     */
    hangingIndentTranslation?: OrganizationHangingIndentTranslationValue;

    /**
     * Whether links connecting hanging nodes should be drawn on the left
     * or right side. Useful for RTL layouts.
     *
     * **Note:** Only effects inverted charts (vertical layout).
     *
     * @sample highcharts/series-organization/hanging-side
     *         Nodes hanging from right side.
     *
     * @default 'left'
     *
     * @since 11.3.0
     */
    hangingSide?: 'left' | 'right';

    /**
     * Set options on specific levels. Takes precedence over series options,
     * but not node and link options.
     */
    levels?: Array<OrganizationSeriesLevelOptions>;

    /**
     * Link styling options.
     *
     * @since 10.3.0
     *
     * @product highcharts
     */
    link: OrganizationLinkOptions;

    /**
     * The color of the links between nodes. This option is moved to
     * [link.color](#plotOptions.organization.link.color).
     *
     * @deprecated 10.3.0
     */
    linkColor?: ColorString;

    /**
     * The line width of the links connecting nodes, in pixels. This option
     * is now deprecated and moved to the
     * [link.lineWidth](#plotOptions.organization.link.lineWidth).
     *
     * @sample highcharts/series-organization/link-options
     *         Square links
     *
     * @deprecated 10.3.0
     */
    linkLineWidth?: number;

    /**
     * Radius for the rounded corners of the links between nodes. This
     * option is now deprecated, and moved to
     * [link.radius](#plotOptions.organization.link.radius).
     *
     * @sample highcharts/series-organization/link-options
     *         Square links
     *
     * @deprecated 10.3.0
     */
    linkRadius?: number;

    /**
     * In a horizontal chart, the minimum width of the **hanging** nodes
     * only, in pixels. In a vertical chart, the minimum height of the
     * **hanging** nodes only, in pixels too.
     *
     * Note: Used only when
     * [hangingIndentTranslation](#plotOptions.organization.hangingIndentTranslation)
     * is set to `shrink`.
     *
     * @see [nodeWidth](#plotOptions.organization.nodeWidth)
     *
     * @default 10
     */
    minNodeLength?: number;

    /**
     * A collection of options for the individual nodes. The nodes in an org
     * chart are auto-generated instances of `Highcharts.Point`, but options
     * can be applied here and linked by the `id`.
     *
     * @product highcharts
     */
    nodes?: Array<OrganizationSeriesNodeOptions>;

    /**
     * States for the organization series.
     */
    states?: SeriesStatesOptions<OrganizationSeriesOptions>;
}

/* *
 *
 *  Default Export
 *
 * */

export default OrganizationSeriesOptions;
