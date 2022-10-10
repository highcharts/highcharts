(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/historical/countries/fr-2015/custom/fr-all-all-mainland-2015.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['fr-e-mb', 10], ['fr-u-am', 11], ['fr-u-vr', 12], ['fr-r-vd', 13],
        ['fr-v-ai', 14], ['fr-k-ad', 15], ['fr-u-vc', 16], ['fr-n-hg', 17],
        ['fr-c-cl', 18], ['fr-k-lz', 19], ['fr-m-mm', 20], ['fr-o-no', 21],
        ['fr-n-hp', 22], ['fr-b-dd', 23], ['fr-t-cm', 24], ['fr-u-ap', 25],
        ['fr-s-as', 26], ['fr-n-av', 27], ['fr-k-ga', 28], ['fr-g-ab', 29],
        ['fr-d-co', 30], ['fr-d-sl', 31], ['fr-f-ch', 32], ['fr-l-cr', 33],
        ['fr-r-ml', 34], ['fr-t-ds', 35], ['fr-t-ct', 36], ['fr-v-dm', 37],
        ['fr-v-ah', 38], ['fr-q-eu', 39], ['fr-j-es', 40], ['fr-f-el', 41],
        ['fr-v-hs', 42], ['fr-j-hd', 43], ['fr-r-st', 44], ['fr-f-il', 45],
        ['fr-v-is', 46], ['fr-i-ju', 47], ['fr-v-lr', 48], ['fr-n-lo', 49],
        ['fr-n-tg', 50], ['fr-b-lg', 51], ['fr-e-iv', 52], ['fr-m-ms', 53],
        ['fr-d-ni', 54], ['fr-f-lt', 55], ['fr-j-vp', 56], ['fr-l-cz', 57],
        ['fr-c-pd', 58], ['fr-n-ge', 59], ['fr-b-pa', 60], ['fr-j-se', 61],
        ['fr-j-ss', 62], ['fr-s-so', 63], ['fr-i-tb', 64], ['fr-i-hn', 65],
        ['fr-j-vo', 66], ['fr-j-vm', 67], ['fr-t-vn', 68], ['fr-m-vg', 69],
        ['fr-j-yv', 70], ['fr-u-bd', 71], ['fr-f-lc', 72], ['fr-e-fi', 73],
        ['fr-p-mh', 74], ['fr-g-an', 75], ['fr-n-ag', 76], ['fr-a-br', 77],
        ['fr-p-cv', 78], ['fr-e-ca', 79], ['fr-i-db', 80], ['fr-b-gi', 81],
        ['fr-a-hr', 82], ['fr-c-hl', 83], ['fr-g-hm', 84], ['fr-u-ha', 85],
        ['fr-k-he', 86], ['fr-b-ld', 87], ['fr-r-la', 88], ['fr-g-mr', 89],
        ['fr-r-my', 90], ['fr-m-mo', 91], ['fr-p-or', 92], ['fr-o-pc', 93],
        ['fr-k-po', 94], ['fr-c-al', 95], ['fr-v-sv', 96], ['fr-q-sm', 97],
        ['fr-l-hv', 98], ['fr-f-in', 99], ['fr-s-oi', 100], ['fr-v-rh', 101],
        ['fr-n-ta', 102], ['fr-d-yo', 103], [null, 104]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/fr-2015/custom/fr-all-all-mainland-2015.topo.json">France, mainland admin2 (2015)</a>'
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
