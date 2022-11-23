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

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    const climateData = new Dashboard.GoogleSheetsStore(undefined, {
        googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
        googleSpreadsheetKey: '1I8G5LBIP1GkWFjy1-CAuN71AQcWpwZxdiw6uUyGfT2I'
    });

    await loadStore(climateData);

    const data = climateData
        .table
        .modified
        .getRows(undefined, undefined, ['lon', 'lat', 'TX']);

    Highcharts.mapChart('container', {
        chart: {
            map: topology,
            type: 'line'
        },
        series: [{
            type: 'map',
            name: 'World Map'
        }, {
            type: 'mapbubble',
            keys: ['lon', 'lat', 'z'],
            data,
            colorKey: 'z',
            minSize: 1,
            maxSize: 1,
            opacity: 0.5,
            marker: {
                symbol: 'square'
            }
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
        }
    });
}

setup().catch(e => console.error(e));
