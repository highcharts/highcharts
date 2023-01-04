/* *
 *
 *  (c) 2010-2021 Highsoft AS
 *
 *  Author: Øystein Moseng
 *
 *  License: www.highcharts.com/license
 *
 *  Accessible high-contrast theme for Highcharts. Considers colorblindness and
 *  monochrome rendering.
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Options from '../../Core/Options';
import type { SeriesTypePlotOptions } from '../../Core/Series/SeriesType';

import D from '../../Core/Defaults.js';
const { setOptions } = D;

/* *
 *
 *  Theme
 *
 * */

namespace AvocadoTheme {

    /* *
     *
     *  Constants
     *
     * */

    export const options: DeepPartial<Options> = {
        colors: ['#F3E796', '#95C471', '#35729E', '#251735'],

        colorAxis: {
            maxColor: '#05426E',
            minColor: '#F3E796'
        },

        plotOptions: {
            map: {
                nullColor: '#FCFEFE'
            }
        } as SeriesTypePlotOptions,

        navigator: {
            maskFill: 'rgba(170, 205, 170, 0.5)',
            series: {
                color: '#95C471',
                lineColor: '#35729E'
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
        setOptions(options);
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default AvocadoTheme;
