/* *
 *
 *  Grid Rendering Update Config
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
import Globals from '../Globals.js';

/* *
 *
 *  Constants
 *
 * */

/**
 * Rendering update configuration.
 */
export const RenderingUpdateConfig: UpdateConfig = {

    'theme': {
        scope: UpdateScope.DOM_ATTR,
        options: ['theme'],
        handler: function (_module, newVal): void {
            if (this.contentWrapper) {
                this.contentWrapper.className =
                    Globals.getClassName('container') +
                    (newVal ? ' ' + newVal : '');
            }
        }
    },

    'tableClassName': {
        scope: UpdateScope.DOM_ATTR,
        options: ['table.className'],
        handler: function (_module, newVal): void {
            if (this.tableElement) {
                this.tableElement.className =
                    Globals.getClassName('tableElement') +
                    (newVal ? ' ' + newVal : '');
            }
        }
    },

    // ResizingEnabled removed - will use VIEWPORT_RENDER (structural change)

    'reflow_rows': {
        scope: UpdateScope.REFLOW,
        options: [
            'rows.minVisibleRows',
            'rows.strictHeights',
            'rows.virtualization',
            'rows.virtualizationThreshold',
            'columns.resizing.mode'
        ]
    },

    'rows_update': {
        scope: UpdateScope.ROWS_UPDATE,
        options: ['rows.bufferSize']
    },

    'viewport_render': {
        scope: UpdateScope.VIEWPORT_RENDER,
        options: ['header.enabled', 'columns.included']
    }
};

/* *
 *
 *  Default Export
 *
 * */

export default RenderingUpdateConfig;
