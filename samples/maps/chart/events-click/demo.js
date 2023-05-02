(async () => {

    const mapData = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());
    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json'
    ).then(response => response.json());

    const click = function (e) {
        // `this` is either Series or Chart
        const chart = this.chart || this;

        const p = { lon: e.lon, lat: e.lat };

        p.name = '[N' + p.lat.toFixed(2) + ', E' + p.lon.toFixed(2) + ']';

        // Add point
        chart.get('clicks').addPoint(p);
    };

    // Initialize the chart
    Highcharts.mapChart('container', {

        chart: {
            events: {
                click
            }
        },

        title: {
            text: 'Add points on chart click'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        mapView: {
            projection: {
                name: 'EqualEarth'
            }
        },

        colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic'
        },

        series: [{
            data,
            mapData,
            joinBy: ['iso-a2', 'code'],
            name: 'Population density',
            tooltip: {
                valueSuffix: '/km²'
            },
            events: {
                click
            }
        }, {
            colorAxis: false,
            type: 'mappoint',
            id: 'clicks',
            name: 'Clicks',
            data: []
        }]
    });
})();
