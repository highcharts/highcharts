(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
    ).then(response => response.json());

    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/us-capitals.json'
    ).then(response => response.json());

    data.forEach(p => {
        p.z = p.population;
    });

    Highcharts.mapChart('container', {
        title: {
            text: 'Highcharts Maps lon/lat demo'
        },

        tooltip: {
            pointFormat: '{point.capital}, {point.parentState}<br>' +
            'Lon: {point.lon}<br>' +
            'Lat: {point.lat}<br>' +
            'Population: {point.population}'
        },

        xAxis: {
            crosshair: {
                zIndex: 5,
                dashStyle: 'dot',
                snap: false,
                color: 'gray'
            }
        },

        yAxis: {
            crosshair: {
                zIndex: 5,
                dashStyle: 'dot',
                snap: false,
                color: 'gray'
            }
        },

        plotOptions: {
            temperaturemap: {
                minSize: 50,
                maxSize: 200,
                opacity: 0.5,
                temperatureColors: [
                    [0.1, '#ff0000'],
                    [0.7, '#ffff00'],
                    [0.8, '#00ff00'],
                    [0.9, '#00ffff'],
                    [1, '#0000ff']
                ]
            }
        },

        series: [{
            name: 'Basemap',
            mapData: topology,
            accessibility: {
                exposeAsGroupOnly: true
            },
            borderColor: '#606060',
            nullColor: 'rgba(200, 200, 200, 0.2)',
            showInLegend: false
        }, {
            type: 'temperaturemap',
            accessibility: {
                point: {
                    valueDescriptionFormat: '{point.capital}, {point.parentState}. Population {point.population}. Latitude {point.lat:.2f}, longitude {point.lon:.2f}.'
                }
            },
            name: 'State capital cities',
            data: data
        }]
    });

})();
