// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-tn-023', 0],
    ['us-tn-069', 1],
    ['us-tn-113', 2],
    ['us-tn-077', 3],
    ['us-tn-157', 4],
    ['us-tn-033', 5],
    ['us-tn-053', 6],
    ['us-tn-021', 7],
    ['us-tn-147', 8],
    ['us-tn-105', 9],
    ['us-tn-037', 10],
    ['us-tn-107', 11],
    ['us-tn-011', 12],
    ['us-tn-043', 13],
    ['us-tn-125', 14],
    ['us-tn-047', 15],
    ['us-tn-167', 16],
    ['us-tn-177', 17],
    ['us-tn-031', 18],
    ['us-tn-163', 19],
    ['us-tn-091', 20],
    ['us-tn-187', 21],
    ['us-tn-019', 22],
    ['us-tn-179', 23],
    ['us-tn-073', 24],
    ['us-tn-149', 25],
    ['us-tn-189', 26],
    ['us-tn-015', 27],
    ['us-tn-175', 28],
    ['us-tn-007', 29],
    ['us-tn-035', 30],
    ['us-tn-057', 31],
    ['us-tn-173', 32],
    ['us-tn-051', 33],
    ['us-tn-145', 34],
    ['us-tn-087', 35],
    ['us-tn-133', 36],
    ['us-tn-001', 37],
    ['us-tn-151', 38],
    ['us-tn-097', 39],
    ['us-tn-119', 40],
    ['us-tn-027', 41],
    ['us-tn-111', 42],
    ['us-tn-041', 43],
    ['us-tn-039', 44],
    ['us-tn-017', 45],
    ['us-tn-161', 46],
    ['us-tn-005', 47],
    ['us-tn-159', 48],
    ['us-tn-141', 49],
    ['us-tn-049', 50],
    ['us-tn-103', 51],
    ['us-tn-003', 52],
    ['us-tn-137', 53],
    ['us-tn-123', 54],
    ['us-tn-093', 55],
    ['us-tn-135', 56],
    ['us-tn-059', 57],
    ['us-tn-171', 58],
    ['us-tn-071', 59],
    ['us-tn-117', 60],
    ['us-tn-055', 61],
    ['us-tn-099', 62],
    ['us-tn-185', 63],
    ['us-tn-153', 64],
    ['us-tn-127', 65],
    ['us-tn-143', 66],
    ['us-tn-065', 67],
    ['us-tn-079', 68],
    ['us-tn-155', 69],
    ['us-tn-109', 70],
    ['us-tn-013', 71],
    ['us-tn-009', 72],
    ['us-tn-121', 73],
    ['us-tn-165', 74],
    ['us-tn-115', 75],
    ['us-tn-045', 76],
    ['us-tn-169', 77],
    ['us-tn-095', 78],
    ['us-tn-131', 79],
    ['us-tn-183', 80],
    ['us-tn-089', 81],
    ['us-tn-029', 82],
    ['us-tn-067', 83],
    ['us-tn-139', 84],
    ['us-tn-081', 85],
    ['us-tn-085', 86],
    ['us-tn-181', 87],
    ['us-tn-025', 88],
    ['us-tn-061', 89],
    ['us-tn-075', 90],
    ['us-tn-101', 91],
    ['us-tn-129', 92],
    ['us-tn-083', 93],
    ['us-tn-063', 94]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-tn-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-tn-all.js">Tennessee</a>'
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
