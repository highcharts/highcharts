// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['er-5773', 0],
    ['er-du', 1],
    ['er-gb', 2],
    ['er-an', 3],
    ['er-sk', 4],
    ['er-ma', 5],
    ['er-dk', 6]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/er/er-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/er/er-all.js">Eritrea</a>'
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
