/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *  Grid-light theme for Highcharts JS
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

namespace GridLightTheme {

    /* *
     *
     *  Constants
     *
     * */

    export const options: DeepPartial<DefaultOptions> = {
        palette: {
            colorScheme: 'light',
            light: {
                neutralColor: '#111100',
                colors: [
                    '#7cb5ec', '#f7a35c', '#90ee7e', '#7798BF',
                    '#aaeeee', '#ff0066', '#eeaaee', '#55BF3B',
                    '#DF5353', '#7798BF', '#aaeeee'
                ]
            }

        },
        chart: {
            style: {
                fontFamily: 'Dosis, sans-serif'
            }
        },
        title: {
            style: {
                fontSize: '16px',
                fontWeight: 'bold',
                textTransform: 'uppercase'
            }
        },
        tooltip: {
            borderWidth: 0,
            shadow: false,
            // Inverted colors
            backgroundColor: 'var(--highcharts-neutral-color-80)',
            style: {
                color: 'var(--highcharts-background-color)'
            }
        },
        legend: {
            backgroundColor: 'var(--highcharts-neutral-color-5)',
            itemStyle: {
                fontWeight: 'bold',
                fontSize: '13px'
            }
        },
        xAxis: {
            gridLineWidth: 1,
            labels: {
                style: {
                    fontSize: '12px'
                }
            }
        },
        yAxis: {
            minorTickInterval: 'auto',
            title: {
                style: {
                    textTransform: 'uppercase'
                }
            },
            labels: {
                style: {
                    fontSize: '12px'
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
            href: 'https://fonts.googleapis.com/css?family=Dosis:400,600',
            rel: 'stylesheet',
            type: 'text/css'
        }, null as any, document.getElementsByTagName('head')[0]);

        // Apply the theme
        setOptions(options);
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default GridLightTheme;
