/* eslint-disable */

const dataPool = new Dashboard.DataOnDemand();

let dataScope = 'TX';

async function buildMap() {
    const citiesTable = await dataPool.getSourceTable('cities');
    const climateTable = await dataPool.getSourceTable(1262649600000);

    const chart = Highcharts.chart(
        'container',
        {
            chart: {
                height: 480,
                spacing: [0, 0, 0, 0],
                width: 960,
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
            series: [{
                type: 'heatmap',
                name: 'Temperature',
                data: climateTable.modified.getRows(
                    void 0, void 0,
                    ['lon', 'lat', dataScope]
                ),
                keys: ['x', 'y', 'z'],
                colorKey: 'z',
                marker: {
                    symbol: 'square'
                },
                tooltip: {
                    footerFormat: void 0,
                    headerFormat: void 0,
                    pointFormatter: function () {
                        return (
                            `<b>${this.lat || this.y} &phi;, ` +
                            `${this.lon || this.x} &lambda;</b><br>` +
                            temperatureFormatter(this.z)
                        );
                    },
                }
            }, {
                type: 'heatmap',
                name: 'Cities',
                data: citiesTable.modified.getRows(
                    void 0, void 0,
                    ['lon2', 'lat2', 'city'],
                ),
                keys: ['x', 'y', 'name'],
                color: '#000',
                events: {
                    click: function (e) {
                        alert(e);
                    }
                },
                label: {
                    boxesToAvoid: [],
                    enabled: true
                },
                tooltip: {
                    footerFormat: void 0,
                    headerFormat: void 0,
                    pointFormatter: function () {
                        const point = this;
                        const temperature = climateTable.getCellAsNumber(
                            dataScope,
                            climateTable.getRowIndexBy(
                                'lon', point.lon || point.y,
                                climateTable.getRowIndexBy('lat', point.lat || point.x)
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
            xAxis: {
                max: 180,
                min: -180,
                visible: false,
            },
            yAxis: {
                max: 84,
                min: -56,
                visible: false,
            },
        }
    );
    console.log(chart);

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
