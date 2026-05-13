/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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
