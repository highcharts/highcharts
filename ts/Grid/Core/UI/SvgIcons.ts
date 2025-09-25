/* *
 *
 *  Grid Svg Icons Registry
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Mikkel Espolin Birkeland
 *
 * */

'use strict';


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
 * Registry of all Grid Svg icons with their SVG path data.
 * Icons are designed for a 24x24 viewBox and use stroke-based rendering.
 */

namespace SvgIcons {
    export const icons = {
        filter: 'M2.2571 3.77791C1.75287 3.21437 1.50076 2.93259 1.49125 ' +
            '2.69312C1.48299 2.48509 1.57238 2.28515 1.73292 2.15259C1.91773 ' +
            '2  2.29583 2 3.05202 2H12.9473C13.7035 2 14.0816 2 14.2664 ' +
            '2.15259C14.427 2.28515 14.5163 2.48509 14.5081 2.69312C14.4986 ' +
            '2.93259 14.2465 3.21437 13.7422 3.77791L9.93808 8.02962C9.83756 ' +
            '8.14196 9.78731 8.19813 9.75147 8.26205C9.71969 8.31875 9.69637 ' +
            '8.37978 9.68225 8.44323C9.66633 8.51476 9.66633 8.59013 9.66633 ' +
            '8.74087V12.3056C9.66633 12.436 9.66633 12.5011 9.64531 ' +
            '12.5575C9.62673 12.6073 9.59651 12.6519 9.55717 12.6877C9.51265 ' +
            '12.7281 9.45213 12.7524 9.33108 12.8008L7.06441 13.7074C6.81938 ' +
            '13.8054 6.69687 13.8545 6.59852 13.834C6.51251 13.8161 6.43704 ' +
            '13.765 6.3885 13.6918C6.333 13.6081 6.333 13.4762 6.333 ' +
            '13.2122V8.74087C6.333 8.59013 6.333 8.51476 6.31708 ' +
            '8.44323C6.30296 8.37978 6.27964 8.31875 6.24786 8.26205C6.21203 ' +
            '8.19813 6.16177 8.14196 6.06126 8.02962L2.2571 3.77791Z',

        menu: 'M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 ' +
            '11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 ' +
            '13ZM12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 ' +
            '4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 ' +
            '6ZM12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 ' +
            '18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z',

        chevronUp: 'M18 15L12 9L6 15',

        chevronDown: 'M6 9L12 15L18 9',

        chevronRight: 'M9 18L15 12L9 6',

        chevronSelector: 'M7 15L12 20L17 15M7 9L12 4L17 9'

    } as const;


    /* *
    *
    *  Types
    *
    * */

    /**
     * Type-safe icon names from the SvgIcons registry.
     */
    export type GridIconName = keyof typeof icons;


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
     * @param size
     * The size of the icon in pixels (default: 16)
     *
     * @param className
     * CSS class name for the SVG element (default: 'hcg-icon')
     *
     * @returns
     * SVG element with the specified icon
     */
    export function createGridIcon(
        name: GridIconName,
        size: number = 16,
        className: string = Globals.getClassName('icon')
    ): SVGElement {
        const svg =
            document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', size.toString());
        svg.setAttribute('height', size.toString());
        // Adjust viewBox based on icon type to better fill the space
        if (name === 'filter') {
            // Filter icon uses roughly 1.5 to 14.5 range, center it in viewBox
            svg.setAttribute('viewBox', '-2 -2 20 20');
        } else {
            svg.setAttribute('viewBox', '0 0 24 24');
        }

        svg.setAttribute('fill', 'none');
        svg.setAttribute('class', className);

        // Handle icons with multiple paths (like menu icon)
        const pathData = icons[name];
        if (name === 'menu') {
            // Menu icon has multiple circles, create separate paths
            const circles = [
                'M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 ' +
                '11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z',
                'M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 ' +
                '4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z',
                'M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 ' +
                '18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z'
            ];

            circles.forEach((circleData): void => {
                const path = document.createElementNS(
                    'http://www.w3.org/2000/svg',
                    'path'
                );
                path.setAttribute('d', circleData);
                path.setAttribute('stroke', 'currentColor');
                path.setAttribute('stroke-width', '2');
                path.setAttribute('stroke-linecap', 'round');
                path.setAttribute('stroke-linejoin', 'round');
                svg.appendChild(path);
            });
        } else {
            // Single path icons
            const path = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'path'
            );
            path.setAttribute('d', pathData);
            path.setAttribute('stroke', 'currentColor');
            path.setAttribute('stroke-width', name === 'filter' ? '1.33' : '2');
            path.setAttribute('stroke-linecap', 'round');
            path.setAttribute('stroke-linejoin', 'round');
            svg.appendChild(path);
        }

        return svg;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default SvgIcons;
