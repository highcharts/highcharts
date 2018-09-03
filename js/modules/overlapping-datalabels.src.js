/**
 * (c) 2009-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Chart.js';
/**
 * Highcharts module to hide overlapping data labels. This module is included in
 * Highcharts.
 *
 * @ignore
 */
var Chart = H.Chart,
    each = H.each,
    objectEach = H.objectEach,
    pick = H.pick,
    addEvent = H.addEvent;

// Collect potensial overlapping data labels. Stack labels probably don't need
// to be considered because they are usually accompanied by data labels that lie
// inside the columns.
addEvent(Chart, 'render', function collectAndHide() {
    var labels = [];
    // Consider external label collectors
    each(this.labelCollectors || [], function (collector) {
        labels = labels.concat(collector());
    });

    each(this.yAxis || [], function (yAxis) {
        if (
            yAxis.options.stackLabels &&
            !yAxis.options.stackLabels.allowOverlap
        ) {
            objectEach(yAxis.stacks, function (stack) {
                objectEach(stack, function (stackItem) {
                    labels.push(stackItem.label);
                });
            });
        }
    });

    each(this.series || [], function (series) {
        var dlOptions = series.options.dataLabels,
            // Range series have two collections
            collections = series.dataLabelCollections || ['dataLabel'];

        if (
            (dlOptions.enabled || series._hasPointLabels) &&
            !dlOptions.allowOverlap &&
            series.visible
        ) { // #3866
            each(collections, function (coll) {
                each(series.points, function (point) {
                    if (point[coll] && point.visible) {  // #7815
                        point[coll].labelrank = pick(
                            point.labelrank,
                            point.shapeArgs && point.shapeArgs.height
                        ); // #4118
                        labels.push(point[coll]);
                    }
                });
            });
        }
    });

    this.hideOverlappingLabels(labels);
});

/**
 * Hide overlapping labels. Labels are moved and faded in and out on zoom to
 * provide a smooth visual imression.
 */
Chart.prototype.hideOverlappingLabels = function (labels) {

    var len = labels.length,
        ren = this.renderer,
        label,
        i,
        j,
        label1,
        label2,
        isIntersecting,
        box1,
        box2,
        intersectRect = function (x1, y1, w1, h1, x2, y2, w2, h2) {
            return !(
                x2 > x1 + w1 ||
                x2 + w2 < x1 ||
                y2 > y1 + h1 ||
                y2 + h2 < y1
            );
        },

        /**
         * Get the box with its position inside the chart, as opposed to getBBox
         * that only reports the position relative to the parent.
         */
        getAbsoluteBox = function (label) {
            var pos,
                parent,
                bBox,
                // Substract the padding if no background or border (#4333)
                padding = 2 * (label.box ? 0 : (label.padding || 0)),
                lineHeightCorrection = 0;

            if (
                label &&
                (!label.alignAttr || label.placed)
            ) {
                pos = label.alignAttr || {
                    x: label.attr('x'),
                    y: label.attr('y')
                };
                parent = label.parentGroup;

                // Get width and height if pure text nodes (stack labels)
                if (!label.width) {
                    bBox = label.getBBox();
                    label.width = bBox.width;
                    label.height = bBox.height;

                    // Labels positions are computed from top left corner, so
                    // we need to substract the text height from text nodes too.
                    lineHeightCorrection = ren
                        .fontMetrics(null, label.element).h;
                }
                return {
                    x: pos.x + (parent.translateX || 0),
                    y: pos.y + (parent.translateY || 0) - lineHeightCorrection,
                    width: label.width - padding,
                    height: label.height - padding
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
    labels.sort(function (a, b) {
        return (b.labelrank || 0) - (a.labelrank || 0);
    });

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
                isIntersecting = intersectRect(
                    box1.x,
                    box1.y,
                    box1.width,
                    box1.height,
                    box2.x,
                    box2.y,
                    box2.width,
                    box2.height
                );


                if (isIntersecting) {
                    (label1.labelrank < label2.labelrank ? label1 : label2)
                        .newOpacity = 0;
                }
            }
        }
    }

    // Hide or show
    each(labels, function (label) {
        var complete,
            newOpacity;

        if (label) {
            newOpacity = label.newOpacity;

            if (label.oldOpacity !== newOpacity) {

                // Make sure the label is completely hidden to avoid catching
                // clicks (#4362)
                if (label.alignAttr && label.placed) { // data labels
                    if (newOpacity) {
                        label.show(true);
                    } else {
                        complete = function () {
                            label.hide();
                        };
                    }

                    // Animate or set the opacity
                    label.alignAttr.opacity = newOpacity;
                    label[label.isOld ? 'animate' : 'attr'](
                        label.alignAttr,
                        null,
                        complete
                    );
                } else { // other labels, tick labels
                    label.attr({
                        opacity: newOpacity
                    });
                }

            }
            label.isOld = true;
        }
    });
};
