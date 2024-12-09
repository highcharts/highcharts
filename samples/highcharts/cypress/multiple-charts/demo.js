fetch(
    'https://code.highcharts.com/mapdata/custom/world-continents.geo.json'
)
    .then(response => response.json())
    .then(geoJSON => {
        Highcharts.mapChart('container1', {
            chart: {
                map: geoJSON,
                animation: false
            },
            series: [{}, {
                type: 'mappoint',
                data: [{
                    name: 'London',
                    lat: 51,
                    lon: 1
                }],
                animation: false
            }]
        });
        Highcharts.chart('container2', {
            chart: {
                animation: false
            },
            series: [{
                data: [2, 5, 4],
                animation: false
            }]
        });
    });