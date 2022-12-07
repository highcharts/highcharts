(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/de/de-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['de-ni', 10], ['de-sh', 11], ['de-be', 12], ['de-mv', 13],
        ['de-hb', 14], ['de-sl', 15], ['de-by', 16], ['de-th', 17],
        ['de-st', 18], ['de-sn', 19], ['de-bb', 20], ['de-nw', 21],
        ['de-bw', 22], ['de-he', 23], ['de-hh', 24], ['de-rp', 25]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/de/de-all.topo.json">Germany</a>'
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
