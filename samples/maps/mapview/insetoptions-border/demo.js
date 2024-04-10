(async () => {
    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
    ).then(response => response.json());

    // Create a data value for each geometry
    const data = topology.objects.default.geometries.map((f, i) => i % 5);

    // Initialize the chart
    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'MapView inset positioning options'
        },

        mapNavigation: {
            enabled: true
        },

        mapView: {
            insetOptions: {
                borderColor: 'silver',
                borderWidth: 2
            }
        },

        colorAxis: {
            tickPixelInterval: 100,
            minColor: '#F1EEF6',
            maxColor: '#900037'
        },

        series: [{
            data,
            joinBy: null,
            name: 'Random data',
            dataLabels: {
                enabled: true,
                format: '{point.properties.postal-code}'
            }
        }]
    });
})();
