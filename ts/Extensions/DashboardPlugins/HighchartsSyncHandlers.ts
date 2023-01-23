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

import type Chart from '../../Core/Chart/Chart';
import type Point from '../../Core/Series/Point';
import type SharedState from '../../Dashboards/Component/SharedComponentState';
import type Sync from '../../Dashboards/Component/Sync/Sync';

import ComponentTypes from '../../Dashboards/Component/ComponentType';
import ComponentGroup from '../../Dashboards/Component/ComponentGroup.js';
import HighchartsComponent from './HighchartsComponent.js';
import U from '../../Core/Utilities.js';
const { addEvent } = U;


/* *
 *
 *  Declarations
 *
 * */

declare global {
    interface Window {
        HighchartsComponent?: typeof HighchartsComponent;
    }
}


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
        tooltipEmitter: [
            'tooltipEmitter',
            function (this: ComponentTypes): Function | void {
                if (this instanceof (HighchartsComponent || window.HighchartsComponent)) {
                    const { chart, id } = this;
                    const groups = ComponentGroup.getGroupsFromComponent(this.id);

                    if (chart) {
                        const setHoverPointWithDetail = (
                            hoverPoint?: SharedState.PresentationHoverPointType
                        ): void => {
                            groups.forEach((group): void => {
                                requestAnimationFrame((): void => {
                                    group.getSharedState().setHoverPoint(hoverPoint, {
                                        sender: id
                                    });
                                });
                            });
                        };

                        const callbacks = [
                            // Listen for the tooltip changes
                            addEvent(chart.tooltip, 'refresh', (): void => {
                                const isSamePoint = (
                                    pointA?: SharedState.PresentationHoverPointType,
                                    pointB?: SharedState.PresentationHoverPointType
                                ): boolean => {
                                    if (!pointA || !pointB) {
                                        return false;
                                    }

                                    return pointA.x === pointB.x && pointA.y === pointB.y;
                                };
                                groups.forEach((group): void => {
                                    if (!isSamePoint(group.getSharedState().getHoverPoint(), chart.hoverPoint)) {
                                        setHoverPointWithDetail(chart.hoverPoint);
                                    }
                                });
                            }),

                            // Listen to the pointer to get when the hoverpoint is undefined
                            addEvent(chart.pointer, 'afterGetHoverData', (): void => {
                                if (chart.hoverPoint === null) {
                                    setHoverPointWithDetail();
                                }
                            }),

                            // TODO: check if sticky is set, etc.
                            addEvent(chart.renderTo, 'mouseleave', (): void => {
                                setHoverPointWithDetail();
                            })
                        ];

                        // Return a function that calls the callbacks
                        return function (): void {
                            callbacks.forEach((callback): void => callback());
                        };
                    }
                }
            }
        ],
        seriesVisibilityEmitter: [
            'seriesVisibilityEmitter',
            function (this: ComponentTypes): Function | void {
                if (this instanceof (HighchartsComponent || window.HighchartsComponent)) {
                    const component = this;
                    return addEvent(component.chart, 'redraw', function (): void {
                        const { chart, store, id, activeGroup } = component;
                        if (
                            store && // has a store
                            chart &&
                            chart.hasRendered
                        ) {
                            const { series } = chart;
                            const visibilityMap: Record<string, boolean> = {};
                            for (let i = 0; i < series.length; i++) {
                                const seriesID = series[i].options.id;
                                if (seriesID) {
                                    visibilityMap[seriesID] = series[i].visible;
                                }
                            }
                            if (Object.keys(visibilityMap).length && activeGroup) {
                                activeGroup.getSharedState().setColumnVisibility(visibilityMap, {
                                    sender: id
                                });
                            }

                        }
                    });
                }
            }
        ],
        panEmitter: [
            'panEmitter',
            function (this: ComponentTypes): Function | void {
                if (this instanceof (HighchartsComponent || window.HighchartsComponent)) {
                    const { store, chart, id } = this;
                    if (store && chart) {
                        const ticks: number[] = [];
                        return addEvent(chart, 'pan', (): void => {
                            const groups = ComponentGroup.getGroupsFromComponent(id);
                            // Cancel previous ticks
                            while (ticks.length) {
                                const tick = ticks.pop();
                                if (tick) {
                                    clearTimeout(tick);
                                }
                            }

                            ticks.push(setTimeout((): void => {
                                const minMaxes = getAxisMinMaxMap(chart);
                                minMaxes.forEach((minMax): void => {
                                    const { coll, extremes } = minMax;
                                    groups.forEach((group): void => {
                                        group.getSharedState().setSelection(
                                            { [coll]: extremes },
                                            false,
                                            {
                                                sender: id
                                            }
                                        );
                                    });
                                });
                            }, 100));
                        });
                    }
                }
            }
        ],
        selectionEmitter: [
            'selectionEmitter',
            function (this: ComponentTypes): Function | void {
                if (this instanceof (HighchartsComponent || window.HighchartsComponent)) {
                    const {
                        chart,
                        store,
                        id,
                        options: {
                            tableAxisMap
                        }
                    } = this;

                    const getX = (): string | undefined => {
                        if (tableAxisMap) {
                            const keys = Object.keys(tableAxisMap);

                            let i = 0;
                            while (i < keys.length) {
                                const key = keys[i];
                                if (tableAxisMap[key] === 'x') {
                                    return key;
                                }

                                i++;
                            }
                        }
                    };

                    if (store && chart) {
                        return addEvent(chart, 'selection', (e): void => {
                            const groups = ComponentGroup.getGroupsFromComponent(id);
                            if ((e as any).resetSelection) {
                                const selection: SharedState.SelectionObjectType = {};
                                chart.axes.forEach((axis): void => {
                                    selection[axis.coll] = {
                                        columnName: axis.coll === 'xAxis' ? getX() : void 0
                                    };
                                });

                                groups.forEach((group): void => {
                                    group.getSharedState().setSelection(selection, true, {
                                        sender: id
                                    });
                                });

                                if (chart.resetZoomButton) {
                                    chart.resetZoomButton = chart.resetZoomButton.destroy();
                                }
                                return;
                            }

                            // Smooth it out a bit
                            requestAnimationFrame((): void => {
                                const minMaxes = getAxisMinMaxMap(chart);
                                minMaxes.forEach((minMax): void => {
                                    const { coll, extremes } = minMax;
                                    groups.forEach((group): void => {
                                        group.getSharedState().setSelection(
                                            { [coll]: { ...extremes, columnName: coll === 'xAxis' ? getX() : void 0 } },
                                            false,
                                            {
                                                sender: id
                                            }
                                        );
                                    });
                                });
                            });
                        });
                    }
                }
            }
        ]
    },
    handlers: {
        seriesVisibilityHandler: [
            'seriesVisibilityHandler',
            'afterColumnVisibilityChange',
            function (this: HighchartsComponent, e: SharedState.ColumnVisibilityEvent): void {
                const { chart, store } = this;
                if (store && chart) {
                    chart.series.forEach((series): void => {
                        const seriesID = series.options.id;
                        if (seriesID) {
                            series.setVisible(e.visibilityMap[seriesID], false);
                        }
                    });
                }
            }
        ],
        tooltipHandler: [
            'tooltipHandler',
            'afterHoverPointChange',
            function (this: HighchartsComponent, e: SharedState.PointHoverEvent): void {
                const { chart } = this;
                const { hoverPoint, hoverRow } = e;

                if (chart && chart.tooltip) {
                    if (hoverPoint === void 0 && !chart.hoverPoint) {
                        chart.tooltip.hide();
                    }
                    if (hoverPoint) {
                        const match = findMatchingPoint(chart, hoverPoint);
                        if (match) {
                            chart.tooltip.refresh(match);
                        }
                    }

                    if (hoverRow && hoverRow.dataset.rowXIndex) {
                        chart.series[0].points.forEach((point): void => {
                            if (String(point.x) === hoverRow.dataset.rowXIndex) {
                                chart.tooltip && chart.tooltip.refresh(point);
                            }
                        });
                    }
                }
            }
        ],
        selectionHandler: [
            'selectionHandler',
            'afterSelectionChange',
            function (this: HighchartsComponent, e: SharedState.SelectionEvent): void {
                const { chart } = this;
                if (chart) {
                    // Reset the zoom if the source is the reset button
                    if (e.reset) {
                        chart.zoom({ resetSelection: true } as any); // Not allowed by TS, but works
                        return;
                    }

                    const { selection: selectionAxes } = e;
                    if (selectionAxes) {
                        Object.keys(selectionAxes).forEach((axisName: string): void => {
                            const selectionAxis = selectionAxes[axisName];
                            if (selectionAxis) {
                                const { min, max } = selectionAxis;
                                chart.axes.forEach((axis): void => {
                                    if (axis.coll === axisName && axis.zoomEnabled) {
                                        if (typeof min === 'number' && typeof max === 'number') {
                                            axis.zoom(min, max);

                                            if (!chart.resetZoomButton) {
                                                chart.showResetZoom();
                                            }
                                        }
                                    }
                                });
                            }

                            chart.redraw();
                        });
                    }
                }
            }
        ]
    }
};

const defaults: Sync.OptionsRecord = {
    panning: { emitter: configs.emitters.panEmitter, handler: configs.handlers.selectionHandler },
    selection: { emitter: configs.emitters.selectionEmitter, handler: configs.handlers.selectionHandler },
    tooltip: { emitter: configs.emitters.tooltipEmitter, handler: configs.handlers.tooltipHandler },
    visibility: { emitter: configs.emitters.seriesVisibilityEmitter, handler: configs.handlers.seriesVisibilityHandler }
};

export default defaults;
