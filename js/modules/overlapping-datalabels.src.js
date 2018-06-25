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
                    if (point[coll]) {
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
        label,
        i,
        j,
        label1,
        label2,
        isIntersecting,
        pos1,
        pos2,
        parent1,
        parent2,
        padding,
        bBox,
        intersectRect = function (x1, y1, w1, h1, x2, y2, w2, h2) {
            return !(
                x2 > x1 + w1 ||
                x2 + w2 < x1 ||
                y2 > y1 + h1 ||
                y2 + h2 < y1
            );
        };

    for (i = 0; i < len; i++) {
        label = labels[i];
        if (label) {

            // Mark with initial opacity
            label.oldOpacity = label.opacity;
            label.newOpacity = 1;

            // Get width and height if pure text nodes (stack labels)
            if (!label.width) {
                bBox = label.getBBox();
                label.width = bBox.width;
                label.height = bBox.height;
            }
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

        for (j = i + 1; j < len; ++j) {
            label2 = labels[j];
            if (
                label1 && label2 &&
                label1 !== label2 && // #6465, polar chart with connectEnds
                label1.placed && label2.placed &&
                label1.newOpacity !== 0 && label2.newOpacity !== 0
            ) {
                pos1 = label1.alignAttr;
                pos2 = label2.alignAttr;
                // Different panes have different positions
                parent1 = label1.parentGroup;
                parent2 = label2.parentGroup;
                // Substract the padding if no background or border (#4333)
                padding = 2 * (label1.box ? 0 : (label1.padding || 0));
                isIntersecting = intersectRect(
                    pos1.x + parent1.translateX,
                    pos1.y + parent1.translateY,
                    label1.width - padding,
                    label1.height - padding,
                    pos2.x + parent2.translateX,
                    pos2.y + parent2.translateY,
                    label2.width - padding,
                    label2.height - padding
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

            if (label.oldOpacity !== newOpacity && label.placed) {

                // Make sure the label is completely hidden to avoid catching
                // clicks (#4362)
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

            }
            label.isOld = true;
        }
    });
};
