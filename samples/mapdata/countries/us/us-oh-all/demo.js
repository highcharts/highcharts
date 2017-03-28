// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-oh-085', 0],
    ['us-oh-035', 1],
    ['us-oh-103', 2],
    ['us-oh-153', 3],
    ['us-oh-063', 4],
    ['us-oh-173', 5],
    ['us-oh-039', 6],
    ['us-oh-077', 7],
    ['us-oh-093', 8],
    ['us-oh-145', 9],
    ['us-oh-087', 10],
    ['us-oh-015', 11],
    ['us-oh-001', 12],
    ['us-oh-049', 13],
    ['us-oh-067', 14],
    ['us-oh-013', 15],
    ['us-oh-081', 16],
    ['us-oh-105', 17],
    ['us-oh-163', 18],
    ['us-oh-079', 19],
    ['us-oh-009', 20],
    ['us-oh-059', 21],
    ['us-oh-031', 22],
    ['us-oh-129', 23],
    ['us-oh-097', 24],
    ['us-oh-045', 25],
    ['us-oh-047', 26],
    ['us-oh-141', 27],
    ['us-oh-071', 28],
    ['us-oh-101', 29],
    ['us-oh-065', 30],
    ['us-oh-149', 31],
    ['us-oh-091', 32],
    ['us-oh-161', 33],
    ['us-oh-137', 34],
    ['us-oh-133', 35],
    ['us-oh-155', 36],
    ['us-oh-055', 37],
    ['us-oh-007', 38],
    ['us-oh-143', 39],
    ['us-oh-147', 40],
    ['us-oh-165', 41],
    ['us-oh-017', 42],
    ['us-oh-113', 43],
    ['us-oh-033', 44],
    ['us-oh-061', 45],
    ['us-oh-073', 46],
    ['us-oh-037', 47],
    ['us-oh-019', 48],
    ['us-oh-151', 49],
    ['us-oh-075', 50],
    ['us-oh-099', 51],
    ['us-oh-005', 52],
    ['us-oh-041', 53],
    ['us-oh-083', 54],
    ['us-oh-011', 55],
    ['us-oh-089', 56],
    ['us-oh-095', 57],
    ['us-oh-069', 58],
    ['us-oh-171', 59],
    ['us-oh-157', 60],
    ['us-oh-127', 61],
    ['us-oh-131', 62],
    ['us-oh-025', 63],
    ['us-oh-027', 64],
    ['us-oh-159', 65],
    ['us-oh-021', 66],
    ['us-oh-109', 67],
    ['us-oh-003', 68],
    ['us-oh-023', 69],
    ['us-oh-107', 70],
    ['us-oh-053', 71],
    ['us-oh-117', 72],
    ['us-oh-111', 73],
    ['us-oh-135', 74],
    ['us-oh-119', 75],
    ['us-oh-139', 76],
    ['us-oh-051', 77],
    ['us-oh-167', 78],
    ['us-oh-175', 79],
    ['us-oh-169', 80],
    ['us-oh-115', 81],
    ['us-oh-057', 82],
    ['us-oh-043', 83],
    ['us-oh-125', 84],
    ['us-oh-029', 85],
    ['us-oh-123', 86],
    ['us-oh-121', 87]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-oh-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-oh-all.js">Ohio</a>'
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
