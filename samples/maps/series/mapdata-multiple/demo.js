(async () => {

    const norway = await fetch(
        'https://code.highcharts.com/mapdata/countries/no/no-all.topo.json'
    ).then(response => response.json());

    const sweden = await fetch(
        'https://code.highcharts.com/mapdata/countries/se/se-all.topo.json'
    ).then(response => response.json());


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
                name: 'LambertConformalConic',
                rotation: [-16],
                parallels: [60, 70]
            }
        },

        plotOptions: {
            map: {
                showInLegend: false
            }
        },

        series: [{
            data: [],
            mapData: norway
        }, {
            data: [],
            mapData: sweden
        }]
    });
})();
