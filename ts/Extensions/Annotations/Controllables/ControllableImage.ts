/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Annotation from '../Annotations';
import type SVGElement from '../../../Core/Renderer/SVG/SVGElement';
import ControllableLabel from './ControllableLabel.js';
import ControllableMixin from '../Mixins/ControllableMixin.js';

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * A controllable image class.
 *
 * @requires modules/annotations
 *
 * @private
 * @class
 * @name Highcharts.AnnotationControllableImage
 *
 * @param {Highcharts.Annotation} annotation
 * An annotation instance.
 *
 * @param {Highcharts.AnnotationsShapeOptions} options
 * A controllable's options.
 *
 * @param {number} index
 * Index of the image.
 */
class ControllableImage implements ControllableMixin.Type {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * A map object which allows to map options attributes to element attributes
     *
     * @name Highcharts.AnnotationControllableImage.attrsMap
     * @type {Highcharts.Dictionary<string>}
     */
    public static attrsMap = {
        width: 'width',
        height: 'height',
        zIndex: 'zIndex'
    }

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
     * @type 'image'
     */
    public type = 'image';

    public translate = ControllableMixin.translateShape;

    public render(parent: SVGElement): void {
        var attrs = this.attrsFromOptions(this.options),
            options = this.options;

        this.graphic = this.annotation.chart.renderer
            .image(options.src as any, 0, -9e9, options.width, options.height)
            .attr(attrs)
            .add(parent);

        this.graphic.width = options.width;
        this.graphic.height = options.height;

        ControllableMixin.render.call(this);
    }

    public redraw(animation?: boolean): void {
        var anchor = this.anchor(this.points[0]),
            position = ControllableLabel.prototype.position.call(
                this,
                anchor
            );

        if (position) {
            this.graphic[animation ? 'animate' : 'attr']({
                x: position.x,
                y: position.y
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

}

interface ControllableImage extends ControllableMixin.Type {
    // adds mixin property types, created during init
    options: Highcharts.AnnotationsShapeOptions;
}

export default ControllableImage;
