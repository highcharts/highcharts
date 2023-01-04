(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ug/ug-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ug-2595', 10], ['ug-7073', 11], ['ug-7074', 12], ['ug-7075', 13],
        ['ug-2785', 14], ['ug-2791', 15], ['ug-3385', 16], ['ug-3388', 17],
        ['ug-2786', 18], ['ug-7056', 19], ['ug-7083', 20], ['ug-7084', 21],
        ['ug-7058', 22], ['ug-1678', 23], ['ug-1682', 24], ['ug-1683', 25],
        ['ug-1685', 26], ['ug-7051', 27], ['ug-2762', 28], ['ug-2767', 29],
        ['ug-2777', 30], ['ug-2778', 31], ['ug-2780', 32], ['ug-2781', 33],
        ['ug-2782', 34], ['ug-2783', 35], ['ug-2779', 36], ['ug-2784', 37],
        ['ug-3382', 38], ['ug-3384', 39], ['ug-3389', 40], ['ug-3383', 41],
        ['ug-3390', 42], ['ug-3386', 43], ['ug-3391', 44], ['ug-3392', 45],
        ['ug-3394', 46], ['ug-2750', 47], ['ug-7048', 48], ['ug-7080', 49],
        ['ug-7081', 50], ['ug-1684', 51], ['ug-7082', 52], ['ug-1688', 53],
        ['ug-7079', 54], ['ug-7068', 55], ['ug-7070', 56], ['ug-7049', 57],
        ['ug-2787', 58], ['ug-7055', 59], ['ug-2769', 60], ['ug-7052', 61],
        ['ug-2774', 62], ['ug-7059', 63], ['ug-7060', 64], ['ug-7057', 65],
        ['ug-2790', 66], ['ug-2776', 67], ['ug-7067', 68], ['ug-7065', 69],
        ['ug-7066', 70], ['ug-7069', 71], ['ug-7061', 72], ['ug-7063', 73],
        ['ug-7062', 74], ['ug-7064', 75], ['ug-7086', 76], ['ug-2744', 77],
        ['ug-1679', 78], ['ug-1680', 79], ['ug-7054', 80], ['ug-1686', 81],
        ['ug-7078', 82], ['ug-1677', 83], ['ug-1690', 84], ['ug-2745', 85],
        ['ug-2752', 86], ['ug-2754', 87], ['ug-1687', 88], ['ug-2757', 89],
        ['ug-1689', 90], ['ug-2760', 91], ['ug-2761', 92], ['ug-2766', 93],
        ['ug-2765', 94], ['ug-2764', 95], ['ug-2749', 96], ['ug-2768', 97],
        ['ug-2763', 98], ['ug-2748', 99], ['ug-2771', 100], ['ug-2772', 101],
        ['ug-2775', 102], ['ug-2788', 103], ['ug-2789', 104], ['ug-3381', 105],
        ['ug-3387', 106], ['ug-3393', 107], ['ug-7076', 108], ['ug-1681', 109],
        ['ug-2746', 110], ['ug-2747', 111], ['ug-2751', 112], ['ug-2758', 113],
        ['ug-2759', 114], ['ug-2756', 115], ['ug-2770', 116], ['ug-7072', 117],
        ['ug-7053', 118], ['ug-2753', 119], ['ug-2755', 120], ['ug-2773', 121]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ug/ug-all.topo.json">Uganda</a>'
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
