// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['nl-3558-gm1655', 0],
    ['nl-3558-gm1685', 1],
    ['nl-3558-gm0815', 2],
    ['nl-3558-gm0879', 3],
    ['nl-3558-gm0840', 4],
    ['nl-3558-gm0744', 5],
    ['nl-3558-gm1723', 6],
    ['nl-3558-gm0851', 7],
    ['nl-3558-gm1674', 8],
    ['nl-3558-gm0748', 9],
    ['nl-3558-gm1658', 10],
    ['nl-3558-gm1719', 11],
    ['nl-3558-gm1709', 12],
    ['nl-3558-gm0784', 13],
    ['nl-3558-gm0758', 14],
    ['nl-3558-gm0873', 15],
    ['nl-3558-gm0772', 16],
    ['nl-3558-gm0766', 17],
    ['nl-3558-gm0855', 18],
    ['nl-3558-gm0809', 19],
    ['nl-3558-gm0779', 20],
    ['nl-3558-gm1684', 21],
    ['nl-3558-gm1702', 22],
    ['nl-3558-gm0785', 23],
    ['nl-3558-gm0797', 24],
    ['nl-3558-gm0796', 25],
    ['nl-3558-gm0865', 26],
    ['nl-3558-gm1667', 27],
    ['nl-3558-gm0798', 28],
    ['nl-3558-gm0770', 29],
    ['nl-3558-gm0823', 30],
    ['nl-3558-gm1728', 31],
    ['nl-3558-gm1771', 32],
    ['nl-3558-gm0820', 33],
    ['nl-3558-gm0824', 34],
    ['nl-3558-gm0846', 35],
    ['nl-3558-gm0845', 36],
    ['nl-3558-gm0777', 37],
    ['nl-3558-gm0794', 38],
    ['nl-3558-gm1652', 39],
    ['nl-3558-gm0860', 40],
    ['nl-3558-gm0847', 41],
    ['nl-3558-gm1659', 42],
    ['nl-3558-gm0743', 43],
    ['nl-3558-gm0856', 44],
    ['nl-3558-gm0757', 45],
    ['nl-3558-gm0861', 46],
    ['nl-3558-gm1724', 47],
    ['nl-3558-gm0866', 48],
    ['nl-3558-gm0867', 49],
    ['nl-3558-gm0874', 50],
    ['nl-3558-gm0870', 51],
    ['nl-3558-gm0738', 52],
    ['nl-3558-gm0828', 53],
    ['nl-3558-gm1671', 54],
    ['nl-3558-gm1721', 55],
    ['nl-3558-gm1706', 56],
    ['nl-3558-gm0755', 57],
    ['nl-3558-gm0858', 58],
    ['nl-3558-gm0762', 59],
    ['nl-3558-gm0756', 60],
    ['nl-3558-gm0844', 61],
    ['nl-3558-gm0826', 62],
    ['nl-3558-gm0753', 63],
    ['nl-3558-gm0848', 64],
    ['nl-3558-gm0788', 65],
    ['nl-3558-gm0786', 66]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/nl/nl-nb-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/nl/nl-nb-all.js">Noord-Brabant</a>'
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
