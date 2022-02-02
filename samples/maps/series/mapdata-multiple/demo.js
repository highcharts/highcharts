(async () => {


    const ca = await fetch(
        'https://code.highcharts.com/mapdata/countries/ca/ca-all.topo.json'
    ).then(response => response.json());

    const us = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
    ).then(response => response.json());


    // Initialize the chart
    Highcharts.mapChart('container', {
        title: {
            text: 'Multiple map sources'
        },

        subtitle: {
            text: 'Canada and US maps combined'
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
                rotation: [90],
                parallels: [30, 40]
            }
        },

        plotOptions: {
            map: {
                showInLegend: false
            }
        },

        series: [{
            data: [],
            mapData: ca
        }, {
            data: [],
            mapData: us
        }]
    });
})();
