(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ly/ly-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ly-gd', 10], ['ly-ju', 11], ['ly-kf', 12], ['ly-mb', 13],
        ['ly-sh', 14], ['ly-gt', 15], ['ly-mq', 16], ['ly-mi', 17],
        ['ly-sb', 18], ['ly-ji', 19], ['ly-nq', 20], ['ly-za', 21],
        ['ly-mz', 22], ['ly-tn', 23], ['ly-sr', 24], ['ly-hz', 25],
        ['ly-ja', 26], ['ly-aj', 27], ['ly-ba', 28], ['ly-qb', 29],
        ['ly-bu', 30], ['ly-wh', 31]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ly/ly-all.topo.json">Libya</a>'
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
