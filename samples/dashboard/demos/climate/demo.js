/* eslint-disable prefer-const, jsdoc/require-description */
// const dataScopes = {
//     FD: 'Days with fog',
//     ID: 'Days with ice',
//     RR1: 'Days with rain',
//     TN: 'Average temperature',
//     TX: 'Maximal temperature'
// };
const dataPool = new Dashboard.DataOnDemand();
const initialMin = Date.UTC(2010);
const minRange = 30 * 24 * 3600 * 1000;
const maxRange = 365 * 24 * 3600 * 1000;
const defaultCity = 'New York';
const defaultData = 'TXC';

let citiesData;
let citiesMap;
let citiesTable;
let cityGrid;
let cityScope = defaultCity;
let citySeries;
let dataScope = defaultData;
let navigatorSeries;
let worldDate = new Date(Date.UTC(2010, 11, 25));
let kpi = {};
let darkMode = false;
let temperatureScale = 'C';

async function setupDashboard() {

    citiesData = await buildCitiesData();
    buildSymbols();

    const defaultCityStore = await dataPool.getStore(defaultCity);

    const dashboard = new Dashboard.Dashboard('container', {
        components: [{
            cell: 'time-range-selector',
            type: 'Highcharts',
            chartOptions: {
                chart: {
                    height: '80px',
                    styledMode: true
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                title: {
                    text: ''
                },
                tooltip: {
                    enabled: false
                },
                series: [{
                    type: 'scatter',
                    name: 'Timeline',
                    data: buildDates(),
                    showInNavigator: false,
                    marker: {
                        enabled: false
                    },
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                }],
                navigator: {
                    enabled: true,
                    handles: {
                        symbols: ['leftarrow', 'rightarrow'],
                        lineWidth: 0,
                        width: 8,
                        height: 14
                    },
                    series: [{
                        name: defaultCity,
                        data: defaultCityStore.table.modified.getRows(
                            void 0,
                            void 0,
                            ['time', dataScope]
                        )
                    }],
                    xAxis: {
                        endOnTick: true,
                        gridZIndex: 4,
                        labels: {
                            x: 1,
                            y: 22
                        },
                        opposite: true,
                        showFirstLabel: true,
                        showLastLabel: true,
                        startOnTick: true,
                        tickPosition: 'inside'
                    },
                    yAxis: {
                        maxPadding: 0.5
                    }
                },
                scrollbar: {
                    enabled: true,
                    barBorderRadius: 0,
                    barBorderWidth: 0,
                    buttonBorderWidth: 0,
                    buttonBorderRadius: 0,
                    height: 14,
                    trackBorderWidth: 0,
                    trackBorderRadius: 0
                },
                xAxis: {
                    visible: false,
                    min: initialMin,
                    minRange: minRange,
                    maxRange: maxRange,
                    events: {
                        afterSetExtremes: async function (e) {
                            const min = e.min || e.target.min,
                                max = e.max || e.target.max,
                                city = citySeries.chart.title.textStr;

                            dataPool
                                .getStore(city)
                                .then(store => {
                                    const data = store.table.modified
                                            .getRows(
                                                void 0,
                                                void 0,
                                                ['time', dataScope]
                                            ),
                                        chartData = data.filter(el =>
                                            el[0] >= min && el[0] <= max
                                        ),
                                        lastPoint =
                                            chartData[chartData.length - 1];

                                    citySeries.update({
                                        data: chartData
                                    });

                                    worldDate = chartData[0][0];
                                    const startIndex = data.indexOf(
                                        chartData[0]
                                    );

                                    cityGrid.scrollToRow(startIndex);
                                    cityGrid.update(); // Force redraw;
                                    buildCitiesMap().then(
                                        data => citiesMap.setData(data)
                                    );

                                    updateKPI(store.table, lastPoint[0]);
                                    updateKPIData(city);
                                });
                        }
                    }
                },
                yAxis: {
                    visible: false
                }
            },
            events: {
                mount: function () {
                    navigatorSeries = this.chart.series[1];
                }
            }
        }, {
            cell: 'world-map',
            type: 'Highcharts',
            chartConstructor: 'mapChart',
            chartOptions: {
                chart: {
                    map: await fetch(
                        'https://code.highcharts.com/mapdata/' +
                        'custom/world.topo.json'
                    ).then(response => response.json()),
                    styledMode: true
                },
                colorAxis: buildColorAxis(),
                legend: {
                    enabled: false
                },
                mapNavigation: {
                    buttonOptions: {
                        verticalAlign: 'bottom'
                    },
                    enabled: true,
                    enableMouseWheelZoom: false
                },
                mapView: {
                    maxZoom: 4,
                    zoom: 1.3
                },
                series: [{
                    type: 'map',
                    name: 'World Map'
                }, {
                    type: 'mappoint',
                    name: 'Cities',
                    data: await buildCitiesMap(),
                    allowPointSelect: true,
                    dataLabels: [{
                        align: 'left',
                        animation: false,
                        crop: false,
                        enabled: true,
                        format: '{point.name}',
                        padding: 0,
                        verticalAlign: 'top',
                        x: -2,
                        y: 2
                    }, {
                        animation: false,
                        crop: false,
                        enabled: true,
                        formatter: function () {
                            return Math.round(this.y);
                        },
                        inside: true,
                        padding: 0,
                        verticalAlign: 'bottom',
                        y: -16
                    }],
                    events: {
                        click: function (e) {

                            if (!cityGrid || !citySeries) {
                                return; // not ready
                            }

                            const point = e.point;
                            const city = point.name;

                            cityScope = city;
                            dataPool
                                .getStore(city)
                                .then(store => {

                                    syncRefreshCharts(
                                        store,
                                        dataScope,
                                        city
                                    );

                                    // Update DataGrid
                                    cityGrid.dataTable = store.table;
                                    cityGrid.update(); // force redraw

                                    updateKPIData(city);
                                });
                        }
                    },
                    marker: {
                        enabled: true,
                        lineWidth: 2,
                        radius: 12,
                        states: {
                            hover: {
                                lineWidthPlus: 4,
                                radiusPlus: 0
                            },
                            select: {
                                lineWidthPlus: 4,
                                radiusPlus: 0
                            }
                        },
                        symbol: 'mapmarker'
                    },
                    tooltip: {
                        footerFormat: '',
                        headerFormat: '',
                        pointFormatter: function () {
                            const point = this;

                            return (
                                `<b>${point.name}</b><br>` +
                                tooltipFormatter(point.name, point.y)
                            );
                        }
                    }
                }],
                title: {
                    text: void 0
                },
                tooltip: {
                    enabled: true,
                    positioner: function (width, _height, axisInfo) {
                        return {
                            x: (
                                axisInfo.plotX -
                                this.options.padding
                            ),
                            y: (
                                axisInfo.plotY +
                                this.options.padding +
                                5
                            )
                        };
                    },
                    shape: 'rect',
                    useHTML: true
                }
            },
            events: {
                mount: function () {
                    // call action
                    citiesMap = this.chart.series[1];
                }
            }
        },
        {
            cell: 'kpi-max-temperature',
            type: 'kpi',
            title: 'Maximum temperature',
            value: (() => {
                const table = defaultCityStore.table.modified;
                return table.getCellAsNumber(
                    'TX' + temperatureScale,
                    table.getRowIndexBy('time', worldDate.getTime()),
                    true
                );
            })(),
            valueFormatter: v => `${v.toFixed(0)}°`,
            events: {
                mount: function () {
                    kpi.TX = this;
                },
                click: function () {
                    dataScope = 'TX' + temperatureScale;

                    syncRefreshCharts(
                        citiesData[cityScope].store,
                        dataScope,
                        cityScope
                    );
                },
                afterLoad: function () {
                    this.parentCell.setActiveState();
                }
            },
            states: {
                active: {
                    enabled: true
                },
                hover: {
                    enabled: true
                }
            }
        },
        {
            cell: 'kpi-temperature',
            type: 'kpi',
            title: 'Average temperature',
            value: (() => {
                const table = defaultCityStore.table.modified;
                return table.getCellAsNumber(
                    'TN' + temperatureScale,
                    table.getRowIndexBy('time', worldDate.getTime()),
                    true
                );
            })(),
            valueFormatter: v => `${v.toFixed(0)}°`,
            events: {
                mount: function () {
                    kpi.TN = this;
                },
                click: function () {
                    dataScope = 'TN' + temperatureScale;

                    syncRefreshCharts(
                        citiesData[cityScope].store,
                        dataScope,
                        cityScope
                    );
                }
            },
            states: {
                active: {
                    enabled: true
                },
                hover: {
                    enabled: true
                }
            }
        },
        {
            cell: 'kpi-fog',
            type: 'kpi',
            title: 'Fog',
            value: (() => {
                const table = defaultCityStore.table.modified;
                return table.getCellAsNumber('FD', table.getRowIndexBy('time', worldDate.getTime()), true);
            })(),
            valueFormatter: v => `${v} days`,
            events: {
                mount: function () {
                    kpi.FD = this;
                },
                click: function () {
                    dataScope = 'FD';

                    syncRefreshCharts(
                        citiesData[cityScope].store,
                        dataScope,
                        cityScope
                    );
                }
            },
            states: {
                active: {
                    enabled: true
                },
                hover: {
                    enabled: true
                }
            }
        },
        {
            cell: 'kpi-ice',
            type: 'kpi',
            title: 'Ice',
            value: (() => {
                const table = defaultCityStore.table.modified;
                return table.getCellAsNumber('ID', table.getRowIndexBy('time', worldDate.getTime()), true);
            })(),
            valueFormatter: v => `${v} days`,
            events: {
                mount: function () {
                    kpi.ID = this;
                },
                click: function () {
                    dataScope = 'ID';

                    syncRefreshCharts(
                        citiesData[cityScope].store,
                        dataScope,
                        cityScope
                    );
                }
            },
            states: {
                active: {
                    enabled: true
                },
                hover: {
                    enabled: true
                }
            }
        },
        {
            cell: 'kpi-rain',
            type: 'kpi',
            title: 'Rain',
            value: (() => {
                const table = defaultCityStore.table.modified;
                return table.getCellAsNumber('RR1', table.getRowIndexBy('time', worldDate.getTime()), true);
            })(),
            valueFormatter: v => `${v} days`,
            events: {
                mount: function () {
                    kpi.RR1 = this;
                },
                click: function () {
                    dataScope = 'RR1';

                    syncRefreshCharts(
                        citiesData[cityScope].store,
                        dataScope,
                        cityScope
                    );
                }
            },
            states: {
                active: {
                    enabled: true
                },
                hover: {
                    enabled: true
                }
            }
        },
        {
            cell: 'kpi-data',
            type: 'kpi',
            title: 'Data',
            value: (() => cityScope +
                    '<br>lat: ' + citiesData[cityScope].lat +
                    '<br>lon: ' + citiesData[cityScope].lon
            )(),
            events: {
                mount: function () {
                    kpi.data = this;
                }
            }
        }, {
            cell: 'city-chart',
            type: 'Highcharts',
            chartOptions: {
                chart: {
                    spacing: 40,
                    styledMode: true
                },
                credits: {
                    enabled: false
                },
                colorAxis: buildColorAxis(),
                series: [{
                    type: 'scatter',
                    name: defaultCity,
                    data: defaultCityStore.table.modified.getRows(
                        void 0,
                        void 0,
                        ['time', dataScope]
                    ),
                    legend: {
                        enabled: false
                    },
                    marker: {
                        enabledThreshold: 0.5
                    },
                    tooltip: {
                        footerFormat: '',
                        headerFormat: '',
                        pointFormatter: function () {
                            return tooltipFormatter(this.y);
                        }
                    }
                }],
                title: {
                    text: defaultCity
                },
                tooltip: {
                    enabled: true
                },
                xAxis: {
                    type: 'datetime',
                    visible: false,
                    labels: {
                        format: '{value:%Y-%m-%d}'
                    }
                },
                yAxis: {
                    title: {
                        text: ''
                    }
                }
            },
            events: {
                mount: function () {
                    citySeries = this.chart.series[0];
                }
            }
        },
        {
            cell: 'selection-grid',
            type: 'DataGrid',
            store: defaultCityStore,
            editable: true,
            // syncEvents: ['tooltip'],
            title: 'Selection Grid',
            events: {
                mount: function () {
                    // call action
                    cityGrid = this.dataGrid;
                }
            }
        }],
        editMode: {
            enabled: true,
            contextMenu: {
                enabled: true,
                icon: (
                    'https://code.highcharts.com/gfx/dashboard-icons/menu.svg'
                ),
                items: [
                    'editMode',
                    {
                        id: 'dark-mode',
                        type: 'toggle',
                        text: 'Dark mode',
                        events: {
                            click: function () {
                                const dashboard = this.menu.editMode.dashboard,
                                    darModeClass =
                                        Dashboard.classNamePrefix + 'dark-mode';

                                darkMode = !darkMode;

                                if (darkMode) {
                                    dashboard.container.classList
                                        .add(darModeClass);
                                } else {
                                    dashboard.container.classList
                                        .remove(darModeClass);
                                }
                            }
                        }
                    }, {
                        id: 'fahrenheit',
                        type: 'toggle',
                        text: 'Fahrenheit',
                        events: {
                            click: function () {
                                // Change temperature scale.
                                temperatureScale = temperatureScale === 'C' ? 'F' : 'C';
                                dataScope = 'TX' + temperatureScale;

                                // Update the dashboard.
                                syncRefreshCharts(
                                    citiesData[cityScope].store,
                                    dataScope,
                                    cityScope
                                );
                                updateKPI(
                                    citiesData[cityScope].store.table.modified,
                                    worldDate
                                );
                            }
                        }
                    }
                ]
            }
        },
        gui: {
            enabled: true,
            layouts: [{
                id: 'layout-1', // mandatory
                rows: [{
                    cells: [{
                        id: 'time-range-selector',
                        width: '100%'
                    }]
                }, {
                    cells: [{
                        id: 'world-map',
                        width: '60%'
                    }, {
                        id: 'selection-grid',
                        width: '40%'
                    }]
                }, {
                    cells: [{
                        id: 'kpi-layout',
                        width: '60%',
                        layout: {
                            rows: [{
                                cells: [{
                                    id: 'kpi-max-temperature',
                                    // width: '50%'
                                    width: '33.333%'
                                }, {
                                    id: 'kpi-temperature',
                                    // width: '50%'
                                    width: '33.333%'
                                }, {
                                    id: 'kpi-fog',
                                    width: '33.333%'
                                }]
                            }, {
                                cells: [{
                                    id: 'kpi-ice',
                                    // width: '50%'
                                    width: '33.333%'
                                }, {
                                    id: 'kpi-rain',
                                    // width: '50%'
                                    width: '33.333%'
                                }, {
                                    id: 'kpi-data',
                                    width: '33.333%'
                                }]
                            }]
                        }
                    }, {
                        id: 'city-chart',
                        width: '40%'
                    }]
                }]
            }]
        }
    });
}

async function setupDataPool() {

    dataPool.setStoreOptions({
        name: 'cities',
        storeOptions: {
            csvURL: 'https://www.highcharts.com/samples/data/climate-cities.csv'
        },
        storeType: 'CSVStore'
    });

    citiesTable = await dataPool.getStoreTable('cities');

    for (const row of citiesTable.getRowObjects()) {
        dataPool.setStoreOptions({
            name: row.city,
            storeOptions: {
                csvURL: row.csv
            },
            storeType: 'CSVStore'
        });
    }
}

// Calculate the average and max temperature in C and F from K.
async function convertTemperature(city) {
    const cityDataTable = (await dataPool.getStoreTable(city)).modified,
        columns = ['TN', 'TX'], // Average, Maximal temperature
        metric = ['C', 'F'];

    columns.forEach(column => {
        metric.forEach(metric => {
            const newColumn = column + metric;
            let temperatureColumn = cityDataTable.getColumn(newColumn);

            if (!temperatureColumn) {
                cityDataTable.setColumns({
                    [newColumn]: cityDataTable.getColumn(column).map(el => (
                        Highcharts.correctFloat(
                            metric === 'C' ? (el - 273.15) : (el * (9 / 5) - 459.67),
                            3)
                    ))
                });
            }
        });
    });
}

async function main() {
    await setupDataPool();
    await setupDashboard();
}

main().catch(e => console.error(e));

/* *
 *
 *  Helper Functions
 *
 * */

async function buildCitiesData() {
    const cities = citiesTable.modified;
    const initialCity = defaultCity;
    const tables = {};

    const initialRow = await cities.getRow(
        cities.getRowIndexBy('city', defaultCity),
        ['lat', 'lon', 'city']
    );

    await convertTemperature(defaultCity);

    tables[initialCity] = {
        lat: initialRow[0],
        lon: initialRow[1],
        name: initialRow[2],
        store: await dataPool.getStore(initialRow[2])
    };

    // lazy promise without leading await for the rest
    (async function () {
        const rows = cities.getRows(void 0, void 0, ['lat', 'lon', 'city']);

        for (const row of rows) {
            const city = row[2];

            if (typeof tables[city] === 'undefined') {
                await convertTemperature(city);

                tables[city] = {
                    lat: row[0],
                    lon: row[1],
                    name: city,
                    store: await dataPool.getStore(city)
                };

                if (citiesMap) {
                    citiesMap.setData(await buildCitiesMap());
                }
            }
        }
    }());

    return tables;
}

async function buildCitiesMap() {
    return Object
        .keys(citiesData)
        .map(city => {
            const data = citiesData[city];
            const table = data.store.table.modified;
            const y = table.getCellAsNumber(
                dataScope,
                table.getRowIndexBy('time', worldDate),
                true
            );

            return {
                lat: data.lat,
                lon: data.lon,
                name: data.name,
                selected: city === cityScope,
                y
            };
        })
        .sort(city => city.lat);
}

function buildColorAxis() {

    // temperature
    if (dataScope[2] === 'C') {
        return {
            max: 50,
            min: 0,
            visible: false,
            stops: [
                [0.0, '#39F'],
                [0.4, '#6C0'],
                [0.8, '#F00']
            ]
        };
    }
    if (dataScope[2] === 'F') {
        return {
            max: 122,
            min: 32,
            visible: false,
            stops: [
                [0.0, '#4CAFFE'],
                [0.3, '#53BB6C'],
                [0.5, '#DDCE16'],
                [0.6, '#DF7642'],
                [0.7, '#DD2323']
            ]
        };
    }

    // days
    return {
        max: 10,
        min: 0,
        visible: false,
        stops: [
            [0.0, '#C2CAEB'],
            [1.0, '#162870']
        ]
    };
}

function buildDates() {
    const dates = [];

    for (let date = new Date(Date.UTC(1951, 0, 5)),
        dateEnd = new Date(Date.UTC(2010, 11, 25));
        date <= dateEnd;
        date = date.getUTCDate() >= 25 ?
            new Date(Date.UTC(
                date.getFullYear(),
                date.getUTCMonth() + 1,
                5
            )) :
            new Date(Date.UTC(
                date.getFullYear(),
                date.getUTCMonth(),
                date.getUTCDate() + 10
            ))
    ) {
        dates.push([date.getTime(), 0]);
    }

    return dates;
}

function buildSymbols() {
    // left arrow
    Highcharts.SVGRenderer.prototype.symbols.leftarrow = (x, y, w, h) => [
        'M', x + w / 2 - 1, y,
        'L', x + w / 2 - 1, y + h,
        x - w / 2 - 1, y + h / 2,
        'Z'
    ];
    // right arrow
    Highcharts.SVGRenderer.prototype.symbols.rightarrow = (x, y, w, h) => [
        'M', x + w / 2 + 1, y,
        'L', x + w / 2 + 1, y + h,
        x + w + w / 2 + 1, y + h / 2,
        'Z'
    ];
}

function tooltipFormatter(city, value) {
    const cities = citiesTable.modified;
    const elevation = cities.getCell(
        'elevation',
        cities.getRowIndexBy('city', city)
    );

    let tooltip = `Elevation: ${elevation}m<br>`;

    // temperature values (original Kelvin)
    if (dataScope[0] === 'T') {

        if (dataScope[2] === 'C') {
            tooltip += value + '˚C<br>';
        }

        if (dataScope[2] === 'F') {
            tooltip += value + '˚F<br>';
        }

    // rain days
    } else if (dataScope === 'RR1') {
        tooltip += Highcharts.correctFloat(value, 0) + ' rainy days';

    // ice days
    } else if (dataScope === 'ID') {
        tooltip += Highcharts.correctFloat(value, 0) + ' icy days';

    // fog days
    } else if (dataScope === 'FD') {
        tooltip += Highcharts.correctFloat(value, 0) + ' foggy days';

    // fallback
    } else {
        tooltip += Highcharts.correctFloat(value, 4);
    }

    return tooltip;
}

function updateKPI(table, time) {
    for (
        const [key, ind] of Object.entries(kpi)
    ) {
        // set active state on current temperature KPI
        if (key === 'TNC') {
            ind.parentCell.setActiveState();
        }

        ind.update({
            value: table.getCellAsNumber(
                key + (key[0] === 'T' ? temperatureScale : ''),
                table.getRowIndexBy('time', time),
                true
            )
        });
    }
}

function updateKPIData(city) {
    // update KPI data
    kpi.data.update({
        value: city +
            '<br>lat: ' + citiesData[city].lat +
            '<br>lon: ' + citiesData[city].lon
    });
}

function syncRefreshCharts(store, dataScope, cityScope) {
    const data = store.table.modified.getRows(
        void 0, void 0,
        ['time', dataScope]
    );

    // update navigator
    navigatorSeries.update({
        name: cityScope,
        data
    });

    // Update the main chart
    Highcharts.fireEvent(
        navigatorSeries.chart.xAxis[0],
        'afterSetExtremes'
    );

    // update chart
    citySeries.chart.update({
        title: {
            text: cityScope
        }
    });

    // update colorAxis
    citiesMap.chart.update({
        colorAxis: buildColorAxis()
    });

    citySeries.chart.update({
        colorAxis: buildColorAxis()
    });

    buildCitiesMap().then(data => {
        citiesMap.setData(data);
    });
}
