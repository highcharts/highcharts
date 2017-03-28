// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['no-bu-620', 0],
    ['no-bu-617', 1],
    ['no-bu-605', 2],
    ['no-bu-615', 3],
    ['no-bu-627', 4],
    ['no-bu-604', 5],
    ['no-bu-622', 6],
    ['no-bu-623', 7],
    ['no-bu-602', 8],
    ['no-bu-621', 9],
    ['no-bu-626', 10],
    ['no-bu-612', 11],
    ['no-bu-618', 12],
    ['no-bu-624', 13],
    ['no-bu-632', 14],
    ['no-bu-628', 15],
    ['no-bu-631', 16],
    ['no-bu-633', 17],
    ['no-bu-616', 18],
    ['no-bu-619', 19],
    ['no-bu-625', 20]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/no/no-bu-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-bu-all.js">Buskerud</a>'
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
