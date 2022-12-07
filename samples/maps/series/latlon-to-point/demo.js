(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/gb/gb-all.topo.json'
    ).then(response => response.json());

    // Initialize the chart
    const chart = Highcharts.mapChart('container', {
        title: {
            text: 'Highmaps lat/lon demo'
        },

        mapNavigation: {
            enabled: true
        },

        tooltip: {
            headerFormat: '',
            pointFormat: '<b>{point.name}</b><br>Lat: {point.lat}, Lon: {point.lon}'
        },

        series: [{
            // Use the gb-all map with no data as a basemap
            mapData: topology,
            name: 'Basemap',
            borderColor: '#A0A0A0',
            nullColor: 'rgba(200, 200, 200, 0.3)',
            showInLegend: false
        }, {
            // Specify points using lat/lon
            type: 'mappoint',
            name: 'Cities',
            color: Highcharts.getOptions().colors[1],
            data: [{
                name: 'London',
                lat: 51.507222,
                lon: -0.1275
            }, {
                name: 'Birmingham',
                lat: 52.483056,
                lon: -1.893611
            }]
        }]
    });

    document.getElementById('addCircle').onclick = () => {
        const pixelPos = chart.mapView.lonLatToPixels({
            lat: 51.507222,
            lon: -0.1275
        });

        chart.renderer.circle(
            chart.plotLeft + pixelPos.x,
            chart.plotTop + pixelPos.y,
            28
        ).attr({
            zIndex: 100,
            fill: '#FCFFC5',
            'fill-opacity': 0.4,
            stroke: '#606060',
            'stroke-width': 1
        }).add();
    };

})();