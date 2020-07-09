/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type Annotation from '../Annotations';
import type SVGElement from '../../../Core/Renderer/SVG/SVGElement';
import ControllableMixin from '../Mixins/ControllableMixin.js';
import ControllablePath from './ControllablePath.js';
import U from '../../../Core/Utilities.js';
const {
    merge
} = U;

/**
 * @typedef {Annotation.ControllablePath.AttrsMap}
 *          Annotation.ControllableRect.AttrsMap
 * @property {string} width=width
 * @property {string} height=height
 */

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * A controllable rect class.
 *
 * @requires modules/annotations
 *
 * @private
 * @class
 * @name Highcharts.AnnotationControllableRect
 *
 * @param {Highcharts.Annotation} annotation
 * An annotation instance.
 *
 * @param {Highcharts.AnnotationsShapeOptions} options
 * A rect's options.
 *
 * @param {number} index
 * Index of the rectangle
 */
class ControllableRect implements ControllableMixin.Type {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * A map object which allows to map options attributes to element attributes
     *
     * @type {Annotation.ControllableRect.AttrsMap}
     */
    public static attrsMap = merge(ControllablePath.attrsMap, {
        width: 'width',
        height: 'height'
    });

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(
        annotation: Annotation,
        options: Highcharts.AnnotationsShapeOptions,
        index: number
    ) {
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
    public rotate = ControllableMixin.rotate;
    public scale = ControllableMixin.scale;
    public setControlPointsVisibility = ControllableMixin.setControlPointsVisibility;
    public shouldBeDrawn = ControllableMixin.shouldBeDrawn;
    public transform = ControllableMixin.transform;
    public transformPoint = ControllableMixin.transformPoint;
    public translatePoint = ControllableMixin.translatePoint;
    public translateShape = ControllableMixin.translateShape;
    public update = ControllableMixin.update;

    /**
     * @type 'rect'
     */
    public type = 'rect';

    public translate = ControllableMixin.translateShape;

    /* *
     *
     *  Functions
     *
     * */

    public render(parent: SVGElement): void {
        var attrs = this.attrsFromOptions(this.options);

        this.graphic = this.annotation.chart.renderer
            .rect(0, -9e9, 0, 0)
            .attr(attrs)
            .add(parent);

        ControllableMixin.render.call(this);
    }

    public redraw(animation?: boolean): void {
        var position = this.anchor(this.points[0]).absolutePosition;

        if (position) {
            this.graphic[animation ? 'animate' : 'attr']({
                x: position.x,
                y: position.y,
                width: this.options.width,
                height: this.options.height
            });
        } else {
            this.attr({
                x: 0,
                y: -9e9
            });
        }

        this.graphic.placed = Boolean(position);

        ControllableMixin.redraw.call(this, animation);
    }
}

interface ControllableRect extends ControllableMixin.Type {
    // adds mixin property types, created during init
    options: Highcharts.AnnotationsShapeOptions;
}

export default ControllableRect;
