/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import controllableMixin from './controllableMixin.js';
import H from './../../parts/Globals.js';
import markerMixin from './markerMixin.js';
import U from './../../parts/Utilities.js';
var extend = U.extend, merge = U.merge;
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
var ControllablePath = function (annotation, options, index) {
    this.init(annotation, options, index);
    this.collection = 'shapes';
};
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
merge(true, ControllablePath.prototype, controllableMixin, /** @lends Highcharts.AnnotationControllablePath# */ {
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
    toD: function () {
        var dOption = this.options.d;
        if (dOption) {
            return typeof dOption === 'function' ?
                dOption.call(this) :
                dOption;
        }
        var points = this.points, len = points.length, showPath = len, point = points[0], position = showPath && this.anchor(point).absolutePosition, pointIndex = 0, command, d = [];
        if (position) {
            d.push(['M', position.x, position.y]);
            while (++pointIndex < len && showPath) {
                point = points[pointIndex];
                command = point.command || 'L';
                position = this.anchor(point).absolutePosition;
                if (command === 'M') {
                    d.push([command, position.x, position.y]);
                }
                else if (command === 'L') {
                    d.push([command, position.x, position.y]);
                }
                else if (command === 'Z') {
                    d.push([command]);
                }
                showPath = point.series.visible;
            }
        }
        return showPath ?
            this.chart.renderer.crispLine(d, this.graphic.strokeWidth()) :
            null;
    },
    shouldBeDrawn: function () {
        return (controllableMixin.shouldBeDrawn.call(this) || Boolean(this.options.d));
    },
    render: function (parent) {
        var options = this.options, attrs = this.attrsFromOptions(options);
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
                'stroke-linejoin': 'round',
                stroke: TRACKER_FILL,
                fill: TRACKER_FILL,
                'stroke-width': this.graphic.strokeWidth() +
                    options.snap * 2
            });
        }
        controllableMixin.render.call(this);
        extend(this.graphic, {
            markerStartSetter: markerMixin.markerStartSetter,
            markerEndSetter: markerMixin.markerEndSetter
        });
        this.setMarkers(this);
    },
    redraw: function (animation) {
        var d = this.toD(), action = animation ? 'animate' : 'attr';
        if (d) {
            this.graphic[action]({ d: d });
            this.tracker[action]({ d: d });
        }
        else {
            this.graphic.attr({ d: 'M 0 ' + -9e9 });
            this.tracker.attr({ d: 'M 0 ' + -9e9 });
        }
        this.graphic.placed = this.tracker.placed = Boolean(d);
        controllableMixin.redraw.call(this, animation);
    }
});
export default ControllablePath;
