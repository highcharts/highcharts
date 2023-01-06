/* eslint-disable prefer-const, jsdoc/require-description */
const dataPool = new Dashboard.DataOnDemand();
const dataScopes = {
    FD: 'Days with fog',
    ID: 'Days with ice',
    RR1: 'Days with rain',
    TN: 'Average temperature',
    TX: 'Maximal temperature'
};
const initialMin = Date.UTC(2010);
const minRange = 30 * 24 * 3600 * 1000;
const maxRange = 365 * 24 * 3600 * 1000;
const defaultCity = 'New York';
const defaultData = 'TX';

let citiesData;
let citiesMap;
let cityGrid;
let cityScope = defaultCity;
let citySeries;
let navigatorSeries;
let worldCities;
let dataScope = defaultData;
let worldDate = new Date(Date.UTC(2010, 11, 25));

async function setupDashboard() {

    citiesData = await buildCitiesData();

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
                    series: [{
                        name: defaultCity,
                        data: defaultCityStore.table.modified.getRows(
                            void 0,
                            void 0,
                            ['time', dataScope]
                        )
                    }]
                },
                scrollbar: {
                    enabled: true,
                    barBackgroundColor: 'gray',
                    barBorderRadius: 7,
                    barBorderWidth: 0,
                    buttonBackgroundColor: 'gray',
                    buttonBorderWidth: 0,
                    buttonBorderRadius: 7,
                    trackBackgroundColor: 'none',
                    trackBorderWidth: 1,
                    trackBorderRadius: 8,
                    trackBorderColor: '#CCC'
                },
                xAxis: {
                    visible: false,
                    min: initialMin,
                    minRange: minRange,
                    maxRange: maxRange,
                    events: {
                        afterSetExtremes(e) {
                            const min = e.min || e.target.min,
                                max = e.max || e.target.max,
                                city = citySeries.chart.title.textStr;

                            dataPool
                                .getStore(city)
                                .then(store => {
                                    const chartData = store.table.modified
                                        .getRows(
                                            void 0,
                                            void 0,
                                            ['time', dataScope]
                                        ).filter(el =>
                                            el[0] >= min && el[0] <= max
                                        );

                                    citySeries.update({
                                        data: chartData
                                    });

                                    worldDate = chartData[0][0];

                                    buildCitiesMap().then(
                                        data => citiesMap.setData(data)
                                    );
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
                    enabled: true,
                    enableMouseWheelZoom: false
                },
                mapView: {
                    maxZoom: 4,
                    zoom: 1.6
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
                        align: 'center',
                        animation: false,
                        crop: false,
                        enabled: true,
                        format: '{point.name}',
                        padding: 0,
                        verticalAlign: 'top',
                        y: 2
                    }, {
                        animation: false,
                        crop: false,
                        enabled: true,
                        formatter: function () {
                            return labelFormatter(this.y);
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
                                    const data = store.table.modified.getRows(
                                        void 0, void 0,
                                        ['time', dataScope]
                                    );

                                    citySeries.chart.update({
                                        title: { text: city }
                                    });
                                    citySeries.update({
                                        name: city,
                                        data
                                    });
                                    navigatorSeries.update({
                                        name: city,
                                        data
                                    });

                                    // Update the main chart.
                                    Highcharts.fireEvent(
                                        navigatorSeries.chart.xAxis[0],
                                        'afterSetExtremes'
                                    );

                                    // Update DataGrid
                                    cityGrid.dataTable = store.table;
                                    cityGrid.update(); // force redraw
                                });
                        }
                    },
                    marker: {
                        enabled: true,
                        radius: 12,
                        state: {
                            hover: {
                                radiusPlus: 0
                            },
                            select: {
                                radius: 12
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
                                tooltipFormatter(point.y)
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
                                width / 2 +
                                this.options.padding
                            ),
                            y: (
                                axisInfo.plotY +
                                this.options.padding * 2
                            )
                        };
                    }
                }
            },
            events: {
                mount: function () {
                    // call action
                    citiesMap = this.chart.series[1];
                }
            }
        }, {
            cell: 'kpi-1',
            type: 'html',
            // dimensions: {
            //     width: 200,
            //     height: 200
            // },
            elements: [{
                tagName: 'img',
                attributes: {
                    src: placeholder()
                }
            }],
            title: 'KPI 1'
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
        }, {
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
                )
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
                        width: '100%'
                    }]
                }, {
                    cells: [{
                        id: 'kpi-1',
                        width: '20%'
                    }, {
                        id: 'city-chart',
                        width: '40%'
                    }, {
                        id: 'selection-grid',
                        width: '40%'
                    }]
                }]
            }]
        }
    });
    console.log(dashboard);

}

async function setupDataPool() {

    dataPool.setStoreOptions({
        name: 'cities',
        storeOptions: {
            googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
            googleSpreadsheetKey: '1gIScpvn6aO8jeN_fxOkJKJWA1KTVzQUQZUsZr0V8TOY'
        },
        storeType: 'GoogleSheetsStore'
    });

    let csvReferences = await dataPool.getStoreTable('cities');

    for (const row of csvReferences.getRowObjects()) {
        dataPool.setStoreOptions({
            name: row.city,
            storeOptions: {
                csvURL: row.csv
            },
            storeType: 'CSVStore'
        });
    }

    console.log(dataPool);
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
    const cities = (await dataPool.getStoreTable('cities')).modified;
    const initialCity = defaultCity;
    const tables = {};

    const initialRow = await cities.getRow(
        cities.getRowIndexBy('city', defaultCity),
        ['lat', 'lon', 'city']
    );

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
            if (typeof tables[row[2]] === 'undefined') {

                tables[row[2]] = {
                    lat: row[0],
                    lon: row[1],
                    name: row[2],
                    store: await dataPool.getStore(row[2])
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
    if (dataScope[0] === 'T') {
        return {
            max: 325,
            min: 275,
            visible: false,
            stops: [
                [0.0, '#39F'],
                [0.4, '#6C0'],
                [0.8, '#F00']
            ]
        };
    }

    // days
    return {
        max: 10,
        min: 0,
        visible: false,
        stops: [
            [0.0, '#F00'],
            [0.4, '#6C0'],
            [0.8, '#39F']
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

function labelFormatter(value) {

    // temperature values
    if (dataScope[0] === 'T') {
        return '' + Math.round((value - 273.15));
    }

    return Highcharts.correctFloat(value, 0);
}

function tooltipFormatter(value) {

    // temperature values
    if (dataScope[0] === 'T') {
        return [
            Highcharts.correctFloat(value, 4) + '˚K',
            Highcharts.correctFloat(
                (value - 273.15), 3
            ) + '˚C',
            Highcharts.correctFloat(
                (value * 1.8 - 459.67), 3
            ) + '˚F'
        ].join('<br>');
    }

    // rain days
    if (dataScope === 'RR1') {
        return Highcharts.correctFloat(value, 0) + ' rainy days';
    }

    // ice days
    if (dataScope === 'ID') {
        return Highcharts.correctFloat(value, 0) + ' icy days';
    }

    // fog days
    if (dataScope === 'FD') {
        return Highcharts.correctFloat(value, 0) + ' foggy days';
    }

    // fallback
    return '' + Highcharts.correctFloat(value, 4);
}

/**
 * @deprecated
 * @todo remove
 */
function placeholder() {
    return [
        'data:image/png;base64,',
        'iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABIFBMVEX///93dY2j7Llkm',
        'p+AhegwQ2uf67ZblZqBhOtlnKBjm5yAheql8Lt2c4wtPmh1b4t6f+d3dIhxb4h5fufw9P',
        'j3/fllmaF8iN53jNBYk5rz9P1nmKbP3OR5i9Vtk7jY9+G38Mitxc/O9dru+/Kr7r/F89L',
        'k+et/g988Unc1SHBAWXuYur5woqfS4eLZ3vO3y9fW1/jl7PGanu1+qLFwkb+rru+/wfOb',
        'ucSLj+puk7hzj8fv7/xqlbCjp+61uPHH19/IyvWGrLfn6PuGmqZ6ebig4biOraZ+gdJ6e',
        '6+Uvqx/hpab0LJ8f8Z5eaNmeqJejZpeYoFOcIpZgZRUeJNRWn2vysyd17WJoaGCjpqgnr',
        'S1tceFr7ONjKXOztuVwq6wsMM1MXwqAAAGOElEQVR4nO2aeVcURxTF6WWmG2djFyEJIw4',
        'oigZxCVFURInGJSiuaEy+/7dIVVd1d1V19TLhzOlHn/v7f87pe97td+9rmJoCAAAAAAAA',
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVLhV9wNMnIu/1v0EE2ZnfvV23c8wWXbD/Tt1P',
        '8NEOZwJ7waX636KSXJvJly+cKnBPl0JO52LF7w7C3U/yMS4P+P7/pIX/Fb3g0yMvY7vh6',
        'ued+mnup9kQuzMsxGGv1/wvKWG+nS3wxU+YAqDp3U/y0Q45CP0Oz8zhd6lJ3U/zSR4NBM',
        'pvDjNFHpLDYyMhx1uUsYqVxg0sNpEUcFfxP1oiEHzKrgvRxje5S8ik9g0nx7M+1LhslDo',
        'Nc2nu3KEPu9tYojNqja35FvIJUqFXtCoavOokygMV6XCRlWbh+kI/fCXZIgN8uljVeGDW',
        'KEXNKbaLPipSWVva5hPD5QRsmWaCGxOBd9TRhj3NimRXrXZWFsc+zc785pA2dukT8lVm7',
        'W2O1y7Mt5vHukjjHsb0Wqz6Lrtdnu4PobIwxlfV7isKqT3dXHYdscU+dhQmPQ2Abmvi5t',
        'coRA5qiRyxddN6vtXl1SF3tLEn3k8Ft0UJnJjs+wHB/OGQKW30aw2G213LJF75giV3iZ9',
        'SqyCb2oKI5HuxmZuhuzMmALV3kaz2ozcDAUid8OMQrW3kfTphjnEWOTQ0gbMqIgUXvUMi',
        'H1dzNi0SOQ9i0Ktt5H0qcWmqci2VnlWOpk94xu9TUCrgq/nDTGZZBKU960j1HubeBVJVf',
        'ArhQpdtQ1koyJSuJxRSKzaDMskRipH65s781aFRm8TkKrgaxUUcpHdZ89f+LY3sZMVSCs',
        'yrlQS6LpHg9nZwfMXnY6pMswsU49YtaliU9ft/jFwHGd2tvfSnGT0d9IMlCKjmk1HjoRN',
        'kokMU5WZ3kbOp4vl8tgI/xw4TirSefniamxX66qhVW2q2LT7queoMLu+feNHItXvbUR9m',
        'tvcFIGvB06G2dm3b6JJ2lYNra+LFUb4xaKQi3SYyHDfalNK1cZ+YKgCjwY9q0Ixyb+Olz',
        'LdNPIpmWpTalMRFbm86197f+xZRNKpNgUHRsSolztCzqDf6ve33rNJGirpfF0sPjD0qLD',
        'Qa3H6bJInTKSqkswf+MsOjFeFI3ScrVZLitwyRJLxaaFNrVGh8bGVwEReV0SSqTaFNu1+',
        'LRmh866l0u+3UpFU/sBfZFMWFSUCDYWxyONIJJVqU9DcSqKCMzAVSpEfmEgqPi04MI6cM',
        'pOmqyajkokk8gf+/AOjLCoirtkVigz5QMOn+TatMEJ1mWameHKjbm2CvOZWHhWczKqR+l',
        'jRmZ6mMcLcA6M8KjhzOeNjmRF8qltZjP3A6H6uMkLZ23R9fHwsELfrFpZgt2neYWiyZci',
        '79kEeVMHNuoWlWJvbUfFVkfBR03f9xItr2/e6ZSnYmluFtBekq0ZsF3LHBcfa3MquiphB',
        'Ys8T9UoMiCSFJGvT7j8VRyiWab/1/li/Dz0qSSHI2rRaVHB6W/w2ND/X0EkKQcamFaNCK',
        'Lx+Mm1+xCCUFBKzuXW/VBthb25w+jQjj1ZSCMwDo1pU9OacbytTN4PspzZKSSFY1BVWio',
        'q5ub9/8HViUUgqKSSGTauM71TKWMgKpJUUAs2mpVHBxvctTYPtjERaSSHQ7+DiqJjrnf5',
        'Qf3vDsCm1pJAoB0bhYcjs+a/xln0yFJJLCoFyYBREBd8umZ8aq4ZeUkiUqMgZIQ8/25K8',
        'rSuklxSSxKY5UaFvFw0t8Wn9z5BKYtORXd9p1p4x36knhUQeGJZviJbtoqGuGjJfnyzEB',
        '4Z5GMbdJZ8nqUKiSSEQB4YRFT0WfqUvlrJqiCaFJLJp91lPs2fedlFZSD9dUE0KAW9u3c',
        '/pVWENPytxbwvIJoWAHxhJVJRtF424t1G8KTTYgTGqul005DKlnBSCtXYUFXy7jPf3W9n',
        'bKCeFYJFHRcXtorEQkE8KyfD1oKi75LNNPykEm1+rbxeN7/STQvJ/XyS2auivmTPBehv5',
        'pDgbN4PzsGbOwsI5SIozsk3jH0smSMM9CgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        'AAAAAAAAAAAAADg3PAfRDWjQM3VeT0AAAAASUVORK5CYII='
    ].join('');
}
