/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
const defaultMarkers: Record<string, AST.Node> = {
    /**
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
        /**
         * @type {Array<Highcharts.DefsOptions>}
         */
        children: [{
            tagName: 'path',
            attributes: {
                d: 'M 0 0 L 10 5 L 0 10 Z', // Triangle (used as an arrow)
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
