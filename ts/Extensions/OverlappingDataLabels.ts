/* *
 *
 *  Highcharts module to hide overlapping data labels.
 *  This module is included in Highcharts.
 *
 *  (c) 2009-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type { AlignValue } from '../Core/Renderer/AlignObject';
import type Point from '../Core/Series/Point';
import type SVGElement from '../Core/Renderer/SVG/SVGElement';
import Chart from '../Core/Chart/Chart.js';
import U from '../Core/Utilities.js';
const {
    addEvent,
    fireEvent,
    isArray,
    isNumber,
    objectEach,
    pick
} = U;

declare module '../Core/Chart/ChartLike'{
    interface ChartLike {
        hideOverlappingLabels(labels: Array<SVGElement>): void;
    }
}

/**
 * Internal type
 * @private
 */

/* eslint-disable no-invalid-this */

// Collect potensial overlapping data labels. Stack labels probably don't need
// to be considered because they are usually accompanied by data labels that lie
// inside the columns.
addEvent(Chart, 'render', function collectAndHide(): void {
    var labels: Array<SVGElement|undefined> = [];

    // Consider external label collectors
    (this.labelCollectors || []).forEach(function (
        collector: Chart.LabelCollectorFunction
    ): void {
        labels = labels.concat(collector());
    });

    (this.yAxis || []).forEach(function (yAxis: Highcharts.Axis): void {
        if (
            yAxis.stacking &&
            yAxis.options.stackLabels &&
            !yAxis.options.stackLabels.allowOverlap
        ) {
            objectEach(yAxis.stacking.stacks, function (
                stack: Highcharts.Dictionary<Highcharts.StackItem>
            ): void {
                objectEach(stack, function (
                    stackItem: Highcharts.StackItem
                ): void {
                    labels.push(stackItem.label);
                });
            });
        }
    });

    (this.series || []).forEach(function (series: Highcharts.Series): void {
        var dlOptions: Highcharts.DataLabelsOptions = (
            series.options.dataLabels as any
        );

        if (
            series.visible &&
            !(dlOptions.enabled === false && !series._hasPointLabels)
        ) { // #3866
            (series.nodes || series.points).forEach(function (point: Point): void {
                if (point.visible) {
                    var dataLabels = (
                        isArray(point.dataLabels) ?
                            point.dataLabels :
                            (point.dataLabel ? [point.dataLabel] : [])
                    );

                    dataLabels.forEach(function (
                        label: SVGElement
                    ): void {
                        var options = label.options;

                        label.labelrank = pick(
                            options.labelrank,
                            (point as any).labelrank,
                            point.shapeArgs && point.shapeArgs.height
                        ); // #4118

                        if (!options.allowOverlap) {
                            labels.push(label);
                        }
                    });
                }
            });
        }
    });

    this.hideOverlappingLabels(labels as any);
});

/**
 * Hide overlapping labels. Labels are moved and faded in and out on zoom to
 * provide a smooth visual imression.
 *
 * @private
 * @function Highcharts.Chart#hideOverlappingLabels
 * @param {Array<Highcharts.SVGElement>} labels
 * Rendered data labels
 * @requires modules/overlapping-datalabels
 */
Chart.prototype.hideOverlappingLabels = function (
    labels: Array<SVGElement>
): void {

    var chart = this,
        len = labels.length,
        ren = chart.renderer,
        label,
        i,
        j,
        label1,
        label2,
        box1,
        box2,
        isLabelAffected = false,
        isIntersectRect = function (
            box1: Highcharts.BBoxObject,
            box2: Highcharts.BBoxObject
        ): boolean {
            return !(
                box2.x >= box1.x + box1.width ||
                box2.x + box2.width <= box1.x ||
                box2.y >= box1.y + box1.height ||
                box2.y + box2.height <= box1.y
            );
        },

        // Get the box with its position inside the chart, as opposed to getBBox
        // that only reports the position relative to the parent.
        getAbsoluteBox = function (
            label: SVGElement
        ): (Highcharts.BBoxObject|undefined) {
            var pos: Highcharts.PositionObject,
                parent: SVGElement,
                bBox: Highcharts.BBoxObject,
                // Substract the padding if no background or border (#4333)
                padding = label.box ? 0 : (label.padding || 0),
                lineHeightCorrection = 0,
                xOffset = 0,
                boxWidth,
                alignValue;

            if (
                label &&
                (!label.alignAttr || label.placed)
            ) {
                pos = label.alignAttr || {
                    x: label.attr('x'),
                    y: label.attr('y')
                };
                parent = label.parentGroup as any;

                // Get width and height if pure text nodes (stack labels)
                if (!label.width) {
                    bBox = label.getBBox();
                    label.width = bBox.width;
                    label.height = bBox.height;

                    // Labels positions are computed from top left corner, so
                    // we need to substract the text height from text nodes too.
                    lineHeightCorrection = ren
                        .fontMetrics(null as any, label.element).h;
                }

                boxWidth = label.width - 2 * padding;
                alignValue = {
                    left: '0',
                    center: '0.5',
                    right: '1'
                }[label.alignValue as AlignValue];

                if (alignValue) {
                    xOffset = +alignValue * boxWidth;
                } else if (isNumber(label.x) && Math.round(label.x) !== label.translateX) {
                    xOffset = label.x - label.translateX;
                }

                return {
                    x: pos.x + (parent.translateX || 0) + padding -
                        (xOffset || 0),
                    y: pos.y + (parent.translateY || 0) + padding -
                        lineHeightCorrection,
                    width: label.width - 2 * padding,
                    height: label.height - 2 * padding
                };

            }
        };

    for (i = 0; i < len; i++) {
        label = labels[i];
        if (label) {

            // Mark with initial opacity
            label.oldOpacity = label.opacity;
            label.newOpacity = 1;

            label.absoluteBox = getAbsoluteBox(label);

        }
    }

    // Prevent a situation in a gradually rising slope, that each label will
    // hide the previous one because the previous one always has lower rank.
    labels.sort(
        function (
            a: SVGElement,
            b: SVGElement
        ): number {
            return (b.labelrank || 0) - (a.labelrank || 0);
        }
    );

    // Detect overlapping labels
    for (i = 0; i < len; i++) {
        label1 = labels[i];
        box1 = label1 && label1.absoluteBox;

        for (j = i + 1; j < len; ++j) {
            label2 = labels[j];
            box2 = label2 && label2.absoluteBox;

            if (
                box1 &&
                box2 &&
                label1 !== label2 && // #6465, polar chart with connectEnds
                label1.newOpacity !== 0 &&
                label2.newOpacity !== 0
            ) {
                if (isIntersectRect(box1, box2)) {
                    (label1.labelrank < label2.labelrank ? label1 : label2)
                        .newOpacity = 0;
                }
            }
        }
    }

    // Hide or show
    labels.forEach(function (label: SVGElement): void {
        var complete: (Function|undefined),
            newOpacity: number;

        if (label) {
            newOpacity = label.newOpacity;

            if (label.oldOpacity !== newOpacity) {

                // Make sure the label is completely hidden to avoid catching
                // clicks (#4362)
                if (label.alignAttr && label.placed) { // data labels
                    label[newOpacity ? 'removeClass' : 'addClass']('highcharts-data-label-hidden');
                    complete = function (): void {
                        if (!chart.styledMode) {
                            label.css({ pointerEvents: newOpacity ? 'auto' : 'none' });
                        }
                        label.visibility = newOpacity ? 'inherit' : 'hidden';
                    };

                    isLabelAffected = true;

                    // Animate or set the opacity
                    label.alignAttr.opacity = newOpacity;
                    label[label.isOld ? 'animate' : 'attr'](
                        label.alignAttr,
                        null as any,
                        complete
                    );
                    fireEvent(chart, 'afterHideOverlappingLabel');
                } else { // other labels, tick labels
                    label.attr({
                        opacity: newOpacity
                    });
                }

            }
            label.isOld = true;
        }
    });

    if (isLabelAffected) {
        fireEvent(chart, 'afterHideAllOverlappingLabels');
    }
};
