(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/sn/sn-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['sn-sl', 10], ['sn-th', 11], ['sn-680', 12], ['sn-zg', 13],
        ['sn-tc', 14], ['sn-kd', 15], ['sn-6976', 16], ['sn-6978', 17],
        ['sn-6975', 18], ['sn-dk', 19], ['sn-db', 20], ['sn-fk', 21],
        ['sn-1181', 22], ['sn-lg', 23]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/sn/sn-all.topo.json">Senegal</a>'
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
