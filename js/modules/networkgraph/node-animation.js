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
var fireEvent = U.fireEvent, isIntersectRect = U.isIntersectRect;
var Chart = H.Chart;
/* eslint-disable no-invalid-this, valid-jsdoc */
H.layoutAnimationMixin = {
    hideOrShowLabels: function (labels) {
        var chart = this.chart, styledMode = chart.styledMode, len = labels.length, label1, label2, box1, box2, isLabelAffected = false, i, j;
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
        return isLabelAffected;
    },
    /**
     * Method dealing with overlapping dataLabels
     * in series using layout simulation
     * @param {Array<Highcharts.SVGElement>} labels Array of all series labels
     * @return {undefined}
     */
    hideOverlappingLabels: function (labels) {
        var chart = this.chart;
        if (H.layoutAnimationMixin.hideOrShowLabels.call(this, chart.getLabelBoxes(labels))) {
            fireEvent(chart, 'afterHideAllOverlappingLabels');
        }
    }
};
