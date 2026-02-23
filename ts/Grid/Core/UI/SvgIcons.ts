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
 * - `filter`, `menu`, `checkmark`
 * - `arrowUpDown`, `arrowUp`, `arrowDown`
 * - `chevronLeft`, `chevronRight`, `doubleChevronLeft`, `doubleChevronRight`
 * - `copy`, `clipboard`, `plus`, `trash`
 * - `addRowAbove`, `addRowBelow`, `addColumnLeft`, `addColumnRight`
 */
export type GridIconName = (
    'filter' | 'menu' | 'checkmark' | 'arrowUpDown' | 'arrowUp' |
    'arrowDown' | 'chevronLeft' | 'chevronRight' | 'doubleChevronLeft' |
    'doubleChevronRight' | 'copy' | 'clipboard' | 'plus' | 'trash' |
    'addRowAbove' | 'addRowBelow' | 'addColumnLeft' | 'addColumnRight' |
    'pin01' | 'pin02'
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
    },
    pin01: {
        width: 16,
        height: 16,
        viewBox: '0 0 24 24',
        children: [{
            d: 'M12.0004 15L12.0004 22M8.00043 7.30813V9.43875C8.00043 9.64677 8.00043 9.75078 7.98001 9.85026C7.9619 9.93852 7.93194 10.0239 7.89095 10.1042C7.84474 10.1946 7.77977 10.2758 7.64982 10.4383L6.08004 12.4005C5.4143 13.2327 5.08143 13.6487 5.08106 13.9989C5.08073 14.3035 5.21919 14.5916 5.4572 14.7815C5.73088 15 6.26373 15 7.32943 15H16.6714C17.7371 15 18.27 15 18.5437 14.7815C18.7817 14.5916 18.9201 14.3035 18.9198 13.9989C18.9194 13.6487 18.5866 13.2327 17.9208 12.4005L16.351 10.4383C16.2211 10.2758 16.1561 10.1946 16.1099 10.1042C16.0689 10.0239 16.039 9.93852 16.0208 9.85026C16.0004 9.75078 16.0004 9.64677 16.0004 9.43875V7.30813C16.0004 7.19301 16.0004 7.13544 16.0069 7.07868C16.0127 7.02825 16.0223 6.97833 16.0357 6.92937C16.0507 6.87424 16.0721 6.8208 16.1149 6.71391L17.1227 4.19423C17.4168 3.45914 17.5638 3.09159 17.5025 2.79655C17.4489 2.53853 17.2956 2.31211 17.0759 2.1665C16.8247 2 16.4289 2 15.6372 2H8.36368C7.57197 2 7.17611 2 6.92494 2.1665C6.70529 2.31211 6.55199 2.53853 6.49838 2.79655C6.43707 3.09159 6.58408 3.45914 6.87812 4.19423L7.88599 6.71391C7.92875 6.8208 7.95013 6.87424 7.96517 6.92937C7.97853 6.97833 7.98814 7.02825 7.99392 7.07868C8.00043 7.13544 8.00043 7.19301 8.00043 7.30813Z',
            'stroke-width': 2
        }]
    },
    pin02: {
        width: 16,
        height: 16,
        viewBox: '0 0 24 24',
        children: [{
            d: 'M8.3767 15.6163L2.71985 21.2732M11.6944 6.64181L10.1335 8.2027C10.0062 8.33003 9.94252 8.39369 9.86999 8.44427C9.80561 8.48917 9.73616 8.52634 9.66309 8.555C9.58077 8.58729 9.49249 8.60495 9.31592 8.64026L5.65145 9.37315C4.69915 9.56361 4.223 9.65884 4.00024 9.9099C3.80617 10.1286 3.71755 10.4213 3.75771 10.7109C3.8038 11.0434 4.14715 11.3867 4.83387 12.0735L11.9196 19.1592C12.6063 19.8459 12.9497 20.1893 13.2821 20.2354C13.5718 20.2755 13.8645 20.1869 14.0832 19.9928C14.3342 19.7701 14.4294 19.2939 14.6199 18.3416L15.3528 14.6771C15.3881 14.5006 15.4058 14.4123 15.4381 14.33C15.4667 14.2569 15.5039 14.1875 15.5488 14.1231C15.5994 14.0505 15.663 13.9869 15.7904 13.8596L17.3512 12.2987C17.4326 12.2173 17.4734 12.1766 17.5181 12.141C17.5578 12.1095 17.5999 12.081 17.644 12.0558C17.6936 12.0274 17.7465 12.0048 17.8523 11.9594L20.3467 10.8904C21.0744 10.5785 21.4383 10.4226 21.6035 10.1706C21.7481 9.95025 21.7998 9.68175 21.7474 9.42348C21.6875 9.12813 21.4076 8.84822 20.8478 8.28839L15.7047 3.14526C15.1448 2.58543 14.8649 2.30552 14.5696 2.24565C14.3113 2.19329 14.0428 2.245 13.8225 2.38953C13.5705 2.55481 13.4145 2.91866 13.1027 3.64636L12.0337 6.14071C11.9883 6.24653 11.9656 6.29944 11.9373 6.34905C11.9121 6.39313 11.8836 6.43522 11.852 6.47496C11.8165 6.51971 11.7758 6.56041 11.6944 6.64181Z',
            'stroke-width': 2
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
