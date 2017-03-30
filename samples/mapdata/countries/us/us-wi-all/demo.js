// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-wi-111', 0],
    ['us-wi-049', 1],
    ['us-wi-003', 2],
    ['us-wi-007', 3],
    ['us-wi-113', 4],
    ['us-wi-021', 5],
    ['us-wi-001', 6],
    ['us-wi-085', 7],
    ['us-wi-099', 8],
    ['us-wi-017', 9],
    ['us-wi-019', 10],
    ['us-wi-087', 11],
    ['us-wi-115', 12],
    ['us-wi-069', 13],
    ['us-wi-055', 14],
    ['us-wi-027', 15],
    ['us-wi-125', 16],
    ['us-wi-041', 17],
    ['us-wi-047', 18],
    ['us-wi-137', 19],
    ['us-wi-045', 20],
    ['us-wi-105', 21],
    ['us-wi-127', 22],
    ['us-wi-005', 23],
    ['us-wi-093', 24],
    ['us-wi-033', 25],
    ['us-wi-107', 26],
    ['us-wi-119', 27],
    ['us-wi-101', 28],
    ['us-wi-053', 29],
    ['us-wi-035', 30],
    ['us-wi-083', 31],
    ['us-wi-009', 32],
    ['us-wi-079', 33],
    ['us-wi-089', 34],
    ['us-wi-103', 35],
    ['us-wi-023', 36],
    ['us-wi-133', 37],
    ['us-wi-057', 38],
    ['us-wi-123', 39],
    ['us-wi-025', 40],
    ['us-wi-051', 41],
    ['us-wi-135', 42],
    ['us-wi-139', 43],
    ['us-wi-061', 44],
    ['us-wi-097', 45],
    ['us-wi-015', 46],
    ['us-wi-063', 47],
    ['us-wi-073', 48],
    ['us-wi-013', 49],
    ['us-wi-121', 50],
    ['us-wi-129', 51],
    ['us-wi-091', 52],
    ['us-wi-141', 53],
    ['us-wi-043', 54],
    ['us-wi-065', 55],
    ['us-wi-117', 56],
    ['us-wi-077', 57],
    ['us-wi-067', 58],
    ['us-wi-078', 59],
    ['us-wi-131', 60],
    ['us-wi-109', 61],
    ['us-wi-037', 62],
    ['us-wi-039', 63],
    ['us-wi-081', 64],
    ['us-wi-011', 65],
    ['us-wi-029', 66],
    ['us-wi-095', 67],
    ['us-wi-075', 68],
    ['us-wi-031', 69],
    ['us-wi-059', 70],
    ['us-wi-071', 71]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-wi-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-wi-all.js">Wisconsin</a>'
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
