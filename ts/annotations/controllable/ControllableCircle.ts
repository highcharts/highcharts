/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Annotation from '../annotations.src';
import controllableMixin from './controllableMixin.js';
import ControllablePath from './ControllablePath.js';
import U from './../../Core/Utilities.js';
const {
    merge
} = U;

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        class AnnotationControllableCircle implements AnnotationControllable {
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
            public type: 'circle';
            public update: AnnotationControllableMixin['update'];
            public redraw(animation?: boolean): void;
            public render(parent: SVGElement): void;
            public setRadius(r: number): void;
        }
    }
}

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * A controllable circle class.
 *
 * @requires modules/annotations
 *
 * @private
 * @constructor
 * @name Highcharts.AnnotationControllableCircle
 *
 * @param {Highcharts.Annotation} annotation an annotation instance
 * @param {Highcharts.AnnotationsShapeOptions} options a shape's options
 * @param {number} index of the circle
 **/
const ControllableCircle: typeof Highcharts.AnnotationControllableCircle = function (
    this: Highcharts.AnnotationControllableCircle,
    annotation: Annotation,
    options: Highcharts.AnnotationsShapeOptions,
    index: number
): void {
    this.init(annotation, options, index);
    this.collection = 'shapes';
} as any;

/**
 * A map object which allows to map options attributes to element attributes.
 *
 * @name Highcharts.AnnotationControllableCircle.attrsMap
 * @type {Highcharts.Dictionary<string>}
 */
ControllableCircle.attrsMap = merge(ControllablePath.attrsMap, {
    r: 'r'
});

merge<Highcharts.AnnotationControllableCircle, Partial<Highcharts.AnnotationControllableCircle>>(
    true,
    ControllableCircle.prototype,
    controllableMixin, /** @lends Highcharts.AnnotationControllableCircle# */ {
        /**
         * @type 'circle'
         */
        type: 'circle',

        translate: controllableMixin.translateShape,

        render: function (this: Highcharts.AnnotationControllableCircle, parent: Highcharts.SVGElement): void {
            var attrs = this.attrsFromOptions(this.options);

            this.graphic = this.annotation.chart.renderer
                .circle(0, -9e9, 0)
                .attr(attrs)
                .add(parent);

            controllableMixin.render.call(this);
        },

        redraw: function (this: Highcharts.AnnotationControllableCircle, animation?: boolean): void {
            var position = this.anchor(this.points[0]).absolutePosition;

            if (position) {
                this.graphic[animation ? 'animate' : 'attr']({
                    x: position.x,
                    y: position.y,
                    r: this.options.r
                });
            } else {
                this.graphic.attr({
                    x: 0,
                    y: -9e9
                });
            }

            this.graphic.placed = Boolean(position);

            controllableMixin.redraw.call(this, animation);
        },

        /**
         * Set the radius.
         *
         * @param {number} r a radius to be set
         */
        setRadius: function (this: Highcharts.AnnotationControllableCircle, r: number): void {
            this.options.r = r;
        }
    }
);

export default ControllableCircle;
