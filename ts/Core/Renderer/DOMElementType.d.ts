/* *
 *
 *  (c) 2010-2025 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Declarations
 *
 * */

export type DOMElementType = DOMElementTypeRegistry[
    keyof DOMElementTypeRegistry
];

export type HTMLDOMElement = globalThis.HTMLElement;

export type SVGDOMElement = globalThis.SVGElement;

export interface DOMElementTypeRegistry {
    HTMLDOMElement: HTMLDOMElement;
    SVGDOMElement: SVGDOMElement;
}

/* *
 *
 *  Default Export
 *
 * */

export default DOMElementType;
