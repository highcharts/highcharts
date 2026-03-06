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

import type { AxisExtremesObject } from '../../../Plugins/HighchartsTypes';
import type { SyncPair } from '../../Sync/Sync';
import type NavigatorComponent from '../NavigatorComponent.js';
import type {
    CrossfilterSyncOptions
} from '../NavigatorComponentOptions';

import Component from '../../Component';
import DataModifier from '../../../../Data/Modifiers/DataModifier.js';
import NavigatorSyncUtils from './NavigatorSyncUtils.js';
import { addEvent } from '../../../../Shared/Utilities.js';

const { Filter: FilterModifier } = DataModifier.types;


/* *
 *
 *  Constants
 *
 * */

const defaultOptions: CrossfilterSyncOptions = {
    affectNavigator: false
};

const syncPair: SyncPair = {
    emitter: function (this: Component): Function | void {
        if (this.type !== 'Navigator') {
            return;
        }
        const component = this as NavigatorComponent;
        const syncOptions = this.sync.syncConfig.crossfilter;
        const groupKey = syncOptions.group ? ':' + syncOptions.group : '';

        const afterSetExtremes = async (
            extremes: AxisExtremesObject
        ): Promise<void> => {
            if (component.connectorHandlers?.[0]?.connector) {
                const table =
                    component.connectorHandlers[0].connector.getTable(),
                    dataCursor = component.board.dataCursor,
                    filterColumn = component.getColumnAssignment()[0],
                    [min, max] = component.getAxisExtremes();

                let modifier = table.getModifier();

                if (modifier instanceof FilterModifier) {
                    NavigatorSyncUtils.setRangeOptions(
                        modifier.options,
                        filterColumn,
                        min,
                        max
                    );
                } else {
                    modifier = new FilterModifier({
                        condition: {
                            operator: 'and',
                            conditions: [{
                                columnId: filterColumn,
                                operator: '>=',
                                value: min
                            }, {
                                columnId: filterColumn,
                                operator: '<=',
                                value: max
                            }]
                        }
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
            function (extremes: AxisExtremesObject): void {
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
