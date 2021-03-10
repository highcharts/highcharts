/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type ControllablePath from '../Controllables/ControllablePath';
import type SVGAttributes from '../../../Core/Renderer/SVG/SVGAttributes';
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
            defs?: Record<string, ASTNode>;
        }
        interface SVGRenderer {
            addMarker(id: string, markerOptions: ASTNode): SVGElement;
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
 *         'stroke-width': 0
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
 * @type         {Highcharts.Dictionary<Highcharts.ASTNode>}
 * @since        6.0.0
 * @optionparent defs
 */
var defaultMarkers: Record<string, Highcharts.ASTNode> = {
    /**
     * @type {Highcharts.ASTNode}
     */
    arrow: {
        tagName: 'marker',
        attributes: {
            display: 'none',
            id: 'arrow',
            refY: 5,
            refX: 9,
            markerWidth: 10,
            markerHeight: 10
        },
        /**
         * @type {Array<Highcharts.DefsOptions>}
         */
        children: [{
            tagName: 'path',
            attributes: {
                d: 'M 0 0 L 10 5 L 0 10 Z', // triangle (used as an arrow)
                'stroke-width': 0
            }
        }]
    },
    /**
     * @type {Highcharts.ASTNode}
     */
    'reverse-arrow': {
        tagName: 'marker',
        attributes: {
            display: 'none',
            id: 'reverse-arrow',
            refY: 5,
            refX: 1,
            markerWidth: 10,
            markerHeight: 10
        },
        children: [{
            tagName: 'path',
            attributes: {
                // reverse triangle (used as an arrow)
                d: 'M 0 5 L 10 0 L 10 10 Z',
                'stroke-width': 0
            }
        }]
    }
};

SVGRenderer.prototype.addMarker = function (
    id: string,
    markerOptions: Highcharts.ASTNode
): SVGElement {
    var options: Highcharts.ASTNode = { attributes: { id } };

    var attrs: SVGAttributes = {
        stroke: (markerOptions as any).color || 'none',
        fill: (markerOptions as any).color || 'rgba(0, 0, 0, 0.75)'
    };

    options.children = markerOptions.children?.map(function (
        child: Highcharts.ASTNode
    ): Highcharts.ASTNode {
        return merge(attrs, child);
    });

    const ast = merge(true, {
        attributes: {
            markerWidth: 20,
            markerHeight: 20,
            refX: 0,
            refY: 0,
            orient: 'auto'
        }
    }, markerOptions, options);

    var marker = this.definition(ast);

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
                            (
                                markerId === def.attributes?.id ||
                                // Legacy, for
                                // unit-tests/annotations/annotations-shapes
                                markerId === (def as any).id
                            ) &&
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
                                markerId,
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
        const attributes = def.attributes;
        if (
            def.tagName === 'marker' &&
            attributes &&
            attributes.id &&
            attributes.display !== 'none'
        ) {
            this.renderer.addMarker(attributes.id, def);
        }
    }, this);
});

export default markerMixin;
