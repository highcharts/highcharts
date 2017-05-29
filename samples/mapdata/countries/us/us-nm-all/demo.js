// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-nm-031', 0],
    ['us-nm-043', 1],
    ['us-nm-045', 2],
    ['us-nm-049', 3],
    ['us-nm-006', 4],
    ['us-nm-028', 5],
    ['us-nm-047', 6],
    ['us-nm-001', 7],
    ['us-nm-023', 8],
    ['us-nm-013', 9],
    ['us-nm-009', 10],
    ['us-nm-007', 11],
    ['us-nm-025', 12],
    ['us-nm-033', 13],
    ['us-nm-041', 14],
    ['us-nm-011', 15],
    ['us-nm-003', 16],
    ['us-nm-029', 17],
    ['us-nm-017', 18],
    ['us-nm-039', 19],
    ['us-nm-061', 20],
    ['us-nm-055', 21],
    ['us-nm-005', 22],
    ['us-nm-027', 23],
    ['us-nm-053', 24],
    ['us-nm-057', 25],
    ['us-nm-037', 26],
    ['us-nm-021', 27],
    ['us-nm-035', 28],
    ['us-nm-019', 29],
    ['us-nm-059', 30],
    ['us-nm-051', 31],
    ['us-nm-015', 32]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-nm-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-nm-all.js">New Mexico</a>'
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
