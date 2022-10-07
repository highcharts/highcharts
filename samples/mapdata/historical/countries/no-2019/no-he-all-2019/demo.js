(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/historical/countries/no-2019/no-he-all-2019.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-he-441', 10], ['no-he-439', 11], ['no-he-438', 12],
        ['no-he-437', 13], ['no-he-436', 14], ['no-he-434', 15],
        ['no-he-430', 16], ['no-he-428', 17], ['no-he-423', 18],
        ['no-he-432', 19], ['no-he-402', 20], ['no-he-427', 21],
        ['no-he-403', 22], ['no-he-429', 23], ['no-he-415', 24],
        ['no-he-420', 25], ['no-he-417', 26], ['no-he-425', 27],
        ['no-he-412', 28], ['no-he-426', 29], ['no-he-418', 30],
        ['no-he-419', 31]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/no-2019/no-he-all-2019.topo.json">Hedmark (2019)</a>'
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
