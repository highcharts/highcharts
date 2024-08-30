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
        if (this.type !== 'DataGrid') {
            return;
        }
        const component = this as DataGridComponent;
        const syncOptions = this.sync.syncConfig.visibility;
        const groupKey = syncOptions.group ?
            ':' + syncOptions.group : '';

        const { board } = component;

        const handleVisibilityChange = (e: DataCursor.Event): void => {
            const cursor = e.cursor,
                dataGrid = component.dataGrid;
            if (!(dataGrid && cursor.type === 'position' && cursor.column)) {
                return;
            }

            void dataGrid.updateColumn(cursor.column, {
                enabled: cursor.state !== 'series.hide' + groupKey
            });
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
                'series.show' + groupKey,
                handleVisibilityChange
            );
            cursor.addListener(
                table.id,
                'series.hide' + groupKey,
                handleVisibilityChange
            );
        };

        const unregisterCursorListeners = (): void => {
            const table = component.connectorHandlers?.[0]?.connector?.table;
            const { dataCursor: cursor } = board;

            if (!table) {
                return;
            }

            cursor.removeListener(
                table.id,
                'series.show' + groupKey,
                handleVisibilityChange
            );
            cursor.removeListener(
                table.id,
                'series.hide' + groupKey,
                handleVisibilityChange
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
