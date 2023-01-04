(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ru/custom/ru-all-disputed.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ru-sc', 10], ['ru-kr', 11], ['ru-2485', 12], ['ru-ar', 13],
        ['ru-nn', 14], ['ru-yn', 15], ['ru-ky', 16], ['ru-ck', 17],
        ['ru-kh', 18], ['ru-sl', 19], ['ru-ka', 20], ['ru-kt', 21],
        ['ru-ms', 22], ['ru-rz', 23], ['ru-sa', 24], ['ru-ul', 25],
        ['ru-om', 26], ['ru-ns', 27], ['ru-mm', 28], ['ru-ln', 29],
        ['ru-sp', 30], ['ru-ki', 31], ['ru-kc', 32], ['ru-in', 33],
        ['ru-kb', 34], ['ru-no', 35], ['ru-st', 36], ['ru-sm', 37],
        ['ru-ps', 38], ['ru-tv', 39], ['ru-vo', 40], ['ru-iv', 41],
        ['ru-ys', 42], ['ru-kg', 43], ['ru-br', 44], ['ru-ks', 45],
        ['ru-lp', 46], ['ru-2509', 47], ['ru-ol', 48], ['ru-nz', 49],
        ['ru-pz', 50], ['ru-vl', 51], ['ru-vr', 52], ['ru-ko', 53],
        ['ru-sv', 54], ['ru-bk', 55], ['ru-ud', 56], ['ru-mr', 57],
        ['ru-cv', 58], ['ru-cl', 59], ['ru-ob', 60], ['ru-sr', 61],
        ['ru-tt', 62], ['ru-to', 63], ['ru-ty', 64], ['ru-ga', 65],
        ['ru-kk', 66], ['ru-cn', 67], ['ru-kl', 68], ['ru-da', 69],
        ['ru-ro', 70], ['ru-bl', 71], ['ru-tu', 72], ['ru-ir', 73],
        ['ru-ct', 74], ['ru-yv', 75], ['ru-am', 76], ['ru-tb', 77],
        ['ru-tl', 78], ['ru-ng', 79], ['ru-vg', 80], ['ru-kv', 81],
        ['ru-me', 82], ['ru-ke', 83], ['ru-as', 84], ['ru-pr', 85],
        ['ru-mg', 86], ['ru-bu', 87], ['ru-kn', 88], ['ru-kd', 89],
        ['ru-ku', 90], ['ru-al', 91], ['ru-km', 92], ['ru-pe', 93],
        ['ru-ad', 94]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ru/custom/ru-all-disputed.topo.json">Russia with disputed territories</a>'
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
