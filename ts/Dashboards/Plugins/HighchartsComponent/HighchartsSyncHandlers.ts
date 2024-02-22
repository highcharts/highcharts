/* *
 *
 *  (c) 2009-2024 Highsoft AS
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
    Point,
    Series
} from '../HighchartsTypes';
import type DataCursor from '../../../Data/DataCursor';
import type Sync from '../../Components/Sync/Sync';
import type { RangeModifierOptions, RangeModifierRangeOptions } from '../../../Data/Modifiers/RangeModifierOptions';
import type DataTable from '../../../Data/DataTable';

import ComponentType from '../../Components/ComponentType';
import HighchartsComponent from './HighchartsComponent';
import U from '../../../Core/Utilities.js';
const { addEvent, isString } = U;


/**
 * Utility function that returns the first row index
 * if the table has been modified by a range modifier
 *
 * @param {DataTable} table
 * The table to get the offset from.
     *
 * @param {RangeModifierOptions} modifierOptions
 * The modifier options to use
 *
 * @return {number}
 * The row offset of the modified table.
 */
function getModifiedTableOffset(
    table: DataTable,
    modifierOptions: RangeModifierOptions
): number {
    const { ranges } = modifierOptions;

    if (ranges) {
        const minRange = ranges.reduce(
            (minRange, currentRange): RangeModifierRangeOptions => {
                if (currentRange.minValue > minRange.minValue) {
                    minRange = currentRange;
                }
                return minRange;

            }, ranges[0]
        );

        const tableRowIndex = table.getRowIndexBy(
            minRange.column,
            minRange.minValue
        );

        if (tableRowIndex) {
            return tableRowIndex;
        }
    }

    return 0;
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
    emitters: {
        highlightEmitter:
            function (this: ComponentType): (() => void) | void {
                if (this.type !== 'Highcharts') {
                    return;
                }

                const { chart, board } = this as HighchartsComponent;
                const highlightOptions =
                    this.sync.syncConfig.highlight as Sync.HighlightSyncOptions;

                if (!highlightOptions.enabled) {
                    return;
                }

                const { dataCursor: cursor } = board;
                const table = this.connectorHandler?.connector?.table;
                if (chart?.series && table) {
                    chart.series.forEach((series): void => {
                        series.update({
                            point: {
                                events: {
                                    // Emit table cursor
                                    mouseOver: function (): void {
                                        let offset = 0;
                                        const modifier = table.getModifier();
                                        if (modifier?.options.type === 'Range') {
                                            offset = getModifiedTableOffset(
                                                table,
                                                modifier.options as RangeModifierOptions
                                            );
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
                                        if (modifier?.options.type === 'Range') {
                                            offset = getModifiedTableOffset(
                                                table,
                                                modifier.options as RangeModifierOptions
                                            );
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
                        }, false);
                        chart.redraw();
                    });
                }

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
                            }, false);
                        });
                        chart.redraw();
                    }
                };
            },
        seriesVisibilityEmitter:
            function (this: ComponentType): Function | void {
                if (this.type !== 'Highcharts') {
                    return;
                }
                const component = this as HighchartsComponent;
                const { chart, board } = component;
                const connector = component.connectorHandler?.connector;
                if (!board || !chart) {
                    return;
                }

                const table = connector?.table;
                if (table) { // Has a connector
                    const { dataCursor: cursor } = board;
                    const { series } = chart;

                    series.forEach((series): void => {
                        series.update({
                            events: {
                                show: function (): void {
                                    cursor.emitCursor(table, {
                                        type: 'position',
                                        state: 'series.show',
                                        column: this.name
                                    });
                                },
                                hide: function (): void {
                                    cursor.emitCursor(table, {
                                        type: 'position',
                                        state: 'series.hide',
                                        column: this.name
                                    });
                                }
                            }
                        }, false);
                    });
                    chart.redraw();
                }

                return function (): void {
                    if (!chart) {
                        return;
                    }

                    chart.series.forEach((series): void => {
                        series.update({
                            events: {
                                show: void 0,
                                hide: void 0
                            }
                        }, false);
                    });
                    chart.redraw();
                };
            },
        extremesEmitter:
            function (this: ComponentType): (() => void) | void {
                if (this.type === 'Highcharts') {
                    const component = this as HighchartsComponent;
                    const cleanupCallbacks: Function[] = [];

                    const { chart, board } = component;
                    const connector = component.connectorHandler?.connector;
                    const table = connector && connector.table;

                    const { dataCursor: cursor } = board;

                    if (table && chart) {
                        const extremesEventHandler = (e: any): void => {
                            const reset = !!(e as any).resetSelection;
                            if ((!e.trigger || (e.trigger && e.trigger !== 'dashboards-sync')) && !reset) {
                                // TODO: investigate this type?
                                const axis = e.target as unknown as Axis;

                                // Prefer a series that's in a related table,
                                // but allow for other data
                                const series = component.seriesFromConnector.length > 0 ?
                                    chart.get(component.seriesFromConnector[0]) as Series :
                                    axis.series[0];

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

                                    if (
                                        component.seriesFromConnector.length > 0 &&
                                        axis.coll === 'xAxis' &&
                                        visiblePoints.length
                                    ) {
                                        let columnName: string | undefined;
                                        const columnAssignment = component.options.connector?.columnAssignment;
                                        if (columnAssignment) {
                                            const assignment = columnAssignment.find((assignment): boolean =>
                                                assignment.seriesId === series.options.id
                                            );
                                            if (assignment) {
                                                const data = assignment.data;
                                                if (isString(data)) {
                                                    columnName = data;
                                                } else if (Array.isArray(data)) {
                                                    columnName = data[data.length - 1];
                                                } else {
                                                    columnName = data.y;
                                                }
                                            }
                                        }

                                        if (!columnName) {
                                            columnName = axis.dateTime && table.hasColumns(['x']) ?
                                                'x' :
                                                series.options.id ?? series.name;
                                        }

                                        minCursorData.row = visiblePoints[0].index;
                                        minCursorData.column = columnName;

                                        maxCursorData.row = visiblePoints[visiblePoints.length - 1].index;
                                        maxCursorData.column = columnName;
                                    }

                                    // Emit as lasting cursors
                                    cursor.emitCursor(table,
                                        minCursorData,
                                        e as any,
                                        true
                                    ).emitCursor(table,
                                        maxCursorData,
                                        e as any,
                                        true
                                    );
                                }

                            }

                        };


                        const addExtremesEvent = (): Function[] =>
                            chart.axes.map((axis): Function =>
                                addEvent(
                                    axis,
                                    'afterSetExtremes',
                                    extremesEventHandler
                                ));

                        let addExtremesEventCallbacks: Function[] =
                            addExtremesEvent();

                        const resetExtremesEvent = (): void => {
                            addExtremesEventCallbacks.forEach((callback): void => {
                                callback();
                            });
                            addExtremesEventCallbacks = [];
                        };


                        const handleChartResetSelection = (e: any): void => {
                            if ((e as any).resetSelection) {
                                resetExtremesEvent();

                                cursor.emitCursor(
                                    table,
                                    {
                                        type: 'position',
                                        state: 'chart.zoomOut'
                                    },
                                    e
                                );

                                addExtremesEventCallbacks.push(...addExtremesEvent());
                            }


                        };

                        cleanupCallbacks.push(addEvent(
                            chart,
                            'selection',
                            handleChartResetSelection
                        ));


                        cleanupCallbacks.push((): void => {
                            cursor.remitCursor(table.id, {
                                type: 'position',
                                state: 'xAxis.extremes.min'
                            });
                            cursor.remitCursor(table.id, {
                                type: 'position',
                                state: 'xAxis.extremes.max'
                            });

                            resetExtremesEvent();
                        });
                    }

                    // Return cleanup
                    return function (): void {
                        // Call back the cleanup callbacks
                        cleanupCallbacks.forEach((callback): void => {
                            callback();
                        });
                    };
                }
            }
    },
    handlers: {
        seriesVisibilityHandler:
            function (this: HighchartsComponent): (() => void) | void {
                const component = this;
                const { board } = this;

                const findSeries = (seriesArray: Series[], name: string): Series | undefined => {
                    for (const series of seriesArray) {
                        if (series.name === name) {
                            return series;
                        }
                    }
                };

                const handleShow = (e: DataCursor.Event): void => {
                    const chart = component.chart;
                    if (!chart) {
                        return;
                    }
                    if (e.cursor.type === 'position' && e.cursor.column !== void 0) {
                        const series = findSeries(chart.series, e.cursor.column);
                        if (series) {
                            series.setVisible(true, true);
                        }
                    }
                };

                const handleHide = (e: DataCursor.Event): void => {
                    const chart = component.chart;
                    if (!chart) {
                        return;
                    }
                    if (e.cursor.type === 'position' && e.cursor.column !== void 0) {
                        const series = findSeries(chart.series, e.cursor.column);
                        if (series) {
                            series.setVisible(false, true);
                        }
                    }
                };

                const registerCursorListeners = (): void => {
                    const { dataCursor } = board;

                    if (!dataCursor) {
                        return;
                    }
                    const table = this.connectorHandler?.connector?.table;

                    if (!table) {
                        return;
                    }
                    dataCursor.addListener(table.id, 'series.show', handleShow);
                    dataCursor.addListener(table.id, 'series.hide', handleHide);
                };

                const unregisterCursorListeners = (): void => {
                    const table = this.connectorHandler?.connector?.table;
                    if (table) {
                        board.dataCursor.removeListener(table.id, 'series.show', handleShow);
                        board.dataCursor.removeListener(table.id, 'series.hide', handleHide);
                    }
                };

                if (board) {
                    registerCursorListeners();
                    return unregisterCursorListeners;
                }
            },
        highlightHandler:
            function (this: HighchartsComponent): (() => void) | void {
                const { chart, board } = this;

                const getHoveredPoint = (
                    e: DataCursor.Event
                ): Point | undefined => {
                    const table = this.connectorHandler?.connector?.table;

                    if (!table) {
                        return;
                    }

                    let offset = 0;

                    const modifier = table.getModifier();

                    if (modifier && modifier.options.type === 'Range') {
                        offset = getModifiedTableOffset(
                            table, modifier.options as RangeModifierOptions
                        );
                    }

                    if (chart && chart.series.length) {
                        const cursor = e.cursor;
                        if (cursor.type === 'position') {
                            let [series] = chart.series;

                            // #20133 - Highcharts dashboards don't sync
                            // tooltips when charts have multiple series
                            if (chart.series.length > 1 && cursor.column) {
                                const relatedSeries = chart.series.filter(
                                    (series): boolean => (
                                        series.name === cursor.column
                                    )
                                );

                                if (relatedSeries.length > 0) {
                                    [series] = relatedSeries;
                                }
                            }

                            if (series?.visible && cursor.row !== void 0) {
                                const point = series.data[cursor.row - offset];
                                if (point?.graphic) {
                                    return point;
                                }
                            }
                        }
                    }
                };

                const handleCursor = (e: DataCursor.Event): void => {
                    const highlightOptions =
                        this.sync.syncConfig.highlight as Sync.HighlightSyncOptions;

                    if (!highlightOptions.enabled) {
                        return;
                    }

                    const point = getHoveredPoint(e);

                    if (!point || !chart ||
                        // Pie series points do not use the 'isInside' parameter
                        (!point.isInside && !point.series.is('pie')) ||
                        // Abort if the affected chart is the same as the one
                        // that is currently affected manually.
                        point === chart.hoverPoint
                    ) {
                        return;
                    }

                    const tooltip = chart.tooltip;

                    if (tooltip && highlightOptions.showTooltip) {
                        const useSharedTooltip = tooltip.shared;
                        const hoverPoint = chart.hoverPoint;
                        const hoverSeries = hoverPoint?.series ||
                            chart.hoverSeries;
                        const points = chart.pointer?.getHoverData(
                            point,
                            hoverSeries,
                            chart.series,
                            true,
                            true
                        );

                        if (chart.tooltip && points) {
                            tooltip.refresh(
                                useSharedTooltip ? points.hoverPoints : point
                            );
                        }
                    }

                    if (highlightOptions.highlightPoint && (
                        // If the tooltip is shared, the hover state is
                        // already set on the point.
                        (!tooltip?.shared && highlightOptions.showTooltip) ||
                        !highlightOptions.showTooltip
                    )) {
                        point.setState('hover');
                    }

                    if (highlightOptions.showCrosshair) {
                        point.series.xAxis?.drawCrosshair(void 0, point);
                        point.series.yAxis?.drawCrosshair(void 0, point);
                    }
                };

                const handleCursorOut = (e: DataCursor.Event): void => {
                    const highlightOptions =
                        this.sync.syncConfig.highlight as Sync.HighlightSyncOptions;
                    if (
                        !chart || !chart.series.length ||
                        !highlightOptions.enabled
                    ) {
                        return;
                    }

                    const point = getHoveredPoint(e);

                    // Abort if the affected chart is the same as the one
                    // that is currently affected manually.
                    if (point && (
                        !point.isInside ||
                        point === chart.hoverPoint
                    )) {
                        return;
                    }

                    let unhovered = false;
                    const unhoverAllPoints = (): void => {
                        // If the 'row' parameter is missing in the event
                        // object, the unhovered point cannot be identified.

                        const series = chart.series;
                        const seriesLength = series.length;

                        for (let i = 0; i < seriesLength; i++) {
                            const points = chart.series[i].points;
                            const pointsLength = points.length;

                            for (let j = 0; j < pointsLength; j++) {
                                points[j].setState();
                            }
                        }
                    };

                    const tooltip = chart.tooltip;
                    if (tooltip && highlightOptions.showTooltip) {
                        tooltip.hide();

                        // Shared tooltip refresh always hovers points, so it's
                        // important to unhover all points on cursor out.
                        if (tooltip.shared) {
                            unhoverAllPoints();
                            unhovered = true;
                        }
                    }

                    if (highlightOptions.highlightPoint && !unhovered) {
                        if (point) {
                            point.setState();
                        } else {
                            unhoverAllPoints();
                        }
                    }

                    if (highlightOptions.showCrosshair) {
                        if (point) {
                            point.series.xAxis?.drawCrosshair();
                            point.series.yAxis?.drawCrosshair();
                        } else {

                            // If the 'row' parameter is missing in the event
                            // object, the unhovered point cannot be identified.

                            const xAxes = chart.xAxis;
                            const yAxes = chart.yAxis;

                            for (let i = 0, l = xAxes.length; i < l; i++) {
                                xAxes[i].drawCrosshair();
                            }

                            for (let i = 0, l = yAxes.length; i < l; i++) {
                                yAxes[i].drawCrosshair();
                            }
                        }
                    }
                };

                const registerCursorListeners = (): void => {
                    const { dataCursor: cursor } = board;

                    if (cursor) {
                        const table = this.connectorHandler?.connector?.table;
                        if (table) {
                            cursor.addListener(table.id, 'point.mouseOver', handleCursor);
                            cursor.addListener(table.id, 'dataGrid.hoverRow', handleCursor);
                            cursor.addListener(table.id, 'point.mouseOut', handleCursorOut);
                            cursor.addListener(table.id, 'dataGrid.hoverOut', handleCursorOut);
                        }
                    }
                };

                const unregisterCursorListeners = (): void => {
                    const table = this.connectorHandler?.connector?.table;
                    if (table) {
                        board.dataCursor.removeListener(table.id, 'point.mouseOver', handleCursor);
                        board.dataCursor.removeListener(table.id, 'dataGrid.hoverRow', handleCursor);
                        board.dataCursor.removeListener(table.id, 'point.mouseOut', handleCursorOut);
                        board.dataCursor.removeListener(table.id, 'dataGrid.hoverOut', handleCursorOut);
                    }
                };

                if (board) {
                    registerCursorListeners();
                    return unregisterCursorListeners;
                }
            },
        extremesHandler:
            function (this: HighchartsComponent): (() => void) | void {

                const { chart, board } = this;

                if (chart && board && chart.zooming?.type) {
                    const dimensions = chart.zooming.type.split('')
                        .map((c): String => c + 'Axis') as ('xAxis'|'yAxis')[];
                    const unregisterCallbacks: (() => void)[] = [];

                    dimensions.forEach((dimension): void => {
                        const handleUpdateExtremes = (e: DataCursor.Event): void => {
                            const { cursor, event } = e;

                            if (cursor.type === 'position') {
                                const eventTarget = event && event.target as unknown as Axis;
                                if (eventTarget && chart) {
                                    const axes = chart[dimension];
                                    let didZoom = false;

                                    axes.forEach((axis): void => {
                                        if (
                                            eventTarget.coll === axis.coll &&
                                            eventTarget !== axis &&
                                            eventTarget.min !== null &&
                                            eventTarget.max !== null && (
                                                axis.max !== eventTarget.max ||
                                                axis.min !== eventTarget.min
                                            )
                                        ) {
                                            axis.setExtremes(
                                                eventTarget.min,
                                                eventTarget.max,
                                                false,
                                                void 0,
                                                {
                                                    trigger: 'dashboards-sync'
                                                }
                                            );

                                            didZoom = true;
                                        }
                                    });

                                    if (didZoom && !chart.resetZoomButton) {
                                        chart.showResetZoom();
                                    }

                                    chart.redraw();
                                }
                            }
                        };

                        const addCursorListeners = (): void => {
                            const { dataCursor: cursor } = board;
                            const connector = this.connectorHandler?.connector;

                            if (connector) {
                                const { table } = connector;
                                cursor.addListener(table.id, `${dimension}.extremes.min`, handleUpdateExtremes);
                                cursor.addListener(table.id, `${dimension}.extremes.max`, handleUpdateExtremes);

                                const handleChartZoomOut = (): void => {
                                    chart.zoomOut();

                                    setTimeout((): void => {
                                        // Workaround for zoom button not being removed
                                        const resetZoomButtons = this.element
                                            .querySelectorAll<SVGElement>('.highcharts-reset-zoom');

                                        resetZoomButtons.forEach((button): void => {
                                            button.remove();
                                        });

                                    });


                                };

                                cursor.addListener(table.id, 'chart.zoomOut', handleChartZoomOut);

                                unregisterCallbacks.push(
                                    (): void => {
                                        cursor.removeListener(table.id, `${dimension}.extremes.min`, handleUpdateExtremes);
                                        cursor.removeListener(table.id, `${dimension}.extremes.max`, handleUpdateExtremes);
                                        cursor.removeListener(table.id, 'chart.zoomOut', handleChartZoomOut);
                                    }
                                );
                            }
                        };

                        if (board) {
                            addCursorListeners();
                        }
                    });

                    return function (): void {
                        unregisterCallbacks.forEach((callback): void => {
                            callback();
                        });
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
