/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *  Dark theme for Highcharts JS
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { DeepPartial } from '../../Shared/Types';
import type { DefaultOptions } from '../../Core/Options';

import D from '../../Core/Defaults.js';
const { setOptions } = D;
import U from '../../Core/Utilities.js';
const { createElement } = U;

/* *
 *
 *  Theme
 *
 * */

namespace DarkUnicaTheme {

    /* *
     *
     *  Constants
     *
     * */

    export const options: DeepPartial<DefaultOptions> = {
        palette: {
            colorScheme: 'dark',
            dark: {
                backgroundColor: '#3e3e40',
                neutralColor: '#f0f0f3',
                highlightColor: '#75fffd',
                colors: [
                    '#2b908f', '#90ee7e', '#f45b5b', '#7798BF',
                    '#aaeeee', '#ff0066', '#eeaaee', '#55BF3B',
                    '#DF5353', '#7798BF', '#aaeeee'
                ]
            }
        },
        chart: {
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                stops: [
                    [0, '#2a2a2b'],
                    [1, '#3e3e40']
                ]
            },
            style: {
                fontFamily: '\'Unica One\', sans-serif'
            }
        },
        title: {
            style: {
                textTransform: 'uppercase',
                fontSize: '20px'
            }
        },
        subtitle: {
            style: {
                textTransform: 'uppercase'
            }
        },

        plotOptions: {
            series: {
                dataLabels: {
                    style: {
                        fontSize: '13px'
                    }
                }
            }
        },

        legend: {
            backgroundColor: '#00000388'
        },

        global: {
            buttonTheme: {
                states: {
                    hover: {
                        fill: '#707073'
                    },
                    select: {
                        fill: '#000003'
                    }
                }
            }
        }
    };

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Apply the theme.
     */
    export function apply(): void {
        // Load the fonts
        createElement('link', {
            href: 'https://fonts.googleapis.com/css?family=Unica+One',
            rel: 'stylesheet',
            type: 'text/css'
        }, void 0, document.getElementsByTagName('head')[0]);

        // Apply the theme
        setOptions(options);
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default DarkUnicaTheme;
