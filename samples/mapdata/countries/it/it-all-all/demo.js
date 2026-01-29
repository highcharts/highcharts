(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/it/it-all-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['it-ag', 10], ['it-sr', 11], ['it-rg', 12], ['it-tp', 13],
        ['it-cl', 14], ['it-ct', 15], ['it-en', 16], ['it-pa', 17],
        ['it-me', 18], ['it-cz', 19], ['it-kr', 20], ['it-cs', 21],
        ['it-nu', 22], ['it-or', 23], ['it-le', 24], ['it-pz', 25],
        ['it-sa', 26], ['it-mt', 27], ['it-ta', 28], ['it-br', 29],
        ['it-na', 30], ['it-ba', 31], ['it-av', 32], ['it-lt', 33],
        ['it-ce', 34], ['it-bn', 35], ['it-fg', 36], ['it-fr', 37],
        ['it-cb', 38], ['it-is', 39], ['it-rm', 40], ['it-ch', 41],
        ['it-pe', 42], ['it-ri', 43], ['it-vt', 44], ['it-gr', 45],
        ['it-tr', 46], ['it-te', 47], ['it-pg', 48], ['it-ap', 49],
        ['it-li', 50], ['it-si', 51], ['it-mc', 52], ['it-pi', 53],
        ['it-ar', 54], ['it-pu', 55], ['it-fi', 56], ['it-fc', 57],
        ['it-lu', 58], ['it-po', 59], ['it-im', 60], ['it-pt', 61],
        ['it-rn', 62], ['it-sv', 63], ['it-ms', 64], ['it-cn', 65],
        ['it-bo', 66], ['it-mo', 67], ['it-ra', 68], ['it-re', 69],
        ['it-pr', 70], ['it-al', 71], ['it-at', 72], ['it-fe', 73],
        ['it-pc', 74], ['it-pv', 75], ['it-ro', 76], ['it-mn', 77],
        ['it-cr', 78], ['it-vr', 79], ['it-lo', 80], ['it-pd', 81],
        ['it-ve', 82], ['it-vi', 83], ['it-rc', 84], ['it-vv', 85],
        ['it-to', 86], ['it-mi', 87], ['it-bs', 88], ['it-bi', 89],
        ['it-bg', 90], ['it-ao', 91], ['it-tv', 92], ['it-va', 93],
        ['it-co', 94], ['it-lc', 95], ['it-tn', 96], ['it-vb', 97],
        ['it-bl', 98], ['it-so', 99], ['it-bz', 100], ['it-sp', 101],
        ['it-ge', 102], ['it-an', 103], ['it-aq', 104], ['it-ts', 105],
        ['it-pn', 106], ['it-go', 107], ['it-ud', 108], ['it-mb', 109],
        ['it-ss', 110], ['it-ca', 111], ['it-fm', 112], ['it-no', 113],
        ['it-vc', 114], ['it-bt', 115], ['it-su', 116]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/it/it-all-all.topo.json">Italy, admin2</a>'
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
