/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type { AlignObject } from '../../../Core/Renderer/AlignObject';
import type Annotation from '../Annotations';
import type BBoxObject from '../../../Core/Renderer/BBoxObject';
import type PositionObject from '../../../Core/Renderer/PositionObject';
import type SVGAttributes from '../../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../../../Core/Renderer/SVG/SVGPath';
import ControllableMixin from '../Mixins/ControllableMixin.js';
import MockPoint from '../MockPoint.js';
import SVGRenderer from '../../../Core/Renderer/SVG/SVGRenderer.js';
import Tooltip from '../../../Core/Tooltip.js';
import U from '../../../Core/Utilities.js';
const {
    extend,
    format,
    isNumber,
    pick
} = U;

/**
 * Internal types.
 * @private
 */
declare global
{
    namespace Highcharts
    {
        interface AnnotationAlignObject extends AlignObject {
            height?: number;
            width?: number;
        }
        interface AnnotationMockPoint {
            negative?: boolean;
            ttBelow?: boolean;
        }
    }
}

import '../../../Core/Renderer/SVG/SVGRenderer.js';

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
class ControllableLabel implements ControllableMixin.Type {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * A map object which allows to map options attributes to element attributes
     *
     * @type {Highcharts.Dictionary<string>}
     */
    public static attrsMap = {
        backgroundColor: 'fill',
        borderColor: 'stroke',
        borderWidth: 'stroke-width',
        zIndex: 'zIndex',
        borderRadius: 'r',
        padding: 'padding'
    };

    /**
     * Shapes which do not have background - the object is used for proper
     * setting of the contrast color.
     *
     * @type {Array<string>}
     */
    public static shapesWithoutBackground = ['connector'];

    /* *
     *
     *  Static Functions
     *
     * */

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
    public static alignedPosition(
        alignOptions: Highcharts.AnnotationAlignObject,
        box: BBoxObject
    ): PositionObject {
        var align = alignOptions.align,
            vAlign = alignOptions.verticalAlign,
            x = (box.x || 0) + (alignOptions.x || 0),
            y = (box.y || 0) + (alignOptions.y || 0),

            alignFactor,
            vAlignFactor;

        if (align === 'right') {
            alignFactor = 1;
        } else if (align === 'center') {
            alignFactor = 2;
        }
        if (alignFactor) {
            x += (box.width - (alignOptions.width || 0)) / alignFactor;
        }

        if (vAlign === 'bottom') {
            vAlignFactor = 1;
        } else if (vAlign === 'middle') {
            vAlignFactor = 2;
        }
        if (vAlignFactor) {
            y += (box.height - (alignOptions.height || 0)) / vAlignFactor;
        }

        return {
            x: Math.round(x),
            y: Math.round(y)
        };
    }

    /**
     * Returns new alignment options for a label if the label is outside the
     * plot area. It is almost a one-to-one copy from
     * Series.prototype.justifyDataLabel except it does not mutate the label and
     * it works with absolute instead of relative position.
     */
    public static justifiedOptions(
        chart: Highcharts.AnnotationChart,
        label: SVGElement,
        alignOptions: Highcharts.AnnotationAlignObject,
        alignAttr: SVGAttributes
    ): Highcharts.AnnotationAlignObject {
        var align = alignOptions.align,
            verticalAlign = alignOptions.verticalAlign,
            padding = label.box ? 0 : (label.padding || 0),
            bBox = label.getBBox(),
            off,
            //
            options: Highcharts.AnnotationAlignObject = {
                align: align,
                verticalAlign: verticalAlign,
                x: alignOptions.x,
                y: alignOptions.y,
                width: label.width,
                height: label.height
            },
            //
            x = (alignAttr.x || 0) - chart.plotLeft,
            y = (alignAttr.y || 0) - chart.plotTop;

        // Off left
        off = x + padding;
        if (off < 0) {
            if (align === 'right') {
                options.align = 'left';
            } else {
                options.x = -off;
            }
        }

        // Off right
        off = x + bBox.width - padding;
        if (off > chart.plotWidth) {
            if (align === 'left') {
                options.align = 'right';
            } else {
                options.x = chart.plotWidth - off;
            }
        }

        // Off top
        off = y + padding;
        if (off < 0) {
            if (verticalAlign === 'bottom') {
                options.verticalAlign = 'top';
            } else {
                options.y = -off;
            }
        }

        // Off bottom
        off = y + bBox.height - padding;
        if (off > chart.plotHeight) {
            if (verticalAlign === 'top') {
                options.verticalAlign = 'bottom';
            } else {
                options.y = chart.plotHeight - off;
            }
        }

        return options;
    }

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(
        annotation: Annotation,
        options: Highcharts.AnnotationsLabelOptions,
        index: number
    ) {
        this.init(annotation, options, index);
        this.collection = 'labels';
    }

    /* *
     *
     *  Properties
     *
     * */

    public addControlPoints = ControllableMixin.addControlPoints;
    public attr = ControllableMixin.attr;
    public attrsFromOptions = ControllableMixin.attrsFromOptions;
    public destroy = ControllableMixin.destroy;
    public getPointsOptions = ControllableMixin.getPointsOptions;
    public init = ControllableMixin.init;
    public linkPoints = ControllableMixin.linkPoints;
    public point = ControllableMixin.point;
    public rotate = ControllableMixin.rotate;
    public scale = ControllableMixin.scale;
    public setControlPointsVisibility = ControllableMixin.setControlPointsVisibility;
    public shouldBeDrawn = ControllableMixin.shouldBeDrawn;
    public transform = ControllableMixin.transform;
    public transformPoint = ControllableMixin.transformPoint;
    public translateShape = ControllableMixin.translateShape;
    public update = ControllableMixin.update;

    public text?: string;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Translate the point of the label by deltaX and deltaY translations.
     * The point is the label's anchor.
     *
     * @param {number} dx translation for x coordinate
     * @param {number} dy translation for y coordinate
     */
    public translatePoint(dx: number, dy: number): void {
        ControllableMixin.translatePoint.call(this, dx, dy, 0);
    }

    /**
     * Translate x and y position relative to the label's anchor.
     *
     * @param {number} dx translation for x coordinate
     * @param {number} dy translation for y coordinate
     */
    public translate(dx: number, dy: number): void {
        var chart = this.annotation.chart,
            // Annotation.options
            labelOptions: Record<string, any> = this.annotation.userOptions,
            // Chart.options.annotations
            annotationIndex = chart.annotations.indexOf(this.annotation),
            chartAnnotations = chart.options.annotations,
            chartOptions: Record<string, any> = chartAnnotations[annotationIndex],
            temp;

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
    }

    public render(parent: SVGElement): void {
        var options = this.options,
            attrs = this.attrsFromOptions(options),
            style = options.style;

        this.graphic = this.annotation.chart.renderer
            .label(
                '',
                0,
                -9999, // #10055
                options.shape,
                null as any,
                null as any,
                options.useHTML,
                null as any,
                'annotation-label'
            )
            .attr(attrs)
            .add(parent);

        if (!this.annotation.chart.styledMode) {
            if (style.color === 'contrast') {
                style.color = this.annotation.chart.renderer.getContrast(
                    ControllableLabel.shapesWithoutBackground.indexOf(
                        options.shape
                    ) > -1 ? '#FFFFFF' : options.backgroundColor as any
                );
            }
            this.graphic
                .css(options.style)
                .shadow(options.shadow);
        }

        if (options.className) {
            this.graphic.addClass(options.className);
        }

        this.graphic.labelrank = (options as any).labelrank;

        ControllableMixin.render.call(this);
    }

    public redraw(animation?: boolean): void {
        var options = this.options,
            text = this.text || options.format || options.text,
            label = this.graphic,
            point = this.points[0],
            anchor,
            attrs: (SVGAttributes|null|undefined);

        label.attr({
            text: text ?
                format(
                    text,
                    point.getLabelConfig(),
                    this.annotation.chart
                ) :
                (options.formatter as any).call(point, this)
        });

        anchor = this.anchor(point);
        attrs = this.position(anchor);

        if (attrs) {
            label.alignAttr = attrs;

            attrs.anchorX = anchor.absolutePosition.x;
            attrs.anchorY = anchor.absolutePosition.y;

            label[animation ? 'animate' : 'attr'](attrs);
        } else {
            label.attr({
                x: 0,
                y: -9999 // #10055
            });
        }

        label.placed = !!attrs;

        ControllableMixin.redraw.call(this, animation);
    }

    /**
     * All basic shapes don't support alignTo() method except label.
     * For a controllable label, we need to subtract translation from
     * options.
     */
    public anchor(_point: Highcharts.AnnotationPointType): Highcharts.AnnotationAnchorObject {
        var anchor = ControllableMixin.anchor.apply(this, arguments),
            x = this.options.x || 0,
            y = this.options.y || 0;

        anchor.absolutePosition.x -= x;
        anchor.absolutePosition.y -= y;

        anchor.relativePosition.x -= x;
        anchor.relativePosition.y -= y;

        return anchor;
    }

    /**
     * Returns the label position relative to its anchor.
     *
     * @param {Highcharts.AnnotationAnchorObject} anchor
     *
     * @return {Highcharts.PositionObject|null}
     */
    public position(
        anchor: Highcharts.AnnotationAnchorObject
    ): (PositionObject|null|undefined) {
        var item = this.graphic,
            chart = this.annotation.chart,
            point = this.points[0],
            itemOptions = this.options,
            anchorAbsolutePosition = anchor.absolutePosition,
            anchorRelativePosition = anchor.relativePosition,
            itemPosition: (PositionObject|undefined),
            alignTo,
            itemPosRelativeX,
            itemPosRelativeY,

            showItem =
                point.series.visible &&
                MockPoint.prototype.isInsidePlot.call(point);

        if (showItem) {

            if (itemOptions.distance) {
                itemPosition = Tooltip.prototype.getPosition.call(
                    {
                        chart: chart,
                        distance: pick(itemOptions.distance, 16)
                    },
                    item.width,
                    item.height,
                    {
                        plotX: anchorRelativePosition.x,
                        plotY: anchorRelativePosition.y,
                        negative: point.negative,
                        ttBelow: point.ttBelow,
                        h: (anchorRelativePosition.height || anchorRelativePosition.width)
                    } as any
                );
            } else if ((itemOptions as any).positioner) {
                itemPosition = (itemOptions as any).positioner.call(this);
            } else {
                alignTo = {
                    x: anchorAbsolutePosition.x,
                    y: anchorAbsolutePosition.y,
                    width: 0,
                    height: 0
                };

                itemPosition = ControllableLabel.alignedPosition(
                    extend(itemOptions, {
                        width: item.width,
                        height: item.height
                    }),
                    alignTo
                );

                if (this.options.overflow === 'justify') {
                    itemPosition = ControllableLabel.alignedPosition(
                        ControllableLabel.justifiedOptions(
                            chart,
                            item,
                            itemOptions,
                            itemPosition
                        ),
                        alignTo
                    );
                }
            }


            if (itemOptions.crop) {
                itemPosRelativeX = (itemPosition as any).x - chart.plotLeft;
                itemPosRelativeY = (itemPosition as any).y - chart.plotTop;

                showItem =
                    chart.isInsidePlot(
                        itemPosRelativeX,
                        itemPosRelativeY
                    ) &&
                    chart.isInsidePlot(
                        itemPosRelativeX + item.width,
                        itemPosRelativeY + item.height
                    );
            }
        }

        return showItem ? itemPosition : null;
    }
}

interface ControllableLabel extends ControllableMixin.Type {
    // adds mixin property types, created during init
    itemType: 'label';
    options: Highcharts.AnnotationsLabelOptions;
}

export default ControllableLabel;

/* ********************************************************************** */

/**
 * General symbol definition for labels with connector
 * @private
 */
SVGRenderer.prototype.symbols.connector = function (
    x: number,
    y: number,
    w: number,
    h: number,
    options?: Highcharts.SymbolOptionsObject
): SVGPath {
    var anchorX = options && options.anchorX,
        anchorY = options && options.anchorY,
        path: (SVGPath|undefined),
        yOffset: number,
        lateral = w / 2;

    if (isNumber(anchorX) && isNumber(anchorY)) {

        path = [['M', anchorX, anchorY]];

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
            path.push(['L', x + lateral, y + h]);

            // Anchor above label
        } else if (anchorY < y) {
            path.push(['L', x + lateral, y]);

            // Anchor left of label
        } else if (anchorX < x) {
            path.push(['L', x, y + h / 2]);

            // Anchor right of label
        } else if (anchorX > x + w) {
            path.push(['L', x + w, y + h / 2]);
        }
    }

    return path || [];
};
