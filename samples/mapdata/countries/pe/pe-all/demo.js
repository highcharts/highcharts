(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/pe/pe-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['pe-ic', 10], ['pe-cs', 11], ['pe-uc', 12], ['pe-md', 13],
        ['pe-sm', 14], ['pe-am', 15], ['pe-lo', 16], ['pe-ay', 17],
        ['pe-145', 18], ['pe-hv', 19], ['pe-ju', 20], ['pe-lr', 21],
        ['pe-lb', 22], ['pe-tu', 23], ['pe-ap', 24], ['pe-ar', 25],
        ['pe-cl', 26], ['pe-mq', 27], ['pe-ta', 28], ['pe-an', 29],
        ['pe-cj', 30], ['pe-hc', 31], ['pe-3341', 32], ['pe-ll', 33],
        ['pe-pa', 34], ['pe-pi', 35]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/pe/pe-all.topo.json">Peru</a>'
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
