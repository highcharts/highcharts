/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import Chart from '../../../Core/Chart/Chart.js';
import SVGRenderer from '../../../Core/Renderer/SVG/SVGRenderer.js';
import U from '../../../Core/Utilities.js';
var addEvent = U.addEvent, defined = U.defined, merge = U.merge, objectEach = U.objectEach, uniqueKey = U.uniqueKey;
/**
 * Options for configuring markers for annotations.
 *
 * An example of the arrow marker:
 * <pre>
 * {
 *   arrow: {
 *     id: 'arrow',
 *     tagName: 'marker',
 *     refY: 5,
 *     refX: 5,
 *     markerWidth: 10,
 *     markerHeight: 10,
 *     children: [{
 *       tagName: 'path',
 *       attrs: {
 *         d: 'M 0 0 L 10 5 L 0 10 Z',
 *         strokeWidth: 0
 *       }
 *     }]
 *   }
 * }
 * </pre>
 *
 * @sample highcharts/annotations/custom-markers/
 *         Define a custom marker for annotations
 *
 * @sample highcharts/css/annotations-markers/
 *         Define markers in a styled mode
 *
 * @type         {Highcharts.Dictionary<Highcharts.SVGDefinitionObject>}
 * @since        6.0.0
 * @optionparent defs
 */
var defaultMarkers = {
    /**
     * @type {Highcharts.SVGDefinitionObject}
     */
    arrow: {
        tagName: 'marker',
        render: false,
        id: 'arrow',
        refY: 5,
        refX: 9,
        markerWidth: 10,
        markerHeight: 10,
        /**
         * @type {Array<Highcharts.DefsOptions>}
         */
        children: [{
                tagName: 'path',
                d: 'M 0 0 L 10 5 L 0 10 Z',
                strokeWidth: 0
            }]
    },
    /**
     * @type {Highcharts.SVGDefinitionObject}
     */
    'reverse-arrow': {
        tagName: 'marker',
        render: false,
        id: 'reverse-arrow',
        refY: 5,
        refX: 1,
        markerWidth: 10,
        markerHeight: 10,
        children: [{
                tagName: 'path',
                // reverse triangle (used as an arrow)
                d: 'M 0 5 L 10 0 L 10 10 Z',
                strokeWidth: 0
            }]
    }
};
SVGRenderer.prototype.addMarker = function (id, markerOptions) {
    var options = { id: id };
    var attrs = {
        stroke: markerOptions.color || 'none',
        fill: markerOptions.color || 'rgba(0, 0, 0, 0.75)'
    };
    options.children = markerOptions.children.map(function (child) {
        return merge(attrs, child);
    });
    var marker = this.definition(merge(true, {
        markerWidth: 20,
        markerHeight: 20,
        refX: 0,
        refY: 0,
        orient: 'auto'
    }, markerOptions, options));
    marker.id = id;
    return marker;
};
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * @private
 */
function createMarkerSetter(markerType) {
    return function (value) {
        this.attr(markerType, 'url(#' + value + ')');
    };
}
/**
 * @private
 * @mixin
 * @name Highcharts.AnnotaitonMarkerMixin
 */
var markerMixin = {
    markerEndSetter: createMarkerSetter('marker-end'),
    markerStartSetter: createMarkerSetter('marker-start'),
    /**
     * Set markers.
     * @private
     * @param {Highcharts.AnnotationControllablePath} item
     */
    setItemMarkers: function (item) {
        var itemOptions = item.options, chart = item.chart, defs = chart.options.defs, fill = itemOptions.fill, color = defined(fill) && fill !== 'none' ?
            fill :
            itemOptions.stroke, setMarker = function (markerType) {
            var markerId = itemOptions[markerType], def, predefinedMarker, key, marker;
            if (markerId) {
                for (key in defs) { // eslint-disable-line guard-for-in
                    def = defs[key];
                    if (markerId === def.id &&
                        def.tagName === 'marker') {
                        predefinedMarker = def;
                        break;
                    }
                }
                if (predefinedMarker) {
                    marker = item[markerType] = chart.renderer
                        .addMarker((itemOptions.id || uniqueKey()) + '-' +
                        predefinedMarker.id, merge(predefinedMarker, { color: color }));
                    item.attr(markerType, marker.attr('id'));
                }
            }
        };
        ['markerStart', 'markerEnd'].forEach(setMarker);
    }
};
addEvent(Chart, 'afterGetContainer', function () {
    this.options.defs = merge(defaultMarkers, this.options.defs || {});
    objectEach(this.options.defs, function (def) {
        if (def.tagName === 'marker' && def.render !== false) {
            this.renderer.addMarker(def.id, def);
        }
    }, this);
});
export default markerMixin;
