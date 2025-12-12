/**
 * Timezone tests for Highcharts Time functionality.
 *
 * These tests run time-related functionality across multiple browser timezone
 * contexts to ensure Highcharts handles timezone conversions correctly
 * regardless of the user's local timezone.
 *
 * This replaces the previous QUnit-based approach with native Playwright tests.
 */
import { test, expect } from '~/fixtures.ts';
import { join } from 'node:path';

// Paths relative to repo root (where Playwright runs from)
// Using 1970-2030 data file to ensure timezone data is available for test dates
const MOMENT_PATH = join('node_modules', 'moment', 'moment.js');
const MOMENT_TZ_PATH = join('node_modules', 'moment-timezone', 'builds', 'moment-timezone-with-data-1970-2030.min.js');

const TIMEZONES = [
    'Australia/Melbourne',
    'America/Los_Angeles',
    'Asia/Kolkata',
    'UTC',
    'Atlantic/Reykjavik',
    'Pacific/Fiji',
    'Europe/London',
    'Europe/Paris'
] as const;

/**
 * Helper to set up a page with Highcharts and optionally moment-timezone
 */
async function setupPage(page: import('@playwright/test').Page, needsMoment = false) {
    await page.setContent(`
        <!DOCTYPE html>
        <html>
        <head></head>
        <body><div id="container"></div></body>
        </html>
    `);

    // Load Highcharts from local code via route rewriting
    await page.addScriptTag({ url: 'https://code.highcharts.com/highcharts.js' });
    await page.waitForFunction(() => !!(window as any).Highcharts);

    if (needsMoment) {
        // Load moment first, then moment-timezone (which depends on moment)
        await page.addScriptTag({ path: MOMENT_PATH });
        await page.waitForFunction(() => !!(window as any).moment);
        await page.addScriptTag({ path: MOMENT_TZ_PATH });
        await page.waitForFunction(() => !!(window as any).moment.tz);
    }
}

for (const tz of TIMEZONES) {
    test.describe(`Timezone: ${tz}`, () => {
        test.use({ timezoneId: tz });

        test('Time.dateFormat with fixed CET timezone across DST', async ({ page }) => {
            await setupPage(page, true);

            const result = await page.evaluate(() => {
                const Highcharts = (window as any).Highcharts;
                const time = new Highcharts.Time({
                    timezone: 'CET'
                });
                const ticks: string[] = [];

                for (
                    let t = Date.UTC(2022, 9, 26, 22);
                    t < Date.UTC(2022, 10, 2, 10);
                    t += 12 * 36e5
                ) {
                    ticks.push(time.dateFormat(null, t));
                }

                return ticks;
            });

            expect(result).toEqual([
                '2022-10-27 00:00:00',
                '2022-10-27 12:00:00',
                '2022-10-28 00:00:00',
                '2022-10-28 12:00:00',
                '2022-10-29 00:00:00',
                '2022-10-29 12:00:00',
                '2022-10-30 00:00:00',
                '2022-10-30 11:00:00',
                '2022-10-30 23:00:00',
                '2022-10-31 11:00:00',
                '2022-10-31 23:00:00',
                '2022-11-01 11:00:00',
                '2022-11-01 23:00:00'
            ]);
        });

        test('Time.parse with timezone information', async ({ page }) => {
            await setupPage(page, false);

            const result = await page.evaluate(() => {
                const Highcharts = (window as any).Highcharts;
                const time = new Highcharts.Time({});
                const samples = [
                    '2018-03-13T17:00:00+00:00',
                    '2018-03-13T20:00:00+03:00',
                    '2018-03-13T17:00:00GMT',
                    '2018-03-13T07:00:00GMT-1000',
                    '2018-03-13T08:00:00GMT-09:00',
                    '2018-03-13T17:00:00UTC',
                    '2018-03-13T18:30:00UTC+0130',
                    '2018-03-13T17:30:00UTC+00:30',
                    '2018-03-13T17:00:00Z'
                ];

                const expected = new Date(samples[0]).toISOString();
                const results: { 
                    sample: string; parsed: string; matches: boolean 
                }[] = [];

                samples.forEach(sample => {
                    const timestamp = time.parse(sample);
                    const parsed = new Date(timestamp).toISOString();
                    results.push({
                        sample,
                        parsed,
                        matches: parsed === expected
                    });
                });

                return { expected, results };
            });

            for (const r of result.results) {
                expect(
                    r.matches, 
                    `${r.sample} should parse to ${result.expected}, got ${r.parsed}`
                ).toBe(true);
            }
        });

        test('Time.parse short month format', async ({ page }) => {
            await setupPage(page, false);

            const result = await page.evaluate(() => {
                const Highcharts = (window as any).Highcharts;
                const time = new Highcharts.Time();
                const shortFormat = time.parse('2025-01');
                const longFormat = time.parse('2025-01-01');

                return {
                    shortFormatType: typeof shortFormat,
                    shortFormat,
                    longFormat,
                    equal: shortFormat === longFormat
                };
            });

            expect(result.shortFormatType).toBe('number');
            expect(result.equal, 'YYYY-MM should equal YYYY-MM-DD').toBe(true);
        });

        test('Time ticks across DST transition', async ({ page }) => {
            await setupPage(page, true);

            const result = await page.evaluate(() => {
                const Highcharts = (window as any).Highcharts;
                const time = new Highcharts.Time({
                    timezone: 'CET'
                });

                const ticks = time.getTimeTicks(
                    { unitRange: 60000, count: 10 },
                    Date.UTC(2022, 9, 29, 23),
                    Date.UTC(2022, 9, 30, 2)
                );

                return ticks.map((tick: number) => {
                    const d = new Date(tick);
                    const hours = d.getUTCHours().toString().padStart(2, '0');
                    const mins = d.getUTCMinutes().toString().padStart(2, '0');
                    return `${hours}:${mins}`;
                });
            });

            // Should be continuous from 23:00 to 02:00
            expect(result).toEqual([
                '23:00', '23:10', '23:20', '23:30', '23:40', '23:50',
                '00:00', '00:10', '00:20', '00:30', '00:40', '00:50',
                '01:00', '01:10', '01:20', '01:30', '01:40', '01:50',
                '02:00'
            ]);
        });

        test('Chart timezone option', async ({ page }) => {
            await setupPage(page, true);

            const result = await page.evaluate(() => {
                const Highcharts = (window as any).Highcharts;
                
                const chart = Highcharts.chart('container', {
                    title: { text: 'Timezone test' },
                    time: { timezone: 'Europe/Oslo' },
                    xAxis: { type: 'datetime' },
                    series: [{
                        data: [0, 1, 2, 3, 4],
                        pointStart: Date.UTC(2014, 9, 24),
                        pointInterval: 24 * 36e5
                    }]
                });

                return chart.xAxis[0].tickPositions;
            });

            // Ticks should be on Oslo midnights
            expect(result).toEqual([
                1414188000000,
                1414274400000,
                1414364400000,
                1414450800000
            ]);
        });

        test('Chart.update timezone change', async ({ page }) => {
            await setupPage(page, true);

            const result = await page.evaluate(() => {
                const Highcharts = (window as any).Highcharts;
                
                const chart = Highcharts.chart('container', {
                    chart: { width: 600, height: 200 },
                    time: { timezone: 'Europe/Oslo' },
                    xAxis: { type: 'datetime' },
                    series: [{
                        data: [0, 1, 2, 3, 4],
                        pointStart: Date.UTC(2014, 9, 24),
                        pointInterval: 24 * 36e5
                    }]
                });

                const initialTicks = [...chart.xAxis[0].tickPositions];

                // Update to New York timezone
                chart.update({ time: { timezone: 'America/New_York' } });

                return {
                    initialTicks,
                    updatedTicks: [...chart.xAxis[0].tickPositions],
                    timezone: chart.options.time.timezone
                };
            });

            // Initial ticks - Oslo midnights
            expect(result.initialTicks).toEqual([
                1414188000000,
                1414274400000,
                1414364400000,
                1414450800000
            ]);

            // Ticks should now be on New York midnights
            expect(result.updatedTicks).toEqual([
                1414123200000,
                1414209600000,
                1414296000000,
                1414382400000
            ]);

            // Options should also be updated
            expect(result.timezone).toBe('America/New_York');
        });

        test('Updating from global to instance time', async ({ page }) => {
            await setupPage(page, true);

            const result = await page.evaluate(() => {
                const Highcharts = (window as any).Highcharts;
                
                const chart = Highcharts.chart('container', {
                    series: [{ data: [1, 3, 2, 4] }]
                });

                const initialTimezone = chart.time.timezone;

                // Update to local time
                chart.update({ time: { useUTC: false } });

                return {
                    initialTimezone,
                    afterUpdate: chart.time.timezone
                };
            });

            expect(result.initialTimezone).toBe('UTC');
            expect(result.afterUpdate).toBeUndefined();
        });
    });
}
