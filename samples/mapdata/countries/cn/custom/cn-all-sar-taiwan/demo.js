(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/cn/custom/cn-all-sar-taiwan.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['tw-ph', 10], ['cn-sh', 11], ['tw-km', 12], ['cn-zj', 13],
        ['tw-lk', 14], ['cn-3664', 15], ['cn-3681', 16], ['cn-fj', 17],
        ['cn-gd', 18], ['tw-tw', 19], ['tw-cs', 20], ['cn-6657', 21],
        ['cn-6663', 22], ['cn-6665', 23], ['cn-6666', 24], ['cn-6667', 25],
        ['cn-6669', 26], ['cn-6670', 27], ['cn-6671', 28], ['tw-kh', 29],
        ['tw-hs', 30], ['cn-yn', 31], ['cn-xz', 32], ['tw-hh', 33],
        ['tw-cl', 34], ['tw-ml', 35], ['cn-nx', 36], ['cn-sa', 37],
        ['tw-ty', 38], ['cn-3682', 39], ['tw-cg', 40], ['cn-6655', 41],
        ['cn-ah', 42], ['cn-hu', 43], ['tw-hl', 44], ['tw-th', 45],
        ['cn-6656', 46], ['tw-nt', 47], ['cn-6658', 48], ['cn-6659', 49],
        ['cn-cq', 50], ['cn-hn', 51], ['tw-yl', 52], ['cn-6660', 53],
        ['cn-6661', 54], ['cn-6662', 55], ['cn-6664', 56], ['cn-6668', 57],
        ['tw-pt', 58], ['tw-tt', 59], ['tw-tn', 60], ['cn-bj', 61],
        ['cn-hb', 62], ['tw-il', 63], ['tw-tp', 64], ['cn-sd', 65],
        ['tw-ch', 66], ['cn-tj', 67], ['cn-ha', 68], ['cn-jl', 69],
        ['cn-qh', 70], ['cn-xj', 71], ['cn-nm', 72], ['cn-hl', 73],
        ['cn-sc', 74], ['cn-gz', 75], ['cn-gx', 76], ['cn-ln', 77],
        ['cn-js', 78], ['cn-gs', 79], ['cn-sx', 80], ['cn-he', 81],
        ['cn-jx', 82]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/cn/custom/cn-all-sar-taiwan.topo.json">China with Hong Kong, Macau, and Taiwan</a>'
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
