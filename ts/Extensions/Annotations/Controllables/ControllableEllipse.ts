/* *
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
import Axis from '../../../Core/Axis/Axis';
const { merge } = U;

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

    public constructor(
        annotation: Annotation,
        options: EllipseShapeOptions,
        index: number
    ) {
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
    public setControlPointsVisibility =
    ControllableMixin.setControlPointsVisibility;
    public shouldBeDrawn = ControllableMixin.shouldBeDrawn;
    public transform = ControllableMixin.transform;
    public transformPoint = ControllableMixin.transformPoint;
    public translatePoint = ControllableMixin.translatePoint;
    public update = ControllableMixin.update;
    public angle: number = void 0 as any;
    public referencePoints: Array<ReferencePointsOptions> = void 0 as any;

    /**
     * @type 'ellipse'
     */
    public type = 'ellipse';

    public translate = ControllableMixin.translateShape;

    public init(
        annotation: Annotation,
        options: EllipseShapeOptions,
        index: number
    ): void {
        ControllableMixin.init.call(this, annotation, options, index);
        this.savePoints();
    }
    /* *
     *
     *  Functions
     *
     * */

    public translateShape = ControllableMixin.translateShape;
    // (dx: number, dy: number): void{
    //     ControllableMixin.translateShape.call(this, dx, dy);
    // }

    public render(parent: SVGElement): void {
        const attrs = this.attrsFromOptions(this.options);

        const graphic = this.annotation.chart.renderer.createElement('ellipse');
        graphic.attr(attrs).add(parent);
        this.graphic = graphic;
        ControllableMixin.render.call(this);
    }

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
     * Set the radius.
     *
     * @param {number} r a radius to be set
     */
    public setYRadius(ry: number): void {
        this.options.ry = ry;
    }

    public setXRadius(rx: number): void {
        this.options.rx = rx;
    }

    public setRadius(rx?: number, ry?: number): void {
        if (rx) {
            this.options.rx = rx;
        }
        if (ry) {
            this.options.ry = ry;
        }
    }

    public setAngle(angle: number): void {
        this.angle = angle;
    }

    public savePoints(x?: number, y?: number, rx?: number, ry?: number): void {
        const xAxis = this.chart.xAxis[(this.options.point as any).xAxis],
            yAxis = this.chart.yAxis[(this.options.point as any).yAxis],
            position = this.anchor(this.points[0]).absolutePosition;
        x = x || position.x;
        y = y || position.y;
        rx = rx || this.options.rx;
        ry = ry || this.options.ry;

        const angle = this.angle,
            pointX1 = x - rx * Math.cos((angle * Math.PI) / 180),
            pointY1 = y - rx * Math.sin((angle * Math.PI) / 180),
            pointX2 = x + ry * Math.sin((angle * Math.PI) / 180),
            pointY2 = y - ry * Math.cos((angle * Math.PI) / 180),
            points = [
                {
                    x: xAxis.toValue(pointX1),
                    y: yAxis.toValue(pointY1)
                },
                {
                    x: xAxis.toValue(pointX2),
                    y: yAxis.toValue(pointY2)
                }
            ];

        this.referencePoints = points;
    }

    public getAttrsFromPoints(): EllispseShapeSVGOptions {
        const points = this.referencePoints,
            position = this.anchor(this.points[0]).absolutePosition,
            xAxis = this.chart.xAxis[(this.options.point as any).xAxis],
            yAxis = this.chart.yAxis[(this.options.point as any).yAxis],
            cx = position.x,
            cy = position.y,
            x1 = xAxis.toPixels(points[0].x),
            x2 = xAxis.toPixels(points[1].x),
            y1 = yAxis.toPixels(points[0].y),
            y2 = yAxis.toPixels(points[1].y),
            rx = Math.sqrt((cx - x1) * (cx - x1) + (cy - y1) * (cy - y1)),
            ry = Math.sqrt((cx - x2) * (cx - x2) + (cy - y2) * (cy - y2));

        let angle = (-Math.atan((cx - x1) / (cy - y1)) * 180) / Math.PI - 90;

        if (cy < y1) {
            angle += 180;
        }

        return {
            cx,
            cy,
            rx,
            ry,
            angle
        };
    }
}

interface ControllableEllipse extends ControllableMixin.Type {
    // adds mixin property types, created during init
    options: EllipseShapeOptions;
}

export default ControllableEllipse;
