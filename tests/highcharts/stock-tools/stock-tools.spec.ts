import type { Page } from '@playwright/test';
import { test, expect } from '~/fixtures.ts';
import { dispatchClick, useSharedPage, waitForChart } from '~/helpers.ts';
import {
    addIndicator,
    clickChart,
    dragTo,
    openIndicators,
    selectIndicator
} from '../helpers.ts';

const sample = '/highcharts/e2e/stock-tools-gui/';
const searchInput = 'input[name="highcharts-input-search-indicators"]';

async function getAnnotationCount(page: Page): Promise<number> {
    await waitForChart(page);
    return page.evaluate(() => Highcharts.charts[0].annotations.length);
}

test.describe('Stock Tools annotation popup, #15725', () => {
    const getPage = useSharedPage(
        sample,
        page => page.setViewportSize({ width: 1000, height: 500 })
    );

    test('Adding annotation after deselecting the button should not be allowed, #16485.', async () => {
        const page = getPage();
        const button = page.locator('.highcharts-label-annotation').first();

        await button.click();
        await button.click();
        await clickChart(page, [[100, 210]]);

        expect(
            await getAnnotationCount(page),
            'Annotation should not be added.'
        ).toBe(0);
    });

    test('Popup should close after hiding and stay open after dragging, #15730, #15729, #15727.', async () => {
        const page = getPage();
        const popup = page.locator('.highcharts-popup');

        await test.step('#15730: Should close popup after hiding annotation', async () => {
            await page.locator('.highcharts-label-annotation').first().click();
            await page.locator('.highcharts-container').click();
            await expect.poll(() => getAnnotationCount(page)).toBe(1);
            await page.locator('.highcharts-annotation').click();
            await expect(popup).toBeVisible();
            await page.locator('.highcharts-toggle-annotations').click();
            await expect(popup).toBeHidden();
            await page.locator('.highcharts-toggle-annotations').click();
        });

        await test.step('#15729: Should keep annotation selected after dragging', async () => {
            const annotation = page.locator('.highcharts-annotation');

            await annotation.click();
            await dragTo(annotation, [300, 100]);
            await expect(popup).toBeVisible();
        });

        await test.step('#15729: Should keep annotation selected after dragging control point', async () => {
            await dragTo(
                page.locator('.highcharts-control-points > *').first(),
                [600, 200]
            );
            await expect(popup).toBeVisible();
        });

        await test.step('#15727: Should keep popup open after dragging from input to outside popup', async () => {
            await page.locator('.highcharts-annotation-edit-button').click();
            await dragTo(
                page.locator('.highcharts-popup input').first(),
                [100, 200]
            );
            await expect(popup).toBeVisible();
        });
    });

    test('#15725: Should use the same axis for all points in multi-step annotation', async () => {
        const page = getPage();

        await page.locator('.highcharts-elliott3').first().click();
        await clickChart(
            page,
            [[100, 210], [120, 260], [140, 210], [160, 260]]
        );

        await expect.poll(() => page.evaluate(() => {
            const annotations = Highcharts.charts[0].annotations;

            return annotations[annotations.length - 1].points.every(
                (point: any) => point.y > -50 && point.y < 75
            );
        })).toBe(true);
    });

    test('#16158: Should use correct default series in popup', async () => {
        const page = getPage();
        const series = page.locator(
            '.highcharts-tab-item-show #highcharts-select-series'
        );
        const volume = page.locator(
            '.highcharts-tab-item-show #highcharts-select-volume'
        );

        await page.locator('.highcharts-indicators').click();
        await selectIndicator(page, 'Accumulation');
        await expect(series).toHaveValue('aapl-ohlc');
        await expect(volume).toHaveValue('aapl-volume');
        await addIndicator(page);

        await page.locator('.highcharts-indicators').click();
        await page.locator('.highcharts-tab-item', { hasText: 'Edit' }).click();
        await expect(series).toHaveValue('aapl-ohlc');
        await expect(volume).toHaveValue('aapl-volume');
        await page.locator('.highcharts-popup-rhs-col button', {
            hasText: 'Save'
        }).first().click();
    });

    test('#16159: For some indicators params, there should be a dropdown with options in popup.', async () => {
        const page = getPage();

        await openIndicators(page);
        await selectIndicator(page, 'Disparity Index');

        await page.locator('#highcharts-select-params\\.average')
            .selectOption('ema');
        await addIndicator(page);
    });

    test('#17425: Editing labels of Elliott3 line.', async () => {
        const page = getPage();
        const input = page.locator('input[name="highcharts-annotation-0"]');

        await test.step('#17425: Editing labels of Elliott3 line should not hide the line.', async () => {
            await page.locator('.highcharts-elliott3').first().click();

            await clickChart(
                page,
                [[300, 100], [320, 120], [340, 120], [360, 100]],
                true
            );

            await dispatchClick(
                page.locator('.highcharts-annotation-shapes').last()
            );
            await page.locator('.highcharts-annotation-edit-button').click();

            await input.fill('1');

            await page.locator('div.highcharts-popup-bottom-row button').click();

            await expect.poll(
                () => page.evaluate(() => {
                    const annotations = Highcharts.charts[0].annotations;

                    return annotations[annotations.length - 1].graphic.opacity;
                }),
                '#17425: Editing labels of Elliott3 line should not hide the line.'
            ).toBe(1);
        });

        await test.step('#17425: Editing labels of Elliott3 line to number should not change type of input.', async () => {
            await dispatchClick(
                page.locator('.highcharts-annotation-shapes').last()
            );
            await page.locator('.highcharts-annotation-edit-button').click();

            await input.fill('(X)');

            await page.locator('div.highcharts-popup-bottom-row button').click();

            await dispatchClick(
                page.locator('.highcharts-annotation-shapes').last()
            );
            await page.locator('.highcharts-annotation-edit-button').click();

            await expect(input).toHaveValue('(X)');

            await page.locator('button.highcharts-popup-close').click();
        });
    });
});

test.describe('Indicator popup searchbox, #16019.', () => {
    const getPage = useSharedPage(
        sample,
        page => page.setViewportSize({ width: 1000, height: 800 })
    );

    test('Search indicator input should filter the list, #16019.', async () => {
        const page = getPage();
        const input = page.locator(searchInput);
        const firstItem = page.locator('.highcharts-indicator-list li').first();

        await test.step('Search indicator input should filter and sort the list, #16019.', async () => {
            await openIndicators(page);

            // Test if searching works.
            await input.click();
            await input.pressSequentially('ac');
            await expect(page.locator('.highcharts-indicator-list')).toHaveCount(5);

            // Test the sorting.
            await input.pressSequentially('c');
            await expect(firstItem).toContainText('Acceleration Bands');

            // Test if regex works.
            await input.clear();
            await input.pressSequentially('cd');
            await expect(firstItem).toContainText('MACD');
        });

        await test.step('Clicking the reset button should reset the indicator list, #16019.', async () => {
            await page.locator('.clear-filter-button').click();

            await expect(input).toHaveValue('');

            await expect(page.locator('.highcharts-indicator-list')).toHaveCount(50);
        });

        await test.step('Indicators should be accessible through aliases, #16019.', async () => {
            await input.pressSequentially('boll');

            await expect(firstItem).toContainText('BB');
        });

        await test.step('Popup should warn when no items are found using the filter, #16019.', async () => {
            await input.pressSequentially('dada');

            await expect(page.locator('.highcharts-popup-rhs-col-wrapper').first())
                .toContainText('No match');

            await page.locator('.clear-filter-button').click();

            await expect(firstItem).toContainText('Acceleration Bands');
        });
    });

    test('Indicators popup should open after update and close, #17741, #16487.', async () => {
        const page = getPage();

        await test.step('Stock-tools should work after update, #17741.', async () => {
            await page.locator('.highcharts-toggle-toolbar').click();
            await page.locator('.highcharts-toggle-toolbar').click();
            await openIndicators(page);
            await expect(page.locator('.highcharts-popup')).toBeVisible();
        });

        await test.step('Indicators button should be inactive when popup is closed #16487', async () => {
            await page.locator('.highcharts-popup-close').click();
            await expect(page.locator('.highcharts-indicators'))
                .not.toHaveClass(/\bhighcharts-active\b/);
        });
    });
});

test.describe('Annotations popup text field', () => {
    test.use({ viewport: { width: 1000, height: 800 } });

    test.beforeEach(async ({ page }) => {
        await page.goto(sample);
    });

    test('Should be able to type `space` char in the text field', async ({ page }) => {
        const input = page.locator(
            'input[highcharts-data-name="typeOptions.line.fill"]'
        );

        await page.locator('.highcharts-fibonacci').first().click();
        await clickChart(page, [[300, 100], [400, 100], [350, 200]], true);
        await page.locator('.highcharts-annotation').click();
        await page.locator('button.highcharts-annotation-edit-button').click();
        await input.clear();
        await input.pressSequentially(' ');
        await expect(input).toHaveValue(' ');
    });
});

