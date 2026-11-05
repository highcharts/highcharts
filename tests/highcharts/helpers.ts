import type { Locator, Page } from '@playwright/test';
import { dispatchClick, trigger } from '~/helpers.ts';

type Position = [x: number, y: number];

/**
 * Clicks the chart container at the given points, relative to its top left
 * corner. With `force`, the events go to the container itself instead of
 * the element on top, e.g. an annotation being drawn.
 */
export async function clickChart(
    page: Page,
    positions: Position[],
    force = false
): Promise<void> {
    const container = page.locator('.highcharts-container').first();

    for (const [x, y] of positions) {
        if (force) {
            await dispatchClick(container, [x, y]);
        } else {
            await container.click({ position: { x, y } });
        }
    }
}

/**
 * Drags an element to a point of the chart container with synthetic mouse
 * events.
 */
export async function dragTo(
    element: Locator,
    [x, y]: Position,
    force = false
): Promise<void> {
    const container = element.page().locator('.highcharts-container').first();

    await trigger(element, 'mousedown', { force });
    for (const type of ['mousemove', 'mouseup', 'click']) {
        await trigger(container, type, { position: [x, y], force });
    }
}

/**
 * Opens the indicators popup of the stock tools.
 */
export async function openIndicators(page: Page): Promise<void> {
    await page.locator('.highcharts-indicators .highcharts-menu-item-btn')
        .click();
}

/**
 * Picks an indicator in the open indicators popup.
 */
export async function selectIndicator(
    page: Page,
    name: string
): Promise<void> {
    // The list and its items share the class
    await page.locator('li.highcharts-indicator-list', {
        hasText: name
    }).first().click();
}

/**
 * The buttons on the right side of the indicators popup: add (or save),
 * and in the edit tab also remove.
 */
export function popupButton(page: Page, index: number): Locator {
    return page.locator('.highcharts-popup .highcharts-popup-rhs-col > button')
        .nth(index);
}

/**
 * Adds the indicator picked in the open indicators popup.
 */
export async function addIndicator(page: Page): Promise<void> {
    await popupButton(page, 0).click();
}

/**
 * Picks an annotation in the stock tools. If the annotation is in a submenu,
 * opens the submenu of the parent button first.
 */
export async function selectAnnotation(
    page: Page,
    annotationClassName: string,
    parentClassName?: string
): Promise<void> {
    if (parentClassName) {
        await page.locator(`.${parentClassName} > *`).nth(1).click();
        // Wait a bit for the DOM to settle
        await page.waitForTimeout(100);
    }
    await page.locator(`.${annotationClassName}`).click();
}

/**
 * Clicks a button of the range selector.
 */
export async function selectRange(page: Page, range: string): Promise<void> {
    await page.locator('.highcharts-range-selector-group')
        .getByText(range, { exact: true })
        .first()
        .click();
}
