(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ph/ph-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ph-mn', 10], ['ph-4218', 11], ['ph-tt', 12], ['ph-bo', 13],
        ['ph-cb', 14], ['ph-bs', 15], ['ph-2603', 16], ['ph-su', 17],
        ['ph-aq', 18], ['ph-pl', 19], ['ph-ro', 20], ['ph-al', 21],
        ['ph-cs', 22], ['ph-6999', 23], ['ph-bn', 24], ['ph-cg', 25],
        ['ph-pn', 26], ['ph-bt', 27], ['ph-mc', 28], ['ph-qz', 29],
        ['ph-es', 30], ['ph-le', 31], ['ph-sm', 32], ['ph-ns', 33],
        ['ph-cm', 34], ['ph-di', 35], ['ph-ds', 36], ['ph-6457', 37],
        ['ph-6985', 38], ['ph-ii', 39], ['ph-7017', 40], ['ph-7021', 41],
        ['ph-lg', 42], ['ph-ri', 43], ['ph-ln', 44], ['ph-6991', 45],
        ['ph-ls', 46], ['ph-nc', 47], ['ph-mg', 48], ['ph-sk', 49],
        ['ph-sc', 50], ['ph-sg', 51], ['ph-an', 52], ['ph-ss', 53],
        ['ph-as', 54], ['ph-do', 55], ['ph-dv', 56], ['ph-bk', 57],
        ['ph-cl', 58], ['ph-6983', 59], ['ph-6984', 60], ['ph-6987', 61],
        ['ph-6986', 62], ['ph-6988', 63], ['ph-6989', 64], ['ph-6990', 65],
        ['ph-6992', 66], ['ph-6995', 67], ['ph-6996', 68], ['ph-6997', 69],
        ['ph-6998', 70], ['ph-nv', 71], ['ph-7020', 72], ['ph-7018', 73],
        ['ph-7022', 74], ['ph-1852', 75], ['ph-7000', 76], ['ph-7001', 77],
        ['ph-7002', 78], ['ph-7003', 79], ['ph-7004', 80], ['ph-7006', 81],
        ['ph-7007', 82], ['ph-7008', 83], ['ph-7009', 84], ['ph-7010', 85],
        ['ph-7011', 86], ['ph-7012', 87], ['ph-7013', 88], ['ph-7014', 89],
        ['ph-7015', 90], ['ph-7016', 91], ['ph-7019', 92], ['ph-6456', 93],
        ['ph-zs', 94], ['ph-nd', 95], ['ph-zn', 96], ['ph-md', 97],
        ['ph-ab', 98], ['ph-2658', 99], ['ph-ap', 100], ['ph-au', 101],
        ['ph-ib', 102], ['ph-if', 103], ['ph-mt', 104], ['ph-qr', 105],
        ['ph-ne', 106], ['ph-pm', 107], ['ph-ba', 108], ['ph-bg', 109],
        ['ph-zm', 110], ['ph-cv', 111], ['ph-bu', 112], ['ph-mr', 113],
        ['ph-sq', 114], ['ph-gu', 115], ['ph-ct', 116], ['ph-mb', 117],
        ['ph-mq', 118], ['ph-bi', 119], ['ph-sl', 120], ['ph-nr', 121],
        ['ph-ak', 122], ['ph-cp', 123], ['ph-cn', 124], ['ph-sr', 125],
        ['ph-in', 126], ['ph-is', 127], ['ph-tr', 128], ['ph-lu', 129]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ph/ph-all.topo.json">Philippines</a>'
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
