(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/historical/countries/no-2019/no-bu-all-2019.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-bu-620', 10], ['no-bu-617', 11], ['no-bu-605', 12],
        ['no-bu-615', 13], ['no-bu-627', 14], ['no-bu-604', 15],
        ['no-bu-622', 16], ['no-bu-623', 17], ['no-bu-602', 18],
        ['no-bu-621', 19], ['no-bu-626', 20], ['no-bu-612', 21],
        ['no-bu-618', 22], ['no-bu-624', 23], ['no-bu-632', 24],
        ['no-bu-628', 25], ['no-bu-631', 26], ['no-bu-633', 27],
        ['no-bu-616', 28], ['no-bu-619', 29], ['no-bu-625', 30]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/no-2019/no-bu-all-2019.topo.json">Buskerud (2019)</a>'
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
