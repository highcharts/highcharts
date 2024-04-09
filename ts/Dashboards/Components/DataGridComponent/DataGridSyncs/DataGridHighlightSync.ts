/* *
 *
 *  (c) 2009-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type Sync from '../../Sync/Sync';
import type DataGridComponent from '../DataGridComponent.js';
import type { DataGridHighlightSyncOptions } from '../DataGridComponentOptions';

import Component from '../../Component';
import DataCursor from '../../../../Data/DataCursor';
import U from '../../../../Core/Utilities.js';
const { addEvent, removeEvent } = U;


/* *
 *
 *  Constants
 *
 * */

const defaultOptions: Sync.OptionsEntry = {};

const syncPair: Sync.SyncPair = {
    emitter: function (this: Component): (() => void) | void {
        if (this.type !== 'DataGrid') {
            return;
        }
        const component = this as DataGridComponent;

        const { dataGrid, board } = component;
        const highlightOptions = this.sync.syncConfig.highlight;

        if (!board || !dataGrid || !highlightOptions?.enabled) {
            return;
        }

        const { dataCursor: cursor } = board;

        const onDataGridHover = (e: any): void => {
            const table = this.getFirstConnector()?.table;
            if (table) {
                const row = e.row;

                cursor.emitCursor(table, {
                    type: 'position',
                    row: parseInt(row.dataset.rowIndex, 10),
                    column: e.columnName,
                    state: 'dataGrid.hoverRow'
                });
            }
        };

        const onDataGridMouseOut = (): void => {
            const table = this.getFirstConnector()?.table;
            if (table) {
                cursor.emitCursor(table, {
                    type: 'position',
                    state: 'dataGrid.hoverOut'
                });
            }
        };

        addEvent(dataGrid.container, 'dataGridHover', onDataGridHover);
        addEvent(dataGrid.container, 'mouseout', onDataGridMouseOut);

        // Return a function that calls the callbacks
        return function (): void {
            removeEvent(
                dataGrid.container,
                'dataGridHover',
                onDataGridHover
            );
            removeEvent(
                dataGrid.container,
                'mouseout',
                onDataGridMouseOut
            );
        };
    },
    handler: function (this: Component): (() => void) | void {
        if (this.type !== 'DataGrid') {
            return;
        }
        const component = this as DataGridComponent;

        const { board } = component;
        const highlightOptions =
            component.sync.syncConfig.highlight as DataGridHighlightSyncOptions;

        if (!highlightOptions?.enabled) {
            return;
        }

        const handleCursor = (e: DataCursor.Event): void => {
            const cursor = e.cursor;
            if (cursor.type !== 'position') {
                return;
            }

            const { row } = cursor;
            const { dataGrid } = component;

            if (row === void 0 || !dataGrid) {
                return;
            }

            if (highlightOptions.autoScroll) {
                dataGrid.scrollToRow(row);
            }

            setTimeout((): void => {
                const highlightedDataRow = dataGrid.container
                    .querySelector<HTMLElement>(`.highcharts-datagrid-row[data-row-index="${row}"]`);

                if (highlightedDataRow) {
                    dataGrid.toggleRowHighlight(highlightedDataRow);
                    dataGrid.hoveredRow = highlightedDataRow;
                }
            }, 5);
        };

        const handleCursorOut = (): void => {
            const { dataGrid } = component;
            if (dataGrid) {
                dataGrid.toggleRowHighlight(void 0);
            }
        };

        const registerCursorListeners = (): void => {
            const { dataCursor: cursor } = board;
            if (!cursor) {
                return;
            }
            const table = component.connectorHandlers?.[0]?.connector?.table;
            if (!table) {
                return;
            }

            cursor.addListener(table.id, 'point.mouseOver', handleCursor);
            cursor.addListener(table.id, 'point.mouseOut', handleCursorOut);
        };

        const unregisterCursorListeners = (): void => {
            const cursor = board.dataCursor;
            const table = component.connectorHandlers?.[0]?.connector?.table;
            if (!table) {
                return;
            }

            cursor.removeListener(table.id, 'point.mouseOver', handleCursor);
            cursor.removeListener(table.id, 'point.mouseOut', handleCursorOut);
        };

        if (board) {
            registerCursorListeners();
            return unregisterCursorListeners;
        }
    }
};


/* *
*
*  Default export
*
* */
export default { defaultOptions, syncPair };
