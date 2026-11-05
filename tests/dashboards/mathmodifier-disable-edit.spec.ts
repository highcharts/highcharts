import { test, expect } from '~/fixtures.ts';
import { useSharedPage } from '~/helpers.ts';
import { waitForBoard } from './helpers.ts';

test.describe('MathModifier created columns and interaction.', () => {
    const getPage = useSharedPage('/dashboards/cypress/grid-mathmodifier/');

    test('Grid and HC component should disable changing the mathmodifier column.', async () => {
        const page = getPage();

        await waitForBoard(page);
        const { columns, draggable } = await page.evaluate(() => {
            const m = (window as any).Dashboards.boards[0].mountedComponents;

            return {
                columns: m[1].component.grid.options.columns,
                draggable: m[0].component.chart.series.map((series: any) => [
                    series.name,
                    series.options.dragDrop.draggableY
                ])
            };
        });

        expect(columns, 'USD column is not editable').toEqual([{
            id: 'USD',
            cells: {
                editMode: {
                    enabled: false
                }
            }
        }, {
            id: 'Day'
        }, {
            id: 'EUR'
        }, {
            id: 'Rate'
        }]);

        for (const [name, draggableY] of draggable) {
            expect(
                draggableY,
                name === 'USD' ?
                    'Series created out of mathmodifier column is not draggable' :
                    'Other series are draggable.'
            ).toBe(name !== 'USD');
        }
    });
});
