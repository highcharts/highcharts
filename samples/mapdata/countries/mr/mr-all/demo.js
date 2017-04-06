// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['mr-4965', 0],
    ['mr-dn', 1],
    ['mr-in', 2],
    ['mr-no', 3],
    ['mr-br', 4],
    ['mr-tr', 5],
    ['mr-as', 6],
    ['mr-gd', 7],
    ['mr-go', 8],
    ['mr-ad', 9],
    ['mr-hc', 10],
    ['mr-hg', 11],
    ['mr-tg', 12],
    ['mr-tz', 13]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/mr/mr-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/mr/mr-all.js">Mauritania</a>'
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
