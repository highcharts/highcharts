/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Mateusz Bernacik
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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
import type { Options } from '../../Core/Options';

import { merge } from '../../Shared/Utilities.js';

/* *
 *
 *  Constants
 *
 * */

/** @internal */
const standaloneNavigatorDefaults: DeepPartial<Options> = {
    exporting: {
        enabled: false
    },
    legend: {
        enabled: false
    },
    navigator: {
        enabled: true,
        margin: 0,
        top: 1
    },
    plotOptions: {
        series: {
            states: {
                hover: {
                    enabled: false
                }
            },
            marker: {
                enabled: false
            }
        }
    },
    scrollbar: {
        enabled: true
    },
    title: {
        text: ''
    },
    tooltip: {
        enabled: false
    },
    xAxis: {
        visible: false
    },
    yAxis: {
        height: 0,
        visible: false
    }
};

/* *
 *
 *  Functions
 *
 * */

function getChartDefaults(
    inverted?: boolean,
    chartWidth: number = 70
): DeepPartial<Options> {
    return merge(
        {
            chart: inverted ? {
                width: 70,
                height: void 0,
                margin: [15, 0, 25, 0]
            } : {
                width: void 0,
                height: 70,
                margin: [0, 5, 0, 5]
            }
        },
        {
            navigator: {
                xAxis: {
                    labels: {
                        style: {
                            width: inverted ?
                                (chartWidth - 30) + 'px' :
                                void 0
                        }
                    }
                }
            }
        }
    );
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export { getChartDefaults };

/** @internal */
export default standaloneNavigatorDefaults;
