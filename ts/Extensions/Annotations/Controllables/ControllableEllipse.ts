/* *
 *
 * Author: Pawel Lysy
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Annotation from '../Annotations';
import type SVGElement from '../../../Core/Renderer/SVG/SVGElement';
import ControllableMixin from '../Mixins/ControllableMixin.js';
import ControllablePath from './ControllablePath.js';
import U from '../../../Core/Utilities.js';
const {
    merge,
    defined,
    correctFloat
} = U;

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * A controllable ellipse class.
 *
 * @requires modules/annotations
 *
 * @private
 * @class
 * @name Highcharts.AnnotationControllableEllipse
 *
 * @param {Highcharts.Annotation} annotation an annotation instance
 * @param {Highcharts.AnnotationsShapeOptions} options a shape's options
 * @param {number} index of the Ellipse
 */
interface EllipseShapeOptions extends Highcharts.AnnotationsShapeOptions {
    angle: number;
    referencePoints: Array<ReferencePointsOptions>;
}
interface EllispseShapeSVGOptions {
    cx: number;
    cy: number;
    rx: number;
    ry: number;
    angle: number;
}
interface ReferencePointsOptions {
    x: number;
    y: number;
}
class ControllableEllipse implements ControllableMixin.Type {
    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * A map object which allows to map options attributes to element
     * attributes.
     *
     * @name Highcharts.AnnotationControllableEllipse.attrsMap
     * @type {Highcharts.Dictionary<string>}
     */
    public static attrsMap = merge(ControllablePath.attrsMap, {
        cx: 'cx',
        rx: 'rx',
        ry: 'ry',
        cy: 'cy'
    });

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(annotation: Annotation, options: EllipseShapeOptions, index: number) {
        this.angle = options.angle;
        this.init(annotation, options, index);
        this.collection = 'shapes';
    }

    /* *
     *
     *  Properties
     *
     * */

    public addControlPoints = ControllableMixin.addControlPoints;
    public anchor = ControllableMixin.anchor;
    public attr = ControllableMixin.attr;
    public attrsFromOptions = ControllableMixin.attrsFromOptions;
    public destroy = ControllableMixin.destroy;
    public getPointsOptions = ControllableMixin.getPointsOptions;
    public linkPoints = ControllableMixin.linkPoints;
    public point = ControllableMixin.point;
    public scale = ControllableMixin.scale;
    public setControlPointsVisibility = ControllableMixin.setControlPointsVisibility;
    public shouldBeDrawn = ControllableMixin.shouldBeDrawn;
    public transform = ControllableMixin.transform;
    public translatePoint = ControllableMixin.translatePoint;
    public update = ControllableMixin.update;
    public angle: number = void 0 as any;
    public referencePoints: Array<ReferencePointsOptions> = void 0 as any;

    /**
     * @type 'ellipse'
     */
    public type = 'ellipse';

    public translate = ControllableMixin.translateShape;

    /**
     * Functions
     */

    /**
     * Transform the middle point (center of an ellipse).
     * Mostly used to handle dragging of the ellipse.
     */
    public transformPoint(): void {
        // Call save points, to handle the pinning of the angle
        // and radius to axes points.
        this.savePoints();
        ControllableMixin.transformPoint.apply(this, arguments);
    }

    public init(annotation: Annotation, options: EllipseShapeOptions, index: number): void {
        ControllableMixin.init.call(this, annotation, options, index);
        this.savePoints();
    }
    /* *
     *
     *  Functions
     *
     * */

    /**
     *
     * Render the element
     * @param parent parent SVG element.
     */

    public render(parent: SVGElement): void {
        const attrs = this.attrsFromOptions(this.options),
            graphic = this.annotation.chart.renderer.createElement('ellipse');
        graphic.attr(attrs).add(parent);
        this.graphic = graphic;
        ControllableMixin.render.call(this);
    }

    /**
     *
     * Redraw the element
     * @param animation display an annimation
     */

    public redraw(animation?: boolean): void {
        const position = this.anchor(this.points[0]).absolutePosition,
            attrs = this.getAttrsFromPoints();
        if (position) {
            this.graphic[animation ? 'animate' : 'attr']({
                cx: attrs.cx,
                cy: attrs.cy,
                rx: attrs.rx,
                ry: attrs.ry,
                transform: `rotate(${attrs.angle}, ${position.x}, ${position.y})`
            });
        } else {
            this.graphic.attr({
                x: 0,
                y: -9e9
            });
        }
        this.graphic.placed = Boolean(position);
        ControllableMixin.redraw.call(this, animation);
    }

    /**
     * Set the radius Y.
     *
     * @param {number} ry a radius in y direction to be set
     */
    public setYRadius(ry: number): void {
        this.options.ry = ry;
    }

    /**
     * Set the radius X.
     *
     * @param {number} rx a radius in x direction to be set
     */
    public setXRadius(rx: number): void {
        this.options.rx = rx;
    }

    /**
     * Set the angle of the ellipse.
     *
     * @param {number} angle the value of the angle on which the ellipse
     * is rotated (clockwise driection).
     */
    public setAngle(angle: number): void {
        this.angle = angle;
    }

    /**
     * Save the reference point positions, to pin the ellipse to the axes.
     *
     * @param {number} x x position of the center of the ellipse
     * (in pixels or in xAxis value if xAxis is defined)
     * @param {number} y y position of the center of the ellipse
     * (in pixels or in yAxis value if yAxis is defined)
     * @param {number} rx x radius of the ellipse in pixels
     * @param {number} ry y radius of the ellipse in pixels
     * @param {number} angle angle in degrees
     */
    public savePoints(x?: number, y?: number, rx?: number, ry?: number, angle?: number): void {
        const xAxis = this.chart.xAxis[(this.options.point as any).xAxis],
            yAxis = this.chart.yAxis[(this.options.point as any).yAxis],
            position = this.anchor(this.points[0]).absolutePosition;
        let points;
        x = x || position.x;
        y = y || position.y;
        rx = rx || this.options.rx;
        ry = ry || this.options.ry;
        angle = angle || this.angle;

        if (xAxis && yAxis) {
            const pointX1 = x - rx * Math.cos((angle * Math.PI) / 180),
                pointY1 = y - rx * Math.sin((angle * Math.PI) / 180),
                pointX2 = x + ry * Math.sin((angle * Math.PI) / 180),
                pointY2 = y - ry * Math.cos((angle * Math.PI) / 180);

            points = [{
                x: xAxis.toValue(pointX1),
                y: yAxis.toValue(pointY1)
            }, {
                x: xAxis.toValue(pointX2),
                y: yAxis.toValue(pointY2)
            }];
            this.referencePoints = points;
        }
    }

    /**
     * Retrieve the attributes needed to plot
     * the ellipse from the reference points.
     */
    public getAttrsFromPoints(): EllispseShapeSVGOptions {
        const points = this.referencePoints,
            position = this.anchor(this.points[0]).absolutePosition,
            xAxisIndex = (this.options.point as any).xAxis,
            yAxisIndex = (this.options.point as any).yAxis,
            cx = position.x,
            cy = position.y;
            // Handle the ellipse if it is not pinned to the axes.
        if (defined(yAxisIndex) && defined(xAxisIndex)) {
            const xAxis = this.chart.xAxis[xAxisIndex],
                yAxis = this.chart.yAxis[yAxisIndex],
                x1 = xAxis.toPixels(points[0].x),
                x2 = xAxis.toPixels(points[1].x),
                y1 = yAxis.toPixels(points[0].y),
                y2 = yAxis.toPixels(points[1].y),
                rx = Math.sqrt((cx - x1) * (cx - x1) + (cy - y1) * (cy - y1)),
                ry = Math.sqrt((cx - x2) * (cx - x2) + (cy - y2) * (cy - y2));

            let tan;

            if (rx > ry) {
                tan = (cy - y1) / (cx - x1);
            } else {
                tan = (x2 - cx) / (cy - y2);
            }

            let angle = (Math.atan(tan) * 180) / Math.PI;

            if (cx < x1) {
                angle += 180;
            }

            return {
                cx: correctFloat(cx),
                cy: correctFloat(cy),
                rx: correctFloat(rx),
                ry: correctFloat(ry),
                angle: correctFloat(angle)
            };
        }
        return {
            cx,
            cy,
            angle: this.angle,
            rx: this.options.rx,
            ry: this.options.ry
        };
    }
}

interface ControllableEllipse extends ControllableMixin.Type {
    // adds mixin property types, created during init
    options: EllipseShapeOptions;
}

export default ControllableEllipse;
