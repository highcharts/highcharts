/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type PiePoint from './PiePoint';
import type PieSeries from './PieSeries';
import type Point from '../../Core/Series/Point';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

import DataLabel from '../../Core/Series/DataLabel.js';
import H from '../../Core/Globals.js';
const { noop } = H;
import { Palette } from '../../Core/Color/Palettes.js';
import R from '../../Core/Renderer/RendererUtilities.js';
const { distribute } = R;
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const { series: Series } = SeriesRegistry;
import U from '../../Core/Utilities.js';
const {
    arrayMax,
    clamp,
    defined,
    merge,
    pick,
    relativeLength
} = U;

/* *
 *
 *  Composition
 *
 * */

namespace ColumnDataLabel {

    /* *
     *
     *  Constants
     *
     * */

    const composedClasses: Array<Function> = [];

    const dataLabelPositioners = {

        // Based on the value computed in Highcharts' distribute algorithm.
        radialDistributionY: function (point: PiePoint): number {
            return point.top + (point.distributeBox as any).pos;
        },
        // get the x - use the natural x position for labels near the
        // top and bottom, to prevent the top and botton slice
        // connectors from touching each other on either side

        // Based on the value computed in Highcharts' distribute algorithm.
        radialDistributionX: function (
            series: PieSeries,
            point: PiePoint,
            y: number,
            naturalY: number
        ): number {
            return series.getX(
                y < (point.top as any) + 2 || y > (point.bottom as any) - 2 ?
                    naturalY :
                    y,
                point.half as any,
                point
            );
        },

        // dataLabels.distance determines the x position of the label
        justify: function (
            point: PiePoint,
            radius: number,
            seriesCenter: Array<number>
        ): number {
            return seriesCenter[0] + (point.half ? -1 : 1) *
            (radius + (point.labelDistance as any));
        },

        // Left edges of the left-half labels touch the left edge of the plot
        // area. Right edges of the right-half labels touch the right edge of
        // the plot area.
        alignToPlotEdges: function (
            dataLabel: SVGElement,
            half: boolean,
            plotWidth: number,
            plotLeft: number
        ): number {
            const dataLabelWidth = dataLabel.getBBox().width;

            return half ? dataLabelWidth + plotLeft :
                plotWidth - dataLabelWidth - plotLeft;
        },

        // Connectors of each side end in the same x position. Labels are
        // aligned to them. Left edge of the widest left-half label touches the
        // left edge of the plot area. Right edge of the widest right-half label
        // touches the right edge of the plot area.
        alignToConnectors: function (
            points: Array<PiePoint>,
            half: boolean,
            plotWidth: number,
            plotLeft: number
        ): number {
            let maxDataLabelWidth = 0,
                dataLabelWidth;

            // find widest data label
            points.forEach(function (point): void {
                dataLabelWidth = (point.dataLabel as any).getBBox().width;
                if (dataLabelWidth > maxDataLabelWidth) {
                    maxDataLabelWidth = dataLabelWidth;
                }
            });
            return half ? maxDataLabelWidth + plotLeft :
                plotWidth - maxDataLabelWidth - plotLeft;
        }
    };

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /** @private */
    export function compose(PieSeriesClass: typeof PieSeries): void {

        DataLabel.compose(Series);

        if (composedClasses.indexOf(PieSeriesClass) === -1) {
            composedClasses.push(PieSeriesClass);

            const pieProto = PieSeriesClass.prototype;

            pieProto.dataLabelPositioners = dataLabelPositioners;
            pieProto.alignDataLabel = noop;
            pieProto.drawDataLabels = drawDataLabels;
            pieProto.placeDataLabels = placeDataLabels;
            pieProto.verifyDataLabelOverflow = verifyDataLabelOverflow;
        }

    }

    /**
     * Override the base drawDataLabels method by pie specific functionality
     * @private
     */
    function drawDataLabels(
        this: PieSeries
    ): void {
        const series = this,
            data = series.data,
            chart = series.chart,
            options = series.options.dataLabels || {},
            connectorPadding = (options as any).connectorPadding,
            plotWidth = chart.plotWidth,
            plotHeight = chart.plotHeight,
            plotLeft = chart.plotLeft,
            maxWidth = Math.round(chart.chartWidth / 3),
            seriesCenter = series.center,
            radius = seriesCenter[2] / 2,
            centerY = seriesCenter[1],
            halves = [
                [], // right
                [] // left
            ] as [Array<PiePoint>, Array<PiePoint>],
            overflow = [0, 0, 0, 0], // top, right, bottom, left
            dataLabelPositioners = series.dataLabelPositioners;

        let point,
            connectorWidth,
            connector,
            dataLabel,
            dataLabelWidth,
            // labelPos,
            labelPosition,
            labelHeight: number,
            // divide the points into right and left halves for anti collision
            x,
            y,
            visibility,
            j,
            pointDataLabelsOptions;

        // get out if not enabled
        if (!series.visible ||
            (!(options as any).enabled &&
            !series._hasPointLabels)
        ) {
            return;
        }

        // Reset all labels that have been shortened
        data.forEach(function (point): void {
            if (point.dataLabel && point.visible && point.dataLabel.shortened) {
                point.dataLabel
                    .attr({
                        width: 'auto'
                    } as unknown as SVGAttributes).css({
                        width: 'auto',
                        textOverflow: 'clip'
                    });
                point.dataLabel.shortened = false;
            }
        });


        // run parent method
        Series.prototype.drawDataLabels.apply(series);

        data.forEach(function (point): void {
            if (point.dataLabel) {

                if (point.visible) { // #407, #2510

                    // Arrange points for detection collision
                    halves[point.half as any].push(point);

                    // Reset positions (#4905)
                    point.dataLabel._pos = null;

                    // Avoid long labels squeezing the pie size too far down
                    if (!defined((options as any).style.width) &&
                        !defined(
                            point.options.dataLabels &&
                            (point.options.dataLabels as any).style &&
                            (point.options.dataLabels as any).style.width
                        )
                    ) {
                        if (point.dataLabel.getBBox().width > maxWidth) {
                            point.dataLabel.css({
                                // Use a fraction of the maxWidth to avoid
                                // wrapping close to the end of the string.
                                width: Math.round(maxWidth * 0.7) + 'px'
                            });
                            point.dataLabel.shortened = true;
                        }
                    }
                } else {
                    point.dataLabel = point.dataLabel.destroy();
                    // Workaround to make pies destroy multiple datalabels
                    // correctly. This logic needs rewriting to support multiple
                    // datalabels fully.
                    if (point.dataLabels && point.dataLabels.length === 1) {
                        delete point.dataLabels;
                    }
                }
            }
        });

        /* Loop over the points in each half, starting from the top and bottom
         * of the pie to detect overlapping labels.
         */
        halves.forEach((points, i): void => {
            const length = points.length,
                positions: Array<R.BoxObject> = [];

            let top,
                bottom,
                naturalY,
                sideOverflow,
                size: any,
                distributionLength;

            if (!length) {
                return;
            }

            // Sort by angle
            series.sortByAngle(points, i - 0.5);
            // Only do anti-collision when we have dataLabels outside the pie
            // and have connectors. (#856)
            if (series.maxLabelDistance > 0) {
                top = Math.max(
                    0,
                    centerY - radius - series.maxLabelDistance
                );
                bottom = Math.min(
                    centerY + radius + series.maxLabelDistance,
                    chart.plotHeight
                );
                points.forEach(function (point): void {
                    // check if specific points' label is outside the pie
                    if ((point.labelDistance as any) > 0 && point.dataLabel) {
                        // point.top depends on point.labelDistance value
                        // Used for calculation of y value in getX method
                        point.top = Math.max(
                            0,
                            centerY - radius - (point.labelDistance as any)
                        );
                        point.bottom = Math.min(
                            centerY + radius + (point.labelDistance as any),
                            chart.plotHeight
                        );
                        size = point.dataLabel.getBBox().height || 21;

                        // point.positionsIndex is needed for getting index of
                        // parameter related to specific point inside positions
                        // array - not every point is in positions array.
                        point.distributeBox = {
                            target: (point.labelPosition as any).natural.y -
                                point.top + size / 2,
                            size: size,
                            rank: point.y
                        };
                        positions.push(point.distributeBox);
                    }
                });
                distributionLength = bottom + size - top;
                distribute(
                    positions,
                    distributionLength,
                    distributionLength / 5
                );
            }

            // Now the used slots are sorted, fill them up sequentially
            for (j = 0; j < length; j++) {

                point = points[j];
                // labelPos = point.labelPos;
                labelPosition = point.labelPosition;
                dataLabel = point.dataLabel;
                visibility = point.visible === false ? 'hidden' : 'inherit';
                naturalY = (labelPosition as any).natural.y;
                y = naturalY;

                if (positions && defined(point.distributeBox)) {
                    if (
                        typeof (point.distributeBox as any).pos === 'undefined'
                    ) {
                        visibility = 'hidden';
                    } else {
                        labelHeight = (point.distributeBox as any).size;
                        // Find label's y position
                        y = (dataLabelPositioners as any)
                            .radialDistributionY(point);
                    }
                }

                // It is needed to delete point.positionIndex for
                // dynamically added points etc.

                delete point.positionIndex; // @todo unused

                // Find label's x position
                // justify is undocumented in the API - preserve support for it
                if ((options as any).justify) {
                    x = (dataLabelPositioners as any).justify(
                        point,
                        radius,
                        seriesCenter
                    );
                } else {
                    switch ((options as any).alignTo) {
                        case 'connectors':
                            x = (dataLabelPositioners as any).alignToConnectors(
                                points,
                                i as any,
                                plotWidth,
                                plotLeft
                            );
                            break;
                        case 'plotEdges':
                            x = (dataLabelPositioners as any).alignToPlotEdges(
                                dataLabel as any,
                                i as any,
                                plotWidth,
                                plotLeft
                            );
                            break;
                        default:
                            x = (
                                dataLabelPositioners as any
                            ).radialDistributionX(
                                series,
                                point,
                                y,
                                naturalY
                            );
                    }
                }

                // Record the placement and visibility
                (dataLabel as any)._attr = {
                    visibility: visibility,
                    align: (labelPosition as any).alignment
                };

                pointDataLabelsOptions = point.options.dataLabels || {};

                (dataLabel as any)._pos = {
                    x: (
                        x +
                        pick(pointDataLabelsOptions.x, options.x) + // (#12985)
                        (({
                            left: connectorPadding,
                            right: -connectorPadding
                        } as any)[(labelPosition as any).alignment] || 0)
                    ),

                    // 10 is for the baseline (label vs text)
                    y: (
                        y +
                        pick(pointDataLabelsOptions.y, options.y) - // (#12985)
                        10
                    )
                };
                // labelPos.x = x;
                // labelPos.y = y;
                if (labelPosition) {
                    labelPosition.computed.x = x;
                    labelPosition.computed.y = y;
                }

                // Detect overflowing data labels
                if (pick((options as any).crop, true)) {
                    dataLabelWidth = (dataLabel as any).getBBox().width;

                    sideOverflow = null;
                    // Overflow left
                    if (
                        x - dataLabelWidth < connectorPadding &&
                        i === 1 // left half
                    ) {
                        sideOverflow = Math.round(
                            dataLabelWidth - x + connectorPadding
                        );
                        overflow[3] = Math.max(sideOverflow, overflow[3]);

                    // Overflow right
                    } else if (
                        x + dataLabelWidth > plotWidth - connectorPadding &&
                        i === 0 // right half
                    ) {
                        sideOverflow = Math.round(
                            x + dataLabelWidth - plotWidth + connectorPadding
                        );
                        overflow[1] = Math.max(sideOverflow, overflow[1]);
                    }

                    // Overflow top
                    if (y - labelHeight / 2 < 0) {
                        overflow[0] = Math.max(
                            Math.round(-y + labelHeight / 2),
                            overflow[0]
                        );

                    // Overflow left
                    } else if (y + labelHeight / 2 > plotHeight) {
                        overflow[2] = Math.max(
                            Math.round(y + labelHeight / 2 - plotHeight),
                            overflow[2]
                        );
                    }
                    (dataLabel as any).sideOverflow = sideOverflow;
                }
            } // for each point
        }); // for each half

        // Do not apply the final placement and draw the connectors until we
        // have verified that labels are not spilling over.
        if (arrayMax(overflow) === 0 ||
            (this.verifyDataLabelOverflow as any)(overflow)
        ) {

            // Place the labels in the final position
            (this.placeDataLabels as any)();


            this.points.forEach(function (point): void {
                // #8864: every connector can have individual options
                pointDataLabelsOptions =
                    merge(options, point.options.dataLabels);
                connectorWidth =
                    pick((pointDataLabelsOptions as any).connectorWidth, 1);

                // Draw the connector
                if (connectorWidth) {
                    let isNew;

                    connector = point.connector;
                    dataLabel = point.dataLabel;

                    if (dataLabel &&
                        dataLabel._pos &&
                        point.visible &&
                        (point.labelDistance as any) > 0
                    ) {
                        visibility = dataLabel._attr.visibility;

                        isNew = !connector;

                        if (isNew) {
                            point.connector = connector = chart.renderer
                                .path()
                                .addClass(
                                    'highcharts-data-label-connector ' +
                                    ' highcharts-color-' + point.colorIndex +
                                    (
                                        point.className ?
                                            ' ' + point.className :
                                            ''
                                    )
                                )
                                .add(series.dataLabelsGroup);


                            if (!chart.styledMode) {
                                connector.attr({
                                    'stroke-width': connectorWidth,
                                    'stroke': (
                                        (
                                            pointDataLabelsOptions as any
                                        ).connectorColor ||
                                        point.color ||
                                        Palette.neutralColor60
                                    )
                                });
                            }
                        }
                        (connector as any)[isNew ? 'attr' : 'animate']({
                            d: point.getConnectorPath()
                        });
                        (connector as any).attr('visibility', visibility);

                    } else if (connector) {
                        point.connector = connector.destroy();
                    }
                }
            });
        }
    }

    /**
     * Perform the final placement of the data labels after we have verified
     * that they fall within the plot area.
     * @private
     */
    function placeDataLabels(
        this: PieSeries
    ): void {
        this.points.forEach(function (point: Point): void {
            let dataLabel = point.dataLabel,
                _pos;

            if (dataLabel && point.visible) {
                _pos = dataLabel._pos;
                if (_pos) {

                    // Shorten data labels with ellipsis if they still overflow
                    // after the pie has reached minSize (#223).
                    if (dataLabel.sideOverflow) {
                        dataLabel._attr.width =
                            Math.max(dataLabel.getBBox().width -
                            dataLabel.sideOverflow, 0);

                        dataLabel.css({
                            width: dataLabel._attr.width + 'px',
                            textOverflow: (
                                ((this.options.dataLabels as any).style || {})
                                    .textOverflow ||
                                'ellipsis'
                            )
                        });
                        dataLabel.shortened = true;
                    }

                    dataLabel.attr(dataLabel._attr);
                    dataLabel[dataLabel.moved ? 'animate' : 'attr'](_pos);
                    dataLabel.moved = true;
                } else if (dataLabel) {
                    dataLabel.attr({ y: -9999 });
                }
            }
            // Clear for update
            delete point.distributeBox;
        }, this);
    }

    /**
     * Verify whether the data labels are allowed to draw, or we should run more
     * translation and data label positioning to keep them inside the plot area.
     * Returns true when data labels are ready to draw.
     * @private
     */
    function verifyDataLabelOverflow(
        this: PieSeries,
        overflow: Array<number>
    ): boolean {

        let center = this.center,
            options = this.options,
            centerOption = options.center,
            minSize = options.minSize || 80,
            newSize = minSize,
            // If a size is set, return true and don't try to shrink the pie
            // to fit the labels.
            ret = options.size !== null;

        if (!ret) {
            // Handle horizontal size and center
            if ((centerOption as any)[0] !== null) { // Fixed center
                newSize = Math.max(center[2] -
                    Math.max(overflow[1], overflow[3]), minSize as any);

            } else { // Auto center
                newSize = Math.max(
                    // horizontal overflow
                    center[2] - overflow[1] - overflow[3],
                    minSize as any
                );
                // horizontal center
                center[0] += (overflow[3] - overflow[1]) / 2;
            }

            // Handle vertical size and center
            if ((centerOption as any)[1] !== null) { // Fixed center
                newSize = clamp(
                    newSize,
                    minSize as any,
                    center[2] - Math.max(overflow[0], overflow[2])
                );
            } else { // Auto center
                newSize = clamp(
                    newSize,
                    minSize as any,
                    // vertical overflow
                    center[2] - overflow[0] - overflow[2]
                );
                // vertical center
                center[1] += (overflow[0] - overflow[2]) / 2;
            }

            // If the size must be decreased, we need to run translate and
            // drawDataLabels again
            if (newSize < center[2]) {
                center[2] = newSize;
                center[3] = Math.min( // #3632
                    options.thickness ?
                        Math.max(0, newSize - options.thickness * 2) :
                        Math.max(
                            0, relativeLength(options.innerSize || 0, newSize)
                        ), newSize
                ); // #6647
                this.translate(center);

                if (this.drawDataLabels) {
                    this.drawDataLabels();
                }
            // Else, return true to indicate that the pie and its labels is
            // within the plot area
            } else {
                ret = true;
            }
        }
        return ret;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default ColumnDataLabel;
