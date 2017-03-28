// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-in-139', 0],
    ['us-in-031', 1],
    ['us-in-149', 2],
    ['us-in-099', 3],
    ['us-in-033', 4],
    ['us-in-151', 5],
    ['us-in-043', 6],
    ['us-in-019', 7],
    ['us-in-181', 8],
    ['us-in-131', 9],
    ['us-in-153', 10],
    ['us-in-021', 11],
    ['us-in-045', 12],
    ['us-in-165', 13],
    ['us-in-039', 14],
    ['us-in-087', 15],
    ['us-in-093', 16],
    ['us-in-071', 17],
    ['us-in-171', 18],
    ['us-in-121', 19],
    ['us-in-167', 20],
    ['us-in-015', 21],
    ['us-in-065', 22],
    ['us-in-095', 23],
    ['us-in-053', 24],
    ['us-in-069', 25],
    ['us-in-003', 26],
    ['us-in-157', 27],
    ['us-in-023', 28],
    ['us-in-159', 29],
    ['us-in-067', 30],
    ['us-in-057', 31],
    ['us-in-059', 32],
    ['us-in-111', 33],
    ['us-in-073', 34],
    ['us-in-135', 35],
    ['us-in-035', 36],
    ['us-in-005', 37],
    ['us-in-081', 38],
    ['us-in-013', 39],
    ['us-in-055', 40],
    ['us-in-109', 41],
    ['us-in-133', 42],
    ['us-in-105', 43],
    ['us-in-137', 44],
    ['us-in-049', 45],
    ['us-in-169', 46],
    ['us-in-113', 47],
    ['us-in-075', 48],
    ['us-in-041', 49],
    ['us-in-027', 50],
    ['us-in-101', 51],
    ['us-in-103', 52],
    ['us-in-179', 53],
    ['us-in-009', 54],
    ['us-in-079', 55],
    ['us-in-143', 56],
    ['us-in-115', 57],
    ['us-in-029', 58],
    ['us-in-175', 59],
    ['us-in-107', 60],
    ['us-in-063', 61],
    ['us-in-145', 62],
    ['us-in-097', 63],
    ['us-in-011', 64],
    ['us-in-141', 65],
    ['us-in-037', 66],
    ['us-in-117', 67],
    ['us-in-025', 68],
    ['us-in-083', 69],
    ['us-in-173', 70],
    ['us-in-163', 71],
    ['us-in-051', 72],
    ['us-in-089', 73],
    ['us-in-007', 74],
    ['us-in-125', 75],
    ['us-in-155', 76],
    ['us-in-123', 77],
    ['us-in-161', 78],
    ['us-in-147', 79],
    ['us-in-001', 80],
    ['us-in-129', 81],
    ['us-in-061', 82],
    ['us-in-017', 83],
    ['us-in-085', 84],
    ['us-in-047', 85],
    ['us-in-119', 86],
    ['us-in-077', 87],
    ['us-in-091', 88],
    ['us-in-127', 89],
    ['us-in-177', 90],
    ['us-in-183', 91]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-in-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-in-all.js">Indiana</a>'
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
