/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { Locator, Page } from '@playwright/test';
import { expect, setupRoutes, test } from '~/fixtures.ts';

/**
 * The page size the tests' layouts and mouse coordinates expect.
 */
const testViewport = { width: 1000, height: 660 };

// Fail with a clear error before the test times out
const waitTimeout = 10000;

/**
 * Opens one page for all tests in the current `describe`. The tests run in
 * order, each continuing from the page state the previous one left.
 *
 * @param setup
 * Runs before the page opens, e.g. to mock requests.
 *
 * @return
 * A getter of the shared page.
 */
export function useSharedPage(
    url: string,
    setup?: (page: Page) => Promise<void>
): () => Page {
    let page: Page | undefined;

    test.describe.configure({ mode: 'default' });

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage({ viewport: testViewport });
        await setupRoutes(page);
        await setup?.(page);
        await page.goto(url);
    });

    test.afterAll(async () => {
        await page?.close();
    });

    return () => {
        if (!page) {
            throw new Error(`The page ${url} is not open`);
        }
        return page;
    };
}

/**
 * Waits until the first chart exists.
 */
export async function waitForChart(page: Page): Promise<void> {
    await page.waitForFunction(
        () => !!(window as any).Highcharts?.charts?.[0],
        void 0,
        { timeout: waitTimeout }
    );
}

type TriggerOptions = {
    /** Point relative to the element, `[x, y]` or a side. */
    position?: 'center' | 'right' | 'bottom' | [number, number];
    /** Dispatch on the element itself, even if it is hidden or covered. */
    force?: boolean;
    /** Event properties to override, e.g. `pageX`. */
    [prop: string]: unknown;
};

/**
 * Dispatches a synthetic event at a point of the element, by default on the
 * topmost element at that point, without moving the mouse. Unlike real mouse
 * actions, no `mouseout` follows when the test clicks elsewhere.
 */
export async function trigger(
    element: Locator,
    type: string,
    { position = 'center', force = false, ...props }: TriggerOptions = {}
): Promise<void> {
    if (!force) {
        await element.scrollIntoViewIfNeeded();
    }
    await element.evaluate((el, { type, position, force, props }) => {
        const rect = el.getBoundingClientRect();
        const [x, y] = Array.isArray(position) ? position : [
            position === 'right' ? rect.width - 1 : rect.width / 2,
            position === 'bottom' ? rect.height - 1 : rect.height / 2
        ];
        const clientX = rect.left + x;
        const clientY = rect.top + y;
        const target = force ?
            el :
            document.elementFromPoint(clientX, clientY) || el;
        const event = new Event(type, { bubbles: true, cancelable: true });

        target.dispatchEvent(Object.assign(event, {
            clientX,
            clientY,
            pageX: clientX + window.scrollX,
            pageY: clientY + window.scrollY,
            button: 0,
            which: 1
        }, props));
    }, { type, position, force, props });
}

/**
 * Clicks with synthetic events dispatched on the element itself, even where
 * other elements are on top of the point, e.g. a thin SVG path or a chart
 * container under a drawn annotation.
 */
export async function dispatchClick(
    element: Locator,
    position?: TriggerOptions['position']
): Promise<void> {
    for (const type of ['mousemove', 'mousedown', 'mouseup', 'click']) {
        await trigger(element, type, { position, force: true });
    }
}

/**
 * Expects `actual` to differ from `expected` by at most `delta`.
 */
export function expectClose(
    actual: number,
    expected: number,
    delta: number,
    message?: string
): void {
    expect(Math.abs(actual - expected), message).toBeLessThanOrEqual(delta);
}
