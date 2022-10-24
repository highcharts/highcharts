(async () => {

    const world = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    const eu = await fetch(
        'https://code.highcharts.com/mapdata/custom/european-union.topo.json'
    ).then(response => response.json());

    // Brexit
    eu.objects.default.geometries.splice(
        eu.objects.default.geometries.findIndex(g => g.id === 'GB'),
        1
    );

    // Random demo data
    const data = new Array(eu.objects.default.geometries.length)
        .fill(1)
        .map((val, i) => i);

    // Initialize the chart
    Highcharts.mapChart('container', {

        chart: {
            map: eu
        },

        title: {
            text: 'European Union'
        },

        subtitle: {
            text: 'World map backdrop does not affect the map view'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        plotOptions: {
            map: {
                showInLegend: false
            }
        },

        colorAxis: {

        },

        series: [{
            // World map
            data: [],
            affectsMapView: false,
            mapData: world,
            borderColor: 'rgba(0, 0, 0, 0)',
            nullColor: 'rgba(196, 196, 196, 0.2)'
        }, {
            // EU map
            data,
            joinBy: null,
            borderColor: '#666'
        }]
    });
})();
