(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/no/no-ak-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-ak-3242', 10], ['no-ak-3240', 11], ['no-ak-3209', 12],
        ['no-ak-3228', 13], ['no-ak-3238', 14], ['no-ak-3232', 15],
        ['no-ak-3230', 16], ['no-ak-3222', 17], ['no-ak-3224', 18],
        ['no-ak-3220', 19], ['no-ak-3216', 20], ['no-ak-3214', 21],
        ['no-ak-3212', 22], ['no-ak-3201', 23], ['no-ak-3218', 24],
        ['no-ak-3236', 25], ['no-ak-3234', 26], ['no-ak-3205', 27],
        ['no-ak-3226', 28], ['no-ak-3207', 29], ['no-ak-3203', 30]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-ak-all.topo.json">Akershus</a>'
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
