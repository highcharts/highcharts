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

import type { Series } from '../../../Plugins/HighchartsTypes';
import type Sync from '../../Sync/Sync';
import type HighchartsComponent from '../HighchartsComponent.js';

import Component from '../../Component';
import DataCursor from '../../../../Data/DataCursor';

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
        const syncOptions = this.sync.syncConfig.visibility;
        const groupKey = syncOptions.group ? ':' + syncOptions.group : '';

        const { chart, board } = component;
        const connector = this.getFirstConnector();
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
                                state: 'series.show' + groupKey,
                                column: this.name
                            });
                        },
                        hide: function (): void {
                            cursor.emitCursor(table, {
                                type: 'position',
                                state: 'series.hide' + groupKey,
                                column: this.name
                            });
                        }
                    }
                }, false);
            });
            chart.redraw();
        }

        return function (): void {
            if (!chart || !chart.series?.length) {
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
    handler: function (this: Component): (() => void) | void {
        if (this.type !== 'Highcharts') {
            return;
        }
        const component = this as HighchartsComponent;
        const syncOptions = this.sync.syncConfig.visibility;
        const groupKey = syncOptions.group ? ':' + syncOptions.group : '';

        const { board } = component;

        const findSeries = (
            seriesArray: Series[],
            name: string
        ): Series | undefined => {
            for (const series of seriesArray) {
                if (series.name === name) {
                    return series;
                }
            }
        };

        const handleShow = (e: DataCursor.Event): void => {
            const chart = component.chart;
            if (!chart || !chart.series?.length) {
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
            if (!chart || !chart.series?.length) {
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
            const table = component.connectorHandlers?.[0]?.connector?.table;

            if (!table) {
                return;
            }
            dataCursor.addListener(
                table.id, 'series.show' + groupKey, handleShow
            );
            dataCursor.addListener(
                table.id, 'series.hide' + groupKey, handleHide
            );
        };

        const unregisterCursorListeners = (): void => {
            const table = component.connectorHandlers?.[0]?.connector?.table;
            if (table) {
                board.dataCursor.removeListener(
                    table.id, 'series.show' + groupKey, handleShow
                );
                board.dataCursor.removeListener(
                    table.id, 'series.hide' + groupKey, handleHide
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
