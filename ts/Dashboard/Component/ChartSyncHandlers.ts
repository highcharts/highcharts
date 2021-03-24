import type ChartComponent from './ChartComponent';
import type Chart from '../../Core/Chart/Chart';
import type PointType from '../../Core/Series/PointType';
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

    public createEmitter(component: ChartComponent): Function {
        return (): void => {
            const { store, chart, id } = component;
            if (store && chart) {
                store.table.presentationState.on(this.presentationStateTrigger, (e): void => {
                    if (id !== e.detail?.sender) {
                        this.func.bind(chart)(e);
                    }
                });
            }
        };
    }
}

/**
 * Sets dataPresentationState on chart hover events
 * @param {ChartComponent} component
 * The component to attach to
 */
export function tooltipEmitter(component: ChartComponent): void {
    const { chart, store, syncEvents, id } = component;
    if (chart && store && syncEvents.indexOf('tooltip') > -1) {

        const setHoverPointWithDetail = (hoverPoint: Point | undefined): void => {
            store.table.presentationState.setHoverPoint(hoverPoint, {
                sender: id
            });
        };

        // Listen for the tooltip changes
        addEvent(chart.tooltip, 'refresh', (): void => {
            const isSameishPoint = (pointA: any, pointB: any): boolean => {
                if (!pointA || !pointB) {
                    return false;
                }

                return pointA.x === pointB.x && pointA.y === pointB.y;
            };

            if (!isSameishPoint(store.table.presentationState.getHoverPoint(), true)) {
                setHoverPointWithDetail(chart.hoverPoint);
            }
        });

        // Listen to the pointer to get when the hoverpoint is undefined
        addEvent(chart.pointer, 'afterGetHoverData', (): void => {
            if (chart.hoverPoint === null) {
                setHoverPointWithDetail(void 0);
            }
        });

        // When the mouse leaves the chart we also set the state to undefined
        // TODO: check if sticky is set, etc.
        addEvent(chart.renderTo, 'mouseleave', (): void => {
            setHoverPointWithDetail(void 0);
        });

    }
}

/**
 * Handles updating dataPresentationState on series visibily changing in chart
 * @param {ChartComponent} component
 * The component to work on
 */
export function seriesVisibilityEmitter(component: ChartComponent): void {
    const { chart, store, syncEvents, id } = component;

    addEvent(chart, 'redraw', (): void => {
        if (
            store && // has a store
            chart?.hasRendered &&
            (syncEvents.indexOf('visibility') > -1)
        ) {
            const { series } = chart;
            const visibilityList: Array<[string, boolean]> = [];
            for (let i = 0; i < series.length; i++) {
                const seriesID = series[i].options.id;
                if (seriesID) {
                    visibilityList.push([seriesID, series[i].visible]);
                }
            }
            if (visibilityList?.length) {
                store.table.presentationState.setColumnVisibility(visibilityList, {
                    sender: id
                });
            }
        }
    });
}

/**
 * Handles updating chart on series visibily changing in dataPresentationState
 */
export const seriesVisibilityHandler =
    new ChartSyncHandler(
        'seriesVisibilityHandler',
        'afterColumnVisibilityChange',
        function (this: Chart, e: DataPresentationState.ColumnVisibilityEventObject): void {
            const { visibilityMap } = e;
            this.series.forEach((series): void => {
                const seriesID = series.options.id;
                if (seriesID && typeof visibilityMap[seriesID] === 'boolean') {
                    series.setVisible(visibilityMap[seriesID], false);
                }
            });
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
function findMatchingPoint(chart: Chart, hoverPoint: Point): PointType | undefined {
    const { x, y, series } = hoverPoint;

    for (let i = 0; i < chart.series.length; i++) {
        if (chart.series[i].options.id === series.options.id) {
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
        function (this: Chart, e: DataPresentationState.PointHoverEventObject): void {
            if (e.hoverPoint === void 0 && !this.hoverPoint) {
                this.tooltip?.hide();
            }
            if ((e as any).hoverPoint && this.tooltip) {
                const match = findMatchingPoint(this, (e as any).hoverPoint);
                if (match) {
                    this.tooltip?.refresh(match);
                }
            }
        }
    );

/**
 * Handles updating dataPresentationState on selection changing in chart
 * @param {ChartComponent} component
 * The component to work on
 */
export function selectionEmitter(component: ChartComponent): void {
    const { chart, store, id } = component;

    if (store && chart) {
        addEvent(chart, 'selection', (e): void => {
            if ((e as any).resetSelection) {
                chart.axes.forEach((axis): void => {
                    store.table.presentationState.setSelection(axis.coll, { min: void 0, max: void 0 }, {
                        sender: id
                    },
                    true
                    );
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
                    store.table.presentationState.setSelection(
                        coll,
                        extremes,
                        {
                            sender: id
                        }
                    );
                });
            });

        });
    }
}

/**
 * Handles changes in datapresentationstate selection
 */
export const selectionHandler =
    new ChartSyncHandler(
        'selectionHandler',
        'afterSelectionChange',
        function (this: Chart, e: DataPresentationState.SelectionEventObject): void {
            // Reset the zoom if the source is the reset button
            if (e.reset) {
                this.zoom({ resetSelection: true } as any); // Not allowed by TS, but works
                return;
            }

            const selectionAxes = e.selection;
            Object.keys(selectionAxes).forEach((axisName: string): void => {
                const selectionAxis = selectionAxes[axisName];
                if (selectionAxis) {
                    const { min, max } = selectionAxis;
                    this.axes.forEach((axis): void => {
                        if (axis.coll === axisName && axis.zoomEnabled) {
                            if (typeof min === 'number' && typeof max === 'number') {
                                axis.zoom(min, max);

                                if (!this.resetZoomButton) {
                                    this.showResetZoom();
                                }
                            }
                        }
                    });
                }

                this.redraw();
            });
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

export function panEmitter(component: ChartComponent): void {
    const { store, chart, id } = component;
    if (store && chart) {
        addEvent(chart, 'pan', (): void => {
            requestAnimationFrame((): void => {
                const minMaxes = getAxisMinMaxMap(chart);
                minMaxes.forEach((minMax): void => {
                    const { coll, extremes } = minMax;
                    store.table.presentationState.setSelection(
                        coll,
                        extremes,
                        {
                            sender: id
                        }
                    );
                });
            });
        });
    }
}
