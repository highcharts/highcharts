(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/fr/fr-all-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['fr-bre-mb', 10], ['fr-pdl-vd', 11], ['fr-occ-ad', 12],
        ['fr-pac-vc', 13], ['fr-ges-hm', 14], ['fr-ges-mr', 15],
        ['fr-hdf-no', 16], ['fr-occ-hp', 17], ['fr-cvl-in', 18],
        ['fr-naq-vn', 19], ['fr-naq-dd', 20], ['fr-naq-cm', 21],
        ['fr-pac-am', 22], ['fr-pac-vr', 23], ['fr-pac-ap', 24],
        ['fr-ara-ai', 25], ['fr-hdf-as', 26], ['fr-pac-bd', 27],
        ['fr-occ-av', 28], ['fr-occ-ga', 29], ['fr-ges-ab', 30],
        ['fr-bfc-co', 31], ['fr-bfc-sl', 32], ['fr-cvl-ch', 33],
        ['fr-naq-cr', 34], ['fr-pdl-ml', 35], ['fr-naq-ds', 36],
        ['fr-naq-ct', 37], ['fr-ara-dm', 38], ['fr-ara-ah', 39],
        ['fr-nor-eu', 40], ['fr-idf-es', 41], ['fr-cvl-el', 42],
        ['fr-occ-hg', 43], ['fr-idf-hd', 44], ['fr-naq-hv', 45],
        ['fr-pdl-st', 46], ['fr-cvl-il', 47], ['fr-ara-is', 48],
        ['fr-bfc-ju', 49], ['fr-bfc-hn', 50], ['fr-ara-lr', 51],
        ['fr-occ-tg', 52], ['fr-occ-lo', 53], ['fr-naq-lg', 54],
        ['fr-occ-lz', 55], ['fr-bre-iv', 56], ['fr-ges-mm', 57],
        ['fr-ges-ms', 58], ['fr-bfc-ni', 59], ['fr-naq-cz', 60],
        ['fr-ara-pd', 61], ['fr-occ-ge', 62], ['fr-naq-pa', 63],
        ['fr-ara-sv', 64], ['fr-idf-se', 65], ['fr-idf-vp', 66],
        ['fr-idf-ss', 67], ['fr-idf-vm', 68], ['fr-hdf-so', 69],
        ['fr-bfc-tb', 70], ['fr-bfc-db', 71], ['fr-idf-vo', 72],
        ['fr-ges-vg', 73], ['fr-idf-yv', 74], ['fr-cvl-lc', 75],
        ['fr-cor-cs', 76], ['fr-bre-fi', 77], ['fr-cor-hc', 78],
        ['fr-nor-mh', 79], ['fr-ges-an', 80], ['fr-occ-ag', 81],
        ['fr-ges-br', 82], ['fr-nor-cv', 83], ['fr-ara-cl', 84],
        ['fr-bre-ca', 85], ['fr-naq-gi', 86], ['fr-ges-hr', 87],
        ['fr-ara-hs', 88], ['fr-occ-he', 89], ['fr-naq-ld', 90],
        ['fr-pdl-la', 91], ['fr-ges-mo', 92], ['fr-nor-or', 93],
        ['fr-hdf-pc', 94], ['fr-occ-po', 95], ['fr-pdl-my', 96],
        ['fr-nor-sm', 97], ['fr-bfc-yo', 98], ['fr-ara-al', 99],
        ['fr-ara-hl', 100], ['fr-pac-ha', 101], ['fr-cvl-lt', 102],
        ['fr-hdf-oi', 103], ['fr-ara-rh', 104], ['fr-occ-ta', 105], [null, 106],
        ['fr-lre-re', 107], ['fr-may-yt', 108], ['fr-gf-gf', 109],
        ['fr-mq-mq', 110], ['fr-gua-gp', 111]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/fr/fr-all-all.topo.json">France, admin2</a>'
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
