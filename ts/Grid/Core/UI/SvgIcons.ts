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


/* *
 *
 *  Constants
 *
 * */

/**
 * The name of the icon from SvgIcons registry
 */
export type GridIconName = (
    'filter' | 'menu' | 'checkmark' | 'arrowUpDown' | 'arrowUp' |
    'arrowDown' | 'chevronLeft' | 'chevronRight' | 'doubleChevronLeft' |
    'doubleChevronRight' | 'copy' | 'clipboard' | 'plus' | 'trash' |
    'addRowAbove' | 'addRowBelow' | 'addColumnLeft' | 'addColumnRight'
);

/**
 * The registry of all Grid Svg icons with their SVG path data.
 */
export const icons: Record<GridIconName, SVGDefinition> = {
    filter: {
        width: 12,
        height: 12,
        children: [{
            d: 'M 1.69283 2.38107 C 1.31465 1.89803 1.12557 1.65651 1.11844 1.45125 C 1.11224 1.27293 1.17929 1.10156 1.29969 0.98793 C 1.4383 0.85714 1.72187 0.85714 2.28902 0.85714 H 9.71048 C 10.27763 0.85714 10.5612 0.85714 10.6998 0.98793 C 10.82025 1.10156 10.88722 1.27293 10.88108 1.45125 C 10.87395 1.65651 10.68487 1.89803 10.30665 2.38107 L 7.45356 6.02539 C 7.37817 6.12168 7.34048 6.16983 7.3136 6.22461 C 7.28977 6.27321 7.27228 6.32553 7.26169 6.37991 C 7.24975 6.44122 7.24975 6.50583 7.24975 6.63503 V 9.69051 C 7.24975 9.80229 7.24975 9.85809 7.23398 9.90643 C 7.22005 9.94911 7.19738 9.98734 7.16788 10.01803 C 7.13449 10.05266 7.0891 10.07349 6.99831 10.11497 L 5.29831 10.89206 C 5.11454 10.97606 5.02265 11.01814 4.94889 11.00057 C 4.88438 10.98523 4.82778 10.94143 4.79137 10.87869 C 4.74975 10.80694 4.74975 10.69389 4.74975 10.4676 V 6.63503 C 4.74975 6.50583 4.74975 6.44122 4.73781 6.37991 C 4.72722 6.32553 4.70973 6.27321 4.6859 6.22461 C 4.65902 6.16983 4.62133 6.12168 4.54594 6.02539 L 1.69283 2.38107 Z'
        }]
    },
    menu: {
        width: 8,
        height: 12,
        viewBox: '0 0 4 12',
        children: [{
            d: 'M2.00016 6.66675C2.36835 6.66675 2.66683 6.36827 2.66683 6.00008C2.66683 5.63189 2.36835 5.33341 2.00016 5.33341C1.63197 5.33341 1.3335 5.63189 1.3335 6.00008C1.3335 6.36827 1.63197 6.66675 2.00016 6.66675Z'
        }, {
            d: 'M2.00016 2.00008C2.36835 2.00008 2.66683 1.7016 2.66683 1.33341C2.66683 0.965225 2.36835 0.666748 2.00016 0.666748C1.63197 0.666748 1.3335 0.965225 1.3335 1.33341C1.3335 1.7016 1.63197 2.00008 2.00016 2.00008Z'
        }, {
            d: 'M2.00016 11.3334C2.36835 11.3334 2.66683 11.0349 2.66683 10.6667C2.66683 10.2986 2.36835 10.0001 2.00016 10.0001C1.63197 10.0001 1.3335 10.2986 1.3335 10.6667C1.3335 11.0349 1.63197 11.3334 2.00016 11.3334Z'
        }]
    },
    checkmark: {
        width: 12,
        height: 12,
        children: [{
            d: 'M 11.3332 1.33333 L 3.99984 11.11111 L 0.6665 6.66667'
        }]
    },
    arrowUpDown: {
        width: 12,
        height: 12,
        children: [{
            d: 'M 3.14286 0.66675 V 11.3334 M 3.14286 11.3334 L 0.85714 8.66675 M 3.14286 11.3334 L 5.42857 8.66675 M 8.85711 11.3334 V 0.66675 M 8.85711 0.66675 L 6.57143 3.33341 M 8.85711 0.66675 L 11.14286 3.33341'
        }]
    },
    arrowUp: {
        width: 12,
        height: 12,
        children: [{
            d: 'M 3.14286 0.66675 V 11.3334 M 3.14286 11.3334 L 0.85714 8.66675 M 3.14286 11.3334 L 5.42857 8.66675',
            opacity: 0.2
        }, {
            d: 'M 8.85711 11.3334 V 0.6667 M 8.85711 0.6667 L 6.57146 3.3334 M 8.85711 0.6667 L 11.14286 3.3334'
        }]
    },
    arrowDown: {
        width: 12,
        height: 12,
        children: [{
            d: 'M 3.14286 0.66675 V 11.3334 M 3.14286 11.3334 L 0.85714 8.66675 M 3.14286 11.3334 L 5.42857 8.66675'
        }, {
            d: 'M 8.85711 11.3334 V 0.6667 M 8.85711 0.6667 L 6.57146 3.3334 M 8.85711 0.6667 L 11.14286 3.3334',
            opacity: 0.2
        }]
    },
    doubleChevronLeft: {
        width: 12,
        height: 12,
        children: [{
            d: 'M 6 10.8 L 1.2 6 L 6 1.2 M 10.8 10.8 L 6 6 L 10.8 1.2',
            'stroke-width': 1.34
        }]
    },
    chevronLeft: {
        width: 12,
        height: 12,
        children: [{
            d: 'M 7.5 10.8 L 1.5 6 L 7.5 1.2',
            'stroke-width': 1.34
        }]
    },
    doubleChevronRight: {
        width: 12,
        height: 12,
        children: [{
            d: 'M 6 1.2 L 10.8 6 L 6 10.8 M 1.2 1.2 L 6 6 L 1.2 10.8',
            'stroke-width': 1.34
        }]
    },
    chevronRight: {
        width: 12,
        height: 12,
        children: [{
            d: 'M 4.5 1.2 L 10.5 6 L 4.5 10.8',
            'stroke-width': 1.34
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


/* *
*
*  Functions
*
* */

/**
 * Creates an SVG icon element from the SvgIcons registry.
 *
 * @param name
 * The name of the icon from SvgIcons registry
 *
 * @param className
 * CSS class name for the SVG element (default: 'hcg-icon')
 *
 * @returns
 * SVG element with the specified icon
 */
export function createGridIcon(
    name: GridIconName,
    className: string = Globals.getClassName('icon')
): SVGElement {
    const createElement = (type: string): SVGElement =>
        document.createElementNS('http://www.w3.org/2000/svg', type);
    const {
        width = 16, height = 16, viewBox, fill, children
    } = icons[name];

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


/* *
 *
 *  Default Export
 *
 * */

export default {
    createGridIcon,
    icons,
    pathDefaults
} as const;
