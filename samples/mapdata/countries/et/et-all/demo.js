(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/et/et-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['et-be', 10], ['et-2837', 11], ['et-ha', 12], ['et-sn', 13],
        ['et-ga', 14], ['et-aa', 15], ['et-so', 16], ['et-dd', 17],
        ['et-ti', 18], ['et-af', 19], ['et-am', 20]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/et/et-all.topo.json">Ethiopia</a>'
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
