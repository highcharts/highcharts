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

        const onCellHover = (e: any): void => {
            const table = this.getFirstConnector()?.table;
            if (table) {
                const cell = e.target;

                cursor.emitCursor(table, {
                    type: 'position',
                    row: parseInt(cell?.row?.index, 10),
                    column: cell?.column?.id,
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
    }
};


/* *
*
*  Default export
*
* */
export default { defaultOptions, syncPair };
