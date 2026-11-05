import type { Page } from '@playwright/test';
import { highchartsCSS } from '~/utils.ts';

export async function injectVisualSampleStyles(
    page: Page,
    isStyledMode: boolean,
    sampleCSS?: string
): Promise<void> {
    if (isStyledMode && highchartsCSS) {
        const styleHandle = await page.addStyleTag({
            content: highchartsCSS
        });
        await styleHandle.evaluate(
            element => element.id = 'highcharts.css'
        );
    }

    if (sampleCSS) {
        const styleHandle = await page.addStyleTag({
            content: sampleCSS
        });
        await styleHandle.evaluate(
            (element, id) => element.id = id,
            isStyledMode ? 'demo.css' : 'visual-test-styles'
        );
    }
}
