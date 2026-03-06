/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Øystein Moseng
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *  Accessible high-contrast theme for Highcharts. Specifically tailored
 *  towards 3:1 contrast against white/off-white backgrounds. Neighboring
 *  colors are tested for color blindness.
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

    export const options: DeepPartial<DefaultOptions> = {
        colors: [
            '#265FB5',
            '#222',
            '#698F01',
            '#F4693E',
            '#4C0684',
            '#0FA388',
            '#B7104A',
            '#AF9023',
            '#1A704C',
            '#B02FDD'
        ],
        credits: {
            style: {
                color: '#767676'
            }
        },
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
