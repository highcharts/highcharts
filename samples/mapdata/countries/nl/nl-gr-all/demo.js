// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['nl-gr-gm1651', 0],
    ['nl-gr-gm1663', 1],
    ['nl-gr-gm1895', 2],
    ['nl-gr-gm0037', 3],
    ['nl-gr-gm0056', 4],
    ['nl-gr-gm0053', 5],
    ['nl-gr-gm0047', 6],
    ['nl-gr-gm1730', 7],
    ['nl-gr-gm0048', 8],
    ['nl-gr-gm0765', 9],
    ['nl-gr-gm1987', 10],
    ['nl-gr-gm0024', 11],
    ['nl-gr-gm0005', 12],
    ['nl-gr-gm0040', 13],
    ['nl-gr-gm0007', 14],
    ['nl-gr-gm0009', 15],
    ['nl-gr-gm0014', 16],
    ['nl-gr-gm0018', 17],
    ['nl-gr-gm0010', 18],
    ['nl-gr-gm0003', 19],
    ['nl-gr-gm0022', 20],
    ['nl-gr-gm0017', 21],
    ['nl-gr-gm0015', 22],
    ['nl-gr-gm0025', 23]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/nl/nl-gr-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/nl/nl-gr-all.js">Groningen</a>'
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
