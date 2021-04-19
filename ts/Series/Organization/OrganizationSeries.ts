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
import type SankeySeriesType from '../Sankey/SankeySeries';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import OrganizationPoint from './OrganizationPoint.js';
import palette from '../../Core/Color/Palette.js';
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
        borderColor: palette.neutralColor60,
        /**
         * The border radius of the node cards.
         *
         * @private
         */
        borderRadius: 3,
        /**
         * Radius for the rounded corners of the links between nodes.
         *
         * @sample   highcharts/series-organization/link-options
         *           Square links
         *
         * @private
         */
        linkRadius: 10,
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

                var outerStyle: CSSObject = {
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

                var html = '<div ' + styleAttr(outerStyle) + '>';

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
         * The color of the links between nodes.
         *
         * @type {Highcharts.ColorString}
         * @private
         */
        linkColor: palette.neutralColor60,
        /**
         * The line width of the links connecting nodes, in pixels.
         *
         * @sample   highcharts/series-organization/link-options
         *           Square links
         *
         * @private
         */
        linkLineWidth: 1,
        /**
         * In a horizontal chart, the width of the nodes in pixels. Node that
         * most organization charts are vertical, so the name of this option
         * is counterintuitive.
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
        r: number
    ): SVGPath {
        var d: SVGPath = [];

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
        dataLabel: SVGElement,
        options: OrganizationDataLabelOptions
    ): void {
        // Align the data label to the point graphic
        if (options.useHTML) {
            var width = (point.shapeArgs as any).width,
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
        var node: OrganizationPoint = super.createNode.call(this, id) as any;

        // All nodes in an org chart are equal width
        node.getSum = function (): number {
            return 1;
        };

        return node;

    }

    public createNodeColumn(): OrganizationSeries.ColumnArray {
        var column: OrganizationSeries.ColumnArray = super.createNodeColumn.call(this) as any;

        // Wrap the offset function so that the hanging node's children are
        // aligned to their parent
        wrap(column, 'offset', function (
            this: OrganizationPoint,
            proceed: SankeySeriesType.ColumnArray['offset'],
            node: OrganizationPoint,
            factor: number
        ): (Record<string, number>|undefined) {
            var offset = proceed.call(this, node, factor); // eslint-disable-line no-invalid-this

            // Modify the default output if the parent's layout is 'hanging'
            if (node.hangsFrom) {
                return {
                    absoluteTop: node.hangsFrom.nodeY
                };
            }

            return offset;
        });

        return column;
    }

    public pointAttribs(
        point: OrganizationPoint,
        state?: StatesOptionsKey
    ): SVGAttributes {
        var series = this,
            attribs = SankeySeries.prototype.pointAttribs.call(series, point, state),
            level = point.isNode ? point.level : point.fromNode.level,
            levelOptions: OrganizationSeriesLevelOptions =
                (series.mapOptionsToLevel as any)[level || 0] || {},
            options = point.options,
            stateOptions: OrganizationSeriesOptions = (
                levelOptions.states && (levelOptions.states as any)[state as any]
            ) || {},
            values: (
                OrganizationPointOptions &
                OrganizationSeriesOptions
            ) = ['borderRadius', 'linkColor', 'linkLineWidth']
                .reduce(function (
                    obj: Record<string, unknown>,
                    key: string
                ): Record<string, unknown> {
                    obj[key] = pick(
                        (stateOptions as any)[key],
                        (options as any)[key],
                        (levelOptions as any)[key],
                        (series.options as any)[key]
                    );
                    return obj;
                }, {});

        if (!point.isNode) {
            attribs.stroke = values.linkColor;
            attribs['stroke-width'] = values.linkLineWidth;
            delete attribs.fill;
        } else {
            if (values.borderRadius) {
                attribs.r = values.borderRadius;
            }
        }
        return attribs;
    }

    public translateLink(point: OrganizationPoint): void {
        var fromNode = point.fromNode,
            toNode = point.toNode,
            crisp = Math.round(this.options.linkLineWidth as any) % 2 / 2,
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
        xMiddle = Math.floor(
            x2 +
            (inverted ? 1 : -1) *
            (this.colDistance - this.nodeWidth) / 2
        ) + crisp;

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
        point.shapeArgs = {
            d: OrganizationSeries.curvedPath([
                ['M', x1, y1],
                ['L', xMiddle, y1],
                ['L', xMiddle, y2],
                ['L', x2, y2]
            ], this.options.linkRadius as any)
        };
    }

    public translateNode(
        node: OrganizationPoint,
        column: OrganizationSeries.ColumnArray
    ): void {
        SankeySeries.prototype.translateNode.call(this, node, column);

        if (node.hangsFrom) {
            (node.shapeArgs as any).height -=
                this.options.hangingIndent as any;
            if (!this.chart.inverted) {
                (node.shapeArgs as any).y += this.options.hangingIndent;
            }
        }
        node.nodeHeight = this.chart.inverted ?
            (node.shapeArgs as any).width :
            (node.shapeArgs as any).height;
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Prototype Properties
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
 *  Class Namespace
 *
 * */

namespace OrganizationSeries {
    export interface ColumnArray<T = OrganizationPoint> extends SankeySeriesType.ColumnArray<T> {
        offset(node: T, factor: number): (Record<string, number>|undefined);
    }
}

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
