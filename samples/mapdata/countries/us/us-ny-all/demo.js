// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-ny-009', 0],
    ['us-ny-013', 1],
    ['us-ny-103', 2],
    ['us-ny-045', 3],
    ['us-ny-029', 4],
    ['us-ny-121', 5],
    ['us-ny-073', 6],
    ['us-ny-055', 7],
    ['us-ny-089', 8],
    ['us-ny-059', 9],
    ['us-ny-081', 10],
    ['us-ny-091', 11],
    ['us-ny-001', 12],
    ['us-ny-063', 13],
    ['us-ny-031', 14],
    ['us-ny-035', 15],
    ['us-ny-043', 16],
    ['us-ny-087', 17],
    ['us-ny-119', 18],
    ['us-ny-071', 19],
    ['us-ny-037', 20],
    ['us-ny-053', 21],
    ['us-ny-005', 22],
    ['us-ny-061', 23],
    ['us-ny-047', 24],
    ['us-ny-057', 25],
    ['us-ny-077', 26],
    ['us-ny-065', 27],
    ['us-ny-115', 28],
    ['us-ny-117', 29],
    ['us-ny-003', 30],
    ['us-ny-051', 31],
    ['us-ny-017', 32],
    ['us-ny-025', 33],
    ['us-ny-095', 34],
    ['us-ny-111', 35],
    ['us-ny-021', 36],
    ['us-ny-101', 37],
    ['us-ny-069', 38],
    ['us-ny-015', 39],
    ['us-ny-109', 40],
    ['us-ny-023', 41],
    ['us-ny-011', 42],
    ['us-ny-075', 43],
    ['us-ny-079', 44],
    ['us-ny-049', 45],
    ['us-ny-099', 46],
    ['us-ny-041', 47],
    ['us-ny-019', 48],
    ['us-ny-083', 49],
    ['us-ny-039', 50],
    ['us-ny-027', 51],
    ['us-ny-085', 52],
    ['us-ny-097', 53],
    ['us-ny-105', 54],
    ['us-ny-113', 55],
    ['us-ny-007', 56],
    ['us-ny-093', 57],
    ['us-ny-107', 58],
    ['us-ny-033', 59],
    ['us-ny-067', 60],
    ['us-ny-123', 61]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-ny-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-ny-all.js">New York</a>'
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
