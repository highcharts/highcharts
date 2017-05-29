// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['hr-5926', 0],
    ['hr-sb', 1],
    ['hr-zd', 2],
    ['hr-pg', 3],
    ['hr-ka', 4],
    ['hr-kz', 5],
    ['hr-zg', 6],
    ['hr-gz', 7],
    ['hr-va', 8],
    ['hr-is', 9],
    ['hr-2228', 10],
    ['hr-ob', 11],
    ['hr-sp', 12],
    ['hr-vs', 13],
    ['hr-vp', 14],
    ['hr-kk', 15],
    ['hr-me', 16],
    ['hr-dn', 17],
    ['hr-sd', 18],
    ['hr-ls', 19],
    ['hr-sm', 20],
    ['hr-bb', 21]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/hr/hr-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/hr/hr-all.js">Croatia</a>'
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
