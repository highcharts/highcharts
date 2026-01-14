/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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
import type GridComponent from '../GridComponent.js';

import Component from '../../Component';
import DataCursor from '../../../../Data/DataCursor';

/* *
 *
 *  Constants
 *
 * */

const defaultOptions: Sync.OptionsEntry = {};

const syncPair: Sync.SyncPair = {
    emitter: void 0,
    handler: function (this: Component): (() => void) | void {
        if (
            this.type !== 'Grid'
        ) {
            return;
        }
        const component = this as GridComponent;
        const syncOptions = this.sync.syncConfig.extremes;
        const groupKey = syncOptions.group ?
            ':' + syncOptions.group : '';

        const { board } = component;

        const handleChangeExtremes = (e: DataCursor.Event): void => {
            const cursor = e.cursor;
            if (
                cursor.type === 'position' &&
                component.grid &&
                typeof cursor?.row === 'number'
            ) {
                const { row } = cursor;
                const { viewport } = component.grid;
                const rowIndex = viewport?.dataTable?.getLocalRowIndex(row);

                if (rowIndex !== void 0) {
                    component.grid.viewport?.scrollToRow(rowIndex);
                }
            }

        };

        const registerCursorListeners = (): void => {
            const { dataCursor: cursor } = board;

            if (!cursor) {
                return;
            }
            const table =
                component.connectorHandlers?.[0]?.connector?.getTable();

            if (!table) {
                return;
            }

            cursor.addListener(
                table.id,
                'xAxis.extremes.min' + groupKey,
                handleChangeExtremes
            );
        };

        const unregisterCursorListeners = (): void => {
            const table =
                component.connectorHandlers?.[0]?.connector?.getTable();
            const { dataCursor: cursor } = board;

            if (!table) {
                return;
            }

            cursor.removeListener(
                table.id,
                'xAxis.extremes.min' + groupKey,
                handleChangeExtremes
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
