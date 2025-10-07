import { test, expect } from '../fixtures.ts';

test.describe('Pointer', {
    annotation: [
        {
            type: 'qunit-sample',
            description: 'samples/unit-tests/highcharts/pointer/members'
        }
    ]
}, () => {

    test.beforeEach(async ({ page }) => {
        await page.setContent(`
            <html>
                <head>
                    <meta charset="utf-8" />
                    <style> #container { width: 1000px; height: 400px; } </style>
                    <script src="https://code.highcharts.com/highcharts.js"></script>
                    <script src="https://code.highcharts.com/highcharts-more.js"></script>
                </head>
                <body>
                    <div id="container"></div>
                </body>
            </html>
        `);
    });

    test('Pointer event order and tracking', async ({ page }) => {

        const chartHandle = await test.step('Create chart and event tracking', async () => {
            return page.evaluateHandle(() => {
                const isNumber = Highcharts.isNumber;
                function pushEvent(type, series, point) {
                    const sI = series && isNumber(series.index) ? series.index : '-',
                        pI = point && isNumber(point.index) ? point.index : '-',
                        str = [type, sI, pI].join('.');
                    if (!window['__events']) {
                        window['__events'] = [];
                    }
                    window['__events'].push(str);
                }
                const config = {
                    chart: {
                        animation: false,
                        width: 1000
                    },
                    plotOptions: {
                        series: {
                            animation: false,
                            kdNow: true, // Force kd tree to run synchronously.
                            events: {
                                mouseOver: function () {
                                    pushEvent('mouseOver', this, undefined);
                                },
                                mouseOut: function () {
                                    pushEvent('mouseOut', this, undefined);
                                }
                            },
                            point: {
                                events: {
                                    mouseOver: function () {
                                        pushEvent('mouseOver', this.series, this);
                                    },
                                    mouseOut: function () {
                                        pushEvent('mouseOut', this.series, this);
                                    }
                                }
                            }
                        }
                    }
                };

                return Highcharts.chart({
                    ...config,
                    chart: {
                        ...config.chart,
                        renderTo: 'container'
                    },
                    series: [
                        {
                            type: 'line',
                            data: [1, 2, 3]
                        },
                        {
                            type: 'line',
                            data: [3, 2, 1]
                        }
                    ]
                });
            });
        });


        const getAbsPoint = async (s: number, p: number) => {
            return page.evaluate(([s, p]) => {
                const chart = Highcharts.charts[0];
                const pt = chart.series[s].points[p];
                return {
                    x: chart.plotLeft + pt.plotX,
                    y: chart.plotTop + pt.plotY
                };
            }, [s, p]);
        };
        const clearEvents = async () => page.evaluate(() => {
            window['__events'] = [];
        });
        const shift = async () => page.evaluate(() => {
            return window['__events'] ? window['__events'].shift() : undefined;
        });
        const length = async () => page.evaluate(() => {
            return window['__events'] ? window['__events'].length : 0;
        });

        // await clearEvents(); // previous chart destruction equivalent
        await test.step('Move mouse to series[0] point[0] and check events', async () => {
            const p00 = await getAbsPoint(0, 0);
            await page.mouse.move(p00.x, p00.y + 50);
            await page.mouse.move(p00.x, p00.y);

            expect(await shift()).toBe('mouseOver.0.-');  // series[0]
            expect(await shift()).toBe('mouseOver.0.0');  // point 0
            expect(await length()).toBe(0);
        });

        await test.step('Clear events after first move', async () => {
            await clearEvents();
        });

        await test.step('Move mouse to series[1] point[0] and check events', async () => {
            const p10 = await getAbsPoint(1, 0);
            await page.mouse.move(p10.x, p10.y);

            expect(await shift()).toBe('mouseOut.0.0'); // left series[0].point[0]
            expect(await shift()).toBe('mouseOut.0.-'); // left series[0]
            expect(await shift()).toBe('mouseOver.1.-'); // entered series[1]
            expect(await shift()).toBe('mouseOver.1.0'); // entered series[1].point[0]
            expect(await length()).toBe(0);
        });

        await test.step('Clear events after second move', async () => {
            await clearEvents();
        });

        await test.step('Move mouse to series[1] point[2] and check events', async () => {
            const p12 = await getAbsPoint(1, 2);
            await page.mouse.move(p12.x, p12.y);

            expect(await shift()).toBe('mouseOut.1.0');
            expect.soft(await shift()).toBe('mouseOver.1.2');

            expect(await length()).toBe(0);
            await clearEvents();

            await page.mouse.move(p12.x, p12.y);
            await page.mouse.move(p12.x, p12.y + 30);
            expect(await length()).toBe(0);
            await clearEvents();
        });

        await test.step('Add and test bubble series', async () => {
            const bubble0 = await chartHandle.evaluate((c) => {
                const bigRadius = 60;
                const series = c.addSeries({
                    type: 'bubble',
                    maxSize: bigRadius * 2,
                    minSize: 20,
                    data: [
                        [1, 9, 2],   // index 0
                        [1.2, 9, 1], // index 1
                        [1.2, 6, 1]  // index 2
                    ]
                });

                const pt = series.points[0];
                return {
                    x: c.plotLeft + pt.plotX + 60 + 7,
                    y: c.plotTop + pt.plotY
                };
            });

            await page.mouse.move(bubble0.x, bubble0.y);
            await page.mouse.move(bubble0.x, bubble0.y + 70);

            const events = await page.evaluate(() => window['__events'].slice());

            expect(events.pop()).toBe('mouseOver.2.2');
            expect(events.includes('mouseOver.2.0')).toBeTruthy();
            expect(events.includes('mouseOver.2.1')).toBeFalsy();
        });
    });

    test('Pointer.runPointActions stickyTracking: false', async ({ page }) => {
        await test.step('Create chart with stickyTracking: false and event tracking', async () => {
            return page.evaluateHandle(() => {
                const isNumber = Highcharts.isNumber;
                function pushEvent(type, series, point) {
                    const sI = series && isNumber(series.index) ? series.index : '-',
                        pI = point && isNumber(point.index) ? point.index : '-',
                        str = [type, sI, pI].join('.');
                    if (!window['__events']) {
                        window['__events'] = [];
                    }
                    window['__events'].push(str);
                }
                const config = {
                    chart: {
                        animation: false,
                        width: 1000
                    },
                    plotOptions: {
                        series: {
                            animation: false,
                            kdNow: true,
                            stickyTracking: false,
                            events: {
                                mouseOver: function () {
                                    pushEvent('mouseOver', this, undefined);
                                },
                                mouseOut: function () {
                                    pushEvent('mouseOut', this, undefined);
                                }
                            },
                            point: {
                                events: {
                                    mouseOver: function () {
                                        pushEvent('mouseOver', this.series, this);
                                    },
                                    mouseOut: function () {
                                        pushEvent('mouseOut', this.series, this);
                                    }
                                }
                            }
                        }
                    }
                };
                return Highcharts.chart({
                    ...config,
                    chart: {
                        ...config.chart,
                        renderTo: 'container'
                    },
                    series: [
                        {
                            type: 'line',
                            data: [1, 2, 3]
                        },
                        {
                            type: 'line',
                            data: [3, 2, 1]
                        }
                    ]
                });
            });
        });

        const getAbsPoint = async (s: number, p: number) => {
            return page.evaluate(([s, p]) => {
                const chart = Highcharts.charts[0];
                const pt = chart.series[s].points[p];
                return {
                    x: chart.plotLeft + pt.plotX,
                    y: chart.plotTop + pt.plotY
                };
            }, [s, p]);
        };

        const getEvents = async () => page.evaluate(() => {
            if (!window['__events']) window['__events'] = [];
            return window['__events'].slice();
        });

        await test.step('Move mouse to just outside series[1] point[0]', async () => {
            const snap = await page.evaluate(() => {
                const chart = Highcharts.charts[0];
                return chart.options.tooltip && typeof chart.options.tooltip.snap === 'number'
                    ? chart.options.tooltip.snap : 10;
            });
            const p10 = await getAbsPoint(1, 0);
            await page.mouse.move(p10.x, p10.y + snap + 25);
            await page.mouse.move(p10.x, p10.y + snap + 15);
            const events = await getEvents();
            expect(events.length).toBe(0);
        });

        await test.step('Move mouse to just inside series[1] point[0]', async () => {
            const snap = await page.evaluate(() => {
                const chart = Highcharts.charts[0];
                return chart.options.tooltip && typeof chart.options.tooltip.snap === 'number'
                    ? chart.options.tooltip.snap : 10;
            });
            const p10 = await getAbsPoint(1, 0);
            await page.mouse.move(p10.x, p10.y + snap + 15);
            await page.mouse.move(p10.x, p10.y + snap - 5);

            await page.evaluate(([x, y]) => {
                const chart = Highcharts.charts[0];
                (chart.pointer as any).runPointActions({
                    chartX: x,
                    chartY: y,
                    type: 'mousemove',
                    preventDefault: () => {}
                });
            }, [p10.x, p10.y + snap - 5]);
            const events = await getEvents();
            expect(events[0]).toBe('mouseOver.1.-');
            expect(events[1]).toBe('mouseOver.1.0');
            expect(events.length).toBe(2);
        });
    });

    test('Pointer.runPointActions shared: true, stickyTracking: false', async ({ page }) => {
        const chartHandle = await test.step('Create chart with shared: true, stickyTracking: false and event tracking', async () => {
            return page.evaluateHandle(() => {
                const isNumber = Highcharts.isNumber;
                function pushEvent(type, series, point) {
                    const sI = series && isNumber(series.index) ? series.index : '-',
                        pI = point && isNumber(point.index) ? point.index : '-',
                        str = [type, sI, pI].join('.');
                    if (!window['__events']) {
                        window['__events'] = [];
                    }
                    window['__events'].push(str);
                }
                const config = {
                    chart: {
                        animation: false,
                        width: 1000
                    },
                    plotOptions: {
                        series: {
                            animation: false,
                            kdNow: true,
                            stickyTracking: false,
                            events: {
                                mouseOver: function () {
                                    pushEvent('mouseOver', this, undefined);
                                },
                                mouseOut: function () {
                                    pushEvent('mouseOut', this, undefined);
                                }
                            },
                            point: {
                                events: {
                                    mouseOver: function () {
                                        pushEvent('mouseOver', this.series, this);
                                    },
                                    mouseOut: function () {
                                        pushEvent('mouseOut', this.series, this);
                                    }
                                }
                            }
                        }
                    }
                };
                return Highcharts.chart({
                    ...config,
                    chart: {
                        ...config.chart,
                        renderTo: 'container',
                        type: 'column'
                    },
                    tooltip: {
                        shared: true
                    },
                    series: [
                        {
                            type: 'column',
                            data: [1, 2, 3, 4, 5, 6, 7, 8, 9]
                        },
                        {
                            type: 'column',
                            data: [1, 2, 3, 4, 5, 6, 7, 8, 9].reverse()
                        }
                    ]
                });
            });
        });

        // Helper to get point coordinates
        const getAbsPoint = async (s: number, p: number) => {
            return chartHandle.evaluate((c, [s, p]) => {
                const pt = c.series[s].points[p];
                return {
                    x: c.plotLeft + pt.plotX,
                    y: c.plotTop + pt.plotY
                };
            }, [s, p]);
        };
        // Helper to get all events
        const getEvents = async () => page.evaluate(() => {
            if (!window['__events']) window['__events'] = [];
            return window['__events'].slice();
        });
        // Helper to clear events
        const clearEvents = async () => page.evaluate(() => { window['__events'] = []; });

        await test.step('Move mouse to point 0.0 and check events', async () => {
            await clearEvents();
            const p00 = await getAbsPoint(0, 0);
            await page.mouse.move(p00.x, p00.y - 50);

            expect(await chartHandle.evaluate(
                c => c.pointer && (c.pointer as any).isDirectTouch
            )).toBeUndefined();

            await page.mouse.move(p00.x, p00.y + 10);
            const pointerState = await chartHandle.evaluate((c) => {
                return {
                    hoverPointIdx: c.hoverPoint && c.hoverPoint.index,
                    hoverPointsLen: c.hoverPoints && c.hoverPoints.length,
                    isDirectTouch: c.pointer && (c.pointer as any).isDirectTouch
                };
            });

            expect(pointerState.hoverPointIdx).toBe(0);
            expect(pointerState.hoverPointsLen).toBe(2);
            expect(pointerState.isDirectTouch).toBe(true);

            const events = await getEvents();
            expect(events.length).toBe(2);
            expect(events[0]).toBe('mouseOver.0.-');
            expect(events[1]).toBe('mouseOver.0.0');
        });

        await test.step('Move mouse to 40px below 0.1 and check events', async () => {
            await clearEvents();
            const p01 = await getAbsPoint(0, 1);
            await page.mouse.move(p01.x, p01.y - 40);
            const events = await getEvents();
            expect(events[0]).toBe('mouseOut.0.0');
            expect(events[1]).toBe('mouseOut.0.-');
            expect(events.length).toBe(2);
        });

        await test.step('Move mouse back to point 0.1 and check events', async () => {
            await clearEvents();
            const p01 = await getAbsPoint(0, 1);
            await page.mouse.move(p01.x, p01.y + 10);
            const events = await getEvents();
            expect(events[0]).toBe('mouseOver.0.-');
            expect(events[1]).toBe('mouseOver.0.1');
            expect(events.length).toBe(2);
        });
    });
});
