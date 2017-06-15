// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['no-he-441', 0],
    ['no-he-439', 1],
    ['no-he-438', 2],
    ['no-he-437', 3],
    ['no-he-436', 4],
    ['no-he-434', 5],
    ['no-he-430', 6],
    ['no-he-428', 7],
    ['no-he-423', 8],
    ['no-he-432', 9],
    ['no-he-402', 10],
    ['no-he-427', 11],
    ['no-he-403', 12],
    ['no-he-429', 13],
    ['no-he-415', 14],
    ['no-he-420', 15],
    ['no-he-417', 16],
    ['no-he-425', 17],
    ['no-he-412', 18],
    ['no-he-426', 19],
    ['no-he-418', 20],
    ['no-he-419', 21]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/no/no-he-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-he-all.js">Hedmark</a>'
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
