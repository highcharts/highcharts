(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/co/co-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['co-sa', 10], ['co-ca', 11], ['co-na', 12], ['co-ch', 13],
        ['co-3653', 14], ['co-to', 15], ['co-cq', 16], ['co-hu', 17],
        ['co-pu', 18], ['co-am', 19], ['co-bl', 20], ['co-vc', 21],
        ['co-su', 22], ['co-at', 23], ['co-ce', 24], ['co-lg', 25],
        ['co-ma', 26], ['co-ar', 27], ['co-ns', 28], ['co-cs', 29],
        ['co-gv', 30], ['co-me', 31], ['co-vp', 32], ['co-vd', 33],
        ['co-an', 34], ['co-co', 35], ['co-by', 36], ['co-st', 37],
        ['co-cl', 38], ['co-cu', 39], ['co-1136', 40], ['co-ri', 41],
        ['co-qd', 42], ['co-gn', 43]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/co/co-all.topo.json">Colombia</a>'
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
