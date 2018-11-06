'use strict';
import H from './../../parts/Globals.js';
import './../../parts/Chart.js';
import './../../parts/Utilities.js';
import './../../parts/SvgRenderer.js';

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
 * @type {Object}
 * @sample highcharts/annotations/custom-markers/
 *         Define a custom marker for annotations
 * @sample highcharts/css/annotations-markers/
 *         Define markers in a styled mode
 * @since 6.0.0
 * @apioption defs
 */
var defaultMarkers = {
    arrow: {
        tagName: 'marker',
        render: false,
        id: 'arrow',
        refY: 5,
        refX: 9,
        markerWidth: 10,
        markerHeight: 10,
        children: [{
            tagName: 'path',
            d: 'M 0 0 L 10 5 L 0 10 Z', // triangle (used as an arrow)
            strokeWidth: 0
        }]
    },

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

H.SVGRenderer.prototype.addMarker = function (id, markerOptions) {
    var options = { id: id };

    var attrs = {
        stroke: markerOptions.color || 'none',
        fill: markerOptions.color || 'rgba(0, 0, 0, 0.75)'
    };

    options.children = markerOptions.children.map(function (child) {
        return H.merge(attrs, child);
    });

    var marker = this.definition(H.merge(true, {
        markerWidth: 20,
        markerHeight: 20,
        refX: 0,
        refY: 0,
        orient: 'auto'
    }, markerOptions, options));

    marker.id = id;

    return marker;
};

var createMarkerSetter = function (markerType) {
    return function (value) {
        this.attr(markerType, 'url(#' + value + ')');
    };
};

/**
 * @mixin
 */
var markerMixin = {
    markerEndSetter: createMarkerSetter('marker-end'),
    markerStartSetter: createMarkerSetter('marker-start'),

    /*
     * Set markers.
     *
     * @param {Controllable} item
     */
    setItemMarkers: function (item) {
        var itemOptions = item.options,
            chart = item.chart,
            defs = chart.options.defs,
            fill = itemOptions.fill,
            color = H.defined(fill) && fill !== 'none' ?
            fill :
            itemOptions.stroke,

            setMarker = function (markerType) {
                var markerId = itemOptions[markerType],
                    def,
                    predefinedMarker,
                    key,
                    marker;

                if (markerId) {
                    for (key in defs) {
                        def = defs[key];

                        if (
                            markerId === def.id && def.tagName === 'marker'
                        ) {
                            predefinedMarker = def;
                            break;
                        }
                    }

                    if (predefinedMarker) {
                        marker = item[markerType] = chart.renderer
                            .addMarker(
                                (itemOptions.id || H.uniqueKey()) + '-' +
                                predefinedMarker.id,
                                H.merge(predefinedMarker, { color: color })
                            );

                        item.attr(markerType, marker.attr('id'));
                    }
                }
            };

        ['markerStart', 'markerEnd'].forEach(setMarker);
    }
};

// In a styled mode definition is implemented
H.SVGRenderer.prototype.definition = function (def) {
    var ren = this;

    function recurse(config, parent) {
        var ret;
        H.splat(config).forEach(function (item) {
            var node = ren.createElement(item.tagName),
                attr = {};

            // Set attributes
            H.objectEach(item, function (val, key) {
                if (
                    key !== 'tagName' &&
                    key !== 'children' &&
                    key !== 'textContent'
                ) {
                    attr[key] = val;
                }
            });
            node.attr(attr);

            // Add to the tree
            node.add(parent || ren.defs);

            // Add text content
            if (item.textContent) {
                node.element.appendChild(
                    H.doc.createTextNode(item.textContent)
                );
            }

            // Recurse
            recurse(item.children || [], node);

            ret = node;
        });

        // Return last node added (on top level it's the only one)
        return ret;
    }
    return recurse(def);
};

H.addEvent(H.Chart, 'afterGetContainer', function () {
    this.options.defs = H.merge(defaultMarkers, this.options.defs || {});

    H.objectEach(this.options.defs, function (def) {
        if (def.tagName === 'marker' && def.render !== false) {
            this.renderer.addMarker(def.id, def);
        }
    }, this);
});

export default markerMixin;
