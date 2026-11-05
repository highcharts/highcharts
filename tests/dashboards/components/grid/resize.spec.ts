import { test, expect } from '~/fixtures.ts';
import { testViewport, trigger } from '~/helpers.ts';
import { waitForBoard } from '../../helpers.ts';

test.use({ viewport: testViewport });

test.describe('Grid resize.', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboards/cypress/component-grid-resize');
    });

    test('Changes in the grid should be reflected in the options', async ({ page }) => {
        const cell = page.locator('.hcg-header-cell').first();
        const resizer = cell.locator('.hcg-column-resizer');

        await trigger(resizer, 'mousedown');
        await trigger(resizer, 'mousemove', { pageX: 100 });
        await trigger(resizer, 'mouseup');

        await expect.poll(() => cell.evaluate(
            el => el.getBoundingClientRect().width
        )).toBeLessThan(400);

        await waitForBoard(page);
        const options = await page.evaluate(() => {
            const componentOptions = (window as any).Dashboards.boards[0]
                .getOptions().components[0];
            const gridOptions = componentOptions.gridOptions;

            return {
                type: componentOptions.type,
                columnDefaults: gridOptions.columnDefaults,
                columns: !!gridOptions.columns,
                credits: gridOptions.credits,
                lang: gridOptions.lang,
                rendering: gridOptions.rendering
            };
        });

        expect(options.type, 'Component type should be Grid').toBe('Grid');
        expect(options.columnDefaults, 'Column defaults should not be defined')
            .toBeFalsy();
        expect(options.columns, 'Columns should be defined').toBe(true);
        expect(options.credits, 'Credits should not be defined').toBeFalsy();
        expect(options.lang, 'Language should not be defined').toBeFalsy();
        expect(options.rendering, 'Rendering should not be defined')
            .toBeFalsy();
    });
});
