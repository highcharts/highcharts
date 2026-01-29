(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-sd-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-sd-46053', 10], ['us-sd-46102', 11], ['us-sd-46007', 12],
        ['us-sd-46123', 13], ['us-sd-46009', 14], ['us-sd-46121', 15],
        ['us-sd-46135', 16], ['us-sd-46127', 17], ['us-sd-46023', 18],
        ['us-sd-46027', 19], ['us-sd-46047', 20], ['us-sd-46003', 21],
        ['us-sd-46005', 22], ['us-sd-46011', 23], ['us-sd-46013', 24],
        ['us-sd-46015', 25], ['us-sd-46017', 26], ['us-sd-46019', 27],
        ['us-sd-46021', 28], ['us-sd-46025', 29], ['us-sd-46029', 30],
        ['us-sd-46031', 31], ['us-sd-46033', 32], ['us-sd-46035', 33],
        ['us-sd-46037', 34], ['us-sd-46039', 35], ['us-sd-46041', 36],
        ['us-sd-46043', 37], ['us-sd-46045', 38], ['us-sd-46049', 39],
        ['us-sd-46051', 40], ['us-sd-46055', 41], ['us-sd-46057', 42],
        ['us-sd-46059', 43], ['us-sd-46061', 44], ['us-sd-46063', 45],
        ['us-sd-46065', 46], ['us-sd-46067', 47], ['us-sd-46069', 48],
        ['us-sd-46071', 49], ['us-sd-46073', 50], ['us-sd-46075', 51],
        ['us-sd-46077', 52], ['us-sd-46079', 53], ['us-sd-46081', 54],
        ['us-sd-46083', 55], ['us-sd-46085', 56], ['us-sd-46091', 57],
        ['us-sd-46087', 58], ['us-sd-46089', 59], ['us-sd-46093', 60],
        ['us-sd-46095', 61], ['us-sd-46097', 62], ['us-sd-46099', 63],
        ['us-sd-46101', 64], ['us-sd-46103', 65], ['us-sd-46105', 66],
        ['us-sd-46107', 67], ['us-sd-46109', 68], ['us-sd-46111', 69],
        ['us-sd-46115', 70], ['us-sd-46117', 71], ['us-sd-46119', 72],
        ['us-sd-46125', 73], ['us-sd-46129', 74], ['us-sd-46137', 75]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-sd-all.topo.json">South Dakota</a>'
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
