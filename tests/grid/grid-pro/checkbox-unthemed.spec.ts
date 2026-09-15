import type { Page } from '@playwright/test';
import { test, expect } from '~/fixtures.ts';

type Probe = {
    appearance: string;
    width: number;
    height: number;
    checkMark: string;
};

/**
 * Renders a grid with a checkbox cell renderer and reports how the checkbox
 * is painted.
 */
async function probeCheckbox(page: Page, theme?: string): Promise<Probe> {
    await page.goto('/grid-pro/basic/overview');

    await page.evaluate(async (t) => {
        document.body.innerHTML =
            '<div id="container" style="height: 200px;"></div>';

        const rendering: Record<string, unknown> = {};
        if (t !== undefined) {
            rendering.theme = t;
        }

        (window as any).grid = await (window as any).Grid.grid('container', {
            data: { columns: { flag: [true, false] } },
            rendering,
            columns: [{
                id: 'flag',
                cells: { renderer: { type: 'checkbox' } }
            }]
        }, true);
    }, theme);

    await page.waitForFunction(
        () => document.querySelectorAll('tbody td').length > 0
    );

    return await page.evaluate(() => {
        const el = document.querySelector(
            'tbody input[type="checkbox"]'
        ) as HTMLElement;
        const cs = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
            appearance: cs.appearance,
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            checkMark: getComputedStyle(el, '::before').content
        };
    });
}

test.describe('Checkbox input across themes', () => {
    test('Themed grids keep the custom checkbox', async ({ page }) => {
        const probe = await probeCheckbox(page);

        expect(probe.appearance).toBe('none');
        expect(probe.width).toBeGreaterThan(15);
        // The custom check mark is drawn for the checked row.
        expect(probe.checkMark).not.toBe('none');
    });

    test('Unthemed grids fall back to a visible native checkbox',
        async ({ page }) => {
            const probe = await probeCheckbox(page, '');

            // The `appearance` reset strips the native box; without the theme
            // there is nothing to replace it with, so it must not apply.
            expect(probe.appearance).not.toBe('none');

            // Still laid out, and never stretched by the base width rule.
            expect(probe.width).toBeGreaterThan(10);
            expect(probe.width).toBeLessThan(40);
            expect(probe.height).toBeGreaterThan(10);

            // No half-drawn custom mark on top of the native one.
            expect(probe.checkMark).toBe('none');
        });
});
