(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/nl/nl-nb-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['nl-3558-gm1655', 10], ['nl-3558-gm1685', 11], ['nl-3558-gm0815', 12],
        ['nl-3558-gm0879', 13], ['nl-3558-gm0840', 14], ['nl-3558-gm0744', 15],
        ['nl-3558-gm1723', 16], ['nl-3558-gm0851', 17], ['nl-3558-gm1674', 18],
        ['nl-3558-gm0748', 19], ['nl-3558-gm1658', 20], ['nl-3558-gm1719', 21],
        ['nl-3558-gm1709', 22], ['nl-3558-gm0784', 23], ['nl-3558-gm0758', 24],
        ['nl-3558-gm0873', 25], ['nl-3558-gm0772', 26], ['nl-3558-gm0766', 27],
        ['nl-3558-gm0855', 28], ['nl-3558-gm0809', 29], ['nl-3558-gm0779', 30],
        ['nl-3558-gm1684', 31], ['nl-3558-gm1702', 32], ['nl-3558-gm0785', 33],
        ['nl-3558-gm0797', 34], ['nl-3558-gm0796', 35], ['nl-3558-gm0865', 36],
        ['nl-3558-gm1667', 37], ['nl-3558-gm0798', 38], ['nl-3558-gm0770', 39],
        ['nl-3558-gm0823', 40], ['nl-3558-gm1728', 41], ['nl-3558-gm1771', 42],
        ['nl-3558-gm0820', 43], ['nl-3558-gm0824', 44], ['nl-3558-gm0846', 45],
        ['nl-3558-gm0845', 46], ['nl-3558-gm0777', 47], ['nl-3558-gm0794', 48],
        ['nl-3558-gm1652', 49], ['nl-3558-gm0860', 50], ['nl-3558-gm0847', 51],
        ['nl-3558-gm1659', 52], ['nl-3558-gm0743', 53], ['nl-3558-gm0856', 54],
        ['nl-3558-gm0757', 55], ['nl-3558-gm0861', 56], ['nl-3558-gm1724', 57],
        ['nl-3558-gm0866', 58], ['nl-3558-gm0867', 59], ['nl-3558-gm0874', 60],
        ['nl-3558-gm0870', 61], ['nl-3558-gm0738', 62], ['nl-3558-gm0828', 63],
        ['nl-3558-gm1671', 64], ['nl-3558-gm1721', 65], ['nl-3558-gm1706', 66],
        ['nl-3558-gm0755', 67], ['nl-3558-gm0858', 68], ['nl-3558-gm0762', 69],
        ['nl-3558-gm0756', 70], ['nl-3558-gm0844', 71], ['nl-3558-gm0826', 72],
        ['nl-3558-gm0753', 73], ['nl-3558-gm0848', 74], ['nl-3558-gm0788', 75],
        ['nl-3558-gm0786', 76]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/nl/nl-nb-all.topo.json">Noord-Brabant</a>'
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
