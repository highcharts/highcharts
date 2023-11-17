/* *
 *
 *  Imports
 *
 * */

import type Chart from '../../Core/Chart/Chart';
import type Pane from './Pane';
import type Pointer from '../../Core/Pointer';
import type Series from '../../Core/Series/Series';

import U from '../../Core/Utilities.js';
const {
    addEvent,
    correctFloat,
    defined,
    pick,
    pushUnique
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Chart/ChartLike'{
    interface ChartLike {
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
 *  Constants
 *
 * */

const composedMembers: Array<unknown> = [];

/* *
 *
 *  Functions
 *
 * */

/** @private */
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

/** @private */
function compose(
    ChartClass: typeof Chart,
    PointerClass: typeof Pointer
): void {

    if (pushUnique(composedMembers, ChartClass)) {
        const chartProto = ChartClass.prototype as PaneChart;

        chartProto.collectionsWithUpdate.push('pane');
        chartProto.getHoverPane = chartGetHoverPane;

        addEvent(ChartClass, 'afterIsInsidePlot', onChartAfterIsInsiderPlot);
    }

    if (pushUnique(composedMembers, PointerClass)) {
        addEvent(PointerClass, 'afterGetHoverData', onPointerAfterGetHoverData);
        addEvent(
            PointerClass,
            'beforeGetHoverData',
            onPointerBeforeGetHoverData
        );
    }

}

/**
 * Check whether element is inside or outside pane.
 * @private
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
        cy = center[1];

    const distance = Math.sqrt(
        Math.pow(x - cx, 2) + Math.pow(y - cy, 2)
    );

    if (defined(startAngle) && defined(endAngle)) {
        // Round angle to N-decimals to avoid numeric errors
        const angle = Math.atan2(
            correctFloat(y - cy, 8),
            correctFloat(x - cx, 8)
        );

        // Ignore full circle panes:
        if (endAngle !== startAngle) {
            // If normalized start angle is bigger than normalized end,
            // it means angles have different signs. In such situation we
            // check the <-PI, startAngle> and <endAngle, PI> ranges.
            if (startAngle > endAngle) {
                insideSlice = (
                    angle >= startAngle &&
                    angle <= Math.PI
                ) || (
                    angle <= endAngle &&
                    angle >= -Math.PI
                );
            } else {
                // In this case, we simple check if angle is within the
                // <startAngle, endAngle> range
                insideSlice = angle >= startAngle &&
                    angle <= correctFloat(endAngle, 8);
            }
        }
    }
    // Round up radius because x and y values are rounded
    return distance <= Math.ceil(center[2] / 2) && insideSlice;
}

/**
 * Check if (x, y) position is within pane for polar.
 * @private
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

/** @private */
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
