/* *
 *
 *  (c) 2012-2021 Highsoft AS
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

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type SharedState from '../../Dashboard/Component/SharedComponentState';
import type Sync from '../../Dashboard/Component/Sync/Sync';

import ComponentGroup from '../../Dashboard/Component/ComponentGroup.js';
import ComponentTypes from '../../Dashboard/Component/ComponentType';
import DataGridComponent from './DataGridComponent.js';
import U from '../../Core/Utilities.js';
const { addEvent } = U;


const configs: {
    handlers: Record<string, Sync.HandlerConfig>;
    emitters: Record<string, Sync.EmitterConfig>;
} = {
    emitters: {
        tooltipEmitter: [
            'tooltipEmitter',
            function (this: ComponentTypes): Function | void {
                if (this instanceof DataGridComponent) {
                    const { dataGrid, id } = this;
                    const groups = ComponentGroup.getGroupsFromComponent(this.id);

                    if (dataGrid) {
                        const setHoverPointWithDetail = (hoverRow: any): void => {
                            groups.forEach((group): void => {
                                requestAnimationFrame((): void => {
                                    group.getSharedState().setHoverPoint(hoverRow, {
                                        isDataGrid: true,
                                        sender: id
                                    });
                                });
                            });
                        };

                        const callbacks = [
                            addEvent(dataGrid.container, 'dataGridHover', (e: any): void => {
                                const row = e.row;
                                setHoverPointWithDetail(row);
                            })
                        ];

                        // Return a function that calls the callbacks
                        return function (): void {
                            callbacks.forEach((callback): void => callback());
                        };
                    }
                }
            }
        ]
    },
    handlers: {
        tooltipHandler: [
            'tooltipHandler',
            'afterHoverPointChange',
            function (this: DataGridComponent, e: SharedState.PointHoverEvent): void {
                const { dataGrid } = this;

                if (dataGrid) {
                    if (e.hoverPoint) {
                        const point = e.hoverPoint,
                            pointIndex = point.index || point.x || 0;

                        dataGrid.toggleRowHighlight(dataGrid.rowElements[pointIndex]);
                        dataGrid.hoveredRow = dataGrid.rowElements[pointIndex];
                    }
                }
            }
        ]
    }
};

const defaults: Sync.OptionsRecord = {
    tooltip: { emitter: configs.emitters.tooltipEmitter, handler: configs.handlers.tooltipHandler }
};

export default defaults;
