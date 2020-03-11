/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from './../../parts/Globals.js';
import U from './../../parts/Utilities.js';
var extend = U.extend, format = U.format, isNumber = U.isNumber, merge = U.merge, pick = U.pick;
import './../../parts/SvgRenderer.js';
import controllableMixin from './controllableMixin.js';
import MockPoint from './../MockPoint.js';
import Tooltip from '../../parts/Tooltip.js';
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * A controllable label class.
 *
 * @requires modules/annotations
 *
 * @private
 * @class
 * @name Highcharts.AnnotationControllableLabel
 *
 * @param {Highcharts.Annotation} annotation
 * An annotation instance.
 * @param {Highcharts.AnnotationsLabelOptions} options
 * A label's options.
 * @param {number} index
 * Index of the label.
 */
var ControllableLabel = function (annotation, options, index) {
    this.init(annotation, options, index);
    this.collection = 'labels';
};
/**
 * Shapes which do not have background - the object is used for proper
 * setting of the contrast color.
 *
 * @type {Array<string>}
 */
ControllableLabel.shapesWithoutBackground = ['connector'];
/**
 * Returns new aligned position based alignment options and box to align to.
 * It is almost a one-to-one copy from SVGElement.prototype.align
 * except it does not use and mutate an element
 *
 * @param {Highcharts.AnnotationAlignObject} alignOptions
 *
 * @param {Highcharts.BBoxObject} box
 *
 * @return {Highcharts.PositionObject}
 * Aligned position.
 */
ControllableLabel.alignedPosition = function (alignOptions, box) {
    var align = alignOptions.align, vAlign = alignOptions.verticalAlign, x = (box.x || 0) + (alignOptions.x || 0), y = (box.y || 0) + (alignOptions.y || 0), alignFactor, vAlignFactor;
    if (align === 'right') {
        alignFactor = 1;
    }
    else if (align === 'center') {
        alignFactor = 2;
    }
    if (alignFactor) {
        x += (box.width - (alignOptions.width || 0)) / alignFactor;
    }
    if (vAlign === 'bottom') {
        vAlignFactor = 1;
    }
    else if (vAlign === 'middle') {
        vAlignFactor = 2;
    }
    if (vAlignFactor) {
        y += (box.height - (alignOptions.height || 0)) / vAlignFactor;
    }
    return {
        x: Math.round(x),
        y: Math.round(y)
    };
};
/**
 * Returns new alignment options for a label if the label is outside the
 * plot area. It is almost a one-to-one copy from
 * Series.prototype.justifyDataLabel except it does not mutate the label and
 * it works with absolute instead of relative position.
 */
ControllableLabel.justifiedOptions = function (chart, label, alignOptions, alignAttr) {
    var align = alignOptions.align, verticalAlign = alignOptions.verticalAlign, padding = label.box ? 0 : (label.padding || 0), bBox = label.getBBox(), off, 
    //
    options = {
        align: align,
        verticalAlign: verticalAlign,
        x: alignOptions.x,
        y: alignOptions.y,
        width: label.width,
        height: label.height
    }, 
    //
    x = alignAttr.x - chart.plotLeft, y = alignAttr.y - chart.plotTop;
    // Off left
    off = x + padding;
    if (off < 0) {
        if (align === 'right') {
            options.align = 'left';
        }
        else {
            options.x = -off;
        }
    }
    // Off right
    off = x + bBox.width - padding;
    if (off > chart.plotWidth) {
        if (align === 'left') {
            options.align = 'right';
        }
        else {
            options.x = chart.plotWidth - off;
        }
    }
    // Off top
    off = y + padding;
    if (off < 0) {
        if (verticalAlign === 'bottom') {
            options.verticalAlign = 'top';
        }
        else {
            options.y = -off;
        }
    }
    // Off bottom
    off = y + bBox.height - padding;
    if (off > chart.plotHeight) {
        if (verticalAlign === 'top') {
            options.verticalAlign = 'bottom';
        }
        else {
            options.y = chart.plotHeight - off;
        }
    }
    return options;
};
/**
 * A map object which allows to map options attributes to element attributes
 *
 * @type {Highcharts.Dictionary<string>}
 */
ControllableLabel.attrsMap = {
    backgroundColor: 'fill',
    borderColor: 'stroke',
    borderWidth: 'stroke-width',
    zIndex: 'zIndex',
    borderRadius: 'r',
    padding: 'padding'
};
merge(true, ControllableLabel.prototype, controllableMixin, 
/** @lends Annotation.ControllableLabel# */ {
    /**
     * Translate the point of the label by deltaX and deltaY translations.
     * The point is the label's anchor.
     *
     * @param {number} dx translation for x coordinate
     * @param {number} dy translation for y coordinate
     **/
    translatePoint: function (dx, dy) {
        controllableMixin.translatePoint.call(this, dx, dy, 0);
    },
    /**
     * Translate x and y position relative to the label's anchor.
     *
     * @param {number} dx translation for x coordinate
     * @param {number} dy translation for y coordinate
     **/
    translate: function (dx, dy) {
        var chart = this.annotation.chart, 
        // Annotation.options
        labelOptions = this.annotation.userOptions, 
        // Chart.options.annotations
        annotationIndex = chart.annotations.indexOf(this.annotation), chartAnnotations = chart.options.annotations, chartOptions = chartAnnotations[annotationIndex], temp;
        if (chart.inverted) {
            temp = dx;
            dx = dy;
            dy = temp;
        }
        // Local options:
        this.options.x += dx;
        this.options.y += dy;
        // Options stored in chart:
        chartOptions[this.collection][this.index].x = this.options.x;
        chartOptions[this.collection][this.index].y = this.options.y;
        labelOptions[this.collection][this.index].x = this.options.x;
        labelOptions[this.collection][this.index].y = this.options.y;
    },
    render: function (parent) {
        var options = this.options, attrs = this.attrsFromOptions(options), style = options.style;
        this.graphic = this.annotation.chart.renderer
            .label('', 0, -9999, // #10055
        options.shape, null, null, options.useHTML, null, 'annotation-label')
            .attr(attrs)
            .add(parent);
        if (!this.annotation.chart.styledMode) {
            if (style.color === 'contrast') {
                style.color = this.annotation.chart.renderer.getContrast(ControllableLabel.shapesWithoutBackground.indexOf(options.shape) > -1 ? '#FFFFFF' : options.backgroundColor);
            }
            this.graphic
                .css(options.style)
                .shadow(options.shadow);
        }
        if (options.className) {
            this.graphic.addClass(options.className);
        }
        this.graphic.labelrank = options.labelrank;
        controllableMixin.render.call(this);
    },
    redraw: function (animation) {
        var options = this.options, text = this.text || options.format || options.text, label = this.graphic, point = this.points[0], show = false, anchor, attrs;
        label.attr({
            text: text ?
                format(text, point.getLabelConfig(), this.annotation.chart) :
                options.formatter.call(point, this)
        });
        anchor = this.anchor(point);
        attrs = this.position(anchor);
        show = attrs;
        if (show) {
            label.alignAttr = attrs;
            attrs.anchorX = anchor.absolutePosition.x;
            attrs.anchorY = anchor.absolutePosition.y;
            label[animation ? 'animate' : 'attr'](attrs);
        }
        else {
            label.attr({
                x: 0,
                y: -9999 // #10055
            });
        }
        label.placed = Boolean(show);
        controllableMixin.redraw.call(this, animation);
    },
    /**
     * All basic shapes don't support alignTo() method except label.
     * For a controllable label, we need to subtract translation from
     * options.
     */
    anchor: function () {
        var anchor = controllableMixin.anchor.apply(this, arguments), x = this.options.x || 0, y = this.options.y || 0;
        anchor.absolutePosition.x -= x;
        anchor.absolutePosition.y -= y;
        anchor.relativePosition.x -= x;
        anchor.relativePosition.y -= y;
        return anchor;
    },
    /**
     * Returns the label position relative to its anchor.
     *
     * @param {Highcharts.AnnotationAnchorObject} anchor
     *
     * @return {Highcharts.PositionObject|null}
     */
    position: function (anchor) {
        var item = this.graphic, chart = this.annotation.chart, point = this.points[0], itemOptions = this.options, anchorAbsolutePosition = anchor.absolutePosition, anchorRelativePosition = anchor.relativePosition, itemPosition, alignTo, itemPosRelativeX, itemPosRelativeY, showItem = point.series.visible &&
            MockPoint.prototype.isInsidePane.call(point);
        if (showItem) {
            if (itemOptions.distance) {
                itemPosition = Tooltip.prototype.getPosition.call({
                    chart: chart,
                    distance: pick(itemOptions.distance, 16)
                }, item.width, item.height, {
                    plotX: anchorRelativePosition.x,
                    plotY: anchorRelativePosition.y,
                    negative: point.negative,
                    ttBelow: point.ttBelow,
                    h: (anchorRelativePosition.height || anchorRelativePosition.width)
                });
            }
            else if (itemOptions.positioner) {
                itemPosition = itemOptions.positioner.call(this);
            }
            else {
                alignTo = {
                    x: anchorAbsolutePosition.x,
                    y: anchorAbsolutePosition.y,
                    width: 0,
                    height: 0
                };
                itemPosition = ControllableLabel.alignedPosition(extend(itemOptions, {
                    width: item.width,
                    height: item.height
                }), alignTo);
                if (this.options.overflow === 'justify') {
                    itemPosition = ControllableLabel.alignedPosition(ControllableLabel.justifiedOptions(chart, item, itemOptions, itemPosition), alignTo);
                }
            }
            if (itemOptions.crop) {
                itemPosRelativeX = itemPosition.x - chart.plotLeft;
                itemPosRelativeY = itemPosition.y - chart.plotTop;
                showItem =
                    chart.isInsidePlot(itemPosRelativeX, itemPosRelativeY) &&
                        chart.isInsidePlot(itemPosRelativeX + item.width, itemPosRelativeY + item.height);
            }
        }
        return showItem ? itemPosition : null;
    }
});
/* ********************************************************************** */
/**
 * General symbol definition for labels with connector
 * @private
 */
H.SVGRenderer.prototype.symbols.connector = function (x, y, w, h, options) {
    var anchorX = options && options.anchorX, anchorY = options && options.anchorY, path, yOffset, lateral = w / 2;
    if (isNumber(anchorX) && isNumber(anchorY)) {
        path = ['M', anchorX, anchorY];
        // Prefer 45 deg connectors
        yOffset = y - anchorY;
        if (yOffset < 0) {
            yOffset = -h - yOffset;
        }
        if (yOffset < w) {
            lateral = anchorX < x + (w / 2) ? yOffset : w - yOffset;
        }
        // Anchor below label
        if (anchorY > y + h) {
            path.push('L', x + lateral, y + h);
            // Anchor above label
        }
        else if (anchorY < y) {
            path.push('L', x + lateral, y);
            // Anchor left of label
        }
        else if (anchorX < x) {
            path.push('L', x, y + h / 2);
            // Anchor right of label
        }
        else if (anchorX > x + w) {
            path.push('L', x + w, y + h / 2);
        }
    }
    return path || [];
};
export default ControllableLabel;
