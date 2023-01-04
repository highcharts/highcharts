(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/historical/countries/fr-2015/fr-all-2015.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['fr-t', 10], ['fr-h', 11], ['fr-e', 12], ['fr-r', 13], ['fr-u', 14],
        ['fr-n', 15], ['fr-p', 16], ['fr-o', 17], ['fr-v', 18], ['fr-s', 19],
        ['fr-g', 20], ['fr-k', 21], ['fr-a', 22], ['fr-c', 23], ['fr-f', 24],
        ['fr-l', 25], ['fr-d', 26], ['fr-b', 27], ['fr-i', 28], ['fr-q', 29],
        ['fr-j', 30], ['fr-m', 31], ['fr-re', 32], ['fr-yt', 33], ['fr-gf', 34],
        ['fr-mq', 35], ['fr-gp', 36]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/fr-2015/fr-all-2015.topo.json">France (2015)</a>'
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
