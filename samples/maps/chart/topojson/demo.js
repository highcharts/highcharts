(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/europe.topo.json'
    ).then(response => response.json());

    // Create a data value for each geometry
    const data = topology.objects.default.geometries.map((f, i) => i % 5);

    // Initialize the chart
    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'TopoJSON in Highcharts Maps'
        },

        mapView: {
            projection: {
                name: 'LambertConformalConic',
                parallels: [43, 62],
                rotation: [-10]
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
                format: '{point.name}'
            }
        }]
    });
})();