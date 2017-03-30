// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-fl-131', 0],
    ['us-fl-087', 1],
    ['us-fl-053', 2],
    ['us-fl-051', 3],
    ['us-fl-043', 4],
    ['us-fl-086', 5],
    ['us-fl-037', 6],
    ['us-fl-097', 7],
    ['us-fl-093', 8],
    ['us-fl-071', 9],
    ['us-fl-111', 10],
    ['us-fl-061', 11],
    ['us-fl-085', 12],
    ['us-fl-021', 13],
    ['us-fl-049', 14],
    ['us-fl-055', 15],
    ['us-fl-027', 16],
    ['us-fl-015', 17],
    ['us-fl-009', 18],
    ['us-fl-095', 19],
    ['us-fl-129', 20],
    ['us-fl-133', 21],
    ['us-fl-005', 22],
    ['us-fl-007', 23],
    ['us-fl-107', 24],
    ['us-fl-031', 25],
    ['us-fl-003', 26],
    ['us-fl-019', 27],
    ['us-fl-063', 28],
    ['us-fl-103', 29],
    ['us-fl-057', 30],
    ['us-fl-035', 31],
    ['us-fl-045', 32],
    ['us-fl-065', 33],
    ['us-fl-081', 34],
    ['us-fl-101', 35],
    ['us-fl-115', 36],
    ['us-fl-073', 37],
    ['us-fl-033', 38],
    ['us-fl-113', 39],
    ['us-fl-011', 40],
    ['us-fl-089', 41],
    ['us-fl-077', 42],
    ['us-fl-105', 43],
    ['us-fl-041', 44],
    ['us-fl-067', 45],
    ['us-fl-127', 46],
    ['us-fl-121', 47],
    ['us-fl-083', 48],
    ['us-fl-017', 49],
    ['us-fl-075', 50],
    ['us-fl-059', 51],
    ['us-fl-079', 52],
    ['us-fl-029', 53],
    ['us-fl-117', 54],
    ['us-fl-069', 55],
    ['us-fl-091', 56],
    ['us-fl-001', 57],
    ['us-fl-125', 58],
    ['us-fl-013', 59],
    ['us-fl-123', 60],
    ['us-fl-119', 61],
    ['us-fl-109', 62],
    ['us-fl-099', 63],
    ['us-fl-047', 64],
    ['us-fl-023', 65],
    ['us-fl-039', 66]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-fl-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-fl-all.js">Florida</a>'
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
