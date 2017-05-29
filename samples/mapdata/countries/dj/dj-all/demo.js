// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['dj-5766', 0],
    ['dj-db', 1],
    ['dj-1166', 2],
    ['dj-as', 3],
    ['dj-dk', 4],
    ['dj-ob', 5],
    ['dj-ta', 6]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/dj/dj-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/dj/dj-all.js">Djibouti</a>'
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
