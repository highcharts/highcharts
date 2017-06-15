// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-ms-005', 0],
    ['us-ms-037', 1],
    ['us-ms-107', 2],
    ['us-ms-143', 3],
    ['us-ms-119', 4],
    ['us-ms-161', 5],
    ['us-ms-111', 6],
    ['us-ms-041', 7],
    ['us-ms-053', 8],
    ['us-ms-125', 9],
    ['us-ms-047', 10],
    ['us-ms-059', 11],
    ['us-ms-159', 12],
    ['us-ms-007', 13],
    ['us-ms-127', 14],
    ['us-ms-121', 15],
    ['us-ms-011', 16],
    ['us-ms-027', 17],
    ['us-ms-139', 18],
    ['us-ms-117', 19],
    ['us-ms-003', 20],
    ['us-ms-109', 21],
    ['us-ms-035', 22],
    ['us-ms-113', 23],
    ['us-ms-147', 24],
    ['us-ms-103', 25],
    ['us-ms-105', 26],
    ['us-ms-135', 27],
    ['us-ms-021', 28],
    ['us-ms-149', 29],
    ['us-ms-155', 30],
    ['us-ms-077', 31],
    ['us-ms-029', 32],
    ['us-ms-115', 33],
    ['us-ms-071', 34],
    ['us-ms-033', 35],
    ['us-ms-137', 36],
    ['us-ms-039', 37],
    ['us-ms-019', 38],
    ['us-ms-141', 39],
    ['us-ms-131', 40],
    ['us-ms-145', 41],
    ['us-ms-009', 42],
    ['us-ms-157', 43],
    ['us-ms-025', 44],
    ['us-ms-063', 45],
    ['us-ms-013', 46],
    ['us-ms-031', 47],
    ['us-ms-043', 48],
    ['us-ms-083', 49],
    ['us-ms-093', 50],
    ['us-ms-079', 51],
    ['us-ms-101', 52],
    ['us-ms-089', 53],
    ['us-ms-123', 54],
    ['us-ms-153', 55],
    ['us-ms-067', 56],
    ['us-ms-129', 57],
    ['us-ms-091', 58],
    ['us-ms-061', 59],
    ['us-ms-065', 60],
    ['us-ms-073', 61],
    ['us-ms-017', 62],
    ['us-ms-095', 63],
    ['us-ms-081', 64],
    ['us-ms-085', 65],
    ['us-ms-055', 66],
    ['us-ms-163', 67],
    ['us-ms-015', 68],
    ['us-ms-097', 69],
    ['us-ms-051', 70],
    ['us-ms-075', 71],
    ['us-ms-151', 72],
    ['us-ms-133', 73],
    ['us-ms-087', 74],
    ['us-ms-099', 75],
    ['us-ms-045', 76],
    ['us-ms-023', 77],
    ['us-ms-069', 78],
    ['us-ms-001', 79],
    ['us-ms-057', 80],
    ['us-ms-049', 81]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-ms-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-ms-all.js">Mississippi</a>'
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
