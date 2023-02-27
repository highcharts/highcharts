(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/hu/hu-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['hu-no', 10], ['hu-bz', 11], ['hu-he', 12], ['hu-jn', 13],
        ['hu-bu', 14], ['hu-ed', 15], ['hu-sd', 16], ['hu-hv', 17],
        ['hu-st', 18], ['hu-mi', 19], ['hu-nk', 20], ['hu-so', 21],
        ['hu-du', 22], ['hu-bk', 23], ['hu-tb', 24], ['hu-fe', 25],
        ['hu-ke', 26], ['hu-pe', 27], ['hu-sk', 28], ['hu-sz', 29],
        ['hu-cs', 30], ['hu-be', 31], ['hu-hb', 32], ['hu-sn', 33],
        ['hu-va', 34], ['hu-sh', 35], ['hu-ba', 36], ['hu-gs', 37],
        ['hu-to', 38], ['hu-za', 39], ['hu-ze', 40], ['hu-ss', 41],
        ['hu-mc', 42], ['hu-ny', 43], ['hu-de', 44], ['hu-eg', 45],
        ['hu-gy', 46], ['hu-ps', 47], ['hu-sf', 48], ['hu-vm', 49],
        ['hu-ve', 50], ['hu-kv', 51], ['hu-km', 52]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/hu/hu-all.topo.json">Hungary</a>'
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
