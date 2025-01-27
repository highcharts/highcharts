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
import type Options from './HighchartsComponentOptions';

import Component from '../Component.js';
import U from '../../../Core/Utilities.js';
const {
    merge,
    uniqueKey
} = U;


/* *
 *
 *  Constants
 *
 * */

const HighchartsComponentDefaults: Globals.DeepPartial<Options> = {
    allowConnectorUpdate: true,
    className: [
        Component.defaultOptions.className,
        `${Component.defaultOptions.className}-highcharts`
    ].join(' '),
    chartClassName: 'chart-container',
    chartID: 'chart-' + uniqueKey(),
    chartOptions: {
        series: []
    },
    chartConstructor: 'chart',
    editableOptions: [
        {
            name: 'connectorName',
            propertyPath: ['connector', 'id'],
            type: 'select'
        },
        ...Component.defaultOptions.editableOptions || [],
        {
            name: 'chartOptions',
            type: 'nested',
            nestedOptions: [{
                name: 'chart',
                options: [{
                    name: 'title',
                    propertyPath: ['chartOptions', 'title', 'text'],
                    type: 'input'
                }, {
                    name: 'subtitle',
                    propertyPath: ['chartOptions', 'subtitle', 'text'],
                    type: 'input'
                }, {
                    name: 'type',
                    propertyPath: ['chartOptions', 'chart', 'type'],
                    type: 'select',
                    selectOptions: [{
                        name: 'column',
                        iconURL: 'series-types/icon-column.svg'
                    }, {
                        name: 'line',
                        iconURL: 'series-types/icon-line.svg'
                    }, {
                        name: 'scatter',
                        iconURL: 'series-types/icon-scatter.svg'
                    }, {
                        name: 'pie',
                        iconURL: 'series-types/icon-pie.svg'
                    }]
                }]
            }, {
                name: 'xAxis',
                options: [{
                    name: 'title',
                    propertyPath:
                        ['chartOptions', 'xAxis', 'title', 'text'],
                    type: 'input'
                }, {
                    name: 'type',
                    propertyPath: ['chartOptions', 'xAxis', 'type'],
                    type: 'select',
                    selectOptions: [{
                        name: 'linear'
                    }, {
                        name: 'datetime'
                    }, {
                        name: 'logarithmic'
                    }]
                }]
            }, {
                name: 'yAxis',
                options: [{
                    name: 'title',
                    propertyPath:
                        ['chartOptions', 'yAxis', 'title', 'text'],
                    type: 'input'
                }, {
                    name: 'type',
                    propertyPath: ['chartOptions', 'yAxis', 'type'],
                    type: 'select',
                    selectOptions: [{
                        name: 'linear'
                    }, {
                        name: 'datetime'
                    }, {
                        name: 'logarithmic'
                    }]
                }]
            }, {
                name: 'legend',
                showToggle: true,
                propertyPath: ['chartOptions', 'legend', 'enabled'],
                options: [{
                    name: 'align',
                    propertyPath: ['chartOptions', 'legend', 'align'],
                    type: 'select',
                    selectOptions: [{
                        name: 'left'
                    }, {
                        name: 'center'
                    }, {
                        name: 'right'
                    }]
                }]
            }, {
                name: 'tooltip',
                showToggle: true,
                propertyPath: ['chartOptions', 'tooltip', 'enabled'],
                options: [{
                    name: 'split',
                    propertyPath: ['chartOptions', 'tooltip', 'split'],
                    type: 'toggle'
                }]
            }, {
                name: 'dataLabels',
                propertyPath: [
                    'chartOptions',
                    'plotOptions',
                    'series',
                    'dataLabels',
                    'enabled'
                ],
                showToggle: true,
                options: [{
                    name: 'align',
                    propertyPath: [
                        'chartOptions',
                        'plotOptions',
                        'series',
                        'dataLabels',
                        'align'
                    ],
                    type: 'select',
                    selectOptions: [{
                        name: 'left'
                    }, {
                        name: 'center'
                    }, {
                        name: 'right'
                    }]
                }]
            }, {
                name: 'credits',
                showToggle: true,
                propertyPath: ['chartOptions', 'credits', 'enabled'],
                options: [{
                    name: 'name',
                    propertyPath: [
                        'chartOptions',
                        'credits',
                        'text'
                    ],
                    type: 'input'
                }, {
                    name: 'url',
                    propertyPath: [
                        'chartOptions',
                        'credits',
                        'href'
                    ],
                    type: 'input'
                }]
            }]
        }, {
            name: 'chartConfig',
            propertyPath: ['chartOptions'],
            type: 'textarea'
        }, {
            name: 'chartClassName',
            propertyPath: ['chartClassName'],
            type: 'input'
        }, {
            name: 'chartID',
            propertyPath: ['chartID'],
            type: 'input'
        }
    ],
    editableOptionsBindings: merge(
        Component.defaultOptions.editableOptionsBindings,
        {
            skipRedraw: [
                'chartOptions',
                'chartConfig'
            ]
        }
    )
};


/* *
 *
 *  Default Export
 *
 * */


export default HighchartsComponentDefaults;
