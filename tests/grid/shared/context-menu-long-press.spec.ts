import { test, expect } from '~/fixtures.ts';

// Safari fires no `contextmenu` event on long-press, so Grid polyfills it.
// The polyfill only arms itself on iOS, which this user agent makes true.
test.use({
    userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) ' +
        'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 ' +
        'Mobile/15E148 Safari/604.1',
    hasTouch: true
});

/**
 * Starts a touch on an element and leaves it held. The polyfill opens on its
 * own timer, without waiting for the touch to end.
 *
 * @param page
 * The page under test.
 *
 * @param selector
 * Element to press.
 */
async function pressAndHold(page, selector: string): Promise<void> {
    await page.evaluate((sel: string) => {
        const el = document.querySelector(sel);
        const { left, top } = el.getBoundingClientRect();
        const touch = new Touch({
            identifier: 1,
            target: el,
            clientX: left + 5,
            clientY: top + 5
        });

        el.dispatchEvent(new TouchEvent('touchstart', {
            bubbles: true,
            touches: [touch],
            targetTouches: [touch],
            changedTouches: [touch]
        }));
    }, selector);
}

test.describe('Context menu long-press', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-lite/e2e/cell-context-menu', {
            waitUntil: 'networkidle'
        });
        await page.waitForFunction(() => (
            (window as any).Grid?.grids?.length > 0
        ));
        await expect(page.locator('tbody td').first()).toBeVisible();
    });

    test('A long press opens the menu of a cell', async ({ page }) => {
        await pressAndHold(page, 'tbody td');

        await expect(page.locator('.hcg-popup')).toBeVisible();
    });

    test(
        'A long press opens the menu of an attached element',
        async ({ page }) => {
            await page.evaluate(() => {
                const button = document.createElement('button');
                button.id = 'lp-button';
                button.textContent = 'Actions';
                document.body.appendChild(button);

                (window as any).Grid.grids[0].contextMenu.attach(button, {
                    items: [{ label: 'Attached action' }]
                });
            });

            await pressAndHold(page, '#lp-button');

            await expect(page.locator('.hcg-popup')).toBeVisible();
            await expect(page.locator('.hcg-menu-item')).toHaveText([
                'Attached action'
            ]);
        }
    );

    test(
        'A long press on a control inside a cell is left alone',
        async ({ page }) => {
            // Pressing and holding a control is how its own interactions
            // start, so the cell's menu must stay out of the way.
            await page.evaluate(() => {
                const input = document.createElement('input');
                input.id = 'lp-input';
                document.querySelector('tbody td').appendChild(input);
            });

            await pressAndHold(page, '#lp-input');

            // Long enough for the press to have opened a menu if it were
            // going to.
            // eslint-disable-next-line playwright/no-wait-for-timeout
            await page.waitForTimeout(700);

            await expect(page.locator('.hcg-popup')).toHaveCount(0);
        }
    );

    test(
        'A long press opens the menu of a table without rows',
        async ({ page }) => {
            await page.evaluate(async () => {
                const container = document.createElement('div');
                container.id = 'lp-empty';
                document.body.appendChild(container);

                await (window as any).Grid.grid(container, {
                    data: { columns: { product: [] } },
                    rendering: {
                        table: {
                            contextMenu: {
                                items: [{ label: 'Body action' }]
                            }
                        }
                    }
                }, true);
            });

            await pressAndHold(page, '#lp-empty tbody');

            await expect(page.locator('.hcg-popup')).toBeVisible();
            await expect(page.locator('.hcg-menu-item')).toHaveText([
                'Body action'
            ]);
        }
    );

    test(
        'A long press where no menu would open is left to the browser',
        async ({ page }) => {
            await page.evaluate(async () => {
                const container = document.createElement('div');
                container.id = 'lp-plain';
                document.body.appendChild(container);

                await (window as any).Grid.grid(container, {
                    data: { columns: { product: ['Apples'] } }
                }, true);
            });

            const cell = '#lp-plain tbody td';

            await pressAndHold(page, cell);

            expect(
                await page.evaluate((sel: string) => (
                    getComputedStyle(document.querySelector(sel)).userSelect
                ), cell)
            ).not.toBe('none');

            // Long enough for the press to have opened a menu if it were
            // going to.
            // eslint-disable-next-line playwright/no-wait-for-timeout
            await page.waitForTimeout(700);

            await expect(page.locator('.hcg-popup')).toHaveCount(0);
        }
    );
});
