(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/cn/custom/cn-all-sar.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['cn-3664', 10], ['cn-fj', 11], ['cn-gd', 12], ['cn-sh', 13],
        ['cn-zj', 14], ['cn-3681', 15], ['cn-3682', 16], ['cn-6655', 17],
        ['cn-6656', 18], ['cn-6658', 19], ['cn-6659', 20], ['cn-6660', 21],
        ['cn-6661', 22], ['cn-6662', 23], ['cn-6664', 24], ['cn-6668', 25],
        ['cn-nx', 26], ['cn-sa', 27], ['cn-cq', 28], ['cn-ah', 29],
        ['cn-hu', 30], ['cn-6657', 31], ['cn-6663', 32], ['cn-6665', 33],
        ['cn-6666', 34], ['cn-6667', 35], ['cn-6669', 36], ['cn-6670', 37],
        ['cn-6671', 38], ['cn-xz', 39], ['cn-yn', 40], ['cn-bj', 41],
        ['cn-hb', 42], ['cn-sd', 43], ['cn-tj', 44], ['cn-gs', 45],
        ['cn-jl', 46], ['cn-xj', 47], ['cn-sx', 48], ['cn-nm', 49],
        ['cn-hl', 50], ['cn-gx', 51], ['cn-ln', 52], ['cn-ha', 53],
        ['cn-js', 54], ['cn-sc', 55], ['cn-qh', 56], ['cn-he', 57],
        ['cn-gz', 58], ['cn-hn', 59], ['cn-jx', 60]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/cn/custom/cn-all-sar.topo.json">China with Hong Kong and Macau</a>'
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
