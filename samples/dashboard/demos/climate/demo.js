/* eslint-disable */

const color1 = Highcharts.Color.parse('#39F');
const color2 = Highcharts.Color.parse('#6C0');
const color3 = Highcharts.Color.parse('#F00');
const dataPool = new Dashboard.DataOnDemand();

let cityGrid;
let citySeries;
let dataScope = 'TX';
let worldTime = new Date(2010, 12, 25); 

async function buildDashboard() {
    const topology = await Promise
        .resolve('https://code.highcharts.com/mapdata/custom/world.topo.json')
        .then(fetch)
        .then(response => response.json());

    const citiesTable = await dataPool.getStoreTable('cities');
    const cityClimate = await dataPool.getStore('Tokyo');

    let citiesMap;
    let worldTable = await dataPool.getStoreTable(1262649600000);

    const dashboard = new Dashboard.Dashboard('container', {
        components: [{
            cell: 'time-range-selector',
            type: 'Highcharts',
            chartOptions: {
                chart: {
                    height: '100px',
                },
                series: [{
                    type: 'scatter',
                    name: 'Timeline',
                    data: buildDates(),
                    events: {
                        click: function (e) {
                            dataPool
                                .getStoreTable(e.point.x)
                                .then(table => {
                                    worldTable = table;
                                    citiesMap.setData(buildCitiesMap(
                                        worldTable,
                                        citiesTable
                                    ));
                                });
                        }
                    },
                    tooltip: {
                        footerFormat: void 0,
                        headerFormat: void 0,
                        pointFormat: '{point.x:%Y-%m-%d}'
                    }
                }],
                title: {
                    margin: 0,
                    text: 'Timeline 2010'
                },
                xAxis: {
                    tickPositions: buildDateTicks(),
                    // tickWidth: 0,
                    type: 'datetime',
                    visible: true,
                    labels: {
                        format: '{value:%m-%d}'
                    }
                },
                yAxis: {
                    visible: false
                },
                legend: {
                    enabled: false
                }
            }
        }, {
            cell: 'world-map',
            type: 'Highcharts',
            chartConstructor: 'mapChart',
            chartOptions: {
                chart: {
                    backgroundColor: '#567',
                    map: topology,
                    spacing: [0, 0, 0, 0],
                },
                /*colorAxis: {
                    max: 325,
                    maxColor: '#F93',
                    min: 225,
                    minColor: '#39F',
                },*/
                legend: {
                    enabled: false,
                },
                mapView: {
                    maxZoom: 1.4,
                    padding: 0,
                    projection: {
                        name: 'Miller',
                    },
                    zoom: 1.4,
                },
                series: [{
                    type: 'map',
                    name: 'World Map',
                    borderColor: '#986',
                    nullColor: '#C93',
                }, {
                    type: 'mappoint',
                    name: 'Cities',
                    data: buildCitiesMap(
                        worldTable,
                        citiesTable
                    ),
                    color: '#000',
                    dataLabels: {
                        align: 'left',
                        padding: 7,
                        verticalAlign: 'middle',
                        y: -1,
                    },
                    events: {
                        click: function (e) {

                            if (!cityGrid || !citySeries) {
                                return; // not ready
                            }

                            const point = e.point;
                            const city = point.name;

                            dataPool
                                .getStore(city)
                                .then(store => {
                                    citySeries.chart.update({
                                        title: { text: city }
                                    });
                                    citySeries.update({
                                        name: city,
                                        data: store.table.modified.getRows(
                                            void 0, void 0,
                                            ['time', dataScope]
                                        )
                                    });
                                    cityGrid.update({ store });
                                });
                        }
                    },
                    marker: {
                        lineColor: '#FFF',
                        lineWidth: 1,
                        radius: 6,
                    },
                    tooltip: {
                        footerFormat: void 0,
                        headerFormat: void 0,
                        pointFormatter: function () {
                            const point = this;
                            return (
                                `<b>${point.name}</b><br>` +
                                temperatureFormatter(point.custom.t)
                            );
                        }
                    }
                }],
                title: {
                    margin: 0,
                    text: void 0,
                },
            },
            events: {
                mount: function () {
                    // call action
                    citiesMap = this.chart.series[1];
                    console.log('map mount event', this);
                },
                // unmount: function () {
                //     console.log('map unmount event', this);
                // }
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
            cell: 'kpi-chart',
            type: 'Highcharts',
            chartOptions: {
                chart: {
                    type: 'line',
                    zooming: {
                        type: 'x'
                    }
                },
                series: [{
                    name: 'Tokyo',
                    data: cityClimate.table.modified.getRows(
                        void 0, void 0,
                        ['time', dataScope]
                    ),
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        footerFormat: void 0,
                        headerFormat: void 0,
                        pointFormatter: function () {
                            return temperatureFormatter(this.y);
                        },
                    }
                }],
                title: {
                    text: 'Tokyo'
                },
                tooltip: {
                    enabled: true
                },
                xAxis: {
                    // tickPositions: buildDateTicks(),
                    // tickWidth: 0,
                    type: 'datetime',
                    visible: true,
                    labels: {
                        format: '{value:%Y-%m-%d}'
                    },
                },
            },
            events: {
                mount: function () {
                    citySeries = this.chart.series[0];
                }
            }
        }, {
            cell: 'selection-grid',
            type: 'DataGrid',
            store: cityClimate,
            editable: true,
            // syncEvents: ['tooltip'],
            title: 'Selection Grid',
            events: {
                mount: function () {
                    // call action
                    console.log('grid mount event', this);
                    cityGrid = this.dataGrid;
                },
            }
        }],
        editMode: {
            enabled: true,
            contextMenu: {
                enabled: true,
                icon: (
                    'https://code.highcharts.com/gfx/dashboard-icons/menu.svg'
                ),
            },
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
                        id: 'kpi-chart',
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

async function main() {
    dataPool.setStoreOptions({
        name: 'cities',
        storeOptions: {
            googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
            googleSpreadsheetKey: '1gIScpvn6aO8jeN_fxOkJKJWA1KTVzQUQZUsZr0V8TOY'
        },
        storeType: 'GoogleSheetsStore'
    });
    dataPool.setStoreOptions({
        name: 'climate',
        storeOptions: {
            googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
            googleSpreadsheetKey: '1N4GofXxFOxXtteYj2H9nwWCHELegv_kozChV-D33iUc'
        },
        storeType: 'GoogleSheetsStore'
    });

    let csvReferences = await dataPool.getStoreTable('cities');

    for (const row of csvReferences.getRowObjects()) {
        dataPool.setStoreOptions({
            name: row['city'],
            storeOptions: {
                csvURL: row['csv'],
            },
            storeType: 'CSVStore'
        });
    }

    csvReferences = await dataPool.getStoreTable('climate');

    for (const row of csvReferences.getRowObjects()) {
        dataPool.setStoreOptions({
            name: row['time'],
            storeOptions: {
                csvURL: row['csv'],
            },
            storeType: 'CSVStore'
        });
    }

    console.log(dataPool);

    await buildDashboard();
}

main().catch(e => console.error(e));

/* *
 *
 *  Helper Functions
 *
 * */

function ajax(request) {
    return new Promise((resolve, reject) => {
        Highcharts.ajax({
            data: request.data,
            dataType: request.dataType,
            headers: request.headers,
            type: request.type,
            url: request.url,
            success: (result) => {
                request.success = result;
                resolve(request);
            },
            error: (error) => {
                request.error = error;
                reject(request);
            }
        });
    });
}

async function ajaxAll(requests) {
    const promises = [];

    for (const request of requests) {
        promises.push(ajax(request));
    }

    return Promise.all(promises);
}

function buildCitiesMap(worldTable, citiesTable) {
    return citiesTable.modified
        .getRows(void 0, void 0, ['lat2', 'lon2', 'city'])
        .map(row => ({
            lat: row[0],
            lon: row[1],
            name: row[2],
            custom: {
                t: worldTable.getCellAsNumber(
                    dataScope,
                    worldTable.getRowIndexBy('lon', row[1],
                        worldTable.getRowIndexBy('lat', row[0])
                    ),
                    true
                )
            },
        }))
        .map(row => {
            row.color = temperatureColor(row.custom.t);
            return row;
        });
}

function buildDates() {
    const dates = [];

    for (let date = new Date(Date.UTC(2010, 0, 5)),
            dateEnd = new Date(Date.UTC(2010, 11, 25));
        date <= dateEnd;
        date = date.getUTCDate() >= 25 ?
            new Date(Date.UTC(2010, date.getUTCMonth() + 1, 5)) :
            new Date(Date.UTC(2010, date.getUTCMonth(), date.getUTCDate() + 10))
    ) {
        dates.push([date.getTime(), 0]);
    }

    return dates;
}

function buildDateTicks() {
    const dates = [];

    for (let date = new Date(Date.UTC(2010, 0, 15)),
            dateEnd = new Date(Date.UTC(2010, 11, 15));
        date <= dateEnd;
        date = new Date(Date.UTC(2010, date.getUTCMonth() + 1, 15))
    ) {
        dates.push(date.getTime());
    }

    return dates;
}

function temperatureColor(value) {
    const factor = (Math.round(value) - 275) / 50; // 275 Kelvin - 325 Kelvin

    return (
        factor < 0.5 ?
            color1.tweenTo(color2, factor * 2) :
            color2.tweenTo(color3, (factor - 0.5) * 2)
    );
}

function temperatureFormatter(value) {
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
