/* *
 *
 *  (c) 2010-2024 Torstein Honsi
 *
 *  License: www.highcharts.com/license
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
