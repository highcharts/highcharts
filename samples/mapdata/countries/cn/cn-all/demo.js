(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/cn/cn-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['cn-qh', 10], ['cn-xj', 11], ['cn-gs', 12], ['cn-nm', 13],
        ['cn-jl', 14], ['cn-hl', 15], ['cn-gx', 16], ['cn-gz', 17],
        ['cn-ha', 18], ['cn-tw', 19], ['cn-zj', 20], ['cn-fj', 21],
        ['cn-gd', 22], ['cn-bj', 23], ['cn-ln', 24], ['cn-he', 25],
        ['cn-tj', 26], ['cn-sd', 27], ['cn-ah', 28], ['cn-js', 29],
        ['cn-sh', 30], ['cn-sc', 31], ['cn-cq', 32], ['cn-hn', 33],
        ['cn-yn', 34], ['cn-sn', 35], ['cn-nx', 36], ['cn-sx', 37],
        ['cn-hb', 38], ['cn-jx', 39], ['cn-hk', 40], ['cn-mo', 41],
        ['cn-hi', 42], ['cn-xz', 43]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/cn/cn-all.topo.json">China</a>'
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
