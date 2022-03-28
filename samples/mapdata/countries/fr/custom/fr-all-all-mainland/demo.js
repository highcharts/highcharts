(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/fr/custom/fr-all-all-mainland.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['fr-bre-mb', 10], ['fr-pac-am', 11], ['fr-pac-vr', 12],
        ['fr-pdl-vd', 13], ['fr-ara-ai', 14], ['fr-occ-ad', 15],
        ['fr-pac-vc', 16], ['fr-occ-hg', 17], ['fr-ara-cl', 18],
        ['fr-occ-lz', 19], ['fr-ges-mm', 20], ['fr-hdf-no', 21],
        ['fr-occ-hp', 22], ['fr-naq-dd', 23], ['fr-naq-cm', 24],
        ['fr-pac-ap', 25], ['fr-hdf-as', 26], ['fr-occ-av', 27],
        ['fr-occ-ga', 28], ['fr-ges-ab', 29], ['fr-bfc-co', 30],
        ['fr-bfc-sl', 31], ['fr-cvl-ch', 32], ['fr-naq-cr', 33],
        ['fr-pdl-ml', 34], ['fr-naq-ds', 35], ['fr-naq-ct', 36],
        ['fr-ara-dm', 37], ['fr-ara-ah', 38], ['fr-nor-eu', 39],
        ['fr-idf-es', 40], ['fr-cvl-el', 41], ['fr-ara-hs', 42],
        ['fr-idf-hd', 43], ['fr-pdl-st', 44], ['fr-cvl-il', 45],
        ['fr-ara-is', 46], ['fr-bfc-ju', 47], ['fr-ara-lr', 48],
        ['fr-occ-lo', 49], ['fr-occ-tg', 50], ['fr-naq-lg', 51],
        ['fr-bre-iv', 52], ['fr-ges-ms', 53], ['fr-bfc-ni', 54],
        ['fr-cvl-lt', 55], ['fr-idf-vp', 56], ['fr-naq-cz', 57],
        ['fr-ara-pd', 58], ['fr-occ-ge', 59], ['fr-naq-pa', 60],
        ['fr-idf-se', 61], ['fr-idf-ss', 62], ['fr-hdf-so', 63],
        ['fr-bfc-tb', 64], ['fr-bfc-hn', 65], ['fr-idf-vo', 66],
        ['fr-idf-vm', 67], ['fr-naq-vn', 68], ['fr-ges-vg', 69],
        ['fr-idf-yv', 70], ['fr-pac-bd', 71], ['fr-cvl-lc', 72],
        ['fr-bre-fi', 73], ['fr-nor-mh', 74], ['fr-ges-an', 75],
        ['fr-occ-ag', 76], ['fr-ges-br', 77], ['fr-nor-cv', 78],
        ['fr-bre-ca', 79], ['fr-bfc-db', 80], ['fr-naq-gi', 81],
        ['fr-ges-hr', 82], ['fr-ara-hl', 83], ['fr-ges-hm', 84],
        ['fr-pac-ha', 85], ['fr-occ-he', 86], ['fr-naq-ld', 87],
        ['fr-pdl-la', 88], ['fr-ges-mr', 89], ['fr-pdl-my', 90],
        ['fr-ges-mo', 91], ['fr-nor-or', 92], ['fr-hdf-pc', 93],
        ['fr-occ-po', 94], ['fr-ara-al', 95], ['fr-ara-sv', 96],
        ['fr-nor-sm', 97], ['fr-naq-hv', 98], ['fr-cvl-in', 99],
        ['fr-hdf-oi', 100], ['fr-ara-rh', 101], ['fr-occ-ta', 102],
        ['fr-bfc-yo', 103], [null, 104]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/fr/custom/fr-all-all-mainland.topo.json">France, mainland admin2</a>'
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
