import type { Page } from '@playwright/test';
import { test, expect } from '~/fixtures.ts';

const assertPenultimateRow = async (
    page: Page,
    gridId: string,
    penultimateRowIndex: number,
    penultimateValue: string
): Promise<void> => {
    const tbody = page.locator(`#${gridId} tbody`);
    // Keep scrolling until the penultimate row is rendered (virtualized grids may not
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
                penultimateRowIndex
            );
        }, { timeout: 10000 })
        .toBe(true);

    const penultimateRow = page.locator(
        `#${gridId} tbody tr[data-row-index="${penultimateRowIndex}"]`
    );
    await expect(penultimateRow).toBeVisible({ timeout: 10000 });

    const penultimateValueCell = penultimateRow.locator('td').last();
    await expect(penultimateValueCell).toHaveAttribute('data-value', penultimateValue, {
        timeout: 10000
    });

    await expect(penultimateRow).toHaveAttribute(
        'data-row-index',
        `${penultimateRowIndex}`
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
        await assertPenultimateRow(
            page,
            'grid-1',
            9999998,
            '9999999'
        );
    });

    test('1 million rows: scrolls to bottom and shows last rows', async ({ page }) => {
        await expect(page.locator('#grid-2 tbody')).toHaveCount(1);
        await assertPenultimateRow(
            page,
            'grid-2',
            999998,
            '999999'
        );
    });
});
