/* *
 *
 *  Imports
 *
 * */

import type BBoxObject from '../../Core/Renderer/BBoxObject';
import type Chart from '../../Core/Chart/Chart';
import type Pane from './Pane';
import type Pointer from '../../Core/Pointer';
import type Series from '../../Core/Series/Series';

import U from '../../Core/Utilities.js';
import { defined, pick } from '../../Shared/Utilities.js';
const {
    addEvent,
    correctFloat
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Chart/ChartBase'{
    interface ChartBase {
        hoverPane?: Pane;
        pane?: Array<Pane>;
        getHoverPane?(eventArgs: any): (Pane|undefined);
    }
}

export interface PaneChart extends Chart {
    hoverPane?: Pane;
    pane: Array<Pane>;
    getHoverPane(eventArgs: any): (Pane|undefined);
}

/* *
 *
 *  Functions
 *
 * */

/** @internal */
function chartGetHoverPane(
    this: PaneChart,
    eventArgs: {
        chartX: number;
        chartY: number;
        shared: boolean|undefined;
        filter?: Function;
    }
): (Pane|undefined) {
    const chart = this;
    let hoverPane;
    if (eventArgs) {
        chart.pane.forEach((pane): void => {
            const x = eventArgs.chartX - chart.plotLeft,
                y = eventArgs.chartY - chart.plotTop;

            if (isInsidePane(x, y, pane.center)) {
                hoverPane = pane;
            }
        });
    }
    return hoverPane;
}

/**
 * Adjusts the clipBox based on the position of panes.
 * @internal
 */
function onSetClip(
    this: Series,
    {
        clipBox
    }: {
        clipBox: BBoxObject
    }
): void {
    if (
        !this.xAxis ||
        !this.yAxis ||
        (!this.chart.angular && !this.chart.polar)
    ) {
        return;
    }

    const { plotWidth, plotHeight } = this.chart,
        smallestSize = Math.min(plotWidth, plotHeight),
        xPane = this.xAxis.pane,
        yPane = this.yAxis.pane;

    if (xPane && xPane.axis) {
        clipBox.x += xPane.center[0] -
            (xPane.center[2] / smallestSize) * plotWidth / 2;
    }

    if (yPane && yPane.axis) {
        clipBox.y += yPane.center[1] -
            (yPane.center[2] / smallestSize) * plotHeight / 2;
    }
}

/** @internal */
function compose(
    ChartClass: typeof Chart,
    PointerClass: typeof Pointer,
    SeriesClass: typeof Series
): void {
    const chartProto = ChartClass.prototype as PaneChart;

    if (!chartProto.getHoverPane) {
        chartProto.collectionsWithUpdate.push('pane');
        chartProto.getHoverPane = chartGetHoverPane;

        addEvent(ChartClass, 'afterIsInsidePlot', onChartAfterIsInsiderPlot);

        addEvent(PointerClass, 'afterGetHoverData', onPointerAfterGetHoverData);
        addEvent(
            PointerClass,
            'beforeGetHoverData',
            onPointerBeforeGetHoverData
        );

        addEvent(SeriesClass, 'setClip', onSetClip);
    }

}

/**
 * Check whether element is inside or outside pane.
 * @internal
 * @param  {number} x
 * Element's x coordinate
 * @param  {number} y
 * Element's y coordinate
 * @param  {Array<number>} center
 * Pane's center (x, y) and diameter
 * @param  {number} startAngle
 * Pane's normalized start angle in radians (<-PI, PI>)
 * @param  {number} endAngle
 * Pane's normalized end angle in radians (<-PI, PI>)
 */
function isInsidePane(
    x: number,
    y: number,
    center: Array<number>,
    startAngle?: number,
    endAngle?: number
): boolean {
    let insideSlice = true;

    const cx = center[0],
        cy = center[1],
        twoPi = 2 * Math.PI;

    const distance = Math.sqrt(
        Math.pow(x - cx, 2) + Math.pow(y - cy, 2)
    );

    if (defined(startAngle) && defined(endAngle)) {
        // Round angle to N-decimals to avoid numeric errors
        let angle = Math.atan2(
            correctFloat(y - cy, 8),
            correctFloat(x - cx, 8)
        );

        // Normalize angle to [0, 2π)
        angle = (angle + twoPi) % (twoPi);
        startAngle = (startAngle + twoPi) % (twoPi);
        endAngle = (endAngle + twoPi) % (twoPi);

        // Ignore full circle panes:
        if (Math.abs(endAngle - startAngle) > 1e-6) {
        // If the normalized start angle is greater than the end angle,
        // it means the arc wraps around 0°. In this case, we check
        // if the angle falls into either [startAngle, 2π) or [0, endAngle].
            if (startAngle > endAngle) {
                insideSlice = (
                    angle >= startAngle ||
                    angle <= endAngle
                );
            } else {
                // In this case, we simply check if angle is within the
                // [startAngle, endAngle] range
                insideSlice = angle >= startAngle &&
                    angle <= endAngle;
            }
        }
    } else {
        // If no start/end angles are defined, treat it as a full circle
        insideSlice = true;
    }

    // Round up radius because x and y values are rounded
    return distance <= Math.ceil(center[2] / 2) && insideSlice;
}

/**
 * Check if (x, y) position is within pane for polar.
 * @internal
 */
function onChartAfterIsInsiderPlot(
    this: Chart,
    e: {
        x: number;
        y: number;
        isInsidePlot: boolean;
        options: Chart.IsInsideOptionsObject;
    }
): void {
    const chart = this;

    if (chart.polar) {
        if (e.options.inverted) {
            [e.x, e.y] = [e.y, e.x];
        }

        e.isInsidePlot = (chart as PaneChart).pane.some(
            (pane): boolean => isInsidePane(
                e.x,
                e.y,
                pane.center,
                pane.axis && pane.axis.normalizedStartAngleRad,
                pane.axis && pane.axis.normalizedEndAngleRad
            )
        );
    }
}

/**
 *
 */
function onPointerAfterGetHoverData(
    this: Pointer,
    eventArgs: Pointer.EventArgsObject
): void {
    const chart = this.chart;
    if (
        eventArgs.hoverPoint &&
        eventArgs.hoverPoint.plotX &&
        eventArgs.hoverPoint.plotY &&
        chart.hoverPane &&
        !isInsidePane(
            eventArgs.hoverPoint.plotX,
            eventArgs.hoverPoint.plotY,
            chart.hoverPane.center
        )
    ) {
        eventArgs.hoverPoint = void 0;
    }
}

/** @internal */
function onPointerBeforeGetHoverData(
    this: Pointer,
    eventArgs: {
        chartX: number;
        chartY: number;
        shared: boolean|undefined;
        filter?: Function;
    }
): void {
    const chart = (this.chart as PaneChart);
    if (chart.polar) {
        // Find pane we are currently hovering over.
        chart.hoverPane = chart.getHoverPane(eventArgs);

        // Edit filter method to handle polar
        eventArgs.filter = function (s: Series): boolean {
            return (
                s.visible &&
                !(!eventArgs.shared && s.directTouch) && // #3821
                pick(s.options.enableMouseTracking, true) &&
                (!chart.hoverPane || s.xAxis.pane === chart.hoverPane)
            );
        };
    } else {
        chart.hoverPane = void 0;
    }
}

/* *
 *
 *  Default Export
 *
 * */

const PaneComposition = {
    compose
};

export default PaneComposition;
