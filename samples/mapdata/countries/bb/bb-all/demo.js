(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/bb/bb-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['bb-mi', 10], ['bb-pe', 11], ['bb-an', 12], ['bb-ph', 13],
        ['bb-cc', 14], ['bb-th', 15], ['bb-ge', 16], ['bb-jm', 17],
        ['bb-jn', 18], ['bb-js', 19], ['bb-lu', 20]
    ];

    // Create the chart
    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'Highcharts Maps basic demo'
        },

        subtitle: {
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/bb/bb-all.topo.json">Barbados</a>'
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
            name: 'Random data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });

})();
