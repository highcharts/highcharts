// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-nc-031', 0],
    ['us-nc-187', 1],
    ['us-nc-095', 2],
    ['us-nc-129', 3],
    ['us-nc-183', 4],
    ['us-nc-077', 5],
    ['us-nc-121', 6],
    ['us-nc-011', 7],
    ['us-nc-091', 8],
    ['us-nc-033', 9],
    ['us-nc-001', 10],
    ['us-nc-019', 11],
    ['us-nc-087', 12],
    ['us-nc-175', 13],
    ['us-nc-153', 14],
    ['us-nc-107', 15],
    ['us-nc-191', 16],
    ['us-nc-079', 17],
    ['us-nc-161', 18],
    ['us-nc-101', 19],
    ['us-nc-127', 20],
    ['us-nc-081', 21],
    ['us-nc-157', 22],
    ['us-nc-013', 23],
    ['us-nc-137', 24],
    ['us-nc-103', 25],
    ['us-nc-049', 26],
    ['us-nc-063', 27],
    ['us-nc-037', 28],
    ['us-nc-185', 29],
    ['us-nc-131', 30],
    ['us-nc-065', 31],
    ['us-nc-195', 32],
    ['us-nc-145', 33],
    ['us-nc-083', 34],
    ['us-nc-117', 35],
    ['us-nc-135', 36],
    ['us-nc-055', 37],
    ['us-nc-099', 38],
    ['us-nc-159', 39],
    ['us-nc-097', 40],
    ['us-nc-025', 41],
    ['us-nc-179', 42],
    ['us-nc-181', 43],
    ['us-nc-177', 44],
    ['us-nc-189', 45],
    ['us-nc-193', 46],
    ['us-nc-003', 47],
    ['us-nc-027', 48],
    ['us-nc-151', 49],
    ['us-nc-041', 50],
    ['us-nc-073', 51],
    ['us-nc-139', 52],
    ['us-nc-039', 53],
    ['us-nc-113', 54],
    ['us-nc-133', 55],
    ['us-nc-045', 56],
    ['us-nc-109', 57],
    ['us-nc-119', 58],
    ['us-nc-199', 59],
    ['us-nc-089', 60],
    ['us-nc-147', 61],
    ['us-nc-143', 62],
    ['us-nc-125', 63],
    ['us-nc-007', 64],
    ['us-nc-141', 65],
    ['us-nc-163', 66],
    ['us-nc-085', 67],
    ['us-nc-155', 68],
    ['us-nc-051', 69],
    ['us-nc-075', 70],
    ['us-nc-023', 71],
    ['us-nc-165', 72],
    ['us-nc-093', 73],
    ['us-nc-111', 74],
    ['us-nc-047', 75],
    ['us-nc-061', 76],
    ['us-nc-197', 77],
    ['us-nc-067', 78],
    ['us-nc-171', 79],
    ['us-nc-169', 80],
    ['us-nc-057', 81],
    ['us-nc-059', 82],
    ['us-nc-029', 83],
    ['us-nc-053', 84],
    ['us-nc-009', 85],
    ['us-nc-115', 86],
    ['us-nc-021', 87],
    ['us-nc-071', 88],
    ['us-nc-015', 89],
    ['us-nc-173', 90],
    ['us-nc-035', 91],
    ['us-nc-069', 92],
    ['us-nc-005', 93],
    ['us-nc-123', 94],
    ['us-nc-149', 95],
    ['us-nc-105', 96],
    ['us-nc-043', 97],
    ['us-nc-017', 98],
    ['us-nc-167', 99]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-nc-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-nc-all.js">North Carolina</a>'
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
