import { test, expect } from '~/fixtures.ts';

test.describe('Responsive rules', () => {
    const wrapperSelector = '#wrapper';
    const captionSelector = '.hcg-caption';

    const setWrapperWidth = async (page, width: number): Promise<void> => {
        await page.locator(wrapperSelector).evaluate((element, value) => {
            (element as HTMLElement).style.width = `${value}px`;
        }, width);
    };

    const assertColumns = async (
        page,
        expectedIds: string[]
    ): Promise<void> => {
        const ids = await page
            .locator('th[data-column-id]')
            .evaluateAll((headers) =>
                headers.map(
                    (header) => (header as HTMLElement).dataset.columnId
                )
            );
        expect(ids).toEqual(expectedIds);
    };

    test.beforeEach(async ({ page }) => {
        await page.goto('grid-lite/cypress/responsive-rules');
    });

    test('should render desktop layout by default', async ({ page }) => {
        await expect(page.locator(captionSelector)).toHaveText('Desktop: full data set');
        await assertColumns(page, [
            'firstName',
            'lastName',
            'email',
            'mobile',
            'street',
            'city',
            'state',
            'zip'
        ]);
        await expect(
            page.locator(
                '.hcg-row[data-row-index="0"] td[data-column-id="firstName"]'
            ).first()
        ).toHaveText('Liam');
    });

    test('should switch to tablet layout on smaller width', async ({ page }) => {
        await setWrapperWidth(page, 700);
        await expect(page.locator(captionSelector)).toContainText('Tablet: fewer columns');
        await assertColumns(page, ['firstName', 'email', 'mobile', 'street']);
        await expect(
            page.locator(
                '.hcg-row[data-row-index="0"] td[data-column-id="firstName"]'
            ).first()
        ).toHaveText('Liam Smith');
    });

    test('should switch to mobile layout on smallest width', async ({ page }) => {
        await setWrapperWidth(page, 480);
        await expect(page.locator(captionSelector)).toContainText('Mobile: compact view');
        await expect(page.locator('#container .hcg-container')).toHaveClass(/theme-mobile/);
        await assertColumns(page, ['firstName', 'mobile', 'street']);
        await expect(
            page.locator(
                '.hcg-row[data-row-index="0"] td[data-column-id="firstName"]'
            ).first()
                .locator('a')
        ).toHaveAttribute('href', /mailto:liam\.smith@example\.com/);
    });

    test('should restore desktop formatting when width grows again', async ({ page }) => {
        await setWrapperWidth(page, 480);
        await expect(page.locator(captionSelector)).toContainText('Mobile: compact view');
        await expect(page.locator('#container .hcg-container')).toHaveClass(/theme-mobile/);

        await setWrapperWidth(page, 980);
        await expect(page.locator(captionSelector)).toContainText('Desktop: full data set');
        await assertColumns(page, [
            'firstName',
            'lastName',
            'email',
            'mobile',
            'street',
            'city',
            'state',
            'zip'
        ]);
        await expect(page.locator('#container .hcg-container')).not.toHaveClass(/theme-mobile/);
        await expect(
            page.locator(
                '.hcg-row[data-row-index="0"] td[data-column-id="firstName"]'
            ).first()
        ).toHaveText('Liam');
    });
});
