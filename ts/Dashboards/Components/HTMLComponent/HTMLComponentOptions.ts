/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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
     * Connector options
     */
    connector?: Component.ConnectorOptions;

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
    elements?: (AST.Node)[];

    /**
     * The HTML content of the component. If the `elements` option is set, the
     * `html` option will be ignored.
     *
     * @example
     * ```JavaScript
     * html: `
     *      <div>
     *          <h1>Custom HTML</h1>
     *          <span id="custom-html-div">Custom HTML added as string</span>
     *      </div>
     * `
     * ```
     */
    html?: string;

    type: 'HTML';
}


/* *
 *
 *  Default Export
 *
 * */

export default Options;
