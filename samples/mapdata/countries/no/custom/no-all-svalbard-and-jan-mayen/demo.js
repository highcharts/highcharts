(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/no/custom/no-all-svalbard-and-jan-mayen.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-sv', 10], ['no-sj', 11], ['no-vf', 12], ['no-te', 13],
        ['no-ro', 14], ['no-of', 15], ['no-os', 16], ['no-ak', 17],
        ['no-fi', 18], ['no-td', 19], ['no-mr', 20], ['no-tr', 21],
        ['no-no', 22], ['no-bu', 23], ['no-ag', 24], ['no-in', 25],
        ['no-vl', 26]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/custom/no-all-svalbard-and-jan-mayen.topo.json">Norway with Svalbard and Jan Mayen</a>'
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
