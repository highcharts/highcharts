// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-mo-223', 0],
    ['us-mo-179', 1],
    ['us-mo-035', 2],
    ['us-mo-145', 3],
    ['us-mo-003', 4],
    ['us-mo-147', 5],
    ['us-mo-199', 6],
    ['us-mo-103', 7],
    ['us-mo-097', 8],
    ['us-mo-011', 9],
    ['us-mo-227', 10],
    ['us-mo-079', 11],
    ['us-mo-117', 12],
    ['us-mo-125', 13],
    ['us-mo-131', 14],
    ['us-mo-073', 15],
    ['us-mo-151', 16],
    ['us-mo-021', 17],
    ['us-mo-165', 18],
    ['us-mo-209', 19],
    ['us-mo-111', 20],
    ['us-mo-127', 21],
    ['us-mo-107', 22],
    ['us-mo-101', 23],
    ['us-mo-163', 24],
    ['us-mo-007', 25],
    ['us-mo-211', 26],
    ['us-mo-129', 27],
    ['us-mo-119', 28],
    ['us-mo-009', 29],
    ['us-mo-173', 30],
    ['us-mo-201', 31],
    ['us-mo-143', 32],
    ['us-mo-187', 33],
    ['us-mo-099', 34],
    ['us-mo-186', 35],
    ['us-mo-093', 36],
    ['us-mo-221', 37],
    ['us-mo-157', 38],
    ['us-mo-109', 39],
    ['us-mo-123', 40],
    ['us-mo-075', 41],
    ['us-mo-139', 42],
    ['us-mo-045', 43],
    ['us-mo-121', 44],
    ['us-mo-001', 45],
    ['us-mo-039', 46],
    ['us-mo-167', 47],
    ['us-mo-085', 48],
    ['us-mo-029', 49],
    ['us-mo-189', 50],
    ['us-mo-067', 51],
    ['us-mo-091', 52],
    ['us-mo-041', 53],
    ['us-mo-141', 54],
    ['us-mo-015', 55],
    ['us-mo-149', 56],
    ['us-mo-115', 57],
    ['us-mo-175', 58],
    ['us-mo-137', 59],
    ['us-mo-219', 60],
    ['us-mo-047', 61],
    ['us-mo-081', 62],
    ['us-mo-059', 63],
    ['us-mo-077', 64],
    ['us-mo-061', 65],
    ['us-mo-195', 66],
    ['us-mo-053', 67],
    ['us-mo-019', 68],
    ['us-mo-065', 69],
    ['us-mo-013', 70],
    ['us-mo-083', 71],
    ['us-mo-095', 72],
    ['us-mo-215', 73],
    ['us-mo-159', 74],
    ['us-mo-057', 75],
    ['us-mo-043', 76],
    ['us-mo-135', 77],
    ['us-mo-205', 78],
    ['us-mo-185', 79],
    ['us-mo-055', 80],
    ['us-mo-033', 81],
    ['us-mo-025', 82],
    ['us-mo-049', 83],
    ['us-mo-063', 84],
    ['us-mo-213', 85],
    ['us-mo-225', 86],
    ['us-mo-171', 87],
    ['us-mo-023', 88],
    ['us-mo-031', 89],
    ['us-mo-133', 90],
    ['us-mo-113', 91],
    ['us-mo-197', 92],
    ['us-mo-037', 93],
    ['us-mo-069', 94],
    ['us-mo-153', 95],
    ['us-mo-017', 96],
    ['us-mo-183', 97],
    ['us-mo-071', 98],
    ['us-mo-181', 99],
    ['us-mo-177', 100],
    ['us-mo-087', 101],
    ['us-mo-217', 102],
    ['us-mo-105', 103],
    ['us-mo-169', 104],
    ['us-mo-161', 105],
    ['us-mo-229', 106],
    ['us-mo-155', 107],
    ['us-mo-203', 108],
    ['us-mo-005', 109],
    ['us-mo-510', 110],
    ['us-mo-207', 111],
    ['us-mo-027', 112],
    ['us-mo-051', 113],
    ['us-mo-089', 114]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-mo-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-mo-all.js">Missouri</a>'
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
