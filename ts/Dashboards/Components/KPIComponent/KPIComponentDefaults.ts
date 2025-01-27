/* *
 *
 *  (c) 2009-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */


import type Globals from '../../Globals';
import type Options from './KPIComponentOptions';

import Component from '../Component.js';


/* *
 *
 *  Constants
 *
 * */

const KPIComponentDefaults: Globals.DeepPartial<Options> = {
    type: 'KPI',
    className: [
        Component.defaultOptions.className,
        `${Component.defaultOptions.className}-kpi`
    ].join(' '),
    minFontSize: 20,
    thresholdColors: ['#f45b5b', '#90ed7d'],
    editableOptions: [
        {
            name: 'connectorName',
            propertyPath: ['connector', 'id'],
            type: 'select'
        },
        ...Component.defaultOptions.editableOptions || [],
        {
            name: 'Value',
            type: 'input',
            propertyPath: ['value']
        }, {
            name: 'Column name',
            type: 'input',
            propertyPath: ['columnName']
        }, {
            name: 'Value format',
            type: 'input',
            propertyPath: ['valueFormat']
        }
    ],
    linkedValueTo: {
        enabled: true,
        seriesIndex: 0,
        pointIndex: 0
    }
};

/* *
 *
 *  Default Export
 *
 * */

export default KPIComponentDefaults;
