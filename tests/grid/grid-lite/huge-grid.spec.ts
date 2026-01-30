import type { Page } from '@playwright/test';
import { test, expect } from '~/fixtures.ts';

const assertLastRows = async (
    page: Page,
    gridId: string,
    lastRowIndex: number,
    lastValue: string
): Promise<void> => {
    const tbody = page.locator(`#${gridId} tbody`);
    // Keep scrolling until the last row is rendered (virtualized grids may not
    // reach exact scrollHeight because of scaling).
    await expect
        .poll(async () => {
            return await tbody.evaluate(
                (el: HTMLElement, index: number) => {
                    el.scrollTop = el.scrollHeight;
                    const row = el.querySelector(
                        `tr[data-row-index="${index}"]`
                    );
                    return !!row;
                },
                lastRowIndex
            );
        }, { timeout: 10000 })
        .toBe(true);

    const lastRow = page.locator(
        `#${gridId} tbody tr[data-row-index="${lastRowIndex}"]`
    );
    await expect(lastRow).toBeVisible({ timeout: 10000 });

    const lastValueCell = lastRow.locator('td').last();
    await expect(lastValueCell).toHaveAttribute('data-value', lastValue, {
        timeout: 10000
    });

    await expect(lastRow).toHaveAttribute(
        'data-row-index',
        `${lastRowIndex}`
    );
};

test.describe('Huge grid scrolling', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-lite/cypress/huge-grid', {
            waitUntil: 'networkidle'
        });
    });

    test('10 million rows: scrolls to bottom and shows last rows', async ({ page }) => {
        await expect(page.locator('#grid-1 tbody')).toHaveCount(1);
        await assertLastRows(
            page,
            'grid-1',
            9999999,
            '10000000'
        );
    });

    test('1 million rows: scrolls to bottom and shows last rows', async ({ page }) => {
        await expect(page.locator('#grid-2 tbody')).toHaveCount(1);
        await assertLastRows(
            page,
            'grid-2',
            999999,
            '1000000'
        );
    });
});
