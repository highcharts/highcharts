import { test, expect, createChart } from '../../fixtures.ts';

test('Sonification: mapping functions', async ({ page }) => {
    const chart = await test.step('Setup chart', async () => {
        const chart = await createChart(page, {
            sonification: {
                duration: 3000,
                pointGrouping: {
                    enabled: false
                },
                defaultInstrumentOptions: {
                    instrument: 'flute',
                    mapping: {
                        time: 'x',
                        pan: '-x',
                        volume: {
                            min: 0.5,
                            max: 1,
                            mapTo: '-y'
                        },
                        pitch: {
                            min: 'c4',
                            max: 'c5'
                        },
                        playDelay: 10,
                        noteDuration: {
                            min: 100,
                            max: 200,
                            mapTo: 'x'
                        },
                        tremolo: {
                            depth: 'y',
                            speed: 0.9
                        },
                        highpass: {
                            resonance: 'x'
                        },
                        lowpass: {
                            frequency: {
                                mapTo: 'custom.lowpass.freq',
                                min: 2000,
                                max: 7000
                            },
                            resonance: 'custom.lowpass.res'
                        }
                    }
                },
                defaultSpeechOptions: {
                    mapping: {
                        time: 'x',
                        text: 'Msg: {point.options.custom.message.payload}',
                        playDelay: 'x',
                        rate: 2,
                        pitch: 'y',
                        volume: 0.4
                    }
                }
            },
            series: [{
                type: 'pie',
                sonification: {
                    tracks: [{}, {
                        type: 'speech'
                    }]
                },
                data: [{
                    y: 1,
                    custom: {
                        lowpass: {
                            freq: 1,
                            res: 2
                        },
                        message: {
                            payload: 'custom1'
                        },
                        log: 0
                    }
                }, {
                    y: 5,
                    custom: {
                        lowpass: {
                            freq: 2,
                            res: 2
                        },
                        message: {
                            payload: 'custom2'
                        },
                        log: 10
                    }
                }, {
                    y: 3,
                    custom: {
                        lowpass: {
                            freq: 3,
                            res: 3
                        },
                        message: {
                            payload: 'custom3'
                        },
                        log: 100
                    }
                }]
            }]
        }, {
            chartConstructor: 'chart',
            modules: ['modules/accessibility.js', 'modules/sonification.js']
        });

        await page.evaluate(() => {
            window.Highcharts.sonification.
                Sonification.prototype.forceReady = true;
        });

        return chart;
    });

    await test.step('Logarithmic times are correct', async ()=>{
        const events = await chart.evaluate((c)=>{
            c.update({
                sonification: {
                    defaultInstrumentOptions: {
                        mapping: {
                            time: {
                                mapFunction: 'logarithmic',
                                mapTo: 'custom.log',
                                min: 50,
                                max: 250
                            },
                            playDelay: 0
                        }
                    }
                }
            });

            return c.sonification.timeline.channels[0].events
                .map(e => e.time).join(',');
        });

        expect(events).toBe('50,150,250');
    });

    await test.step('Non-negative logarithmic mapping works as expected', async () => {
        // Add the spline series with pan mapping and rebuild the timeline
        const pansRounded = await chart.evaluate((c: any) => {
            c.addSeries({
                type: 'spline',
                sonification: {
                    tracks: [{
                        mapping: {
                            pan: {
                                mapTo: 'y',
                                within: 'series',
                                mapFunction: 'logarithmic',
                                min: 0,
                                max: 100
                            }
                        }
                    }]
                },
                data: [0.01, 0.1, 1, 10, 100]
            });

            return  c.sonification.timeline.channels[2].events
                .map((e: any) => Math.round(
                    e.instrumentEventOptions.pan * 1000
                ) / 1000)
                .join(',');
        });

        expect(pansRounded).toBe('0,25,50,75,100');
    });

    await test.step('Negative and 0 logarithmic mapping works as expected', async () => {
        const pansRounded = await chart.evaluate((c: any) => {
            c.series[1].setData([
                -10000, -1000, -100, -10, -1, -0.1, 0,
                0.1, 1, 10, 100, 1000, 10000
            ]);

            return  c.sonification.timeline.channels[2].events
                .map((e: any) => Math.round(
                    e.instrumentEventOptions.pan * 1000
                ) / 1000)
                .join(',');
        });

        expect(pansRounded).toBe(
            '0,12.5,25,37.5,46.516,49.532,50,50.468,53.484,62.5,75,87.5,100'
        );
    });
});
