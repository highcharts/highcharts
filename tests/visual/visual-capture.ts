import type { Page } from '@playwright/test';

type VisualChart = {
    container?: HTMLElement;
    hasLoaded?: boolean;
    renderTo?: HTMLElement;
    renderer?: { forExport?: boolean };
};

type VisualBoard = {
    container: HTMLElement;
    boardWrapper?: HTMLElement;
    options: { components?: unknown[] };
    mountedComponents: {
        component: {
            chart?: VisualChart;
            grid?: { isRendered: boolean };
        };
    }[];
};

export async function captureVisualSVG(
    page: Page,
    maxAttempts = 100,
    retryDelay = 100
): Promise<string> {
    const capture = await page.evaluate(async ({ maxAttempts, retryDelay }) => {
        const visualWindow = window as unknown as {
            Highcharts?: { charts?: (VisualChart | undefined)[] };
            Dashboards?: { boards: (VisualBoard | undefined)[] };
            VisualComparator?: { getSVG(chart: unknown): string | undefined };
        };
        const comparator = visualWindow.VisualComparator;
        if (!comparator) {
            throw new Error('Visual comparator is not loaded.');
        }
        const getChart = () => {
            const charts = visualWindow.Highcharts?.charts || [];
            const validCharts = charts.filter(chart =>
                chart && chart.container && !chart.renderer?.forExport
            );
            // Async inset charts must not replace the primary sample chart.
            return validCharts.find(chart =>
                chart.renderTo?.id === 'container'
            ) || validCharts.at(-1);
        };
        const getBoard = () => visualWindow.Dashboards?.boards.find(board =>
            board?.container.isConnected
        );
        const isReady = () => {
            if (window.HCVisualSetup?.hasPendingRequests?.()) {
                return false;
            }
            const board = getBoard();
            if (board) {
                return board.mountedComponents.length ===
                    board.options.components?.length &&
                    board.mountedComponents.every(({ component }) =>
                        component.chart?.hasLoaded || component.grid?.isRendered
                    );
            }
            const chart = getChart();
            return chart ? chart.hasLoaded :
                document.getElementsByTagName('svg').length;
        };
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            if (isReady()) {
                // Let queued zero-delay sample updates run before capture.
                await new Promise(resolve => setTimeout(resolve, 0));
                if (!isReady()) {
                    continue;
                }
                const board = getBoard();
                if (board) {
                    const container = board.boardWrapper || board.container;
                    return {
                        dashboard: `#${CSS.escape(container.id)}`
                    };
                }
                const svg = comparator.getSVG(getChart());
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

    if (typeof capture === 'string') {
        return capture;
    }

    // Dashboards contain HTML grids as well as charts. Keep the SVG artifact
    // format by embedding a screenshot of the complete, rendered dashboard.
    const png = await page.locator(capture.dashboard).screenshot({
        animations: 'disabled'
    });
    const width = png.readUInt32BE(16);
    const height = png.readUInt32BE(20);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
        `<image width="${width}" height="${height}" href="data:image/png;base64,${png.toString('base64')}"/>` +
        '</svg>';
}
