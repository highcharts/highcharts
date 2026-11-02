import { test, expect } from '~/fixtures.ts';
import { useSharedPage } from '../helpers.ts';

test.describe('Edit Mode options', () => {
    const getPage = useSharedPage(
        '/dashboards/cypress/edit-mode-disabled-markup',
        page => page.setViewportSize({ width: 1200, height: 1000 })
    );

    test('Disabled EditMode markup should not be printed', async () => {
        const page = getPage();

        for (const selector of [
            '.highcharts-dashboards--fullscreen',
            '.highcharts-dashboards-edit-tools',
            '.highcharts-dashboards-edit-ctx-detection-pointer',
            '.highcharts-dashboards-edit-confirmation-popup',
            '.highcharts-dashboards-edit-overlay'
        ]) {
            await expect(page.locator(selector)).toHaveCount(0);
        }
    });
});
