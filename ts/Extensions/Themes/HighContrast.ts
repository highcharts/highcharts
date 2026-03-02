/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Øystein Moseng, Torstein Hønsi
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
        palette: {
            light: {
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
                ]
            },
            dark: {
                colors: [
                    '#67B9EE',
                    '#CEEDA5',
                    '#9F6AE1',
                    '#FEA26E',
                    '#6BA48F',
                    '#EA3535',
                    '#8D96B7',
                    '#ECCA15',
                    '#20AA09',
                    '#E0C3E4'
                ]
            }
        },
        credits: {
            style: {
                color: 'light-dark(#767676, #F0F0F3)'
            }
        },
        navigator: {
            series: {
                color: 'light-dark(#5f98cf, #7798BF)',
                lineColor: 'light-dark(#5f98cf, #A6C7ED)'
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
