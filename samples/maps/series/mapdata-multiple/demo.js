(async () => {

    const norway = await fetch(
        'https://code.highcharts.com/mapdata/countries/no/no-all.topo.json'
    ).then(response => response.json());
    const norwayMapData = Highcharts.geojson(norway);

    const sweden = await fetch(
        'https://code.highcharts.com/mapdata/countries/se/se-all.topo.json'
    ).then(response => response.json());
    const swedenMapData = Highcharts.geojson(sweden);


    // Initialize the chart
    Highcharts.mapChart('container', {
        title: {
            text: 'Multiple map sources'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        mapView: {
            projection: {
                name: 'Orthographic',
                rotation: [-16, -63]
            }
        },

        plotOptions: {
            map: {
                showInLegend: false
            }
        },

        series: [{
            data: [],
            mapData: norwayMapData
        }, {
            data: [],
            mapData: swedenMapData
        }]
    });
})();
