import type { Page } from '@playwright/test';

type VisualChart = {
    container?: HTMLElement;
    renderer?: { forExport?: boolean };
};

export async function captureVisualSVG(
    page: Page,
    maxAttempts = 100,
    retryDelay = 100
): Promise<string> {
    return page.evaluate(async ({ maxAttempts, retryDelay }) => {
        const visualWindow = window as unknown as {
            Highcharts?: { charts?: (VisualChart | undefined)[] };
            VisualComparator?: { getSVG(chart: unknown): string | undefined };
        };
        const comparator = visualWindow.VisualComparator;
        if (!comparator) {
            throw new Error('Visual comparator is not loaded.');
        }
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const charts = visualWindow.Highcharts?.charts || [];
            if (
                !window.HCVisualSetup?.hasPendingRequests?.() &&
                (charts.at(-1) || document.getElementsByTagName('svg').length)
            ) {
                const validCharts = charts.filter(chart =>
                    chart && chart.container && !chart.renderer?.forExport
                );
                const svg = comparator.getSVG(validCharts.at(-1));
                if (!svg) {
                    throw new Error('No candidate SVG found.');
                }
                return svg;
            }
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
        throw new Error(
            `Chart or data failed to load within ${maxAttempts * retryDelay}ms.`
        );
    }, { maxAttempts, retryDelay });
}
