// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-ne-085', 0],
    ['us-ne-087', 1],
    ['us-ne-037', 2],
    ['us-ne-053', 3],
    ['us-ne-157', 4],
    ['us-ne-165', 5],
    ['us-ne-059', 6],
    ['us-ne-169', 7],
    ['us-ne-083', 8],
    ['us-ne-065', 9],
    ['us-ne-179', 10],
    ['us-ne-139', 11],
    ['us-ne-077', 12],
    ['us-ne-011', 13],
    ['us-ne-183', 14],
    ['us-ne-027', 15],
    ['us-ne-095', 16],
    ['us-ne-151', 17],
    ['us-ne-035', 18],
    ['us-ne-079', 19],
    ['us-ne-001', 20],
    ['us-ne-185', 21],
    ['us-ne-159', 22],
    ['us-ne-067', 23],
    ['us-ne-097', 24],
    ['us-ne-007', 25],
    ['us-ne-123', 26],
    ['us-ne-019', 27],
    ['us-ne-041', 28],
    ['us-ne-131', 29],
    ['us-ne-127', 30],
    ['us-ne-141', 31],
    ['us-ne-125', 32],
    ['us-ne-133', 33],
    ['us-ne-109', 34],
    ['us-ne-161', 35],
    ['us-ne-075', 36],
    ['us-ne-137', 37],
    ['us-ne-047', 38],
    ['us-ne-111', 39],
    ['us-ne-003', 40],
    ['us-ne-167', 41],
    ['us-ne-063', 42],
    ['us-ne-057', 43],
    ['us-ne-033', 44],
    ['us-ne-055', 45],
    ['us-ne-105', 46],
    ['us-ne-081', 47],
    ['us-ne-017', 48],
    ['us-ne-115', 49],
    ['us-ne-009', 50],
    ['us-ne-113', 51],
    ['us-ne-121', 52],
    ['us-ne-163', 53],
    ['us-ne-023', 54],
    ['us-ne-143', 55],
    ['us-ne-175', 56],
    ['us-ne-025', 57],
    ['us-ne-119', 58],
    ['us-ne-181', 59],
    ['us-ne-129', 60],
    ['us-ne-099', 61],
    ['us-ne-089', 62],
    ['us-ne-031', 63],
    ['us-ne-103', 64],
    ['us-ne-015', 65],
    ['us-ne-093', 66],
    ['us-ne-071', 67],
    ['us-ne-135', 68],
    ['us-ne-049', 69],
    ['us-ne-101', 70],
    ['us-ne-107', 71],
    ['us-ne-153', 72],
    ['us-ne-155', 73],
    ['us-ne-013', 74],
    ['us-ne-005', 75],
    ['us-ne-091', 76],
    ['us-ne-061', 77],
    ['us-ne-029', 78],
    ['us-ne-021', 79],
    ['us-ne-147', 80],
    ['us-ne-069', 81],
    ['us-ne-171', 82],
    ['us-ne-073', 83],
    ['us-ne-051', 84],
    ['us-ne-043', 85],
    ['us-ne-177', 86],
    ['us-ne-039', 87],
    ['us-ne-117', 88],
    ['us-ne-145', 89],
    ['us-ne-149', 90],
    ['us-ne-045', 91],
    ['us-ne-173', 92]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-ne-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-ne-all.js">Nebraska</a>'
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
