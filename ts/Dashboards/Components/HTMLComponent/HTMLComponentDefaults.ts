/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Authors:
 *  - Karol Kołodziej
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */


import type { DeepPartial } from '../../../Shared/Types';
import type Options from './HTMLComponentOptions';

import Component from '../Component.js';

/* *
 *
 *  Constants
 *
 * */

const HTMLComponentDefaults: DeepPartial<Options> = {
    type: 'HTML',
    className: [
        Component.defaultOptions.className,
        `${Component.defaultOptions.className}-html`
    ].join(' '),
    elements: [],
    editableOptions: [
        ...Component.defaultOptions.editableOptions || [],
        {
            name: 'htmlInput',
            propertyPath: ['html'],
            type: 'textarea'
        }
    ]
};

/* *
 *
 *  Default Export
 *
 * */

export default HTMLComponentDefaults;
