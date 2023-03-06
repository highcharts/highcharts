(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/iq/iq-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['iq-na', 10], ['iq-ka', 11], ['iq-ba', 12], ['iq-mu', 13],
        ['iq-qa', 14], ['iq-dq', 15], ['iq-ma', 16], ['iq-wa', 17],
        ['iq-sd', 18], ['iq-su', 19], ['iq-di', 20], ['iq-bb', 21],
        ['iq-bg', 22], ['iq-an', 23], ['iq-ar', 24], ['iq-ts', 25],
        ['iq-da', 26], ['iq-ni', 27]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/iq/iq-all.topo.json">Iraq</a>'
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
