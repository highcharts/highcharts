// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-pa-015', 0],
    ['us-pa-117', 1],
    ['us-pa-027', 2],
    ['us-pa-035', 3],
    ['us-pa-061', 4],
    ['us-pa-009', 5],
    ['us-pa-075', 6],
    ['us-pa-029', 7],
    ['us-pa-011', 8],
    ['us-pa-083', 9],
    ['us-pa-047', 10],
    ['us-pa-005', 11],
    ['us-pa-019', 12],
    ['us-pa-007', 13],
    ['us-pa-067', 14],
    ['us-pa-099', 15],
    ['us-pa-053', 16],
    ['us-pa-123', 17],
    ['us-pa-121', 18],
    ['us-pa-033', 19],
    ['us-pa-063', 20],
    ['us-pa-107', 21],
    ['us-pa-079', 22],
    ['us-pa-055', 23],
    ['us-pa-001', 24],
    ['us-pa-089', 25],
    ['us-pa-069', 26],
    ['us-pa-093', 27],
    ['us-pa-081', 28],
    ['us-pa-095', 29],
    ['us-pa-025', 30],
    ['us-pa-065', 31],
    ['us-pa-003', 32],
    ['us-pa-129', 33],
    ['us-pa-021', 34],
    ['us-pa-013', 35],
    ['us-pa-039', 36],
    ['us-pa-023', 37],
    ['us-pa-097', 38],
    ['us-pa-043', 39],
    ['us-pa-077', 40],
    ['us-pa-091', 41],
    ['us-pa-131', 42],
    ['us-pa-113', 43],
    ['us-pa-037', 44],
    ['us-pa-045', 45],
    ['us-pa-119', 46],
    ['us-pa-087', 47],
    ['us-pa-031', 48],
    ['us-pa-085', 49],
    ['us-pa-071', 50],
    ['us-pa-049', 51],
    ['us-pa-041', 52],
    ['us-pa-127', 53],
    ['us-pa-017', 54],
    ['us-pa-059', 55],
    ['us-pa-051', 56],
    ['us-pa-101', 57],
    ['us-pa-103', 58],
    ['us-pa-115', 59],
    ['us-pa-125', 60],
    ['us-pa-105', 61],
    ['us-pa-109', 62],
    ['us-pa-111', 63],
    ['us-pa-057', 64],
    ['us-pa-073', 65],
    ['us-pa-133', 66]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-pa-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-pa-all.js">Pennsylvania</a>'
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
