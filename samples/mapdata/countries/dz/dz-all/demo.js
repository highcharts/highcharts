(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/dz/dz-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['dz-ml', 10], ['dz-ob', 11], ['dz-sa', 12], ['dz-tb', 13],
        ['dz-il', 14], ['dz-at', 15], ['dz-or', 16], ['dz-sb', 17],
        ['dz-tl', 18], ['dz-tn', 19], ['dz-bc', 20], ['dz-na', 21],
        ['dz-ar', 22], ['dz-an', 23], ['dz-et', 24], ['dz-jj', 25],
        ['dz-sk', 26], ['dz-eb', 27], ['dz-tm', 28], ['dz-gr', 29],
        ['dz-lg', 30], ['dz-og', 31], ['dz-al', 32], ['dz-bm', 33],
        ['dz-to', 34], ['dz-tp', 35], ['dz-ad', 36], ['dz-ch', 37],
        ['dz-mc', 38], ['dz-mg', 39], ['dz-re', 40], ['dz-sd', 41],
        ['dz-tr', 42], ['dz-ts', 43], ['dz-bj', 44], ['dz-bb', 45],
        ['dz-bl', 46], ['dz-bu', 47], ['dz-1950', 48], ['dz-bs', 49],
        ['dz-dj', 50], ['dz-md', 51], ['dz-ms', 52], ['dz-sf', 53],
        ['dz-bt', 54], ['dz-co', 55], ['dz-gl', 56], ['dz-kh', 57]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/dz/dz-all.topo.json">Algeria</a>'
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
