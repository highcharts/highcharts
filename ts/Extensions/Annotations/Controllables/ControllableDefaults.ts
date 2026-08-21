/* *
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type AST from '../../../Core/Renderer/HTML/AST';

/**
 * A collection of SVG marker definitions used by annotations. Each key is a
 * marker id that can be referenced from an annotation shape's
 * [markerEnd](#annotations.shapes.markerEnd) or
 * [markerStart](#annotations.shapes.markerStart) option.
 *
 * Two markers are available by default: `arrow` and `reverse-arrow`.
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
const defaultMarkers: Record<string, AST.Node> = {
    /**
     * The default `arrow` marker, rendered as a filled triangle pointing
     * towards the end of the path. Reference it by id in
     * [markerEnd](#annotations.shapes.markerEnd) or
     * [markerStart](#annotations.shapes.markerStart).
     *
     * @type {Highcharts.ASTNode}
     */
    arrow: {
        tagName: 'marker',
        attributes: {
            id: 'arrow',
            refY: 5,
            refX: 9,
            markerWidth: 10,
            markerHeight: 10
        },
        children: [{
            tagName: 'path',
            attributes: {
                d: 'M 0 0 L 10 5 L 0 10 Z', // Triangle (used as an arrow)
                'stroke-width': 0
            }
        }]
    },
    /**
     * The default `reverse-arrow` marker, rendered as a filled triangle
     * pointing towards the start of the path. Reference it by id in
     * [markerEnd](#annotations.shapes.markerEnd) or
     * [markerStart](#annotations.shapes.markerStart).
     *
     * @type {Highcharts.ASTNode}
     */
    'reverse-arrow': {
        tagName: 'marker',
        attributes: {
            id: 'reverse-arrow',
            refY: 5,
            refX: 1,
            markerWidth: 10,
            markerHeight: 10
        },
        children: [{
            tagName: 'path',
            attributes: {
                // Reverse triangle (used as an arrow)
                d: 'M 0 5 L 10 0 L 10 10 Z',
                'stroke-width': 0
            }
        }]
    }
};

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
const ControllableDefaults = {
    defaultMarkers
};

/** @internal */
export default ControllableDefaults;
