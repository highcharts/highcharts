import type { Page } from '@playwright/test';

/** Freeze the sample date without replacing timers or animation frames. */
export async function setVisualTime(page: Page): Promise<void> {
    await page.evaluate(() => {
        const time = Date.UTC(2024, 0, 1);
        const fixedDate = new Date(time);
        window.Date = new Proxy(Date, {
            apply: () => fixedDate.toString(),
            construct: (target, args, newTarget) => Reflect.construct(
                target, args.length ? args : [time], newTarget
            ) as Date,
            get: (target, property) => {
                const value: unknown = Reflect.get(target, property);
                return property === 'now' ? () => time : value;
            }
        });
    });
}
