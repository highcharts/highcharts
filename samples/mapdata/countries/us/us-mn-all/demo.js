// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-mn-051', 0],
    ['us-mn-149', 1],
    ['us-mn-019', 2],
    ['us-mn-143', 3],
    ['us-mn-151', 4],
    ['us-mn-169', 5],
    ['us-mn-045', 6],
    ['us-mn-005', 7],
    ['us-mn-057', 8],
    ['us-mn-173', 9],
    ['us-mn-041', 10],
    ['us-mn-121', 11],
    ['us-mn-077', 12],
    ['us-mn-007', 13],
    ['us-mn-037', 14],
    ['us-mn-131', 15],
    ['us-mn-147', 16],
    ['us-mn-013', 17],
    ['us-mn-161', 18],
    ['us-mn-033', 19],
    ['us-mn-127', 20],
    ['us-mn-081', 21],
    ['us-mn-135', 22],
    ['us-mn-089', 23],
    ['us-mn-113', 24],
    ['us-mn-159', 25],
    ['us-mn-111', 26],
    ['us-mn-153', 27],
    ['us-mn-097', 28],
    ['us-mn-021', 29],
    ['us-mn-101', 30],
    ['us-mn-167', 31],
    ['us-mn-155', 32],
    ['us-mn-165', 33],
    ['us-mn-053', 34],
    ['us-mn-079', 35],
    ['us-mn-065', 36],
    ['us-mn-059', 37],
    ['us-mn-115', 38],
    ['us-mn-063', 39],
    ['us-mn-011', 40],
    ['us-mn-107', 41],
    ['us-mn-055', 42],
    ['us-mn-099', 43],
    ['us-mn-109', 44],
    ['us-mn-047', 45],
    ['us-mn-039', 46],
    ['us-mn-093', 47],
    ['us-mn-171', 48],
    ['us-mn-073', 49],
    ['us-mn-067', 50],
    ['us-mn-023', 51],
    ['us-mn-137', 52],
    ['us-mn-105', 53],
    ['us-mn-071', 54],
    ['us-mn-049', 55],
    ['us-mn-025', 56],
    ['us-mn-003', 57],
    ['us-mn-015', 58],
    ['us-mn-083', 59],
    ['us-mn-133', 60],
    ['us-mn-117', 61],
    ['us-mn-163', 62],
    ['us-mn-069', 63],
    ['us-mn-029', 64],
    ['us-mn-119', 65],
    ['us-mn-043', 66],
    ['us-mn-145', 67],
    ['us-mn-009', 68],
    ['us-mn-095', 69],
    ['us-mn-141', 70],
    ['us-mn-123', 71],
    ['us-mn-129', 72],
    ['us-mn-085', 73],
    ['us-mn-017', 74],
    ['us-mn-075', 75],
    ['us-mn-001', 76],
    ['us-mn-091', 77],
    ['us-mn-027', 78],
    ['us-mn-087', 79],
    ['us-mn-157', 80],
    ['us-mn-031', 81],
    ['us-mn-103', 82],
    ['us-mn-125', 83],
    ['us-mn-061', 84],
    ['us-mn-035', 85],
    ['us-mn-139', 86]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-mn-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-mn-all.js">Minnesota</a>'
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
