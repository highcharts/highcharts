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

import type { Point } from '../../../Plugins/HighchartsTypes';
import type Sync from '../../Sync/Sync';
import type HCComponent from '../HighchartsComponent.js';
import type {
    HighchartsHighlightSyncOptions
} from '../HighchartsComponentOptions';
import type { Series } from '../../../Plugins/HighchartsTypes';

import Component from '../../Component.js';
import DataCursor from '../../../../Data/DataCursor.js';
import U from '../../../Utilities.js';
const { error } = U;


/* *
 *
 *  Constants
 *
 * */

const defaultOptions: HighchartsHighlightSyncOptions = {
    affectedSeriesId: null,
    highlightPoint: true,
    showTooltip: true,
    showCrosshair: true
};

const syncPair: Sync.SyncPair = {
    emitter: function (this: Component): (() => void) | void {
        if (this.type !== 'Highcharts') {
            return;
        }
        const component = this as HCComponent;

        const { chart, board } = component;
        const highlightOptions =
            this.sync.syncConfig.highlight as HighchartsHighlightSyncOptions;
        const groupKey = highlightOptions.group ?
            ':' + highlightOptions.group : '';

        if (!highlightOptions.enabled || !chart) {
            return;
        }

        const { dataCursor: cursor } = board;
        for (let i = 0, iEnd = chart.series?.length ?? 0; i < iEnd; ++i) {
            const series = chart.series[i];
            const seriesId = series.options.id ?? '';
            const connectorHandler: HCComponent.HCConnectorHandler =
                component.seriesFromConnector[seriesId];
            const table = connectorHandler?.connector?.table;
            let columnName: string | undefined;

            if (!table) {
                continue;
            }

            const presTable = table?.modified;
            const colAssignment = connectorHandler.columnAssignment?.find(
                (s): boolean => s.seriesId === seriesId
            );
            // TODO: Better way to recognize the column name.
            if (colAssignment) {
                const { data } = colAssignment;
                if (typeof data === 'string') {
                    columnName = data;
                } else if (Array.isArray(data)) {
                    columnName = data[1];
                } else {
                    columnName = data.y ?? data.value;
                }
            }
            if (!columnName) {
                columnName = series.name;
            }

            series.update({
                point: {
                    events: {
                        // Emit table cursor
                        mouseOver: function (): void {
                            cursor.emitCursor(table, {
                                type: 'position',
                                row: presTable.getOriginalRowIndex(this.index),
                                column: columnName,
                                state: 'point.mouseOver' + groupKey
                            });
                        },
                        mouseOut: function (): void {
                            cursor.emitCursor(table, {
                                type: 'position',
                                row: presTable.getOriginalRowIndex(this.index),
                                column: columnName,
                                state: 'point.mouseOut' + groupKey
                            });
                        }
                    }
                }
            }, false);
        }
        chart.redraw();

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
    handler: function (this: Component): (() => void) | void {
        if (this.type !== 'Highcharts') {
            return;
        }
        const component = this as HCComponent;
        const groupKey = this.sync.syncConfig.highlight.group ?
            ':' + this.sync.syncConfig.highlight.group : '';

        const { chart, board } = component;

        const getHoveredPoint = (
            e: DataCursor.Event
        ): Point | undefined => {
            const { table, cursor } = e;
            const highlightOptions = this.sync
                .syncConfig.highlight as HighchartsHighlightSyncOptions;

            if (chart && chart.series?.length && cursor.type === 'position') {
                let series: Series | undefined;
                const seriesId = highlightOptions.affectedSeriesId;

                if (highlightOptions.affectedSeriesId) {
                    const foundSeries = chart.get(
                        highlightOptions.affectedSeriesId
                    ) as Series;

                    if (foundSeries?.points) {
                        series = foundSeries;
                    } else {
                        error(
                            'No series with ID \'' + seriesId + '\' found in ' +
                            'the chart. Affected series will be selected ' +
                            'according to the column assignment.'
                        );
                    }
                }

                if (!series) {
                    const seriesIds = Object.keys(
                        component.seriesFromConnector
                    );

                    for (let i = 0, iEnd = seriesIds.length; i < iEnd; ++i) {
                        const seriesId = seriesIds[i];
                        const connectorHandler: HCComponent.HCConnectorHandler =
                                component.seriesFromConnector[seriesId];

                        if (connectorHandler?.connector?.table !== table) {
                            continue;
                        }

                        const colAssignment = connectorHandler.columnAssignment;

                        series = chart.get(seriesId) as Series;
                        if (!colAssignment) {
                            break;
                        }

                        const { data } = colAssignment.find(
                            (s): boolean => s.seriesId === seriesId
                        ) ?? {};
                        if (!data || !cursor.column) {
                            break;
                        }

                        if (typeof data === 'string') {
                            if (data === cursor.column) {
                                break;
                            }
                        } else if (Array.isArray(data)) {
                            if (data.includes(cursor.column)) {
                                break;
                            }
                        } else {
                            if (
                                Object.keys(data)
                                    .map((key): string => data[key])
                                    .includes(cursor.column)
                            ) {
                                break;
                            }
                        }
                    }
                }

                const row = cursor.row;
                if (series?.visible && row !== void 0) {
                    const rowIndex = table.modified.getLocalRowIndex(row);
                    if (rowIndex === void 0) {
                        return;
                    }

                    const point = series.data[rowIndex];
                    if (point?.visible) {
                        return point;
                    }
                }
            }
        };

        const handleCursor = (e: DataCursor.Event): void => {
            const highlightOptions = this.sync
                .syncConfig.highlight as HighchartsHighlightSyncOptions;

            if (!highlightOptions.enabled) {
                return;
            }

            const point = getHoveredPoint(e);

            if (
                !point || !chart ||
                // Non-cartesian points do not use 'isInside'
                (!point.isInside && point.series.isCartesian) ||
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

                if (chart.tooltip && points?.hoverPoints.length) {
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
            const highlightOptions = this.sync
                .syncConfig.highlight as HighchartsHighlightSyncOptions;

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
                !point.isInside && point.series.isCartesian ||
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
            const { connectorHandlers } = this;
            if (!cursor) {
                return;
            }

            for (let i = 0, iEnd = connectorHandlers.length; i < iEnd; ++i) {
                const table = connectorHandlers[i]?.connector?.table;
                if (!table) {
                    continue;
                }

                cursor.addListener(
                    table.id, 'point.mouseOver' + groupKey, handleCursor
                );
                cursor.addListener(
                    table.id, 'dataGrid.hoverRow' + groupKey, handleCursor
                );
                cursor.addListener(
                    table.id, 'point.mouseOut' + groupKey, handleCursorOut
                );
                cursor.addListener(
                    table.id, 'dataGrid.hoverOut' + groupKey, handleCursorOut
                );
            }
        };

        const unregisterCursorListeners = (): void => {
            const { dataCursor: cursor } = board;
            const { connectorHandlers } = this;
            if (!cursor) {
                return;
            }

            for (let i = 0, iEnd = connectorHandlers.length; i < iEnd; ++i) {
                const table = connectorHandlers[i]?.connector?.table;
                if (!table) {
                    continue;
                }

                cursor.removeListener(
                    table.id, 'point.mouseOver' + groupKey, handleCursor
                );
                cursor.removeListener(
                    table.id, 'dataGrid.hoverRow' + groupKey, handleCursor
                );
                cursor.removeListener(
                    table.id, 'point.mouseOut' + groupKey, handleCursorOut
                );
                cursor.removeListener(
                    table.id, 'dataGrid.hoverOut' + groupKey, handleCursorOut
                );
            }
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
