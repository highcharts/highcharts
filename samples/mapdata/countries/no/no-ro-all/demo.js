// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['no-ro-1160', 0],
    ['no-ro-1144', 1],
    ['no-ro-1151', 2],
    ['no-ro-1103', 3],
    ['no-ro-1145', 4],
    ['no-ro-1149', 5],
    ['no-ro-1146', 6],
    ['no-ro-1111', 7],
    ['no-ro-1112', 8],
    ['no-ro-1114', 9],
    ['no-ro-1119', 10],
    ['no-ro-1133', 11],
    ['no-ro-1134', 12],
    ['no-ro-1108', 13],
    ['no-ro-1130', 14],
    ['no-ro-1122', 15],
    ['no-ro-1135', 16],
    ['no-ro-1106', 17],
    ['no-ro-1121', 18],
    ['no-ro-1101', 19],
    ['no-ro-1120', 20],
    ['no-ro-1124', 21],
    ['no-ro-1127', 22]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/no/no-ro-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-ro-all.js">Rogaland</a>'
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
