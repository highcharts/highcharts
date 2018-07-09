'use strict';
import H from './../../parts/Globals.js';
import controllableMixin from './controllableMixin.js';
import ControllableLabel from './controllableLabel.js';
import './../../parts/Utilities.js';

/**
 * A controllable image class.
 *
 * @class ControllableImage
 *
 * @param {Highcharts.Annotation}
 * @param {Object} - shape options
 **/
function ControllableImage(annotation, options) {
    this.init(annotation, options);
}

/**
 * A map object which allows to map options attributes to element attributes
 *
 * @memberOf Highcharts.Annotation
 * @type {Object}
 * @static
 */
ControllableImage.attrsMap = {
    width: 'width',
    height: 'height',
    zIndex: 'zIndex'
};

H.merge(true, ControllableImage.prototype, controllableMixin, {
    type: 'image',

    /**
     * Render the image
     *
     * @param {SVGElement} [parent]
     **/
    render: function (parent) {
        var attrs = this.attrsFromOptions(this.options),
            options = this.options;

        this.graphic = this.annotation.chart.renderer
            .image(options.src, 0, -9e9, options.width, options.height)
            .attr(attrs)
            .add(parent);

        this.graphic.width = options.width;
        this.graphic.height = options.height;

        controllableMixin.render.call(this);
    },

    /**
     * Redraw the label
     *
     * @param {Boolean} [animation]
     **/
    redraw: function (animation) {
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
    },

    /**
     * Translate the center of the image.
     *
     * @param {Number} dx - translation for x coordinate
     * @param {Number} dy - translation for y coordinate
     **/
    translate: function (dx, dy) {
        this.translatePoint(dx, dy, 0);
    }
});

export default ControllableImage;
