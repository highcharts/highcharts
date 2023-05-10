(async () => {

    const mapData = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json'
    ).then(response => response.json());

    // Initialize the chart
    const chart = Highcharts.mapChart('container', {

        title: {
            text: 'Get MapView state'
        },

        colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic'
        },

        mapNavigation: {
            enabled: true
        },

        mapView: {
            projection: {
                name: 'WebMercator'
            }
        },

        series: [{
            data,
            mapData,
            joinBy: ['iso-a2', 'code'],
            name: 'Population density',
            tooltip: {
                valueSuffix: '/km²'
            }
        }]
    });

    const printView = () => {
        const mapView = chart.mapView;

        chart.setTitle(null, {
            text: '<b>MapView</b><br>' +
                'center: [' + mapView.center.map(Math.round).join(', ') + ']<br>' +
                'zoom: ' + mapView.zoom.toFixed(2),
            align: 'left',
            floating: true,
            y: 250,
            style: {
                color: '#000000'
            }
        });
    };
    printView();
    Highcharts.addEvent(chart.mapView, 'afterSetView', printView);
})();
