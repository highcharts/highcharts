// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['cd-bc', 0],
    ['cd-kv', 1],
    ['cd-eq', 2],
    ['cd-hc', 3],
    ['cd-bn', 4],
    ['cd-kn', 5],
    ['cd-kr', 6],
    ['cd-kt', 7],
    ['cd-kc', 8],
    ['cd-1694', 9],
    ['cd-1697', 10]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/cd/cd-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/cd/cd-all.js">Democratic Republic of the Congo</a>'
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
