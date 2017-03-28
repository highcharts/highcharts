// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-ks-091', 0],
    ['us-ks-045', 1],
    ['us-ks-165', 2],
    ['us-ks-051', 3],
    ['us-ks-195', 4],
    ['us-ks-205', 5],
    ['us-ks-125', 6],
    ['us-ks-137', 7],
    ['us-ks-065', 8],
    ['us-ks-179', 9],
    ['us-ks-079', 10],
    ['us-ks-155', 11],
    ['us-ks-053', 12],
    ['us-ks-105', 13],
    ['us-ks-035', 14],
    ['us-ks-019', 15],
    ['us-ks-063', 16],
    ['us-ks-109', 17],
    ['us-ks-135', 18],
    ['us-ks-181', 19],
    ['us-ks-153', 20],
    ['us-ks-023', 21],
    ['us-ks-145', 22],
    ['us-ks-009', 23],
    ['us-ks-089', 24],
    ['us-ks-123', 25],
    ['us-ks-029', 26],
    ['us-ks-143', 27],
    ['us-ks-071', 28],
    ['us-ks-075', 29],
    ['us-ks-041', 30],
    ['us-ks-131', 31],
    ['us-ks-149', 32],
    ['us-ks-013', 33],
    ['us-ks-005', 34],
    ['us-ks-127', 35],
    ['us-ks-111', 36],
    ['us-ks-073', 37],
    ['us-ks-161', 38],
    ['us-ks-197', 39],
    ['us-ks-061', 40],
    ['us-ks-115', 41],
    ['us-ks-095', 42],
    ['us-ks-141', 43],
    ['us-ks-085', 44],
    ['us-ks-037', 45],
    ['us-ks-099', 46],
    ['us-ks-049', 47],
    ['us-ks-133', 48],
    ['us-ks-057', 49],
    ['us-ks-047', 50],
    ['us-ks-151', 51],
    ['us-ks-169', 52],
    ['us-ks-113', 53],
    ['us-ks-203', 54],
    ['us-ks-167', 55],
    ['us-ks-163', 56],
    ['us-ks-011', 57],
    ['us-ks-055', 58],
    ['us-ks-083', 59],
    ['us-ks-039', 60],
    ['us-ks-193', 61],
    ['us-ks-147', 62],
    ['us-ks-069', 63],
    ['us-ks-175', 64],
    ['us-ks-119', 65],
    ['us-ks-081', 66],
    ['us-ks-007', 67],
    ['us-ks-103', 68],
    ['us-ks-093', 69],
    ['us-ks-171', 70],
    ['us-ks-177', 71],
    ['us-ks-187', 72],
    ['us-ks-189', 73],
    ['us-ks-031', 74],
    ['us-ks-059', 75],
    ['us-ks-207', 76],
    ['us-ks-139', 77],
    ['us-ks-183', 78],
    ['us-ks-199', 79],
    ['us-ks-173', 80],
    ['us-ks-077', 81],
    ['us-ks-191', 82],
    ['us-ks-001', 83],
    ['us-ks-121', 84],
    ['us-ks-021', 85],
    ['us-ks-033', 86],
    ['us-ks-185', 87],
    ['us-ks-159', 88],
    ['us-ks-117', 89],
    ['us-ks-015', 90],
    ['us-ks-017', 91],
    ['us-ks-043', 92],
    ['us-ks-107', 93],
    ['us-ks-157', 94],
    ['us-ks-097', 95],
    ['us-ks-067', 96],
    ['us-ks-129', 97],
    ['us-ks-025', 98],
    ['us-ks-003', 99],
    ['us-ks-209', 100],
    ['us-ks-027', 101],
    ['us-ks-087', 102],
    ['us-ks-201', 103],
    ['us-ks-101', 104]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-ks-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-ks-all.js">Kansas</a>'
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
