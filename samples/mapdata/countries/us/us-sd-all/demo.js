// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-sd-129', 0],
    ['us-sd-041', 1],
    ['us-sd-067', 2],
    ['us-sd-043', 3],
    ['us-sd-045', 4],
    ['us-sd-107', 5],
    ['us-sd-061', 6],
    ['us-sd-097', 7],
    ['us-sd-087', 8],
    ['us-sd-079', 9],
    ['us-sd-099', 10],
    ['us-sd-051', 11],
    ['us-sd-039', 12],
    ['us-sd-103', 13],
    ['us-sd-025', 14],
    ['us-sd-005', 15],
    ['us-sd-011', 16],
    ['us-sd-057', 17],
    ['us-sd-109', 18],
    ['us-sd-037', 19],
    ['us-sd-015', 20],
    ['us-sd-023', 21],
    ['us-sd-059', 22],
    ['us-sd-115', 23],
    ['us-sd-085', 24],
    ['us-sd-053', 25],
    ['us-sd-105', 26],
    ['us-sd-063', 27],
    ['us-sd-019', 28],
    ['us-sd-137', 29],
    ['us-sd-055', 30],
    ['us-sd-031', 31],
    ['us-sd-069', 32],
    ['us-sd-093', 33],
    ['us-sd-089', 34],
    ['us-sd-073', 35],
    ['us-sd-013', 36],
    ['us-sd-049', 37],
    ['us-sd-077', 38],
    ['us-sd-111', 39],
    ['us-sd-003', 40],
    ['us-sd-021', 41],
    ['us-sd-117', 42],
    ['us-sd-119', 43],
    ['us-sd-027', 44],
    ['us-sd-017', 45],
    ['us-sd-071', 46],
    ['us-sd-127', 47],
    ['us-sd-081', 48],
    ['us-sd-029', 49],
    ['us-sd-033', 50],
    ['us-sd-007', 51],
    ['us-sd-035', 52],
    ['us-sd-009', 53],
    ['us-sd-101', 54],
    ['us-sd-125', 55],
    ['us-sd-135', 56],
    ['us-sd-121', 57],
    ['us-sd-095', 58],
    ['us-sd-123', 59],
    ['us-sd-083', 60],
    ['us-sd-091', 61],
    ['us-sd-047', 62],
    ['us-sd-113', 63],
    ['us-sd-065', 64],
    ['us-sd-075', 65]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-sd-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-sd-all.js">South Dakota</a>'
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
