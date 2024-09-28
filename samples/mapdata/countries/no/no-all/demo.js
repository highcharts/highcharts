(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/no/no-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-vf', 10], ['no-te', 11], ['no-ro', 12], ['no-of', 13],
        ['no-os', 14], ['no-ak', 15], ['no-fi', 16], ['no-td', 17],
        ['no-mr', 18], ['no-tr', 19], ['no-no', 20], ['no-bu', 21],
        ['no-ag', 22], ['no-in', 23], ['no-vl', 24]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-all.topo.json">Norway</a>'
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
