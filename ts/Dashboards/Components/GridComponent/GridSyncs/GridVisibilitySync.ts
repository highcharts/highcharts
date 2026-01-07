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
        const syncOptions = this.sync.syncConfig.visibility;
        const groupKey = syncOptions.group ?
            ':' + syncOptions.group : '';

        const { board } = component;

        const handleVisibilityChange = (e: DataCursor.Event): void => {
            const cursor = e.cursor,
                grid = component.grid;
            if (!(grid && cursor.type === 'position' && cursor.column)) {
                return;
            }

            void grid.updateColumn(cursor.column, {
                enabled: cursor.state !== 'series.hide' + groupKey
            });
        };

        const registerCursorListeners = (): void => {
            const { dataCursor: cursor } = board;

            if (!cursor) {
                return;
            }

            const table = component.getDataTable();

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
            const table = component.getDataTable();
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
