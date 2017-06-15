// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['cm-es', 0],
    ['cm-ad', 1],
    ['cm-nw', 2],
    ['cm-no', 3],
    ['cm-ce', 4],
    ['cm-ou', 5],
    ['cm-en', 6],
    ['cm-sw', 7],
    ['cm-lt', 8],
    ['cm-su', 9]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/cm/cm-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/cm/cm-all.js">Cameroon</a>'
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
