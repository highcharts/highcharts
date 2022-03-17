(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ru/ru-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ru-3637', 10], ['ru-ck', 11], ['ru-ar', 12], ['ru-nn', 13],
        ['ru-yn', 14], ['ru-ky', 15], ['ru-sk', 16], ['ru-kh', 17],
        ['ru-sl', 18], ['ru-ka', 19], ['ru-kt', 20], ['ru-2510', 21],
        ['ru-rz', 22], ['ru-sa', 23], ['ru-ul', 24], ['ru-om', 25],
        ['ru-ns', 26], ['ru-mm', 27], ['ru-ln', 28], ['ru-sp', 29],
        ['ru-ki', 30], ['ru-kc', 31], ['ru-in', 32], ['ru-kb', 33],
        ['ru-no', 34], ['ru-st', 35], ['ru-sm', 36], ['ru-ps', 37],
        ['ru-tv', 38], ['ru-vo', 39], ['ru-iv', 40], ['ru-ys', 41],
        ['ru-kg', 42], ['ru-br', 43], ['ru-ks', 44], ['ru-lp', 45],
        ['ru-ms', 46], ['ru-ol', 47], ['ru-nz', 48], ['ru-pz', 49],
        ['ru-vl', 50], ['ru-vr', 51], ['ru-ko', 52], ['ru-sv', 53],
        ['ru-bk', 54], ['ru-ud', 55], ['ru-mr', 56], ['ru-cv', 57],
        ['ru-cl', 58], ['ru-ob', 59], ['ru-sr', 60], ['ru-tt', 61],
        ['ru-to', 62], ['ru-ty', 63], ['ru-ga', 64], ['ru-kk', 65],
        ['ru-cn', 66], ['ru-kl', 67], ['ru-da', 68], ['ru-ro', 69],
        ['ru-bl', 70], ['ru-tu', 71], ['ru-ir', 72], ['ru-ct', 73],
        ['ru-yv', 74], ['ru-am', 75], ['ru-tb', 76], ['ru-tl', 77],
        ['ru-ng', 78], ['ru-vg', 79], ['ru-kv', 80], ['ru-me', 81],
        ['ru-ke', 82], ['ru-as', 83], ['ru-pr', 84], ['ru-mg', 85],
        ['ru-bu', 86], ['ru-kn', 87], ['ru-kd', 88], ['ru-ku', 89],
        ['ru-al', 90], ['ru-km', 91], ['ru-pe', 92], ['ru-ad', 93]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ru/ru-all.topo.json">Russia</a>'
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
