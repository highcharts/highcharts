// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-ky-091', 0],
    ['us-ky-183', 1],
    ['us-ky-149', 2],
    ['us-ky-019', 3],
    ['us-ky-089', 4],
    ['us-ky-083', 5],
    ['us-ky-157', 6],
    ['us-ky-185', 7],
    ['us-ky-111', 8],
    ['us-ky-029', 9],
    ['us-ky-017', 10],
    ['us-ky-049', 11],
    ['us-ky-173', 12],
    ['us-ky-031', 13],
    ['us-ky-085', 14],
    ['us-ky-045', 15],
    ['us-ky-207', 16],
    ['us-ky-155', 17],
    ['us-ky-179', 18],
    ['us-ky-199', 19],
    ['us-ky-177', 20],
    ['us-ky-129', 21],
    ['us-ky-237', 22],
    ['us-ky-197', 23],
    ['us-ky-187', 24],
    ['us-ky-041', 25],
    ['us-ky-239', 26],
    ['us-ky-209', 27],
    ['us-ky-107', 28],
    ['us-ky-141', 29],
    ['us-ky-077', 30],
    ['us-ky-015', 31],
    ['us-ky-079', 32],
    ['us-ky-021', 33],
    ['us-ky-229', 34],
    ['us-ky-221', 35],
    ['us-ky-193', 36],
    ['us-ky-051', 37],
    ['us-ky-109', 38],
    ['us-ky-165', 39],
    ['us-ky-205', 40],
    ['us-ky-061', 41],
    ['us-ky-033', 42],
    ['us-ky-233', 43],
    ['us-ky-001', 44],
    ['us-ky-087', 45],
    ['us-ky-223', 46],
    ['us-ky-167', 47],
    ['us-ky-113', 48],
    ['us-ky-093', 49],
    ['us-ky-099', 50],
    ['us-ky-211', 51],
    ['us-ky-171', 52],
    ['us-ky-003', 53],
    ['us-ky-023', 54],
    ['us-ky-201', 55],
    ['us-ky-069', 56],
    ['us-ky-195', 57],
    ['us-ky-119', 58],
    ['us-ky-025', 59],
    ['us-ky-071', 60],
    ['us-ky-159', 61],
    ['us-ky-125', 62],
    ['us-ky-147', 63],
    ['us-ky-191', 64],
    ['us-ky-215', 65],
    ['us-ky-057', 66],
    ['us-ky-053', 67],
    ['us-ky-231', 68],
    ['us-ky-009', 69],
    ['us-ky-227', 70],
    ['us-ky-105', 71],
    ['us-ky-035', 72],
    ['us-ky-065', 73],
    ['us-ky-189', 74],
    ['us-ky-027', 75],
    ['us-ky-127', 76],
    ['us-ky-175', 77],
    ['us-ky-115', 78],
    ['us-ky-213', 79],
    ['us-ky-081', 80],
    ['us-ky-117', 81],
    ['us-ky-169', 82],
    ['us-ky-235', 83],
    ['us-ky-097', 84],
    ['us-ky-005', 85],
    ['us-ky-039', 86],
    ['us-ky-145', 87],
    ['us-ky-139', 88],
    ['us-ky-055', 89],
    ['us-ky-143', 90],
    ['us-ky-151', 91],
    ['us-ky-203', 92],
    ['us-ky-153', 93],
    ['us-ky-131', 94],
    ['us-ky-013', 95],
    ['us-ky-181', 96],
    ['us-ky-037', 97],
    ['us-ky-135', 98],
    ['us-ky-075', 99],
    ['us-ky-101', 100],
    ['us-ky-059', 101],
    ['us-ky-095', 102],
    ['us-ky-161', 103],
    ['us-ky-123', 104],
    ['us-ky-137', 105],
    ['us-ky-043', 106],
    ['us-ky-047', 107],
    ['us-ky-063', 108],
    ['us-ky-133', 109],
    ['us-ky-121', 110],
    ['us-ky-219', 111],
    ['us-ky-225', 112],
    ['us-ky-067', 113],
    ['us-ky-163', 114],
    ['us-ky-007', 115],
    ['us-ky-011', 116],
    ['us-ky-217', 117],
    ['us-ky-103', 118],
    ['us-ky-073', 119]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-ky-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-ky-all.js">Kentucky</a>'
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
