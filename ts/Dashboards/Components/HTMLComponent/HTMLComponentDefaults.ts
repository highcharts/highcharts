/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Karol Kolodziej
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
