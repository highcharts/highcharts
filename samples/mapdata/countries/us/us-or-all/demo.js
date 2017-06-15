// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-or-057', 0],
    ['us-or-055', 1],
    ['us-or-035', 2],
    ['us-or-029', 3],
    ['us-or-047', 4],
    ['us-or-071', 5],
    ['us-or-013', 6],
    ['us-or-025', 7],
    ['us-or-053', 8],
    ['us-or-041', 9],
    ['us-or-065', 10],
    ['us-or-045', 11],
    ['us-or-049', 12],
    ['us-or-023', 13],
    ['us-or-061', 14],
    ['us-or-063', 15],
    ['us-or-001', 16],
    ['us-or-031', 17],
    ['us-or-019', 18],
    ['us-or-033', 19],
    ['us-or-005', 20],
    ['us-or-011', 21],
    ['us-or-051', 22],
    ['us-or-037', 23],
    ['us-or-069', 24],
    ['us-or-067', 25],
    ['us-or-015', 26],
    ['us-or-059', 27],
    ['us-or-007', 28],
    ['us-or-027', 29],
    ['us-or-039', 30],
    ['us-or-009', 31],
    ['us-or-043', 32],
    ['us-or-003', 33],
    ['us-or-017', 34],
    ['us-or-021', 35]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-or-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-or-all.js">Oregon</a>'
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
