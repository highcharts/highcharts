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

import type Axis from '../../Core/Axis/Axis.js';
import type Chart from '../../Core/Chart/Chart';
import type RangeModifier from '../../Data/Modifiers/RangeModifier';
import type Series from '../../Core/Series/Series';
import type SharedState from '../../Dashboards/Components/SharedComponentState';
import type Sync from '../../Dashboards/Components/Sync/Sync';
import type DataCursor from '../../Data/DataCursor';

import ComponentType from '../../Dashboards/Components/ComponentType';
import HighchartsComponent from './HighchartsComponent.js';
import U from '../../Core/Utilities.js';
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
        highlightEmitter: [
            'highlightEmitter',
            function (this: ComponentType): Function | void {
                if (this.type === 'Highcharts') {
                    const { chart, board } = this as HighchartsComponent;
                    const table = this.connector && this.connector.table;

                    if (board && table) {
                        const { dataCursor: cursor } = board;

                        this.on('afterRender', (): void => {
                            if (chart && chart.series) {
                                chart.series.forEach((series): void => {
                                    series.update({
                                        point: {
                                            events: {
                                                // emit table cursor
                                                mouseOver: function (): void {
                                                    let offset = 0;
                                                    const modifier = table.getModifier();
                                                    if (modifier && 'getModifiedTableOffset' in modifier) {
                                                        offset = (modifier as RangeModifier).getModifiedTableOffset(table);
                                                    }
                                                    cursor.emitCursor(table, {
                                                        type: 'position',
                                                        row: offset + this.index,
                                                        column: series.name,
                                                        state: 'point.mouseOver'
                                                    });
                                                },
                                                mouseOut: function (): void {
                                                    let offset = 0;
                                                    const modifier = table.getModifier();
                                                    if (modifier && 'getModifiedTableOffset' in modifier) {
                                                        offset = (modifier as RangeModifier).getModifiedTableOffset(table);
                                                    }
                                                    cursor.emitCursor(table, {
                                                        type: 'position',
                                                        row: offset + this.index,
                                                        column: series.name,
                                                        state: 'point.mouseOut'
                                                    });
                                                }
                                            }
                                        }
                                    });
                                });
                            }
                        });


                        // Return function that handles cleanup
                        return function (): void {
                            if (chart && chart.series) {
                                chart.series.forEach((series): void => {
                                    series.update({
                                        point: {
                                            events: {
                                                mouseOver: void 0,
                                                mouseOut: void 0
                                            }
                                        }
                                    });
                                });

                            }
                        };
                    }
                }
            }
        ],
        seriesVisibilityEmitter:
            function (this: ComponentType): Function | void {
                if (this.type === 'Highcharts') {
                    const component = this as HighchartsComponent;
                    return this.on('afterRender', (): void => {
                        const { chart, connector: store, board } = component;
                        if (
                            store && // has a store
                            board &&
                            chart
                        ) {
                            const { dataCursor: cursor } = board;
                            const { series } = chart;

                            series.forEach((series): void => {
                                series.update({
                                    events: {
                                        show: function (): void {
                                            cursor.emitCursor(
                                                store.table,
                                                {
                                                    type: 'position',
                                                    state: 'series.show',
                                                    column: this.name
                                                }
                                            );
                                        },
                                        hide: function (): void {
                                            cursor.emitCursor(
                                                store.table,
                                                {
                                                    type: 'position',
                                                    state: 'series.hide',
                                                    column: this.name
                                                }
                                            );
                                        }
                                    }
                                });
                            });
                        }
                    });
                }
            },
        extremesEmitter:
            function (this: ComponentType): Function | void {
                if (this.type === 'Highcharts') {
                    const {
                        chart,
                        board,
                        connector: store
                    } = this as HighchartsComponent;

                    const callbacks: Function[] = [];

                    if (store && chart && board) {
                        this.on('afterRender', (): void => {
                            const { dataCursor: cursor } = board;

                            callbacks.push((): void => {
                                cursor.remitCursor(store.table.id, {
                                    type: 'position',
                                    state: 'xAxis.extremes.min'
                                });
                                cursor.remitCursor(store.table.id, {
                                    type: 'position',
                                    state: 'xAxis.extremes.max'
                                });
                            });

                            if (chart.axes) {
                                chart.axes.forEach((axis): void => {
                                    axis.update({
                                        events: {
                                            afterSetExtremes: (e): void => {
                                                if (!(e as any).resetSelection) {
                                                    const axis = e.target as unknown as Axis;

                                                    // Find a series that that is in the datatable
                                                    // TODO: it should find the series with the largest difference between first value and last value
                                                    const [series] = axis.series.filter((series): boolean => store.table.getColumnNames()[0] === series.name);

                                                    if (series) {
                                                        // Get the indexes of the first and last drawn points
                                                        const visiblePoints = series.points
                                                            .filter((point): boolean => point.isInside || false);

                                                        const minCursorData: DataCursor.Type = {
                                                            type: 'position',
                                                            state: `${axis.coll}.extremes.min`
                                                        };

                                                        const maxCursorData: DataCursor.Type = {
                                                            type: 'position',
                                                            state: `${axis.coll}.extremes.max`
                                                        };

                                                        if (axis.coll === 'xAxis' && visiblePoints.length) {
                                                            minCursorData.row = visiblePoints[0].index;
                                                            minCursorData.column = axis.dateTime ? 'x' : series.name;

                                                            maxCursorData.row = visiblePoints[visiblePoints.length - 1].index;
                                                            maxCursorData.column = axis.dateTime ? 'x' : series.name;
                                                        }

                                                        // Emit as lasting cursors
                                                        cursor.emitCursor(store.table,
                                                            minCursorData,
                                                            e as any,
                                                            true
                                                        ).emitCursor(store.table,
                                                            maxCursorData,
                                                            e as any,
                                                            true
                                                        );
                                                    }

                                                }
                                            }
                                        }

                                    },
                                    false
                                    );
                                });

                                callbacks.push(
                                    addEvent(chart, 'selection', function (e): void {
                                        if ('resetSelection' in e && e.resetSelection) {
                                            cursor.emitCursor(store.table, {
                                                type: 'position',
                                                state: 'chart.resetSelection'
                                            },
                                            e as any
                                            );
                                        }
                                    })
                                );

                                callbacks.push(
                                    addEvent(chart, 'afterShowResetZoom', function (e): void {
                                        cursor.emitCursor(store.table, {
                                            type: 'position',
                                            state: 'chart.showResetZoom'
                                        },
                                        e as any
                                        );
                                    })
                                );
                            }
                        });

                        // Return cleanup
                        return function (): void {
                            // Call back the cleanup callbacks
                            callbacks.forEach((callback): void => callback());

                            chart.axes.forEach((axis): void => {
                                axis.update(
                                    {
                                        events: {
                                            afterSetExtremes: void 0
                                        }
                                    },
                                    false
                                );
                            });
                        };
                    }
                }
            }
    },
    handlers: {
        seriesVisibilityHandler:
            function (this: HighchartsComponent): void {
                const { chart, connector: store, board } = this;
                if (store && chart && board) {
                    const { dataCursor } = board;

                    const findSeries = (seriesArray: Series[], name: string): Series | undefined => {
                        for (const series of seriesArray) {
                            if (series.name === name) {
                                return series;
                            }
                        }
                    };

                    dataCursor.addListener(store.table.id, 'series.show', (e): void => {
                        if (e.cursor.type === 'position' && e.cursor.column !== void 0) {
                            const series = findSeries(chart.series, e.cursor.column);
                            if (series) {
                                series.setVisible(true, true);
                            }
                        }
                    }).addListener(store.table.id, 'series.hide', (e): void => {
                        if (e.cursor.type === 'position' && e.cursor.column !== void 0) {
                            const series = findSeries(chart.series, e.cursor.column);
                            if (series) {
                                series.setVisible(false, true);
                            }
                        }
                    });
                }
            },
        highlightHandler:
            function (this: HighchartsComponent): void {
                const { chart, board } = this;
                const table = this.connector && this.connector.table;
                if (board && table) {
                    const { dataCursor: cursor } = board;

                    const handleCursor = (e: DataCursor.Event): void => {
                        let offset = 0;
                        const modifier = table.getModifier();
                        if (modifier && 'getModifiedTableOffset' in modifier) {
                            offset = (modifier as RangeModifier).getModifiedTableOffset(table);
                        }

                        if (chart && chart.series.length) {
                            const cursor = e.cursor;
                            if (cursor.type === 'position') {
                                const [series] = chart.series.length > 1 && cursor.column ?
                                    chart.series.filter((series): boolean => series.name === cursor.column) :
                                    chart.series;


                                if (series && series.visible && cursor.row !== void 0) {
                                    const point = series.points[cursor.row - offset];

                                    if (point) {
                                        chart.tooltip && chart.tooltip.refresh(point);
                                    }
                                }
                            }
                        }
                    };

                    const handleCursorOut = (): void => {
                        if (chart && chart.series.length) {
                            chart.tooltip && chart.tooltip.hide();
                        }
                    };

                    if (cursor) {
                        cursor.addListener(table.id, 'point.mouseOver', handleCursor);
                        cursor.addListener(table.id, 'dataGrid.hoverRow', handleCursor);

                        cursor.addListener(table.id, 'point.mouseOut', handleCursorOut);
                        cursor.addListener(table.id, 'dataGrid.hoverOut', handleCursorOut);
                    }
                }
            },
        extremesHandler:
            function (this: HighchartsComponent): Function | void {

                const callbacks: Function[] = [];


                const { chart, board, connector: store } = this;

                if (chart && board && store && store.table) {
                    const { dataCursor: cursor } = board;

                    // Leaving this as an example on how to do it via the dataTable for other components
                    // Since this is HC -> HC we can just use axis values
                    // ['xAxis'].forEach((dimension): void => {
                    //     let timeOut = 0;
                    //
                    //     const onAfterUpdate = (axis: Axis): void => {
                    //         if (timeOut) {
                    //             clearTimeout(timeOut);
                    //         }
                    //         timeOut = setTimeout((): void => {
                    //             if(cursor.stateMap[store.table.id]){
                    //                 const states = cursor.stateMap[store.table.id];
                    //                  const mins = states['xAxis.extremes.min'];
                    //                  const maxes = states['xAxis.extremes.max'];
                    //
                    //                  const minRow: number = (mins[mins.length -1] as any).row;
                    //                  const minColumn: string = (mins[mins.length -1] as any).column;
                    //                  const maxRow: number = (maxes[maxes.length -1] as any).row ;
                    //                  const maxColumn: string = (maxes[maxes.length -1] as any).column;
                    //
                    //                  const minValue = store.table.getCellAsNumber(minColumn, minRow);
                    //                  const maxValue = store.table.getCellAsNumber(maxColumn, maxRow);
                    //
                    //                  console.log({minValue, maxValue})
                    //
                    //                  if(minValue !== null && maxValue !== null){
                    //                     axis.setExtremes(minRow, maxRow);
                    //                  }
                    //
                    //             }
                    //
                    //             timeOut = 0;
                    //         }, 10);
                    //     };
                    //
                    //     function handleUpdateExtremes(e: DataCursor.Event){
                    //         const { cursor, event, table } = e;
                    //
                    //         if (cursor.type === 'position') {
                    //             const { row, column } = cursor;
                    //             const eventTarget = event && event.target as unknown as Axis;
                    //
                    //             if (column && row !== undefined) {
                    //
                    //                 if (eventTarget && chart) {
                    //                     const axes = chart.xAxis;
                    //                     axes.forEach((axis): void => {
                    //                         if (eventTarget.coll === axis.coll && eventTarget !== axis) {
                    //                             onAfterUpdate(axis)
                    //                         }
                    //                     });
                    //                 }
                    //             }
                    //         }
                    //
                    //     }
                    //
                    //     cursor.addListener(store.table.id, `${dimension}.extremes.min`, handleUpdateExtremes);
                    //
                    //     cursor.addListener(store.table.id, `${dimension}.extremes.max`, handleUpdateExtremes);
                    // });
                    //


                    ['xAxis', 'yAxis'].forEach((dimension): void => {
                        const handleUpdateExtremes = (e: DataCursor.Event): void => {
                            const { cursor, event } = e;

                            if (cursor.type === 'position') {
                                const eventTarget = event && event.target as unknown as Axis;
                                if (eventTarget && chart) {
                                    const axes = (chart as any)[dimension] as unknown as Axis[];
                                    axes.forEach((axis): void => {
                                        if (eventTarget.coll === axis.coll && eventTarget !== axis) {
                                            if (eventTarget.min !== null && eventTarget.max !== null) {
                                                if (
                                                    axis.max !== eventTarget.max &&
                                                        axis.min !== eventTarget.min
                                                ) {
                                                    axis.setExtremes(eventTarget.min, eventTarget.max);
                                                }
                                            }
                                        }
                                    });
                                }
                            }

                        };

                        cursor.addListener(store.table.id, `${dimension}.extremes.min`, handleUpdateExtremes);
                        cursor.addListener(store.table.id, `${dimension}.extremes.max`, handleUpdateExtremes);

                        callbacks.push(
                            (): void => {
                                cursor.removeListener(store.table.id, `${dimension}.extremes.min`, handleUpdateExtremes);
                                cursor.removeListener(store.table.id, `${dimension}.extremes.max`, handleUpdateExtremes);
                            }
                        );
                    });

                    const handleChartResetSelection = (e: DataCursor.Event): void => {
                        const { cursor, event } = e;
                        const eventTarget = event && event.target as unknown as Chart;

                        if (cursor.type === 'position' && eventTarget !== chart) {
                            chart.zoomOut();
                        }
                    };

                    cursor.addListener(store.table.id, 'chart.resetSelection', handleChartResetSelection);

                    const handleChartShowZoom = (e: DataCursor.Event): void => {
                        const { cursor, event } = e;
                        const eventTarget = event && event.target as unknown as Chart;
                        if (cursor.type === 'position' && eventTarget !== chart) {
                            chart.showResetZoom();
                        }
                    };

                    cursor.addListener(store.table.id, 'chart.showResetZoom', handleChartShowZoom);

                    callbacks.push((): void => {
                        cursor.removeListener(store.table.id, 'chart.resetSelection', handleChartResetSelection);
                        cursor.addListener(store.table.id, 'chart.showResetZoom', handleChartShowZoom);
                    });

                    return (): void => {
                        callbacks.forEach((callback): void => callback());
                    };

                }


            }
    }
};

const defaults: Sync.OptionsRecord = {
    extremes: { emitter: configs.emitters.extremesEmitter, handler: configs.handlers.extremesHandler },
    highlight: { emitter: configs.emitters.highlightEmitter, handler: configs.handlers.highlightHandler },
    visibility: { emitter: configs.emitters.seriesVisibilityEmitter, handler: configs.handlers.seriesVisibilityHandler }
};

export default defaults;
