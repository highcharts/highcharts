// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-il-003', 0],
    ['us-il-181', 1],
    ['us-il-187', 2],
    ['us-il-109', 3],
    ['us-il-147', 4],
    ['us-il-113', 5],
    ['us-il-195', 6],
    ['us-il-089', 7],
    ['us-il-043', 8],
    ['us-il-119', 9],
    ['us-il-083', 10],
    ['us-il-193', 11],
    ['us-il-059', 12],
    ['us-il-019', 13],
    ['us-il-053', 14],
    ['us-il-041', 15],
    ['us-il-045', 16],
    ['us-il-007', 17],
    ['us-il-201', 18],
    ['us-il-155', 19],
    ['us-il-099', 20],
    ['us-il-121', 21],
    ['us-il-025', 22],
    ['us-il-197', 23],
    ['us-il-049', 24],
    ['us-il-051', 25],
    ['us-il-035', 26],
    ['us-il-163', 27],
    ['us-il-027', 28],
    ['us-il-189', 29],
    ['us-il-145', 30],
    ['us-il-175', 31],
    ['us-il-073', 32],
    ['us-il-123', 33],
    ['us-il-143', 34],
    ['us-il-011', 35],
    ['us-il-103', 36],
    ['us-il-029', 37],
    ['us-il-037', 38],
    ['us-il-093', 39],
    ['us-il-039', 40],
    ['us-il-107', 41],
    ['us-il-129', 42],
    ['us-il-157', 43],
    ['us-il-077', 44],
    ['us-il-203', 45],
    ['us-il-105', 46],
    ['us-il-057', 47],
    ['us-il-071', 48],
    ['us-il-135', 49],
    ['us-il-061', 50],
    ['us-il-149', 51],
    ['us-il-017', 52],
    ['us-il-009', 53],
    ['us-il-137', 54],
    ['us-il-117', 55],
    ['us-il-005', 56],
    ['us-il-191', 57],
    ['us-il-167', 58],
    ['us-il-153', 59],
    ['us-il-127', 60],
    ['us-il-065', 61],
    ['us-il-047', 62],
    ['us-il-173', 63],
    ['us-il-115', 64],
    ['us-il-021', 65],
    ['us-il-031', 66],
    ['us-il-131', 67],
    ['us-il-183', 68],
    ['us-il-185', 69],
    ['us-il-101', 70],
    ['us-il-111', 71],
    ['us-il-179', 72],
    ['us-il-055', 73],
    ['us-il-081', 74],
    ['us-il-141', 75],
    ['us-il-067', 76],
    ['us-il-169', 77],
    ['us-il-079', 78],
    ['us-il-023', 79],
    ['us-il-091', 80],
    ['us-il-125', 81],
    ['us-il-159', 82],
    ['us-il-165', 83],
    ['us-il-069', 84],
    ['us-il-151', 85],
    ['us-il-133', 86],
    ['us-il-177', 87],
    ['us-il-161', 88],
    ['us-il-001', 89],
    ['us-il-075', 90],
    ['us-il-087', 91],
    ['us-il-095', 92],
    ['us-il-013', 93],
    ['us-il-171', 94],
    ['us-il-015', 95],
    ['us-il-063', 96],
    ['us-il-085', 97],
    ['us-il-199', 98],
    ['us-il-033', 99],
    ['us-il-097', 100],
    ['us-il-139', 101]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-il-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-il-all.js">Illinois</a>'
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
