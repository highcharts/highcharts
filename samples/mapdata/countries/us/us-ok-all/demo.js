// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-ok-037', 0],
    ['us-ok-081', 1],
    ['us-ok-049', 2],
    ['us-ok-051', 3],
    ['us-ok-059', 4],
    ['us-ok-151', 5],
    ['us-ok-011', 6],
    ['us-ok-017', 7],
    ['us-ok-075', 8],
    ['us-ok-015', 9],
    ['us-ok-137', 10],
    ['us-ok-141', 11],
    ['us-ok-033', 12],
    ['us-ok-083', 13],
    ['us-ok-103', 14],
    ['us-ok-001', 15],
    ['us-ok-041', 16],
    ['us-ok-107', 17],
    ['us-ok-039', 18],
    ['us-ok-009', 19],
    ['us-ok-055', 20],
    ['us-ok-057', 21],
    ['us-ok-019', 22],
    ['us-ok-095', 23],
    ['us-ok-093', 24],
    ['us-ok-073', 25],
    ['us-ok-035', 26],
    ['us-ok-123', 27],
    ['us-ok-125', 28],
    ['us-ok-131', 29],
    ['us-ok-147', 30],
    ['us-ok-071', 31],
    ['us-ok-047', 32],
    ['us-ok-021', 33],
    ['us-ok-109', 34],
    ['us-ok-023', 35],
    ['us-ok-005', 36],
    ['us-ok-087', 37],
    ['us-ok-079', 38],
    ['us-ok-061', 39],
    ['us-ok-003', 40],
    ['us-ok-077', 41],
    ['us-ok-027', 42],
    ['us-ok-045', 43],
    ['us-ok-007', 44],
    ['us-ok-031', 45],
    ['us-ok-067', 46],
    ['us-ok-119', 47],
    ['us-ok-111', 48],
    ['us-ok-145', 49],
    ['us-ok-129', 50],
    ['us-ok-043', 51],
    ['us-ok-117', 52],
    ['us-ok-143', 53],
    ['us-ok-091', 54],
    ['us-ok-069', 55],
    ['us-ok-135', 56],
    ['us-ok-101', 57],
    ['us-ok-013', 58],
    ['us-ok-089', 59],
    ['us-ok-115', 60],
    ['us-ok-063', 61],
    ['us-ok-121', 62],
    ['us-ok-029', 63],
    ['us-ok-149', 64],
    ['us-ok-025', 65],
    ['us-ok-105', 66],
    ['us-ok-113', 67],
    ['us-ok-053', 68],
    ['us-ok-085', 69],
    ['us-ok-127', 70],
    ['us-ok-139', 71],
    ['us-ok-153', 72],
    ['us-ok-065', 73],
    ['us-ok-097', 74],
    ['us-ok-099', 75],
    ['us-ok-133', 76]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-ok-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-ok-all.js">Oklahoma</a>'
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
