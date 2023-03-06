(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/se/se-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['se-4461', 10], ['se-ka', 11], ['se-og', 12], ['se-nb', 13],
        ['se-vn', 14], ['se-vb', 15], ['se-gt', 16], ['se-st', 17],
        ['se-up', 18], ['se-bl', 19], ['se-vg', 20], ['se-ko', 21],
        ['se-gv', 22], ['se-jo', 23], ['se-kr', 24], ['se-or', 25],
        ['se-vm', 26], ['se-ha', 27], ['se-sd', 28], ['se-vr', 29],
        ['se-ja', 30], ['se-sn', 31]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/se/se-all.topo.json">Sweden</a>'
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
