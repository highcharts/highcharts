/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { Locator, Page } from '@playwright/test';
import { setupRoutes, test } from '~/fixtures.ts';

/**
 * The page size the tests' layouts and mouse coordinates expect.
 */
export const testViewport = { width: 1000, height: 660 };

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
 * Waits until a board exists.
 */
export async function waitForBoard(page: Page): Promise<void> {
    await page.waitForFunction(
        () => ((window as any).Dashboards?.boards?.length ?? 0) >= 1,
        void 0,
        { timeout: waitTimeout }
    );
}

/**
 * Waits until the first board has mounted its components and their charts
 * have finished animating.
 */
export async function waitForBoardRendered(page: Page): Promise<void> {
    await page.waitForFunction(() => {
        const board = (window as any).Dashboards?.boards?.[0];

        return !!board?.mountedComponents.length &&
            board.mountedComponents.every(({ component }: any) => (
                component.type !== 'Highcharts' ||
                component.chart?.series.every((series: any) => (
                    series.hasRendered && series.finishedAnimating
                ))
            ));
    }, void 0, { timeout: waitTimeout });
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
 * Turns the edit mode of the board on or off.
 */
export async function toggleEditMode(page: Page): Promise<void> {
    const toggle = page.locator('.highcharts-dashboards-edit-toggle-container')
        .filter({ visible: true })
        .first();

    if (await toggle.isVisible()) {
        await toggle.click();
    } else {
        await page.locator('.highcharts-dashboards-edit-context-menu-btn')
            .click();
        await page.locator('.highcharts-dashboards-edit-toggle-slider')
            .first()
            .click();
    }
}

/**
 * Selects a cell and opens its settings in the sidebar.
 */
export async function openCellEditSidebar(
    page: Page,
    cellSelector: string
): Promise<void> {
    await page.locator(cellSelector).click();

    const items = page.locator('.highcharts-dashboards-edit-menu-item > div');
    const settings = await items.evaluateAll(elements => elements
        .map((el, i) => (
            getComputedStyle(el).backgroundImage
                .includes('dashboards-icons/settings.svg') ? i : -1
        ))
        .filter(i => i >= 0));

    for (const i of settings) {
        await items.nth(i).click();
    }
}

/**
 * Opens the list of components to add and starts dragging one.
 */
export async function grabComponent(page: Page, name: string): Promise<void> {
    await page.locator('.highcharts-dashboards-edit-tools-btn', {
        hasText: 'Add'
    }).click({ force: true });
    await trigger(
        page.locator('.highcharts-dashboards-edit-grid-items > *', {
            hasText: new RegExp(name, 'u')
        }).first(),
        'mousedown',
        { force: true }
    );
}

/**
 * Drops the dragged component on the right side of the element.
 */
export async function dropComponent(
    page: Page,
    selector: string
): Promise<void> {
    const element = page.locator(selector).first();

    await trigger(element, 'mouseenter', { force: true });
    await trigger(element, 'mousemove', { position: 'right', force: true });
    await trigger(element, 'mouseup', { position: 'right', force: true });
}

/**
 * Closes the open sidebar.
 */
export async function hideSidebar(page: Page): Promise<void> {
    await page.locator('.highcharts-dashboards-edit-popup-close')
        .filter({ visible: true })
        .click();
}

/**
 * The sidebar accordion with the given title.
 */
export function sidebarAccordion(page: Page, title: string): Locator {
    return page.locator('.highcharts-dashboards-edit-accordion-header-btn')
        .filter({ has: page.locator('span', { hasText: title }) })
        .first()
        .locator(
            'xpath=ancestor::*[contains(@class, ' +
            '"highcharts-dashboards-edit-collapsable-content-header")][1]'
        );
}

/**
 * Types at the end of the current value, keeping it.
 */
export async function typeAtEnd(input: Locator, text: string): Promise<void> {
    await input.click();
    await input.press('End');
    await input.pressSequentially(text);
}

/**
 * The chart options that `editChartOptionsInSidebar` sets.
 */
export const sidebarChartOptions = {
    chart: {
        type: 'column'
    },
    credits: {
        text: 'column',
        href: 'http://column.com'
    },
    legend: {
        enabled: true,
        align: 'left'
    },
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                align: 'left'
            }
        }
    },
    subtitle: {
        text: 'column subtitle'
    },
    title: {
        text: 'column title'
    },
    tooltip: {
        enabled: true,
        split: true
    },
    xAxis: {
        title: { text: 'column xAxis title' },
        type: 'linear'
    },
    yAxis: {
        title: { text: 'column yAxis title' },
        type: 'linear'
    }
};

/**
 * In the open sidebar of a chart, goes through every section of the chart
 * options and sets `sidebarChartOptions`: fills the inputs, switches every
 * toggle and picks the first item of every dropdown.
 */
export async function editChartOptionsInSidebar(page: Page): Promise<void> {
    const options = sidebarChartOptions;

    await page.locator('.highcharts-dashboards-edit-accordion')
        .getByText('Chart options')
        .first()
        .click();

    const headers = page.locator(
        '.highcharts-dashboards-edit-accordion-content ' +
        '.highcharts-dashboards-edit-accordion-header'
    );
    const count = await headers.count();

    for (let i = 0; i < count; ++i) {
        const header = headers.nth(i);
        const details = header.locator(
            'xpath=../*[contains(concat(" ", @class, " "), ' +
            '" highcharts-dashboards-edit-accordion-content ")]'
        ).first();
        const fill = (name: string, value: string) => details
            .locator(`input[name="${name}"]`)
            .fill(value);

        await header.locator('.highcharts-dashboards-edit-accordion-header-btn')
            .click();

        const option = (await header.locator('span').allTextContents()).join('');

        if (/chart/iu.test(option)) {
            await fill('title', options.title.text);
            await fill('subtitle', options.subtitle.text);
        }
        if (/credits/iu.test(option)) {
            await fill('url', options.credits.href);
            await fill('name', options.credits.text);
        }
        if (/xaxis/iu.test(option)) {
            await fill('title', options.xAxis.title.text);
        }
        if (/yaxis/iu.test(option)) {
            await fill('title', options.yAxis.title.text);
        }

        // Like jQuery's click(), without moving the mouse
        const clickToggles = (parent: Locator) => parent
            .locator('.highcharts-dashboards-edit-toggle-wrapper')
            .evaluateAll(elements => elements.forEach(
                el => (el as HTMLElement).click()
            ));
        if (await header.locator('input').count()) {
            await clickToggles(header);
        }
        if (/tooltip/iu.test(option)) {
            await clickToggles(details);
        }

        const dropdown = details
            .locator('button.highcharts-dashboards-edit-dropdown-button');
        if (await dropdown.count()) {
            await dropdown.click();
            await dropdown.locator('xpath=..').locator('li').first().click();
        }
    }
}

/**
 * Drags the mouse from 30% to 60% of the element width.
 */
async function dragAcross(chart: Locator, modifier?: 'Shift'): Promise<void> {
    const mouse = chart.page().mouse;
    const keyboard = chart.page().keyboard;
    const box = await chart.boundingBox();

    if (!box) {
        throw new Error('The chart is not visible');
    }

    const y = box.y + box.height / 2;

    if (modifier) {
        await keyboard.down(modifier);
    }
    await mouse.move(box.x + box.width * 0.3, y);
    await mouse.down();
    await mouse.move(box.x + box.width * 0.6, y, { steps: 5 });
    await mouse.up();
    if (modifier) {
        await keyboard.up(modifier);
    }
}

/**
 * Zooms a chart by selecting a range.
 */
export async function zoomChart(chart: Locator): Promise<void> {
    await dragAcross(chart);
}

/**
 * Pans a chart by dragging with Shift.
 */
export async function panChart(chart: Locator): Promise<void> {
    await dragAcross(chart, 'Shift');
}
