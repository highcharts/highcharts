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

import type BBoxObject from '../../Core/Renderer/BBoxObject';
import type CSSObject from '../../Core/Renderer/CSSObject';
import type {
    OrganizationDataLabelFormatterContext,
    OrganizationDataLabelOptions
} from './OrganizationDataLabelOptions';
import type OrganizationPointOptions from './OrganizationPointOptions';
import type {
    OrganizationSeriesLevelOptions,
    OrganizationSeriesOptions
} from './OrganizationSeriesOptions';
import type Point from '../../Core/Series/Point';
import type { SankeyDataLabelFormatterContext } from '../Sankey/SankeyDataLabelOptions';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGLabel from '../../Core/Renderer/SVG/SVGLabel';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import type SankeyColumnComposition from '../Sankey/SankeyColumnComposition.js';
import OrganizationPoint from './OrganizationPoint.js';
import { Palette } from '../../Core/Color/Palettes.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        sankey: SankeySeries
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const {
    css,
    extend,
    merge,
    pick,
    wrap
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.organization
 *
 * @augments Highcharts.seriesTypes.sankey
 */
class OrganizationSeries extends SankeySeries {

    /* *
     *
     *  Static Properties
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
    public static defaultOptions: OrganizationSeriesOptions = merge(SankeySeries.defaultOptions, {
        /**
         * The border color of the node cards.
         *
         * @type {Highcharts.ColorString}
         * @private
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
         * @private
         * @apioption series.organization.linkRadius
         */

        /**
         * Link Styling options
         * @since next
         * @product highcharts
         */
        link: {
            /**
             * The color of the links between nodes.
             *
             * @type {Highcharts.ColorString}
             * @private
             */
            color: Palette.neutralColor60,
            /**
             * The line width of the links connecting nodes, in pixels.
             *
             * @sample   highcharts/series-organization/link-options
             *           Square links
             *
             * @private
             */
            lineWidth: 1,
            /**
             * Radius for the rounded corners of the links between nodes.
             * Works for `default` link type.
             *
             * @sample   highcharts/series-organization/link-options
             *           Square links
             *
             * @private
             */
            radius: 10,
            /**
             * Type of the link shape.
             *
             * @sample   highcharts/series-organization/different-link-types
             *           Different link types
             *
             * @type {'default' | 'curved' | 'straight'}
             * @default 'default'
             * @product highcharts
             *
             */
            type: 'default'
            /**
             * Modifier of the shape of the curved link. Works best for values
             * between 0 and 1, where 0 is a straight line, and 1 is a shape
             * close to the default one.
             *
             * @default 0.5
             * @type {number}
             * @since next
             * @product highcharts
             * @apioption series.organization.link.offset
             *
             */
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

                if ((this.point as any).image) {
                    imageStyle['max-width'] = '30%';
                    innerStyle.width = '70%';
                }

                // PhantomJS doesn't support flex, roll back to absolute
                // positioning
                if ((this as any).series.chart.renderer.forExport) {
                    outerStyle.display = 'block';
                    innerStyle.position = 'absolute';
                    innerStyle.left = (this.point as any).image ? '30%' : 0;
                    innerStyle.top = 0;
                }

                let html = '<div ' + styleAttr(outerStyle) + '>';

                if ((this.point as any).image) {
                    html += '<img src="' + (this.point as any).image + '" ' +
                        styleAttr(imageStyle) + '>';
                }

                html += '<div ' + styleAttr(innerStyle) + '>';

                if (this.point.name) {
                    html += '<h4 ' + styleAttr(nameStyle) + '>' +
                        this.point.name + '</h4>';
                }

                if ((this.point as any).title) {
                    html += '<p ' + styleAttr(titleStyle) + '>' +
                        ((this.point as any).title || '') + '</p>';
                }

                if ((this.point as any).description) {
                    html += '<p ' + styleAttr(descriptionStyle) + '>' +
                        (this.point as any).description + '</p>';
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
                fontSize: '13px'
            },
            useHTML: true
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
         * @since next
         * @default inherit
         */
        hangingIndentTranslation: 'inherit',
        /**
         *
         * The color of the links between nodes. This option is moved to
         * [link.color](#plotOptions.organization.link.color).
         *
         * @type {Highcharts.ColorString}
         * @deprecated
         * @private
         * @apioption series.organization.linkColor
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
    } as OrganizationSeriesOptions);

    /* *
     *
     *  Static Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * General function to apply corner radius to a path - can be lifted to
     * renderer or utilities if we need it elsewhere.
     * @private
     */
    public static curvedPath(
        path: SVGPath,
        r?: number
    ): SVGPath {
        const d: SVGPath = [];

        for (let i = 0; i < path.length; i++) {
            const x = path[i][1];
            const y = path[i][2];

            if (typeof x === 'number' && typeof y === 'number') {
                // moveTo
                if (i === 0) {
                    d.push(['M', x, y]);

                } else if (i === path.length - 1) {
                    d.push(['L', x, y]);

                // curveTo
                } else if (r) {
                    const prevSeg = path[i - 1];
                    const nextSeg = path[i + 1];
                    if (prevSeg && nextSeg) {
                        const x1 = prevSeg[1],
                            y1 = prevSeg[2],
                            x2 = nextSeg[1],
                            y2 = nextSeg[2];

                        // Only apply to breaks
                        if (
                            typeof x1 === 'number' &&
                            typeof x2 === 'number' &&
                            typeof y1 === 'number' &&
                            typeof y2 === 'number' &&
                            x1 !== x2 &&
                            y1 !== y2
                        ) {
                            const directionX = x1 < x2 ? 1 : -1,
                                directionY = y1 < y2 ? 1 : -1;
                            d.push([
                                'L',
                                x - directionX * Math.min(Math.abs(x - x1), r),
                                y - directionY * Math.min(Math.abs(y - y1), r)
                            ], [
                                'C',
                                x,
                                y,
                                x,
                                y,
                                x + directionX * Math.min(Math.abs(x - x2), r),
                                y + directionY * Math.min(Math.abs(y - y2), r)
                            ]);
                        }

                    }

                // lineTo
                } else {
                    d.push(['L', x, y]);
                }
            }
        }

        return d;

    }

    /* eslint-enable valid-jsdoc */

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<OrganizationPoint> = void 0 as any;

    public options: OrganizationSeriesOptions = void 0 as any;

    public points: Array<OrganizationPoint> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    public alignDataLabel(
        point: OrganizationPoint,
        dataLabel: SVGLabel,
        options: OrganizationDataLabelOptions
    ): void {
        // Align the data label to the point graphic
        if (options.useHTML) {
            let width = (point.shapeArgs as any).width,
                height = (point.shapeArgs as any).height,
                padjust = (
                    (this.options.borderWidth as any) +
                    2 * (this.options.dataLabels as any).padding
                );

            if (this.chart.inverted) {
                width = height;
                height = (point.shapeArgs as any).width;
            }

            height -= padjust;
            width -= padjust;

            // Set the size of the surrounding div emulating `g`
            const text = dataLabel.text;
            if (text) {
                css(text.element.parentNode, {
                    width: width + 'px',
                    height: height + 'px'
                });

                // Set properties for the span emulating `text`
                css(text.element, {
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden'
                });
            }

            // The getBBox function is used in `alignDataLabel` to align
            // inside the box
            dataLabel.getBBox = function (): BBoxObject {
                return {
                    width: width,
                    height: height
                } as any;
            };

            // Overwrite dataLabel dimensions (#13100).
            dataLabel.width = width;
            dataLabel.height = height;
        }

        super.alignDataLabel.apply(this, arguments);
    }

    public createNode(id: string): OrganizationPoint {
        const node: OrganizationPoint = super.createNode.call(this, id) as any;

        // All nodes in an org chart are equal width
        node.getSum = function (): number {
            return 1;
        };

        return node;

    }

    public pointAttribs(
        point: OrganizationPoint,
        state?: StatesOptionsKey
    ): SVGAttributes {
        const series = this,
            attribs = SankeySeries.prototype.pointAttribs.call(
                series,
                point,
                state
            ),
            level = point.isNode ? point.level : point.fromNode.level,
            levelOptions: OrganizationSeriesLevelOptions =
                (series.mapOptionsToLevel as any)[level || 0] || {},
            options = point.options,
            stateOptions: OrganizationSeriesOptions =
                (levelOptions.states &&
                    (levelOptions.states as any)[state as any]) ||
                {},
            borderRadius = pick(
                stateOptions.borderRadius,
                options.borderRadius,
                levelOptions.borderRadius,
                series.options.borderRadius
            ),

            linkColor = pick(
                stateOptions.linkColor,
                options.linkColor,
                levelOptions.linkColor,
                series.options.linkColor,
                stateOptions.link && stateOptions.link.color,
                options.link && options.link.color,
                levelOptions.link && levelOptions.link.color,
                series.options.link && series.options.link.color
            ),

            linkLineWidth = pick(
                stateOptions.linkLineWidth,
                options.linkLineWidth,
                levelOptions.linkLineWidth,
                series.options.linkLineWidth,
                stateOptions.link && stateOptions.link.lineWidth,
                options.link && options.link.lineWidth,
                levelOptions.link && levelOptions.link.lineWidth,
                series.options.link && series.options.link.lineWidth
            );


        if (!point.isNode) {
            attribs.stroke = linkColor;
            attribs['stroke-width'] = linkLineWidth;
            delete attribs.fill;
        } else {
            if (borderRadius) {
                attribs.r = borderRadius;
            }
        }
        return attribs;
    }

    public translateLink(point: OrganizationPoint): void {
        let fromNode = point.fromNode,
            toNode = point.toNode,
            linkWidth = pick(
                this.options.linkLineWidth,
                this.options.link.lineWidth
            ),
            crisp = (Math.round(linkWidth) % 2) / 2,
            factor = pick((this as any).options.link.offset, 0.5),
            type = pick(
                point.options.link && point.options.link.type,
                this.options.link.type
            ),
            x1 = Math.floor(
                (fromNode.shapeArgs as any).x +
                (fromNode.shapeArgs as any).width
            ) + crisp,
            y1 = Math.floor(
                (fromNode.shapeArgs as any).y +
                (fromNode.shapeArgs as any).height / 2
            ) + crisp,
            x2 = Math.floor((toNode.shapeArgs as any).x) + crisp,
            y2 = Math.floor(
                (toNode.shapeArgs as any).y +
                (toNode.shapeArgs as any).height / 2
            ) + crisp,
            xMiddle,
            hangingIndent: number = this.options.hangingIndent as any,
            toOffset = toNode.options.offset,
            percentOffset =
                /%$/.test(toOffset as any) && parseInt(toOffset as any, 10),
            inverted = this.chart.inverted;

        if (inverted) {
            x1 -= (fromNode.shapeArgs as any).width;
            x2 += (toNode.shapeArgs as any).width;
        }
        xMiddle = this.colDistance ?
            Math.floor(
                x2 +
                    ((inverted ? 1 : -1) *
                        (this.colDistance - this.nodeWidth)) /
                        2
            ) + crisp :
            Math.floor((x2 + x1) / 2) + crisp;

        // Put the link on the side of the node when an offset is given. HR
        // node in the main demo.
        if (
            percentOffset &&
            (percentOffset >= 50 || percentOffset <= -50)
        ) {
            xMiddle = x2 = Math.floor(
                x2 + (inverted ? -0.5 : 0.5) *
                (toNode.shapeArgs as any).width
            ) + crisp;
            y2 = (toNode.shapeArgs as any).y;
            if (percentOffset > 0) {
                y2 += (toNode.shapeArgs as any).height;
            }
        }

        if (toNode.hangsFrom === fromNode) {
            if (this.chart.inverted) {
                y1 = Math.floor(
                    (fromNode.shapeArgs as any).y +
                    (fromNode.shapeArgs as any).height -
                    hangingIndent / 2
                ) + crisp;
                y2 = (
                    (toNode.shapeArgs as any).y +
                    (toNode.shapeArgs as any).height
                );
            } else {
                y1 = Math.floor(
                    (fromNode.shapeArgs as any).y +
                    hangingIndent / 2
                ) + crisp;

            }
            xMiddle = x2 = Math.floor(
                (toNode.shapeArgs as any).x +
                (toNode.shapeArgs as any).width / 2
            ) + crisp;
        }

        point.plotY = 1;
        point.shapeType = 'path';
        if (type === 'straight') {
            point.shapeArgs = {
                d: [
                    ['M', x1, y1],
                    ['L', x2, y2]
                ]
            };
        } else if (type === 'curved') {
            const offset = Math.abs(x2 - x1) * factor * (inverted ? -1 : 1);
            point.shapeArgs = {
                d: [
                    ['M', x1, y1],
                    ['C', x1 + offset, y1, x2 - offset, y2, x2, y2]
                ]
            };
        } else {
            point.shapeArgs = {
                d: OrganizationSeries.curvedPath(
                    [
                        ['M', x1, y1],
                        ['L', xMiddle, y1],
                        ['L', xMiddle, y2],
                        ['L', x2, y2]
                    ],
                    pick(this.options.linkRadius, this.options.link.radius)
                )
            };
        }
        point.tooltipPos = [(x1 + x2) / 2, (y1 + y2) / 2];
        point.dlBox = {
            x: (x1 + x2) / 2,
            y: (y1 + y2) / 2,
            height: linkWidth,
            width: 0
        };

    }

    public translateNode(
        node: OrganizationPoint,
        column: SankeyColumnComposition.ArrayComposition<OrganizationPoint>
    ): void {
        SankeySeries.prototype.translateNode.call(this, node, column);
        let parentNode = node.hangsFrom,
            indent = this.options.hangingIndent || 0,
            sign = this.chart.inverted ? -1 : 1,
            shapeArgs = (node.shapeArgs as any),
            indentLogic = this.options.hangingIndentTranslation,
            minLength = this.options.minNodeLength || 10;

        if (parentNode) {
            if (indentLogic === 'cumulative') {
                // Move to the right:
                shapeArgs.height -= indent;
                shapeArgs.y -= sign * indent;
                while (parentNode) {
                    shapeArgs.y += sign * indent;
                    parentNode = parentNode.hangsFrom;
                }
            } else if (indentLogic === 'shrink') {
                // Resize the node:
                while (
                    parentNode &&
                    shapeArgs.height > indent + minLength
                ) {
                    shapeArgs.height -= indent;
                    parentNode = parentNode.hangsFrom;
                }
            } else {
                // indentLogic === "inherit"
                // Do nothing (v9.3.2 and prev versions):
                shapeArgs.height -= indent;
                if (!this.chart.inverted) {
                    shapeArgs.y += indent;
                }
            }
        }
        node.nodeHeight = this.chart.inverted ?
            shapeArgs.width :
            shapeArgs.height;
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Class Prototype
 *
 * */

interface OrganizationSeries {
    pointClass: typeof OrganizationPoint;
}
extend(OrganizationSeries.prototype, {
    pointClass: OrganizationPoint
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        organization: typeof OrganizationSeries;
    }
}
SeriesRegistry.registerSeriesType('organization', OrganizationSeries);

/* *
 *
 *  Default Export
 *
 * */

export default OrganizationSeries;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * Layout value for the child nodes in an organization chart. If `hanging`, this
 * node's children will hang below their parent, allowing a tighter packing of
 * nodes in the diagram.
 *
 * @typedef {"normal"|"hanging"} Highcharts.SeriesOrganizationNodesLayoutValue
 */

/**
 * Indent translation value for the child nodes in an organization chart, when
 * parent has `hanging` layout. Option can shrink nodes (for tight charts),
 * translate children to the left, or render nodes directly under the parent.
 *
 * @typedef {"inherit"|"cumulative"|"shrink"} Highcharts.OrganizationHangingIndentTranslationValue
 */

''; // detach doclets above

/* *
 *
 *  API Options
 *
 * */

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

''; // adds doclets above to transpiled file
