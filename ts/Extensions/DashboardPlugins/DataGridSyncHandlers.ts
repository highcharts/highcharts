/* *
 *
 *  (c) 2009-2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Karol Kolodziej
 *
 * */

/* eslint-disable require-jsdoc, max-len */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Sync from '../../Dashboards/Components/Sync/Sync';

import ComponentTypes from '../../Dashboards/Components/ComponentType';
import DataGridComponent from './DataGridComponent.js';
import U from '../../Core/Utilities.js';
const {
    addEvent
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare global {
    interface Window {
        DataGridComponent?: typeof DataGridComponent;
    }
}


const configs: {
    handlers: Record<string, Sync.HandlerConfig>;
    emitters: Record<string, Sync.EmitterConfig>;
} = {
    emitters: {
        tooltipEmitter: [
            'tooltipEmitter',
            function (this: ComponentTypes): Function | void {
                if (this instanceof (DataGridComponent || window.DataGridComponent)) {
                    const { dataGrid, store, board } = this;

                    if (dataGrid && store && board) {
                        const { cursor } = board;

                        const callbacks = [
                            // TODO: should this event return cell data instead of row data?
                            addEvent(dataGrid.container, 'dataGridHover', (e: any): void => {
                                const row = e.row;
                                cursor.emitCursor(store.table, {
                                    type: 'position',
                                    row: row.dataset.rowIndex,
                                    state: 'point.mouseOver'
                                });
                            }),
                            addEvent(dataGrid.container, 'mouseout', (): void => {
                                cursor.emitCursor(store.table, {
                                    type: 'position',
                                    state: 'point.mouseOut'
                                });
                            })
                        ];

                        // Return a function that calls the callbacks
                        return function (): void {
                            callbacks.forEach((callback): void => callback());
                        };
                    }
                }
            }
        ]
    },
    handlers: {
        tooltipHandler: [
            'tooltipHandler',
            void 0, // 'afterHoverPointChange',
            function (this: DataGridComponent): void {
                const { board } = this;
                const table = this.store && this.store.table;
                if (board && table) {
                    const { cursor } = board;
                    if (cursor) {
                        cursor.addListener(table.id, 'point.mouseOver', (e): void => {

                            const cursor = e.cursor as any;
                            const { row } = cursor;

                            const { dataGrid } = this;
                            if (dataGrid) {
                                const highlightedDataRow = dataGrid.rowElements[row];
                                if (highlightedDataRow) {
                                    dataGrid.toggleRowHighlight(highlightedDataRow);
                                    dataGrid.hoveredRow = highlightedDataRow;
                                }
                            }

                        });

                        cursor.addListener(table.id, 'point.mouseOut', (): void => {
                            const { dataGrid } = this;
                            if (dataGrid) {
                                dataGrid.toggleRowHighlight(void 0);
                            }

                        });
                    }
                }
            }
        ]
    }
};

const defaults: Sync.OptionsRecord = {
    tooltip: { emitter: configs.emitters.tooltipEmitter, handler: configs.handlers.tooltipHandler }
};

export default defaults;
