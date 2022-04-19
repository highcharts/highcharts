/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
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
var ControllableImage = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    function ControllableImage(annotation, options, index) {
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
         * @type 'image'
         */
        this.type = 'image';
        this.translate = ControllableMixin.translateShape;
        this.init(annotation, options, index);
        this.collection = 'shapes';
    }
    ControllableImage.prototype.render = function (parent) {
        var attrs = this.attrsFromOptions(this.options), options = this.options;
        this.graphic = this.annotation.chart.renderer
            .image(options.src, 0, -9e9, options.width, options.height)
            .attr(attrs)
            .add(parent);
        this.graphic.width = options.width;
        this.graphic.height = options.height;
        ControllableMixin.render.call(this);
    };
    ControllableImage.prototype.redraw = function (animation) {
        var anchor = this.anchor(this.points[0]), position = ControllableLabel.prototype.position.call(this, anchor);
        if (position) {
            this.graphic[animation ? 'animate' : 'attr']({
                x: position.x,
                y: position.y
            });
        }
        else {
            this.graphic.attr({
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
     * @name Highcharts.AnnotationControllableImage.attrsMap
     * @type {Highcharts.Dictionary<string>}
     */
    ControllableImage.attrsMap = {
        width: 'width',
        height: 'height',
        zIndex: 'zIndex'
    };
    return ControllableImage;
}());
export default ControllableImage;
