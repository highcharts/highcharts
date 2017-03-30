// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-va-510', 0],
    ['us-va-001', 1],
    ['us-va-013', 2],
    ['us-va-131', 3],
    ['us-va-600', 4],
    ['us-va-059', 5],
    ['us-va-690', 6],
    ['us-va-750', 7],
    ['us-va-595', 8],
    ['us-va-678', 9],
    ['us-va-530', 10],
    ['us-va-051', 11],
    ['us-va-167', 12],
    ['us-va-153', 13],
    ['us-va-840', 14],
    ['us-va-085', 15],
    ['us-va-075', 16],
    ['us-va-031', 17],
    ['us-va-037', 18],
    ['us-va-720', 19],
    ['us-va-800', 20],
    ['us-va-061', 21],
    ['us-va-520', 22],
    ['us-va-515', 23],
    ['us-va-035', 24],
    ['us-va-580', 25],
    ['us-va-005', 26],
    ['us-va-045', 27],
    ['us-va-083', 28],
    ['us-va-015', 29],
    ['us-va-003', 30],
    ['us-va-540', 31],
    ['us-va-033', 32],
    ['us-va-101', 33],
    ['us-va-740', 34],
    ['us-va-195', 35],
    ['us-va-105', 36],
    ['us-va-077', 37],
    ['us-va-193', 38],
    ['us-va-057', 39],
    ['us-va-113', 40],
    ['us-va-157', 41],
    ['us-va-735', 42],
    ['us-va-199', 43],
    ['us-va-640', 44],
    ['us-va-685', 45],
    ['us-va-683', 46],
    ['us-va-053', 47],
    ['us-va-081', 48],
    ['us-va-087', 49],
    ['us-va-071', 50],
    ['us-va-121', 51],
    ['us-va-179', 52],
    ['us-va-630', 53],
    ['us-va-047', 54],
    ['us-va-550', 55],
    ['us-va-710', 56],
    ['us-va-155', 57],
    ['us-va-063', 58],
    ['us-va-021', 59],
    ['us-va-115', 60],
    ['us-va-073', 61],
    ['us-va-097', 62],
    ['us-va-119', 63],
    ['us-va-041', 64],
    ['us-va-570', 65],
    ['us-va-149', 66],
    ['us-va-670', 67],
    ['us-va-730', 68],
    ['us-va-775', 69],
    ['us-va-770', 70],
    ['us-va-065', 71],
    ['us-va-049', 72],
    ['us-va-007', 73],
    ['us-va-147', 74],
    ['us-va-650', 75],
    ['us-va-187', 76],
    ['us-va-069', 77],
    ['us-va-163', 78],
    ['us-va-125', 79],
    ['us-va-036', 80],
    ['us-va-111', 81],
    ['us-va-173', 82],
    ['us-va-093', 83],
    ['us-va-175', 84],
    ['us-va-620', 85],
    ['us-va-099', 86],
    ['us-va-191', 87],
    ['us-va-095', 88],
    ['us-va-830', 89],
    ['us-va-177', 90],
    ['us-va-810', 91],
    ['us-va-137', 92],
    ['us-va-127', 93],
    ['us-va-159', 94],
    ['us-va-019', 95],
    ['us-va-009', 96],
    ['us-va-011', 97],
    ['us-va-680', 98],
    ['us-va-610', 99],
    ['us-va-161', 100],
    ['us-va-590', 101],
    ['us-va-023', 102],
    ['us-va-143', 103],
    ['us-va-165', 104],
    ['us-va-029', 105],
    ['us-va-043', 106],
    ['us-va-700', 107],
    ['us-va-017', 108],
    ['us-va-185', 109],
    ['us-va-107', 110],
    ['us-va-091', 111],
    ['us-va-089', 112],
    ['us-va-169', 113],
    ['us-va-025', 114],
    ['us-va-027', 115],
    ['us-va-135', 116],
    ['us-va-067', 117],
    ['us-va-109', 118],
    ['us-va-181', 119],
    ['us-va-183', 120],
    ['us-va-103', 121],
    ['us-va-117', 122],
    ['us-va-171', 123],
    ['us-va-133', 124],
    ['us-va-141', 125],
    ['us-va-079', 126],
    ['us-va-197', 127],
    ['us-va-660', 128],
    ['us-va-820', 129],
    ['us-va-790', 130],
    ['us-va-145', 131],
    ['us-va-760', 132],
    ['us-va-139', 133]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-va-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-va-all.js">Virginia</a>'
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
