/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type ControllablePath from '../Controllables/ControllablePath';
import type SVGElement from '../../../Core/Renderer/SVG/SVGElement';
import Chart from '../../../Core/Chart/Chart.js';
import SVGRenderer from '../../../Core/Renderer/SVG/SVGRenderer.js';
import U from '../../../Core/Utilities.js';
const {
    addEvent,
    defined,
    merge,
    objectEach,
    uniqueKey
} = U;

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        interface AnnotationChart {
            afterGetContainer(): void;
        }
        interface AnnotationMarkerMixin {
            markerEndSetter(this: SVGElement, value: string): void;
            markerStartSetter(this: SVGElement, value: string): void;
            setItemMarkers(this: ControllablePath, item: ControllablePath): void;
        }
        interface Options {
            defs?: Dictionary<NodeTreeObject>;
        }
        interface SVGRenderer {
            addMarker(id: string, markerOptions: SVGAttributes): SVGElement;
        }
    }
}

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
 * @type         {Highcharts.Dictionary<Highcharts.NodeTreeObject>}
 * @since        6.0.0
 * @optionparent defs
 */
var defaultMarkers: Record<string, Highcharts.NodeTreeObject> = {
    /**
     * @type {Highcharts.NodeTreeObject}
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
            d: 'M 0 0 L 10 5 L 0 10 Z', // triangle (used as an arrow)
            strokeWidth: 0
        }]
    },
    /**
     * @type {Highcharts.NodeTreeObject}
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

SVGRenderer.prototype.addMarker = function (
    id: string,
    markerOptions: Highcharts.SVGAttributes
): Highcharts.SVGElement {
    var options: Highcharts.NodeTreeObject = { id: id } as any;

    var attrs: Highcharts.SVGAttributes = {
        stroke: markerOptions.color || 'none',
        fill: markerOptions.color || 'rgba(0, 0, 0, 0.75)'
    };

    options.children = markerOptions.children.map(function (
        child: Highcharts.NodeTreeObject
    ): Highcharts.NodeTreeObject {
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
function createMarkerSetter(markerType: string): Highcharts.AnnotationMarkerMixin['markerStartSetter'] {
    return function (this: SVGElement, value: string): void {
        this.attr(markerType, 'url(#' + value + ')');
    };
}

/**
 * @private
 * @mixin
 * @name Highcharts.AnnotaitonMarkerMixin
 */
var markerMixin: Highcharts.AnnotationMarkerMixin = {
    markerEndSetter: createMarkerSetter('marker-end'),
    markerStartSetter: createMarkerSetter('marker-start'),

    /**
     * Set markers.
     * @private
     * @param {Highcharts.AnnotationControllablePath} item
     */
    setItemMarkers: function (item: ControllablePath): void {
        var itemOptions = item.options,
            chart = item.chart,
            defs = chart.options.defs,
            fill = itemOptions.fill,
            color = defined(fill) && fill !== 'none' ?
                fill :
                itemOptions.stroke,

            setMarker = function (markerType: ('markerEnd'|'markerStart')): void {
                var markerId = itemOptions[markerType],
                    def,
                    predefinedMarker,
                    key,
                    marker;

                if (markerId) {
                    for (key in defs) { // eslint-disable-line guard-for-in
                        def = defs[key];

                        if (
                            markerId === def.id &&
                            def.tagName === 'marker'
                        ) {
                            predefinedMarker = def;
                            break;
                        }
                    }

                    if (predefinedMarker) {
                        marker = item[markerType] = chart.renderer
                            .addMarker(
                                (itemOptions.id || uniqueKey()) + '-' +
                                predefinedMarker.id,
                                merge(predefinedMarker, { color: color })
                            );

                        item.attr(markerType, marker.getAttribute('id'));
                    }
                }
            };

        (['markerStart', 'markerEnd'] as Array<('markerEnd'|'markerStart')>).forEach(setMarker);
    }
};

addEvent(Chart, 'afterGetContainer', function (): void {
    this.options.defs = merge(defaultMarkers, this.options.defs || {});

    objectEach(this.options.defs, function (def): void {
        if (def.tagName === 'marker' && def.render !== false) {
            this.renderer.addMarker(def.id as any, def);
        }
    }, this);
});

export default markerMixin;
