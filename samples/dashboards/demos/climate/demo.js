/* eslint-disable prefer-const, jsdoc/require-description */
const dataPool = new Dashboards.DataOnDemand();
const dataScopes = {
    FD: 'Days with Frost',
    ID: 'Days with Ice',
    RR: 'Days with Rain',
    TN: 'Average Temperature',
    TX: 'Maximal Temperature'
};
const dataTemperatures = {
    C: 'Celsius',
    F: 'Farenheit',
    K: 'Kelvin'
};
const initialMin = Date.UTC(2010, 0, 5);
const minRange = 30 * 24 * 3600 * 1000; // 30 days
const maxRange = 2 * 365 * 24 * 3600 * 1000; // 2 years
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
let worldDate = Date.UTC(2010, 11, 25); // months start with 0
let kpis = {};
let darkMode = false;
let temperatureScale = 'C';

async function setupDashboard() {

    citiesData = await buildCitiesData();
    buildSymbols();

    const cityStore = await dataPool.getStore(cityScope);
    const map = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());
    const mapPoints = await buildCitiesMap();

    return new Promise(resolve => Dashboards.board('container', {
        components: [{
            cell: 'time-range-selector',
            type: 'Highcharts',
            chartOptions: {
                chart: {
                    height: '80px',
                    styledMode: true,
                    type: 'spline'
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
                    // type: 'spline',
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
                        name: cityScope,
                        data: cityStore.table.getRows(
                            void 0,
                            void 0,
                            ['time', dataScope]
                        ),
                        animation: false,
                        animationLimit: 0
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
                            const table =
                                await dataPool.getStoreTable(cityScope);
                            const data = await buildCityData(
                                e.min || e.target.min,
                                e.max || e.target.max
                            );
                            const lastPoint = data[data.length - 1];
                            const startIndex =
                                table.getRowIndexBy('time', data[0][0]);

                            worldDate = lastPoint[0];

                            citiesMap.setData(await buildCitiesMap());

                            // Update only if dragging the navigator
                            if (e.trigger === 'navigator') {
                                updateKPI(false);
                            }

                            if (!cityGrid || !citySeries) {
                                return; // not ready
                            }

                            cityGrid.scrollToRow(startIndex);
                            cityGrid.update(); // Force redraw;

                            citySeries.update({ data });
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
                    map,
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
                    maxZoom: 4
                },
                series: [{
                    type: 'map',
                    name: 'World Map'
                }, {
                    type: 'mappoint',
                    name: 'Cities',
                    data: mapPoints,
                    animation: false,
                    animationLimit: 0,
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
                        click: async function (e) {

                            if (!cityGrid || !citySeries) {
                                return; // not ready
                            }

                            const point = e.point;
                            const city = point.name;

                            if (cityScope === city) {
                                return; // already selected
                            }

                            cityScope = city;
                            const store = await dataPool.getStore(city);

                            syncRefreshCharts(
                                store,
                                dataScope,
                                city
                            );

                            // Update DataGrid
                            cityGrid.dataTable = store.table;
                            cityGrid.update(); // force redraw

                            updateKPI(true);
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
                                tooltipFormatter(point.y, point.name)
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
        }, {
            cell: 'city-chart',
            type: 'Highcharts',
            store: cityStore,
            sync: {
                tooltip: true
            },
            tableAxisMap: {
                time: null,
                FD: null,
                ID: null,
                RR1: null,
                TN: null,
                TX: null,
                TNC: null,
                TNF: null,
                TXC: null,
                TXF: null,
                Date: null
            },
            chartOptions: {
                chart: {
                    spacing: [40, 40, 40, 10],
                    styledMode: true,
                    type: 'spline',
                    animation: false,
                    animationLimit: 0
                },
                credits: {
                    enabled: false
                },
                colorAxis: buildColorAxis(),
                series: [{
                    // type: 'spline',
                    name: defaultCity,
                    animation: false,
                    animationLimit: 0,
                    events: {
                        afterAnimate: () => resolve()
                    },
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
                    margin: 20,
                    text: dataScopes[dataScope.substring(0, 2)],
                    x: 15,
                    y: 5
                },
                tooltip: {
                    enabled: true
                },
                xAxis: {
                    type: 'datetime',
                    labels: {
                        formatter: function () {
                            return Highcharts.time.dateFormat(
                                '%e. %b',
                                this.value
                            );
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: dataTemperatures[dataScope[2] || 'K']
                    }
                }
            },
            events: {
                mount: function () {
                    citySeries = this.chart.series[0];
                }
            }
        }, {
            cell: 'selection-grid',
            type: 'DataGrid',
            store: cityStore,
            sync: {
                tooltip: true
            },
            dataGridOptions: {
                cellHeight: 38,
                editable: false
            },
            editable: true,
            events: {
                mount: function () {
                    // call action
                    cityGrid = this.dataGrid;
                }
            }
        }, {
            cell: 'kpi-data',
            type: 'KPI',
            title: cityScope,
            value: 10,
            valueFormatter: v => `${v.toFixed(0)}m`,
            events: {
                mount: function () {
                    kpis.data = this;
                    updateKPI();
                }
            }
        }, {
            cell: 'kpi-temperature',
            type: 'KPI',
            chartOptions: buildKPIChartOptions('TN' + temperatureScale),
            events: {
                mount: function () {
                    kpis.TN = this;
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
        }, {
            cell: 'kpi-max-temperature',
            type: 'KPI',
            chartOptions: buildKPIChartOptions('TX' + temperatureScale),
            events: {
                mount: function () {
                    kpis.TX = this;
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
        }, {
            cell: 'kpi-rain',
            type: 'KPI',
            chartOptions: buildKPIChartOptions('RR1'),
            events: {
                mount: function () {
                    kpis.RR1 = this;
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
        }, {
            cell: 'kpi-ice',
            type: 'KPI',
            chartOptions: buildKPIChartOptions('ID'),
            events: {
                mount: function () {
                    kpis.ID = this;
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
        }, {
            cell: 'kpi-frost',
            type: 'KPI',
            chartOptions: buildKPIChartOptions('FD'),
            events: {
                mount: function () {
                    kpis.FD = this;
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
                                const board = this.menu.editMode.board,
                                    darModeClass =
                                        Dashboards.classNamePrefix + 'dark-mode';

                                darkMode = !darkMode;

                                if (darkMode) {
                                    board.container.classList
                                        .add(darModeClass);
                                } else {
                                    board.container.classList
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

                                // Update the board.
                                syncRefreshCharts(
                                    citiesData[cityScope].store,
                                    dataScope,
                                    cityScope
                                );
                                updateKPI(true);
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
                        width: '50%'
                    }, {
                        id: 'kpi-layout',
                        width: '50%',
                        layout: {
                            rows: [{
                                cells: [{
                                    id: 'kpi-data',
                                    width: '33.333%',
                                    height: '204px'
                                }, {
                                    id: 'kpi-temperature',
                                    width: '33.333%',
                                    height: '204px'
                                }, {
                                    id: 'kpi-max-temperature',
                                    width: '33.333%',
                                    height: '204px'
                                }]
                            }, {
                                cells: [{
                                    id: 'kpi-rain',
                                    width: '33.333%',
                                    height: '204px'
                                }, {
                                    id: 'kpi-ice',
                                    width: '33.333%',
                                    height: '204px'
                                }, {
                                    id: 'kpi-frost',
                                    width: '33.333%',
                                    height: '204px'
                                }]
                            }]
                        }
                    }]
                }, {
                    cells: [{
                        id: 'selection-grid',
                        width: '50%'
                    }, {
                        id: 'city-chart',
                        width: '50%'
                    }]
                }]
            }]
        }
    }));
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

async function setupCitiesData() {
    const cities = citiesTable.modified;
    const data = citiesData;
    const promises = [];
    const rows = cities.getRows(
        void 0,
        void 0,
        ['lat', 'lon', 'city', 'country', 'elevation']
    );

    for (const row of rows) {
        const city = row[2];

        if (!data[city]) {
            promises.push(
                dataPool
                    .getStore(city)
                    .then(store => {
                        decorateCityTable(store.table);
                        data[city] = {
                            country: row[3],
                            elevation: row[4],
                            lat: row[0],
                            lon: row[1],
                            name: row[2],
                            store
                        };
                    })
            );
        }
    }

    await Promise.all(promises);

    if (citiesMap) {
        citiesMap.setData(await buildCitiesMap());
    }
}

async function main() {
    await setupDataPool();
    await setupDashboard();
    await setupCitiesData();
}

main().catch(e => console.error(e));

/* *
 *
 *  Helper Functions
 *
 * */

async function buildCitiesData() {
    const cities = citiesTable.modified;
    const data = {};
    const initialRow = await cities.getRow(
        cities.getRowIndexBy('city', cityScope),
        ['lat', 'lon', 'city', 'country', 'elevation']
    );
    const store = await dataPool.getStore(initialRow[2]);

    await decorateCityTable(store.table);

    data[cityScope] = {
        country: initialRow[3],
        elevation: initialRow[4],
        lat: initialRow[0],
        lon: initialRow[1],
        name: initialRow[2],
        store
    };

    return data;
}

async function buildCitiesMap() {
    return Object
        .keys(citiesData)
        .map(city => {
            const data = citiesData[city];
            const table = data.store.table.modified;
            const y = table.getCellAsNumber(
                dataScope,
                table.getRowIndexBy('time', worldDate)
            ) || 0;

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

async function buildCityData(minValue, maxValue) {
    const table = await dataPool.getStoreTable(cityScope);

    table.setModifier(new Dashboards.RangeModifier({
        ranges: [{
            column: 'time',
            minValue,
            maxValue
        }]
    }));

    return table.modified.getRows(void 0, void 0, ['time', dataScope]);
}

function buildColorAxis() {

    // temperature
    if (dataScope[0] === 'T') {
        return {
            visible: false,
            startOnTick: false,
            endOnTick: false,
            max: dataScope[2] === 'C' ? 50 : 122,
            min: dataScope[2] === 'C' ? 0 : 32,
            stops: buildColorStops(dataScope)
        };
    }

    // days
    return {
        max: 10,
        min: 0,
        visible: false,
        stops: buildColorStops(dataScope)
    };
}

function buildColorStops(dataScope) {

    // temperature
    if (dataScope[0] === 'T') {
        return [
            [0.0, '#4CAFFE'],
            [0.3, '#53BB6C'],
            [0.5, '#DDCE16'],
            [0.6, '#DF7642'],
            [0.7, '#DD2323']
        ];
    }

    // days
    return [
        [0.0, '#C2CAEB'],
        [1.0, '#162870']
    ];
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

function buildKPIChartOptions(dataScope) {
    return {
        chart: {
            height: 166,
            margin: [8, 8, 16, 8],
            spacing: [8, 8, 8, 8],
            styledMode: true,
            type: 'solidgauge'
        },
        pane: {
            background: {
                innerRadius: '90%',
                outerRadius: '120%',
                shape: 'arc'
            },
            center: ['50%', '70%'],
            endAngle: 90,
            startAngle: -90
        },
        series: [{
            data: [(() => {
                const table = citiesData[cityScope].store.table.modified;
                return table.getCellAsNumber(
                    dataScope,
                    table.getRowIndexBy('time', worldDate)
                ) || 0;
            })()],
            dataLabels: {
                formatter: function () {
                    return Math.round(this.y);
                },
                y: -34
            },
            animation: false,
            animationLimit: 0,
            enableMouseTracking: false,
            innerRadius: '90%',
            radius: '120%'
        }],
        title: {
            margin: 0,
            text: dataScopes[dataScope.substring(0, 2)],
            verticalAlign: 'bottom',
            widthAdjust: 0
        },
        yAxis: {
            labels: {
                distance: 4,
                y: 12
            },
            max: (
                dataScope[0] === 'T' ?
                    dataScope[2] === 'C' ? 50 : 122 :
                    10
            ),
            min: (
                dataScope[0] === 'T' ?
                    dataScope[2] === 'C' ? -10 : 14 :
                    0
            ),
            minorTickInterval: null,
            stops: buildColorStops(dataScope),
            tickAmount: 2,
            visible: true
        }
    };
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

function decorateCityTable(table) {
    const columns = ['TN', 'TX'], // Average, Maximal temperature
        scales = ['C', 'F'];

    columns.forEach(column => {
        scales.forEach(scale => {
            const newColumn = column + scale;
            let temperatureColumn = table.getColumn(newColumn);

            if (!temperatureColumn) {
                table.setColumns({
                    [newColumn]: table
                        .getColumn(column)
                        .map(kelvin => Highcharts.correctFloat(
                            scale === 'C' ?
                                (kelvin - 273.15) :
                                (kelvin * 1.8 - 459.67),
                            3
                        ))
                });
            }
        });
    });

    table.setColumn(
        'Date',
        table
            .getColumn('time')
            .map(timestamp => new Date(timestamp)
                .toISOString()
                .substring(0, 10)
            )
    );

    table.setColumnAlias('avg. ˚C', 'TNC');
    table.setColumnAlias('avg. ˚F', 'TNF');
    table.setColumnAlias('avg. ˚K', 'TN');
    table.setColumnAlias('max ˚C', 'TXC');
    table.setColumnAlias('max ˚F', 'TXF');
    table.setColumnAlias('max ˚K', 'TX');
    table.setColumnAlias('Frost', 'FD');
    table.setColumnAlias('Ice', 'ID');
    table.setColumnAlias('Rain', 'RR1');

}

function tooltipFormatter(value, city) {
    let tooltip = '';

    if (city) {
        tooltip += `Elevation: ${citiesData[city].elevation}m<br>`;
    }

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

    // frost days
    } else if (dataScope === 'FD') {
        tooltip += Highcharts.correctFloat(value, 0) + ' frosty days';

    // fallback
    } else {
        tooltip += Highcharts.correctFloat(value, 4);
    }

    return tooltip;
}

function updateKPI(animation) {
    const data = citiesData[cityScope];
    const table = data.store.table.modified;

    for (const [key, kpi] of Object.entries(kpis)) {
        if (key === 'data') {
            kpis.data.update({
                title: data.name,
                value: data.elevation,
                subtitle: 'Elevation'
            });
        } else {
            kpi.chart.series[0].points[0].update(
                table.getCellAsNumber(
                    key + (key[0] === 'T' ? temperatureScale : ''),
                    table.getRowIndexBy('time', worldDate)
                ) || 0,
                true,
                animation
            );
        }
    }
}

function syncRefreshCharts(store, dataScope, cityScope) {
    const data = store.table.getRows(
        void 0, void 0,
        ['time', dataScope]
    );
    const isColumnSeries = ['RR1', 'FD', 'ID'].indexOf(dataScope) >= 0;
    const columnSeriesOptions = {
        threshold: isColumnSeries ? 0 : null
    };

    // update navigator
    navigatorSeries.update({
        name: cityScope,
        minPointLength: 1, // workaround
        pointPadding: 0,
        groupPadding: 0,
        crisp: false,
        data,
        ...columnSeriesOptions
    });

    // update chart
    citySeries.chart.update({
        chart: {
            animation: true
        },
        title: {
            text: cityScope
        }
    }, false);

    citySeries.update(columnSeriesOptions);

    // Update the main chart
    Highcharts.fireEvent(
        navigatorSeries.chart.xAxis[0],
        'afterSetExtremes'
    );

    // update colorAxis
    citiesMap.chart.update({
        colorAxis: buildColorAxis()
    });

    citySeries.chart.update({
        colorAxis: buildColorAxis(),
        title: {
            text: dataScopes[dataScope.substring(0, 2)]
        },
        yAxis: {
            title: {
                text: (
                    dataScope[0] === 'T' ?
                        dataTemperatures[dataScope[2] || 'K'] :
                        'Days'
                )
            }
        },
        chart: {
            type: isColumnSeries ? 'column' : 'spline'
        }
    });

    buildCitiesMap().then(data => {
        citiesMap.setData(data);
    });

    // Reset the animation.
    setTimeout(() => {
        citySeries.chart.update({
            chart: {
                animation: false
            }
        }, false);
    });
}
