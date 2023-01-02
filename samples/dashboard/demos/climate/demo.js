/* eslint-disable */

const colorBlue = Highcharts.Color.parse('#39F');
const colorGreen = Highcharts.Color.parse('#6C0');
const colorRed = Highcharts.Color.parse('#F00');
const dataPool = new Dashboard.DataOnDemand();
const dataScopes = {
    'FD' : 'Days with fog',
    'ID' : 'Days with ice',
    'RR1' : 'Days with rain',
    'TN' : 'Average temperature',
    'TX' : 'Maximal temperature'
};

let citiesData;
let cityGrid;
let citySeries;
let dataScope = 'TX';
let worldCities;
let worldDate = new Date(Date.UTC(2010, 11, 25)); 

async function buildDashboard() {

    citiesData = await buildCitiesData();

    const defaultCity = await dataPool.getStore('Tokyo');

    const dashboard = new Dashboard.Dashboard('container', {
        components: [{
            cell: 'time-range-selector',
            type: 'Highcharts',
            chartOptions: {
                chart: {
                    height: '60px',
                },
                credits: {
                    enabled: false
                },
                series: [{
                    type: 'scatter',
                    name: 'Timeline',
                    data: buildDates(),
                    events: {
                        click: async function (e) {
                            worldDate = new Date(e.point.x);
                            worldCities.setData(await buildCitiesMap());
                        }
                    },
                    tooltip: {
                        footerFormat: '',
                        headerFormat: '',
                        pointFormat: '{point.x:%Y-%m-%d}'
                    }
                }],
                title: {
                    margin: 0,
                    text: ''
                },
                xAxis: {
                    type: 'datetime',
                    visible: true,
                    labels: {
                        format: '{value:%Y}'
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
                    map: await fetch(
                        'https://code.highcharts.com/mapdata/' +
                        'custom/world.topo.json'
                    ).then(response => response.json()),
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
                    maxZoom: 1.8,
                    padding: 0,
                    /*projection: {
                        name: 'Miller',
                    },*/
                    zoom: 1.8,
                },
                series: [{
                    type: 'map',
                    name: 'World Map',
                    borderColor: '#986',
                    nullColor: '#C93',
                }, {
                    type: 'mappoint',
                    name: 'Cities',
                    data: await buildCitiesMap(),
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
                                tooltipFormatter(point.custom.scopeValue)
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
                    worldCities = this.chart.series[1];
                    console.log('map mount event', this);
                },
                // unmount: function () {
                //     console.log('map unmount event', this);
                // }
            }
        }, {
            cell: 'kpi-temperature',
            type: 'html',
            elements: [{
                tagName: 'img',
                attributes: {
                    src: placeholder()
                }
            }],
            title: 'KPI 1'
        },{
            cell: 'kpi-humidity',
            type: 'html',
            elements: [{
                tagName: 'img',
                attributes: {
                    src: placeholder()
                }
            }],
            title: 'KPI 1'
        },{
            cell: 'kpi-percipitation',
            type: 'html',
            elements: [{
                tagName: 'img',
                attributes: {
                    src: placeholder()
                }
            }],
            title: 'KPI 1'
        },{
            cell: 'kpi-wind',
            type: 'html',
            elements: [{
                tagName: 'img',
                attributes: {
                    src: placeholder()
                }
            }],
            title: 'KPI 1'
        },{
            cell: 'kpi-snow',
            type: 'html',
            elements: [{
                tagName: 'img',
                attributes: {
                    src: placeholder()
                }
            }],
            title: 'KPI 1'
        },{
            cell: 'kpi-ppm',
            type: 'html',
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
                    data: defaultCity.table.modified.getRows(
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
                            return tooltipFormatter(this.y);
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
            store: defaultCity,
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
                                    id: 'kpi-temperature',
                                    width: '33.333%'
                                },{
                                    id: 'kpi-humidity',
                                    width: '33.333%'
                                },{
                                    id: 'kpi-percipitation',
                                    width: '33.333%'
                                }]
                            },{
                                cells: [{
                                    id: 'kpi-wind',
                                    width: '33.333%'
                                },{
                                    id: 'kpi-snow',
                                    width: '33.333%'
                                },{
                                    id: 'kpi-ppm',
                                    width: '33.333%'
                                }]
                            }]
                        }
                    }, {
                        id: 'kpi-chart',
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

async function buildCitiesData() {
    const cities = await dataPool.getStoreTable('cities');
    const tables = {};

    await Promise.all(
        cities.modified
            .getRows(void 0, void 0, ['lat', 'lon', 'city'])
            .map(async function (row) {
                tables[row[2]] = {
                    lat: row[0],
                    lon: row[1],
                    name: row[2],
                    store: await dataPool.getStore(row[2])
                };
            })
    );

    return tables;
}

async function buildCitiesMap() {
    return Object
        .keys(citiesData)
        .map(city => {
            const data = citiesData[city];
            const table = data.store.table.modified;
            const scopeValue = table.getCellAsNumber(
                dataScope,
                table.getRowIndexBy('time', worldDate.getTime()),
                true
            );

            return {
                color: scopeColor(scopeValue),
                custom: { scopeValue },
                lat: data.lat,
                lon: data.lon,
                name: data.name,
            };
        });
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

function buildDateTicks() {
    const dates = [];

    for (let date = new Date(Date.UTC(1951, 0, 15)),
            dateEnd = new Date(Date.UTC(2010, 11, 15));
        date <= dateEnd;
        date = new Date(Date.UTC(
            date.getFullYear(),
            date.getUTCMonth() + 1,
            15
        ))
    ) {
        dates.push(date.getTime());
    }

    return dates;
}

function scopeColor(value) {

    // temperature
    if (dataScope[0] === 'T') {
        const factor = (Math.round(value) - 275) / 50; // 275 Kelvin - 325 Kelvin

        return (
            factor < 0.5 ?
                colorBlue.tweenTo(colorGreen, factor * 2) :
                colorGreen.tweenTo(colorRed, (factor - 0.5) * 2)
        );
    }

    // fallback to days
    return colorRed.tweenTo(colorBlue, value / 10); 
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
        return Highcharts.correctFloat(value, 0) + ' rainy days'
    }

    // ice days
    if (dataScope === 'ID') {
        return Highcharts.correctFloat(value, 0) + ' icy days'
    }

    // fog days
    if (dataScope === 'FD') {
        return Highcharts.correctFloat(value, 0) + ' foggy days'
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
