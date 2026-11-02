import type { Locator, Page } from '@playwright/test';
import { test, expect } from '~/fixtures.ts';
import { toggleEditMode, typeAtEnd } from '../helpers.ts';

async function openTextArea(page: Page): Promise<Locator> {
    await page.locator('.highcharts-dashboards-component').first().click();
    await page.locator(
        '.highcharts-dashboards-edit-toolbar-cell ' +
        '.highcharts-dashboards-edit-toolbar-item'
    ).nth(1).click();
    await page.locator('.highcharts-dashboards-edit-accordion').nth(1).click();

    return page.locator('textarea');
}

test.use({ viewport: { width: 1200, height: 1000 } });

test.describe('Path to arrays in editable options.', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboards/cypress/array-editable-options');
        await toggleEditMode(page);
    });

    test('Changes can be cancelled.', async ({ page }) => {
        await typeAtEnd(await openTextArea(page), ' new text');
        await page.locator('.highcharts-dashboards-edit-sidebar-wrapper').click();
        await expect(page.locator('.highcharts-dashboards-component p'))
            .toHaveText('Lorem ipsum... new text');

        // Cancel the editing and discard the changes
        await page.locator('.highcharts-dashboards-edit-confirmation-popup-cancel-btn')
            .click();
        await page.locator(
            '.highcharts-dashboards-edit-confirmation-popup ' +
            '.highcharts-dashboards-edit-confirmation-popup-confirm-btn'
        ).click();

        await expect(await openTextArea(page)).toHaveValue('Lorem ipsum...');
    });

    test('Changes can be submitted.', async ({ page }) => {
        await typeAtEnd(await openTextArea(page), ' new text');
        await page.locator('.highcharts-dashboards-edit-sidebar-wrapper').click();
        await page.locator('.highcharts-dashboards-edit-confirmation-popup-confirm-btn')
            .click();

        await expect(await openTextArea(page))
            .toHaveValue('Lorem ipsum... new text');
    });
});
