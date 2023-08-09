/* *
 *
 *  (c) 2009-2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *
 * */

/* eslint-disable require-jsdoc, max-len */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type {
    Axis,
    Series
} from './HighchartsTypes';
import type DataCursor from '../../Data/DataCursor';
import type RangeModifier from '../../Data/Modifiers/RangeModifier';
import type Sync from '../Components/Sync/Sync';

import ComponentType from '../Components/ComponentType';
import HighchartsComponent from './HighchartsComponent';
import U from '../../Core/Utilities.js';
import KPIComponent from '../Components/KPIComponent';
const { addEvent } = U;


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
    },
    handlers: {
        extremesHandler:
            function (this: KPIComponent): Function | void {
            const { board, connector } = this;

            const handleChangeExtremes = (e: DataCursor.Event): void => {
                if (e.cursor.type === 'position' && e.cursors.length) {
                    // Lasting cursor, so get last cursor
                    const lastCursor = e.cursors[e.cursors.length - 1];
                    if ('row' in lastCursor && typeof lastCursor.row === 'number') {
                        const { row, column } = lastCursor;
                        if (column && this.connector) {
                            const value = this.connector.table.modified.getCellAsString(column, row);
                            this.setValue(value);
                        }
                    }
                }

            };

            const registerCursorListeners = (): void => {
                const { dataCursor: cursor } = board;

                if (!cursor) {
                    return;
                }
                const table = this.connector && this.connector.table;

                if (!table) {
                    return;
                }

                cursor.addListener(table.id, 'xAxis.extremes.max', handleChangeExtremes);
            };

            const unregisterCursorListeners = (): void => {
                const table = this.connector && this.connector.table;
                const { dataCursor: cursor } = board;

                if (!table) {
                    return;
                }

                cursor.removeListener(table.id, 'xAxis.extremes.max', handleChangeExtremes);
            };


            if (board) {
                registerCursorListeners();

                this.on('setConnector', (): void => unregisterCursorListeners());
                this.on('afterSetConnector', (): void => registerCursorListeners());
            }
            }
    }
};

const defaults: Sync.OptionsRecord = {
    extremes: { handler: configs.handlers.extremesHandler }
};

export default defaults;
