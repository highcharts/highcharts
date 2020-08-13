/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Annotation from '../Annotations';
import type SVGElement from '../../../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../../../Core/Renderer/SVG/SVGPath';
import ControllableMixin from '../Mixins/ControllableMixin.js';
import H from '../../../Core/Globals.js';
import MarkerMixin from '../Mixins/MarkerMixin.js';
import U from '../../../Core/Utilities.js';
const {
    extend
} = U;

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        interface SVGAnnotationElement extends SVGElement {
            markerEndSetter?: AnnotationMarkerMixin['markerEndSetter'];
            markerStartSetter?: AnnotationMarkerMixin['markerStartSetter'];
            placed?: boolean;
        }
    }
}

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
 */
class ControllablePath implements ControllableMixin.Type {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * A map object which allows to map options attributes to element attributes
     *
     * @name Highcharts.AnnotationControllablePath.attrsMap
     * @type {Highcharts.Dictionary<string>}
     */
    public static attrsMap = {
        dashStyle: 'dashstyle',
        strokeWidth: 'stroke-width',
        stroke: 'stroke',
        fill: 'fill',
        zIndex: 'zIndex'
    };

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
    public setMarkers = MarkerMixin.setItemMarkers;
    public transform = ControllableMixin.transform;
    public transformPoint = ControllableMixin.transformPoint;
    public translate = ControllableMixin.translate;
    public translatePoint = ControllableMixin.translatePoint;
    public translateShape = ControllableMixin.translateShape;
    public update = ControllableMixin.update;

    /**
     * @type 'path'
     */
    public type = 'path';

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Map the controllable path to 'd' path attribute.
     *
     * @return {Highcharts.SVGPathArray|null}
     * A path's d attribute.
     */
    public toD(): (SVGPath|null) {
        var dOption = this.options.d;

        if (dOption) {
            return typeof dOption === 'function' ?
                dOption.call(this) :
                dOption;
        }

        var points = this.points,
            len = points.length,
            showPath: boolean = len as any,
            point = points[0],
            position = showPath && this.anchor(point).absolutePosition,
            pointIndex = 0,
            command,
            d: SVGPath = [];

        if (position) {
            d.push(['M', position.x, position.y]);

            while (++pointIndex < len && showPath) {
                point = points[pointIndex];
                command = point.command || 'L';
                position = this.anchor(point).absolutePosition;

                if (command === 'M') {
                    d.push([command, position.x, position.y]);
                } else if (command === 'L') {
                    d.push([command, position.x, position.y]);
                } else if (command === 'Z') {
                    d.push([command]);
                }

                showPath = point.series.visible;
            }
        }

        return showPath ?
            this.chart.renderer.crispLine(d, this.graphic.strokeWidth()) :
            null;
    }

    public shouldBeDrawn(): boolean {
        return (ControllableMixin.shouldBeDrawn.call(this) || Boolean(this.options.d));
    }

    public render(parent: SVGElement): void {
        var options = this.options,
            attrs = this.attrsFromOptions(options);

        this.graphic = this.annotation.chart.renderer
            .path([['M', 0, 0]])
            .attr(attrs)
            .add(parent);

        if (options.className) {
            this.graphic.addClass(options.className);
        }

        this.tracker = this.annotation.chart.renderer
            .path([['M', 0, 0]])
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

        ControllableMixin.render.call(this);

        extend(this.graphic, {
            markerStartSetter: MarkerMixin.markerStartSetter,
            markerEndSetter: MarkerMixin.markerEndSetter
        });

        this.setMarkers(this);
    }

    public redraw(animation?: boolean): void {

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

        ControllableMixin.redraw.call(this, animation);
    }
}

interface ControllablePath extends ControllableMixin.Type {
    // adds mixin property types, created during init
    options: Highcharts.AnnotationsShapeOptions;
    tracker: Highcharts.SVGAnnotationElement;
}

export default ControllablePath;
