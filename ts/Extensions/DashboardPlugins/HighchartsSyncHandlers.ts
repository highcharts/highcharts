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
import type Point from '../../Core/Series/Point';
import type RangeModifier from '../../Data/Modifiers/RangeModifier';
import type Series from '../../Core/Series/Series';
import type SharedState from '../../Dashboards/Components/SharedComponentState';
import type Sync from '../../Dashboards/Components/Sync/Sync';
import type DataCursor from '../../Data/DataCursor';

import ComponentType from '../../Dashboards/Components/ComponentType';
import ComponentGroup from '../../Dashboards/Components/ComponentGroup.js';
import HighchartsComponent from './HighchartsComponent.js';
import U from '../../Core/Utilities.js';
const { addEvent } = U;


/* *
 *
 *  Constants
 *
 * */

/**
 *
 */
function getAxisMinMaxMap(chart: Chart): Array<{
    coll: string;
    extremes: { min: number | undefined; max: number | undefined };
}> {
    return chart.axes
        .filter((axis): boolean => (chart.options.chart.zoomType || '')
            .indexOf(axis.coll.slice(0, 1)) > -1 // A bit silly
        )
        .map((axis): { coll: string; extremes: { min: number | undefined; max: number | undefined } } => {
            const { min, max, coll } = axis;
            return {
                coll,
                extremes: {
                    min: typeof min === 'number' ? min : void 0,
                    max: typeof max === 'number' ? max : void 0
                }
            };
        }
        );
}


/**
 * Finds a matching point in the chart
 * @param {Chart} chart
 * The chart
 * @param {Point} hoverPoint
 * The point-like to look for
 *
 * @return {Point | undefined}
 * A point if found
 */
function findMatchingPoint(
    chart: Chart,
    hoverPoint: SharedState.PresentationHoverPointType
): Point | undefined {
    const { x, y, series } = hoverPoint;

    for (let i = 0; i < chart.series.length; i++) {
        if (series && chart.series[i].options.id === series.options.id) {
            const { points } = chart.series[i];
            for (let j = 0; j < points.length; j++) {
                const point = points[j];

                if (point.visible && point.series.visible && point.x === x) {
                    return point;
                }
            }
        }
    }
}

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

                    let chartResetSelectionCallback: Function;
                    let chartShowResetButtonCallback: Function;

                    if (store && chart && board) {
                        this.on('afterRender', (): void => {
                            const { dataCursor: cursor } = board;
                            if (chart.axes) {
                                chart.axes.forEach((axis): void => {
                                    axis.update({
                                        events: {
                                            afterSetExtremes: (e): void => {
                                                if (!(e as any).resetSelection) {
                                                    const eventTarget = e.target as unknown as Axis;

                                                    // TODO: this is a bit silly
                                                    const [series] = eventTarget.series;
                                                    const [
                                                        firstVisiblePoint,
                                                        ...visiblePoints
                                                    ] = series.points
                                                        .filter((point):boolean => point.isInside || false);

                                                    cursor.emitCursor(store.table, {
                                                        type: 'position',
                                                        state: `${eventTarget.coll}.extremes.min`,
                                                        row: firstVisiblePoint.index, // assume this has not been modified
                                                        column: axis.dateTime ? 'x' : series.name // should possibly look up column names in the table first?
                                                    },
                                                    e as any
                                                    ).emitCursor(store.table, {
                                                        type: 'position',
                                                        state: `${eventTarget.coll}.extremes.max`,
                                                        row: visiblePoints[visiblePoints.length - 1].index,
                                                        column: axis.dateTime ? 'x' : series.name
                                                    },
                                                    e as any
                                                    );
                                                }
                                            }
                                        }

                                    },
                                    false
                                    );


                                });

                                chartResetSelectionCallback = addEvent(chart, 'selection', function (e): void {
                                    if ('resetSelection' in e && e.resetSelection) {
                                        cursor.emitCursor(store.table, {
                                            type: 'position',
                                            state: 'chart.resetSelection'
                                        },
                                        e as any
                                        );
                                    }
                                });

                                chartShowResetButtonCallback = addEvent(chart, 'afterShowResetZoom', function (e):void {
                                    cursor.emitCursor(store.table, {
                                        type: 'position',
                                        state: 'chart.showResetZoom'
                                    },
                                    e as any
                                    );
                                });
                            }
                        });

                        return function (): void {
                            if (chartResetSelectionCallback) {
                                chartResetSelectionCallback();
                            }
                            if (chartShowResetButtonCallback) {
                                chartShowResetButtonCallback();
                            }
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
                function (this: HighchartsComponent): void {
                    const { chart, board, connector: store } = this;

                    if (chart && board && store && store.table) {
                        const { dataCursor: cursor } = board;

                        let timeOut = 0;

                        const onAfterUpdate = (axis: Axis): void => {
                            if (timeOut) {
                                clearTimeout(timeOut);
                            }
                            timeOut = setTimeout(():void => {
                                axis.setExtremes(axis.min || void 0, axis.max || void 0);
                                timeOut = 0;
                            });
                        };

                        ['xAxis'].forEach((dimension): void => {
                            cursor.addListener(store.table.id, `${dimension}.extremes.min`, (e): void => {
                                const { cursor, event, table } = e;

                                if (cursor.type === 'position') {
                                    const { row, column } = cursor;
                                    const eventTarget = event && event.target as unknown as Axis;

                                    if (column && row) {
                                        const value = table.getCellAsNumber(column, row);

                                        if (eventTarget) {
                                            chart.axes.forEach((axis): void => {
                                                if (eventTarget.coll === axis.coll && eventTarget !== axis) {
                                                    axis.min = value || eventTarget.min;
                                                    onAfterUpdate(axis);
                                                }
                                            });
                                        }
                                    }
                                }
                            });

                            cursor.addListener(store.table.id, `${dimension}.extremes.max`, (e): void => {
                                const { cursor, event, table } = e;
                                if (cursor.type === 'position') {
                                    const { row, column } = cursor;
                                    const eventTarget = event && event.target as unknown as Axis;

                                    if (column && row) {
                                        const value = table.getCellAsNumber(column, row);

                                        if (eventTarget) {
                                            chart.axes.forEach((axis): void => {
                                                if (eventTarget.coll === axis.coll && eventTarget !== axis) {
                                                    axis.max = value || eventTarget.max;
                                                    onAfterUpdate(axis);
                                                }
                                            });
                                        }
                                    }
                                }
                            });

                        });

                        // these could potentially be different handlers / emitters
                        cursor.addListener(store.table.id, 'chart.resetSelection', (e): void => {
                            const { cursor, event } = e;
                            const eventTarget = event && event.target as unknown as Chart;

                            if (cursor.type === 'position' && eventTarget !== chart) {
                                chart.zoomOut();
                            }
                        });

                        cursor.addListener(store.table.id, 'chart.showResetZoom', (e): void => {
                            const { cursor, event } = e;
                            const eventTarget = event && event.target as unknown as Chart;
                            if (cursor.type === 'position' && eventTarget !== chart) {
                                chart.showResetZoom();
                            }
                        });
                    }
                }
    }
};

const defaults: Sync.OptionsRecord = {
    selection: { emitter: configs.emitters.extremesEmitter, handler: configs.handlers.extremesHandler },
    highlight: { emitter: configs.emitters.highlightEmitter, handler: configs.handlers.highlightHandler },
    visibility: { emitter: configs.emitters.seriesVisibilityEmitter, handler: configs.handlers.seriesVisibilityHandler }
};

export default defaults;
