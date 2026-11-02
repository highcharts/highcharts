import { test, expect } from '~/fixtures.ts';
import { useSharedPage, waitForBoard } from '../helpers.ts';

const activeClass = /\bhighcharts-dashboards-cell-state-active\b/;

test.describe('Component states', () => {
    const getPage = useSharedPage('/dashboards/component-options/states');

    test('Active state should be applied to the component', async () => {
        const page = getPage();

        await expect(page.locator('#dashboard-col-0')).toHaveClass(activeClass);

        await waitForBoard(page);
        expect(
            await page.evaluate(() => (window as any).Dashboards.boards[0]
                .mountedComponents[0].component.isActive),
            'The component\'s isActive property should be true.'
        ).toBe(true);
    });

    test('Click event should change the active state', async () => {
        const page = getPage();

        await page.locator('#dashboard-col-1').click();

        await expect(page.locator('#dashboard-col-0'))
            .not.toHaveClass(activeClass);
        await expect(page.locator('#dashboard-col-1')).toHaveClass(activeClass);

        const isActive = await page.evaluate(() => (window as any).Dashboards
            .boards[0].mountedComponents.map((m: any) => m.component.isActive));

        expect(
            isActive[0],
            'The first component\'s isActive property should be false.'
        ).toBe(false);
        expect(
            isActive[1],
            'The second component\'s isActive property should be true.'
        ).toBe(true);
    });
});
