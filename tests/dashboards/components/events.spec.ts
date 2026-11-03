import { test, expect } from '~/fixtures.ts';
import { trigger, useSharedPage } from '~/helpers.ts';
import { toggleEditMode } from '../helpers.ts';

const toolbarItem = (n: number) => '.highcharts-dashboards-edit-toolbar-cell > ' +
    `.highcharts-dashboards-edit-toolbar-item:nth-child(${n})`;

test.describe('Component events', () => {
    const getPage = useSharedPage('/dashboards/cypress/chart-interaction');

    test('Mount event should be triggered on init', async () => {
        await expect(getPage().locator('#mount')).toHaveValue('mount');
    });

    test('Resize event should be triggered after setting init size', async () => {
        await expect(getPage().locator('#resize')).toHaveValue('resize');
    });

    test('Resize event should be triggered after resizing', async () => {
        const page = getPage();

        await page.locator('#resize').clear();
        await toggleEditMode(page);

        await page.locator('.highcharts-dashboards-component').first().click();

        const snap = page.locator('.highcharts-dashboards-edit-resize-snap-x')
            .first();
        await trigger(snap, 'mousedown', { force: true });
        await trigger(snap, 'mousemove', { clientX: 300, force: true });
        await trigger(snap, 'mouseup', { force: true });

        await expect(page.locator('#resize')).toHaveValue('resize');
    });

    test('Update event should be triggered after sidebar update', async () => {
        const page = getPage();

        await page.locator('.highcharts-dashboards-component').first()
            .click({ force: true });
        await page.locator(toolbarItem(2)).click();
        await page.locator('.highcharts-dashboards-edit-accordion-header-btn')
            .nth(3)
            .click();
        await page.locator('.highcharts-dashboards-edit-toggle-wrapper')
            .nth(1)
            .click();

        await expect(page.locator('#update')).toHaveValue('update');
        await page.getByText(/Confirm/u).first().click();
    });

    test('Press ESC should close sidebar popup', async () => {
        const page = getPage();

        await page.locator('.highcharts-dashboards-component').first()
            .click({ force: true });
        await page.locator(toolbarItem(2)).click();

        await expect(page.getByText(/Confirm/u).first()).toBeVisible();
        await page.keyboard.press('Escape');

        await expect(page.getByText(/Confirm/u).first()).toBeHidden();
    });

    test('Press ESC should close confirmation popup', async () => {
        const page = getPage();

        await page.locator('.highcharts-title').nth(1).click({ force: true });
        await page.locator(toolbarItem(3)).click();

        await expect(page.getByText(/Confirm/u).first()).toBeVisible();
        await page.keyboard.press('Escape');

        await expect(page.getByText(/Confirm/u).first()).toBeHidden();
    });

    test('Press ESC should hide toolbar', async () => {
        const page = getPage();
        const toolbar = page.locator('.highcharts-dashboards-edit-toolbar-cell');

        await page.locator('.highcharts-title').first().click({ force: true });

        await expect(toolbar).toBeVisible();
        await page.keyboard.press('Escape');

        // Hidden toolbars are moved off-screen
        await expect(toolbar).not.toBeInViewport();
    });

    test('Unmount event should be triggered when removed component', async () => {
        const page = getPage();

        await page.locator('.highcharts-title').first().click({ force: true });
        await page.locator(toolbarItem(3)).click({ force: true });
        await page.getByText(/Confirm/u).first().click({ force: true });

        await expect(page.locator('#unmount')).toHaveValue('unmount');
    });

    // Known failure, also before the move to Playwright
    test.fail('Cell destroyed event triggered when its the last cell in the row', async () => {
        const page = getPage();

        await page.locator('.highcharts-title').first().click({ force: true });
        await page.locator(toolbarItem(3)).click({ force: true });
        await page.getByText(/Confirm/u).first().click({ force: true });

        await expect(page.locator('#cellDestroyed')).toHaveValue('cellDestroyed');
        await expect(page.locator('#rowDestroyed')).toHaveValue('rowDestroyed');
    });

    test('Disabling edit mode should be possible after removing component', async () => {
        const page = getPage();

        await toggleEditMode(page);
        await expect(
            page.locator('.highcharts-dashboards-edit-toggle-container').first()
        ).toHaveAttribute('aria-checked', 'false');
    });
});
