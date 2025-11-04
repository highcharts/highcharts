(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ph/ph-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ph-mn', 10], ['ph-tt', 11], ['ph-bo', 12], ['ph-cb', 13],
        ['ph-bs', 14], ['ph-2603', 15], ['ph-su', 16], ['ph-aq', 17],
        ['ph-pl', 18], ['ph-ro', 19], ['ph-al', 20], ['ph-cs', 21],
        ['ph-6999', 22], ['ph-bn', 23], ['ph-cg', 24], ['ph-pn', 25],
        ['ph-bt', 26], ['ph-mc', 27], ['ph-qz', 28], ['ph-es', 29],
        ['ph-le', 30], ['ph-sm', 31], ['ph-ns', 32], ['ph-cm', 33],
        ['ph-di', 34], ['ph-ds', 35], ['ph-6457', 36], ['ph-6985', 37],
        ['ph-ii', 38], ['ph-7017', 39], ['ph-7021', 40], ['ph-lg', 41],
        ['ph-ri', 42], ['ph-ln', 43], ['ph-6991', 44], ['ph-ls', 45],
        ['ph-nc', 46], ['ph-mg', 47], ['ph-sk', 48], ['ph-sc', 49],
        ['ph-sg', 50], ['ph-an', 51], ['ph-ss', 52], ['ph-as', 53],
        ['ph-do', 54], ['ph-dv', 55], ['ph-bk', 56], ['ph-cl', 57],
        ['ph-6983', 58], ['ph-6984', 59], ['ph-6987', 60], ['ph-6986', 61],
        ['ph-6988', 62], ['ph-6989', 63], ['ph-6990', 64], ['ph-6992', 65],
        ['ph-6995', 66], ['ph-6996', 67], ['ph-6997', 68], ['ph-6998', 69],
        ['ph-nv', 70], ['ph-7020', 71], ['ph-7018', 72], ['ph-7022', 73],
        ['ph-1852', 74], ['ph-7000', 75], ['ph-7001', 76], ['ph-7002', 77],
        ['ph-7003', 78], ['ph-7004', 79], ['ph-7006', 80], ['ph-7007', 81],
        ['ph-7008', 82], ['ph-7009', 83], ['ph-7010', 84], ['ph-7011', 85],
        ['ph-7012', 86], ['ph-7013', 87], ['ph-7014', 88], ['ph-7015', 89],
        ['ph-7016', 90], ['ph-7019', 91], ['ph-6456', 92], ['ph-zs', 93],
        ['ph-nd', 94], ['ph-zn', 95], ['ph-md', 96], ['ph-ab', 97],
        ['ph-2658', 98], ['ph-ap', 99], ['ph-au', 100], ['ph-ib', 101],
        ['ph-if', 102], ['ph-mt', 103], ['ph-qr', 104], ['ph-ne', 105],
        ['ph-pm', 106], ['ph-ba', 107], ['ph-bg', 108], ['ph-zm', 109],
        ['ph-cv', 110], ['ph-bu', 111], ['ph-mr', 112], ['ph-sq', 113],
        ['ph-gu', 114], ['ph-ct', 115], ['ph-mb', 116], ['ph-mq', 117],
        ['ph-bi', 118], ['ph-sl', 119], ['ph-nr', 120], ['ph-ak', 121],
        ['ph-cp', 122], ['ph-cn', 123], ['ph-sr', 124], ['ph-in', 125],
        ['ph-is', 126], ['ph-tr', 127], ['ph-lu', 128]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ph/ph-all.topo.json">Philippines</a>'
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
