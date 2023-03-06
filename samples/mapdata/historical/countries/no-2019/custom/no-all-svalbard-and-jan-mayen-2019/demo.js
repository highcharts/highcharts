(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/historical/countries/no-2019/custom/no-all-svalbard-and-jan-mayen-2019.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-mr', 10], ['no-st', 11], ['no-ho', 12], ['no-sf', 13],
        ['no-va', 14], ['no-of', 15], ['no-nt', 16], ['no-ro', 17],
        ['no-bu', 18], ['no-vf', 19], ['no-fi', 20], ['no-no', 21],
        ['no-tr', 22], ['no-ak', 23], ['no-op', 24], ['no-he', 25],
        ['no-os', 26], ['no-te', 27], ['no-aa', 28], ['no-sv', 29],
        ['no-sj', 30]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/no-2019/custom/no-all-svalbard-and-jan-mayen-2019.topo.json">Norway with Svalbard and Jan Mayen (2019)</a>'
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
