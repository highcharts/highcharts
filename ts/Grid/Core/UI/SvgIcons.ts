/* *
 *
 *  Grid Svg Icons Registry
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Mikkel Espolin Birkeland
 *  - Dawid Dragula
 *
 * */

'use strict';
/* eslint-disable max-len */


/* *
 *
 *  Imports
 *
 * */

import Globals from '../Globals.js';
import { setHTMLContent } from '../GridUtils.js';
import U from '../../../Core/Utilities.js';

const { defined } = U;


/* *
 *
 *  Constants
 *
 * */

/**
 * The name of the icon from SvgIcons registry.
 * Use these names wherever an icon is accepted (toolbar, menu, pagination).
 * Can be overridden or extended via `rendering.icons`.
 *
 * Default icons available in the registry:
 * - `filter`, `menu`, `chevronRight`, `chevronLeft`, `checkmark`
 * - `upDownArrows`, `sortAsc`, `sortDesc`
 * - `copy`, `clipboard`, `plus`, `trash`
 * - `addRowAbove`, `addRowBelow`, `addColumnLeft`, `addColumnRight`
 * - `firstPage`, `prevPage`, `nextPage`, `lastPage` (pagination)
 */
export type GridIconName = (
    'filter' | 'menu' | 'chevronRight' | 'chevronLeft' | 'checkmark' |
    'upDownArrows' | 'sortAsc' | 'sortDesc' |
    'copy' | 'clipboard' | 'plus' | 'trash' |
    'addRowAbove' | 'addRowBelow' | 'addColumnLeft' | 'addColumnRight' |
    'firstPage' | 'prevPage' | 'nextPage' | 'lastPage'
);

/**
 * The registry of all Grid Svg icons with their SVG path data.
 */
export const icons: Record<GridIconName, SVGDefinition> = {
    filter: {
        width: 16,
        height: 14,
        children: [{
            d: 'M2.2571 2.77791C1.75287 2.21437 1.50076 1.93259 1.49125 1.69312C1.48299 1.48509 1.57238 1.28515 1.73292 1.15259C1.91773 1 2.29583 1 3.05202 1H12.9473C13.7035 1 14.0816 1 14.2664 1.15259C14.427 1.28515 14.5163 1.48509 14.5081 1.69312C14.4986 1.93259 14.2465 2.21437 13.7422 2.77791L9.93808 7.02962C9.83756 7.14196 9.78731 7.19813 9.75147 7.26205C9.71969 7.31875 9.69637 7.37978 9.68225 7.44323C9.66633 7.51476 9.66633 7.59013 9.66633 7.74087V11.3056C9.66633 11.436 9.66633 11.5011 9.64531 11.5575C9.62673 11.6073 9.59651 11.6519 9.55717 11.6877C9.51265 11.7281 9.45213 11.7524 9.33108 11.8008L7.06441 12.7074C6.81938 12.8054 6.69687 12.8545 6.59852 12.834C6.51251 12.8161 6.43704 12.765 6.3885 12.6918C6.333 12.6081 6.333 12.4762 6.333 12.2122V7.74087C6.333 7.59013 6.333 7.51476 6.31708 7.44323C6.30296 7.37978 6.27964 7.31875 6.24786 7.26205C6.21203 7.19813 6.16177 7.14196 6.06126 7.02962L2.2571 2.77791Z'
        }]
    },
    menu: {
        width: 4,
        height: 12,
        children: [{
            d: 'M2.00016 6.66675C2.36835 6.66675 2.66683 6.36827 2.66683 6.00008C2.66683 5.63189 2.36835 5.33341 2.00016 5.33341C1.63197 5.33341 1.3335 5.63189 1.3335 6.00008C1.3335 6.36827 1.63197 6.66675 2.00016 6.66675Z'
        }, {
            d: 'M2.00016 2.00008C2.36835 2.00008 2.66683 1.7016 2.66683 1.33341C2.66683 0.965225 2.36835 0.666748 2.00016 0.666748C1.63197 0.666748 1.3335 0.965225 1.3335 1.33341C1.3335 1.7016 1.63197 2.00008 2.00016 2.00008Z'
        }, {
            d: 'M2.00016 11.3334C2.36835 11.3334 2.66683 11.0349 2.66683 10.6667C2.66683 10.2986 2.36835 10.0001 2.00016 10.0001C1.63197 10.0001 1.3335 10.2986 1.3335 10.6667C1.3335 11.0349 1.63197 11.3334 2.00016 11.3334Z'
        }]
    },
    chevronRight: {
        width: 6,
        height: 10,
        children: [{
            d: 'M1 9L5 5L1 1',
            'stroke-width': 1.34
        }]
    },
    chevronLeft: {
        width: 6,
        height: 10,
        children: [{
            d: 'M5 9L1 5L5 1',
            'stroke-width': 1.34
        }]
    },
    checkmark: {
        width: 12,
        height: 9,
        children: [{
            d: 'M11.3332 1L3.99984 8.33333L0.666504 5'
        }]
    },
    upDownArrows: {
        width: 14,
        height: 12,
        children: [{
            d: 'M3.66667 0.666748V11.3334M3.66667 11.3334L1 8.66675M3.66667 11.3334L6.33333 8.66675M10.3333 11.3334V0.666748M10.3333 0.666748L7.66667 3.33341M10.3333 0.666748L13 3.33341'
        }]
    },
    sortAsc: {
        width: 14,
        height: 12,
        children: [{
            d: 'M3.66667 0.666748V11.3334M3.66667 11.3334L1 8.66675M3.66667 11.3334L6.33333 8.66675',
            opacity: 0.2
        }, {
            d: 'M 10.3333 11.3334 V 0.6667 M 10.3333 0.6667 L 7.6667 3.3334 M 10.3333 0.6667 L 13 3.3334'
        }]
    },
    sortDesc: {
        width: 14,
        height: 12,
        children: [{
            d: 'M3.66667 0.666748V11.3334M3.66667 11.3334L1 8.66675M3.66667 11.3334L6.33333 8.66675'
        }, {
            d: 'M 10.3333 11.3334 V 0.6667 M 10.3333 0.6667 L 7.6667 3.3334 M 10.3333 0.6667 L 13 3.3334',
            opacity: 0.2
        }]
    },
    copy: {
        // Imported from a 24x24 source icon and scaled down via viewBox.
        width: 16,
        height: 16,
        viewBox: '0 0 24 24',
        children: [{
            d: 'M5 15C4.06812 15 3.60218 15 3.23463 14.8478C2.74458 14.6448 2.35523 14.2554 2.15224 13.7654C2 13.3978 2 12.9319 2 12V5.2C2 4.0799 2 3.51984 2.21799 3.09202C2.40973 2.71569 2.71569 2.40973 3.09202 2.21799C3.51984 2 4.0799 2 5.2 2H12C12.9319 2 13.3978 2 13.7654 2.15224C14.2554 2.35523 14.6448 2.74458 14.8478 3.23463C15 3.60218 15 4.06812 15 5M12.2 22H18.8C19.9201 22 20.4802 22 20.908 21.782C21.2843 21.5903 21.5903 21.2843 21.782 20.908C22 20.4802 22 19.9201 22 18.8V12.2C22 11.0799 22 10.5198 21.782 10.092C21.5903 9.71569 21.2843 9.40973 20.908 9.21799C20.4802 9 19.9201 9 18.8 9H12.2C11.0799 9 10.5198 9 10.092 9.21799C9.71569 9.40973 9.40973 9.71569 9.21799 10.092C9 10.5198 9 11.0799 9 12.2V18.8C9 19.9201 9 20.4802 9.21799 20.908C9.40973 21.2843 9.71569 21.5903 10.092 21.782C10.5198 22 11.0799 22 12.2 22Z',
            'stroke-width': 2
        }]
    },
    clipboard: {
        // Imported from a 24x24 source icon and scaled down via viewBox.
        width: 16,
        height: 16,
        viewBox: '0 0 24 24',
        children: [{
            d: 'M16 4C16.93 4 17.395 4 17.7765 4.10222C18.8117 4.37962 19.6204 5.18827 19.8978 6.22354C20 6.60504 20 7.07003 20 8V17.2C20 18.8802 20 19.7202 19.673 20.362C19.3854 20.9265 18.9265 21.3854 18.362 21.673C17.7202 22 16.8802 22 15.2 22H8.8C7.11984 22 6.27976 22 5.63803 21.673C5.07354 21.3854 4.6146 20.9265 4.32698 20.362C4 19.7202 4 18.8802 4 17.2V8C4 7.07003 4 6.60504 4.10222 6.22354C4.37962 5.18827 5.18827 4.37962 6.22354 4.10222C6.60504 4 7.07003 4 8 4M9.6 6H14.4C14.9601 6 15.2401 6 15.454 5.89101C15.6422 5.79513 15.7951 5.64215 15.891 5.45399C16 5.24008 16 4.96005 16 4.4V3.6C16 3.03995 16 2.75992 15.891 2.54601C15.7951 2.35785 15.6422 2.20487 15.454 2.10899C15.2401 2 14.9601 2 14.4 2H9.6C9.03995 2 8.75992 2 8.54601 2.10899C8.35785 2.20487 8.20487 2.35785 8.10899 2.54601C8 2.75992 8 3.03995 8 3.6V4.4C8 4.96005 8 5.24008 8.10899 5.45399C8.20487 5.64215 8.35785 5.79513 8.54601 5.89101C8.75992 6 9.03995 6 9.6 6Z',
            'stroke-width': 2
        }]
    },
    plus: {
        width: 16,
        height: 16,
        viewBox: '0 0 24 24',
        children: [{
            d: 'M12 5V19M5 12H19',
            'stroke-width': 2
        }]
    },
    trash: {
        width: 16,
        height: 16,
        viewBox: '0 0 24 24',
        children: [{
            d: 'M16 6V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H11.2C10.0799 2 9.51984 2 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8 3.51984 8 4.0799 8 5.2V6M10 11.5V16.5M14 11.5V16.5M3 6H21M19 6V17.2C19 18.8802 19 19.7202 18.673 20.362C18.3854 20.9265 17.9265 21.3854 17.362 21.673C16.7202 22 15.8802 22 14.2 22H9.8C8.11984 22 7.27976 22 6.63803 21.673C6.07354 21.3854 5.6146 20.9265 5.32698 20.362C5 19.7202 5 18.8802 5 17.2V6',
            'stroke-width': 2
        }]
    },
    addRowAbove: {
        width: 16,
        height: 16,
        viewBox: '0 0 24 24',
        children: [{
            d: 'M22.654 16.657H1m21.654-6.048H1m0-6.143v12.433c0 2.033 0 3.05.393 3.825a3.619 3.619 0 0 0 1.577 1.587c.772.395 1.783.395 3.804.395H16.88c2.021 0 3.032 0 3.804-.395a3.619 3.619 0 0 0 1.577-1.587c.394-.776.394-1.792.394-3.825V4.466m-14.068-.24h6.462M11.822 1v6.462',
            'stroke-width': 1.34
        }]
    },
    addRowBelow: {
        width: 16,
        height: 16,
        viewBox: '0 0 24 24',
        children: [{
            d: 'M1 7.049h21.654M1 13.097h21.654m0 6.143V6.807c0-2.033 0-3.05-.394-3.825a3.619 3.619 0 0 0-1.577-1.586C19.911 1 18.901 1 16.88 1H6.774c-2.02 0-3.031 0-3.803.396a3.62 3.62 0 0 0-1.578 1.586C1 3.758 1 4.774 1 6.807V19.24m14.068.24H8.606m3.226 3.226v-6.462',
            'stroke-width': 1.34
        }]
    },
    addColumnLeft: {
        width: 16,
        height: 16,
        viewBox: '0 0 24 24',
        children: [{
            d: 'M16.657 1v21.654M10.61 1v21.654m-6.143 0h12.433c2.033 0 3.05 0 3.825-.394a3.62 3.62 0 0 0 1.587-1.577c.395-.772.395-1.782.395-3.804V6.774c0-2.02 0-3.031-.395-3.803a3.62 3.62 0 0 0-1.587-1.578C19.948 1 18.932 1 16.9 1H4.466m-.24 14.068V8.606M1 11.832h6.462',
            'stroke-width': 1.34
        }]
    },
    addColumnRight: {
        width: 16,
        height: 16,
        viewBox: '0 0 24 24',
        children: [{
            d: 'M7.049 22.654V1m6.048 21.654V1m6.143 0H6.807c-2.033 0-3.05 0-3.825.393a3.62 3.62 0 0 0-1.586 1.578C1 3.743 1 4.753 1 6.774V16.88c0 2.021 0 3.032.396 3.804.348.68.903 1.231 1.586 1.577.776.394 1.792.394 3.825.394H19.24m.24-14.068v6.462m3.226-3.226h-6.462',
            'stroke-width': 1.34
        }]
    },
    firstPage: {
        width: 10,
        height: 10,
        viewBox: '0 0 10 10',
        children: [{
            d: 'M5 9L1 5L5 1M9 9L5 5L9 1',
            'stroke-width': 1.34
        }]
    },
    prevPage: {
        width: 8,
        height: 10,
        viewBox: '0 0 8 10',
        children: [{
            d: 'M5 9L1 5L5 1',
            'stroke-width': 1.34
        }]
    },
    nextPage: {
        width: 6,
        height: 10,
        children: [{
            d: 'M1 1L5 5L1 9',
            'stroke-width': 1.34
        }]
    },
    lastPage: {
        width: 10,
        height: 10,
        viewBox: '0 0 10 10',
        children: [{
            d: 'M5 1L9 5L5 9M1 1L5 5L1 9',
            'stroke-width': 1.34
        }]
    }
} as const;

/**
 * The default path definitions for the Grid Svg icons.
 */
export const pathDefaults: Partial<PathDefinition> = {
    stroke: 'currentColor',
    'stroke-width': 1.33,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
};


/* *
*
*  Types
*
* */

/**
 * The definition of a path for a Grid Svg icon.
 */
export interface PathDefinition {
    d: string;
    stroke?: string;
    'stroke-width'?: number;
    'stroke-linecap'?: string;
    'stroke-linejoin'?: string;
    opacity?: number;
}

/**
 * The definition of an SVG for a Grid Svg icon.
 */
export interface SVGDefinition {
    width?: number;
    height?: number;
    viewBox?: string;
    fill?: string;
    children?: PathDefinition[];
}

/**
 * Value for an entry in the icon registry: either an SVG definition object
 * or a raw SVG markup string (e.g. `'<svg>...</svg>'`).
 */
export type IconRegistryValue = SVGDefinition | string;


/* *
*
*  Functions
*
* */

/**
 * Parses a raw SVG markup string into an SVG element and applies a class.
 *
 * @param svgString
 * Raw SVG markup
 * @param className
 * CSS class name for the SVG element
 * @returns
 * SVG element, or a fallback empty SVG if parsing fails
 */
function parseSvgString(svgString: string, className: string): SVGElement {
    const div = document.createElement('div');
    setHTMLContent(div, svgString);
    const svg = div.firstElementChild;
    if (!svg || svg.namespaceURI !== 'http://www.w3.org/2000/svg') {
        const fallback = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg'
        );
        fallback.setAttribute('width', '16');
        fallback.setAttribute('height', '16');
        fallback.classList.add(className);
        return fallback;
    }
    const clone = svg.cloneNode(true) as SVGElement;
    clone.classList.add(className);
    return clone;
}

/**
 * Builds an SVG element from an SVG definition object.
 *
 * @param def
 * SVG definition from the registry
 * @param className
 * CSS class name for the SVG element
 * @returns
 * SVG element
 */
function createSvgFromDefinition(
    def: SVGDefinition,
    className: string
): SVGElement {
    const createElement = (type: string): SVGElement =>
        document.createElementNS('http://www.w3.org/2000/svg', type);
    const {
        width = 16, height = 16, viewBox, fill, children
    } = def;

    const svg = createElement('svg');
    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());
    svg.setAttribute('viewBox', viewBox ?? `0 0 ${width} ${height}`);
    svg.setAttribute('fill', fill ?? 'none');

    for (const childDefinition of children ?? []) {
        const path = createElement('path');

        const attrKeys = new Set<keyof PathDefinition>([
            ...Object.keys(childDefinition) as Array<keyof PathDefinition>,
            ...Object.keys(pathDefaults) as Array<keyof PathDefinition>
        ]);

        for (const attr of attrKeys) {
            const value = childDefinition[attr] ?? pathDefaults[attr];
            if (value !== void 0) {
                path.setAttribute(attr, value.toString());
            }
        }

        svg.appendChild(path);
    }
    svg.classList.add(className);
    return svg;
}

/**
 * Looks up an icon by name, checking custom icons first and then falling
 * back to the built-in registry.
 *
 * @param name
 * Icon name to look up.
 *
 * @param customIcons
 * Optional map of icon names provided via `rendering.icons`.
 *
 * @returns
 * Icon registry value (definition or raw SVG string), or `undefined` if
 * neither a custom nor a built-in icon exists for the given name.
 */
export function getIconFromRegistry(
    name: string,
    customIcons?: Record<string, IconRegistryValue>
): IconRegistryValue | undefined {
    if (customIcons && Object.prototype.hasOwnProperty.call(customIcons, name)) {
        return customIcons[name];
    }

    return icons[name as GridIconName];
}

/**
 * Creates an SVG icon element from the SvgIcons registry or a custom
 * registry. When `customIcons` is provided, `name` can be any registered
 * name (built-in or custom). When omitted, only built-in `GridIconName`
 * values are allowed. The SVG element always receives the default icon
 * class name from `Globals`.
 *
 * @param name
 * The name of the icon (built-in or from registry)
 *
 * @param customIcons
 * Optional custom icons map from `rendering.icons`. When provided, custom
 * and override icons are used and arbitrary names are allowed.
 *
 * @returns
 * SVG element with the specified icon
 */
export function createGridIcon(
    name: string,
    customIcons?: Record<string, IconRegistryValue>
): SVGElement {
    const className = Globals.getClassName('icon');
    const value = getIconFromRegistry(name, customIcons);

    if (!defined(value)) {
        return createSvgFromDefinition(icons.filter, className);
    }

    if (typeof value === 'string') {
        return parseSvgString(value, className);
    }

    return createSvgFromDefinition(value, className);
}


/* *
 *
 *  Default Export
 *
 * */

export default {
    createGridIcon,
    getIconFromRegistry,
    icons,
    pathDefaults
} as const;
