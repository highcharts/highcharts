(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/tr/tr-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['tr-or', 10], ['tr-ss', 11], ['tr-ga', 12], ['tr-4409', 13],
        ['tr-kc', 14], ['tr-bk', 15], ['tr-ck', 16], ['tr-tt', 17],
        ['tr-gi', 18], ['tr-en', 19], ['tr-bg', 20], ['tr-ht', 21],
        ['tr-aa', 22], ['tr-cm', 23], ['tr-kk', 24], ['tr-ng', 25],
        ['tr-ak', 26], ['tr-kh', 27], ['tr-yz', 28], ['tr-am', 29],
        ['tr-ms', 30], ['tr-bm', 31], ['tr-ka', 32], ['tr-ig', 33],
        ['tr-du', 34], ['tr-zo', 35], ['tr-kb', 36], ['tr-yl', 37],
        ['tr-sk', 38], ['tr-ci', 39], ['tr-bl', 40], ['tr-ed', 41],
        ['tr-es', 42], ['tr-ko', 43], ['tr-bu', 44], ['tr-kl', 45],
        ['tr-ib', 46], ['tr-kr', 47], ['tr-al', 48], ['tr-af', 49],
        ['tr-bd', 50], ['tr-ip', 51], ['tr-ay', 52], ['tr-mn', 53],
        ['tr-dy', 54], ['tr-ad', 55], ['tr-km', 56], ['tr-ky', 57],
        ['tr-eg', 58], ['tr-ic', 59], ['tr-sp', 60], ['tr-av', 61],
        ['tr-ri', 62], ['tr-tb', 63], ['tr-an', 64], ['tr-su', 65],
        ['tr-bb', 66], ['tr-em', 67], ['tr-mr', 68], ['tr-sr', 69],
        ['tr-si', 70], ['tr-hk', 71], ['tr-va', 72], ['tr-ar', 73],
        ['tr-ki', 74], ['tr-br', 75], ['tr-tg', 76], ['tr-iz', 77],
        ['tr-ks', 78], ['tr-mg', 79], ['tr-ku', 80], ['tr-nv', 81],
        ['tr-sv', 82], ['tr-tc', 83], ['tr-ml', 84], ['tr-ag', 85],
        ['tr-bt', 86], ['tr-gu', 87], ['tr-os', 88], ['tr-bc', 89],
        ['tr-dn', 90], ['tr-us', 91]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/tr/tr-all.topo.json">Turkey</a>'
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
