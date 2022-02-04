/* *
 *
 *  (c) 2010-2021 Highsoft AS
 *
 *  Author: Øystein Moseng
 *
 *  License: www.highcharts.com/license
 *
 *  Accessible high-contrast theme for Highcharts. Specifically tailored
 *  towards 3:1 contrast against white/off-white backgrounds. Neighboring
 *  colors are tested for color blindness.
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

import D from '../../Core/DefaultOptions.js';
const { setOptions } = D;
import H from '../../Core/Globals.js';

/* *
 *
 *  Theme
 *
 * */

namespace HighContrastLightTheme {

    /* *
     *
     *  Constants
     *
     * */

    export const options: DeepPartial<Options> = {
        colors: [
            '#4F71D3',
            '#2A667A',
            '#A049F0',
            '#CC2715',
            '#0181a1',
            '#6226C9',
            '#C35F0C',
            '#2F2B38'
        ],
        navigator: {
            series: {
                color: '#5f98cf',
                lineColor: '#5f98cf'
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

export default HighContrastLightTheme;
