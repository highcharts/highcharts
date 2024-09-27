/* *
 *
 *  (c) 2009-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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


import type Globals from '../../Globals';
import type Options from './HTMLComponentOptions';

import Component from '../Component.js';

/* *
 *
 *  Constants
 *
 * */

const HTMLComponentDefaults: Globals.DeepPartial<Options> = {
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
