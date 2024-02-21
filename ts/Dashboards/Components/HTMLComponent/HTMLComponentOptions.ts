/* *
 *
 *  (c) 2009-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */


import type Component from '../Component';
import type AST from '../../../Core/Renderer/HTML/AST';

/* *
 *
 *  Declarations
 *
 * */

export interface Options extends Component.Options {
    /**
     * Array of HTML elements, declared as string or node.
     * ```
     * Example:
     *
     * elements: [{
     *   tagName: 'img',
     *   attributes: {
     *       src: 'http://path.to.image'
     *   }
     * }]
     * ```
     *
     * Try it:
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/html-component/single-element/ | HTML component with one image.}
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/html-component/nested-elements/ | HTML component with nested images.}
     *
     */
    elements?: (AST.Node | string)[];
    type: 'HTML';
}


/* *
 *
 *  Default Export
 *
 * */

export default Options;
