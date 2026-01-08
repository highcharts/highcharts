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
import type KPIComponent from '../KPIComponent.js';

import Component from '../../Component';
import DataCursor from '../../../../Data/DataCursor';
import U from '../../../../Core/Utilities.js';
const { defined } = U;


/* *
 *
 *  Constants
 *
 * */

const defaultOptions: Sync.OptionsEntry = {};

const syncPair: Sync.SyncPair = {
    emitter: void 0,
    handler: function (this: Component): (() => void) | void {
        if (this.type !== 'KPI') {
            return;
        }
        const component = this as KPIComponent;
        const syncOptions = this.sync.syncConfig.extremes;
        const groupKey = syncOptions.group ? ':' + syncOptions.group : '';

        const { board } = this;

        const handleChangeExtremes = (e: DataCursor.Event): void => {
            const cursor = e.cursor;
            if (
                cursor.type === 'position' &&
                typeof cursor?.row === 'number' &&
                defined(cursor.column) &&
                component.connectorHandlers?.[0]?.connector &&
                !defined(component.options.value)
            ) {
                const value = String(
                    component.connectorHandlers[0].connector
                        .getTable()
                        .getModified()
                        .getCell(cursor.column, cursor.row)
                );

                component.setValue(value);
            }

        };

        const registerCursorListeners = (): void => {
            const { dataCursor: cursor } = board;

            if (!cursor) {
                return;
            }
            const table = this.getDataTable();

            if (!table) {
                return;
            }

            cursor.addListener(
                table.id,
                'xAxis.extremes.max' + groupKey,
                handleChangeExtremes
            );
        };

        const unregisterCursorListeners = (): void => {
            const table = this.getDataTable();
            const { dataCursor: cursor } = board;

            if (!table) {
                return;
            }

            cursor.removeListener(
                table.id,
                'xAxis.extremes.max' + groupKey,
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
