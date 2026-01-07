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

import type Component from '../Component';
import type { Options } from './GridComponentOptions';
import type { DeepPartial } from '../../../Shared/Types';

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

const GridComponentDefaults: DeepPartial<Options> = {
    gridClassName: 'highcharts-grid-container',
    gridID: 'grid-' + uniqueKey(),
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
                        name: 'Columns resizing mode',
                        propertyPath:
                            [
                                'gridOptions',
                                'rendering',
                                'columns',
                                'resizing',
                                'mode'
                            ],
                        type: 'select',
                        selectOptions: [{
                            name: 'adjacent'
                        }, {
                            name: 'distributed'
                        }, {
                            name: 'independent'
                        }]
                    }, {
                        name: 'Editable Grid',
                        propertyPath:
                            [
                                'gridOptions',
                                'columnDefaults',
                                'cells',
                                'editMode',
                                'enabled'
                            ],
                        type: 'toggle'
                    }, {
                        name: 'Resizable columns',
                        propertyPath:
                            [
                                'gridOptions',
                                'rendering',
                                'columns',
                                'resizing',
                                'enabled'
                            ],
                        type: 'toggle'
                    }, {
                        name: 'Sortable columns',
                        propertyPath:
                            [
                                'gridOptions',
                                'columnDefaults',
                                'sorting',
                                'enabled'
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
                .closest('.hcg-row');
            const cell = inputElement.closest('.hcg-cell');

            if (
                parentRow &&
                parentRow instanceof HTMLElement &&
                cell &&
                cell instanceof HTMLElement
            ) {
                const dataTableRowIndex = parentRow.dataset.rowIndex;
                const { columnId } = cell.dataset;

                if (
                    dataTableRowIndex !== void 0 &&
                    columnId !== void 0
                ) {
                    const table = connector.getTable();

                    if (table) {
                        const converter = new DataConverter();

                        let valueToSet = converter
                            .convertByType(inputElement.value);

                        if (valueToSet instanceof Date) {
                            valueToSet = valueToSet.toString();
                        }

                        table.setCell(
                            columnId,
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

export default GridComponentDefaults;
