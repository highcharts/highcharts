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
import type {
    CrossfilterSyncOptions
} from '../NavigatorComponentOptions';

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
        const syncOptions = this.sync.syncConfig.crossfilter;
        const groupKey = syncOptions.group ? ':' + syncOptions.group : '';

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
                        type: 'position',
                        column: filterColumn,
                        row: table.getRowIndexBy(filterColumn, min),
                        state: 'crossfilter' + groupKey
                    },
                    extremes as unknown as Event
                );

                dataCursor.emitCursor(
                    table,
                    {
                        type: 'position',
                        column: filterColumn,
                        row: table.getRowIndexBy(filterColumn, max),
                        state: 'crossfilter' + groupKey
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
*  Default export
*
* */
export default { defaultOptions, syncPair };
