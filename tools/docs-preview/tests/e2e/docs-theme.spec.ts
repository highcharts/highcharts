import { expect, test } from '@playwright/test';

test.describe('docs preview', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            window.localStorage.setItem('hs-ui-theme', 'light');
        });
    });

    test('smoke: renders docs content', async ({ page }) => {
        await page.goto('/docs/getting-started/your-first-chart/');

        await expect(page.getByRole('heading', { name: 'Your first chart', level: 1 })).toBeVisible();
        await expect(page.getByRole('navigation', { name: 'Docs sidebar' })).toBeVisible();
    });

    test('switches code block theme when global theme changes', async ({ page }) => {
        await page.goto('/docs/getting-started/your-first-chart/');

        const codeBlock = page.locator('.theme-code-block pre').first();

        await expect(codeBlock).toBeVisible();

        const lightStyles = await page.evaluate(() => {
            const pre = document.querySelector('.theme-code-block pre');
            const container = document.querySelector('.theme-code-block');

            return {
                background: pre ? getComputedStyle(pre).backgroundColor : null,
                containerStyle: container ? container.getAttribute('style') : null
            };
        });

        await page.evaluate(() => {
            document.documentElement.setAttribute('data-theme', 'dark');
        });

        await expect.poll(async () => page.evaluate(() => {
            const container = document.querySelector('.theme-code-block');

            return container ? container.getAttribute('style') : null;
        })).toContain('282A36');

        const darkStyles = await page.evaluate(() => {
            const pre = document.querySelector('.theme-code-block pre');
            const container = document.querySelector('.theme-code-block');

            return {
                background: pre ? getComputedStyle(pre).backgroundColor : null,
                containerStyle: container ? container.getAttribute('style') : null
            };
        });

        expect(darkStyles.background).toBe('rgb(40, 42, 54)');
        expect(lightStyles.background).not.toBe(darkStyles.background);
        expect(darkStyles.containerStyle).toContain('282A36');
    });
});
