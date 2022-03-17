(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/eg/eg-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['eg-5847', 10], ['eg-ba', 11], ['eg-js', 12], ['eg-uq', 13],
        ['eg-is', 14], ['eg-gh', 15], ['eg-mf', 16], ['eg-qh', 17],
        ['eg-ql', 18], ['eg-sq', 19], ['eg-ss', 20], ['eg-sw', 21],
        ['eg-dq', 22], ['eg-bs', 23], ['eg-dt', 24], ['eg-bh', 25],
        ['eg-mt', 26], ['eg-ik', 27], ['eg-jz', 28], ['eg-fy', 29],
        ['eg-wj', 30], ['eg-mn', 31], ['eg-bn', 32], ['eg-ks', 33],
        ['eg-at', 34], ['eg-an', 35], ['eg-qn', 36], ['eg-sj', 37]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/eg/eg-all.topo.json">Egypt</a>'
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
