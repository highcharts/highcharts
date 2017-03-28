// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-la-087', 0],
    ['us-la-105', 1],
    ['us-la-051', 2],
    ['us-la-013', 3],
    ['us-la-069', 4],
    ['us-la-047', 5],
    ['us-la-077', 6],
    ['us-la-109', 7],
    ['us-la-115', 8],
    ['us-la-079', 9],
    ['us-la-019', 10],
    ['us-la-023', 11],
    ['us-la-007', 12],
    ['us-la-057', 13],
    ['us-la-035', 14],
    ['us-la-083', 15],
    ['us-la-103', 16],
    ['us-la-121', 17],
    ['us-la-125', 18],
    ['us-la-003', 19],
    ['us-la-089', 20],
    ['us-la-061', 21],
    ['us-la-073', 22],
    ['us-la-101', 23],
    ['us-la-037', 24],
    ['us-la-095', 25],
    ['us-la-113', 26],
    ['us-la-075', 27],
    ['us-la-045', 28],
    ['us-la-033', 29],
    ['us-la-029', 30],
    ['us-la-017', 31],
    ['us-la-081', 32],
    ['us-la-015', 33],
    ['us-la-031', 34],
    ['us-la-065', 35],
    ['us-la-107', 36],
    ['us-la-021', 37],
    ['us-la-049', 38],
    ['us-la-039', 39],
    ['us-la-071', 40],
    ['us-la-099', 41],
    ['us-la-059', 42],
    ['us-la-009', 43],
    ['us-la-053', 44],
    ['us-la-011', 45],
    ['us-la-055', 46],
    ['us-la-027', 47],
    ['us-la-025', 48],
    ['us-la-117', 49],
    ['us-la-067', 50],
    ['us-la-091', 51],
    ['us-la-041', 52],
    ['us-la-123', 53],
    ['us-la-093', 54],
    ['us-la-005', 55],
    ['us-la-063', 56],
    ['us-la-111', 57],
    ['us-la-127', 58],
    ['us-la-043', 59],
    ['us-la-119', 60],
    ['us-la-085', 61],
    ['us-la-001', 62],
    ['us-la-097', 63]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-la-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-la-all.js">Louisiana</a>'
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
