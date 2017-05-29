// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['al-vr', 0],
    ['al-ke', 1],
    ['al-du', 2],
    ['al-fi', 3],
    ['al-sd', 4],
    ['al-kk', 5],
    ['al-be', 6],
    ['al-eb', 7],
    ['al-gk', 8],
    ['al-db', 9],
    ['al-lz', 10],
    ['al-ti', 11]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/al/al-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/al/al-all.js">Albania</a>'
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
