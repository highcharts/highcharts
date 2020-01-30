/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        class AnnotationControllableRect implements AnnotationControllable {
            public static attrsMap: Dictionary<string>;
            public constructor(annotation: Annotation, options: AnnotationsShapeOptions, index: number);
            public addControlPoints: AnnotationControllableMixin['addControlPoints'];
            public anchor: AnnotationControllableMixin['anchor'];
            public annotation: AnnotationControllable['annotation'];
            public attr: AnnotationControllableMixin['attr'];
            public attrsFromOptions: AnnotationControllableMixin['attrsFromOptions'];
            public chart: AnnotationControllable['chart'];
            public collection: 'shapes';
            public controlPoints: AnnotationControllable['controlPoints'];
            public destroy: AnnotationControllableMixin['destroy'];
            public getPointsOptions: AnnotationControllableMixin['getPointsOptions'];
            public graphic: SVGAnnotationElement;
            public index: AnnotationControllable['index'];
            public init: AnnotationControllableMixin['init'];
            public linkPoints: AnnotationControllableMixin['linkPoints'];
            public markerEnd?: SVGElement;
            public markerStart?: SVGElement;
            public options: AnnotationsShapeOptions;
            public point: AnnotationControllableMixin['point'];
            public points: AnnotationControllable['points'];
            public rotate: AnnotationControllableMixin['rotate'];
            public scale: AnnotationControllableMixin['scale'];
            public shouldBeDrawn: AnnotationControllableMixin['shouldBeDrawn'];
            public setControlPointsVisibility: AnnotationControllableMixin['setControlPointsVisibility'];
            public setMarkers: AnnotationMarkerMixin['setItemMarkers'];
            public tracker: SVGAnnotationElement;
            public transform: AnnotationControllableMixin['transform'];
            public transformPoint: AnnotationControllableMixin['transformPoint'];
            public translate: AnnotationControllableMixin['translateShape'];
            public translatePoint: AnnotationControllableMixin['translatePoint'];
            public translateShape: AnnotationControllableMixin['translateShape'];
            public type: 'rect';
            public update: AnnotationControllableMixin['update'];
            public redraw(animation?: boolean): void;
            public render(parent: SVGElement): void;
        }
    }
}

import U from '../../parts/Utilities.js';
const {
    merge
} = U;
import controllableMixin from './controllableMixin.js';
import ControllablePath from './ControllablePath.js';

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
const ControllableRect: typeof Highcharts.AnnotationControllableRect = function (
    this: Highcharts.AnnotationControllableRect,
    annotation: Highcharts.Annotation,
    options: Highcharts.AnnotationsShapeOptions,
    index: number
): void {
    this.init(annotation, options, index);
    this.collection = 'shapes';
} as any;

/**
 * @typedef {Annotation.ControllablePath.AttrsMap}
 *          Annotation.ControllableRect.AttrsMap
 * @property {string} width=width
 * @property {string} height=height
 */

/**
 * A map object which allows to map options attributes to element attributes
 *
 * @type {Annotation.ControllableRect.AttrsMap}
 */
ControllableRect.attrsMap = merge(ControllablePath.attrsMap, {
    width: 'width',
    height: 'height'
});

merge<Highcharts.AnnotationControllableRect, Partial<Highcharts.AnnotationControllableRect>>(
    true,
    ControllableRect.prototype,
    controllableMixin, /** @lends Annotation.ControllableRect# */ {
        /**
         * @type 'rect'
         */
        type: 'rect',

        translate: controllableMixin.translateShape,

        render: function (this: Highcharts.AnnotationControllableRect, parent: Highcharts.SVGElement): void {
            var attrs = this.attrsFromOptions(this.options);

            this.graphic = this.annotation.chart.renderer
                .rect(0, -9e9, 0, 0)
                .attr(attrs)
                .add(parent);

            controllableMixin.render.call(this);
        },

        redraw: function (this: Highcharts.AnnotationControllableRect, animation?: boolean): void {
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

            controllableMixin.redraw.call(this, animation);
        }
    }
);

export default ControllableRect;
