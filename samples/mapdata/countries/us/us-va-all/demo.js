(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-va-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-sd-51800', 10], ['us-sd-51770', 11], ['us-sd-51730', 12],
        ['us-sd-51570', 13], ['us-sd-51685', 14], ['us-sd-51510', 15],
        ['us-sd-51610', 16], ['us-sd-51820', 17], ['us-sd-51680', 18],
        ['us-sd-51810', 19], ['us-sd-51550', 20], ['us-sd-51710', 21],
        ['us-sd-51740', 22], ['us-sd-51830', 23], ['us-sd-51530', 24],
        ['us-sd-51660', 25], ['us-sd-51678', 26], ['us-sd-51683', 27],
        ['us-sd-51600', 28], ['us-sd-51595', 29], ['us-sd-51840', 30],
        ['us-sd-51107', 31], ['us-sd-51059', 32], ['us-sd-51013', 33],
        ['us-sd-51153', 34], ['us-sd-51133', 35], ['us-sd-51179', 36],
        ['us-sd-51099', 37], ['us-sd-51001', 38], ['us-sd-51043', 39],
        ['us-sd-51061', 40], ['us-sd-51069', 41], ['us-sd-51630', 42],
        ['us-sd-51109', 43], ['us-sd-51137', 44], ['us-sd-51177', 45],
        ['us-sd-51187', 46], ['us-sd-51105', 47], ['us-sd-51540', 48],
        ['us-sd-51005', 49], ['us-sd-51009', 50], ['us-sd-51017', 51],
        ['us-sd-51019', 52], ['us-sd-51021', 53], ['us-sd-51023', 54],
        ['us-sd-51027', 55], ['us-sd-51031', 56], ['us-sd-51035', 57],
        ['us-sd-51045', 58], ['us-sd-51051', 59], ['us-sd-51063', 60],
        ['us-sd-51067', 61], ['us-sd-51071', 62], ['us-sd-51077', 63],
        ['us-sd-51083', 64], ['us-sd-51089', 65], ['us-sd-51121', 66],
        ['us-sd-51141', 67], ['us-sd-51143', 68], ['us-sd-51155', 69],
        ['us-sd-51161', 70], ['us-sd-51163', 71], ['us-sd-51167', 72],
        ['us-sd-51169', 73], ['us-sd-51173', 74], ['us-sd-51185', 75],
        ['us-sd-51191', 76], ['us-sd-51195', 77], ['us-sd-51197', 78],
        ['us-sd-51003', 79], ['us-sd-51007', 80], ['us-sd-51011', 81],
        ['us-sd-51015', 82], ['us-sd-51025', 83], ['us-sd-51029', 84],
        ['us-sd-51033', 85], ['us-sd-51036', 86], ['us-sd-51037', 87],
        ['us-sd-51041', 88], ['us-sd-51047', 89], ['us-sd-51049', 90],
        ['us-sd-51053', 91], ['us-sd-51057', 92], ['us-sd-51065', 93],
        ['us-sd-51073', 94], ['us-sd-51075', 95], ['us-sd-51079', 96],
        ['us-sd-51081', 97], ['us-sd-51085', 98], ['us-sd-51091', 99],
        ['us-sd-51093', 100], ['us-sd-51095', 101], ['us-sd-51097', 102],
        ['us-sd-51103', 103], ['us-sd-51111', 104], ['us-sd-51113', 105],
        ['us-sd-51115', 106], ['us-sd-51117', 107], ['us-sd-51119', 108],
        ['us-sd-51125', 109], ['us-sd-51127', 110], ['us-sd-51131', 111],
        ['us-sd-51135', 112], ['us-sd-51139', 113], ['us-sd-51145', 114],
        ['us-sd-51147', 115], ['us-sd-51149', 116], ['us-sd-51157', 117],
        ['us-sd-51159', 118], ['us-sd-51165', 119], ['us-sd-51171', 120],
        ['us-sd-51175', 121], ['us-sd-51181', 122], ['us-sd-51183', 123],
        ['us-sd-51193', 124], ['us-sd-51087', 125], ['us-sd-51101', 126],
        ['us-sd-51790', 127], ['us-sd-51750', 128], ['us-sd-51520', 129],
        ['us-sd-51640', 130], ['us-sd-51590', 131], ['us-sd-51620', 132],
        ['us-sd-51650', 133], ['us-sd-51700', 134], ['us-sd-51735', 135],
        ['us-sd-51199', 136], ['us-sd-51760', 137], ['us-sd-51580', 138],
        ['us-sd-51690', 139], ['us-sd-51720', 140], ['us-sd-51670', 141],
        ['us-sd-51775', 142]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-va-all.topo.json">Virginia</a>'
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
