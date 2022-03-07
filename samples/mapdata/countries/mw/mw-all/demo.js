(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/mw/mw-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['mw-6970', 10], ['mw-ma', 11], ['mw-de', 12], ['mw-li', 13],
        ['mw-do', 14], ['mw-mg', 15], ['mw-mc', 16], ['mw-nu', 17],
        ['mw-ni', 18], ['mw-sa', 19], ['mw-ba', 20], ['mw-ck', 21],
        ['mw-th', 22], ['mw-cr', 23], ['mw-ns', 24], ['mw-zo', 25],
        ['mw-bl', 26], ['mw-1649', 27], ['mw-mj', 28], ['mw-ph', 29],
        ['mw-mw', 30], ['mw-1011', 31], ['mw-ct', 32], ['mw-ks', 33],
        ['mw-mz', 34], ['mw-na', 35], ['mw-nk', 36], ['mw-ru', 37]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/mw/mw-all.topo.json">Malawi</a>'
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
