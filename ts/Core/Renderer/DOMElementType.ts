/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Declarations
 *
 * */

export type DOMElementType = (HTMLDOMElement|SVGDOMElement);

export type HTMLDOMElement = globalThis.HTMLElement;

export type SVGDOMElement = globalThis.SVGElement;

/* *
 *
 *  Default Export
 *
 * */

export default DOMElementType;
