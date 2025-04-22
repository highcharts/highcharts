/* *
 *
 *  (c) 2009-2025 Highsoft AS
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

import type Component from '../Component';
import type Globals from '../../Globals';
import type Options from './DataGridComponentOptions';

import DataConverter from '../../../Data/Converters/DataConverter.js';
import U from '../../../Core/Utilities.js';
const {
    uniqueKey
} = U;

/* *
 *
 *  Constants
 *
 * */

const DataGridComponentDefaults: Globals.DeepPartial<Options> = {
    gridClassName: 'dataGrid-container',
    gridID: 'dataGrid-' + uniqueKey(),
    gridOptions: {},
    editableOptions: [
        {
            name: 'connectorName',
            propertyPath: ['connector', 'id'],
            type: 'select'
        }, {
            name: 'title',
            propertyPath: ['title'],
            type: 'input'
        }, {
            name: 'caption',
            propertyPath: ['caption'],
            type: 'input'
        }, {
            name: 'Grid options',
            type: 'nested',
            nestedOptions: [{
                name: 'General',
                options: [
                    {
                        name: 'Caption/title',
                        propertyPath: ['gridOptions', 'caption', 'text'],
                        type: 'input'
                    }, {
                        name: 'Columns distribution',
                        propertyPath:
                            [
                                'gridOptions',
                                'rendering',
                                'columns',
                                'distribution'
                            ],
                        type: 'select',
                        selectOptions: [{
                            name: ''
                        }, {
                            name: 'full'
                        }, {
                            name: 'fixed'
                        }, {
                            name: 'mixed'
                        }]
                    }, {
                        name: 'Editable Grid',
                        propertyPath:
                            [
                                'gridOptions',
                                'columnDefaults',
                                'cells',
                                'editable'
                            ],
                        type: 'toggle'
                    }, {
                        name: 'Resizable columns',
                        propertyPath:
                            [
                                'gridOptions',
                                'columnDefaults',
                                'resizing'
                            ],
                        type: 'toggle'
                    }, {
                        name: 'Sortable columns',
                        propertyPath:
                            [
                                'gridOptions',
                                'columnDefaults',
                                'sorting',
                                'sortable'
                            ],
                        type: 'toggle'
                    }, {
                        name: 'Cell text truncation',
                        propertyPath:
                            [
                                'gridOptions',
                                'rendering',
                                'rows',
                                'strictHeights'
                            ],
                        type: 'toggle'
                    }
                ]
            }]
        }, {
            name: 'Grid class name',
            propertyPath: ['gridClassName'],
            type: 'input'
        }, {
            name: 'Grid ID',
            propertyPath: ['gridID'],
            type: 'input'
        }
    ],
    onUpdate: (e: KeyboardEvent, connector: Component.ConnectorTypes): void => {
        const inputElement = e.target as HTMLInputElement;
        if (inputElement) {
            const parentRow = inputElement
                .closest('.highcharts-datagrid-row');
            const cell = inputElement.closest('.highcharts-datagrid-cell');

            if (
                parentRow &&
                parentRow instanceof HTMLElement &&
                cell &&
                cell instanceof HTMLElement
            ) {
                const dataTableRowIndex = parentRow.dataset.rowIndex;
                const { columnName } = cell.dataset;

                if (
                    dataTableRowIndex !== void 0 &&
                    columnName !== void 0
                ) {
                    const table = connector.table;

                    if (table) {
                        const converter = new DataConverter();

                        let valueToSet = converter
                            .asGuessedType(inputElement.value);

                        if (valueToSet instanceof Date) {
                            valueToSet = valueToSet.toString();
                        }

                        table.setCell(
                            columnName,
                            Number(dataTableRowIndex),
                            valueToSet
                        );
                    }
                }
            }
        }
    }
};

/* *
 *
 *  Default Export
 *
 * */

export default DataGridComponentDefaults;
