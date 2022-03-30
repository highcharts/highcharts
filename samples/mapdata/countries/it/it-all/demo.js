(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/it/it-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['it-na', 10], ['it-tp', 11], ['it-pa', 12], ['it-me', 13],
        ['it-ag', 14], ['it-nu', 15], ['it-og', 16], ['it-ms', 17],
        ['it-mt', 18], ['it-bn', 19], ['it-cl', 20], ['it-an', 21],
        ['it-pg', 22], ['it-ci', 23], ['it-ss', 24], ['it-ot', 25],
        ['it-gr', 26], ['it-li', 27], ['it-ar', 28], ['it-fe', 29],
        ['it-ra', 30], ['it-fi', 31], ['it-fc', 32], ['it-rn', 33],
        ['it-ge', 34], ['it-sv', 35], ['it-vs', 36], ['it-ve', 37],
        ['it-ca', 38], ['it-pi', 39], ['it-re', 40], ['it-lu', 41],
        ['it-bo', 42], ['it-pt', 43], ['it-pz', 44], ['it-cz', 45],
        ['it-rc', 46], ['it-ce', 47], ['it-lt', 48], ['it-av', 49],
        ['it-is', 50], ['it-ba', 51], ['it-br', 52], ['it-le', 53],
        ['it-ta', 54], ['it-ct', 55], ['it-rg', 56], ['it-pe', 57],
        ['it-ri', 58], ['it-te', 59], ['it-fr', 60], ['it-aq', 61],
        ['it-rm', 62], ['it-ch', 63], ['it-vt', 64], ['it-pu', 65],
        ['it-mc', 66], ['it-fm', 67], ['it-ap', 68], ['it-si', 69],
        ['it-tr', 70], ['it-to', 71], ['it-bi', 72], ['it-no', 73],
        ['it-vc', 74], ['it-ao', 75], ['it-vb', 76], ['it-al', 77],
        ['it-mn', 78], ['it-pc', 79], ['it-lo', 80], ['it-pv', 81],
        ['it-cr', 82], ['it-mi', 83], ['it-va', 84], ['it-so', 85],
        ['it-co', 86], ['it-lc', 87], ['it-bg', 88], ['it-mb', 89],
        ['it-ud', 90], ['it-go', 91], ['it-ts', 92], ['it-ro', 93],
        ['it-pd', 94], ['it-vr', 95], ['it-tn', 96], ['it-bl', 97],
        ['it-mo', 98], ['it-sp', 99], ['it-pr', 100], ['it-fg', 101],
        ['it-im', 102], ['it-or', 103], ['it-cs', 104], ['it-vv', 105],
        ['it-sa', 106], ['it-bt', 107], ['it-sr', 108], ['it-en', 109],
        ['it-cn', 110], ['it-bz', 111], ['it-po', 112], ['it-kr', 113],
        ['it-cb', 114], ['it-at', 115], ['it-bs', 116], ['it-pn', 117],
        ['it-vi', 118], ['it-tv', 119]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/it/it-all.topo.json">Italy</a>'
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
