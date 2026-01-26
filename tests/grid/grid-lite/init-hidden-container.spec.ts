import { test, expect } from '~/fixtures.ts';

test.describe('Grid init in a hidden container', () => {
    test('Should not keep `noWidth` class on header containers after showing', async ({ page }) => {
        await page.goto('grid-lite/cypress/init-hidden-container', { waitUntil: 'networkidle' });
        
        // Sample starts hidden on purpose.
        await expect(page.locator('#outer')).toHaveCSS('display', 'none');

        // Historically the header containers could end up with `hcg-no-width`
        // when initialized in display:none (#24002).
        await expect(page.locator('.hcg-header-cell-container.hcg-no-width')).toHaveCount(2);

        // // Wait until the sample shows the container and forces a reflow.
        await page.locator('#show').click();
        await expect(page.locator('#outer')).not.toHaveCSS('display', 'none');

        // After becoming visible, the header containers should be measurable,
        // and `hcg-no-width` should be removed.
        // Wait for the class to be removed (reflow happens automatically)
        await expect(page.locator('.hcg-header-cell-container.hcg-no-width')).toHaveCount(0);
    });
});
