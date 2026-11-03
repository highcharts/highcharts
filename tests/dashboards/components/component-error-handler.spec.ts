import { test, expect } from '~/fixtures.ts';
import { useSharedPage } from '~/helpers.ts';

const titleClassError = /\bhighcharts-dashboards-component-title-error\b/;

test.describe('Component error handling', () => {
    const getPage = useSharedPage('/dashboards/components/component-error-handler');

    test('Component that type does not exist, should throw error', async () => {
        await expect(getPage().locator('#dashboard-col-0 h2'))
            .toHaveClass(titleClassError);
    });

    test('HTML Component that has no tagName param, should throw error', async () => {
        await expect(getPage().locator('#dashboard-col-1 h2'))
            .toHaveClass(titleClassError);
    });

    test('Highcharts Component that has wrong configuration, should throw error', async () => {
        await expect(getPage().locator('#dashboard-col-2 h2'))
            .toHaveClass(titleClassError);
    });

    test('Highcharts Component with a nonexistent connector, should throw error', async () => {
        await expect(getPage().locator('#dashboard-col-3 h2'))
            .toHaveClass(titleClassError);
    });
});
