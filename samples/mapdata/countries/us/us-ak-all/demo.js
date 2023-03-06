(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-ak-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-ak-261', 10], ['us-ak-050', 11], ['us-ak-070', 12],
        ['us-ak-013', 13], ['us-ak-180', 14], ['us-ak-016', 15],
        ['us-ak-150', 16], ['us-ak-105', 17], ['us-ak-130', 18],
        ['us-ak-220', 19], ['us-ak-290', 20], ['us-ak-068', 21],
        ['us-ak-170', 22], ['us-ak-198', 23], ['us-ak-195', 24],
        ['us-ak-275', 25], ['us-ak-110', 26], ['us-ak-240', 27],
        ['us-ak-020', 28], ['us-ak-090', 29], ['us-ak-100', 30],
        ['us-ak-122', 31], ['us-ak-164', 32], ['us-ak-060', 33],
        ['us-ak-282', 34], ['us-ak-230', 35], ['us-ak-270', 36],
        ['us-ak-185', 37], ['us-ak-188', 38]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-ak-all.topo.json">Alaska</a>'
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
