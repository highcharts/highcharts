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
            name: 'caption',
            propertyPath: ['caption'],
            type: 'input'
        }, {
            name: 'DataGrid options',
            type: 'nested',
            nestedOptions: [{
                name: 'General',
                options: [
                    {
                        name: 'Caption/title',
                        propertyPath: ['dataGridOptions', 'caption', 'text'],
                        type: 'input'
                    }, {
                        name: 'Columns distribution',
                        propertyPath:
                            [
                                'dataGridOptions',
                                'rendering',
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
                        name: 'Editable DataGrid',
                        propertyPath:
                            [
                                'dataGridOptions',
                                'columnDefaults',
                                'cells',
                                'editable'
                            ],
                        type: 'toggle'
                    }, {
                        name: 'Resizable columns',
                        propertyPath:
                            [
                                'dataGridOptions',
                                'columnDefaults',
                                'resizing'
                            ],
                        type: 'toggle'
                    }, {
                        name: 'Sortable columns',
                        propertyPath:
                            [
                                'dataGridOptions',
                                'columnDefaults',
                                'sorting',
                                'sortable'
                            ],
                        type: 'toggle'
                    }, {
                        name: 'Cell text truncation',
                        propertyPath:
                            [
                                'dataGridOptions',
                                'rendering',
                                'rows',
                                'strictHeights'
                            ],
                        type: 'toggle'
                    }
                ]
            }]
        }, {
            name: 'DataGrid class name',
            propertyPath: ['dataGridClassName'],
            type: 'input'
        }, {
            name: 'DataGrid ID',
            propertyPath: ['dataGridID'],
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
