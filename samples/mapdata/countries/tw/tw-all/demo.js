(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/tw/tw-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['tw-pt', 10], ['tw-tn', 11], ['tw-il', 12], ['tw-ch', 13],
        ['tw-tt', 14], ['tw-ph', 15], ['tw-km', 16], ['tw-lk', 17],
        ['tw-tw', 18], ['tw-cs', 19], ['tw-th', 20], ['tw-yl', 21],
        ['tw-kh', 22], ['tw-tp', 23], ['tw-hs', 24], ['tw-hh', 25],
        ['tw-cl', 26], ['tw-ml', 27], ['tw-ty', 28], ['tw-cg', 29],
        ['tw-hl', 30], ['tw-nt', 31]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/tw/tw-all.topo.json">Taiwan</a>'
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
