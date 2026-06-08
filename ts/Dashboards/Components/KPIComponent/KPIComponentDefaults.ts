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
 *  - Sophie Bremer
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */


import type { DeepPartial } from '../../../Shared/Types';
import type Options from './KPIComponentOptions';

import Component from '../Component.js';


/* *
 *
 *  Constants
 *
 * */

const KPIComponentDefaults: DeepPartial<Options> = {
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
            propertyPath: ['columnId']
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
