(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/bt/bt-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['bt-ty', 10], ['bt-sg', 11], ['bt-to', 12], ['bt-wp', 13],
        ['bt-mo', 14], ['bt-pm', 15], ['bt-sj', 16], ['bt-ta', 17],
        ['bt-ck', 18], ['bt-da', 19], ['bt-ha', 20], ['bt-pr', 21],
        ['bt-sm', 22], ['bt-tm', 23], ['bt-ga', 24], ['bt-pn', 25],
        ['bt-cr', 26], ['bt-ge', 27], ['bt-bu', 28], ['bt-lh', 29]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/bt/bt-all.topo.json">Bhutan</a>'
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
