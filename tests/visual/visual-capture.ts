import type { Page } from '@playwright/test';

type VisualChart = {
    container?: HTMLElement;
    renderTo?: HTMLElement;
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
        const isReady = () =>
            !window.HCVisualSetup?.hasPendingRequests?.() &&
            (visualWindow.Highcharts?.charts?.at(-1) ||
                document.getElementsByTagName('svg').length);
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            if (isReady()) {
                // Let queued zero-delay sample updates run before capture.
                await new Promise(resolve => setTimeout(resolve, 0));
                if (!isReady()) {
                    continue;
                }
                const charts = visualWindow.Highcharts?.charts || [];
                const validCharts = charts.filter(chart =>
                    chart && chart.container && !chart.renderer?.forExport
                );
                // Async inset charts must not replace the primary sample chart.
                const chart = validCharts.find(chart =>
                    chart.renderTo?.id === 'container'
                ) || validCharts.at(-1);
                const svg = comparator.getSVG(chart);
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
