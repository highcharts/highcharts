/* *
 *
 *  (c) 2009-2025 Highsoft AS
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
        if (
            this.type !== 'DataGrid' && // To be removed in v4
            this.type !== 'Grid'
        ) {
            return;
        }
        const component = this as DataGridComponent;

        const { grid, board } = component;
        const highlightOptions = this.sync.syncConfig.highlight;
        const groupKey = highlightOptions.group ?
            ':' + highlightOptions.group : '';

        if (!board || !grid || !highlightOptions?.enabled) {
            return;
        }

        const { dataCursor: cursor } = board;
        const table =
            this.getFirstConnector()?.getTable(component.dataTableKey);

        const onCellHover = (e: TableCell.TableCellEvent): void => {
            if (table) {
                const cell = e.target;

                cursor.emitCursor(table, {
                    type: 'position',
                    row: cell.row.id,
                    column: cell.column.id,
                    state: 'point.mouseOver' + groupKey,
                    sourceId: this.id
                });
            }
        };

        const onCellMouseOut = (e: TableCell.TableCellEvent): void => {
            if (table) {
                const cell = e.target;

                cursor.emitCursor(table, {
                    type: 'position',
                    row: cell.row.id,
                    column: cell.column.id,
                    state: 'point.mouseOut' + groupKey,
                    sourceId: this.id
                });
            }
        };

        addEvent(grid, 'cellMouseOver', onCellHover);
        addEvent(grid, 'cellMouseOut', onCellMouseOut);

        // Return a function that calls the callbacks
        return function (): void {
            removeEvent(
                grid.container,
                'cellMouseOver',
                onCellHover
            );
            removeEvent(
                grid.container,
                'cellMouseOut',
                onCellMouseOut
            );
        };
    },
    handler: function (this: Component): (() => void) | void {
        if (
            this.type !== 'DataGrid' && // To be removed in v4
            this.type !== 'Grid'
        ) {
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

        const table =
            component.getFirstConnector()?.getTable(component.dataTableKey);

        const handleCursor = (e: DataCursor.Event): void => {
            const cursor = e.cursor;
            if (
                cursor.sourceId === component.id ||
                cursor.type !== 'position'
            ) {
                return;
            }

            const { row, column } = cursor;
            const { grid } = component;
            const viewport = grid?.viewport;

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

            grid.syncRow(rowIndex);
            grid.syncColumn(column);
        };

        const handleCursorOut = (e: DataCursor.Event): void => {
            const { grid } = component;
            if (grid && e.cursor.sourceId !== component.id) {
                grid.syncColumn();
                grid.syncRow();
            }
        };

        const registerCursorListeners = (): void => {
            const { dataCursor: cursor } = board;
            if (!cursor) {
                return;
            }
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
            if (!table) {
                return;
            }

            const cursor = board.dataCursor;

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
