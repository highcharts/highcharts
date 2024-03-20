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

import type { Axis } from '../../../Plugins/HighchartsTypes';
import type Sync from '../../Sync/Sync';
import type NavigatorComponent from '../NavigatorComponent.js';

import Component from '../../Component';
import DataModifier from '../../../../Data/Modifiers/DataModifier.js';
import NavigatorSyncUtils from './NavigatorSyncUtils.js';
import U from '../../../../Core/Utilities.js';

const { Range: RangeModifier } = DataModifier.types;
const { addEvent } = U;


/* *
 *
 *  Constants
 *
 * */

const defaultOptions: CrossfilterSyncOptions = {
    affectNavigator: false
};

const syncPair: Sync.SyncPair = {
    emitter: function (this: Component): Function | void {
        if (this.type !== 'Navigator') {
            return;
        }
        const component = this as NavigatorComponent;

        const afterSetExtremes = async (
            extremes: Axis.ExtremesObject
        ): Promise<void> => {
            if (component.connectorHandlers?.[0]?.connector) {
                const table = component.connectorHandlers[0].connector.table,
                    dataCursor = component.board.dataCursor,
                    filterColumn = component.getColumnAssignment()[0],
                    [min, max] = component.getAxisExtremes();

                let modifier = table.getModifier();

                if (modifier instanceof RangeModifier) {
                    NavigatorSyncUtils.setRangeOptions(
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
    handler: void 0
};


/* *
*
*  Declarations
*
* */

/**
 * Crossfilter sync options.
 *
 * Example:
 * ```
 * {
 *     enabled: true,
 *     affectNavigator: true
 * }
 * ```
 */
export interface CrossfilterSyncOptions extends Sync.OptionsEntry {
    /**
     * Whether this navigator component's content should be affected by
     * other navigators with crossfilter enabled.
     *
     * Try it:
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/components/crossfilter-affecting-navigators | Affect Navigators Enabled }
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/demo/sync-extremes/ | Affect Navigators Disabled }
     *
     * @default false
     */
    affectNavigator?: boolean;
}


/* *
*
*  Default export
*
* */
export default { defaultOptions, syncPair };
