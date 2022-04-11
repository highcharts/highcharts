(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/rs/rs-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['rs-jc', 10], ['rs-bg', 11], ['rs-jn', 12], ['rs-sd', 13],
        ['rs-pi', 14], ['rs-bo', 15], ['rs-zl', 16], ['rs-zc', 17],
        ['rs-sc', 18], ['rs-sn', 19], ['rs-br', 20], ['rs-sm', 21],
        ['rs-mr', 22], ['rs-ns', 23], ['rs-pd', 24], ['rs-pm', 25],
        ['rs-rn', 26], ['rs-rs', 27], ['rs-to', 28], ['rs-kb', 29],
        ['rs-ma', 30], ['rs-su', 31], ['rs-pc', 32], ['rs-ja', 33],
        ['rs-zj', 34]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/rs/rs-all.topo.json">Republic of Serbia</a>'
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
