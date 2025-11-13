/* *
 *
 *  Grid Caption Update Config
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
import GridUtils from '../GridUtils.js';
import Globals from '../Globals.js';

const { setHTMLContent } = GridUtils;

/* *
 *
 *  Constants
 *
 * */

/**
 * Caption update configuration.
 */
export const CaptionUpdateConfig: UpdateConfig = {

    'text': {
        scope: UpdateScope.DOM_ELEMENT,
        options: ['text'],
        handler: function (_module, newVal): void {
            if (this.captionElement) {
                setHTMLContent(this.captionElement, newVal || '');
            }
        }
    },

    'className': {
        scope: UpdateScope.DOM_ATTR,
        options: ['className'],
        handler: function (_module, newVal): void {
            if (this.captionElement) {
                this.captionElement.className =
                    Globals.getClassName('captionElement') +
                    (newVal ? ' ' + newVal : '');
            }
        }
    }
};

/* *
 *
 *  Default Export
 *
 * */

export default CaptionUpdateConfig;
