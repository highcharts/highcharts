(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/north-america-no-central.topo.json'
    ).then(response => response.json());

    // Prepare demo data
    const data = [{
        'hc-key': 'us',
        value: 3
    }, {
        'hc-key': 'ca',
        value: 5
    }, {
        'hc-key': 'mx',
        value: 20
    }];


    // Initialize the chart
    Highcharts.mapChart('container', {

        title: {
            text: 'Showing only non-null areas'
        },

        subtitle: {
            text: 'The <em>allAreas</em> option is false'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 0
        },

        series: [{
            data: data,
            mapData: topology,
            joinBy: 'hc-key',
            allAreas: false,
            name: 'Random data',
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });
})();