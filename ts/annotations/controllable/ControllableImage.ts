/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Annotation from '../annotations.src';
import ControllableLabel from './ControllableLabel.js';
import controllableMixin from './controllableMixin.js';
import U from './../../parts/Utilities.js';
const {
    merge
} = U;

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        class AnnotationControllableImage implements AnnotationControllable {
            public static attrsMap: Dictionary<string>;
            public constructor(annotation: Annotation, options: AnnotationsShapeOptions, index: number);
            public addControlPoints: AnnotationControllableMixin['addControlPoints'];
            public anchor: AnnotationControllableMixin['anchor'];
            public annotation: AnnotationControllable['annotation'];
            public attr: AnnotationControllable['attr'];
            public attrsFromOptions: AnnotationControllableMixin['attrsFromOptions'];
            public chart: AnnotationControllable['chart'];
            public collection: 'shapes';
            public controlPoints: AnnotationControllable['controlPoints'];
            public destroy: AnnotationControllableMixin['destroy'];
            public getPointsOptions: AnnotationControllableMixin['getPointsOptions'];
            public graphic: AnnotationControllable['graphic'];
            public index: AnnotationControllable['index'];
            public init: AnnotationControllableMixin['init'];
            public linkPoints: AnnotationControllableMixin['linkPoints'];
            public options: AnnotationsShapeOptions;
            public point: AnnotationControllableMixin['point'];
            public points: AnnotationControllable['points'];
            public rotate: AnnotationControllableMixin['rotate'];
            public scale: AnnotationControllableMixin['scale'];
            public setControlPointsVisibility: AnnotationControllableMixin['setControlPointsVisibility'];
            public shouldBeDrawn: AnnotationControllableMixin['shouldBeDrawn'];
            public transform: AnnotationControllableMixin['transform'];
            public transformPoint: AnnotationControllableMixin['transformPoint'];
            public translate: AnnotationControllableMixin['translateShape'];
            public translatePoint: AnnotationControllableMixin['translatePoint'];
            public translateShape: AnnotationControllableMixin['translateShape'];
            public type: 'image';
            public update: AnnotationControllableMixin['update'];
            public redraw(animation?: boolean): void;
            public render(parent: SVGElement): void;
        }
    }
}

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
 **/
const ControllableImage = function (
    this: Highcharts.AnnotationControllableImage,
    annotation: Annotation,
    options: Highcharts.AnnotationsShapeOptions,
    index: number
): void {
    this.init(annotation, options, index);
    this.collection = 'shapes';
} as any;

/**
 * A map object which allows to map options attributes to element attributes
 *
 * @name Highcharts.AnnotationControllableImage.attrsMap
 * @type {Highcharts.Dictionary<string>}
 */
ControllableImage.attrsMap = {
    width: 'width',
    height: 'height',
    zIndex: 'zIndex'
};

merge<Highcharts.AnnotationControllableImage, Partial<Highcharts.AnnotationControllableImage>>(
    true,
    ControllableImage.prototype,
    controllableMixin, /** @lends Annotation.ControllableImage# */ {
        /**
         * @type 'image'
         */
        type: 'image',

        translate: controllableMixin.translateShape,

        render: function (this: Highcharts.AnnotationControllableImage, parent: Highcharts.SVGElement): void {
            var attrs = this.attrsFromOptions(this.options),
                options = this.options;

            this.graphic = this.annotation.chart.renderer
                .image(options.src as any, 0, -9e9, options.width, options.height)
                .attr(attrs)
                .add(parent);

            this.graphic.width = options.width;
            this.graphic.height = options.height;

            controllableMixin.render.call(this);
        },

        redraw: function (this: Highcharts.AnnotationControllableImage, animation?: boolean): void {
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

            controllableMixin.redraw.call(this, animation);
        }
    }
);

export default ControllableImage;
