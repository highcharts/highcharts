/* *
 *
 *  Organization chart module
 *
 *  (c) 2018-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type CSSObject from '../../Core/Renderer/CSSObject';
import type {
    OrganizationDataLabelsFormatterCallbackFunction,
    OrganizationDataLabelFormatterContext
} from './OrganizationDataLabelOptions';
import type OrganizationPoint from './OrganizationPoint';
import type OrganizationSeriesOptions from './OrganizationSeriesOptions';
import type Point from '../../Core/Series/Point';
import type { SankeyDataLabelFormatterContext } from '../Sankey/SankeyDataLabelOptions';

import { Palette } from '../../Core/Color/Palettes.js';
import { type DataLabelTextPathOptions } from '../../Core/Series/DataLabelOptions';

/* *
 *
 *  API Options
 *
 * */

/**
 * An organization chart is a diagram that shows the structure of an
 * organization and the relationships and relative ranks of its parts and
 * positions.
 *
 * @sample       highcharts/demo/organization-chart/
 *               Organization chart
 * @sample       highcharts/series-organization/horizontal/
 *               Horizontal organization chart
 * @sample       highcharts/series-organization/borderless
 *               Borderless design
 * @sample       highcharts/series-organization/center-layout
 *               Centered layout
 *
 * @extends      plotOptions.sankey
 * @excluding    allowPointSelect, curveFactor, dataSorting
 * @since        7.1.0
 * @product      highcharts
 * @requires     modules/organization
 * @optionparent plotOptions.organization
 */
const OrganizationSeriesDefaults: OrganizationSeriesOptions = {

    /**
     * The border color of the node cards.
     *
     * @type {Highcharts.ColorString}
     */
    borderColor: Palette.neutralColor60,

    /**
     * The border radius of the node cards.
     *
     * @private
     */
    borderRadius: 3,

    /**
     * Radius for the rounded corners of the links between nodes. This
     * option is now deprecated, and moved to
     * [link.radius](#plotOptions.organization.link.radius).
     *
     * @sample   highcharts/series-organization/link-options
     *           Square links
     *
     * @deprecated
     * @apioption series.organization.linkRadius
     */

    /**
     * Link Styling options
     * @since 10.3.0
     * @product highcharts
     */
    link: {
        /**
         * Modifier of the shape of the curved link. Works best for values
         * between 0 and 1, where 0 is a straight line, and 1 is a shape
         * close to the default one.
         *
         * @default 0.5
         * @type {number}
         * @since 10.3.0
         * @product highcharts
         * @apioption series.organization.link.offset
         */

        /**
         * The color of the links between nodes.
         *
         * @type {Highcharts.ColorString}
         */
        color: Palette.neutralColor60,
        /**
         * The line width of the links connecting nodes, in pixels.
         *
         * @sample   highcharts/series-organization/link-options
         *           Square links
         */
        lineWidth: 1,
        /**
         * Radius for the rounded corners of the links between nodes.
         * Works for `default` link type.
         *
         * @sample   highcharts/series-organization/link-options
         *           Square links
         */
        radius: 10,
        /**
         * Type of the link shape.
         *
         * @sample   highcharts/series-organization/different-link-types
         *           Different link types
         *
         * @declare Highcharts.OrganizationLinkTypeValue
         * @type {'default' | 'curved' | 'straight'}
         * @default 'default'
         * @product highcharts
         */
        type: 'default'
    },
    borderWidth: 1,

    /**
     * @declare Highcharts.SeriesOrganizationDataLabelsOptionsObject
     *
     * @private
     */
    dataLabels: {

        /* eslint-disable valid-jsdoc */
        /**
         * A callback for defining the format for _nodes_ in the
         * organization chart. The `nodeFormat` option takes precedence
         * over `nodeFormatter`.
         *
         * In an organization chart, the `nodeFormatter` is a quite complex
         * function of the available options, striving for a good default
         * layout of cards with or without images. In organization chart,
         * the data labels come with `useHTML` set to true, meaning they
         * will be rendered as true HTML above the SVG.
         *
         * @sample highcharts/series-organization/datalabels-nodeformatter
         *         Modify the default label format output
         *
         * @type  {Highcharts.SeriesSankeyDataLabelsFormatterCallbackFunction}
         * @since 6.0.2
         */
        nodeFormatter: function (
            this: (
                Point.PointLabelObject|
                OrganizationDataLabelFormatterContext|
                SankeyDataLabelFormatterContext
            )
        ): string {
            const outerStyle: CSSObject = {
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    'flex-direction': 'row',
                    'align-items': 'center',
                    'justify-content': 'center'
                },
                imageStyle: CSSObject = {
                    'max-height': '100%',
                    'border-radius': '50%'
                },
                innerStyle: CSSObject = {
                    width: '100%',
                    padding: 0,
                    'text-align': 'center',
                    'white-space': 'normal'
                },
                nameStyle: CSSObject = {
                    margin: 0
                },
                titleStyle: CSSObject = {
                    margin: 0
                },
                descriptionStyle: CSSObject = {
                    opacity: 0.75,
                    margin: '5px'
                };

            // eslint-disable-next-line valid-jsdoc
            /**
             * @private
             */
            function styleAttr(style: CSSObject): string {
                return Object.keys(style).reduce(function (
                    str: string,
                    key: string
                ): string {
                    return str + key + ':' + (style as any)[key] + ';';
                }, 'style="') + '"';
            }

            const {
                description,
                image,
                title
            } = this.point as OrganizationPoint;

            if (image) {
                imageStyle['max-width'] = '30%';
                innerStyle.width = '70%';
            }

            // PhantomJS doesn't support flex, roll back to absolute
            // positioning
            if (
                (this as OrganizationDataLabelFormatterContext)
                    .series.chart.renderer.forExport
            ) {
                outerStyle.display = 'block';
                innerStyle.position = 'absolute';
                innerStyle.left = image ? '30%' : 0;
                innerStyle.top = 0;
            }

            let html = '<div ' + styleAttr(outerStyle) + '>';

            if (image) {
                html += '<img src="' + image + '" ' +
                    styleAttr(imageStyle) + '>';
            }

            html += '<div ' + styleAttr(innerStyle) + '>';

            if (this.point.name) {
                html += '<h4 ' + styleAttr(nameStyle) + '>' +
                    this.point.name + '</h4>';
            }

            if (title) {
                html += '<p ' + styleAttr(titleStyle) + '>' +
                    (title || '') + '</p>';
            }

            if (description) {
                html += '<p ' + styleAttr(descriptionStyle) + '>' +
                    description + '</p>';
            }

            html += '</div>' +
                '</div>';
            return html;
        },
        /* eslint-enable valid-jsdoc */

        style: {
            /** @internal */
            fontWeight: 'normal',
            /** @internal */
            fontSize: '0.9em'
        },

        useHTML: true,

        linkTextPath: {
            attributes: {
                startOffset: '95%',
                textAnchor: 'end'
            }
        }
    },
    /**
     * The indentation in pixels of hanging nodes, nodes which parent has
     * [layout](#series.organization.nodes.layout) set to `hanging`.
     *
     * @private
     */
    hangingIndent: 20,
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
     * @type {Highcharts.OrganizationHangingIndentTranslationValue}
     * @since 10.0.0
     * @default inherit
     *
     * @private
     */
    hangingIndentTranslation: 'inherit',
    /**
     *
     * The color of the links between nodes. This option is moved to
     * [link.color](#plotOptions.organization.link.color).
     *
     * @type {Highcharts.ColorString}
     * @deprecated
     * @apioption series.organization.linkColor
     * @private
     */

    /**
     * The line width of the links connecting nodes, in pixels. This option
     * is now deprecated and moved to the
     * [link.radius](#plotOptions.organization.link.lineWidth).
     *
     * @sample   highcharts/series-organization/link-options
     *           Square links
     *
     * @deprecated
     * @apioption series.organization.linkLineWidth
     * @private
     */

    /**
     * In a horizontal chart, the minimum width of the **hanging** nodes
     * only, in pixels. In a vertical chart, the minimum height of the
     * **haning** nodes only, in pixels too.
     *
     * Note: Used only when
     * [hangingIndentTranslation](#plotOptions.organization.hangingIndentTranslation)
     * is set to `shrink`.
     *
     * @see [nodeWidth](#plotOptions.organization.nodeWidth)
     *
     * @private
     */
    minNodeLength: 10,
    /**
     * In a horizontal chart, the width of the nodes in pixels. Note that
     * most organization charts are vertical, so the name of this option
     * is counterintuitive.
     *
     * @see [minNodeLength](#plotOptions.organization.minNodeLength)
     *
     * @private
     */
    nodeWidth: 50,
    tooltip: {
        nodeFormat: '{point.name}<br>{point.title}<br>{point.description}'
    }
};

/**
 * An `organization` series. If the [type](#series.organization.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.organization
 * @exclude   dataSorting, boostThreshold, boostBlending
 * @product   highcharts
 * @requires  modules/sankey
 * @requires  modules/organization
 * @apioption series.organization
 */

/**
 * @type      {Highcharts.SeriesOrganizationDataLabelsOptionsObject|Array<Highcharts.SeriesOrganizationDataLabelsOptionsObject>}
 * @product   highcharts
 * @apioption series.organization.data.dataLabels
 */

/**
 * A collection of options for the individual nodes. The nodes in an org chart
 * are auto-generated instances of `Highcharts.Point`, but options can be
 * applied here and linked by the `id`.
 *
 * @extends   series.sankey.nodes
 * @type      {Array<*>}
 * @product   highcharts
 * @apioption series.organization.nodes
 */

/**
 * Individual data label for each node. The options are the same as
 * the ones for [series.organization.dataLabels](#series.organization.dataLabels).
 *
 * @type    {Highcharts.SeriesOrganizationDataLabelsOptionsObject|Array<Highcharts.SeriesOrganizationDataLabelsOptionsObject>}
 *
 * @apioption series.organization.nodes.dataLabels
 */

/**
 * The job description for the node card, will be inserted by the default
 * `dataLabel.nodeFormatter`.
 *
 * @sample highcharts/demo/organization-chart
 *         Org chart with job descriptions
 *
 * @type      {string}
 * @product   highcharts
 * @apioption series.organization.nodes.description
 */

/**
 * An image for the node card, will be inserted by the default
 * `dataLabel.nodeFormatter`.
 *
 * @sample highcharts/demo/organization-chart
 *         Org chart with images
 *
 * @type      {string}
 * @product   highcharts
 * @apioption series.organization.nodes.image
 */

/**
 * The format string specifying what to show for *links* in the
 * organization chart.
 *
 * Best to use with [`linkTextPath`](#series.organization.dataLabels.linkTextPath) enabled.
 *
 * @sample highcharts/series-organization/link-labels
 *         Organization chart with link labels
 *
 * @type      {string}
 * @product   highcharts
 * @apioption series.organization.dataLabels.linkFormat
 * @since 11.0.0
 */

/**
 * Callback to format data labels for _links_ in the
 * organization chart. The `linkFormat` option takes
 * precedence over the `linkFormatter`.
 *
 * @type      {OrganizationDataLabelsFormatterCallbackFunction}
 * @product   highcharts
 * @apioption series.organization.dataLabels.linkFormatter
 * @since 11.0.0
 */

/**
 * Options for a _link_ label text which should follow link
 * connection.
 *
 * @sample highcharts/series-organization/link-labels
 *         Organization chart with link labels
 *
 * @type { DataLabelTextPathOptions }
 * @product highcharts
 * @apioption series.organization.dataLabels.linkTextPath
 * @since 11.0.0
 */

/**
 * Layout for the node's children. If `hanging`, this node's children will hang
 * below their parent, allowing a tighter packing of nodes in the diagram.
 *
 * Note: Since @next version, the `hanging` layout is set by default for
 * children of a parent using `hanging` layout.
 *
 * @sample highcharts/demo/organization-chart
 *         Hanging layout
 *
 * @type      {Highcharts.SeriesOrganizationNodesLayoutValue}
 * @default   normal
 * @product   highcharts
 * @apioption series.organization.nodes.layout
 */

/**
 * The job title for the node card, will be inserted by the default
 * `dataLabel.nodeFormatter`.
 *
 * @sample highcharts/demo/organization-chart
 *         Org chart with job titles
 *
 * @type      {string}
 * @product   highcharts
 * @apioption series.organization.nodes.title
 */

/**
 * An array of data points for the series. For the `organization` series
 * type, points can be given in the following way:
 *
 * An array of objects with named values. The following snippet shows only a
 * few settings, see the complete options set below. If the total number of data
 * points exceeds the series' [turboThreshold](#series.area.turboThreshold),
 * this option is not available.
 *
 *  ```js
 *     data: [{
 *         from: 'Category1',
 *         to: 'Category2',
 *         weight: 2
 *     }, {
 *         from: 'Category1',
 *         to: 'Category3',
 *         weight: 5
 *     }]
 *  ```
 *
 * @type      {Array<*>}
 * @extends   series.sankey.data
 * @product   highcharts
 * @apioption series.organization.data
 */

''; // keeps doclets above in JS file

/* *
 *
 *  Default Export
 *
 * */

export default OrganizationSeriesDefaults;
