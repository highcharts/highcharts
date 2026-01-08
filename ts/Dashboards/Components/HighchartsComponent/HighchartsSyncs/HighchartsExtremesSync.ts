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

import type { Axis, Series } from '../../../Plugins/HighchartsTypes';
import type Sync from '../../Sync/Sync';
import type HighchartsComponent from '../HighchartsComponent.js';
import type { ConnectorOptions } from '../HighchartsComponentOptions';

import Component from '../../Component';
import DataCursor from '../../../../Data/DataCursor';
import U from '../../../../Core/Utilities.js';
const { addEvent, isString } = U;


/* *
 *
 *  Constants
 *
 * */

const defaultOptions: Sync.OptionsEntry = {};

const syncPair: Sync.SyncPair = {
    emitter: function (this: Component): (() => void) | void {
        if (this.type !== 'Highcharts') {
            return;
        }
        const component = this as HighchartsComponent;

        const cleanupCallbacks: Function[] = [];

        const { chart, board } = component;
        const connector = component.connectorHandlers?.[0]?.connector;
        const table = connector && connector.getTable();
        const syncOptions = this.sync.syncConfig.extremes;
        const groupKey = syncOptions.group ?
            ':' + syncOptions.group : '';

        const { dataCursor: cursor } = board;

        if (table && chart) {
            const extremesEventHandler = (e: any): void => {
                const reset = !!(e as any).resetSelection;
                if ((!e.trigger || (
                    e.trigger && e.trigger !== 'dashboards-sync'
                )) && !reset) {
                    // TODO: investigate this type?
                    const axis = e.target as unknown as Axis;

                    const seriesFromConnectorArray = Object.keys(
                        component.seriesFromConnector
                    );

                    // Prefer a series that's in a related table,
                    // but allow for other data
                    const series = seriesFromConnectorArray.length > 0 ?
                        chart.get(seriesFromConnectorArray[0]) as Series :
                        axis.series[0];

                    if (series) {
                        // Get the indexes of the first and last drawn points
                        const visiblePoints = series.points.filter(
                            (point): boolean => point.isInside || false
                        );

                        const minCursorData: DataCursor.Type = {
                            type: 'position',
                            state: `${axis.coll}.extremes.min${groupKey}`
                        };

                        const maxCursorData: DataCursor.Type = {
                            type: 'position',
                            state: `${axis.coll}.extremes.max${groupKey}`
                        };

                        if (
                            seriesFromConnectorArray.length > 0 &&
                            axis.coll === 'xAxis' &&
                            visiblePoints.length
                        ) {
                            let columnId: string | undefined;
                            const columnAssignment = (
                                component.connectorHandlers[0]
                                    ?.options as ConnectorOptions
                            ).columnAssignment;

                            if (columnAssignment) {
                                const assignment = columnAssignment.find(
                                    (assignment): boolean => (
                                        assignment.seriesId ===
                                            series.options.id
                                    )
                                );

                                if (assignment) {
                                    const data = assignment.data;
                                    if (isString(data)) {
                                        columnId = data;
                                    } else if (Array.isArray(data)) {
                                        columnId = data[data.length - 1];
                                    } else {
                                        columnId = data.y;
                                    }
                                }
                            }

                            if (!columnId) {
                                columnId = axis.dateTime && (
                                    table.hasColumns(['x']) ? 'x' :
                                        series.options.id ?? series.name
                                );
                            }

                            minCursorData.row = visiblePoints[0].index;
                            minCursorData.column = columnId;

                            maxCursorData.row =
                                visiblePoints[visiblePoints.length - 1].index;
                            maxCursorData.column = columnId;
                        }

                        // Emit as lasting cursors
                        cursor.emitCursor(
                            table,
                            minCursorData,
                            e as any,
                            true
                        ).emitCursor(
                            table,
                            maxCursorData,
                            e as any,
                            true
                        );
                    }

                }

            };


            const addExtremesEvent = (): Function[] =>
                chart.axes.map((axis): Function => addEvent(
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
                            state: 'chart.zoomOut' + groupKey
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
                    state: 'xAxis.extremes.min' + groupKey
                });
                cursor.remitCursor(table.id, {
                    type: 'position',
                    state: 'xAxis.extremes.max' + groupKey
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
    },
    handler: function (this: Component): (() => void) | void {
        if (this.type !== 'Highcharts') {
            return;
        }
        const component = this as HighchartsComponent;
        const syncOptions = this.sync.syncConfig.extremes;
        const groupKey = syncOptions.group ?
            ':' + syncOptions.group : '';

        const { chart, board } = component;

        if (chart && board && chart.zooming?.type) {
            const dimensions = chart.zooming.type.split('')
                .map((c): string => c + 'Axis') as ('xAxis'|'yAxis')[];
            const unregisterCallbacks: (() => void)[] = [];

            dimensions.forEach((dimension): void => {
                const handleUpdateExtremes = (e: DataCursor.Event): void => {
                    const { cursor, event } = e;

                    if (cursor.type === 'position') {
                        const eventTarget = event?.target as unknown as Axis;
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
                    const connector =
                        component.connectorHandlers?.[0]?.connector;

                    if (connector) {
                        const table = connector.getTable();
                        cursor.addListener(
                            table.id,
                            `${dimension}.extremes.min${groupKey}`,
                            handleUpdateExtremes
                        );
                        cursor.addListener(
                            table.id,
                            `${dimension}.extremes.max${groupKey}`,
                            handleUpdateExtremes
                        );

                        const handleChartZoomOut = (): void => {
                            chart.zoomOut();

                            setTimeout((): void => {
                                // Workaround for zoom button not being removed
                                const resetZoomButtons = component.element
                                    .querySelectorAll<SVGElement>('.highcharts-reset-zoom');

                                resetZoomButtons.forEach((button): void => {
                                    button.remove();
                                });

                            });


                        };

                        cursor.addListener(
                            table.id, 'chart.zoomOut', handleChartZoomOut
                        );

                        unregisterCallbacks.push(
                            (): void => {
                                cursor.removeListener(
                                    table.id,
                                    `${dimension}.extremes.min${groupKey}`,
                                    handleUpdateExtremes
                                );
                                cursor.removeListener(
                                    table.id,
                                    `${dimension}.extremes.max${groupKey}`,
                                    handleUpdateExtremes
                                );
                                cursor.removeListener(
                                    table.id,
                                    'chart.zoomOut' + groupKey,
                                    handleChartZoomOut
                                );
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
};


/* *
*
*  Default export
*
* */
export default { defaultOptions, syncPair };
