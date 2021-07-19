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
const {
    merge
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
    public init = ControllableMixin.init;
    public linkPoints = ControllableMixin.linkPoints;
    public point = ControllableMixin.point;
    public scale = ControllableMixin.scale;
    public setControlPointsVisibility = ControllableMixin.setControlPointsVisibility;
    public shouldBeDrawn = ControllableMixin.shouldBeDrawn;
    public transform = ControllableMixin.transform;
    public transformPoint = ControllableMixin.transformPoint;
    public translatePoint = ControllableMixin.translatePoint;
    public translateShape = ControllableMixin.translateShape;
    public update = ControllableMixin.update;
    public angle: number = void 0 as any;

    /**
     * @type 'ellipse'
     */
    public type = 'ellipse';

    public translate = ControllableMixin.translateShape;

    /* *
     *
     *  Functions
     *
     * */

    public render(parent: SVGElement): void {
        const attrs = this.attrsFromOptions(this.options);

        const graphic = this.annotation.chart.renderer.createElement('ellipse');
        graphic.attr(attrs).add(parent);
        this.graphic = graphic;
        ControllableMixin.render.call(this);
    }

    public redraw(animation?: boolean): void {
        const position = this.anchor(this.points[0]).absolutePosition;

        if (position) {
            this.graphic[animation ? 'animate' : 'attr']({
                cx: position.x,
                cy: position.y,
                rx: this.options.rx,
                ry: this.options.ry,
                transform: `rotate(${this.angle})`
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
}

interface ControllableEllipse extends ControllableMixin.Type {
    // adds mixin property types, created during init
    options: EllipseShapeOptions;
}


export default ControllableEllipse;
