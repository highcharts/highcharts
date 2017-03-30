// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-wa-075', 0],
    ['us-wa-043', 1],
    ['us-wa-069', 2],
    ['us-wa-057', 3],
    ['us-wa-053', 4],
    ['us-wa-031', 5],
    ['us-wa-067', 6],
    ['us-wa-027', 7],
    ['us-wa-065', 8],
    ['us-wa-073', 9],
    ['us-wa-047', 10],
    ['us-wa-049', 11],
    ['us-wa-055', 12],
    ['us-wa-019', 13],
    ['us-wa-021', 14],
    ['us-wa-001', 15],
    ['us-wa-003', 16],
    ['us-wa-035', 17],
    ['us-wa-045', 18],
    ['us-wa-041', 19],
    ['us-wa-013', 20],
    ['us-wa-029', 21],
    ['us-wa-011', 22],
    ['us-wa-037', 23],
    ['us-wa-017', 24],
    ['us-wa-023', 25],
    ['us-wa-015', 26],
    ['us-wa-071', 27],
    ['us-wa-005', 28],
    ['us-wa-061', 29],
    ['us-wa-007', 30],
    ['us-wa-033', 31],
    ['us-wa-025', 32],
    ['us-wa-063', 33],
    ['us-wa-051', 34],
    ['us-wa-009', 35],
    ['us-wa-059', 36],
    ['us-wa-039', 37],
    ['us-wa-077', 38]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-wa-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-wa-all.js">Washington</a>'
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
