/**
 * This is a complex demo of how to set up a Highcharts chart, coupled to a
 * dynamic source and extended by drawing image sprites, wind arrow paths
 * and a second grid on top of the chart. The purpose of the demo is to inpire
 * developers to go beyond the basic chart types and show how the library can
 * be extended programmatically. This is what the demo does:
 *
 * - Loads weather forecast from www.yr.no in form of a JSON service.
 * - When the data arrives async, a Meteogram instance is created. We have
 *   created the Meteogram prototype to provide an organized structure of the
 *   different methods and subroutines associated with the demo.
 * - The parseYrData method parses the data from www.yr.no into several parallel
 *   arrays. These arrays are used directly as the data option for temperature,
 *   precipitation and air pressure.
 * - After this, the options structure is built, and the chart generated with
 *   the parsed data.
 * - On chart load, weather icons and the frames for the wind arrows are
 *   rendered using custom logic.
 */

type MeteogramDictionary = Record<string, {
    symbol: string;
    text: string;
}>;

class Meteogram {
    public static dictionary: MeteogramDictionary = {
        clearsky: {
            symbol: '01',
            text: 'Clear sky'
        },
        fair: {
            symbol: '02',
            text: 'Fair'
        },
        partlycloudy: {
            symbol: '03',
            text: 'Partly cloudy'
        },
        cloudy: {
            symbol: '04',
            text: 'Cloudy'
        },
        lightrainshowers: {
            symbol: '40',
            text: 'Light rain showers'
        },
        rainshowers: {
            symbol: '05',
            text: 'Rain showers'
        },
        heavyrainshowers: {
            symbol: '41',
            text: 'Heavy rain showers'
        },
        lightrainshowersandthunder: {
            symbol: '24',
            text: 'Light rain showers and thunder'
        },
        rainshowersandthunder: {
            symbol: '06',
            text: 'Rain showers and thunder'
        },
        heavyrainshowersandthunder: {
            symbol: '25',
            text: 'Heavy rain showers and thunder'
        },
        lightsleetshowers: {
            symbol: '42',
            text: 'Light sleet showers'
        },
        sleetshowers: {
            symbol: '07',
            text: 'Sleet showers'
        },
        heavysleetshowers: {
            symbol: '43',
            text: 'Heavy sleet showers'
        },
        lightsleetshowersandthunder: {
            symbol: '26',
            text: 'Light sleet showers and thunder'
        },
        sleetshowersandthunder: {
            symbol: '20',
            text: 'Sleet showers and thunder'
        },
        heavysleetshowersandthunder: {
            symbol: '27',
            text: 'Heavy sleet showers and thunder'
        },
        lightsnowshowers: {
            symbol: '44',
            text: 'Light snow showers'
        },
        snowshowers: {
            symbol: '08',
            text: 'Snow showers'
        },
        heavysnowshowers: {
            symbol: '45',
            text: 'Heavy show showers'
        },
        lightsnowshowersandthunder: {
            symbol: '28',
            text: 'Light snow showers and thunder'
        },
        snowshowersandthunder: {
            symbol: '21',
            text: 'Snow showers and thunder'
        },
        heavysnowshowersandthunder: {
            symbol: '29',
            text: 'Heavy snow showers and thunder'
        },
        lightrain: {
            symbol: '46',
            text: 'Light rain'
        },
        rain: {
            symbol: '09',
            text: 'Rain'
        },
        heavyrain: {
            symbol: '10',
            text: 'Heavy rain'
        },
        lightrainandthunder: {
            symbol: '30',
            text: 'Light rain and thunder'
        },
        rainandthunder: {
            symbol: '22',
            text: 'Rain and thunder'
        },
        heavyrainandthunder: {
            symbol: '11',
            text: 'Heavy rain and thunder'
        },
        lightsleet: {
            symbol: '47',
            text: 'Light sleet'
        },
        sleet: {
            symbol: '12',
            text: 'Sleet'
        },
        heavysleet: {
            symbol: '48',
            text: 'Heavy sleet'
        },
        lightsleetandthunder: {
            symbol: '31',
            text: 'Light sleet and thunder'
        },
        sleetandthunder: {
            symbol: '23',
            text: 'Sleet and thunder'
        },
        heavysleetandthunder: {
            symbol: '32',
            text: 'Heavy sleet and thunder'
        },
        lightsnow: {
            symbol: '49',
            text: 'Light snow'
        },
        snow: {
            symbol: '13',
            text: 'Snow'
        },
        heavysnow: {
            symbol: '50',
            text: 'Heavy snow'
        },
        lightsnowandthunder: {
            symbol: '33',
            text: 'Light snow and thunder'
        },
        snowandthunder: {
            symbol: '14',
            text: 'Snow and thunder'
        },
        heavysnowandthunder: {
            symbol: '34',
            text: 'Heavy snow and thunder'
        },
        fog: {
            symbol: '15',
            text: 'Fog'
        }
    } as MeteogramDictionary;

    private symbols: string[] = [];
    private precipitations: Array<{ x: number; y: number }> = [];
    private precipitationsError: Array<{
        x: number;
        y: number;
        minValue?: number;
        maxValue?: number
    }> = [];
    private winds: Array<{ x: number; value: number; direction: number }> = [];
    private temperatures: Array<{
        x: number;
        y: number;
        to: number;
        symbolName: string
    }> = [];
    private pressures: Array<{ x: number; y: number }> = [];
    private json: any;
    private container: string;
    private resolution = 0;
    public hasPrecipitationError = false;
    private chart?: Highcharts.Chart;

    constructor(json: any, container: string) {
        // Parallel arrays for the chart data, these are populated as the JSON
        // file is loaded
        this.symbols = [];
        this.precipitations = [];
        this.precipitationsError = [];
        this.winds = [];
        this.temperatures = [];
        this.pressures = [];

        // Initialize
        this.json = json;
        this.container = container;

        // Run
        this.parseYrData();
    }

    /**
     * Draw the weather symbols on top of the temperature series. The symbols
     * are fetched from yr.no's MIT licensed weather symbol collection.
     * https://github.com/YR/weather-symbols
     */
    public drawWeatherSymbols(chart: Highcharts.Chart): void {
        chart.series[0].data.forEach((point: Highcharts.Point, i: number) => {
            if (this.resolution > 36e5 || i % 2 === 0) {
                const [symbol, specifier] = this.symbols[i].split('_');
                const symbolInfo = Meteogram.dictionary[symbol];
                const dayNightMap: Record<string, string> = {
                    day: 'd',
                    night: 'n'
                };
                const icon = symbolInfo ?
                    symbolInfo.symbol + (dayNightMap[specifier || ''] || '') :
                    '';

                if (symbolInfo) {
                    chart.renderer
                        .image(
                            'https://cdn.jsdelivr.net/gh/nrkno/yr-weather-symbols' +
                                `@8.0.1/dist/svg/${icon}.svg`,
                            point.plotX + chart.plotLeft - 8,
                            point.plotY + chart.plotTop - 30,
                            30,
                            30
                        )
                        .attr({
                            zIndex: 5
                        })
                        .add();
                } else {
                    console.log(symbol);
                }
            }
        });
    }

    /**
     * Draw blocks around wind arrows, below the plot area
     */
    public drawBlocksForWindArrows(chart: Highcharts.Chart): void {
        const xAxis = chart.xAxis[0];

        for (
            let pos = xAxis.min, max = xAxis.max, i = 0;
            pos <= max + 36e5; pos += 36e5,
            i += 1
        ) {
            const isLast = pos === max + 36e5;
            const x = Math.round(xAxis.toPixels(pos)) + (isLast ? 0.5 : -0.5);
            const isLong = this.resolution > 36e5 ?
                pos % this.resolution === 0 :
                i % 2 === 0;

            chart.renderer
                .path([
                    [
                        'M',
                        x,
                        chart.plotTop + chart.plotHeight + (isLong ? 0 : 28)
                    ],
                    ['L', x, chart.plotTop + chart.plotHeight + 32],
                    ['Z']
                ])
                .attr({
                    stroke: chart.options.chart.plotBorderColor,
                    'stroke-width': 1
                })
                .add();
        }

        const windSeries = chart.get('windbarbs') as Highcharts.Series;
        windSeries.markerGroup.attr({
            translateX: +windSeries.markerGroup.attr('translateX') + 8
        });
    }

    /**
     * Build and return the Highcharts options structure
     */
    public getChartOptions(): Highcharts.Options {
        return {
            chart: {
                renderTo: this.container,
                marginBottom: 70,
                marginRight: 40,
                marginTop: 50,
                plotBorderWidth: 1,
                height: 310,
                alignTicks: false,
                scrollablePlotArea: {
                    minWidth: 720
                }
            },

            defs: {
                patterns: [{
                    id: 'precipitation-error',
                    path: {
                        d: [
                            'M', 3.3, 0, 'L', -6.7, 10,
                            'M', 6.7, 0, 'L', -3.3, 10,
                            'M', 10, 0, 'L', 0, 10,
                            'M', 13.3, 0, 'L', 3.3, 10,
                            'M', 16.7, 0, 'L', 6.7, 10
                        ].join(' '),
                        stroke: '#68CFE8',
                        strokeWidth: 1
                    }
                }]
            },

            title: {
                text: 'Meteogram for London, England',
                align: 'left',
                style: {
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                }
            },

            credits: {
                text: 'Forecast from <a href="https://yr.no">yr.no</a>',
                href: 'https://yr.no',
                position: {
                    x: -40
                }
            },

            tooltip: {
                shared: true,
                headerFormat:
                    '<small>{point.x:%A, %b %e, %H:%M} - ' +
                    '{point.point.to:%H:%M}</small><br>' +
                    '<b>{point.point.symbolName}</b><br>'
            },

            xAxis: [{
                type: 'datetime',
                tickInterval: 2 * 36e5,
                minorTickInterval: 36e5,
                tickLength: 0,
                gridLineWidth: 1,
                gridLineColor: 'rgba(128, 128, 128, 0.1)',
                startOnTick: false,
                endOnTick: false,
                minPadding: 0,
                maxPadding: 0,
                offset: 30,
                showLastLabel: true,
                labels: {
                    format: '{value:%H}'
                },
                crosshair: true
            }, {
                linkedTo: 0,
                type: 'datetime',
                tickInterval: 24 * 3600 * 1000,
                labels: {
                    format: '{value:<span style="font-size: 12px;' +
                        'font-weight:bold">%a</span> %b %e}',
                    align: 'left',
                    x: 3,
                    y: 8
                },
                opposite: true,
                tickLength: 20,
                gridLineWidth: 1
            }],

            yAxis: [{
                title: {
                    text: null
                },
                labels: {
                    format: '{value}°',
                    style: {
                        fontSize: 10
                    },
                    x: -3
                },
                plotLines: [{
                    value: 0,
                    color: 'var(--highcharts-neutral-color-20, #bbb)',
                    width: 1,
                    zIndex: 2
                }],
                maxPadding: 0.3,
                minRange: 8,
                tickInterval: 1,
                gridLineColor: 'rgba(128, 128, 128, 0.1)'
            }, {
                title: {
                    text: null
                },
                labels: {
                    enabled: false
                },
                gridLineWidth: 0,
                tickLength: 0,
                minRange: 10,
                min: 0
            }, {
                allowDecimals: false,
                title: {
                    text: 'hPa',
                    offset: 0,
                    align: 'high',
                    rotation: 0,
                    style: {
                        fontSize: 10,
                        color: Highcharts.getOptions().colors[2]
                    },
                    textAlign: 'left',
                    x: 3
                },
                labels: {
                    style: {
                        fontSize: 8,
                        color: Highcharts.getOptions().colors[2]
                    },
                    y: 2,
                    x: 3
                },
                gridLineWidth: 0,
                opposite: true,
                showLastLabel: false
            }],

            legend: {
                enabled: false
            },

            plotOptions: {
                series: {
                    pointPlacement: 'between'
                }
            },

            series: [{
                name: 'Temperature',
                data: this.temperatures,
                type: 'spline',
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                },
                tooltip: {
                    pointFormat:
                        '<span style="color:{point.color}">\u25CF</span> ' +
                        '{series.name}: <b>{point.y}°C</b><br/>'
                },
                zIndex: 1,
                color: '#FF3333',
                negativeColor: '#48AFE8'
            }, {
                name: 'Precipitation',
                data: this.precipitationsError,
                type: 'column',
                color: 'url(#precipitation-error)',
                yAxis: 1,
                groupPadding: 0,
                pointPadding: 0,
                tooltip: {
                    valueSuffix: ' mm',
                    pointFormat:
                        '<span style="color:{point.color}">\u25CF</span> ' +
                        '{series.name}: <b>{point.minvalue} mm - ' +
                        '{point.maxvalue} mm</b><br/>'
                },
                grouping: false,
                dataLabels: {
                    enabled: this.hasPrecipitationError,
                    filter: {
                        operator: '>',
                        property: 'maxValue',
                        value: 0
                    },
                    style: {
                        fontSize: 8,
                        color: 'var(--highcharts-neutral-color-60, gray)'
                    }
                }
            }, {
                name: 'Precipitation',
                data: this.precipitations,
                type: 'column',
                color: '#68CFE8',
                yAxis: 1,
                groupPadding: 0,
                pointPadding: 0,
                grouping: false,
                dataLabels: {
                    enabled: !this.hasPrecipitationError,
                    filter: {
                        operator: '>',
                        property: 'y',
                        value: 0
                    },
                    style: {
                        fontSize: 8,
                        color: 'var(--highcharts-neutral-color-60, gray)'
                    }
                },
                tooltip: {
                    valueSuffix: ' mm'
                }
            }, {
                name: 'Air pressure',
                color: Highcharts.getOptions().colors[2],
                data: this.pressures,
                marker: {
                    enabled: false
                },
                shadow: false,
                tooltip: {
                    valueSuffix: ' hPa'
                },
                dashStyle: 'ShortDot',
                yAxis: 2
            }, {
                name: 'Wind',
                type: 'windbarb',
                id: 'windbarbs',
                color: Highcharts.getOptions().colors[1],
                lineWidth: 1.5,
                data: this.winds,
                vectorLength: 18,
                yOffset: -15,
                tooltip: {
                    valueSuffix: ' m/s'
                }
            }]
        } as Highcharts.Options;
    }

    public onChartLoad(chart: Highcharts.Chart): void {
        this.drawWeatherSymbols(chart);
        this.drawBlocksForWindArrows(chart);
    }

    public createChart(): void {
        this.chart = new Highcharts.Chart(
            this.getChartOptions(),
            (chart: Highcharts.Chart) => {
                this.onChartLoad(chart);
            }
        );
    }

    public static error(): void {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.innerHTML =
                '<i class="fa fa-frown-o"></i> Failed loading data, ' +
                'please try again later';
        }
    }

    public parseYrData(): void {
        let pointStart: number | undefined;

        if (!this.json) {
            return Meteogram.error();
        }

        this.json.properties.timeseries.forEach((node: any, i: number) => {
            const x = Date.parse(node.time),
                nextHours = node.data.next_1_hours || node.data.next_6_hours,
                symbolCode = nextHours && nextHours.summary.symbol_code,
                to = node.data.next_1_hours ? x + 36e5 : x + 6 * 36e5;

            if (typeof pointStart === 'number' && to > pointStart + 48 * 36e5) {
                return;
            }

            this.symbols.push(nextHours.summary.symbol_code);

            const symbolNameKey = symbolCode ?
                symbolCode.replace(/_(day|night)$/, '') : '';
            const symbolName = Meteogram.dictionary[symbolNameKey]?.text ?? '';

            this.temperatures.push({
                x,
                y: node.data.instant.details.air_temperature,
                to,
                symbolName
            });

            this.precipitations.push({
                x,
                y: nextHours.details.precipitation_amount
            });

            if (i % 2 === 0) {
                this.winds.push({
                    x,
                    value: node.data.instant.details.wind_speed,
                    direction: node.data.instant.details.wind_from_direction
                });
            }

            this.pressures.push({
                x,
                y: node.data.instant.details.air_pressure_at_sea_level
            });

            if (i === 0) {
                pointStart = (x + to) / 2;
            }
        });

        this.createChart();
    }
}


// On DOM ready...

// Set the hash to the yr.no URL we want to parse
if (!location.hash) {
    location.hash = 'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=51.50853&lon=-0.12574&altitude=25';
}

(async (): Promise<void> => {
    const url = location.hash.substr(1);

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'text/plain'
            }
        });
        const json = await response.json();
        const winWithMeteogram = window as Window & { meteogram?: Meteogram };
        winWithMeteogram.meteogram = new Meteogram(json, 'container');
    } catch {
        Meteogram.error();
    }
})();
