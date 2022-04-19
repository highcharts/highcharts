/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
import ControllableMixin from '../Mixins/ControllableMixin.js';
import ControllablePath from './ControllablePath.js';
import U from '../../../Core/Utilities.js';
var merge = U.merge;
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
var ControllableRect = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    function ControllableRect(annotation, options, index) {
        /* *
         *
         *  Properties
         *
         * */
        this.addControlPoints = ControllableMixin.addControlPoints;
        this.anchor = ControllableMixin.anchor;
        this.attr = ControllableMixin.attr;
        this.attrsFromOptions = ControllableMixin.attrsFromOptions;
        this.destroy = ControllableMixin.destroy;
        this.getPointsOptions = ControllableMixin.getPointsOptions;
        this.init = ControllableMixin.init;
        this.linkPoints = ControllableMixin.linkPoints;
        this.point = ControllableMixin.point;
        this.rotate = ControllableMixin.rotate;
        this.scale = ControllableMixin.scale;
        this.setControlPointsVisibility = (ControllableMixin.setControlPointsVisibility);
        this.shouldBeDrawn = ControllableMixin.shouldBeDrawn;
        this.transform = ControllableMixin.transform;
        this.transformPoint = ControllableMixin.transformPoint;
        this.translatePoint = ControllableMixin.translatePoint;
        this.translateShape = ControllableMixin.translateShape;
        this.update = ControllableMixin.update;
        /**
         * @type 'rect'
         */
        this.type = 'rect';
        this.translate = ControllableMixin.translateShape;
        this.init(annotation, options, index);
        this.collection = 'shapes';
    }
    /* *
     *
     *  Functions
     *
     * */
    ControllableRect.prototype.render = function (parent) {
        var attrs = this.attrsFromOptions(this.options);
        this.graphic = this.annotation.chart.renderer
            .rect(0, -9e9, 0, 0)
            .attr(attrs)
            .add(parent);
        ControllableMixin.render.call(this);
    };
    ControllableRect.prototype.redraw = function (animation) {
        var position = this.anchor(this.points[0]).absolutePosition;
        if (position) {
            this.graphic[animation ? 'animate' : 'attr']({
                x: position.x,
                y: position.y,
                width: this.options.width,
                height: this.options.height
            });
        }
        else {
            this.attr({
                x: 0,
                y: -9e9
            });
        }
        this.graphic.placed = Boolean(position);
        ControllableMixin.redraw.call(this, animation);
    };
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
    ControllableRect.attrsMap = merge(ControllablePath.attrsMap, {
        width: 'width',
        height: 'height'
    });
    return ControllableRect;
}());
export default ControllableRect;
