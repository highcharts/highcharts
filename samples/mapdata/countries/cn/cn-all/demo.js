(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/cn/cn-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['cn-3664', 10], ['cn-gd', 11], ['cn-sh', 12], ['cn-zj', 13],
        ['cn-ha', 14], ['cn-xz', 15], ['cn-yn', 16], ['cn-ah', 17],
        ['cn-hu', 18], ['cn-sa', 19], ['cn-cq', 20], ['cn-gz', 21],
        ['cn-hn', 22], ['cn-sc', 23], ['cn-sx', 24], ['cn-he', 25],
        ['cn-jx', 26], ['cn-nm', 27], ['cn-gx', 28], ['cn-hl', 29],
        ['cn-fj', 30], ['cn-bj', 31], ['cn-hb', 32], ['cn-ln', 33],
        ['cn-sd', 34], ['cn-tj', 35], ['cn-js', 36], ['cn-qh', 37],
        ['cn-gs', 38], ['cn-xj', 39], ['cn-jl', 40], ['cn-nx', 41]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/cn/cn-all.topo.json">China</a>'
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
