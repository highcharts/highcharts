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
    'filter' | 'menu' | 'chevronRight' | 'checkmark' | 'upDownArrows' |
    'sortAsc' | 'sortDesc'
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
