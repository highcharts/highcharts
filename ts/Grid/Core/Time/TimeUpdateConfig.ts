/* *
 *
 *  Grid Time Update Config
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sebastian Bochan
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { UpdateConfig } from '../Update/UpdateScope';
import { UpdateScope } from '../Update/UpdateScope.js';

/* *
 *
 *  Constants
 *
 * */

/**
 * Time update configuration.
 */
export const TimeUpdateConfig: UpdateConfig = {

    'timezone': {
        scope: UpdateScope.REFLOW,
        options: ['timezone'],
        handler: function (_module, newVal): void {
            if (this.time) {
                this.time.update({
                    ...this.options?.time,
                    timezone: newVal
                });
            }
        }
    }
};

/* *
 *
 *  Default Export
 *
 * */

export default TimeUpdateConfig;
