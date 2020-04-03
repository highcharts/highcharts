/* *
 *
 *  Networkgraph series
 *
 *  (c) 2010-2020 Paweł Fus
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
import H from '../../parts/Globals.js';
import U from '../../parts/Utilities.js';
var fireEvent = U.fireEvent;
var Chart = H.Chart;
/* eslint-disable no-invalid-this, valid-jsdoc */
H.layoutAnimationMixin = {
    /**
     * Method dealing with overlapping dataLabels
     * in series using layout simulation
     * @param {Array<Highcharts.SVGElement>} labels Array of all series labels
     * @return {undefined}
     */
    hideOverlappingLabels: function (labels) {
        var chart = this.chart, styledMode = chart.styledMode, len = labels.length, ren = chart.renderer, label, i, j, label1, label2, box1, box2, isIntersectRect = function (box1, box2) {
            return !(box2.x > box1.x + box1.width ||
                box2.x + box2.width < box1.x ||
                box2.y > box1.y + box1.height ||
                box2.y + box2.height < box1.y);
        }, 
        // Get the box with its position inside the chart,
        // as opposed to getBBox that only reports
        // the position relative to the parent.
        getAbsoluteBox = function (label) {
            var pos, parent, bBox, 
            // Substract the padding if no background or border (#4333)
            padding = label.box ? 0 : (label.padding || 0), lineHeightCorrection = 0;
            if (label &&
                (!label.alignAttr || label.placed)) {
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
                    // Labels positions are computed from top left corner,
                    // so we need to substract the text
                    // height from text nodes too.
                    lineHeightCorrection = ren
                        .fontMetrics(null, label.element).h;
                }
                return {
                    x: pos.x + (parent.translateX || 0) + padding,
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
                if (box1 &&
                    box2 &&
                    label1 !== label2 && // #6465, polar chart with connectEnds
                    label1.newOpacity !== 0 &&
                    label2.newOpacity !== 0) {
                    if (isIntersectRect(box1, box2)) {
                        (label1.labelrank < label2.labelrank ? label1 : label2)
                            .newOpacity = 0;
                    }
                }
            }
        }
        var isLabelAffected = false;
        // Hide or show
        labels.forEach(function (label) {
            var complete, newOpacity;
            if (label) {
                newOpacity = label.newOpacity;
                if (label.oldOpacity !== newOpacity) {
                    // Make sure the label is completely hidden
                    // to avoid catching clicks (#4362)
                    if (label.alignAttr && label.placed) { // data labels
                        if (newOpacity) {
                            label.removeClass('highcharts-simulation-dataLabels');
                            label.addClass('highcharts-simulation-dataLabels-fadeout');
                            if (!styledMode) { // <--- !styledMode :
                                label.css({
                                    opacity: 1,
                                    transition: 'opacity 2000ms'
                                });
                            }
                        }
                        else {
                            complete = function () {
                                label.removeClass('highcharts-simulation-dataLabels-fadeout');
                                label.addClass('highcharts-simulation-dataLabels');
                                if (!styledMode) { // <--- !styledMode :
                                    label.css({
                                        opacity: 0,
                                        transition: 'opacity 2000ms'
                                    });
                                }
                                label.placed = false; // avoid animation from top
                            };
                        }
                        isLabelAffected = true;
                        // Animate or set the opacity
                        label.alignAttr.opacity = newOpacity;
                        label[label.isOld ? 'animate' : 'attr'](label.alignAttr, null, complete);
                        fireEvent(chart, 'afterHideOverlappingLabel');
                    }
                    else { // other labels, tick labels
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
    }
};
