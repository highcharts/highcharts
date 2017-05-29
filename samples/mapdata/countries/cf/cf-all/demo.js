// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['cf-vk', 0],
    ['cf-hk', 1],
    ['cf-hm', 2],
    ['cf-mb', 3],
    ['cf-bg', 4],
    ['cf-mp', 5],
    ['cf-lb', 6],
    ['cf-hs', 7],
    ['cf-op', 8],
    ['cf-se', 9],
    ['cf-nm', 10],
    ['cf-kg', 11],
    ['cf-kb', 12],
    ['cf-bk', 13],
    ['cf-uk', 14],
    ['cf-ac', 15],
    ['cf-bb', 16]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/cf/cf-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/cf/cf-all.js">Central African Republic</a>'
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
