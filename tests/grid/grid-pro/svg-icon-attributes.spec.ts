import { test, expect } from '~/fixtures.ts';

const pageContent = `
    <!DOCTYPE html>
    <html>
        <head>
            <script src="https://code.highcharts.com/grid/grid-pro.js"></script>
            <link rel="stylesheet" href="https://code.highcharts.com/grid/grid-pro.css"></link>
        </head>
        <body>
            <div id="container"></div>
        </body>
    </html>
`;

async function renderCustomIcon() {
    const Grid = (window as any).Grid;
    const customD = 'M 1 1 L 11 11';

    const grid = await Grid.grid(document.getElementById('container'), {
        data: { columns: { amount: [1, 2, 3, 4, 5, 6] } },
        pagination: { enabled: true, pageSize: 2 },
        rendering: {
            icons: {
                doubleChevronLeft: {
                    width: 12,
                    height: 12,
                    children: [{
                        d: customD,
                        fill: 'none',
                        transform: 'translate(1 1)',
                        onmouseover: 'window.iconXssFired = 1;',
                        onload: 'window.iconXssFired = 1;'
                    }]
                }
            }
        }
    }, true);
    grid.viewport?.resizeObserver?.disconnect();

    const paths = Array.from(
        document.querySelectorAll('#container svg path')
    );

    const custom = paths.find(
        (path): boolean => path.getAttribute('d') === customD
    );

    custom?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

    return {
        customRendered: !!custom,
        anyHandlerAttribute: paths.some((path): boolean => (
            path.hasAttribute('onmouseover') || path.hasAttribute('onload')
        )),
        fired: (window as any).iconXssFired,
        fill: custom?.getAttribute('fill') ?? null,
        transform: custom?.getAttribute('transform') ?? null,
        strokeLinecap: custom?.getAttribute('stroke-linecap') ?? null
    };
}

test.describe('Custom SVG icon attributes', () => {
    test('Event handler attributes are not applied', async ({ page }) => {
        await page.setContent(pageContent, { waitUntil: 'networkidle' });

        const result = await page.evaluate(renderCustomIcon);

        expect(result.customRendered).toBe(true);
        expect(result.anyHandlerAttribute).toBe(false);
        expect(result.fired).toBeUndefined();
    });

    test('Documented path attributes are still applied', async ({ page }) => {
        await page.setContent(pageContent, { waitUntil: 'networkidle' });

        const result = await page.evaluate(renderCustomIcon);

        expect(result.customRendered).toBe(true);
        expect(result.fill).toBe('none');
        expect(result.transform).toBe('translate(1 1)');
        // Comes from pathDefaults, not from the definition.
        expect(result.strokeLinecap).toBe('round');
    });
});
