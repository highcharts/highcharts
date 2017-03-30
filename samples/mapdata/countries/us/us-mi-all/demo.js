// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-mi-089', 0],
    ['us-mi-019', 1],
    ['us-mi-003', 2],
    ['us-mi-163', 3],
    ['us-mi-033', 4],
    ['us-mi-161', 5],
    ['us-mi-059', 6],
    ['us-mi-091', 7],
    ['us-mi-115', 8],
    ['us-mi-129', 9],
    ['us-mi-069', 10],
    ['us-mi-025', 11],
    ['us-mi-023', 12],
    ['us-mi-127', 13],
    ['us-mi-123', 14],
    ['us-mi-097', 15],
    ['us-mi-077', 16],
    ['us-mi-149', 17],
    ['us-mi-055', 18],
    ['us-mi-029', 19],
    ['us-mi-145', 20],
    ['us-mi-049', 21],
    ['us-mi-015', 22],
    ['us-mi-005', 23],
    ['us-mi-071', 24],
    ['us-mi-043', 25],
    ['us-mi-103', 26],
    ['us-mi-165', 27],
    ['us-mi-101', 28],
    ['us-mi-159', 29],
    ['us-mi-027', 30],
    ['us-mi-139', 31],
    ['us-mi-009', 32],
    ['us-mi-137', 33],
    ['us-mi-007', 34],
    ['us-mi-119', 35],
    ['us-mi-155', 36],
    ['us-mi-001', 37],
    ['us-mi-135', 38],
    ['us-mi-079', 39],
    ['us-mi-039', 40],
    ['us-mi-107', 41],
    ['us-mi-095', 42],
    ['us-mi-153', 43],
    ['us-mi-075', 44],
    ['us-mi-093', 45],
    ['us-mi-045', 46],
    ['us-mi-035', 47],
    ['us-mi-073', 48],
    ['us-mi-087', 49],
    ['us-mi-099', 50],
    ['us-mi-011', 51],
    ['us-mi-085', 52],
    ['us-mi-133', 53],
    ['us-mi-131', 54],
    ['us-mi-067', 55],
    ['us-mi-157', 56],
    ['us-mi-017', 57],
    ['us-mi-109', 58],
    ['us-mi-081', 59],
    ['us-mi-057', 60],
    ['us-mi-143', 61],
    ['us-mi-121', 62],
    ['us-mi-113', 63],
    ['us-mi-037', 64],
    ['us-mi-065', 65],
    ['us-mi-031', 66],
    ['us-mi-051', 67],
    ['us-mi-111', 68],
    ['us-mi-141', 69],
    ['us-mi-041', 70],
    ['us-mi-053', 71],
    ['us-mi-047', 72],
    ['us-mi-151', 73],
    ['us-mi-013', 74],
    ['us-mi-063', 75],
    ['us-mi-105', 76],
    ['us-mi-083', 77],
    ['us-mi-021', 78],
    ['us-mi-061', 79],
    ['us-mi-125', 80],
    ['us-mi-117', 81],
    ['us-mi-147', 82]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-mi-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-mi-all.js">Michigan</a>'
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
