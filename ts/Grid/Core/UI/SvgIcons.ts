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
    'doubleChevronRight'
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
