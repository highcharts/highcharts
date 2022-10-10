(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/jp/jp-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['jp-hs', 10], ['jp-sm', 11], ['jp-yc', 12], ['jp-km', 13],
        ['jp-eh', 14], ['jp-kg', 15], ['jp-is', 16], ['jp-hk', 17],
        ['jp-tk', 18], ['jp-3461', 19], ['jp-3457', 20], ['jp-ib', 21],
        ['jp-st', 22], ['jp-sg', 23], ['jp-yn', 24], ['jp-kn', 25],
        ['jp-fo', 26], ['jp-fs', 27], ['jp-3480', 28], ['jp-ts', 29],
        ['jp-ky', 30], ['jp-me', 31], ['jp-ai', 32], ['jp-nr', 33],
        ['jp-os', 34], ['jp-wk', 35], ['jp-ch', 36], ['jp-ak', 37],
        ['jp-mg', 38], ['jp-tt', 39], ['jp-hg', 40], ['jp-gf', 41],
        ['jp-nn', 42], ['jp-ty', 43], ['jp-ni', 44], ['jp-oy', 45],
        ['jp-ao', 46], ['jp-mz', 47], ['jp-iw', 48], ['jp-kc', 49],
        ['jp-ot', 50], ['jp-sz', 51], ['jp-fi', 52], ['jp-sh', 53],
        ['jp-tc', 54], ['jp-yt', 55], ['jp-3302', 56]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/jp/jp-all.topo.json">Japan</a>'
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
