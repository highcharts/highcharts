import type { Page } from '@playwright/test';
import { test, expect } from '~/fixtures.ts';

const addFocusSentinels = async (page: Page): Promise<void> => {
    await page.evaluate(() => {
        document.getElementById('focus-before-grid')?.remove();
        document.getElementById('focus-after-grid')?.remove();

        const before = document.createElement('button');
        before.id = 'focus-before-grid';
        before.textContent = 'Before grid';

        const after = document.createElement('button');
        after.id = 'focus-after-grid';
        after.textContent = 'After grid';

        const container = document.getElementById('container');
        if (!container?.parentElement) {
            throw new Error('Grid container not found.');
        }

        container.parentElement.insertBefore(before, container);
        container.insertAdjacentElement('afterend', after);
    });
};

test.describe('Keyboard navigation in virtualized Grid', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-lite/demo/minimal-grid', {
            waitUntil: 'networkidle'
        });

        await page.evaluate(() => {
            (window as any).Grid.grids[0]?.destroy();

            const product = Array.from(
                { length: 100 },
                (_, index) => `Item ${index + 1}`
            );
            const amount = Array.from({ length: 100 }, (_, index) => index + 1);

            (window as any).Grid.grid('container', {
                data: {
                    columns: {
                        product,
                        amount
                    }
                },
                credits: {
                    enabled: false
                },
                rendering: {
                    rows: {
                        virtualization: true,
                        minVisibleRows: 8
                    }
                },
                columns: [{
                    id: 'product',
                    sorting: {
                        enabled: false
                    }
                }, {
                    id: 'amount',
                    sorting: {
                        enabled: false
                    }
                }]
            });
        });

        await addFocusSentinels(page);
        await expect(page.locator('.hcg-table.hcg-virtualization')).toHaveCount(1);
    });

    test('Tab order re-enters through the first header cell', async ({ page }) => {
        const focused = page.locator(':focus');

        await page.locator('#focus-before-grid').focus();
        await page.keyboard.press('Tab');
        await expect(focused).toHaveAttribute('data-column-id', 'product');

        await page.keyboard.press('Tab');
        await expect.poll(async () => {
            return await page.evaluate(() => {
                const active = document.activeElement as HTMLElement | null;
                return active?.closest('tbody') ? 'tbody' : active?.id || active?.tagName || '';
            });
        }).not.toBe('tbody');

        await page.keyboard.press('Tab');
        await expect(page.locator('#focus-after-grid')).toBeFocused();

        await page.keyboard.press('Shift+Tab');
        await page.keyboard.press('Shift+Tab');
        await expect(focused).toHaveAttribute('data-column-id', 'product');

        await page.keyboard.press('Shift+Tab');
        await expect(page.locator('#focus-before-grid')).toBeFocused();

        await page.keyboard.press('Tab');
        await expect(focused).toHaveAttribute('data-column-id', 'product');
    });
});
