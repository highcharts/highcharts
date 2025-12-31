import { test, expect } from '~/fixtures.ts';

test.describe('Pagination', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });
        await page.goto('/grid-lite/cypress/pagination', { waitUntil: 'networkidle' });
        // Wait for Grid to be initialized
        await page.waitForFunction(() => {
            return typeof (window as any).Grid !== 'undefined';
        }, { timeout: 10000 });
        // Wait for pagination to be rendered
        await expect(page.locator('.hcg-pagination-wrapper')).toBeVisible({ timeout: 10000 });
    });

    test('Render pagination container', async ({ page }) => {

        // Check page info is displayed with correct initial page size
        const pageInfo = page.locator('.hcg-pagination-info');
        await expect(pageInfo).toBeVisible();
        await expect(pageInfo).toContainText('Showing 1');

        // Check controls buttons exist
        await expect(page.locator('.hcg-pagination-controls-container')).toBeVisible();

        // Check first/last buttons
        const buttons = page.locator('.hcg-button');
        const buttonCount = await buttons.count();
        expect(buttonCount).toBeGreaterThanOrEqual(4);

        // Check page size selector with correct initial value
        await expect(page.locator('.hcg-pagination-page-size select.hcg-input')).toBeVisible();

        // Check page number buttons
        const navButtons = page.locator('.hcg-pagination-nav-buttons-container .hcg-button');
        const navButtonCount = await navButtons.count();
        expect(navButtonCount).toBeGreaterThanOrEqual(1);
        await expect(page.locator('.hcg-button-selected')).toContainText('1');

        // Check initial data rows
        await expect(page.locator('table tbody tr')).toHaveCount(22);
    });

    test('Next/previous button', async ({ page }) => {

        // Click next page button
        await page.locator('.hcg-button[title="Next page"]').click();

        // Check page info updates
        await expect(page.locator('.hcg-pagination-info')).toContainText('Showing 23');

        // Check active page button updates
        await expect(page.locator('.hcg-button-selected')).toContainText('2');

        // Check data rows update
        await expect(page.locator('table tbody tr')).toHaveCount(22);

        // Click previous button
        await page.locator('.hcg-button[title="Previous page"]').click();

        // Check we're back on page 1
        await expect(page.locator('.hcg-pagination-info')).toContainText('Showing 1');
        await expect(page.locator('.hcg-button-selected')).toContainText('1');
    });

    test('First/last button', async ({ page }) => {

        // Click last button to go to last page
        await page.locator('.hcg-button[title="Last page"]').click();

        // Check we're on the last page
        await expect(page.locator('.hcg-pagination-info')).toContainText('Showing 243 - 254 of 254');

        // Check button states - last button should be disabled
        await expect(page.locator('.hcg-button[title="Last page"]')).toBeDisabled();
        await expect(page.locator('.hcg-button[title="Next page"]')).toBeDisabled();
        await expect(page.locator('.hcg-button[title="First page"]')).toBeEnabled();
        await expect(page.locator('.hcg-button[title="Previous page"]')).toBeEnabled();

        // Click first button to go back to first page
        await page.locator('.hcg-button[title="First page"]').click();
        await expect(page.locator('.hcg-button[title="Last page"]')).toBeEnabled();
        await expect(page.locator('.hcg-button[title="Next page"]')).toBeEnabled();

        // Check we're back on first page
        await expect(page.locator('.hcg-pagination-info')).toContainText('Showing 1 - 22 of 254');
    });

    test('Direct page number', async ({ page }) => {

        // Click on page number
        await page.locator('.hcg-pagination-nav-buttons-container .hcg-button').filter({ hasText: '3' }).click();

        // Check we're on page
        await expect(page.locator('.hcg-pagination-info')).toContainText('Showing 45 - 66 of 254');
    });

    test('Update pagination', async ({ page }) => {

        // Disable pagination
        await page.evaluate(() => {
            (window as any).Grid.grids[0].update({
                pagination: {
                    enabled: false
                }
            });
        });

        await expect(page.locator('.hcg-pagination-wrapper')).not.toBeVisible();

        // Enable pagination
        await page.evaluate(() => {
            (window as any).Grid.grids[0].update({
                pagination: {
                    enabled: true
                }
            });
        });

        await expect(page.locator('.hcg-pagination-wrapper')).toBeVisible();
        await expect(page.locator('table tbody tr')).toHaveCount(22);
    });

    test('Page size', async ({ page }) => {

        // Change page size to 20
        await page.locator('.hcg-pagination-page-size select.hcg-input').first().selectOption('20');

        // Check page info updates
        await expect(page.locator('.hcg-pagination-info')).toContainText('Showing 1 - 20');

        // Check data rows update
        await expect(page.locator('table tbody tr')).toHaveCount(20);
    });

    test('Sorted pagination', async ({ page }) => {
        await page.goto('/grid-lite/cypress/pagination', { waitUntil: 'networkidle' });

        // Wait for Grid to be initialized (with timeout)
        await page.waitForFunction(() => {
            return typeof (window as any).Grid !== 'undefined' &&
                   (window as any).Grid.grids &&
                   (window as any).Grid.grids.length > 0;
        }, { timeout: 5000 });

        // Set page size to 5
        await page.evaluate(() => {
            (window as any).Grid.grids[0].update({
                pagination: {
                    pageSize: 5
                }
            });
        });

        // Click on the name column header to sort
        await page.locator('table th[data-column-id="Name"]').first().click();

        // First row does not contain Michael
        await expect(page.locator('table tbody tr').first()).not.toContainText('Michael');
    });

    test('Lang support', async ({ page }) => {
        await page.goto('/grid-lite/cypress/pagination', { waitUntil: 'networkidle' });

        // Wait for Grid to be initialized (with timeout)
        await page.waitForFunction(() => {
            return typeof (window as any).Grid !== 'undefined' &&
                   (window as any).Grid.grids &&
                   (window as any).Grid.grids.length > 0;
        }, { timeout: 5000 });

        // Update lang options
        await page.evaluate(() => {
            (window as any).Grid.grids[0].update({
                lang: {
                    pagination: {
                        pageInfo: 'Total pages {total}',
                        pageSizeLabel: 'Items per page',
                    }
                }
            });
        });

        await expect(page.locator('.hcg-pagination-info').first()).toContainText('Total pages');
        await expect(page.locator('.hcg-pagination-page-size').first()).toContainText('Items per page');
    });

    test('Position parameter - custom container', async ({ page }) => {

        // Test custom container position
        await page.evaluate(async () => {
            await (window as any).Grid.grids[0].update({
                pagination: {
                    enabled: true,
                    position: '#test-custom-container'
                }
            });
        });

        // Wait for custom container to be visible
        await expect(page.locator('#test-custom-container')).toBeVisible();

        // Check that custom container exists and contains pagination
        await expect(page.locator('#test-custom-container')).toBeVisible();
        await expect(page.locator('#test-custom-container .hcg-pagination-controls-container')).toBeVisible();
        await expect(page.locator('#test-custom-container .hcg-pagination-info')).toBeVisible();
        const navButtons = page.locator('#test-custom-container .hcg-pagination-nav-buttons-container .hcg-button');
        const buttonCount = await navButtons.count();
        expect(buttonCount).toBeGreaterThan(0);
    });

    test('Position parameter - top/bottom/footer', async ({ page }) => {
        await page.goto('/grid-lite/cypress/pagination', { waitUntil: 'networkidle' });

        // Wait for Grid to be initialized (with timeout)
        await page.waitForFunction(() => {
            return typeof (window as any).Grid !== 'undefined' &&
                   (window as any).Grid.grids &&
                   (window as any).Grid.grids.length > 0;
        }, { timeout: 5000 });

        // Test top position
        await page.evaluate(() => {
            (window as any).Grid.grids[0].update({
                pagination: {
                    enabled: true,
                    position: 'top'
                }
            });
        });

        await expect(page.locator('.hcg-pagination-wrapper')).toBeVisible();

        // Verify the DOM order: pagination should be before table
        const container = page.locator('.hcg-container');
        const paginationIndex = await container.locator('.hcg-pagination-wrapper').evaluate((el) => {
            const parent = el.parentElement;
            return parent ? Array.from(parent.children).indexOf(el) : -1;
        });
        const tableIndex = await container.locator('.hcg-table').evaluate((el) => {
            const parent = el.parentElement;
            return parent ? Array.from(parent.children).indexOf(el) : -1;
        });
        expect(paginationIndex).toBeLessThan(tableIndex);

        // Test bottom position (default)
        await page.evaluate(() => {
            (window as any).Grid.grids[0].update({
                pagination: {
                    position: 'bottom'
                }
            });
        });

        // Verify the DOM order: pagination should be after table
        const paginationIndexAfter = await container.locator('.hcg-pagination-wrapper').evaluate((el) => {
            const parent = el.parentElement;
            return parent ? Array.from(parent.children).indexOf(el) : -1;
        });
        const tableIndexAfter = await container.locator('.hcg-table').evaluate((el) => {
            const parent = el.parentElement;
            return parent ? Array.from(parent.children).indexOf(el) : -1;
        });
        expect(paginationIndexAfter).toBeGreaterThan(tableIndexAfter);

        // Test footer position
        await page.evaluate(() => {
            (window as any).Grid.grids[0].update({
                pagination: {
                    enabled: true,
                    position: 'footer',
                    pageSize: 10
                }
            });
        });

        // Check that tfoot element exists and contains pagination
        await expect(page.locator('.hcg-table tfoot')).toBeVisible();
        await expect(page.locator('.hcg-table tfoot .hcg-pagination-wrapper')).toBeVisible();
    });

    test('Position mobile view', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
        // Wait for mobile layout to apply
        await expect(page.locator('.hcg-pagination-nav-dropdown')).toBeVisible();

        await expect(page.locator('.hcg-pagination-nav-dropdown')).toBeVisible();
        // Check the selected option text, not all options
        const dropdownText = await page.locator('.hcg-pagination-nav-dropdown').textContent();
        expect(dropdownText).toContain('Page 1 of');
        await expect(page.locator('.hcg-pagination-page-size')).toBeVisible();
        await expect(page.locator('.hcg-pagination-page-size')).toContainText('10');
        await expect(page.locator('.hcg-button[title="Next page"]')).toBeVisible();
        await expect(page.locator('.hcg-button[title="Previous page"]')).toBeVisible();
        await expect(page.locator('.hcg-button[title="Last page"]')).toBeVisible();
        await expect(page.locator('.hcg-button[title="First page"]')).toBeVisible();
    });
});

