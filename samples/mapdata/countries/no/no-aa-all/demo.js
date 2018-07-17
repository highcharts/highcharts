// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['no-aa-928', 0],
    ['no-aa-914', 1],
    ['no-aa-911', 2],
    ['no-aa-912', 3],
    ['no-aa-940', 4],
    ['no-aa-901', 5],
    ['no-aa-906', 6],
    ['no-aa-929', 7],
    ['no-aa-904', 8],
    ['no-aa-919', 9],
    ['no-aa-941', 10],
    ['no-aa-926', 11],
    ['no-va-938', 12],
    ['no-aa-937', 13],
    ['no-aa-935', 14]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/no/no-aa-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-aa-all.js">Aust-Agder</a>'
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
