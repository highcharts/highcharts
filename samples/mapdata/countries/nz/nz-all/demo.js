(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/nz/nz-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['nz-au', 10], ['nz-ma', 11], ['nz-so', 12], ['nz-wk', 13],
        ['nz-wg', 14], ['nz-4680', 15], ['nz-6943', 16], ['nz-6947', 17],
        ['nz-ca', 18], ['nz-ot', 19], ['nz-mw', 20], ['nz-gi', 21],
        ['nz-hb', 22], ['nz-bp', 23], ['nz-3315', 24], ['nz-3316', 25],
        ['nz-no', 26], ['nz-tk', 27], ['nz-wc', 28]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/nz/nz-all.topo.json">New Zealand</a>'
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
