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

import ComponentType from '../../Dashboards/Components/ComponentType';
import DataGridComponent from './DataGridComponent.js';
import U from '../../Core/Utilities.js';
const {
    addEvent
} = U;

/* *
 *
 *  Constants
 *
 * */

const configs: {
    handlers: Record<string, Sync.HandlerConfig>;
    emitters: Record<string, Sync.EmitterConfig>;
} = {
    emitters: {
        highlightEmitter: [
            'highlightEmitter',
            function (this: ComponentType): Function | void {
                if (this.type === 'DataGrid') {
                    const { dataGrid, connector: store, board } = this as DataGridComponent;

                    if (dataGrid && store && board) {
                        const { dataCursor: cursor } = board;

                        const callbacks = [
                            addEvent(dataGrid.container, 'dataGridHover', (e: any): void => {
                                const row = e.row;
                                const cell = row.querySelector(`.hc-dg-cell[data-original-data="${row.dataset.rowXIndex}"]`);

                                cursor.emitCursor(store.table, {
                                    type: 'position',
                                    row: parseInt(row.dataset.rowIndex, 10),
                                    column: cell ? cell.dataset.columnName : void 0,
                                    state: 'dataGrid.hoverRow'
                                });
                            }),
                            addEvent(dataGrid.container, 'mouseout', (): void => {
                                cursor.emitCursor(store.table, {
                                    type: 'position',
                                    state: 'dataGrid.hoverOut'
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
        highlightHandler: [
            'highlightHandler',
            void 0, // 'afterHoverPointChange',
            function (this: DataGridComponent): void {
                const { board } = this;
                const table = this.connector && this.connector.table;
                if (board && table) {
                    const { dataCursor: cursor } = board;
                    if (cursor) {
                        cursor.addListener(table.id, 'point.mouseOver', (e): void => {
                            const cursor = e.cursor;
                            if (cursor.type === 'position') {
                                const { row } = cursor;
                                const { dataGrid } = this;

                                if (row && dataGrid) {
                                    const highlightedDataRow = dataGrid.container
                                        .querySelector<HTMLElement>(`.hc-dg-row[data-row-index="${row}"]`);

                                    if (highlightedDataRow) {
                                        dataGrid.toggleRowHighlight(highlightedDataRow);
                                        dataGrid.hoveredRow = highlightedDataRow;
                                    }
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
        ],
        extremesHandler: function (this: DataGridComponent): void {
            const { board } = this;
            const table = this.connector && this.connector.table;
            if (board && table) {

                const { dataCursor: cursor } = board;
                if (cursor) {
                    cursor.addListener(table.id, 'xAxis.extremes.min', (e): void => {
                        if (e.cursor.type === 'position' && this.dataGrid && e.cursor.row !== void 0) {
                            const { row } = e.cursor;
                            this.dataGrid.scrollToRow(row);
                        }
                    });
                }
            }

        }
    }
};

const defaults: Sync.OptionsRecord = {
    highlight: { emitter: configs.emitters.highlightEmitter, handler: configs.handlers.highlightHandler },
    extremes: { handler: configs.handlers.selectionHandler }
};


export default defaults;
