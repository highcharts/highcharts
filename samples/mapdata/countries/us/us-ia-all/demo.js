// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-ia-125', 0],
    ['us-ia-123', 1],
    ['us-ia-041', 2],
    ['us-ia-141', 3],
    ['us-ia-151', 4],
    ['us-ia-187', 5],
    ['us-ia-025', 6],
    ['us-ia-001', 7],
    ['us-ia-175', 8],
    ['us-ia-115', 9],
    ['us-ia-087', 10],
    ['us-ia-183', 11],
    ['us-ia-101', 12],
    ['us-ia-119', 13],
    ['us-ia-143', 14],
    ['us-ia-153', 15],
    ['us-ia-015', 16],
    ['us-ia-157', 17],
    ['us-ia-107', 18],
    ['us-ia-179', 19],
    ['us-ia-147', 20],
    ['us-ia-063', 21],
    ['us-ia-079', 22],
    ['us-ia-033', 23],
    ['us-ia-069', 24],
    ['us-ia-169', 25],
    ['us-ia-047', 26],
    ['us-ia-085', 27],
    ['us-ia-121', 28],
    ['us-ia-171', 29],
    ['us-ia-013', 30],
    ['us-ia-039', 31],
    ['us-ia-011', 32],
    ['us-ia-019', 33],
    ['us-ia-181', 34],
    ['us-ia-117', 35],
    ['us-ia-099', 36],
    ['us-ia-003', 37],
    ['us-ia-105', 38],
    ['us-ia-061', 39],
    ['us-ia-055', 40],
    ['us-ia-155', 41],
    ['us-ia-137', 42],
    ['us-ia-029', 43],
    ['us-ia-145', 44],
    ['us-ia-129', 45],
    ['us-ia-081', 46],
    ['us-ia-197', 47],
    ['us-ia-161', 48],
    ['us-ia-027', 49],
    ['us-ia-113', 50],
    ['us-ia-017', 51],
    ['us-ia-037', 52],
    ['us-ia-067', 53],
    ['us-ia-065', 54],
    ['us-ia-043', 55],
    ['us-ia-189', 56],
    ['us-ia-195', 57],
    ['us-ia-021', 58],
    ['us-ia-035', 59],
    ['us-ia-193', 60],
    ['us-ia-135', 61],
    ['us-ia-103', 62],
    ['us-ia-177', 63],
    ['us-ia-111', 64],
    ['us-ia-083', 65],
    ['us-ia-127', 66],
    ['us-ia-009', 67],
    ['us-ia-165', 68],
    ['us-ia-031', 69],
    ['us-ia-045', 70],
    ['us-ia-023', 71],
    ['us-ia-131', 72],
    ['us-ia-095', 73],
    ['us-ia-073', 74],
    ['us-ia-049', 75],
    ['us-ia-077', 76],
    ['us-ia-191', 77],
    ['us-ia-133', 78],
    ['us-ia-093', 79],
    ['us-ia-007', 80],
    ['us-ia-075', 81],
    ['us-ia-059', 82],
    ['us-ia-139', 83],
    ['us-ia-173', 84],
    ['us-ia-149', 85],
    ['us-ia-109', 86],
    ['us-ia-053', 87],
    ['us-ia-159', 88],
    ['us-ia-051', 89],
    ['us-ia-185', 90],
    ['us-ia-057', 91],
    ['us-ia-163', 92],
    ['us-ia-097', 93],
    ['us-ia-091', 94],
    ['us-ia-071', 95],
    ['us-ia-167', 96],
    ['us-ia-089', 97],
    ['us-ia-005', 98]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-ia-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-ia-all.js">Iowa</a>'
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
