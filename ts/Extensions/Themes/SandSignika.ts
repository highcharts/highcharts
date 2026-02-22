/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *  Sand-Signika theme for Highcharts JS
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
import H from '../../Core/Globals.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    createElement
} = U;

/* *
 *
 *  Theme
 *
 * */

namespace SandSignikaTheme {

    /* *
     *
     *  Constants
     *
     * */

    export const options: DeepPartial<DefaultOptions> = {
        palette: {
            light: {
                backgroundColor: '#f7f7f7',
                colors: [
                    '#f45b5b', '#8085e9', '#8d4654', '#7798BF',
                    '#aaeeee', '#ff0066', '#eeaaee', '#55BF3B',
                    '#DF5353', '#7798BF', '#aaeeee'
                ]
            }
        },
        chart: {
            backgroundColor: 'light-dark(transparent, #141414)',
            style: {
                fontFamily: 'Signika, serif'
            }
        },
        title: {
            style: {
                color: 'var(--highcharts-neutral-color-100)',
                fontSize: '16px',
                fontWeight: 'bold'
            }
        },
        subtitle: {
            style: {
                color: 'var(--highcharts-neutral-color-100)'
            }
        },
        tooltip: {
            borderWidth: 0,
            // Inverted tooltip colors
            backgroundColor: 'var(--highcharts-neutral-color-80)',
            style: {
                color: 'var(--highcharts-background-color)'
            }
        },
        legend: {
            backgroundColor: 'var(--highcharts-neutral-color-10)',
            itemStyle: {
                fontWeight: 'bold',
                fontSize: '13px'
            }
        },
        xAxis: {
            labels: {
                style: {
                    color: 'var(--highcharts-neutral-color-60)'
                }
            }
        },
        yAxis: {
            labels: {
                style: {
                    color: 'var(--highcharts-neutral-color-60)'
                }
            }
        },
        plotOptions: {
            series: {
                shadow: true,
                dataLabels: {
                    color: 'light-dark(#000, #fff)',
                    style: {
                        textOutline: 'none'
                    }
                }
            },
            map: {
                shadow: false
            }
        },

        // Highcharts Stock specific
        global: {
            buttonTheme: {
                fill: 'light-dark(#fff, #000)',
                stroke: 'var(--highcharts-neutral-color-20)',
                states: {
                    select: {
                        fill: 'var(--highcharts-neutral-color-10)'
                    }
                }
            }
        },

        rangeSelector: {
            buttonTheme: {
                'stroke-width': 1
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
            href: 'https://fonts.googleapis.com/css?family=Signika:400,700',
            rel: 'stylesheet',
            type: 'text/css'
        }, null as any, document.getElementsByTagName('head')[0]);

        // Add the background image to the container
        addEvent((H as any).Chart, 'afterGetContainer', function (): void {
            // eslint-disable-next-line no-invalid-this
            this.container.style.background =
                'url(https://www.highcharts.com/samples/graphics/sand.png)';
        });

        // Apply the theme
        setOptions(options);
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default SandSignikaTheme;
