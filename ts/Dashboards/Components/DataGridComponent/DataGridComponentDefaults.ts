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
    dataGridClassName: 'dataGrid-container',
    dataGridID: 'dataGrid-' + uniqueKey(),
    dataGridOptions: {},
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
            name: 'DataGrid options',
            type: 'nested',
            nestedOptions: [{
                name: 'General',
                options: [
                    {
                        name: 'caption',
                        propertyPath: ['caption'],
                        type: 'input'
                    }, {
                        name: 'Grid caption',
                        propertyPath:
                            ['dataGridOptions', 'settings', 'caption', 'text'],
                        type: 'input'
                    }, {
                        name: 'Editable table',
                        propertyPath:
                            [
                                'dataGridOptions',
                                'defaults',
                                'columns',
                                'editable'
                            ],
                        type: 'toggle'
                    }, {
                        name: 'Resizable columns',
                        propertyPath:
                            [
                                'dataGridOptions',
                                'settings',
                                'columns',
                                'resizable'
                            ],
                        type: 'toggle'
                    }, {
                        name: 'Sortable columns',
                        propertyPath:
                            [
                                'dataGridOptions',
                                'defaults',
                                'columns',
                                'sorting',
                                'sortable'
                            ],
                        type: 'toggle'
                    }, {
                        name: 'Columns distribution',
                        propertyPath:
                            [
                                'dataGridOptions',
                                'settings',
                                'columns',
                                'distribution'
                            ],
                        type: 'select',
                        selectOptions: [{
                            name: 'full'
                        }, {
                            name: 'fixed'
                        }]
                    }, {
                        name: 'Text truncation',
                        propertyPath:
                            [
                                'dataGridOptions',
                                'settings',
                                'rows',
                                'strictHeights'
                            ],
                        type: 'toggle'
                    }
                ]
            }]
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
