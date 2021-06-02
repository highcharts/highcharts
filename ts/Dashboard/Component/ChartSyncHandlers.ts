/* eslint-disable no-invalid-this, require-jsdoc */
import type ChartComponent from './ChartComponent';
import type Chart from '../../Core/Chart/Chart';
import type Point from '../../Core/Series/Point';
import type SharedState from './SharedComponentState';

import ComponentGroup from './ComponentGroup.js';
import U from '../../Core/Utilities.js';
const {
    addEvent
} = U;

export class ChartSyncHandler {

    public id: string;
    public presentationStateTrigger: SharedState.eventTypes;
    public func: Function;

    constructor(id: string, trigger: SharedState.eventTypes, func: Function) {
        this.id = id;
        this.presentationStateTrigger = trigger;
        this.func = func;
    }

    public createHandler(component: ChartComponent): Function {
        return (): void => {
            const { id } = component;

            const groups = ComponentGroup.getGroupsFromComponent(component.id);
            groups.forEach((group): void => {
                group.getSharedState().on(this.presentationStateTrigger, (e): void => {
                    if (id !== (e.detail ? e.detail.sender : void 0)) {
                        this.func.bind(component)(e);
                    }
                });
            });
        };
    }
}

// Two kinds: one that modifies data in table (drilldown),
// one that modifies presentationstate
export class ChartSyncEmitter {
    public id: string;
    public type: 'data' | 'presentation'; // Might not be necessary
    public func: Function;

    constructor(id: string, type: 'data' | 'presentation', func: Function) {
        this.id = id;
        this.type = type;
        this.func = func;
    }

    public createEmitter(component: ChartComponent): Function {
        return this.func.bind(component);
    }

}

/**
 * Sets dataPresentationState on chart hover events
 * @param {ChartComponent} component
 * The component to attach to
 */
export const tooltipEmitter = new ChartSyncEmitter(
    'tooltipEmitter',
    'presentation',
    function (this: ChartComponent): void {
        const { chart, id } = this;
        const groups = ComponentGroup.getGroupsFromComponent(this.id);

        if (chart) {
            const setHoverPointWithDetail = (
                hoverPoint: SharedState.PresentationHoverPointType | undefined
            ): void => {
                groups.forEach((group): void => {
                    requestAnimationFrame((): void => {
                        group.getSharedState().setHoverPoint(hoverPoint, {
                            sender: id
                        });
                    });
                });
            };

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
            });

            // Listen to the pointer to get when the hoverpoint is undefined
            addEvent(chart.pointer, 'afterGetHoverData', (): void => {
                if (chart.hoverPoint === null) {
                    setHoverPointWithDetail(void 0);
                }
            });

            // TODO: check if sticky is set, etc.
            addEvent(chart.renderTo, 'mouseleave', (): void => {
                setHoverPointWithDetail(void 0);
            });
        }
    }
);

/**
 * Handles updating dataPresentationState on series visibily changing in chart
 * @param {ChartComponent} component
 * The component to work on
 */
export const seriesVisibilityEmitter = new ChartSyncEmitter(
    'seriesVisibilityEmitter',
    'presentation',
    function (this: ChartComponent): void {
        const { chart, store, id } = this;

        addEvent(chart, 'redraw', (): void => {
            const groups = ComponentGroup.getGroupsFromComponent(this.id);
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
                if (Object.keys(visibilityMap).length) {
                    groups.forEach((group): void => {
                        group.getSharedState().setColumnVisibility(visibilityMap, {
                            sender: id
                        });
                    });
                }
            }
        });
    }
);

/**
 * Handles updating chart on series visibily changing in dataPresentationState
 */
export const seriesVisibilityHandler =
    new ChartSyncHandler(
        'seriesVisibilityHandler',
        'afterColumnVisibilityChange',
        function (this: ChartComponent, e: SharedState.ColumnVisibilityEvent): void {
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
    );

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

                if (point.visible && point.series.visible && point.x === x && point.y === y) {
                    return point;
                }
            }
        }
    }
}

/**
 * Handles changes in datapresentationstate tooltip
 * @param {chartcomponent} component
 * the component to attach to
 */
export const tooltipHandler =
    new ChartSyncHandler(
        'tooltipHandler',
        'afterHoverPointChange',
        function (this: ChartComponent, e: SharedState.PointHoverEvent): void {
            const { chart } = this;
            const { hoverPoint } = e;

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
            }
        }
    );

/**
 * Handles updating dataPresentationState on selection changing in chart
 * @param {ChartComponent} component
 * The component to work on
 */
export const selectionEmitter = new ChartSyncEmitter(
    'selectionEmitter',
    'presentation',
    function (this: ChartComponent): void {
        const {
            chart,
            store,
            id,
            options: {
                tableAxisMap
            }
        } = this;

        function getX(): string | undefined {
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
        }


        if (store && chart) {
            addEvent(chart, 'selection', (e): void => {
                const groups = ComponentGroup.getGroupsFromComponent(id);
                if ((e as any).resetSelection) {
                    const selection: SharedState.selectionObjectType = {};
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
);

/**
 * Handles changes in datapresentationstate selection
 */
export const selectionHandler =
    new ChartSyncHandler(
        'selectionHandler',
        'afterSelectionChange',
        function (this: ChartComponent, e: SharedState.SelectionEvent): void {

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
    );

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

export const panEmitter = new ChartSyncEmitter(
    'panEmitter',
    'presentation',
    function (this: ChartComponent): void {
        const { store, chart, id } = this;
        if (store && chart) {
            const ticks: number[] = [];
            addEvent(chart, 'pan', (): void => {
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
);

export const defaults: Record<string, { emitter: ChartSyncEmitter; handler: ChartSyncHandler }> = {
    panning: { emitter: panEmitter, handler: selectionHandler },
    selection: { emitter: selectionEmitter, handler: selectionHandler },
    tooltip: { emitter: tooltipEmitter, handler: tooltipHandler },
    visibility: { emitter: seriesVisibilityEmitter, handler: seriesVisibilityHandler }
};
