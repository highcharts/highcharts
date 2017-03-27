// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-al-007', 0],
    ['us-al-003', 1],
    ['us-al-041', 2],
    ['us-al-085', 3],
    ['us-al-133', 4],
    ['us-al-059', 5],
    ['us-al-083', 6],
    ['us-al-079', 7],
    ['us-al-039', 8],
    ['us-al-061', 9],
    ['us-al-095', 10],
    ['us-al-071', 11],
    ['us-al-009', 12],
    ['us-al-055', 13],
    ['us-al-013', 14],
    ['us-al-053', 15],
    ['us-al-099', 16],
    ['us-al-131', 17],
    ['us-al-077', 18],
    ['us-al-033', 19],
    ['us-al-105', 20],
    ['us-al-091', 21],
    ['us-al-107', 22],
    ['us-al-119', 23],
    ['us-al-097', 24],
    ['us-al-063', 25],
    ['us-al-047', 26],
    ['us-al-001', 27],
    ['us-al-101', 28],
    ['us-al-073', 29],
    ['us-al-021', 30],
    ['us-al-129', 31],
    ['us-al-023', 32],
    ['us-al-031', 33],
    ['us-al-029', 34],
    ['us-al-121', 35],
    ['us-al-043', 36],
    ['us-al-045', 37],
    ['us-al-019', 38],
    ['us-al-109', 39],
    ['us-al-035', 40],
    ['us-al-123', 41],
    ['us-al-111', 42],
    ['us-al-037', 43],
    ['us-al-027', 44],
    ['us-al-093', 45],
    ['us-al-127', 46],
    ['us-al-011', 47],
    ['us-al-113', 48],
    ['us-al-117', 49],
    ['us-al-065', 50],
    ['us-al-081', 51],
    ['us-al-089', 52],
    ['us-al-025', 53],
    ['us-al-015', 54],
    ['us-al-103', 55],
    ['us-al-017', 56],
    ['us-al-067', 57],
    ['us-al-069', 58],
    ['us-al-049', 59],
    ['us-al-005', 60],
    ['us-al-057', 61],
    ['us-al-125', 62],
    ['us-al-087', 63],
    ['us-al-075', 64],
    ['us-al-115', 65],
    ['us-al-051', 66]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-al-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-al-all.js">Alabama</a>'
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
