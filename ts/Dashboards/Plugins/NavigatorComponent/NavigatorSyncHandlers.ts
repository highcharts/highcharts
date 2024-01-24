/* *
 *
 *  (c) 2009-2024 Highsoft AS
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

import type { Axis } from '../HighchartsTypes';
import type DataCursor from '../../../Data/DataCursor';
import type Sync from '../../Components/Sync/Sync';
import type Component from '../../Components/Component';
import type NavigatorComponent from './NavigatorComponent';
import type { RangeModifierRangeOptions } from '../../../Data/Modifiers/RangeModifierOptions';

import DataModifier from '../../../Data/Modifiers/DataModifier.js';
const { Range: RangeModifier } = DataModifier.types;
import U from '../../../Core/Utilities.js';
const {
    addEvent,
    pick
} = U;

/* *
 *
 *  Functions
 *
 * */

/** @internal */
function getAxisExtremes(
    axis: Axis,
    extremes: Axis.ExtremesObject
): ([number, number] | [string, string]) {
    let max: (number | string) = (
            typeof extremes.max === 'number' ?
                extremes.max :
                extremes.dataMax
        ),
        min: (number | string) = (
            typeof extremes.min === 'number' ?
                extremes.min :
                extremes.dataMin
        );

    if (axis.hasNames) {
        return [
            axis.names[Math.round(min)],
            axis.names[Math.round(max)]
        ];
    }

    return [min, max];
}


/** @internal */
function setRangeOptions(
    ranges: Array<RangeModifierRangeOptions>,
    column: string,
    minValue: (boolean | number | string),
    maxValue: (boolean | number | string)
): void {
    let changed = false;

    for (let i = 0, iEnd = ranges.length; i < iEnd; ++i) {
        if (ranges[i].column === column) {
            ranges[i].maxValue = maxValue;
            ranges[i].minValue = minValue;
            changed = true;
            break;
        }
    }

    if (!changed) {
        ranges.push({ column, maxValue, minValue });
    }
}


/** @internal */
function unsetRangeOptions(
    ranges: Array<RangeModifierRangeOptions>,
    column: string
): (RangeModifierRangeOptions | undefined) {
    for (let i = 0, iEnd = ranges.length; i < iEnd; ++i) {
        if (ranges[i].column === column) {
            return ranges.splice(i, 1)[0];
        }
    }
}


/* *
 *
 *  Constants
 *
 * */

const configs: {
    handlers: Record<string, Sync.HandlerConfig>;
    emitters: Record<string, Sync.EmitterConfig>;
} = {
    handlers: {
        extremesHandler(
            this: Component
        ): void {
            const component = this as NavigatorComponent,
                dataCursor = component.board.dataCursor;

            const extremesListener = (e: DataCursor.Event): void => {
                const cursor = e.cursor;

                if (!component.connector) {
                    return;
                }

                const table = component.connector.table;

                // assume first column with unique keys as fallback
                let extremesColumn = table.getColumnNames()[0],
                    maxIndex = table.getRowCount(),
                    minIndex = 0;

                if (cursor.type === 'range') {
                    maxIndex = cursor.lastRow;
                    minIndex = cursor.firstRow;

                    if (cursor.columns) {
                        extremesColumn = pick(cursor.columns[0], extremesColumn);
                    }
                } else if (cursor.state === 'xAxis.extremes.max') {
                    extremesColumn = pick(cursor.column, extremesColumn);
                    maxIndex = pick(cursor.row, maxIndex);
                } else {
                    extremesColumn = pick(cursor.column, extremesColumn);
                    minIndex = pick(cursor.row, minIndex);
                }

                const modifier = table.getModifier();

                if (
                    typeof extremesColumn === 'string' &&
                    modifier instanceof RangeModifier
                ) {
                    const ranges = modifier.options.ranges,
                        min = table.getCell(extremesColumn, minIndex),
                        max = table.getCell(extremesColumn, maxIndex);

                    if (
                        max !== null && typeof max !== 'undefined' &&
                        min !== null && typeof min !== 'undefined'
                    ) {
                        unsetRangeOptions(ranges, extremesColumn);
                        ranges.unshift({
                            column: extremesColumn,
                            maxValue: max,
                            minValue: min
                        });
                        table.setModifier(modifier);
                    }
                }
            };

            const registerCursorListeners = (): void => {
                const table = component.connector && component.connector.table;

                if (table) {
                    dataCursor.addListener(
                        table.id,
                        'xAxis.extremes',
                        extremesListener
                    );
                    dataCursor.addListener(
                        table.id,
                        'xAxis.extremes.max',
                        extremesListener
                    );
                    dataCursor.addListener(
                        table.id,
                        'xAxis.extremes.min',
                        extremesListener
                    );
                }
            };

            const unregisterCursorListeners = (): void => {
                const table = component.connector && component.connector.table;

                if (table) {
                    dataCursor.removeListener(
                        table.id,
                        'xAxis.extremes',
                        extremesListener
                    );
                    dataCursor.removeListener(
                        table.id,
                        'xAxis.extremes.max',
                        extremesListener
                    );
                    dataCursor.removeListener(
                        table.id,
                        'xAxis.extremes.min',
                        extremesListener
                    );
                }
            };

            registerCursorListeners();

            component.on('setConnector', (): void => unregisterCursorListeners());
            component.on('afterSetConnector', (): void => registerCursorListeners());
        }

    },
    emitters: {
        crossfilterEmitter(
            this: Component
        ): (Function | undefined) {
            const component = this as NavigatorComponent;

            const afterSetExtremes = async (
                axis: Axis,
                extremes: Axis.ExtremesObject
            ): Promise<void> => {
                if (component.connector) {
                    const table = component.connector.table,
                        dataCursor = component.board.dataCursor,
                        filterColumn = component.getColumnAssignment()[0],
                        [min, max] = getAxisExtremes(axis, extremes);

                    let modifier = table.getModifier();

                    if (modifier instanceof RangeModifier) {
                        setRangeOptions(
                            modifier.options.ranges,
                            filterColumn,
                            min,
                            max
                        );
                    } else {
                        modifier = new RangeModifier({
                            ranges: [{
                                column: filterColumn,
                                maxValue: max,
                                minValue: min
                            }]
                        });
                    }

                    await table.setModifier(modifier);

                    dataCursor.emitCursor(
                        table,
                        {
                            type: 'range',
                            columns: [filterColumn],
                            firstRow: 0,
                            lastRow: table.getRowCount() - 1,
                            state: 'crossfilter'
                        },
                        extremes as unknown as Event
                    );
                }
            };

            let delay: number;

            return addEvent(
                component.chart.xAxis[0],
                'afterSetExtremes',
                function (extremes: Axis.ExtremesObject): void {
                    clearTimeout(delay);
                    delay = setTimeout(afterSetExtremes, 50, this, extremes);
                }
            );
        },
        extremesEmitter(
            this: Component
        ): (Function | undefined) {
            const component = this as NavigatorComponent;

            const afterSetExtremes = (
                axis: Axis,
                extremes: Axis.ExtremesObject
            ): void => {
                if (component.connector) {
                    const table = component.connector.table,
                        dataCursor = component.board.dataCursor,
                        filterColumn = component.getColumnAssignment()[0],
                        [min, max] = getAxisExtremes(axis, extremes);

                    dataCursor.emitCursor(
                        table,
                        {
                            type: 'position',
                            column: filterColumn,
                            row: table.getRowIndexBy(filterColumn, min),
                            state: 'xAxis.extremes.min'
                        },
                        extremes as unknown as Event
                    );

                    dataCursor.emitCursor(
                        table,
                        {
                            type: 'position',
                            column: filterColumn,
                            row: table.getRowIndexBy(filterColumn, max),
                            state: 'xAxis.extremes.max'
                        },
                        extremes as unknown as Event
                    );
                }
            };

            let delay: number;

            return addEvent(
                component.chart.xAxis[0],
                'afterSetExtremes',
                function (extremes: Axis.ExtremesObject): void {
                    clearTimeout(delay);
                    delay = setTimeout(afterSetExtremes, 50, this, extremes);
                }
            );
        }
    }
};

const defaults: Sync.OptionsRecord = {
    crossfilter: {
        emitter: configs.emitters.crossfilterEmitter
    },
    extremes: {
        emitter: configs.emitters.extremesEmitter,
        handler: configs.emitters.extremesHandler
    }
};

export default defaults;
