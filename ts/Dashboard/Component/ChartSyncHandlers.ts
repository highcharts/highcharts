import type ChartComponent from './ChartComponent';
import type Chart from '../../Core/Chart/Chart';
import type Point from '../../Core/Series/Point';
import type DataPresentationState from '../../Data/DataPresentationState';
import U from '../../Core/Utilities.js';
const {
    addEvent
} = U;

/* eslint-disable no-invalid-this, require-jsdoc */
export class ChartSyncHandler {

    public id: string;
    public presentationStateTrigger: DataPresentationState.eventTypes;
    public func: Function;

    constructor(id: string, trigger: DataPresentationState.eventTypes, func: Function) {
        this.id = id;
        this.presentationStateTrigger = trigger;
        this.func = func;
    }

    public createHandler(component: ChartComponent): Function {
        return (): void => {
            const { store, chart, id } = component;
            if (store && chart) {
                store.table.getPresentationState().on(this.presentationStateTrigger, (e): void => {
                    if (id !== e.detail?.sender) {
                        this.func.bind(component)(e);
                    }
                });
            }
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
        const { chart, store, id } = this;
        if (chart && store) {
            const setHoverPointWithDetail = (
                hoverPoint: DataPresentationState.PresentationHoverPointType | undefined
            ): void => {
                requestAnimationFrame((): void => {
                    store.table.getPresentationState().setHoverPoint(hoverPoint, {
                        sender: id
                    });
                });
            };

            // Listen for the tooltip changes
            addEvent(chart.tooltip, 'refresh', (): void => {
                const isSamePoint = (
                    pointA?: DataPresentationState.PresentationHoverPointType,
                    pointB?: DataPresentationState.PresentationHoverPointType
                ): boolean => {
                    if (!pointA || !pointB) {
                        return false;
                    }

                    return pointA.x === pointB.x && pointA.y === pointB.y;
                };

                if (!isSamePoint(store.table.getPresentationState().getHoverPoint(), chart.hoverPoint)) {
                    setHoverPointWithDetail(chart.hoverPoint);
                }
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
            if (
                store && // has a store
                chart?.hasRendered
            ) {
                const { series } = chart;
                const visibilityMap: Record<string, boolean> = {};
                for (let i = 0; i < series.length; i++) {
                    const seriesID = series[i].options.id;
                    if (seriesID) {
                        visibilityMap[seriesID] = series[i].visible;
                    }
                }
                if (Object.keys(visibilityMap)?.length) {
                    store.table.getPresentationState().setColumnVisibility(visibilityMap, {
                        sender: id
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
        function (this: ChartComponent, _e: DataPresentationState.ColumnVisibilityEventObject): void {
            const { chart, store } = this;
            if (store) {
                const presentationState = store.table.getPresentationState();

                chart.series.forEach((series): void => {
                    const seriesID = series.options.id;
                    if (seriesID) {
                        series.setVisible(presentationState.getColumnVisibility(seriesID), false);
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
    hoverPoint: DataPresentationState.PresentationHoverPointType
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
        function (this: ChartComponent, _e: DataPresentationState.PointHoverEventObject): void {
            const { chart } = this;
            const hoverPoint = this.store?.table.getPresentationState().getHoverPoint();
            if (hoverPoint === void 0 && !chart.hoverPoint) {
                chart.tooltip?.hide();
            }
            if (hoverPoint && chart.tooltip) {
                const match = findMatchingPoint(chart, hoverPoint);
                if (match) {
                    chart.tooltip?.refresh(match);
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
        const { chart, store, id } = this;

        if (store && chart) {
            addEvent(chart, 'selection', (e): void => {
                if ((e as any).resetSelection) {
                    const selection: DataPresentationState.selectionObjectType = {};
                    chart.axes.forEach((axis): void => {
                        selection[axis.coll] = {};
                    });

                    store.table.getPresentationState().setSelection(selection, true, {
                        sender: id
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
                        store.table.getPresentationState().setSelection(
                            { [coll]: extremes },
                            false,
                            {
                                sender: id
                            }
                        );
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
        function (this: ChartComponent, e?: DataPresentationState.SelectionEventObject): void {

            const { chart } = this;
            // Reset the zoom if the source is the reset button
            if (e?.reset) {
                chart.zoom({ resetSelection: true } as any); // Not allowed by TS, but works
                return;
            }

            const selectionAxes = this.store?.table.getPresentationState().getSelection();
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
    );

function getAxisMinMaxMap(chart: Chart): Array<{
    coll: string;
    extremes: { min: number | undefined; max: number | undefined };
}> {
    return chart.axes
        .filter((axis): boolean => (chart.options.chart?.zoomType || '')
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
                        store.table.getPresentationState().setSelection(
                            { [coll]: extremes },
                            false,
                            {
                                sender: id
                            }
                        );
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
