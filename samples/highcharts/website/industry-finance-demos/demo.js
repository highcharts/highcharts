// hero demo (all indicators)
function hero() {
    (async () => {

        const data = await fetch(
            'https://demo-live-data.highcharts.com/aapl-ohlcv.json'
        ).then(response => response.json());

        // split the data set into ohlc and volume
        const ohlc = [],
            volume = [],
            dataLength = data.length;

        for (let i = 0; i < dataLength; i += 1) {
            ohlc.push([
                data[i][0], // the date
                data[i][1], // open
                data[i][2], // high
                data[i][3], // low
                data[i][4] // close
            ]);

            volume.push([
                data[i][0], // the date
                data[i][5] // the volume
            ]);
        }

        // create the chart
        Highcharts.stockChart('container', {
            chart: {
                height: 410
            },
            title: {
                text: 'AAPL Historical'
            },
            subtitle: {
                text: 'All indicators'
            },
            accessibility: {
                series: {
                    descriptionFormat: '{seriesDescription}.'
                },
                // eslint-disable-next-line max-len
                description: 'Use the dropdown menus above to display different ' +
                'indicator series on the chart.',
                screenReaderSection: {
                    beforeChartFormat: '<{headingTagName}>' +
                    '{chartTitle}</{headingTagName}><div>' +
                    '{typeDescription}</div><div>{chartSubtitle}</div><div>' +
                    '{chartLongdesc}</div>'
                }
            },
            legend: {
                enabled: true
            },
            rangeSelector: {
                selected: 2
            },
            stockTools: {
                gui: {
                    enabled: false
                }
            },
            yAxis: [{
                height: '60%'
            }, {
                top: '60%',
                height: '20%'
            }, {
                top: '80%',
                height: '20%'
            }],
            plotOptions: {
                series: {
                    showInLegend: true,
                    accessibility: {
                        exposeAsGroupOnly: true
                    }
                }
            },
            series: [{
                type: 'candlestick',
                id: 'aapl',
                name: 'AAPL',
                data: data
            }, {
                type: 'column',
                id: 'volume',
                name: 'Volume',
                data: volume,
                yAxis: 1
            }, {
                type: 'pc',
                id: 'overlay',
                linkedTo: 'aapl',
                yAxis: 0
            }, {
                type: 'macd',
                id: 'oscillator',
                linkedTo: 'aapl',
                yAxis: 2
            }]
        }, function (chart) {
            document.getElementById(
                'overlays'
            ).addEventListener('change', function (e) {
                const series = chart.get('overlay');

                if (series) {
                    series.remove(false);
                    chart.addSeries({
                        type: e.target.value,
                        linkedTo: 'aapl',
                        id: 'overlay'
                    });
                }
            });

            document.getElementById(
                'oscillators'
            ).addEventListener('change', function (e) {
                const series = chart.get('oscillator');

                if (series) {
                    series.remove(false);
                    chart.addSeries({
                        type: e.target.value,
                        linkedTo: 'aapl',
                        id: 'oscillator',
                        yAxis: 2
                    });
                }
            });
        });
    })();
}

// exclusive series demo
function exclusiveSeries() {
    (async () => {

        // Load the dataset
        const data = await fetch(
            'https://demo-live-data.highcharts.com/aapl-ohlcv.json'
        ).then(response => response.json());

        Highcharts.stockChart('container', {
            title: {
                text: 'Candlestick and Heikin Ashi series comparison',
                align: 'left'
            },
            rangeSelector: {
                selected: 1
            },
            stockTools: {
                gui: {
                    enabled: false,
                    visible: false,
                    buttons: []
                }
            },
            yAxis: [{
                title: {
                    text: 'Candlestick'
                },
                height: '50%'
            }, {
                title: {
                    text: 'Heikin Ashi'
                },
                top: '50%',
                height: '50%',
                offset: 0
            }],
            series: [{
                type: 'candlestick',
                name: 'Candlestick',
                data: data
            }, {
                type: 'heikinashi',
                name: 'Heikin Ashi',
                data: data,
                yAxis: 1,
                tooltip: {
                    valueDecimals: 2
                }
            }]
        });
    })();
}

// stock with gui
function stockGui() {
    const commonOptions = {
        api: {
            url: 'https://demo-live-data.highcharts.com',
            access: {
                url: 'https://demo-live-data.highcharts.com/token/oauth',
                token: 'token'
            }
        }
    };

    const NVIDIACorpId = '0P000003RE';

    const NVIDIAPriceConnector =
    new HighchartsConnectors.Morningstar.TimeSeriesConnector({
        ...commonOptions,
        series: {
            type: 'OHLCV'
        },
        securities: [
            {
                id: NVIDIACorpId,
                idType: 'MSID'
            }
        ],
        currencyId: 'EUR'
    });

    (async () => {
        await NVIDIAPriceConnector.load();

        const {
            [`${NVIDIACorpId}_Open`]: open,
            [`${NVIDIACorpId}_High`]: high,
            [`${NVIDIACorpId}_Low`]: low,
            [`${NVIDIACorpId}_Close`]: close,
            [`${NVIDIACorpId}_Volume`]: volume,
            Date: date
        } = NVIDIAPriceConnector.getTable().getColumns();

        const ohlc = [],
            volumeSeriesData = [],
            dataLength = date.length;

        for (let i = 0; i < dataLength; i += 1) {
            ohlc.push([
                date[i],
                open[i],
                high[i],
                low[i],
                close[i]
            ]);

            volumeSeriesData.push([
                date[i],
                volume[i]
            ]);
        }

        Highcharts.stockChart('container', {
            yAxis: [{
                labels: {
                    align: 'left'
                },
                height: '80%',
                resize: {
                    enabled: true
                }
            }, {
                labels: {
                    align: 'left'
                },
                top: '80%',
                height: '20%',
                offset: 0
            }],
            rangeSelector: {
                selected: 4
            },
            tooltip: {
                shape: 'square',
                headerShape: 'callout',
                borderWidth: 0,
                shadow: false,
                fixed: true
            },
            series: [{
                type: 'candlestick',
                id: 'nvidia-candlestick',
                name: 'NVIDIA Corp Stock Price',
                data: ohlc,
                dataGrouping: {
                    groupPixelWidth: 20
                }
            }, {
                type: 'column',
                id: 'nvidia-volume',
                name: 'NVIDIA Volume',
                data: volumeSeriesData,
                yAxis: 1
            }],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 800
                    },
                    chartOptions: {
                        rangeSelector: {
                            inputEnabled: false
                        }
                    }
                }]
            }
        });
    })();
}

// 2 standalone navigators
function navigators() {
    const commonOptions = {
        api: {
            url: 'https://demo-live-data.highcharts.com',
            access: {
                url: 'https://demo-live-data.highcharts.com/token/oauth',
                token: 'token'
            }
        }
    };

    const AMDISIN = 'US0079031078';

    const AMDPriceConnector =
    new HighchartsConnectors.Morningstar.TimeSeriesConnector({
        ...commonOptions,
        series: {
            type: 'Price'
        },
        securities: [
            {
                id: AMDISIN,
                idType: 'ISIN'
            }
        ],
        currencyId: 'EUR'
    });

    (async () => {
        await AMDPriceConnector.load();

        const cols = AMDPriceConnector.getTable().getColumns();

        const name = Array.from(Object.keys(cols).filter(k => k !== 'Date'))[0];
        const price = cols[name].map((value, i) => [cols.Date[i], value]);

        const firstNav = Highcharts.navigator('navigator-container', {
            series: [{
                data: price
            }],
            stockTools: {
                gui: {
                    enabled: false,
                    visible: false,
                    buttons: []
                }
            }
        });

        const secondNav = Highcharts.navigator('second-navigator-container', {
            series: [{
                data: price
            }],
            stockTools: {
                gui: {
                    enabled: false,
                    visible: false,
                    buttons: []
                }
            }
        });

        const priceChart = Highcharts.stockChart('price-chart', {
            navigator: {
                enabled: false
            },
            rangeSelector: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            chart: {
                height: 270
            },
            stockTools: {
                gui: {
                    enabled: false,
                    visible: false,
                    buttons: []
                }
            },
            title: {
                text: 'AMD Stock Price'
            },
            xAxis: {
                overscroll: 7776000000 // 90 days
            },
            series: [{
                name: 'AMD',
                data: price
            }]
        });

        // Adjust second navigator range based on the first navigator
        Highcharts.addEvent(firstNav.navigator, 'setRange', function (e) {
            secondNav.navigator.xAxis.update({ min: e.min, max: e.max });

            // eslint-disable-next-line max-len
            const { min, max } = secondNav.navigator.chart.xAxis[0].getExtremes();
            const oneYear = 24 * 3600 * 1000 * 365; // 1 year

            let newMin = Math.max(min, e.min);
            let newMax = Math.min(max, e.max);

            // Ensure the minimal range
            if (newMax - newMin < oneYear) {
                if (newMax < max) {
                    newMin = newMax - oneYear;
                } else {
                    newMax = newMin + oneYear;
                }
            }

            e.min = newMin;
            e.max = newMax;

            Highcharts.fireEvent(secondNav.navigator, 'setRange', e);
        });

        // Add plot band on first navigator to
        // indicate the range of the chart and
        // second navigator
        Highcharts.addEvent(secondNav.navigator, 'setRange', function (e) {
            firstNav.navigator.xAxis.update({
                plotBands: [{
                    from: e.min,
                    to: e.max,
                    color: '#9E66FF'
                }]
            });
        });

        // Set minimal range for the first navigator
        firstNav.navigator.chart.update({
            xAxis: {
                minRange: 24 * 3600 * 1000 * 365 // 1 year
            }
        });

        // Bind chart
        secondNav.bind(priceChart);

        // Set initial ranges
        firstNav.setRange(
            Date.UTC(2014),
            firstNav.navigator.xAxis.max
        );

        secondNav.setRange(
            Date.UTC(2022),
            secondNav.navigator.xAxis.max
        );
    })();

}

// MACD indicator with pivot points
function macd() {
    (async () => {

        // Load the dataset
        const data = await fetch(
            'https://demo-live-data.highcharts.com/aapl-ohlc.json'
        ).then(response => response.json());

        Highcharts.stockChart('container', {

            rangeSelector: {
                selected: 2
            },

            stockTools: {
                gui: {
                    enabled: false,
                    visible: false,
                    buttons: []
                }
            },

            yAxis: [{
                height: '75%',
                resize: {
                    enabled: true
                },
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: 'AAPL'
                }
            }, {
                top: '75%',
                height: '25%',
                labels: {
                    align: 'right',
                    x: -3
                },
                offset: 0,
                title: {
                    text: 'MACD'
                }
            }],

            title: {
                text: 'AAPL Stock Price'
            },

            subtitle: {
                text: 'With MACD and Pivot Points technical indicators'
            },

            series: [{
                type: 'ohlc',
                id: 'aapl',
                name: 'AAPL Stock Price',
                data: data,
                zIndex: 1
            }, {
                type: 'pivotpoints',
                linkedTo: 'aapl',
                zIndex: 0,
                lineWidth: 1,
                dataLabels: {
                    overflow: 'none',
                    crop: false,
                    y: 4,
                    style: {
                        fontSize: 9
                    }
                }
            }, {
                type: 'macd',
                yAxis: 1,
                linkedTo: 'aapl'
            }]
        });
    })();
}

// Boost module demo
function boost() {
    function getData(n) {
        const arr = [];
        let i,
            x,
            a,
            b,
            c,
            spike;
        for (
            i = 0, x = Date.UTC(new Date().getUTCFullYear(), 0, 1) - n * 36e5;
            i < n;
            i = i + 1, x = x + 36e5
        ) {
            if (i % 100 === 0) {
                a = 2 * Math.random();
            }
            if (i % 1000 === 0) {
                b = 2 * Math.random();
            }
            if (i % 10000 === 0) {
                c = 2 * Math.random();
            }
            if (i % 50000 === 0) {
                spike = 10;
            } else {
                spike = 0;
            }
            arr.push([
                x,
                2 * Math.sin(i / 100) + a + b + c + spike + Math.random()
            ]);
        }
        return arr;
    }
    const n = 500000,
        data = getData(n);


    console.time('line');
    Highcharts.chart('container', {

        chart: {
            zooming: {
                type: 'x'
            }
        },

        stockTools: {
            gui: {
                enabled: false,
                visible: false,
                buttons: []
            }
        },

        title: {
            text: 'Highcharts drawing ' + n + ' points',
            align: 'left'
        },

        subtitle: {
            text: 'Using the Boost module',
            align: 'left'
        },

        accessibility: {
            screenReaderSection: {
                beforeChartFormat: '<{headingTagName}>' +
                '{chartTitle}</{headingTagName}><div>{chartSubtitle}</div>' +
                '<div>{chartLongdesc}</div><div>{xAxisDescription}</div><div>' +
                '{yAxisDescription}</div>'
            }
        },

        tooltip: {
            valueDecimals: 2
        },

        xAxis: {
            type: 'datetime'
        },

        series: [{
            data: data,
            lineWidth: 0.5,
            name: 'Hourly data points',
            color: '#2caffe'
        }]

    });
    console.timeEnd('line');

}

// Customization example
function customization() {
// Conversion factor metric tons to troy ounces
    const metricTonsToOunces = 32150.7;

    let data = [
    // Name, Metric tons gold reserves, population (M)
        {
            name: 'United States of America',
            metricTons: 8133.46,
            population: 334.9
        },
        { name: 'Germany', metricTons: 3352.65, population: 84.48 },
        { name: 'Italy', metricTons: 2451.84, population: 58.76 },
        { name: 'France', metricTons: 2436.97, population: 68.17 },
        { name: 'Russia', metricTons: 2332.74, population: 143.83 },
        { name: 'China', metricTons: 2235.39, population: 1410.71 },
        { name: 'Switzerland', metricTons: 1040.00, population: 8.85 },
        { name: 'Japan', metricTons: 845.97, population: 124.52 },
        { name: 'India', metricTons: 803.58, population: 1428.63 },
        { name: 'Netherlands', metricTons: 612.45, population: 17.88 }
    ];

    // Adding troy ounces per capita and sorting by this
    data = data.map(point => ({
        ...point,
        ouncesPerCapita: Math.round(
            100 * point.metricTons * metricTonsToOunces /
        (point.population * 1000000)
        ) / 100
    })).sort((a, b) => b.ouncesPerCapita - a.ouncesPerCapita);


    const getGraticule = () => {
        const data = [];

        // Meridians
        for (let x = -180; x <= 180; x += 15) {
            data.push({
                geometry: {
                    type: 'LineString',
                    coordinates:
                    x % 90 === 0 ?
                        [
                            [x, -90],
                            [x, 0],
                            [x, 90]
                        ] : [
                            [x, -80],
                            [x, 80]
                        ]
                }
            });
        }

        // Latitudes
        for (let y = -90; y <= 90; y += 10) {
            const coordinates = [];
            for (let x = -180; x <= 180; x += 5) {
                coordinates.push([x, y]);
            }
            data.push({
                geometry: {
                    type: 'LineString',
                    coordinates
                },
                lineWidth: y === 0 ? 1 : undefined
            });
        }

        return data;
    };

    (async () => {
        const topology = await fetch(
            'https://code.highcharts.com/mapdata/custom/world-highres.topo.json'
        ).then(response => response.json());
        const mapData = topology.objects.default.geometries.map(country => [
            country.properties['hc-key'],
            country.id
        ]);
        const countries = topology.objects.default.geometries.filter(el =>
            data.map(c => c.name).includes(el.properties.name)
        );
        const rotation = countryName => {
            const countryProperties = countries.find(
                g => g.properties.name === countryName
            ).properties;
            return [
                -countryProperties['hc-middle-lon'],
                -countryProperties['hc-middle-lat']
            ];
        };

        // Adjust data table view
        Highcharts.addEvent(Highcharts.Chart, 'exportData', function (e) {
            e.dataRows.forEach(function (el) {
                el.splice(0, 2);
            });
        });

        const chart = Highcharts.mapChart('container', {
            chart: {
                map: topology,
                height: '58%',
                margin: 0,
                events: {
                    load() {
                        const chart = this;
                        chart.rotateToCountry = countryName => {
                            const point1 =
                                chart.mapView.projection.options.rotation,
                                point2 = rotation(countryName),
                                distance = Highcharts.Projection.distance(
                                    point1,
                                    point2
                                );

                            if (!distance) {
                                return;
                            }
                            const stepDistance = distance / 1000,
                                geodesic = Highcharts.Projection.geodesic(
                                    chart.mapView.projection.options.rotation,
                                    rotation(countryName),
                                    true,
                                    stepDistance
                                );

                            chart.renderer.boxWrapper.animator = 0;

                            const animateGlobe = () => new Promise(resolve => {
                                Highcharts.animate(
                                    chart.renderer.boxWrapper,
                                    { animator: 999 },
                                    {
                                        duration: 1000,
                                        step: (now, fx) => {
                                            const rotation =
                                            geodesic[Math.round(now)];
                                            chart.mapView.update(
                                                {
                                                    projection: {
                                                        rotation
                                                    }
                                                },
                                                true,
                                                false
                                            );

                                            // Resolve after animation
                                            if (fx.pos === 1) {
                                                resolve();
                                            }
                                        }
                                    }
                                );
                            });

                            // Set rotation state as chart property
                            (async () => {
                                chart.isRotating = true;
                                await animateGlobe();
                                chart.isRotating = false;
                            })();
                        };

                        chart.findCountry = countryName =>
                            this.series[1].data.find(
                                p => p.name === countryName
                            );
                    },
                    redraw() {
                        const chart = this;
                        // "Reset" view to account for manual globe rotation
                        chart.mapView.fitToBounds(undefined, undefined, false);
                        chart.renderSea?.();
                    },
                    render() {
                        const chart = this,
                            renderer = chart.renderer;

                        // Responsive rules cause the render
                        // event to fire before
                        // the load event. Therefore, we need to create these
                        // functions on the render event instead.

                        if (!chart.renderSea) {
                        // Render a circle filled with a radial gradient behind
                        // the globe to make it appear as the sea around the
                        // continents
                            chart.renderSea = () => {
                                let verb = 'animate';
                                if (!chart.sea) {
                                    chart.sea = renderer
                                        .circle()
                                        .attr({
                                            fill: {
                                                radialGradient: {
                                                    cx: 0.4,
                                                    cy: 0.4,
                                                    r: 0.65,
                                                    fx: 0.3,
                                                    fy: 0.3
                                                },
                                                stops: [
                                                    [0, '#fffbe6'],
                                                    [0.15, '#FFEB80'],
                                                    [0.4, '#F0CA00'],
                                                    [0.8, '#957D00'],
                                                    [1, '#524500']
                                                ]
                                            },
                                            zIndex: -1
                                        })
                                        .add(chart.get('graticule').group);
                                    verb = 'attr';
                                }

                                const bounds = chart.get('graticule').bounds,
                                    p1 = chart.mapView.projectedUnitsToPixels({
                                        x: bounds.x1,
                                        y: bounds.y1
                                    }),
                                    p2 = chart.mapView.projectedUnitsToPixels({
                                        x: bounds.x2,
                                        y: bounds.y2
                                    });
                                chart.sea[verb]({
                                    cx: (p1.x + p2.x) / 2,
                                    cy: (p1.y + p2.y) / 2,
                                    r: Math.min(p2.x - p1.x, p1.y - p2.y) / 2
                                });
                            };
                            chart.renderSea();
                        }

                        if (!chart.getStickyLabel) {
                            chart.getStickyLabel = () => {
                                const point = chart.getSelectedPoints()[0],
                                    countryName = point.name,
                                    text = `<b>${countryName}</b>
                                    <br/><b>Gold Reserves</b>
                                    <br/>Total: <b>
                                    ${Highcharts.numberFormat(point.y)} t</b>
                                    <br/>Per capita:
                                    <b>
                                    ${Highcharts.numberFormat(point.z)} oz t
                                    </b>`;

                                if (!chart.sticky) {
                                    chart.sticky = renderer
                                        .label()
                                        .attr({
                                            fill: {
                                                linearGradient: {
                                                    x1: 0.1,
                                                    y2: 0.2
                                                },
                                                stops: [
                                                    [0.3, '#ccb339'],
                                                    [0.6, '#fff1a2'],
                                                    [0.9, '#ccb339']
                                                ]
                                            }
                                        })
                                        .shadow(true)
                                        .add();
                                    chart.sticky.box.attr({
                                        rx: 5
                                    });
                                }

                                chart.sticky.attr({
                                    text
                                });
                            };
                        }

                        // Avoid rerendering while chart is rotating
                        if (!chart.isRotating || chart.justSelectedPoint) {
                            chart.justSelectedPoint = false;
                            const pieSeries = chart.get('pieseries'),
                                [
                                    centerX, centerY, d, innerD
                                ] = pieSeries.center,
                                innerR = innerD / 2,
                                r = d / 2,
                                cx = centerX + chart.plotLeft,
                                cy = centerY + chart.plotTop,
                                fontSizeAxes = innerR > 85 ? '0.8em' : '0.5em',
                                fontSizeSticky = innerR > 85 ? '1em' : '0.7em';

                            // Adding "axes" to indicate what type
                            // of data is in the variable pie series
                            chart.customAxes?.destroy();
                            chart.customAxes = renderer.g().add();

                            // Radial axis
                            const radialAxis = renderer.path([
                                'M', cx - 3, cy - innerR, 'L', cx - 3, cy - r
                            ]).attr({
                                // eslint-disable-next-line max-len
                                stroke: 'var(--highcharts-neutral-color-80, #444)',
                                'stroke-width': 2
                            }).add(chart.customAxes);

                            // Radial axis title
                            renderer.text(
                                'PER CAPITA'
                            ).setTextPath(radialAxis, {
                                attributes: {
                                    dy: -8
                                }
                            }).attr({
                                'font-size': fontSizeAxes,
                                'font-weight': 'bold',
                                fill: 'var(--highcharts-neutral-color-80, #444)'
                            }).add(chart.customAxes);

                            // Angular axis
                            const angularAxisR = innerR + 1;
                            renderer.path([
                                'M', cx - angularAxisR, cy, 'A', angularAxisR,
                                angularAxisR, 0, 0, 1, cx - 2, cy - angularAxisR
                            ]).attr({
                                // eslint-disable-next-line max-len
                                stroke: 'var(--highcharts-neutral-color-80, #444)',
                                'stroke-width': 2
                            }).add(chart.customAxes);

                            // Angular axis title
                            const angularAxisTitleR = angularAxisR + 3;
                            const angularAxisTitlePath = renderer.path([
                                'M', cx - angularAxisTitleR, cy, 'A',
                                angularAxisTitleR, angularAxisTitleR,
                                0, 0, 1, cx, cy - angularAxisTitleR
                            ]).add(chart.customAxes);

                            renderer.text('GOLD RESERVES')
                                .setTextPath(angularAxisTitlePath, {
                                }).attr({
                                    'font-size': fontSizeAxes,
                                    'font-weight': 'bold',
                                    // eslint-disable-next-line max-len
                                    fill: 'var(--highcharts-neutral-color-80, #444)'
                                })
                                .add(chart.customAxes);

                            if (chart.getSelectedPoints().length === 1) {
                                chart.getStickyLabel();

                                // Align sticky label
                                chart.sticky.css({
                                    fontSize: fontSizeSticky
                                });
                                const labelWidth = chart.sticky.bBox.width,
                                    x = cx - labelWidth - 40;
                                chart.sticky.attr({
                                    x: x > 0 ? x : 0,
                                    y: cy - r
                                });
                            }
                        }
                    }
                }
            },

            stockTools: {
                gui: {
                    enabled: false,
                    visible: false,
                    buttons: []
                }
            },

            credits: {
                enabled: false
            },

            title: {
                text: '2023 Top 10 Countries by Gold Reserves',
                style: {
                    fontSize: '28px'
                }
            },

            subtitle: {
                text: 'In metric tons held by the respective country\'s central bank. Sources: <a href="https://www.gold.org/goldhub/data/gold-reserves-by-country" target="_blank">gold.org</a> and <a href="https://databank.worldbank.org/reports.aspx?source=2&series=SP.POP.TOTL&year=2023" target="_blank">World Bank</a>.'
            },

            legend: {
                enabled: false
            },

            mapView: {
                padding: ['41%', '30%', '23%', '30%'],
                projection: {
                    name: 'Orthographic',
                    rotation: rotation('France')
                }
            },

            plotOptions: {
                variablepie: {
                    dataLabels: {
                        style: {
                            fontSize: '1em'
                        },
                        // eslint-disable-next-line max-len
                        connectorColor: 'var(--highcharts-neutral-color-80, #444)'
                    },
                    includeInDataExport: true
                },
                series: {
                    animation: {
                        duration: 1000
                    },
                    includeInDataExport: false
                }
            },

            exporting: {
                csv: {
                    columnHeaderFormatter: (_, key) => ({
                        population: 'Population (M)',
                        y: 'Gold Reserves (t)',
                        z: 'Gold per Capita (oz t)'
                    }[key] || 'Country')
                }
            },

            tooltip: {
                style: {
                    fontSize: '1em'
                },
                valueDecimals: 2,
                useHTML: true,
                headerFormat:
                `<table>
                    <tr>
                        <th colspan="2" style="font-weight: bold">
                            {point.key}
                        </th>
                    </tr>`,
                pointFormat:
                `<tr>
                    <td>Population:</td>
                    <td><b>{point.population} M</b></td>
                </tr>
                <tr>
                    <td>Gold Reserves:</td>
                    <td><b>{point.y} t</b></td>
                </tr>
                <tr>
                    <td>Per Capita:</td>
                    <td><b>{point.z} oz t</b></td>
                </tr>`,
                footerFormat: '</table>'
            },

            series: [
                {
                    name: 'Graticule',
                    id: 'graticule',
                    type: 'mapline',
                    data: getGraticule(),
                    nullColor: '#22201520',
                    accessibility: {
                        enabled: false
                    },
                    enableMouseTracking: false,
                    states: {
                        inactive: {
                            opacity: 1
                        }
                    }
                },
                {
                    name: 'Map',
                    data: mapData,
                    keys: ['hc-key', 'id'],
                    accessibility: {
                        enabled: false
                    },
                    enableMouseTracking: false,
                    borderColor: '#b39700',
                    borderWidth: 0.5,
                    color: '#222015',
                    states: {
                        inactive: {
                            opacity: 1
                        }
                    }
                },
                {
                    name: 'Countries',
                    id: 'pieseries',
                    type: 'variablepie',
                    allowPointSelect: true,
                    borderColor: '#493f0f',
                    inactiveOtherPoints: false,
                    cursor: 'pointer',
                    innerSize: '45%',
                    size: '100%',
                    center: ['50%', '60%'],
                    endAngle: 270,
                    borderRadius: 5,
                    keys: ['countryID', 'name', 'population', 'y', 'z'],
                    data: data.map(pointData => [
                        countries.find(
                            country => country.properties.name ===
                                pointData.name
                        ).id,
                        pointData.name,
                        pointData.population,
                        pointData.metricTons,
                        pointData.ouncesPerCapita
                    ]
                    ),
                    colors:
                    [
                        '#ccb339',
                        '#d2ba45',
                        '#d7c150',
                        '#ddc85c',
                        '#e3ce68',
                        '#e8d673',
                        '#eedc7f',
                        '#f4e38b',
                        '#f9ea96',
                        '#fff1a2'
                    ],
                    point: {
                        events: {
                            unselect() {
                                const point = this,
                                    countryName = point.name,
                                    mapPoint = chart.findCountry(countryName);
                                mapPoint.update({
                                    color: null
                                });

                                if (countryName === chart.selectedCountry) {
                                    chart.sticky = chart.sticky?.destroy();
                                }
                            },
                            select() {
                                const point = this,
                                    selectedPoints = chart.getSelectedPoints(),
                                    countryName = point.name,
                                    mapPoint = chart.findCountry(countryName);
                                mapPoint.update({
                                    color: '#ffffff99'
                                });
                                chart.selectedCountry = countryName;
                                chart.justSelectedPoint = true;

                                // Remove previously selected points
                                // from selectedPoints array
                                selectedPoints.forEach(point => {
                                    if (point.name !== countryName) {
                                        point.select(false);
                                    }
                                });

                                chart.redraw({
                                    defer: 500,
                                    complete() {
                                    // Circumvent "rogue" firing of this
                                    // function by only initiating globe
                                    // rotation if globe is not rotating
                                        if (!chart.isRotating) {
                                            chart.rotateToCountry(countryName);
                                        }
                                    }
                                });
                            },
                            click(e) {
                            // Prevent selecting a new country
                            // while the globe is rotating
                                if (chart.isRotating) {
                                    e.preventDefault();
                                }
                            }
                        }
                    }
                }
            ],

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 650
                    },
                    chartOptions: {
                        chart: {
                            height: '100%'
                        },
                        plotOptions: {
                            variablepie: {
                                dataLabels: {
                                    distance: 5,
                                    connectorColor: 'transparent',
                                    padding: 0,
                                    style: {
                                        fontSize: '1em'
                                    },
                                    format: '{point.countryID}'
                                }
                            }
                        }
                    }
                }]
            }
        });
    })();

}

const params = new URLSearchParams(window.location.search);
const chartToShow = params.get('chart') ?? 'hero';

const demoCard = document.getElementById('demoCard');
const demoName = document.getElementById('demoName');
const demoDescription = document.getElementById('demoDescription');
const productButtons = document.getElementById('productButtons');
const chartDescription = document.getElementById('chartDescription');
const selectorsContainer = document.getElementById('selectors-container');


const productInfo = {
    core: {
        name: 'Core',
        icon: 'https://www.highcharts.com/demo/icons/products/core.svg',
        url: 'https://www.highcharts.com/products/highcharts/'
    },
    stock: {
        name: 'Stock',
        icon: 'https://www.highcharts.com/demo/icons/products/stock.svg',
        url: 'https://www.highcharts.com/products/stock/'
    },
    maps: {
        name: 'Maps',
        icon: 'https://www.highcharts.com/demo/icons/products/maps.svg',
        url: 'https://www.highcharts.com/products/maps/'
    },
    gantt: {
        name: 'Gantt',
        icon: 'https://www.highcharts.com/demo/icons/products/gantt.svg',
        url: 'https://www.highcharts.com/products/gantt/'
    },
    dashboards: {
        name: 'Dashboards',
        icon: 'https://www.highcharts.com/demo/icons/products/dashboards.svg',
        url: 'https://www.highcharts.com/products/dashboards/'
    },
    grid: {
        name: 'Grid',
        icon: 'https://www.highcharts.com/demo/icons/products/grid.svg',
        url: 'https://www.highcharts.com/products/grid/'
    },
    morningstar: {
        name: 'Morningstar',
        icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_1483_3937)">
                <path d="M13.7999 13.6C14.6799 12.4333 15.1998 10.9926 15.1998 
                9.43158C15.1998 5.54856 11.9762 2.40002 8.0003 2.40002C4.02442 
                2.40002 0.799805 5.54856 0.799805 9.43158C0.799805 
                10.9915 1.31932 
                12.4341 2.19844 13.6H3.696C2.6088 12.5293 1.9372 11.0588 1.9372 
                9.43158C1.9372 6.16186 4.65152 3.5106 8.0003 
                3.5106C11.3491 3.5106 
                14.063 6.16186 14.063 9.43158C14.063 11.0566 13.3925 12.5293 
                12.3076 13.6H13.7999Z" fill="#E93D42"/>
                </g>
                <defs>
                <clipPath id="clip0_1483_3937">
                <rect width="16" height="16" fill="white"/>
                </clipPath>
                </defs>
                </svg>`,
        url: 'https://www.highcharts.com/products/data-connector-for-morningstar/'
    }
};

const charts = {
    hero: {
        run: hero,
        demoCardLabel: 'Highcharts Candlestick and Heikin Ashi demo',
        demoName: 'Candlestick and Heikin Ashi series comparison',
        demoDescription: 'Highcharts Stock comes with exclusive series types.',
        chartDescription: `A purely decorative chart demonstrating 
        Highcharts exclusive series.`,
        madeWith: ['stock']
    },
    exclusiveSeries: {
        run: exclusiveSeries,
        demoCardLabel: 'Highcharts Candlestick and Heikin Ashi demo',
        demoName: 'Candlestick and Heikin Ashi series comparison',
        demoDescription: 'Highcharts Stock comes with exclusive series types.',
        chartDescription: `A purely decorative chart demonstrating 
        Highcharts exclusive series.`,
        madeWith: ['stock']
    },
    stockGui: {
        run: stockGui,
        demoCardLabel: 'Highcharts Stock Chart with GUI demo',
        demoName: 'Stock Chart with GUI',
        demoDescription: 'Use Stock Tools to build a custom GUI.',
        chartDescription: `A purely decorative chart demonstrating 
        Highcharts stock GUI.`,
        madeWith: ['stock', 'morningstar']
    },
    navigators: {
        run: navigators,
        demoCardLabel: 'Highcharts Two Standalone Navigators demo',
        demoName: 'Two Standalone Navigators',
        demoDescription: 'Precisely set the extremes of the chart.',
        chartDescription: `A purely decorative chart demonstrating 
        Highcharts stock chart with two standalone navigators. 
        The first Navigator spans for a whole dataset, and allows 
        setting the extremes of the second navigator. The second navigator 
        is then used to set the precise extremes of the main chart. `,
        madeWith: ['stock', 'morningstar']
    },
    macd: {
        run: macd,
        demoCardLabel: 'Highcharts MACD pivot points demo',
        demoName: 'MACD pivot points',
        demoDescription: 'Use indicators to visualize momentum and trends.',
        chartDescription: `A purely decorative chart demonstrating 
        Highcharts stock chart with MACD indicator.`,
        madeWith: ['stock']
    },
    boost: {
        run: boost,
        demoCardLabel: 'Highcharts Boost Module demo',
        demoName: 'Highcharts Boost Module: 500K Points',
        // eslint-disable-next-line max-len
        demoDescription: 'Render large amount of data on the client side with our Boost module.',
        chartDescription: `A purely decorative chart demonstrating 
        Highcharts Boost module.`,
        madeWith: ['stock']
    },
    customization: {
        run: customization,
        demoCardLabel: 'Highcharts Customization demo',
        demoName: '2023 Top 10 Countries by Gold Reserves',
        // eslint-disable-next-line max-len
        demoDescription: 'Customized combo of a map globe and a variable pie chart.',
        chartDescription: `A purely decorative chart demonstrating 
        Highcharts customization capabilities.`,
        madeWith: ['core', 'maps']
    }
};

Highcharts.setOptions({
    chart: {
        height: 400
    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    }
});


function buildDemo() {
    const chart = charts[chartToShow];

    selectorsContainer.style.display = 'none';

    if (chart.run === hero) {
        selectorsContainer.style.display = 'flex';
    }

    // aria label for demo card
    demoCard.setAttribute('aria-label', chart.demoCardLabel);

    // demo title and subtitle
    demoName.innerHTML = chart.demoName;

    // demo description and a11y description
    demoDescription.innerHTML = chart.demoDescription;
    chartDescription.innerHTML = chart.chartDescription;

    // made with buttons
    let buttonString = '';
    for (let ii = 0; ii < chart.madeWith.length; ++ii) {
        const product = productInfo[chart.madeWith[ii]];
        buttonString +=  `<a href="${product.url}" 
        target="_blank" class="hc-button hc-button--white hc-button--size-100">
        ${product.name}`;
        let isHighchartsIcon = false;
        try {
            // eslint-disable-next-line max-len
            const iconUrl = new URL(product.icon, window.location && window.location.origin ? window.location.origin : undefined);
            const hostname = iconUrl.hostname || '';
            isHighchartsIcon =
                hostname === 'highcharts.com' ||
                hostname.endsWith('.highcharts.com');
        // eslint-disable-next-line no-unused-vars
        } catch (e) {
            isHighchartsIcon = false;
        }
        if (isHighchartsIcon) {
            // eslint-disable-next-line max-len
            buttonString += `<img src="${product.icon}" height="12" width="12"></a>`;
        } else {
            buttonString += product.icon;
        }
    }

    productButtons.innerHTML = buttonString;

    // show chart
    chart.run();
}


buildDemo();