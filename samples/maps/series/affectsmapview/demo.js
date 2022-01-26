(async () => {

    const world = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    const us = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
    ).then(response => response.json());
    const data = new Array(us.objects.default.geometries.length).fill(1)
        .map((val, i) => i);

    // Initialize the chart
    Highcharts.mapChart('container', {

        chart: {
            map: us
        },

        title: {
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
            // US map
            data,
            joinBy: null
        }]
    });
})();
