import { test, expect } from '~/fixtures.ts';

test.describe('Rendering hidden grid', () => {
    test.beforeAll(async () => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-lite/e2e/hidden', { waitUntil: 'networkidle' });
    });

    test('Rows should be visible when grid is switched from hidden', async ({ page }) => {
        // Wait for Grid to be initialized and demo.js to execute
        await page.waitForFunction(() => {
            return typeof (window as any).Grid !== 'undefined';
        }, { timeout: 10000 });

        // Act - click show button
        await page.locator('#show').click();

        // Wait for grid to render after show button click
        await expect(page.locator('tbody tr')).toHaveCount(4, { timeout: 5000 });

        // Assert - rows should be visible (4 data rows + 1 header row = 5 total)
        await expect(page.locator('tr')).toHaveCount(5);
    });

    test('Rows should have even and odd classes', async ({ page }) => {
        // Wait for Grid to be initialized and demo.js to execute
        await page.waitForFunction(() => {
            return typeof (window as any).Grid !== 'undefined';
        }, { timeout: 10000 });

        // Click show button to make grid visible
        await page.locator('#show').click();

        // Wait for grid to render
        await expect(page.locator('tbody tr')).toHaveCount(4, { timeout: 5000 });

        // Assert - rows should have alternating classes
        await expect(page.locator('tbody tr').first()).toHaveClass(/hcg-row-odd/);
        await expect(page.locator('tbody tr').nth(1)).toHaveClass(/hcg-row-even/);
    });
});

test.describe('Grid rows removal', () => {
    test.beforeAll(async () => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-lite/basic/destroy-grid');
    });

    test('Remove all grid rows', async ({ page }) => {
        await page.locator('#delete-rows-btn').click();
        // All grid rows should be removed.
        await expect(page.locator('tbody')).toBeEmpty();
    });
});

test.describe('Rendering size', () => {
    test.beforeAll(async () => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-lite/e2e/rendering-size');
    });

    test('Fixed height grid', async ({ page }) => {
        const height = await page.locator('#container').evaluate((el: HTMLElement) => {
            return window.getComputedStyle(el).height;
        });
        expect(height).toBe('200px');
    });

    test('Percentage height grid inside fixed container', async ({ page }) => {
        const height = await page.locator('#grid2').evaluate((el: HTMLElement) => {
            return window.getComputedStyle(el).height;
        });
        expect(height).toBe('200px');
    });

    test('Max height inside fixed container', async ({ page }) => {
        const height = await page.locator('#grid3').evaluate((el: HTMLElement) => {
            return window.getComputedStyle(el).height;
        });
        expect(height).toBe('180px');
    });

    test('Flex grow inside fixed flexbox', async ({ page }) => {
        const height = await page.locator('#grid4').evaluate((el: HTMLElement) => {
            return window.getComputedStyle(el).height;
        });
        expect(height).toBe('200px');
    });
});

test.describe('Page-wide CSS', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-lite/e2e/external-css');
        await expect(page.locator('#unthemed tbody td').first())
            .toBeVisible();
    });

    test('Element rules should not style the grid', async ({ page }) => {
        const th = page.locator('#container thead th').first();

        await expect(page.locator('#container tbody td').nth(1))
            .toHaveCSS('border-left-width', '0px');
        await expect(th).toHaveCSS('border-top-width', '0px');
        await expect(th).toHaveCSS('border-left-width', '0px');
        await expect(page.locator('#container table'))
            .toHaveCSS('margin-bottom', '0px');

        const td = page.locator('#container tbody td').first();
        await expect(td).not.toHaveCSS('vertical-align', 'bottom');
        await expect(td).not.toHaveCSS('text-transform', 'uppercase');

        // Controls and the Grid's own wrappers
        for (const selector of ['.hcg-button', 'input', '.hcg-container']) {
            const el = page.locator(`#container ${selector}`).first();

            await expect(el).not.toHaveCSS('margin-top', /^[67]px$/);
        }
        await expect(page.locator('#container .hcg-button').first())
            .not.toHaveCSS('min-width', '120px');
        await expect(page.locator('#container input').first())
            .toHaveCSS('box-shadow', 'none');
        await expect(page.locator('#container .hcg-container'))
            .toHaveCSS('padding-top', '0px');

        // Rows, with cells that have no background of their own
        for (const selector of ['thead', 'tbody', 'tbody tr']) {
            await expect(page.locator(`#container ${selector}`).first())
                .toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
        }

        // Inputs, from a rule more specific than the reset
        const input = page.locator('#container input').first();
        await expect(input).toHaveCSS('border-top-width', '1px');
        await expect(input).toHaveCSS('padding-top', '5px');
        await expect(input).not.toHaveCSS(
            'background-color',
            'rgb(255, 192, 203)'
        );

        // Theme borders still apply
        await expect(page.locator('#container tbody td').first())
            .toHaveCSS('border-right-width', '1px');
        await expect(page.locator('#container tbody td').first())
            .toHaveCSS('border-top-width', '0px');
    });

    test('Cell class name rules should still apply', async ({ page }) => {
        await expect(page.locator('#unthemed .hcg-themed')).toHaveCount(0);
        await expect(page.locator('#unthemed tbody td').first())
            .toHaveCSS('border-top-width', '3px');
        await expect(page.locator('#unthemed tbody td').first())
            .toHaveCSS('text-align', 'right');
    });
});
