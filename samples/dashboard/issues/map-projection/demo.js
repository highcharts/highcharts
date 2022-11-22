/* eslint-disable */


function loadStore(store) {
    return new Promise((resolve, reject) => {
        const offs = [
            store.on('loadError', (e) => {
                for (const off of offs) {
                    off();
                }
                reject(e)
            }),
            store.on('afterLoad', (e) => {
                for (const off of offs) {
                    off();
                }
                resolve(store);
            })
        ];
        store.load();
    });
}

async function setup() {
    const climateData = new Dashboard.GoogleSheetsStore(undefined, {
        googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
        googleSpreadsheetKey: '1I8G5LBIP1GkWFjy1-CAuN71AQcWpwZxdiw6uUyGfT2I'
    });

    await loadStore(climateData);

    const chart = Highcharts.mapChart('container', {
        chart: {
            map: 'custom/world',
            proj4: window.proj4,
            type: 'line'
        },
        series: [{
            type: 'map',
            name: 'World Map'
        }, {
            type: 'heatmap',
            opacity: 0.4,
            data: climateData
                .table
                .modified
                .getRows(undefined, undefined, ['lon', 'lat', 'TX'])
        }],
        title: {
            text: 'World Map'
        },
        colorAxis: {
            max: 333,
            maxColor: '#F93',
            min: 213,
            minColor: '#39F',
            title: {
                text: 'Temperature'
            }
        },
        xAxis: {
            labels: {
                enabled: false
            },
            max: 180,
            min: -180,
            tickWidth: 0,
            title: {
                text: 'Longitude'
            }
        },
        yAxis: {
            labels: {
                enabled: false
            },
            max: 90,
            min: -90,
            tickWidth: 0,
            title: {
                text: 'Latitude'
            }
        }
    });
}

setup().catch(e => console.error(e));
