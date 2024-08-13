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
import type DataCursor from '../../../../Data/DataCursor';
import type DataGridComponent from '../DataGridComponent.js';
import type { DataGridHighlightSyncOptions } from '../DataGridComponentOptions';
import type { TableCell } from '../../../Plugins/DataGridTypes';

import Component from '../../Component';
import U from '../../../../Core/Utilities.js';
const { addEvent, removeEvent } = U;

/* *
 *
 *  Constants
 *
 * */

const defaultOptions: DataGridHighlightSyncOptions = {
    autoScroll: false
};

const syncPair: Sync.SyncPair = {
    emitter: function (this: Component): (() => void) | void {
        if (this.type !== 'DataGrid') {
            return;
        }
        const component = this as DataGridComponent;

        const { dataGrid, board } = component;
        const highlightOptions = this.sync.syncConfig.highlight;
        const groupKey = highlightOptions.group ?
            ':' + highlightOptions.group : '';

        if (!board || !dataGrid || !highlightOptions?.enabled) {
            return;
        }

        const { dataCursor: cursor } = board;

        const onCellHover = (e: TableCell.TableCellEvent): void => {
            const table = this.getFirstConnector()?.table;
            if (table) {
                const cell = e.target;

                cursor.emitCursor(table, {
                    type: 'position',
                    row: cell.row.id,
                    column: cell.column.id,
                    state: 'dataGrid.hoverRow' + groupKey
                });
            }
        };

        const onCellMouseOut = (): void => {
            const table = this.getFirstConnector()?.table;
            if (table) {
                cursor.emitCursor(table, {
                    type: 'position',
                    state: 'dataGrid.hoverOut' + groupKey
                });
            }
        };

        addEvent(dataGrid, 'cellMouseOver', onCellHover);
        addEvent(dataGrid, 'cellMouseOut', onCellMouseOut);

        // Return a function that calls the callbacks
        return function (): void {
            removeEvent(
                dataGrid.container,
                'cellMouseOver',
                onCellHover
            );
            removeEvent(
                dataGrid.container,
                'cellMouseOut',
                onCellMouseOut
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
        const groupKey = highlightOptions.group ?
            ':' + highlightOptions.group : '';

        if (!highlightOptions?.enabled) {
            return;
        }

        const handleCursor = (e: DataCursor.Event): void => {
            const cursor = e.cursor;
            if (cursor.type !== 'position') {
                return;
            }

            const { row, column } = cursor;
            const { dataGrid } = component;
            const viewport = dataGrid?.viewport;

            if (row === void 0 || !viewport) {
                return;
            }

            const rowIndex = viewport.dataTable.getLocalRowIndex(row);
            if (rowIndex === void 0) {
                return;
            }

            if (highlightOptions.autoScroll) {
                viewport.scrollToRow(rowIndex);
            }

            dataGrid.hoverRow(rowIndex);
            dataGrid.hoverColumn(column);
        };

        const handleCursorOut = (): void => {
            const { dataGrid } = component;
            if (dataGrid) {
                dataGrid.hoverColumn();
                dataGrid.hoverRow();
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

            cursor.addListener(
                table.id,
                'point.mouseOver' + groupKey,
                handleCursor
            );
            cursor.addListener(
                table.id,
                'point.mouseOut' + groupKey,
                handleCursorOut
            );
        };

        const unregisterCursorListeners = (): void => {
            const cursor = board.dataCursor;
            const table = component.connectorHandlers?.[0]?.connector?.table;
            if (!table) {
                return;
            }

            cursor.removeListener(
                table.id,
                'point.mouseOver' + groupKey,
                handleCursor
            );
            cursor.removeListener(
                table.id,
                'point.mouseOut' + groupKey,
                handleCursorOut
            );
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
