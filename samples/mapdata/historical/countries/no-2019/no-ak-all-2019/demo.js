(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/historical/countries/no-2019/no-ak-all-2019.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-ak-216', 10], ['no-ak-217', 11], ['no-ak-213', 12],
        ['no-ak-214', 13], ['no-ak-211', 14], ['no-os-219', 15],
        ['no-ak-239', 16], ['no-ak-238', 17], ['no-ak-234', 18],
        ['no-ak-235', 19], ['no-ak-236', 20], ['no-ak-215', 21],
        ['no-ak-237', 22], ['no-ak-233', 23], ['no-ak-231', 24],
        ['no-ak-229', 25], ['no-ak-230', 26], ['no-ak-228', 27],
        ['no-ak-227', 28], ['no-ak-226', 29], ['no-ak-221', 30],
        ['no-os-220', 31]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/no-2019/no-ak-all-2019.topo.json">Akershus (2019)</a>'
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
