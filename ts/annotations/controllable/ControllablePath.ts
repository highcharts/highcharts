/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';
import H from './../../parts/Globals.js';

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        class AnnotationControllablePath implements AnnotationControllable {
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
            public setControlPointsVisibility: AnnotationControllableMixin['setControlPointsVisibility'];
            public setMarkers: AnnotationMarkerMixin['setItemMarkers'];
            public tracker: SVGAnnotationElement;
            public transform: AnnotationControllableMixin['transform'];
            public transformPoint: AnnotationControllableMixin['transformPoint'];
            public translate: AnnotationControllableMixin['translate'];
            public translatePoint: AnnotationControllableMixin['translatePoint'];
            public translateShape: AnnotationControllableMixin['translateShape'];
            public type: 'path';
            public update: AnnotationControllableMixin['update'];
            public redraw(animation?: boolean): void;
            public render(parent: SVGElement): void;
            public shouldBeDrawn(): boolean;
            public toD(): (SVGPathArray|null);
        }
        interface SVGAnnotationElement extends SVGElement {
            markerEndSetter?: AnnotationMarkerMixin['markerEndSetter'];
            markerStartSetter?: AnnotationMarkerMixin['markerStartSetter'];
            placed?: boolean;
        }
    }
}

import U from './../../parts/Utilities.js';
const {
    extend,
    merge
} = U;

import controllableMixin from './controllableMixin.js';
import markerMixin from './markerMixin.js';

// See TRACKER_FILL in highcharts.src.js
var TRACKER_FILL = 'rgba(192,192,192,' + (H.svg ? 0.0001 : 0.002) + ')';

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * A controllable path class.
 *
 * @requires modules/annotations
 *
 * @private
 * @class
 * @name Highcharts.AnnotationControllablePath
 *
 * @param {Highcharts.Annotation}
 * Related annotation.
 *
 * @param {Highcharts.AnnotationsShapeOptions} options
 * A path's options object.
 *
 * @param {number} index
 * Index of the path.
 **/
const ControllablePath: typeof Highcharts.AnnotationControllablePath = function (
    this: Highcharts.AnnotationControllablePath,
    annotation: Highcharts.Annotation,
    options: Highcharts.AnnotationsShapeOptions,
    index: number
): void {
    this.init(annotation, options, index);
    this.collection = 'shapes';
} as any;

/**
 * A map object which allows to map options attributes to element attributes
 *
 * @name Highcharts.AnnotationControllablePath.attrsMap
 * @type {Highcharts.Dictionary<string>}
 */
ControllablePath.attrsMap = {
    dashStyle: 'dashstyle',
    strokeWidth: 'stroke-width',
    stroke: 'stroke',
    fill: 'fill',
    zIndex: 'zIndex'
};

merge<Highcharts.AnnotationControllablePath, Partial<Highcharts.AnnotationControllablePath>>(
    true,
    ControllablePath.prototype,
    controllableMixin, /** @lends Highcharts.AnnotationControllablePath# */ {
        /**
         * @type 'path'
         */
        type: 'path',

        setMarkers: markerMixin.setItemMarkers,

        /**
         * Map the controllable path to 'd' path attribute.
         *
         * @return {Highcharts.SVGPathArray|null}
         * A path's d attribute.
         */
        toD: function (this: Highcharts.AnnotationControllablePath): (Highcharts.SVGPathArray|null) {
            var d = this.options.d;

            if (d) {
                return typeof d === 'function' ?
                    d.call(this) :
                    d;
            }

            var points = this.points,
                len = points.length,
                showPath: boolean = len as any,
                point = points[0],
                position = showPath && this.anchor(point).absolutePosition,
                pointIndex = 0,
                dIndex = 2,
                command;

            d = (position && ['M', position.x, position.y]) as any;

            while (++pointIndex < len && showPath) {
                point = points[pointIndex];
                command = point.command || 'L';
                position = this.anchor(point).absolutePosition;

                if (command === 'Z') {
                    (d as any)[++dIndex] = command;
                } else {
                    if (command !== points[pointIndex - 1].command) {
                        (d as any)[++dIndex] = command;
                    }

                    (d as any)[++dIndex] = position.x;
                    (d as any)[++dIndex] = position.y;
                }

                showPath = point.series.visible;
            }

            return showPath ?
                this.chart.renderer.crispLine(d as any, this.graphic.strokeWidth()) :
                null;
        },

        shouldBeDrawn: function (this: Highcharts.AnnotationControllablePath): boolean {
            return (controllableMixin.shouldBeDrawn.call(this) || Boolean(this.options.d));
        },

        render: function (this: Highcharts.AnnotationControllablePath, parent: Highcharts.SVGElement): void {
            var options = this.options,
                attrs = this.attrsFromOptions(options);

            this.graphic = this.annotation.chart.renderer
                .path(['M', 0, 0])
                .attr(attrs)
                .add(parent);

            if (options.className) {
                this.graphic.addClass(options.className);
            }

            this.tracker = this.annotation.chart.renderer
                .path(['M', 0, 0])
                .addClass('highcharts-tracker-line')
                .attr({
                    zIndex: 2
                })
                .add(parent);

            if (!this.annotation.chart.styledMode) {
                this.tracker.attr({
                    'stroke-linejoin': 'round', // #1225
                    stroke: TRACKER_FILL,
                    fill: TRACKER_FILL,
                    'stroke-width': this.graphic.strokeWidth() +
                        (options.snap as any) * 2
                });
            }

            controllableMixin.render.call(this);

            extend(this.graphic, {
                markerStartSetter: markerMixin.markerStartSetter,
                markerEndSetter: markerMixin.markerEndSetter
            });

            this.setMarkers(this);
        },

        redraw: function (this: Highcharts.AnnotationControllablePath, animation?: boolean): void {

            var d = this.toD(),
                action = animation ? 'animate' : 'attr';

            if (d) {
                this.graphic[action]({ d: d });
                this.tracker[action]({ d: d });
            } else {
                this.graphic.attr({ d: 'M 0 ' + -9e9 });
                this.tracker.attr({ d: 'M 0 ' + -9e9 });
            }

            this.graphic.placed = this.tracker.placed = Boolean(d);

            controllableMixin.redraw.call(this, animation);
        }
    }
);

export default ControllablePath;
