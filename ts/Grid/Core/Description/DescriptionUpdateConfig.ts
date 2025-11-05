/* *
 *
 *  Grid Description Update Config
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
 * Description update configuration.
 */
export const DescriptionUpdateConfig: UpdateConfig = {

    'text': {
        scope: UpdateScope.DOM_ELEMENT,
        options: ['text'],
        handler: function (_module, newVal): void {
            if (this.descriptionElement) {
                setHTMLContent(this.descriptionElement, newVal || '');
            }
        }
    },

    'className': {
        scope: UpdateScope.DOM_ATTR,
        options: ['className'],
        handler: function (_module, newVal): void {
            if (this.descriptionElement) {
                this.descriptionElement.className =
                    Globals.getClassName('descriptionElement') +
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

export default DescriptionUpdateConfig;
