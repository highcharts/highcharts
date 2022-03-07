(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/historical/countries/fr-2015/custom/fr-all-mainland-2015.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['fr-t', 10], ['fr-e', 11], ['fr-r', 12], ['fr-u', 13], ['fr-n', 14],
        ['fr-p', 15], ['fr-o', 16], ['fr-v', 17], ['fr-s', 18], ['fr-g', 19],
        ['fr-k', 20], ['fr-a', 21], ['fr-c', 22], ['fr-f', 23], ['fr-l', 24],
        ['fr-d', 25], ['fr-b', 26], ['fr-i', 27], ['fr-q', 28], ['fr-j', 29],
        ['fr-m', 30]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/fr-2015/custom/fr-all-mainland-2015.topo.json">France, mainland (2015)</a>'
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
