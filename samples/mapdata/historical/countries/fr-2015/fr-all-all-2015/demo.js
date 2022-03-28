(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/historical/countries/fr-2015/fr-all-all-2015.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['fr-e-mb', 10], ['fr-r-vd', 11], ['fr-k-ad', 12], ['fr-u-vc', 13],
        ['fr-g-hm', 14], ['fr-g-mr', 15], ['fr-o-no', 16], ['fr-n-hp', 17],
        ['fr-f-in', 18], ['fr-t-vn', 19], ['fr-b-dd', 20], ['fr-t-cm', 21],
        ['fr-u-am', 22], ['fr-u-vr', 23], ['fr-u-ap', 24], ['fr-v-ai', 25],
        ['fr-s-as', 26], ['fr-u-bd', 27], ['fr-n-av', 28], ['fr-k-ga', 29],
        ['fr-g-ab', 30], ['fr-d-co', 31], ['fr-d-sl', 32], ['fr-f-ch', 33],
        ['fr-l-cr', 34], ['fr-r-ml', 35], ['fr-t-ds', 36], ['fr-t-ct', 37],
        ['fr-v-dm', 38], ['fr-v-ah', 39], ['fr-q-eu', 40], ['fr-j-es', 41],
        ['fr-f-el', 42], ['fr-n-hg', 43], ['fr-j-hd', 44], ['fr-l-hv', 45],
        ['fr-r-st', 46], ['fr-f-il', 47], ['fr-v-is', 48], ['fr-i-ju', 49],
        ['fr-i-hn', 50], ['fr-v-lr', 51], ['fr-n-tg', 52], ['fr-n-lo', 53],
        ['fr-b-lg', 54], ['fr-k-lz', 55], ['fr-e-iv', 56], ['fr-m-mm', 57],
        ['fr-m-ms', 58], ['fr-d-ni', 59], ['fr-l-cz', 60], ['fr-c-pd', 61],
        ['fr-n-ge', 62], ['fr-b-pa', 63], ['fr-v-sv', 64], ['fr-j-se', 65],
        ['fr-j-vp', 66], ['fr-j-ss', 67], ['fr-j-vm', 68], ['fr-s-so', 69],
        ['fr-i-tb', 70], ['fr-i-db', 71], ['fr-j-vo', 72], ['fr-m-vg', 73],
        ['fr-j-yv', 74], ['fr-f-lc', 75], ['fr-h-cs', 76], ['fr-e-fi', 77],
        ['fr-h-hc', 78], ['fr-p-mh', 79], ['fr-g-an', 80], ['fr-n-ag', 81],
        ['fr-a-br', 82], ['fr-p-cv', 83], ['fr-c-cl', 84], ['fr-e-ca', 85],
        ['fr-b-gi', 86], ['fr-a-hr', 87], ['fr-v-hs', 88], ['fr-k-he', 89],
        ['fr-b-ld', 90], ['fr-r-la', 91], ['fr-m-mo', 92], ['fr-p-or', 93],
        ['fr-o-pc', 94], ['fr-k-po', 95], ['fr-r-my', 96], ['fr-q-sm', 97],
        ['fr-d-yo', 98], ['fr-c-al', 99], ['fr-c-hl', 100], ['fr-u-ha', 101],
        ['fr-f-lt', 102], ['fr-s-oi', 103], ['fr-v-rh', 104], ['fr-n-ta', 105],
        [null, 106], ['fr-re-re', 107], ['fr-yt-yt', 108], ['fr-gf-gf', 109],
        ['fr-mq-mq', 110], ['fr-gp-gp', 111]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/fr-2015/fr-all-all-2015.topo.json">France, admin2 (2015)</a>'
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
