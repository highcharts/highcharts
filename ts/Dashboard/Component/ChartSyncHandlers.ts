import type ChartComponent from './ChartComponent';
import type Chart from '../../Core/Chart/Chart';
import type PointType from '../../Core/Series/PointType';
import type Point from '../../Core/Series/Point';
import U from '../../Core/Utilities.js';
const {
    addEvent
} = U;

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
 * @param {ChartComponent} component
 * The component to work on
 */
export function seriesVisibilityHandler(component: ChartComponent): void {
    const { store, chart, id } = component;

    if (store && chart) {
        store.table.presentationState.on('afterColumnVisibilityChange', (e): void => {
            if (e.detail?.sender !== id) {
                const { visibilityMap } = e as any;
                chart.series.forEach((series): void => {
                    const seriesID = series.options.id;
                    if (seriesID && typeof visibilityMap[seriesID] === 'boolean') {
                        series.setVisible(visibilityMap[seriesID], false);
                    }
                });
            }
        });
    }
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
function findMatchingPoint(chart: Chart, hoverPoint: Point): PointType | undefined {
    const { x, y, series } = hoverPoint;

    for (let i = 0; i < chart.series.length; i++) {
        if (chart.series[i].options.id === series.options.id) {
            const { points } = chart.series[i];
            for (let j = 0; j < points.length; j++) {
                const point = points[j];
                if (point.x === x && point.y === y) {
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
export function tooltipHandler(component: ChartComponent): void {
    const { store, chart, id } = component;
    if (store && chart) {
        store.table.presentationState.on('afterHoverPointChange', (e): void => {
            if (e.detail?.sender !== id) {
                if (store.table.presentationState.getHoverPoint() === void 0 && !chart.hoverPoint) {
                    chart.tooltip?.hide();
                }
                if ((e as any).hoverPoint && chart) {
                    const match = findMatchingPoint(chart, (e as any).hoverPoint);
                    if (match) {
                        chart.tooltip?.refresh(match);
                    }
                }
            }
        });
    }
}

/**
 * Handles updating dataPresentationState on selection changing in chart
 * @param {ChartComponent} component
 * The component to work on
 */
export function selectionEmitter(component: ChartComponent): void {
    const { chart, store, id } = component;

    if (store && chart) {
        addEvent(chart, 'selection', (e: any): void => {
            if (!e.resetSelection) {
                if (e.xAxis.length) {
                    store.table.presentationState.setSelection('xAxis', { min: e.xAxis[0].min, max: e.xAxis[0].max }, {
                        sender: id
                    });
                }
                return;
            }

            if (e.resetSelection) {
                store.table.presentationState.setSelection('xAxis', { min: void 0, max: void 0 }, {
                    sender: id
                });
            }

        });
    }
}

/**
 * Handles changes in datapresentationstate selection
 * @param {chartcomponent} component
 * the component to attach to
 */
export function selectionHandler(component: ChartComponent): void {
    const { store, chart, id } = component;
    if (store && chart) {
        store.table.presentationState.on('afterSelectionChange', (e: any): void => {
            if (e.detail?.sender !== id) {
                if (e.selection.xAxis) {
                    const { min, max } = e.selection.xAxis;
                    if (min || max) {
                        chart.xAxis.forEach((axis): void => {
                            axis.zoom(min, max);
                        });
                        chart.showResetZoom();
                    }
                    // Reset the zoom if both are undefined
                    if (!min && !max) {
                        chart.zoom({ resetSelection: true } as any); // Not allowed by TS, but works
                        if (chart.resetZoomButton) {
                            chart.resetZoomButton = chart.resetZoomButton.destroy();
                        }
                    }

                    chart.redraw();
                }
            }
        });
    }
}
