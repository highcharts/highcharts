// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-ar-073', 0],
    ['us-ar-057', 1],
    ['us-ar-037', 2],
    ['us-ar-147', 3],
    ['us-ar-049', 4],
    ['us-ar-065', 5],
    ['us-ar-045', 6],
    ['us-ar-141', 7],
    ['us-ar-023', 8],
    ['us-ar-015', 9],
    ['us-ar-101', 10],
    ['us-ar-115', 11],
    ['us-ar-005', 12],
    ['us-ar-051', 13],
    ['us-ar-105', 14],
    ['us-ar-063', 15],
    ['us-ar-145', 16],
    ['us-ar-043', 17],
    ['us-ar-003', 18],
    ['us-ar-127', 19],
    ['us-ar-129', 20],
    ['us-ar-061', 21],
    ['us-ar-071', 22],
    ['us-ar-087', 23],
    ['us-ar-095', 24],
    ['us-ar-123', 25],
    ['us-ar-019', 26],
    ['us-ar-097', 27],
    ['us-ar-149', 28],
    ['us-ar-013', 29],
    ['us-ar-025', 30],
    ['us-ar-031', 31],
    ['us-ar-067', 32],
    ['us-ar-099', 33],
    ['us-ar-011', 34],
    ['us-ar-053', 35],
    ['us-ar-119', 36],
    ['us-ar-001', 37],
    ['us-ar-107', 38],
    ['us-ar-085', 39],
    ['us-ar-117', 40],
    ['us-ar-075', 41],
    ['us-ar-135', 42],
    ['us-ar-059', 43],
    ['us-ar-029', 44],
    ['us-ar-007', 45],
    ['us-ar-035', 46],
    ['us-ar-093', 47],
    ['us-ar-111', 48],
    ['us-ar-083', 49],
    ['us-ar-047', 50],
    ['us-ar-041', 51],
    ['us-ar-079', 52],
    ['us-ar-009', 53],
    ['us-ar-033', 54],
    ['us-ar-109', 55],
    ['us-ar-121', 56],
    ['us-ar-055', 57],
    ['us-ar-081', 58],
    ['us-ar-139', 59],
    ['us-ar-089', 60],
    ['us-ar-113', 61],
    ['us-ar-133', 62],
    ['us-ar-027', 63],
    ['us-ar-069', 64],
    ['us-ar-131', 65],
    ['us-ar-021', 66],
    ['us-ar-137', 67],
    ['us-ar-125', 68],
    ['us-ar-091', 69],
    ['us-ar-143', 70],
    ['us-ar-103', 71],
    ['us-ar-039', 72],
    ['us-ar-077', 73],
    ['us-ar-017', 74]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-ar-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-ar-all.js">Arkansas</a>'
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
