import { test, expect } from '~/fixtures.ts';
import { toggleEditMode } from './helpers.ts';

const norwegianEditMode = {
    editMode: 'Redigering',
    title: 'Tittel',
    caption: 'Caption',
    chartConfig: 'Graf konfigurasjoner',
    chartClassName: 'Graf klassenavn',
    chartID: 'Graf ID',
    chartOptions: 'Graf alternativer',
    confirmDestroyRow: 'Vil du ødelegge raden?',
    confirmDestroyCell: 'Vil du ødelegge cellen?',
    confirmButton: 'Bekreft',
    cancelButton: 'Avbryt',
    viewFullscreen: 'Se fullskjerm',
    on: 'på',
    off: 'av',
    dataLabels: 'Data merkelapp'
};

const confirmationText = '.highcharts-dashboards-edit-confirmation-popup-content > ' +
    '.highcharts-dashboards-edit-label-text';
const toolbarItem = (toolbar: 'cell' | 'row', n: number) =>
    `.highcharts-dashboards-edit-toolbar-${toolbar} > ` +
    `.highcharts-dashboards-edit-toolbar-item:nth-child(${n})`;

test.use({ viewport: { width: 1200, height: 1000 } });

test.describe('Editable component options', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboards/cypress/options-lang');
        await toggleEditMode(page);
    });

    test('Lang should be applied on edit toggle and fullscreen', async ({ page }) => {
        const items = page.locator('.highcharts-dashboards-edit-context-menu-item');

        await expect(items.nth(0)).toHaveText(norwegianEditMode.editMode);
        await expect(items.nth(1)).toHaveText(norwegianEditMode.viewFullscreen);
    });

    test('Lang should be applied on sidebar options', async ({ page }) => {
        const buttons = page.locator(
            '.highcharts-dashboards-edit-sidebar .highcharts-dashboards-edit-button'
        );
        const headers = page.locator(
            '.highcharts-dashboards-edit-accordion > ' +
            '.highcharts-dashboards-edit-accordion-header'
        );
        const toggleLabels =
            page.locator('.highcharts-dashboards-edit-toggle-labels');

        await page.locator('.highcharts-dashboards-component').first().click();
        await page.locator(toolbarItem('cell', 2)).click();

        // buttons
        await expect(buttons.nth(0))
            .toHaveText(norwegianEditMode.confirmButton);
        await expect(buttons.nth(1))
            .toHaveText(norwegianEditMode.cancelButton);

        // accordion 1 level
        for (const [i, text] of [
            norwegianEditMode.title,
            norwegianEditMode.caption,
            norwegianEditMode.chartOptions,
            norwegianEditMode.chartConfig,
            norwegianEditMode.chartClassName,
            norwegianEditMode.chartID
        ].entries()) {
            await expect(headers.nth(i + 1)).toHaveText(text);
        }

        // accordion 2 level - Chart options
        await headers.nth(3).click();

        // toggle
        await expect(toggleLabels.nth(0)).toHaveText(norwegianEditMode.off);
        await expect(toggleLabels.nth(1)).toHaveText(norwegianEditMode.on);

        // Data labels
        await expect(page.locator(
            '.highcharts-dashboards-edit-accordion-nested:nth-child(6) ' +
            '.highcharts-dashboards-edit-accordion-header-btn'
        )).toHaveText(norwegianEditMode.dataLabels);
    });

    test('Lang should be applied on confirmation popup (delete cell)', async ({ page }) => {
        await page.locator('.highcharts-dashboards-component').first().click();

        // Delete cell
        await page.locator(toolbarItem('cell', 3)).click();
        await expect(page.locator(confirmationText))
            .toHaveText(norwegianEditMode.confirmDestroyCell);
        await page.locator('.highcharts-dashboards-edit-popup-close').nth(0)
            .click();
    });

    test('Lang should be applied on confirmation popup (delete row)', async ({ page }) => {
        await page.locator('.highcharts-dashboards-component').first()
            .click({ force: true });

        // Delete row
        await page.locator(toolbarItem('row', 2)).click();
        await expect(page.locator(confirmationText))
            .toHaveText(norwegianEditMode.confirmDestroyRow);
        await page.locator('.highcharts-dashboards-edit-popup-close').nth(0)
            .click();
    });

    test('Lang should be applied on add component list', async ({ page }) => {
        await page.locator('.highcharts-dashboards-edit-tools-btn').first().click();

        const texts = await page
            .locator('.highcharts-dashboards-edit-grid-items div')
            .allTextContents();

        expect(texts.length).toBeGreaterThan(0);
        for (const text of texts) {
            expect(text).toContain('My');
        }
    });
});
