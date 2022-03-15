(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/lv/lv-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['lv-an', 10], ['lv-jj', 11], ['lv-vc', 12], ['lv-r', 13],
        ['lv-me', 14], ['lv-jp', 15], ['lv-jk', 16], ['lv-sc', 17],
        ['lv-ko', 18], ['lv-ak', 19], ['lv-sr', 20], ['lv-og', 21],
        ['lv-pl', 22], ['lv-vt', 23], ['lv-je', 24], ['lv-oz', 25],
        ['lv-rd', 26], ['lv-vl', 27], ['lv-ba', 28], ['lv-zi', 29],
        ['lv-dd', 30], ['lv-lv', 31], ['lv-rb', 32], ['lv-kt', 33],
        ['lv-se', 34], ['lv-ad', 35], ['lv-cr', 36], ['lv-ga', 37],
        ['lv-in', 38], ['lv-br', 39], ['lv-ju', 40], ['lv-kg', 41],
        ['lv-bd', 42], ['lv-kk', 43], ['lv-ol', 44], ['lv-bb', 45],
        ['lv-ml', 46], ['lv-rp', 47], ['lv-ss', 48], ['lv-ik', 49],
        ['lv-su', 50], ['lv-sp', 51], ['lv-am', 52], ['lv-vm', 53],
        ['lv-be', 54], ['lv-er', 55], ['lv-vr', 56], ['lv-km', 57],
        ['lv-lg', 58], ['lv-bt', 59], ['lv-na', 60], ['lv-ce', 61],
        ['lv-pg', 62], ['lv-pu', 63], ['lv-vb', 64], ['lv-sm', 65],
        ['lv-lu', 66], ['lv-ci', 67], ['lv-l', 68], ['lv-vg', 69],
        ['lv-bu', 70], ['lv-dg', 71], ['lv-lm', 72], ['lv-gu', 73],
        ['lv-ma', 74], ['lv-bl', 75], ['lv-ta', 76], ['lv-jg', 77],
        ['lv-tu', 78], ['lv-jm', 79], ['lv-mr', 80], ['lv-lj', 81],
        ['lv-vs', 82], ['lv-kn', 83], ['lv-kd', 84], ['lv-au', 85],
        ['lv-az', 86], ['lv-pk', 87], ['lv-rc', 88], ['lv-gr', 89],
        ['lv-ni', 90], ['lv-as', 91], ['lv-pt', 92], ['lv-vn', 93],
        ['lv-ne', 94], ['lv-ka', 95], ['lv-ag', 96], ['lv-il', 97],
        ['lv-aj', 98], ['lv-en', 99], ['lv-sl', 100], ['lv-ap', 101],
        ['lv-si', 102], ['lv-ru', 103], ['lv-rn', 104], ['lv-kr', 105],
        ['lv-vi', 106], ['lv-sa', 107], ['lv-al', 108], ['lv-st', 109],
        ['lv-rj', 110], ['lv-do', 111], ['lv-vd', 112], ['lv-dn', 113],
        ['lv-rr', 114], ['lv-ll', 115], ['lv-ie', 116], ['lv-te', 117],
        ['lv-vv', 118], ['lv-pr', 119], ['lv-cv', 120], ['lv-ja', 121],
        ['lv-lb', 122], ['lv-mz', 123], ['lv-dv', 124], ['lv-rk', 125],
        ['lv-vx', 126], ['lv-sk', 127], ['lv-dr', 128]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/lv/lv-all.topo.json">Latvia</a>'
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
