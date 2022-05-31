(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/do/do-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['do-pn', 10], ['do-al', 11], ['do-pv', 12], ['do-jo', 13],
        ['do-hm', 14], ['do-mp', 15], ['do-du', 16], ['do-mt', 17],
        ['do-sm', 18], ['do-cr', 19], ['do-nc', 20], ['do-se', 21],
        ['do-ro', 22], ['do-st', 23], ['do-sr', 24], ['do-va', 25],
        ['do-ju', 26], ['do-sd', 27], ['do-pm', 28], ['do-mc', 29],
        ['do-pp', 30], ['do-da', 31], ['do-es', 32], ['do-1857', 33],
        ['do-br', 34], ['do-bh', 35], ['do-in', 36], ['do-ep', 37],
        ['do-az', 38], ['do-ve', 39], ['do-sz', 40], ['do-mn', 41]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/do/do-all.topo.json">Dominican Republic</a>'
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
