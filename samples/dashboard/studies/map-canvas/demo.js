/* eslint-disable */

const dataPool = new Dashboard.DataOnDemand();

let dataScope = 'TX';

async function buildMap() {
    const citiesTable = await dataPool.getSourceTable('cities');
    const climateTable = await dataPool.getSourceTable(1262649600000);

    const canvas = document.createElement('canvas');
    const center = [360, 180];
    const colors = [Highcharts.Color.parse('#39F'), Highcharts.Color.parse('#F93')]
    const extremes = [225, 325];

    canvas.width = center[0] * 2;
    canvas.height = center[1] * 2;

    const context = canvas.getContext('2d');
    for (const row of climateTable.getRows()) {
        context.fillStyle = colors[0].tweenTo(colors[1], (
            (row[row.length-1] - extremes[0]) /
            (extremes[1] - extremes[0])
        ));
        context.fillRect(
            (center[0] / 180) * row[1] + center[0],
            (center[1] / -90) * row[0] + center[1],
            (center[0] / 180),
            (center[1] / 90)
        );
    }

    const img = document.createElement('img');
    img.height = 480;
    img.width = 960;
    img.setAttribute('src', canvas.toDataURL("image/png"));

    document.getElementById('container').innerHTML = '';
    document.getElementById('container').appendChild(img);

/*
    const chart = Highcharts.mapChart(
        'container',
        {
            chart: {
                spacing: [0, 0, 0, 0],
            },
            colorAxis: {
                max: 325,
                maxColor: '#F93',
                min: 225,
                minColor: '#39F',
            },
            legend: {
                margin: 0,
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
                type: 'mapbubble',
                name: 'Temperature',
                data: climateTable.modified.getRows(
                    void 0, void 0,
                    ['lat', 'lon', dataScope]
                ),
                keys: ['lat', 'lon', 'z'],
                colorKey: 'z',
                maxSize: 1.1,
                minSize: 1.1,
                opacity: 0.6,
                marker: {
                    symbol: 'square'
                },
                tooltip: {
                    footerFormat: void 0,
                    headerFormat: void 0,
                    pointFormatter: function () {
                        return (
                            `<b>${this.lat} &phi;, ` +
                            `${this.lon} &lambda;</b><br>` +
                            temperatureFormatter(this.z)
                        );
                    },
                }
            }, {
                type: 'mappoint',
                name: 'Cities',
                data: citiesTable.modified.getRows(
                    void 0, void 0,
                    ['lat2', 'lon2', 'city'],
                ),
                keys: ['lat', 'lon', 'name'],
                color: '#000',
                events: {
                    click: function (e) {
                        alert(e);
                    }
                },
                tooltip: {
                    footerFormat: void 0,
                    headerFormat: void 0,
                    pointFormatter: function () {
                        const point = this;
                        const temperature = climateTable.getCellAsNumber(
                            dataScope,
                            climateTable.getRowIndexBy(
                                'lon', point.lon,
                                climateTable.getRowIndexBy('lat', point.lat)
                                ),
                            true
                        );
                        return (
                            `<b>${point.name}</b><br>` +
                            temperatureFormatter(temperature)
                        );
                    }
                }
            }],
            title: {
                margin: 0,
                text: void 0,
            },
            tooltip: {
                animation: false,
                enabled: true,
            },
            yAxis: {
                reversed: true,
            },
        }
    );
    console.log(chart);
*/
}

async function main() {
    dataPool.setSourceOptions({
        name: 'cities',
        storeOptions: {
            googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
            googleSpreadsheetKey: '1gIScpvn6aO8jeN_fxOkJKJWA1KTVzQUQZUsZr0V8TOY'
        },
        storeType: 'GoogleSheetsStore'
    });
    dataPool.setSourceOptions({
        name: 'climate',
        storeOptions: {
            googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
            googleSpreadsheetKey: '1N4GofXxFOxXtteYj2H9nwWCHELegv_kozChV-D33iUc'
        },
        storeType: 'GoogleSheetsStore'
    });

    let csvReferences = await dataPool.getSourceTable('cities');

    for (const row of csvReferences.getRowObjects()) {
        dataPool.setSourceOptions({
            name: row['city'],
            storeOptions: {
                csvURL: row['csv'],
            },
            storeType: 'CSVStore'
        });
    }

    csvReferences = await dataPool.getSourceTable('climate');

    for (const row of csvReferences.getRowObjects()) {
        dataPool.setSourceOptions({
            name: row['time'],
            storeOptions: {
                csvURL: row['csv'],
            },
            storeType: 'CSVStore'
        });
    }

    console.log(dataPool);

    await buildMap();
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

main().catch(e => console.error(e));
