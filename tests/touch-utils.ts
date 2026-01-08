/**
 * Touch gesture utilities for Playwright tests.
 *
 * These utilities simulate touch interactions by directly calling Highcharts'
 * pointer methods, which is more reliable than synthetic DOM touch events.
 * This approach matches how Highcharts' own test suite simulates touch
 * interactions (see test/test-controller.ts).
 */

import type { Page } from '@playwright/test';

/* *
 *
 *  Types used inside page.evaluate() browser context
 *
 * */

/**
 * Represents a single touch point with position coordinates.
 */
interface MockTouch {
    pageX: number;
    pageY: number;
    clientX: number;
    clientY: number;
}

/**
 * Array of touches with the TouchList-like .item() method that Highcharts
 * expects.
 */
interface MockTouchList extends Array<MockTouch> {
    item(index: number): MockTouch | undefined;
}

/**
 * Mock touch event compatible with Highcharts' Pointer methods.
 */
interface MockTouchEvent {
    type: string;
    touches: MockTouchList;
    changedTouches: MockTouchList;
    preventDefault(): void;
    stopPropagation(): void;
}

/**
 * Minimal Pointer interface for the touch methods we call.
 */
interface HighchartsPointer {
    onContainerTouchStart(e: MockTouchEvent): void;
    onContainerTouchMove(e: MockTouchEvent): void;
    onDocumentTouchEnd(e: MockTouchEvent): void;
}

/**
 * Minimal Chart interface with properties needed for touch utilities.
 */
interface HighchartsChart {
    pointer?: HighchartsPointer;
    container: HTMLElement;
    plotLeft: number;
    plotTop: number;
    plotWidth: number;
    plotHeight: number;
}

/**
 * Minimal Highcharts global interface for browser context.
 */
interface HighchartsGlobal {
    charts?: Array<HighchartsChart | undefined>;
}

/**
 * Performs a touch drag gesture by directly calling Highcharts pointer methods.
 *
 * This approach bypasses browser touch event quirks and is more reliable than
 * dispatching synthetic TouchEvent objects, which may not have proper TouchList
 * implementations across all browsers.
 *
 * @param page - Playwright Page object
 * @param startX - Starting X coordinate (page/client coordinates)
 * @param startY - Starting Y coordinate
 * @param endX - Ending X coordinate
 * @param endY - Ending Y coordinate
 * @param steps - Number of intermediate touchmove events (default: 10)
 *
 * @example
 * ```ts
 * // Get plot area coordinates using the helper function
 * const plotArea = await getChartPlotArea(page);
 *
 * // Perform horizontal drag across the plot area
 * await performTouchDrag(page, plotArea.left, plotArea.centerY, plotArea.right, plotArea.centerY);
 * ```
 */
export async function performTouchDrag(
    page: Page,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    steps = 10
): Promise<void> {
    await page.evaluate(({ startX, startY, endX, endY, steps }) => {
        const hc = (window as Window & { Highcharts?: HighchartsGlobal })
            .Highcharts;
        const chart = hc?.charts?.[0];
        if (!chart?.pointer) {
            return;
        }

        const pointer = chart.pointer;

        /**
         * Creates a TouchList-like array with the required .item() method.
         * Highcharts' Pointer.normalize() expects touches.item(0) to work.
         */
        const createTouchList = (touches: MockTouch[]): MockTouchList => {
            const list = [...touches] as MockTouchList;
            list.item = function (
                this: MockTouchList,
                i: number
            ): MockTouch | undefined {
                return this[i];
            };
            return list;
        };

        /**
         * Creates a mock touch event object compatible with Highcharts' pointer.
         */
        const createTouchEvent = (
            type: string,
            x: number,
            y: number
        ): MockTouchEvent => {
            const touch: MockTouch = {
                pageX: x,
                pageY: y,
                clientX: x,
                clientY: y
            };
            const touches = type === 'touchend' ?
                createTouchList([]) :
                createTouchList([touch]);

            return {
                type,
                touches,
                changedTouches: createTouchList([touch]),
                preventDefault: (): void => {},
                stopPropagation: (): void => {}
            };
        };

        // Trigger touchstart
        pointer.onContainerTouchStart(createTouchEvent('touchstart', startX, startY));

        // Trigger touchmove events for smooth drag
        for (let i = 1; i <= steps; i++) {
            const progress = i / steps;
            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;
            pointer.onContainerTouchMove(createTouchEvent('touchmove', currentX, currentY));
        }

        // Trigger touchend
        pointer.onDocumentTouchEnd(createTouchEvent('touchend', endX, endY));
    }, { startX, startY, endX, endY, steps });
}

/**
 * Gets the plot area coordinates from a Highcharts chart.
 *
 * @param page - Playwright Page object
 * @param padding - Padding from the edge of the plot area (default: 20px)
 * @returns Object containing left, right, top, bottom, centerX, centerY coordinates
 *
 * @example
 * ```ts
 * const plotArea = await getChartPlotArea(page);
 * await performTouchDrag(page, plotArea.left, plotArea.centerY, plotArea.right, plotArea.centerY);
 * ```
 */
export async function getChartPlotArea(
    page: Page,
    padding = 20
): Promise<{
    left: number;
    right: number;
    top: number;
    bottom: number;
    centerX: number;
    centerY: number;
}> {
    return page.evaluate((padding) => {
        const hc = (window as Window & { Highcharts?: HighchartsGlobal })
            .Highcharts;
        const chart = hc?.charts?.[0];
        if (!chart) {
            throw new Error('No Highcharts chart found on page');
        }

        const container = chart.container.getBoundingClientRect();
        const left = container.left + chart.plotLeft + padding;
        const right =
            container.left + chart.plotLeft + chart.plotWidth - padding;
        const top = container.top + chart.plotTop + padding;
        const bottom =
            container.top + chart.plotTop + chart.plotHeight - padding;

        return {
            left,
            right,
            top,
            bottom,
            centerX: (left + right) / 2,
            centerY: (top + bottom) / 2
        };
    }, padding);
}
