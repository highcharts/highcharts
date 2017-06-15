// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-co-069', 0],
    ['us-co-013', 1],
    ['us-co-014', 2],
    ['us-co-025', 3],
    ['us-co-101', 4],
    ['us-co-041', 5],
    ['us-co-063', 6],
    ['us-co-073', 7],
    ['us-co-109', 8],
    ['us-co-003', 9],
    ['us-co-059', 10],
    ['us-co-015', 11],
    ['us-co-043', 12],
    ['us-co-005', 13],
    ['us-co-031', 14],
    ['us-co-045', 15],
    ['us-co-123', 16],
    ['us-co-075', 17],
    ['us-co-115', 18],
    ['us-co-011', 19],
    ['us-co-053', 20],
    ['us-co-091', 21],
    ['us-co-113', 22],
    ['us-co-071', 23],
    ['us-co-001', 24],
    ['us-co-121', 25],
    ['us-co-057', 26],
    ['us-co-007', 27],
    ['us-co-105', 28],
    ['us-co-035', 29],
    ['us-co-119', 30],
    ['us-co-125', 31],
    ['us-co-093', 32],
    ['us-co-065', 33],
    ['us-co-055', 34],
    ['us-co-097', 35],
    ['us-co-107', 36],
    ['us-co-077', 37],
    ['us-co-051', 38],
    ['us-co-087', 39],
    ['us-co-009', 40],
    ['us-co-049', 41],
    ['us-co-047', 42],
    ['us-co-111', 43],
    ['us-co-021', 44],
    ['us-co-117', 45],
    ['us-co-033', 46],
    ['us-co-023', 47],
    ['us-co-039', 48],
    ['us-co-061', 49],
    ['us-co-089', 50],
    ['us-co-079', 51],
    ['us-co-027', 52],
    ['us-co-037', 53],
    ['us-co-085', 54],
    ['us-co-095', 55],
    ['us-co-029', 56],
    ['us-co-099', 57],
    ['us-co-081', 58],
    ['us-co-083', 59],
    ['us-co-103', 60],
    ['us-co-017', 61],
    ['us-co-067', 62],
    ['us-co-019', 63]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-co-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-co-all.js">Colorado</a>'
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
